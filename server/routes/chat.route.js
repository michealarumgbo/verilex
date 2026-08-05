import express from "express";
import dotenv from "dotenv";
import { auth } from "../middlewares/auth.middleware.js";
import { authorise } from "../middlewares/authorise.middleware.js";
import {
  acceptChat,
  getActiveChat,
  getPendingChat,
} from "../controllers/chat.controller.js";

dotenv.config();

const router = express.Router();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

router.get(
  "/pending",
  auth(ACCESS_SECRET),
  authorise("agent", "admin"),
  getPendingChat,
);

router.patch(
  "/:chatId/accept",
  auth(ACCESS_SECRET),
  authorise("agent"),
  acceptChat,
);

router.get("/active", auth(ACCESS_SECRET), authorise("agent"), getActiveChat);

export default router;
