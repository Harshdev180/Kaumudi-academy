import mongoose from "mongoose";

const tempStudentSchema = new mongoose.Schema(
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
      required: true 
    },
    phoneNumber: { 
      type: String,
      trim: true 
    },
    address: { 
      type: String,
      trim: true 
    },
    emailOtp: { 
      type: String, 
      required: true 
    },
    emailOtpExpire: { 
      type: Date, 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now
    }
  },
  { timestamps: true }
);

// Create TTL index for automatic deletion after 10 minutes
tempStudentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

export default mongoose.model("TempStudent", tempStudentSchema);