import registerChatEvents from "./chat.socket.js";
import registerMessageEvents from "./message.socket.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import { parseCookie } from "cookie";
import signature from "cookie-signature";

export const registerSocketHandlers = (io) => {
  io.use(async (socket, next) => {
    try {
      if (socket.handshake.headers.cookie) {
        const rawCookies = socket.handshake.headers.cookie;

        if (!rawCookies) {
          return next(new Error("Authentication required"));
        }

        const cookies = parseCookie(rawCookies);

        if (cookies?.accessToken) {
          const signedAccessToken = cookies.accessToken;

          if (!signedAccessToken || !signedAccessToken.startsWith("s:")) {
            return next(new Error("Invalid Token"));
          }
          const accessToken = signature.unsign(
            signedAccessToken.slice(2),
            process.env.COOKIE_SECRET,
          );

          if (!accessToken) {
            return next(new Error("Invalid access token"));
          }

          const payload = jwt.verify(accessToken, process.env.ACCESS_SECRET);

          if (!payload || !payload.id) {
            return next(new Error("Invalid or expired token"));
          }

          const user = await User.findById(payload.id).select("-password");

          if (!user) {
            return next(new Error("User not found"));
          }
          const signedRefreshToken = cookies.refreshToken;

          if (!signedRefreshToken?.startsWith("s:")) {
            return next(new Error("Invalid refresh token"));
          }

          const refreshToken = signature.unsign(
            signedRefreshToken.slice(2),
            process.env.COOKIE_SECRET,
          );

          if (!refreshToken) {
            return next(new Error("Invalid refresh token"));
          }

          const refreshTokenData = await RefreshToken.findOne({
            user: payload.id,
            token: refreshToken,
          });

          if (!refreshTokenData) {
            return next(new Error("User is already logged out"));
          }
          socket.user = user;
        }

        if (cookies?.chatSession) {
          const signedCookie = cookies.chatSession;

          if (!signedCookie || !signedCookie.startsWith("s:")) {
            return next(new Error("Invalid session"));
          }

          const sessionId = signature.unsign(
            signedCookie.slice(2),
            process.env.COOKIE_SECRET,
          );

          if (!sessionId) {
            return next(new Error("Invalid session"));
          }

          const chat = await Chat.findOne({
            sessionId,
            status: { $ne: "closed" },
            sessionExpiresAt: { $gt: new Date() },
          });

          if (!chat) {
            return next(new Error("Session expired"));
          }

          socket.sessionId = sessionId;
        }
      } else {
        return next(new Error("Authentication is needed"));
      }

      return next();
    } catch (err) {
      console.log(err);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    if (socket.user?.role == "agent") {
      console.log("Agent Connected: ", socket.id);
      socket.join("agents");
    } else if (socket.user?.role == "admin") {
      console.log("Admin Connected: ", socket.id);
      socket.join("admin");
      socket.join("agents");
    } else {
      console.log("Guest Connected: ", socket.id);
    }

    registerChatEvents(io, socket);
    registerMessageEvents(io, socket);
  });
};
