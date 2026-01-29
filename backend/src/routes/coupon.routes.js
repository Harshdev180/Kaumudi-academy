import express from "express";
const router = express.Router();

import {
  createCoupon,
  toggleCouponStatus
} from "../controllers/coupon.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

router.post(
  "/coupon",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createCoupon
);

router.patch(
  "/coupon/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  toggleCouponStatus
);

export default router;
