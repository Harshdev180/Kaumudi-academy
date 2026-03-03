import express from "express";
const router = express.Router();

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  fakeVerifyPayment,
  createEmiInstallment,
  verifyEmiInstallmentPayment
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
  //validateBody(createPaymentOrderSchema),
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

// EMI Installment routes
router.post(
  "/payment/create-emi-installment",
  authMiddleware,
  createEmiInstallment
);

router.post(
  "/payment/verify-emi-installment",
  authMiddleware,
  verifyEmiInstallmentPayment
);


export default router;
