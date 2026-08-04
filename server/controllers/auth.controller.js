import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import {
  generatePassword,
  newAccessToken,
  newRefreshToken,
} from "../utils/functions.js";
import { loginSchema, regSchema } from "../validation/auth.validate.js";
import z from "zod";
import { BadRequestError, NotFoundError } from "../errors.js";
import bcrypt from "bcrypt";
import { STATUS_CODE } from "../constants.js";

// register agent
export const registerAgent = async (req, res) => {
  // parse the input for validation
  const { firstname, lastname, email } = regSchema.parse(req.body);

  //   check if agent already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw BadRequestError("User already exists");
  }
  const password = generatePassword();
  //   hash password
  const hashedPassword = await bcrypt.hash(password, 13);

  const agent = new User({
    firstname,
    lastname,
    password: hashedPassword,
    email,
    mustChangePassword: true,
  });

  await agent.save();

  const agentData = agent.toObject();
  delete agentData.password;

  return res
    .status(STATUS_CODE.CREATED)
    .json({ message: "Agent created successfully", agent: agentData });
};

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
  res
    .status(STATUS_CODE.SUCCESS)
    .json({ message: "User logged out successfully" });
};

// new access token - (all users)
export const newToken = async (req, res) => {
  const accessToken = newAccessToken(user);
  res.status(STATUS_CODE.SUCCESS).json({
    message: "New Token Generated Successfully",
    token: accessToken,
  });
};
