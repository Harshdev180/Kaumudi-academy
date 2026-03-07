import Inquiry from "../models/Inquiry.model.js";
import { notifyStudent } from "../services/notification.service.js";
//this is inquery
/**
 * @desc Get all inquiries (Admin)
 * @route GET /api/admin/inquiries
 * @access Admin
 */
export const getAllInquiries = async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;

  const query = {};

  if (status) query.status = status;

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phoneNumber: { $regex: search, $options: "i" } }
    ];
  }

  const inquiries = await Inquiry.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Inquiry.countDocuments(query);

  res.status(200).json({
    success: true,
    data: inquiries,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit)
    }
  });
};

/**
 * @desc Get single inquiry
 * @route GET /api/admin/inquiries/:id
 */
export const getInquiryById = async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    return res.status(404).json({
      success: false,
      message: "Inquiry not found"
    });
  }

  res.status(200).json({
    success: true,
    data: inquiry
  });
};

/**
 * @desc Update inquiry status
 * @route PATCH /api/admin/inquiries/:id/status
 */
export const updateInquiryStatus = async (req, res) => {
  const { status, response } = req.body;

  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status, response },
    { new: true }
  );

  if (!inquiry) {
    return res.status(404).json({
      success: false,
      message: "Inquiry not found"
    });
  }

  // 🔔 NOTIFICATION: Inquiry Responded - Notify the inquirer if they provided email
  if (inquiry.email && response) {
    await notifyStudent({
      studentId: null, // Will be sent as email notification instead
      title: "Inquiry Response Received",
      message: `We have responded to your inquiry: ${inquiry.subject || 'Your question'}`,
      type: "STUDENT_QUERY",
      subType: "INQUIRY_RESPONSE",
      actionUrl: "/contact",
      priority: "HIGH",
      metadata: { inquiryId: inquiry._id, response }
    });
  }

  res.status(200).json({
    success: true,
    message: "Status updated successfully",
    data: inquiry
  });
};

/**
 * @desc Delete inquiry
 * @route DELETE /api/admin/inquiries/:id
 */
export const deleteInquiry = async (req, res) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

  if (!inquiry) {
    return res.status(404).json({
      success: false,
      message: "Inquiry not found"
    });
  }

  res.status(200).json({
    success: true,
    message: "Inquiry deleted successfully"
  });
};
