import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// access token function
export const newAccessToken = (user = {}) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1h" },
  );
};

// refresh token function
export const newRefreshToken = (user = {}) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
};

// generate password - 8 chars length
export const generatePassword = () => {
  return crypto.randomBytes(4).toString("hex");
};
