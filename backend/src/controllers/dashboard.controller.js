import Course from "../models/Course.model.js";
import Enrollment from "../models/Enrollment.model.js";
import Transaction from "../models/Transaction.model.js";
import Inquiry from "../models/Inquiry.model.js";


export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();


    const totalCourses = await Course.countDocuments();

   
    const activeCourses = await Course.countDocuments({
      status: "ACTIVE",
      endDate: { $gte: now }
    });

    
    const totalEnrollments = await Enrollment.countDocuments();

    
    const revenueAgg = await Transaction.aggregate([
      { $match: { status: "SUCCESS" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$finalAmount" }
        }
      }
    ]);

    const totalRevenue =
      revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

  
    const totalInquiries = await Inquiry.countDocuments();

    res.json({
      success: true,
      data: {
        totalCourses,
        activeCourses,
        totalEnrollments,
        totalRevenue,
        totalInquiries
      }
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats"
    });
  }
};
