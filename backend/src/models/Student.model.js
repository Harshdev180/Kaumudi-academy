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

    dob: {
      type: Date
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

    country: {
      type: String,
      trim: true
    },

    bio: {
      type: String,
      trim: true
    },

    sanskritKnowledge: {
      type: String,
      trim: true
    },

    occupation: {
      type: String,
      trim: true
    },

    // 🔹 ADMIN MANAGEMENT FIELDS
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },

    mode: {
      type: String,
      enum: ["ONLINE", "OFFLINE", "HYBRID"],
      default: "ONLINE"
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE"
    },

    paymentStatus: {
      type: String,
      enum: ["PAID", "PENDING"],
      default: "PENDING"
    },

    image: {
      public_id: String,
      url: String
    },

    settings: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        courseUpdates: { type: Boolean, default: true }
      }
    },
// ADD THESE NEW FIELDS FOR OTP VERIFICATION
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    // In your Student.model.js, add this field:
studentId: {
  type: String,
  unique: true,
  sparse: true,  // This allows multiple null values
  default: function() {
    // Generate a unique student ID
    return 'STU' + Date.now() + Math.floor(Math.random() * 10000);
  }
},
    

    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
