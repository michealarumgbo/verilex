import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const auth = async (secret_key = process.env.JWT_ACCESS_SECRET) => {
  return async (req, res, next) => {
    // get auth header
    const authHeader = req.get("Authorization");

    // verify if token is not like "Bearer uefif..
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ error: "Invalid Token" });
    }

    // get token
    const token = authHeader.replace("Bearer ", "");

    // verify token
    const decoded = jwt.verify(token, secret_key);
    if (!decoded || !decoded.id) {
      throw UnauthourizedError("Invalid or expired token");
    }

    // fetch user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw NotFoundError("User no longer exists");
    }

    // check if user logged in
    const isLoggedIn = await RefreshToken.findOne({
      user: decoded.id,
    }).select("token");

    if (!isLoggedIn || !isLoggedIn.token) {
      throw UnauthourizedError("User is already logged out");
    }

    // append user to req object
    req.user = user;
    next();
  };
};
