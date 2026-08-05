import express from "express";
import dotenv from "dotenv";
import { auth } from "../middlewares/auth.middleware.js";
import { authorise } from "../middlewares/authorise.middleware.js";
import {
  activateAgent,
  getAgents,
  getClosedChats,
  getGuests,
  getUser,
  registerAgent,
  suspendAgent,
} from "../controllers/admin.controller.js";

dotenv.config();

const router = express.Router();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

router.post("/agents", auth(ACCESS_SECRET), authorise("admin"), registerAgent);
router.patch(
  "/agents/:agentId/suspend",
  auth(ACCESS_SECRET),
  authorise("admin"),
  suspendAgent,
);
router.patch(
  "/agents/:agentId/activate",
  auth(ACCESS_SECRET),
  authorise("admin"),
  activateAgent,
);

router.get("/agents", auth(ACCESS_SECRET), authorise("admin"), getAgents);
router.get("/guests", auth(ACCESS_SECRET), authorise("admin"), getGuests);
router.get("/users/:userId", auth(ACCESS_SECRET), authorise("admin"), getUser);
router.get(
  "/chats/closed",
  auth(ACCESS_SECRET),
  authorise("admin"),
  getClosedChats,
);

export default router;
