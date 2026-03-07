import Course from "../models/Course.model.js";
import Enrollment from "../models/Enrollment.model.js";
import Payment from "../models/Payment.model.js"
import Inquiry from "../models/Inquiry.model.js";
import { formatEnrollmentId } from "../utils/enrollment.utils.js";

// ─── Helper ───────────────────────────────────────────────────────────────────
const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const startOfLastMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth() - 1, 1);
const endOfLastMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59, 999);

const pctChange = (current, previous) => {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const diff = ((current - previous) / previous) * 100;
  return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
};

// ─── Main Controller ──────────────────────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfLastMonth(now);
    const lastMonthEnd = endOfLastMonth(now);

    // ── 1. STAT CARDS ──────────────────────────────────────────────────────────

    // Total Courses
    const [totalCourses, coursesThisMonth, coursesLastMonth] =
      await Promise.all([
        Course.countDocuments(),
        Course.countDocuments({ createdAt: { $gte: thisMonthStart } }),
        Course.countDocuments({
          createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
        }),
      ]);

    // Active Students (students with at least one ACTIVE enrollment)
    const [activeStudents, studentsThisMonth, studentsLastMonth] =
      await Promise.all([
        Enrollment.distinct("student", { status: "ACTIVE" }).then(
          (ids) => ids.length
        ),
        Enrollment.distinct("student", {
          status: "ACTIVE",
          enrolledAt: { $gte: thisMonthStart },
        }).then((ids) => ids.length),
        Enrollment.distinct("student", {
          status: "ACTIVE",
          enrolledAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
        }).then((ids) => ids.length),
      ]);

    // Coupons Redeemed
    const [couponsThisMonth, couponsLastMonth] = await Promise.all([
      Payment.countDocuments({
        couponCode: { $ne: null },
        status: "SUCCESS",
        createdAt: { $gte: thisMonthStart },
      }),
      Payment.countDocuments({
        couponCode: { $ne: null },
        status: "SUCCESS",
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
      }),
    ]);
    const totalCouponsRedeemed = await Payment.countDocuments({
      couponCode: { $ne: null },
      status: "SUCCESS",
    });

    // New Inquiries
    const [newInquiries, inquiriesThisMonth, inquiriesLastMonth] =
      await Promise.all([
        Inquiry.countDocuments({ status: "NEW" }),
        Inquiry.countDocuments({ createdAt: { $gte: thisMonthStart } }),
        Inquiry.countDocuments({
          createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
        }),
      ]);

    // ── 2. REVENUE CHART (last 12 months) ─────────────────────────────────────
    const twelveMonthsAgo = new Date(now);
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const revenueChart = await Payment.aggregate([
      { $match: { 
        status: "SUCCESS",
        createdAt: { $gte: twelveMonthsAgo }
      }},
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$finalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      // Don't limit - return all months with data
    ]);

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ];
    
    // Get current year
    const currentYear = now.getFullYear();
    
    // Create a map of existing data
    const revenueDataMap = new Map();
    revenueChart.forEach(item => {
      const key = `${item._id.year}-${item._id.month}`;
      revenueDataMap.set(key, {
        month: monthNames[item._id.month - 1],
        revenue: item.revenue,
        orders: item.orders
      });
    });
    
    // Generate months in calendar order (Jan to Dec) for current year
    const formattedRevenueChart = [];
    for (let month = 1; month <= 12; month++) {
      const key = `${currentYear}-${month}`;
      
      if (revenueDataMap.has(key)) {
        formattedRevenueChart.push(revenueDataMap.get(key));
      } else {
        formattedRevenueChart.push({
          month: monthNames[month - 1],
          revenue: 0,
          orders: 0
        });
      }
    }

    // ── 3. SALES / ENROLLMENT CHART (last 12 months) ───────────────────────────
    const salesChart = await Enrollment.aggregate([
      {
        $match: {
          enrolledAt: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$enrolledAt" },
            month: { $month: "$enrolledAt" },
          },
          enrollments: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Create a map of existing sales data
    const salesDataMap = new Map();
    salesChart.forEach(item => {
      const key = `${item._id.year}-${item._id.month}`;
      salesDataMap.set(key, {
        month: monthNames[item._id.month - 1],
        enrollments: item.enrollments
      });
    });
    
    // Generate months in calendar order (Jan to Dec) for current year
    const formattedSalesChart = [];
    for (let month = 1; month <= 12; month++) {
      const key = `${currentYear}-${month}`;
      
      if (salesDataMap.has(key)) {
        formattedSalesChart.push(salesDataMap.get(key));
      } else {
        formattedSalesChart.push({
          month: monthNames[month - 1],
          enrollments: 0
        });
      }
    }

    // ── 3.1 SALES BY CATEGORY (Course Distribution) ─────────────────────────────
    // Grouping by instructor/faculty name instead of category
    const salesByCategory = await Payment.aggregate([
      { $match: { status: "SUCCESS" } },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      { $unwind: { path: "$courseInfo", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "staffs",
          localField: "courseInfo.instructor",
          foreignField: "_id",
          as: "instructorInfo",
        },
      },
      { $unwind: { path: "$instructorInfo", preserveNullAndEmptyArrays: true } },
      // Filter out entries where instructor is null or empty
      { $match: { "instructorInfo.name": { $exists: true, $ne: null, $ne: "" } } },
      {
        $group: {
          _id: "$instructorInfo.name",
          count: { $sum: 1 },
          revenue: { $sum: "$finalAmount" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Generate colors for the pie chart
    const categoryColors = [
      "#D4AF37", "#6b1d14", "#8A2A1F", "#E0B84F", "#F3E6C9",
      "#4A90A4", "#7B68EE", "#20B2AA", "#FF6B6B", "#2E8B57"
    ];

    const formattedSalesByCategory = salesByCategory.map((item, index) => ({
      name: item._id || "No Instructor",
      value: item.count,
      revenue: item.revenue,
      color: categoryColors[index % categoryColors.length],
    }));

    // ── 4. TOP COURSES ─────────────────────────────────────────────────────────
    const topCourses = await Payment.aggregate([
      { $match: { status: "SUCCESS" } },
      {
        $group: {
          _id: "$course",
          totalRevenue: { $sum: "$finalAmount" },
          totalSales: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 4 },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      { $unwind: "$courseInfo" },
      {
        $project: {
          _id: 0,
          courseId: "$_id",
          name: "$courseInfo.title",
          sales: "$totalSales",
          revenue: "$totalRevenue",
        },
      },
    ]);

    // Compute MoM change per top course
    const topCoursesWithTrend = await Promise.all(
      topCourses.map(async (course) => {
        const [thisM, lastM] = await Promise.all([
          Payment.countDocuments({
            course: course.courseId,
            status: "SUCCESS",
            createdAt: { $gte: thisMonthStart },
          }),
          Payment.countDocuments({
            course: course.courseId,
            status: "SUCCESS",
            createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
          }),
        ]);
        return {
          ...course,
          revenue: `₹${course.revenue.toLocaleString("en-IN")}`,
          change: pctChange(thisM, lastM),
          trend: thisM >= lastM ? "up" : "down",
        };
      })
    );

    // ── 5. RECENT ORDERS ───────────────────────────────────────────────────────
    // Fetch enrollments instead of payments to get proper enrollment IDs
    const recentEnrollmentsForOrders = await Enrollment.find()
      .sort({ enrolledAt: -1 })
      .limit(10)
      .populate("student", "firstName lastName email createdAt")
      .populate({
        path: "payment",
        select: "originalAmount discountAmount finalAmount status couponCode"
      })
      .populate("course", "title")
      .lean();

    const formattedOrders = recentEnrollmentsForOrders.map((enrollment) => {
      // Generate proper enrollment ID using formatEnrollmentId
      const enrollmentId = enrollment.student?._id 
        ? formatEnrollmentId(enrollment.student._id, enrollment.student.createdAt)
        : `KSA-${new Date().getFullYear()}-ENR${enrollment._id.toString().slice(-4).toUpperCase()}`;
      
      return {
        id: enrollmentId,
        customer: enrollment.student
          ? `${enrollment.student.firstName || ""} ${enrollment.student.lastName || ""}`.trim() ||
            enrollment.student.email
          : "N/A",
        course: enrollment.course?.title || "N/A",
        amount: `₹${enrollment.payment?.finalAmount?.toLocaleString("en-IN") || 0}`,
        status: enrollment.status === "ACTIVE" ? "completed" : enrollment.status === "COMPLETED" ? "completed" : "pending",
        date: enrollment.enrolledAt?.toISOString().split("T")[0] || enrollment.createdAt?.toISOString().split("T")[0],
        enrollmentId: enrollment._id,
      };
    });

    // ── 6. RECENT INQUIRIES ────────────────────────────────────────────────────
    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const formattedInquiries = recentInquiries.map((inq) => ({
      id: inq._id,
      name: inq.fullName,
      course: inq.course?.title || "N/A",
      message: inq.message || "No message",
      status: inq.status,
      time: inq.createdAt,
      email: inq.email,
      whatsapp: inq.whatsappNumber,
      level: inq.preferredLevel,
    }));

    // ── 7. ACTIVITY FEED (enrollments + course updates) ───────────────────────
    const [recentEnrollments, recentCourseUpdates] = await Promise.all([
      Enrollment.find()
        .sort({ enrolledAt: -1 })
        .limit(5)
        .populate("student", "firstName lastName email")
        .populate("course", "title")
        .lean(),
      Course.find()
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const enrollmentActivities = recentEnrollments.map((e) => ({
      id: e._id,
      type: "enrollment",
      title: "New Enrollment",
      description: `${
        e.student
          ? `${e.student.firstName || ""} ${e.student.lastName || ""}`.trim() ||
            e.student.email
          : "Student"
      } enrolled in ${e.course?.title || "a course"}`,
      time: e.enrolledAt || e.createdAt,
    }));

    const courseActivities = recentCourseUpdates.map((c) => ({
      id: c._id,
      type: "course",
      title: "Course Updated",
      description: `${c.title} was updated`,
      time: c.updatedAt || c.createdAt,
    }));

    const activityFeed = [...enrollmentActivities, ...courseActivities]
      .filter((a) => a.time)
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 8);

    // ── 8. TOTAL REVENUE ───────────────────────────────────────────────────────
    const [revenueAgg, revenueThisMonthAgg, revenueLastMonthAgg] =
      await Promise.all([
        Payment.aggregate([
          { $match: { status: "SUCCESS" } },
          { $group: { _id: null, total: { $sum: "$finalAmount" } } },
        ]),
        Payment.aggregate([
          {
            $match: {
              status: "SUCCESS",
              createdAt: { $gte: thisMonthStart },
            },
          },
          { $group: { _id: null, total: { $sum: "$finalAmount" } } },
        ]),
        Payment.aggregate([
          {
            $match: {
              status: "SUCCESS",
              createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
            },
          },
          { $group: { _id: null, total: { $sum: "$finalAmount" } } },
        ]),
      ]);

    const totalRevenue = revenueAgg[0]?.total || 0;
    const revenueThisMonth = revenueThisMonthAgg[0]?.total || 0;
    const revenueLastMonth = revenueLastMonthAgg[0]?.total || 0;

    // ── FINAL RESPONSE ─────────────────────────────────────────────────────────
    res.json({
      success: true,
      data: {
        // Stat Cards
        stats: {
          totalCourses: {
            value: totalCourses,
            change: pctChange(coursesThisMonth, coursesLastMonth),
            trend: coursesThisMonth >= coursesLastMonth ? "up" : "down",
          },
          activeStudents: {
            value: activeStudents,
            change: pctChange(studentsThisMonth, studentsLastMonth),
            trend: studentsThisMonth >= studentsLastMonth ? "up" : "down",
          },
          couponsRedeemed: {
            value: totalCouponsRedeemed,
            change: pctChange(couponsThisMonth, couponsLastMonth),
            trend: couponsThisMonth >= couponsLastMonth ? "up" : "down",
          },
          newInquiries: {
            value: newInquiries,
            change: pctChange(inquiriesThisMonth, inquiriesLastMonth),
            trend: inquiriesThisMonth >= inquiriesLastMonth ? "up" : "down",
          },
          totalRevenue: {
            value: `₹${totalRevenue.toLocaleString("en-IN")}`,
            change: pctChange(revenueThisMonth, revenueLastMonth),
            trend: revenueThisMonth >= revenueLastMonth ? "up" : "down",
          },
        },

        // Charts
        revenueChart: formattedRevenueChart,   // for RevnueChart
        salesChart: formattedSalesChart,       // for SalesChart
        salesByCategory: formattedSalesByCategory, // for Sales by Category (pie chart)

        // Tables
        topCourses: topCoursesWithTrend,       // for TableSection type="top"
        recentOrders: formattedOrders,         // for TableSection type="orders"

        // Sidebar / Feed
        recentInquiries: formattedInquiries,   // for ActivityFeed
        activityFeed,                          // for ActivityFeed (merged feed)
      },
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
    });
  }
};