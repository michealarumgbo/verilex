import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    sessionId: {
      type: String,
      unique: true,
      required: true,
    },
    sessionExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    status: {
      type: String,
      eunm: ["active", "closed", "pending"],
      default: "pending",
    },
    closedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
