import Student from "../models/Student.model.js";
import StudentFee from "../models/StudentFee.model.js"

export const getAllStudentFees = async (req, res) => {
  const { search, status } = req.query;

  const query = {};

  if (status) {
    query.paymentStatus = status;
  }

  if (search) {
    const students = await Student.find({
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } }
      ]
    }).select("_id");

    const studentIds = students.map(s => s._id);

    query.student = { $in: studentIds };
  }

  const fees = await StudentFee.find(query)
    .populate("student", "firstName lastName email")
    .populate("course", "title price")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: fees
  });
};

/**
 * GET /api/admin/student-fees/:id
 * View fee details
 */
export const getStudentFeeById = async (req, res) => {
  const fee = await StudentFee.findById(req.params.id)
    .populate("student")
    .populate("course");

  if (!fee) {
    return res.status(404).json({ success: false, message: "Record not found" });
  }

  res.status(200).json({ success: true, data: fee });
};

/**
 * PATCH /api/admin/student-fees/:id/mark-paid
 * Mark payment as paid
 */
export const markFeeAsPaid = async (req, res) => {
  const fee = await StudentFee.findById(req.params.id);

  if (!fee) {
    return res.status(404).json({ success: false, message: "Record not found" });
  }

  fee.paymentStatus = "PAID";
  fee.paidAt = new Date();

  await fee.save();

  res.status(200).json({
    success: true,
    message: "Payment marked as paid"
  });
};

/**
 * DELETE /api/admin/student-fees/:id
 */
export const deleteStudentFee = async (req, res) => {
  await StudentFee.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Student fee record deleted"
  });
};

/**
 * GET /api/admin/student-fees/stats
 * Dashboard cards
 */
export const getStudentFeeStats = async (req, res) => {
  const totalEnrollments = await StudentFee.countDocuments();
  const paidStudents = await StudentFee.countDocuments({ paymentStatus: "PAID" });
  const pendingPayments = await StudentFee.countDocuments({ paymentStatus: "PENDING" });

  const revenueToday = await StudentFee.aggregate([
    {
      $match: {
        paymentStatus: "PAID",
        paidAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalEnrollments,
      paidStudents,
      pendingPayments,
      revenueToday: revenueToday[0]?.total || 0
    }
  });
};
