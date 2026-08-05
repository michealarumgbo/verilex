import express from "express";
import dotenv from "dotenv";
import { auth } from "../middlewares/auth.middleware.js";
import { authorise } from "../middlewares/authorise.middleware.js";
import {
  acceptChat,
  getActiveChat,
  getPendingChat,
  closeChat,
  createChat,
  getGuestChat,
  getAgentChat,
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
router.patch(
  "/:chatId/close",
  auth(ACCESS_SECRET),
  authorise("agent"),
  closeChat,
);
router.patch("/session/:sessionId/close", closeChat);

router.post("/", createChat);

router.get("/active", auth(ACCESS_SECRET), authorise("agent"), getActiveChat);
router.get("/session/:sessionId", getGuestChat);
router.get("/:chatId", auth(ACCESS_SECRET), authorise("agent"), getAgentChat);

export default router;
