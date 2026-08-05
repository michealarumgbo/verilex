import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { dbConnect } from "./config/database.js";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";
import chatRouter from "./routes/chat.route.js";

dotenv.config();

const app = express();

// routes
app.use("/verilex/api/v1/auth", authRouter);
app.use("/verilex/api/v1/admin", adminRouter);
app.use("/verilex/api/v1/chats", chatRouter);

const PORT = process.env.PORT || 3030;

const startServer = async () => {
  await dbConnect();

  return app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

const expressServer = await startServer();

const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? false : ["http://localhost:5173"],
  },
});
