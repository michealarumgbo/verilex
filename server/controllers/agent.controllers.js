import { STATUS_CODE } from "../constants.js";
import { NotFoundError } from "../errors";
import Chat from "../models/Chat.js";

// Get pending chats - (agent and admin)
export const getPendingChat = async (req, res) => {
  // fetch all chats that are pending
  const pendingChats = await Chat.find({ status: "pending", agentId: null });

  return res.status(STATUS_CODE.SUCCESS).json({ pendingChats });
};
// Accept chat
export const acceptChat = async (req, res) => {
  // extract user data - agent
  const user = req.user;

  //   extract chat id
  const chatId = req.params.chatId;

  const chat = await Chat.findOneAndUpdate(
    {
      _id: chatId,
      status: "pending",
      agentId: null,
    },
    {
      $set: {
        status: "active",
        agentId: user._id,
      },
    },
    { new: true },
  );

  if (!chat) {
    throw NotFoundError("Chat has already been accepted or does not exist");
  }

  res.status(STATUS_CODE.SUCCESS).json({
    message: "Chat request accepted",
    chat,
  });
};
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
// Get closed chats - admin only
export const getClosedChat = async (req, res) => {
  const closedChats = await Chat.find({
    status: "closed",
  })
    .populate("guestId", "firstname lastname email")
    .populate("agentId", "firstname lastname email")
    .sort({ updatedAt: -1 });

  return res.status(STATUS_CODE.SUCCESS).json({ closedChats });
};
