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
    settings: {
      notifications: {
        email: {
          type: Boolean,
          default: true
        },
        sms: {
          type: Boolean,
          default: false
        },
        courseUpdates: {
          type: Boolean,
          default: true
        }
      },
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpire: {
      type: Date
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
