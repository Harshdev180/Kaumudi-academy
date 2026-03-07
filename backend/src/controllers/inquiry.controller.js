import Inquiry from "../models/Inquiry.model.js";
import {
  sendInquiryMailToAdmin,
  sendInquiryAcknowledgementToUser, // Import the new function
} from "../services/mail.service.js";
import { notifyAdmins } from "../services/notification.service.js";

/**
 * @desc Submit course inquiry
 * @route POST /api/inquiries
 * @access Public
 */
export const submitInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create({
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // Send email to admin (async – non-blocking)
    sendInquiryMailToAdmin(inquiry).catch(console.error);

    // 🔔 NEW: Send acknowledgment email to user (async – non-blocking)
    sendInquiryAcknowledgementToUser(inquiry).catch((error) => {
      console.error("Failed to send acknowledgment email to user:", error);
    });

    // 🔔 NOTIFICATION: New Inquiry
    await notifyAdmins({
      title: "New Inquiry Received",
      message: `${inquiry.name || "Someone"} asked about ${inquiry.subject || "course details"} - ${inquiry.email || ""}`,
      type: "STUDENT_QUERY",
      subType: "NEW_INQUIRY",
      actionUrl: "/admin/inquiries",
      priority: "HIGH",
      metadata: {
        inquiryId: inquiry._id,
        email: inquiry.email,
        phone: inquiry.phone,
        inquirerName: inquiry.name, // Store name directly for display
      },
    });

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
    });
  } catch (error) {
    next(error);
  }
};
