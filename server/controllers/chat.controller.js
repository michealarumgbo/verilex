import { STATUS_CODE } from "../constants.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthourizedError,
} from "../errors.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { chatSchema } from "../validation/chat.validate.js";

// Get pending chats - (agent and admin)
export const getPendingChat = async (req, res) => {
  // fetch all chats that are pending
  const pendingChats = await Chat.find({ status: "pending", agentId: null });

  return res.status(STATUS_CODE.SUCCESS).json({ pendingChats });
};

// Accept chat
// export const acceptChat = async (req, res) => {
//   // extract user data - agent
//   const user = req.user;

//   //   extract chat id
//   const chatId = req.params.chatId;

//   const chat = await Chat.findOneAndUpdate(
//     {
//       _id: chatId,
//       status: "pending",
//       agentId: null,
//     },
//     {
//       $set: {
//         status: "active",
//         agentId: user._id,
//       },
//     },
//     { new: true },
//   );

//   if (!chat) {
//     throw NotFoundError("Chat has already been accepted or does not exist");
//   }

//   const room = `chat:${chat._id.toString()}`;
//   socket.join(room);

//   io.to(room).emit("request-accepted", {
//     agentName: `${user.firstname} ${user.lastname}`,
//   });

//   return res.status(STATUS_CODE.SUCCESS).json({
//     message: "Chat request accepted",
//     chat,
//   });
// };

// Get active chats - agent only
export const getActiveChat = async (req, res) => {
  // extract user data - agent
  const user = req.user;

  const activeChats = await Chat.find({
    status: "active",
    agentId: user._id,
  }).populate("guestId", "firstname lastname email");

  return res.status(STATUS_CODE.SUCCESS).json({ activeChats });
};

// close chat - agent or guest
// export const closeChat = async (req, res) => {
//   let chat;
//   // get chat id or session id
//   if (req.params.sessionId) {
//     const sessionId = req.params.sessionId;
//     chat = await Chat.findOne({
//       sessionId: sessionId,
//       status: { $ne: "closed" },
//       sessionExpiresAt: { $gt: new Date() },
//     });
//   } else {
//     const user = req.user;
//     const chatId = req.params.chatId;

//     // search for chat
//     chat = await Chat.findOne({
//       _id: chatId,
//       agentId: user._id,
//       sessionExpiresAt: { $gt: new Date() },
//       status: { $ne: "closed" },
//     });
//   }

//   if (!chat) {
//     throw NotFoundError("Chat is dosen't exist or is already closed");
//   }

//   chat.status = "closed";
//   chat.closedAt = new Date();
//   chat.sessionId = null;
//   chat.sessionExpiresAt = null;
//   await chat.save();

//   return res
//     .status(STATUS_CODE.SUCCESS)
//     .json({ message: "Chat closed successfully" });
// };

// create chat together with guest user
export const createChat = async (req, res) => {
  // extract data
  const { firstname, lastname, email } = chatSchema.parse(req.body);

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      firstname,
      lastname,
      email,
      role: "guest",
      mustChangePassword: false,
    });
  } else {
    user.firstname = firstname;
    user.lastname = lastname;
    await user.save();
  }

  //   create session Id
  const sessionId = crypto.randomUUID();

  //   create chat
  const chat = await Chat.create({
    guestId: user._id,
    sessionId,
  });

  res.cookie("chatSession", sessionId, {
    maxAge: 24 * 60 * 60 * 1000, // expires in 1 day
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  const io = req.app.get("io");

  io.to("agents").emit("new-chat-request", {
    chatId: chat._id,
    guestName: `${user.firstname} ${user.lastname}`,
    createdAt: chat.createdAt,
  });

  return res.status(STATUS_CODE.CREATED).json({
    message: "Chat request has been placed",
  });
};

// get chat - guest
export const getGuestChat = async (req, res) => {
  const sessionId = req.signedCookies.chatSession;

  // search for chat
  const chat = await Chat.findOne({
    sessionId,
    status: { $ne: "closed" },
    sessionExpiresAt: { $gt: new Date() },
  }).populate("guestId");

  if (!chat) {
    throw NotFoundError("Unable to find an active chat for this session.");
  }

  const messages = await Message.find({
    chatId: chat._id,
  }).sort({ createdAt: 1 });

  return res.status(STATUS_CODE.SUCCESS).json({ chat, messages });
};

// get chat - agents
export const getAgentChat = async (req, res) => {
  const user = req.user;
  const chatId = req.params.chatId;

  // search for chat
  const chat = await Chat.findOne({
    _id: chatId,
    agentId: user._id,
    sessionExpiresAt: { $gt: new Date() },
  }).populate("guestId");

  if (!chat) {
    throw UnauthourizedError(
      "Chat dosen't exists or you don't have permission to this chat",
    );
  }

  const messages = await Message.find({
    chatId: chat._id,
  }).sort({ createdAt: 1 });

  return res.status(STATUS_CODE.SUCCESS).json({ chat, messages });
};

// get chat - admin
export const getAdminChat = async (req, res) => {
  const chatId = req.params.chatId;

  // search for chat
  const chat = await Chat.findOne({
    _id: chatId,
    status: "closed",
  })
    .populate("guestId")
    .populate("agentId");

  if (!chat) {
    throw NotFoundError("Chat dosen't exists or is still active");
  }

  // fetch messages
  const messages = await Message.find({
    chatId: chat._id,
  }).sort({ createdAt: 1 });

  return res.status(STATUS_CODE.SUCCESS).json({ chat, messages });
};
