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

    amount: {
      type: Number,
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["PAID", "PENDING"],
      default: "PENDING",
      index: true
    },

    paidAt: {
      type: Date
    },

    paymentMode: {
      type: String,
      enum: ["CASH", "UPI", "CARD", "NET_BANKING"],
      default: "UPI"
    },

    remarks: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("StudentFee", studentFeeSchema);
