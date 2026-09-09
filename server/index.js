import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { dbConnect } from "./config/database.js";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";
import chatRouter from "./routes/chat.route.js";
import cookieParser from "cookie-parser";
import { registerSocketHandlers } from "./sockets/sockets.js";

dotenv.config();

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : ["http://localhost:5173"],
  }),
);

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/chats", chatRouter);

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
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : ["http://localhost:5173"],
    credentials: true,
  },
});

app.set("io", io);

registerSocketHandlers(io);
