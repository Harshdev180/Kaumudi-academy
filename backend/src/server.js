// import app from "./app.js"
// import dotenv from "dotenv"
// import connectDB from "./configs/db.js"
// import {config} from "./configs/env.js"

// const PORT = config.PORT || 5000

// app.listen(PORT,()=>{
//   console.log(`server is running on http://localhost:${PORT}`)
// })

import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import { config } from "./configs/env.js";
import nodemailer from "nodemailer"; // 1. Nodemailer import kiya
import express from "express";

// dotenv config agar config.js mein nahi hai toh
dotenv.config();

// Middleware to parse JSON (agar app.js mein nahi hai)
app.use(express.json());

// --- OTP STORAGE (Temporary) ---
let otpStore = {};

// --- NODEMAILER CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // .env se email lein
    pass: process.env.EMAIL_PASS, // .env se 16-digit App Password lein
  },
});

// --- OTP ROUTES ---

// 1. Send OTP API
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[email] = otp;

  const mailOptions = {
    from: `"Kaumudi Trust" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Enrollment Verification OTP",
    html: `<h3>Namaste!</h3><p>Aapka verification code hai: <b>${otp}</b></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// 2. Verify OTP API
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] === otp) {
    delete otpStore[email];
    res.status(200).json({ success: true, message: "Verified" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

// --- SERVER START ---
connectDB();
const PORT = config.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
