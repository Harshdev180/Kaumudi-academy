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

    // Main category type
    type: {
      type: String,
      enum: [
        "PAYMENT",
        "ENROLLMENT",
        "STUDENT_QUERY",
        "OTHERS"
      ],
      required: true
    },

    // Specific sub-type for detailed actions
    subType: {
      type: String,
      enum: [
        // Payment sub-types
        "PAYMENT_INITIATED",
        "PAYMENT_SUCCESS",
        "PAYMENT_FAILED",
        "EMI_INSTALLMENT_INITIATED",
        "EMI_INSTALLMENT_PAID",
        "EMI_INSTALLMENT_DUE",
        "REFUND_INITIATED",
        "REFUND_PROCESSED",
        "PARTIAL_PAYMENT_RECEIVED",
        
        // Enrollment sub-types
        "NEW_ENROLLMENT",
        "ENROLLMENT_CONFIRMED",
        "ENROLLMENT_CANCELLED",
        "COURSE_COMPLETED",
        "CERTIFICATE_ISSUED",
        "COURSE_STARTED",
        "COURSE_EXPIRED",
        
        // Student Query sub-types
        "NEW_INQUIRY",
        "INQUIRY_RESPONSE",
        "NEW_REGISTRATION",
        "PROFILE_UPDATED",
        "DOCUMENT_UPLOADED",
        "DOCUMENT_VERIFIED",
        
        // Others sub-types
        "NEW_COURSE_LAUNCHED",
        "COURSE_UPDATED",
        "COUPON_CREATED",
        "COUPON_EXPIRES_SOON",
        "SUBSCRIPTION_ADDED",
        "SYSTEM_MAINTENANCE",
        "ACCOUNT_SUSPENDED",
        "SYSTEM"
      ],
      default: "SYSTEM"
    },

    recipientRole: {
      type: String,
      enum: ["ADMIN", "SUPER_ADMIN", "STUDENT", "ALL"],
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
    },

    // Additional metadata for rich notifications
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    // Priority level for sorting and display
    priority: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "MEDIUM"
    },

    // Optional expiration date for temporary notifications
    expiresAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Index for efficient querying
notificationSchema.index({ recipientRole: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for checking if notification is expired
notificationSchema.virtual("isExpired").get(function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Ensure virtuals are included in JSON
notificationSchema.set("toJSON", { virtuals: true });
notificationSchema.set("toObject", { virtuals: true });

export default mongoose.model("Notification", notificationSchema);
