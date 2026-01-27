import User from "../models/User.model.js";
import { comparePassword, hashPassword } from "../utils/password.utils.js";
import { generateToken } from "../utils/token.utils.js";
import { ROLES } from "../constants/roles.js";

/* LOGIN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const admin = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: ROLES.ADMIN
    });

    res.status(201).json({
      message: "Admin created successfully",
      adminId: admin._id
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

