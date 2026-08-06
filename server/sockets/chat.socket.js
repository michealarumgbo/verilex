import Chat from "../models/Chat.js";

export default function registerChatEvents(io, socket) {
  socket.on("accept-chat", async ({ chatId }) => {
    try {
      const user = socket.user;

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
        return socket.emit("accept-chat-error", {
          message: "Chat has already been accepted or doesn't exist.",
        });
      }

      const room = `chat:${chat._id.toString()}`;
      socket.join(room);

      io.to(room).emit("request-accepted", {
        chatId: chat._id,
        agentName: `${user.firstname} ${user.lastname}`,
      });

      io.to("agents").emit("chat-assigned", {
        chatId: chat._id,
        agentId: user._id,
      });

      socket.emit("accept-chat-success", {
        chatId: chat._id,
      });
    } catch (error) {
      console.log(error);
      socket.emit("accept-chat-error", {
        message: "Something went wrong.",
      });
    }
  });

  socket.on("close-chat-guest", async () => {
    try {
      const sessionId = socket.sessionId;
      const chat = await Chat.findOne({
        sessionId: sessionId,
        status: { $ne: "closed" },
        sessionExpiresAt: { $gt: new Date() },
      });

      if (!chat) {
        return socket.emit(
          "close-chat-error",
          "Chat dosen't exist or is already closed",
        );
      }
      chat.status = "closed";
      chat.closedAt = new Date();
      chat.sessionId = null;
      chat.sessionExpiresAt = null;
      await chat.save();

      const room = `chat:${chat._id.toString()}`;

      io.to(room).emit("chat-closed", "Chat closed successfully");
      return socket.leave(room);
    } catch (error) {
      console.log(error);
      socket.emit("close-chat-error", {
        message: "Something went wrong.",
      });
    }
  });

  socket.on("close-chat-agent", async ({ chatId }) => {
    const user = socket.user;

    try {
      // search for chat
      const chat = await Chat.findOne({
        _id: chatId,
        agentId: user._id,
        sessionExpiresAt: { $gt: new Date() },
        status: { $ne: "closed" },
      });

      if (!chat) {
        return socket.emit(
          "close-chat-error",
          "Chat dosen't exist or is already closed",
        );
      }
      chat.status = "closed";
      chat.closedAt = new Date();
      chat.sessionId = null;
      chat.sessionExpiresAt = null;
      await chat.save();
      const room = `chat:${chat._id.toString()}`;

      io.to(room).emit("chat-closed", "Chat closed successfully");
      return socket.leave(room);
    } catch (error) {
      console.log(error);
      socket.emit("close-chat-error", {
        message: "Something went wrong.",
      });
    }
  });
}
