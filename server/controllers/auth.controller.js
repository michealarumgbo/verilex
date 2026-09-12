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

const accessCookieOptions = {
  maxAge: 60 * 60 * 1000,
  signed: true,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
};
const refreshCookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  signed: true,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
};

// login - (agent & admin)
export const login = async (req, res) => {
  // parse the input for validation
  const { email, password } = loginSchema.parse(req.body);

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

  // send cookies
  res
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie("refreshToken", refreshToken, refreshCookieOptions);

  return res.status(STATUS_CODE.SUCCESS).json({
    message: "User logged in successfully",
    user: { ...userData },
  });
};

// logout - (agent & admin)
export const logout = async (req, res) => {
  const user = req.user;
  await RefreshToken.deleteOne({ user: user._id });
  res.clearCookie("accessToken", accessCookieOptions);
  res.clearCookie("refreshToken", refreshCookieOptions);
  return res
    .status(STATUS_CODE.SUCCESS)
    .json({ message: "User logged out successfully" });
};

// new access token - (admins/agents)
export const refreshAccessToken = async (req, res) => {
  const user = req.user;
  const accessToken = newAccessToken(user);
  const refreshToken = newRefreshToken(user);

  // set cookies
  res
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie("refreshToken", refreshToken, refreshCookieOptions);

  await RefreshToken.updateOne({ user: user._id }, { token: refreshToken });
  return res.status(STATUS_CODE.SUCCESS).json({
    message: "New Token Generated Successfully",
    user: {
      accessToken,
      refreshToken,
    },
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
