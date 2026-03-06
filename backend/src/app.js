import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import testimonialRoutes from "./routes/testimonial.routes.js";
import studentRoutes from "./routes/student.routes.js";
import studentFeeRoutes from "./routes/studentFee.routes.js";
import staffRoutes from "./routes/staff.routes.js";
import adminStudentRoutes from "./routes/adminStudent.routes.js";
import adminInquiryRoutes from "./routes/adminInquiry.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import { config } from "./configs/env.js";
import notificationRoutes from "./routes/notification.routes.js";
import inquiryRoutes from "./routes/inquiry.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import galleryRoutes from "./routes/galary.routes.js";
import progressRoutes from "./routes/progress.routes.js";
// import mongoSanitize from "express-mongo-sanitize";
// import xss from "xss-clean";
import contactRoutes from "./routes/contact.routes.js";
const app = express();

import cors from "cors";

// import dotenv from "dotenv";
// dotenv.config();

// const allowedOrigin = config.FRONTEND_URL || "http://localhost:5173";
// const allowedOrigin = config.FRONTEND_URL || "kaumudi-academy.vercel.app";
app.use(
  cors({
    origin: [
      "https://kaumudi-academy-seven.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);
app.use(express.json());
// app.use(
//   mongoSanitize({
//     replaceWith: "_"
//   })
// );
// app.use(xss())

// app.use("/api", authRoutes);
// app.use("/api", courseRoutes);
// app.use("/api", paymentRoutes);
// app.use("/api", couponRoutes);
// app.use("/api", enrollmentRoutes);
// app.use("/api", dashboardRoutes);
// app.use("/api", testimonialRoutes);
// app.use("/api", contactRoutes);
// app.use("/api", studentRoutes);
// app.use("/api", staffRoutes);
// app.use("/api", adminStudentRoutes);
// app.use("/api", adminInquiryRoutes);
// // app.use("/api", adminInquiryRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api", notificationRoutes);
// app.use("/api", inquiryRoutes);

// 🔓 PUBLIC ROUTES (ALWAYS FIRST)
app.use("/api", contactRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api", courseRoutes);
app.use("/api", inquiryRoutes);
app.use("/api", authRoutes);
app.use("/api", couponRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
// 🔐 PROTECTED / ADMIN ROUTES (AFTER)
app.use("/api", notificationRoutes);
app.use("/api", paymentRoutes);
app.use("/api", studentRoutes);
app.use("/api", studentFeeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", adminInquiryRoutes);
app.use("/api", adminStudentRoutes);
app.use("/api", staffRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", testimonialRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/health", (_, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
  });
});

app.use(errorMiddleware);
export default app;
