import Inquiry from "../models/Inquiry.model.js";
import { sendInquiryMailToAdmin } from "../services/mail.service.js";

export const submitInquiry = async (req, res) => {
  try {
    const {
      fullName,
      vedicName,
      email,
      phoneNumber,
      preferredLevel,
      message
    } = req.body;

    const inquiry = await Inquiry.create({
      fullName,
      vedicName,
      email,
      phoneNumber,
      preferredLevel,
      message
    });

    
    await sendInquiryMailToAdmin(inquiry);

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully"
    });
  } catch (error) {
    console.error("INQUIRY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit inquiry"
    });
  }
};
