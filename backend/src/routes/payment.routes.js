import express from "express";
const router = express.Router();

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  fakeVerifyPayment
} from "../controllers/payment.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

router.post(
  "/payment/create-order",
  authMiddleware,
  createRazorpayOrder
);

router.post(
  "/payment/verify",
  verifyRazorpayPayment
);


router.post(
  "/payment/fake-verify",
  authMiddleware,
  fakeVerifyPayment
);

export default router;
