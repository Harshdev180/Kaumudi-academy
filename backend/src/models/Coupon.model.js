import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      default: "percentage"
    },

    discountValue: {
      type: Number,
      min: 1
    },

    // Backward compatibility for older data/clients
    discountPercentage: {
      type: Number,
      min: 1,
      max: 100
    },

    startTime: {
      type: Date,
      required: true
    },

    endTime: {
      type: Date,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
