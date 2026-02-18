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

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully"
    });
  } catch (error) {
    next(error);
  }
};
