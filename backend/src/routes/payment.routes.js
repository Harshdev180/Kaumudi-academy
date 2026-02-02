import express from "express";
const router = express.Router();

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  fakeVerifyPayment
} from "../controllers/payment.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  createPaymentOrderSchema,
  verifyPaymentSchema,
  fakeVerifyPaymentSchema
} from "../validators/payment.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

router.post(
  "/payment/create-order",
  authMiddleware,
  validateBody(createPaymentOrderSchema),
  createRazorpayOrder
);

router.post(
  "/payment/verify",
  validateBody(verifyPaymentSchema),
  verifyRazorpayPayment
);

router.post(
  "/payment/fake-verify",
  authMiddleware,
  validateBody(fakeVerifyPaymentSchema),
  fakeVerifyPayment
);


export default router;
