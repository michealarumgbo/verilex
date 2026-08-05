import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import {
  generatePassword,
  newAccessToken,
  newRefreshToken,
} from "../utils/functions.js";
import {
  loginSchema,
  updatePasswordSchema,
} from "../validation/auth.validate.js";
import z from "zod";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors.js";
import bcrypt from "bcrypt";
import { STATUS_CODE } from "../constants.js";

// login - (agent & admin)
export const login = async (req, res) => {
  // parse the input for validation
  const { email, password } = login.parse(req.body);

  //   check if agent already exists
  const user = await User.findOne({ email });
  if (!user) {
    throw NotFoundError("Invalid Email or Password");
  }

  //   compare password
  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) {
    throw NotFoundError("Invalid Email or Password");
  }

  // check account status
  if (user.status != "active") {
    throw UnAuthenticatedError("This account has been suspended");
  }

  //   generate tokens
  const accessToken = newAccessToken({ _id: user._id, email: user.email });
  const refreshToken = newRefreshToken({ _id: user._id, email: user.email });

  //   store in Refresh Token
  let refreshTokenData = await RefreshToken.findOne({ user: user._id });
  if (refreshTokenData) {
    refreshTokenData.token = refreshToken;
  } else {
    refreshTokenData = new RefreshToken({
      token: refreshToken,
      user: user._id,
    });
  }
  await refreshTokenData.save();

  const userData = user.toObject();
  delete userData.password;

  return res.status(STATUS_CODE.SUCCESS).json({
    message: "User logged in successfully",
    user: { ...userData, accessToken, refreshToken },
  });
};

// logout - (agent & admin)
export const logout = async (req, res) => {
  await RefreshToken.updateOne({ user: user._id }, { token: "" });
  return res
    .status(STATUS_CODE.SUCCESS)
    .json({ message: "User logged out successfully" });
};

// new access token - (all users)
export const refreshAccessToken = async (req, res) => {
  const accessToken = newAccessToken(user);
  return res.status(STATUS_CODE.SUCCESS).json({
    message: "New Token Generated Successfully",
    token: accessToken,
  });
};

// change password
export const updatePassword = async (req, res) => {
  const user = req.user;

  const { password } = updatePasswordSchema.parse(req.body);

  const hashedPassword = await bcrypt.hash(password, 13);

  await User.findByIdAndUpdate(user._id, { password: hashedPassword });

  return res
    .status(STATUS_CODE)
    .json({ message: "Password updated successfully" });
};

// get profile
export const getMe = async (req, res) => {
  const user = req.user;

  return res.status(STATUS_CODE.SUCCESS).json({ user });
};
