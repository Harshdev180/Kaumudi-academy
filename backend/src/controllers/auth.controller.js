import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import {
  sendResetPasswordMail,
  sendAdminCredentialsMail
} from "../services/mail.service.js";

import { config } from "../configs/env.js";
import SuperAdmin from "../models/SuperAdmin.model.js";
import Admin from "../models/Admin.model.js";
import Student from "../models/Student.model.js"; 


const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.JWT_SECRET, {
    expiresIn: "7d"
  });
};



export const registerSuperAdmin = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, secretKey } = req.body;

    if (secretKey !== config.SUPER_ADMIN_SECRET_KEY) {
      return res.status(401).json({
        success: false,
        message: "Invalid secret key"
      });
    }

    const exists = await SuperAdmin.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Super admin already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await SuperAdmin.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      secretKey
    });

    res.status(201).json({
      success: true,
      message: "Super admin registered successfully"
    });
  } catch (error) {
    console.log("SUPER ADMIN REGISTER ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const registerStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber
    } = req.body;

    const exists = await Student.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Student already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Student.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address,
      phoneNumber
    });

    res.status(201).json({
      success: true,
      message: "Student registered successfully"
    });
  } catch (error) {
    console.log("STUDENT REGISTER ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let account;

    if (role === "SUPER_ADMIN") {
      account = await SuperAdmin.findOne({ email }).select("+password");
    } else if (role === "ADMIN") {
      account = await Admin.findOne({ email }).select("+password");
    } else if (role === "STUDENT") {
      account = await Student.findOne({ email }).select("+password");
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = generateToken(account._id, role);

    res.status(200).json({
      success: true,
      token,
      role
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const createAdmin = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists"
      });
    }

    const password = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword
    });

    await sendAdminCredentialsMail({
      adminEmail: email,
      adminName: name,
      password
    });

    res.status(201).json({
      success: true,
      message: "Admin created & credentials sent via email"
    });
  } catch (error) {
    console.log("CREATE ADMIN ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





export const forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    let account;

    if (role === "STUDENT") {
      account = await Student.findOne({ email });
    } else if (role === "ADMIN") {
      account = await Admin.findOne({ email });
    } else if (role === "SUPER_ADMIN") {
      account = await SuperAdmin.findOne({ email });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    if (!account) {
      return res.json({
        success: true,
        message: "If email exists, reset link sent"
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    account.resetPasswordToken = hashedToken;
    account.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await account.save({ validateBeforeSave: false });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendResetPasswordMail({
      userEmail: account.email,
      userName: account.firstName
        ? `${account.firstName} ${account.lastName}`
        : account.name,
      resetLink
    });

    res.json({
      success: true,
      message: "Reset password link sent to email"
    });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};




export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Both passwords required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    let account =
      (await Student.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      }).select("+password")) ||
      (await Admin.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      }).select("+password")) ||
      (await SuperAdmin.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      }).select("+password"));

    if (!account) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    account.password = await bcrypt.hash(newPassword, 10);
    account.resetPasswordToken = undefined;
    account.resetPasswordExpire = undefined;

    await account.save();

    res.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password"
    });
  }
};

