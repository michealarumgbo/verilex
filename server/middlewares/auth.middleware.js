import { UnauthourizedError } from "../errors.js";
import User from "../models/User.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";

dotenv.config();

export const auth = (secret_key = process.env.JWT_ACCESS_SECRET) => {
  return async (req, res, next) => {
    // get token
    const token = req.signedCookies.accessToken;
    if (!token) {
      throw UnauthourizedError("Access token required");
    }

    // verify token
    const payload = jwt.verify(token, secret_key);
    if (!payload || !payload.id) {
      throw UnauthourizedError("Invalid or expired token");
    }

    // fetch user
    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      throw NotFoundError("User no longer exists");
    }

    // check if user logged in
    const isLoggedIn = await RefreshToken.findOne({
      user: payload.id,
    }).select("token");

    if (!isLoggedIn || !isLoggedIn.token) {
      throw UnauthourizedError("User is already logged out");
    }

    // append user to req object
    req.user = user;
    next();
  };
};

// auth for refresh token
export const authRefreshToken = (
  secret_key = process.env.JWT_REFRESH_SECRET,
) => {
  return async (req, res, next) => {
    // get token
    const token = req.signedCookies.refreshToken;
    if (!token) {
      throw UnauthourizedError("Refresh token required");
    }

    // verify token
    const payload = jwt.verify(token, secret_key);
    if (!payload || !payload.id) {
      throw UnauthourizedError("Invalid or expired token");
    }

    // fetch user
    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      throw NotFoundError("User no longer exists");
    }

    // check if user logged in
    const refreshToken = await RefreshToken.findOne({
      user: payload.id,
      token,
    });

    if (!refreshToken) {
      throw UnauthourizedError("Invalid refresh token or user logged out");
    }

    // append user to req object
    req.user = user;
    next();
  };
};
