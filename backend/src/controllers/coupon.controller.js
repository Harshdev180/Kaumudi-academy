import Coupon from "../models/Coupon.model.js";

/**
 * CREATE COUPON (ADMIN)
 * POST /coupon
 */
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
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

    const coupon = await Coupon.create({
      code,
      discountPercentage,
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

    const coupon = await Coupon.findOne({
      _id: id,
      createdBy: req.user._id
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found or access denied"
      });
    }

    const updates = [
      "code",
      "discountPercentage",
      "startTime",
      "endTime"
    ];

    updates.forEach((field) => {
      if (req.body[field] !== undefined) {
        coupon[field] = req.body[field];
      }
    });

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

    const coupon = await Coupon.findOne({
      _id: id,
      createdBy: req.user._id
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found or access denied"
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
