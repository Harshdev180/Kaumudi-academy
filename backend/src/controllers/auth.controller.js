import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import {
  sendResetPasswordMail,
  sendAdminCredentialsMail,
  sendOtpVerificationMail 
} from "../services/mail.service.js";

import { notifyAdmins } from "../services/notification.service.js";
import { config } from "../configs/env.js";
import SuperAdmin from "../models/SuperAdmin.model.js";
import Admin from "../models/Admin.model.js";
import Student from "../models/Student.model.js"; 
import TempStudent from "../models/TempStudent.model.js";
import { generateOtp, hashOtp, verifyOtp } from "../configs/otp.js";


const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.JWT_SECRET, {
    expiresIn: "7d"
  });
};

const isBcryptHash = (value) =>
  typeof value === "string" && /^\$2[aby]\$/.test(value);

const verifyPassword = async (plainPassword, storedPassword, account) => {
  if (!storedPassword) return false;

  if (isBcryptHash(storedPassword)) {
    return bcrypt.compare(plainPassword, storedPassword);
  }

  if (storedPassword === plainPassword) {
    account.password = await bcrypt.hash(plainPassword, 10);
    await account.save();
    return true;
  }

  return false;
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



// export const registerStudent = async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       address,
//       phoneNumber
//     } = req.body;

//     const exists = await Student.findOne({ email });
//     if (exists) {
//       return res.status(409).json({
//         success: false,
//         message: "Student already registered"
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await Student.create({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       address,
//       phoneNumber
//     });

//     res.status(201).json({
//       success: true,
//       message: "Student registered successfully"
//     });
//   } catch (error) {
//     console.log("STUDENT REGISTER ERROR:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };




// MODIFIED: Register Student - Send OTP first


// controllers/auth.controller.js




// NEW: Verify Student OTP




// controllers/auth.controller.js
export const registerStudent = async (req, res) => {
  try {
    // Handle undefined req.body
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing. Please send JSON data with Content-Type: application/json"
      });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: firstName, lastName, email, password"
      });
    }

    // Check if student already exists and is verified
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      if (existingStudent.isEmailVerified) {
        return res.status(409).json({
          success: false,
          message: "Student already registered with this email"
        });
      } else {
        // If student exists but not verified, delete the old record
        await Student.deleteOne({ email });
      }
    }

    // Check if there's already a pending registration in TempStudent
    const existingTemp = await TempStudent.findOne({ email });
    if (existingTemp) {
      // Delete old temp record
      await TempStudent.deleteOne({ email });
    }

    // Generate OTP
    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store temporary registration data
    await TempStudent.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address,
      phoneNumber,
      emailOtp: hashedOtp,
      emailOtpExpire: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Send OTP via email
    try {
      await sendOtpVerificationMail({
        email,
        firstName,
        otp
      });
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      // Delete the temp student record since we can't verify
      await TempStudent.deleteOne({ email });
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP to your email. Please try again."
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete registration.",
      email: email
    });

  } catch (error) {
    console.log("STUDENT REGISTER ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error" 
    });
  }
};




// controllers/auth.controller.js
export const verifyStudentOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find temporary registration data
    const tempStudent = await TempStudent.findOne({ email });
    
    if (!tempStudent) {
      return res.status(404).json({
        success: false,
        message: "Registration data not found or expired. Please register again."
      });
    }

    // Check if OTP is expired
    if (tempStudent.emailOtpExpire < Date.now()) {
      await TempStudent.deleteOne({ email });
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please register again."
      });
    }

    // Verify OTP
    const isValidOtp = verifyOtp(otp, tempStudent.emailOtp);
    
    if (!isValidOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Check again if student was created while verifying (race condition)
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      await TempStudent.deleteOne({ email });
      return res.status(409).json({
        success: false,
        message: "Student already registered"
      });
    }

    // Create permanent student record
    const student = await Student.create({
      firstName: tempStudent.firstName,
      lastName: tempStudent.lastName,
      email: tempStudent.email,
      password: tempStudent.password,
      address: tempStudent.address,
      phoneNumber: tempStudent.phoneNumber,
      isEmailVerified: true
    });

    // Delete temporary data
    await TempStudent.deleteOne({ email });

    // 🔔 NOTIFICATION: New Student Registration
    const studentName = student.firstName && student.lastName 
      ? `${student.firstName} ${student.lastName}` 
      : (student.fullName || 'A student');
    
    await notifyAdmins({
      title: "New Student Registered",
      message: `${studentName} has registered. Email: ${student.email}`,
      type: "STUDENT_QUERY",
      subType: "NEW_REGISTRATION",
      actionUrl: "/admin/students",
      priority: "HIGH",
      metadata: { studentId: student._id, email: student.email },
      userId: student._id,
      userRole: "STUDENT"
    });

    // Generate token for auto-login
    const token = generateToken(student._id, "STUDENT");

    res.status(201).json({
      success: true,
      message: "Email verified successfully. Registration completed.",
      token,
      user: {
        id: student._id,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        name: `${student.firstName} ${student.lastName}`.trim(),
        role: "STUDENT"
      }
    });

  } catch (error) {
    console.log("OTP VERIFICATION ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error" 
    });
  }
};


// controllers/auth.controller.js
export const resendStudentOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const tempStudent = await TempStudent.findOne({ email });
    
    if (!tempStudent) {
      return res.status(404).json({
        success: false,
        message: "Registration data not found. Please register again."
      });
    }

    // Generate new OTP
    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);

    // Update temp student with new OTP
    tempStudent.emailOtp = hashedOtp;
    tempStudent.emailOtpExpire = Date.now() + 10 * 60 * 1000;
    await tempStudent.save();

    // Send new OTP
    await sendOtpVerificationMail({
      email,
      firstName: tempStudent.firstName,
      otp
    });

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email"
    });

  } catch (error) {
    console.log("RESEND OTP ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error" 
    });
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

    // Check if student account is active
    if (role === "STUDENT" && account.status === "INACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact admin."
      });
    }

    const isMatch = await verifyPassword(password, account.password, account);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = generateToken(account._id, role);
    const baseUser = {
      id: account._id,
      email: account.email,
      role
    };
    const user =
      role === "STUDENT"
        ? {
            ...baseUser,
            firstName: account.firstName || "",
            lastName: account.lastName || "",
            name: `${account.firstName || ""} ${account.lastName || ""}`.trim()
          }
        : {
            ...baseUser,
            name: account.name || ""
          };

    res.status(200).json({
      success: true,
      token,
      role,
      user
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

    const baseUrl =
      config.FRONTEND_URL ||
      process.env.CLIENT_URL ||
      "http://localhost:5173";
    const resetLink = `${baseUrl}/reset-password/${resetToken}`;

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
  
  const match =await bcrypt.compare(newPassword, account.password)
  
  if(match){
    return res.status(400).json({
      success:false,
      message:"New password cant be same as old password"
    })
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
