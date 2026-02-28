import crypto from "crypto";

export const generateOtp = () => {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

export const verifyOtp = (plainOtp, hashedOtp) => {
  const hashedPlainOtp = crypto.createHash("sha256").update(plainOtp).digest("hex");
  return hashedPlainOtp === hashedOtp;
};