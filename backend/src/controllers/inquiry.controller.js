import Inquiry from "../models/Inquiry.model.js";
import { sendInquiryMailToAdmin } from "../services/mail.service.js";

/**
 * @desc Submit a new inquiry (Public)
 * @route POST /api/inquiries
 * @access Public
 */
export const submitInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create(req.body);

    await sendInquiryMailToAdmin(inquiry);

    await Notification.create({
      title: "New Inquiry",
      message: `Asked about ${inquiry.subject || "course details"}`,
      type: "INQUIRY",
      recipientRole: "ADMIN",
      actionUrl: "/admin/inquiries"
    });

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully"
    });
  } catch (error) {
    next(error);
  }
};
