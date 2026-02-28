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

    // Fetch fresh document to ensure createdAt is populated
    const freshContact = await Contact.findById(contact._id);

    try {
      await sendContactMailToAdmin(freshContact);
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