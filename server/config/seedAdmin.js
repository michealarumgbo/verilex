import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URI);

    const existingAdmin = await User.findOne({
      email: "admin@aaoc.legal",
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin1", 12);

    await User.create({
      firstname: "Admin",
      lastname: "AAOC",
      email: "admin@aaoc.legal",
      password: hashedPassword,
      role: "admin",
      mustChangePassword: false,
      status: "active",
    });

    console.log("Admin created successfully.");
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedAdmin();
