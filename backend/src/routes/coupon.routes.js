import express from "express";
import {
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  getAllCoupons,
  getAllCouponsForAdmin,
  deleteCoupon,
  validateCoupon
} from "../controllers/coupon.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createCouponSchema } from "../validators/coupon.validator.js";

const router = express.Router();

/**
 * PUBLIC - More specific routes first
 */
router.get("/coupon/validate/:code", validateCoupon);

router.get("/coupon", getAllCoupons);
router.get(
  "/coupon/admin/all",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  getAllCouponsForAdmin
);

/**
 * ADMIN
 */
router.post(
  "/coupon",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  validateBody(createCouponSchema),
  createCoupon
);

router.put(
  "/coupon/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  validateBody(createCouponSchema),
  updateCoupon
);

router.patch(
  "/coupon/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  toggleCouponStatus
);

router.delete(
  "/coupon/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  deleteCoupon
);

export default router;
