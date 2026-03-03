import Coupon from "../models/Coupon.model.js";

/**
 * VALIDATE COUPON (PUBLIC)
 * GET /coupon/validate/:code
 */
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.params;
    const now = new Date();
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now }
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid or Expired Code"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountPercentage: coupon.discountPercentage
      }
    });
  } catch (error) {
    console.error("VALIDATE COUPON ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to validate coupon"
    });
  }
};

/**
 * CREATE COUPON (ADMIN)
 * POST /coupon
 */
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType = "percentage",
      discountValue,
      discountPercentage,
      startTime,
      endTime
    } = req.body;

    const existingCoupon = await Coupon.findOne({ code });

    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message: "Coupon already exists"
      });
    }

    const normalizedType = String(discountType).toLowerCase();
    const value =
      discountValue !== undefined && discountValue !== null
        ? Number(discountValue)
        : Number(discountPercentage);

    if (!value || Number.isNaN(value)) {
      return res.status(400).json({
        success: false,
        message: "Discount value is required"
      });
    }

    if (normalizedType === "percentage" && value > 100) {
      return res.status(400).json({
        success: false,
        message: "Discount cannot exceed 100%"
      });
    }

    const coupon = await Coupon.create({
      code,
      discountType: normalizedType,
      discountValue: value,
      discountPercentage: normalizedType === "percentage" ? value : undefined,
      startTime,
      endTime,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon
    });
  } catch (error) {
    console.error("CREATE COUPON ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create coupon"
    });
  }
};

/**
 * UPDATE COUPON (ADMIN)
 * PUT /coupon/:id
 */
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    const updates = [
      "code",
      "discountType",
      "discountValue",
      "discountPercentage",
      "startTime",
      "endTime"
    ];

    updates.forEach((field) => {
      if (req.body[field] !== undefined) {
        coupon[field] = req.body[field];
      }
    });

    if (req.body.discountType || req.body.discountValue || req.body.discountPercentage) {
      const normalizedType = String(
        coupon.discountType || "percentage"
      ).toLowerCase();
      const value =
        coupon.discountValue !== undefined && coupon.discountValue !== null
          ? Number(coupon.discountValue)
          : Number(coupon.discountPercentage);

      if (!value || Number.isNaN(value)) {
        return res.status(400).json({
          success: false,
          message: "Discount value is required"
        });
      }

      if (normalizedType === "percentage" && value > 100) {
        return res.status(400).json({
          success: false,
          message: "Discount cannot exceed 100%"
        });
      }

      coupon.discountType = normalizedType;
      coupon.discountValue = value;
      coupon.discountPercentage = normalizedType === "percentage" ? value : undefined;
    }

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon
    });
  } catch (error) {
    console.error("UPDATE COUPON ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update coupon"
    });
  }
};

/**
 * ENABLE / DISABLE COUPON (ADMIN)
 * PATCH /coupon/:id/status
 */
export const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    return res.status(200).json({
      success: true,
      message: `Coupon ${coupon.isActive ? "enabled" : "disabled"} successfully`,
      isActive: coupon.isActive
    });
  } catch (error) {
    console.error("TOGGLE COUPON ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update coupon status"
    });
  }
};

/**
 * GET ALL COUPONS (PUBLIC / ALL USERS)
 * GET /coupon
 */
export const getAllCoupons = async (req, res) => {
  try {
    const now = new Date();

    const coupons = await Coupon.find({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now }
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: coupons
    });
  } catch (error) {
    console.error("GET COUPONS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch coupons"
    });
  }
};

/**
 * DELETE COUPON (ADMIN)
 * DELETE /coupon/:id
 */
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    await coupon.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully"
    });
  } catch (error) {
    console.error("DELETE COUPON ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete coupon"
    });
  }
};

/**
 * GET ALL COUPONS (ADMIN)
 * GET /coupon/admin/all
 */
export const getAllCouponsForAdmin = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: coupons
    });
  } catch (error) {
    console.error("GET ADMIN COUPONS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch coupons"
    });
  }
};
