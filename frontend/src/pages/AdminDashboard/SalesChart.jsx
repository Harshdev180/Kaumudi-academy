import React, { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    ResponsiveContainer,
    Tooltip,
    Cell,
} from "recharts";
import { motion } from "framer-motion";
import { getCoursesWithEnrollmentCount } from "../../lib/api";

const COLORS = ["#4f7cff", "#8b5cf6", "#22c55e", "#f59e0b", "#FF5B5B", "#14b8a6"];

function SalesChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getCoursesWithEnrollmentCount();
                const payload = response?.data ?? response;
                const courses = Array.isArray(payload) ? payload : payload?.data || [];

                const total = courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0) || 1;

                const chartData = courses
                    .sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0))
                    .slice(0, 5)
                    .map((course, index) => ({
                        name: course.title || "Course",
                        value: Math.round(((course.enrollmentCount || 0) / total) * 100),
                        color: COLORS[index % COLORS.length]
                    }));

                setData(chartData);
            } catch (error) {
                console.error("Failed to load sales chart:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/60 rounded-2xl p-6 border border-slate-200"
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
            >
                <h2 className="text-lg font-bold text-slate-800">
                    Sales by Category
                </h2>
                <p className="text-sm text-slate-500">
                    Course distribution
                </p>
            </motion.div>

            <div className="flex flex-col items-center justify-between">
                {/* Donut Chart */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                    className="h-48 w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                dataKey="value"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={2}
                                stroke="#ffffff"
                                strokeWidth={2}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => `${value}%`}
                                contentStyle={{
                                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                                    border: "none",
                                    borderRadius: "12px",
                                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Legend */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.08,
                                delayChildren: 0.4,
                            },
                        },
                    }}
                    className="space-y-3 mt-4 w-full"
                >
                    {loading && (
                        <div className="text-sm text-slate-500">Loading chart...</div>
                    )}
                    {!loading && data.length === 0 && (
                        <div className="text-sm text-slate-500">No sales data available.</div>
                    )}
                    {!loading && data.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: { opacity: 0, x: -10 },
                                visible: { opacity: 1, x: 0 },
                            }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.03 }}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-3">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-slate-600">
                                    {item.name}
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-slate-800">
                                {item.value}%
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
}

export default SalesChart;
