import Contact from "../models/Contact.model.js";
import { sendContactMailToAdmin } from "../services/mail.service.js";

export const createContact = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    const contact = await Contact.create({
      fullName,
      email,
      subject,
      message
    });

    // Send email (non-blocking safe)
    try {
      await sendContactMailToAdmin(contact);
    } catch (mailErr) {
      console.error("Contact email failed:", mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Contact submitted successfully"
    });

  } catch (error) {
    console.error("CREATE CONTACT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit contact"
    });
  }
};