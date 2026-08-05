import { regSchema } from "../validation/auth.validate.js";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import { BadRequestError, NotFoundError } from "../errors.js";
import { generatePassword } from "../utils/functions.js";
import bcrypt from "bcrypt";
import { STATUS_CODE } from "../constants.js";

// register agent
export const registerAgent = async (req, res) => {
  // parse the input for validation
  const { firstname, lastname, email } = regSchema.parse(req.body);

  //   check if agent already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw BadRequestError("User already exists");
  }
  const password = generatePassword();
  //   hash password
  const hashedPassword = await bcrypt.hash(password, 13);

  const agent = new User({
    firstname,
    lastname,
    password: hashedPassword,
    email,
    mustChangePassword: true,
    role: "agent",
  });

  await agent.save();

  const agentData = agent.toObject();
  delete agentData.password;

  return res
    .status(STATUS_CODE.CREATED)
    .json({ message: "Agent created successfully", agent: agentData });
};

// suspend agent
export const suspendAgent = async (req, res) => {
  const agentId = req.params.agentId;

  const agent = await User.findOneAndUpdate(
    { role: "agent", _id: agentId, status: "active" },
    { status: "inactive" },
  );

  if (!agent) {
    throw NotFoundError("Agent not found or already suspended");
  }

  return res
    .status(STATUS_CODE.SUCCESS)
    .json({ message: "Agent suspended successfully" });
};

// activate agent
export const activateAgent = async (req, res) => {
  const agentId = req.params.agentId;

  const agent = await User.findOneAndUpdate(
    { role: "agent", _id: agentId, status: "inactive" },
    { status: "active" },
  );

  if (!agent) {
    throw NotFoundError("Agent not found or already active");
  }

  return res
    .status(STATUS_CODE.SUCCESS)
    .json({ message: "Agent activated successfully" });
};

// get all agents
export const getAgents = async (req, res) => {
  const agents = await User.find({ role: "agent" });

  return res.status(STATUS_CODE.SUCCESS).json({ agents });
};
// get all guests
export const getGuests = async (req, res) => {
  const guests = await User.find({ role: "guest" });

  return res.status(STATUS_CODE.SUCCESS).json({ guests });
};

// get user profile
export const getUser = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findOne({
    _id: userId,
    role: { $ne: "admin" },
  }).select("-password");

  if (!user) {
    throw NotFoundError("User not found");
  }

  return res.status(STATUS_CODE.SUCCESS).json({ user });
};

// Get closed chats - admin only
export const getClosedChats = async (req, res) => {
  const closedChats = await Chat.find({
    status: "closed",
  })
    .populate("guestId", "firstname lastname email")
    .populate("agentId", "firstname lastname email")
    .sort({ updatedAt: -1 });

  return res.status(STATUS_CODE.SUCCESS).json({ closedChats });
};
