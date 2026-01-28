import Coupon from "../models/Coupon.model.js";


export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountPercentage,
      startTime,
      endTime
    } = req.body;

    const exists = await Coupon.findOne({ code });
    if (exists) {
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

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon
    });
  } catch (error) {
    console.error("CREATE COUPON ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create coupon"
    });
  }
};


export const toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.json({
      success: true,
      message: "Coupon status updated",
      isActive: coupon.isActive
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const validateCoupon = async (code) => {
  const now = new Date();

  const coupon = await Coupon.findOne({
    code,
    isActive: true,
    startTime: { $lte: now },
    endTime: { $gte: now }
  });

  return coupon; 
};
