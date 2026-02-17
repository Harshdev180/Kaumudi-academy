import express from "express";
import {
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  getAllCoupons
} from "../controllers/coupon.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createCouponSchema } from "../validators/coupon.validator.js";

const router = express.Router();

/**
 * PUBLIC
 */
router.get("/coupon", getAllCoupons);

/**
 * ADMIN
 */
router.post(
  "/coupon",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateBody(createCouponSchema),
  createCoupon
);

router.put(
  "/coupon/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateBody(createCouponSchema),
  updateCoupon
);

router.patch(
  "/coupon/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  toggleCouponStatus
);

export default router;
