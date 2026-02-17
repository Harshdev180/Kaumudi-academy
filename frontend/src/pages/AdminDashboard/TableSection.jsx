import { MoreHorizontal, TrendingUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { getAllEnrollments, getCoursesWithEnrollmentCount } from '../../lib/api'

function TableSection() {
    const [recentOrders, setRecentOrders] = useState([]);
    const [topCourses, setTopCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");
                const [enrollRes, coursesRes] = await Promise.all([
                    getAllEnrollments(),
                    getCoursesWithEnrollmentCount()
                ]);

                const enrollmentsPayload = enrollRes?.data ?? enrollRes;
                const enrollments = Array.isArray(enrollmentsPayload)
                    ? enrollmentsPayload
                    : enrollmentsPayload?.data || [];

                const coursesPayload = coursesRes?.data ?? coursesRes;
                const courses = Array.isArray(coursesPayload)
                    ? coursesPayload
                    : coursesPayload?.data || [];

                const coursePriceMap = new Map();
                courses.forEach((course) => {
                    coursePriceMap.set(course._id || course.id, Number(course.price || 0));
                });

                const normalizedOrders = enrollments.slice(0, 8).map((enrollment) => {
                    const student = enrollment.student;
                    const course = enrollment.course;
                    const courseId = course?._id || course;
                    const price = coursePriceMap.get(courseId) || course?.price || 0;
                    const dateValue = enrollment.enrolledAt || enrollment.createdAt;
                    const date = dateValue ? new Date(dateValue).toISOString().slice(0, 10) : "â€”";
                    const statusRaw = enrollment.payment?.status || enrollment.status || "PENDING";
                    const status =
                        statusRaw === "SUCCESS" || statusRaw === "COMPLETED"
                            ? "completed"
                            : statusRaw === "FAILED" || statusRaw === "DROPPED"
                                ? "cancelled"
                                : "pending";

                    return {
                        id: enrollment._id || "â€”",
                        customer: student
                            ? `${student.firstName || ""} ${student.lastName || ""}`.trim() || student.email || "Student"
                            : "Student",
                        course: course?.title || "Course",
                        amount: price ? `â‚¹${price.toLocaleString()}` : "â€”",
                        status,
                        date
                    };
                });

                setRecentOrders(normalizedOrders);

                const sortedCourses = [...courses]
                    .sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0))
                    .slice(0, 5)
                    .map((course) => {
                        const sales = course.enrollmentCount || 0;
                        const revenue = (Number(course.price || 0) * sales) || 0;
                        return {
                            name: course.title || "Course",
                            sales,
                            revenue: revenue ? `â‚¹${revenue.toLocaleString()}` : "â‚¹0",
                            trend: "up",
                            change: "â€”"
                        };
                    });

                setTopCourses(sortedCourses);
            } catch (err) {
                console.error("Failed to load dashboard tables:", err);
                setError("Failed to load table data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="space-y-6">
            {/* ================= Recent Orders ================= */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-200/50 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">
                            Recent Orders
                        </h3>
                        <p className="text-sm text-slate-500">
                            Latest course enrollments
                        </p>
                    </div>
                    <button className="text-[#6b1d14]/70 hover:text-[#6b1d14] text-sm font-medium">
                        View All
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left p-4 text-sm font-semibold text-slate-600">Order ID</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-600">Customer</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-600">Course</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-600">Amount</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-600">Status</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-600">Date</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={7} className="p-6 text-sm text-slate-500">
                                        Loading recent orders...
                                    </td>
                                </tr>
                            )}
                            {!loading && error && (
                                <tr>
                                    <td colSpan={7} className="p-6 text-sm text-red-600">
                                        {error}
                                    </td>
                                </tr>
                            )}
                            {!loading && !error && recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-6 text-sm text-slate-500">
                                        No recent orders found.
                                    </td>
                                </tr>
                            )}
                            {!loading && !error && recentOrders.map((order, index) => (
                                <tr
                                    key={`${order.id}-${index}`}
                                    className="border-b border-slate-200/50 hover:bg-slate-50/50 transition-colors"
                                >
                                    <td className="p-4 text-sm font-medium text-indigo-600">
                                        {order.id}
                                    </td>
                                    <td className="p-4 text-sm text-slate-800">
                                        {order.customer}
                                    </td>
                                    <td className="p-4 text-sm text-slate-800">
                                        {order.course}
                                    </td>
                                    <td className="p-4 text-sm text-slate-800">
                                        {order.amount}
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {order.date}
                                    </td>
                                    <td className="p-4 text-slate-600">
                                        <MoreHorizontal className="w-4 h-4 cursor-pointer" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= Top Course ================= */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-200/50 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">
                            Top Course
                        </h3>
                        <p className="text-sm text-slate-500">
                            Best performing course
                        </p>
                    </div>
                    <button className="text-[#6b1d14]/70 hover:text-[#6b1d14] text-sm font-medium">
                        View All
                    </button>
                </div>

                {/* List */}
                <div className="divide-y divide-slate-100">
                    {topCourses.map((course, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                        >
                            {/* Left */}
                            <div className="min-w-0">
                                <h4 className="text-sm font-semibold text-slate-800 truncate">
                                    {course.name}
                                </h4>
                                <p className="text-sm text-slate-500">
                                    {course.sales} sales
                                </p>
                            </div>

                            {/* Right */}
                            <div className="flex-shrink-0 text-right">
                                <p className="text-sm font-semibold text-slate-800">
                                    {course.revenue}
                                </p>
                                <div className="flex items-center justify-end gap-1 text-emerald-500">
                                    <TrendingUp className="w-3 h-3" />
                                    <span className="text-sm font-medium">
                                        {course.change}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {!loading && !error && topCourses.length === 0 && (
                        <div className="px-6 py-4 text-sm text-slate-500">
                            No course performance data yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TableSection;
