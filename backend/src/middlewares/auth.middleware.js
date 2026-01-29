import jwt from "jsonwebtoken";
import { config } from "../configs/env.js";
import SuperAdmin from "../models/SuperAdmin.model.js";
import Admin from "../models/Admin.model.js";
import Student from "../models/Student.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please login first"
      });
    }

    const token = authHeader.split(" ")[1];

    const verify = jwt.verify(token, config.JWT_SECRET);

    let account;

    if (verify.role === "SUPER_ADMIN") {
      account = await SuperAdmin.findById(verify.id);
    } 
    else if (verify.role === "ADMIN") {
      account = await Admin.findById(verify.id);
    } 
    else if (verify.role === "STUDENT") {
      account = await Student.findById(verify.id);
    } 
    else {
      return res.status(401).json({
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

    req.user = account;
    req.user.role = verify.role;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};
