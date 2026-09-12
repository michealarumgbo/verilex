import express from "express";
// import dotenv from "dotenv";
import { auth, authRefreshToken } from "../middlewares/auth.middleware.js";
import { authorise } from "../middlewares/authorise.middleware.js";
import {
  getMe,
  login,
  logout,
  refreshAccessToken,
  updatePassword,
} from "../controllers/auth.controller.js";

// dotenv.config();

const router = express.Router();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

router.post("/login", login);
router.post(
  "/token/refresh",
  authRefreshToken(REFRESH_SECRET),
  refreshAccessToken,
);
router.post("/password/reset", auth(ACCESS_SECRET), updatePassword);
router.get("/me", auth(ACCESS_SECRET), getMe);
router.post("/logout", auth(ACCESS_SECRET), logout);

export default router;
