import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

function RevnueChart() {
    const data = [
        { month: "Jan", revenue: 45000, expenses: 32000 },
        { month: "Feb", revenue: 52000, expenses: 38000 },
        { month: "Mar", revenue: 48000, expenses: 35000 },
        { month: "Apr", revenue: 61000, expenses: 42000 },
        { month: "May", revenue: 55000, expenses: 40000 },
        { month: "Jun", revenue: 67000, expenses: 45000 },
        { month: "Jul", revenue: 72000, expenses: 48000 },
        { month: "Aug", revenue: 69000, expenses: 46000 },
        { month: "Sep", revenue: 78000, expenses: 52000 },
        { month: "Oct", revenue: 74000, expenses: 50000 },
        { month: "Nov", revenue: 82000, expenses: 55000 },
        { month: "Dec", revenue: 89000, expenses: 58000 },
    ];

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
                        Monthly revenue and expenses
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

                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-2"
                    >
                        <div className="w-3 h-3 bg-gradient-to-r from-[#b8973d] to-[#d4af37] rounded-full" />
                        <span className="text-sm text-slate-600">Expenses</span>
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

                            <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8a2a1f" />
                                <stop offset="100%" stopColor="#6b1d14" />
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
                            tickFormatter={(v) => `₹${v / 1000}k`}
                        />
                        <Tooltip
                            formatter={(value) => `₹${value.toLocaleString()}`}
                            cursor={{ fill: "rgba(0,0,0,0.03)" }}
                        />

                        <Bar
                            dataKey="revenue"
                            fill="url(#revenueGradient)"
                            radius={[6, 6, 0, 0]}
                        />
                        <Bar
                            dataKey="expenses"
                            fill="url(#expensesGradient)"
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </motion.div>
    );
}

export default RevnueChart;