import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: [
        "INQUIRY",
        "PAYMENT",
        "STUDENT",
        "COURSE",
        "SYSTEM"
      ],
      default: "SYSTEM"
    },

    recipientRole: {
      type: String,
      enum: ["ADMIN", "SUPER_ADMIN"],
      required: true
    },

    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "recipientRole",
      required: false
    },

    isRead: {
      type: Boolean,
      default: false
    },

    actionUrl: {
      type: String // frontend redirect link
    }
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
