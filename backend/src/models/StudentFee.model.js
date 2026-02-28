import mongoose from "mongoose";

const studentFeeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment"
    },

    totalAmount: {
      type: Number,
      required: true
    },

    paidAmount: {
      type: Number,
      required: true,
      default: 0
    },

    remainingAmount: {
      type: Number,
      required: true,
      default: 0
    },

    paymentStatus: {
      type: String,
      enum: ["PAID", "PARTIAL", "PENDING"],
      default: "PENDING"
    },

    paymentMode: {
      type: String,
      enum: ["FULL", "EMI"],
      default: "FULL"
    },

    paidAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("StudentFee", studentFeeSchema);
