import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { getAllEnrollments, getAllCoursesForAdmin } from "../../lib/api";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function RevnueChart() {
    const [data, setData] = useState(MONTHS.map((month) => ({ month, revenue: 0, expenses: 0 })));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                setLoading(true);
                const [enrollRes, coursesRes] = await Promise.all([
                    getAllEnrollments(),
                    getAllCoursesForAdmin()
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

                const monthly = MONTHS.map((month) => ({ month, revenue: 0, expenses: 0 }));

                enrollments.forEach((enrollment) => {
                    const dateValue = enrollment.enrolledAt || enrollment.createdAt;
                    const date = dateValue ? new Date(dateValue) : null;
                    if (!date || Number.isNaN(date.getTime())) return;
                    const monthIndex = date.getMonth();
                    const courseId = enrollment.course?._id || enrollment.course;
                    const price = coursePriceMap.get(courseId) || enrollment.course?.price || 0;
                    monthly[monthIndex].revenue += price;
                });

                setData(monthly);
            } catch (error) {
                console.error("Failed to load revenue chart:", error);
                setData(MONTHS.map((month) => ({ month, revenue: 0, expenses: 0 })));
            } finally {
                setLoading(false);
            }
        };

        fetchRevenue();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/60 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-6"
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between mb-6"
            >
                <div>
                    <h3 className="text-xl font-bold text-slate-800">
                        Revenue Chart
                    </h3>
                    <p className="text-sm text-slate-500">
                        Monthly revenue
                    </p>
                </div>

                {/* Custom Legend */}
                <div className="flex items-center space-x-4">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-2"
                    >
                        <div className="w-3 h-3 bg-gradient-to-r from-[#6b1d14] to-[#8a2a1f] rounded-full" />
                        <span className="text-sm text-slate-600">Revenue</span>
                    </motion.div>
                </div>
            </motion.div>

            {/* Chart */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                className="w-full h-[320px]"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barGap={8}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#d4af37" />
                                <stop offset="100%" stopColor="#b8973d" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `â‚¹${v / 1000}k`}
                        />
                        <Tooltip
                            formatter={(value) => `â‚¹${Number(value).toLocaleString()}`}
                            cursor={{ fill: "rgba(0,0,0,0.03)" }}
                        />

                        <Bar
                            dataKey="revenue"
                            fill="url(#revenueGradient)"
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

            {loading && (
                <div className="mt-4 text-sm text-slate-500">Loading revenue data...</div>
            )}
        </motion.div>
    );
}

export default RevnueChart;
