import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Server
  PORT: process.env.PORT || 5000,

  // Database
  MONGO_URI: process.env.MONGO_URI,

  // Auth
  JWT_SECRET: process.env.JWT_SECRET,
  SUPER_ADMIN_SECRET_KEY: process.env.SUPER_ADMIN_SCRET_KEY,

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // Email (Brevo)
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
  BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME,

  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL,

  //razorpay

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_SECRET: process.env.RAZORPAY_SECRET,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
};
