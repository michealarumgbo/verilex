import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

const expressServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? false : ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // broadcast typing activity to other users
  socket.on("keydown", (name) => {
    socket.broadcast.emit("keydown", name);
  });

  // recieve message request
  socket.on("send-message", (data) => {
    io.emit("message", data);
  });

  socket.on("to-room", (data) => {
    console.log(data);
    socket.emit("message", data);
    socket.to(data.roomId).emit("message", data);
  });

  // join a group
  socket.on("join-group", (group) => {
    socket.join(group);
    socket.emit("chat-notification", {
      message: `You joined ${group}`,
      senderId: "inChatNotification",
    });
    socket.to(group).emit("chat-notification", {
      message: `${socket.id} joined ${group}`,
      senderId: "inChatNotification",
    });
  });
});
