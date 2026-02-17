import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    phoneNumber: {
      type: String,
      trim: true,
      minlength: 10,
      maxlength: 15
    },
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    sanskritKnowledge: {
      type: String,
      enum: ["Beginner (No prior knowledge)", "Intermediate (Knows basics)", "Advanced (Fluent)"],
      default: "Beginner (No prior knowledge)"
    },
    occupation: {
      type: String,
      trim: true
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpire: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
