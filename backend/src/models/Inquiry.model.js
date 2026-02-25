import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    vedicName: {
      type: String,
      trim: true,
      default: null
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },

   whatsappNumber: {
  type: String,
  required: true,
  alias: "phoneNumber"
},

    preferredLevel: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      required: true
    },

    message: {
      type: String,
      trim: true,
      default: ""
    },

    course: {
      title: {
        type: String,
        required: true
      },
      duration: {
        type: String,
        required: true
      },
      language: {
        type: String,
        required: true
      },
      level: {
        type: String,
        required: true
      }
    },

    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "CLOSED"],
      default: "NEW",
      index: true
    },

    ipAddress: String,
    userAgent: String
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", inquirySchema);