import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true
    },

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "DROPPED"],
      default: "ACTIVE"
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    enrolledAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);


enrollmentSchema.index(
  { student: 1, course: 1 },
  { unique: true }
);

export default mongoose.model("Enrollment", enrollmentSchema);