import React from "react";
import {
    PieChart,
    Pie,
    ResponsiveContainer,
    Tooltip,
    Cell,
} from "recharts";
import { motion } from "framer-motion";

const data = [
    { name: "Shlok", value: 45, color: "#D4AF37" },
    { name: "Spoken Sanskrit", value: 30, color: "#6b1d14" },
    { name: "Vyakaran Shastra", value: 15, color: "#8A2A1F" },
    { name: "UGC NET", value: 10, color: "#E0B84F" },
    { name: "BA", value: 12, color: "#F3E6C9" },
];

function SalesChart() {
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
                    {data.map((item, index) => (
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
