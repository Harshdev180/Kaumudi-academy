import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    originalAmount: {
      type: Number,
      required: true,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
    },

    processingFee: {
      type: Number,
      default: 0,
    },

    couponCode: {
      type: String,
      default: null,
    },

    paymentMode: {
      type: String,
      enum: ["FULL", "EMI", "EMI_INSTALLMENT"],
      default: "FULL"
    },

    paymentGateway: {
      type: String,
      enum: ["RAZORPAY"],
      default: "RAZORPAY",
    },

    razorpayOrderId: {
      type: String,
    },

    razorpayPaymentId: {
      type: String,
    },

    razorpaySignature: {
      type: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    // For EMI installment tracking
    isInstallment: {
      type: Boolean,
      default: false
    },

    parentPayment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
