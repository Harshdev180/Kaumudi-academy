import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

// Fallback data when no API data is available
const fallbackData = [
  { month: "Jan", revenue: 0 },
  { month: "Feb", revenue: 0 },
  { month: "Mar", revenue: 0 },
  { month: "Apr", revenue: 0 },
  { month: "May", revenue: 0 },
  { month: "Jun", revenue: 0 },
  { month: "Jul", revenue: 0 },
  { month: "Aug", revenue: 0 },
  { month: "Sep", revenue: 0 },
  { month: "Oct", revenue: 0 },
  { month: "Nov", revenue: 0 },
  { month: "Dec", revenue: 0 },
];

function RevnueChart({ data: incoming }) {
  // Parse and transform incoming data from backend
  // Backend returns: { month: "Jan", revenue: 50000, orders: 10 }
  const chartData = useMemo(() => {
    if (!incoming || !Array.isArray(incoming) || incoming.length === 0) {
      return fallbackData;
    }
    
    return incoming.map((item) => {
      const month = item.month || "";
      // Handle various possible field names from backend
      const revenue = Number(item.revenue) || Number(item.value) || Number(item.amount) || 0;
      
      return {
        month,
        revenue,
      };
    });
  }, [incoming]);

  // Calculate if we're showing real data or fallback
  const hasRealData = incoming && Array.isArray(incoming) && incoming.length > 0 && incoming.some(item => (item.revenue || 0) > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/60 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-4 md:p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
      >
        <div>
          <h3 className="text-lg md:text-xl font-bold text-slate-800">
            Revenue Chart
          </h3>
          <p className="text-xs md:text-sm text-slate-500">
            {hasRealData ? "Monthly revenue from payments" : "No revenue data available"}
          </p>
        </div>

        {/* Custom Legend */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:space-x-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex items-center space-x-2"
          >
            <div className="w-3 h-3 bg-gradient-to-r from-[#6b1d14] to-[#8a2a1f] rounded-full" />
            <span className="text-xs md:text-sm text-slate-600">Revenue</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
        className="w-full h-[250px] md:h-[320px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barGap={4}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
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
              tick={{ fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v / 1000}k`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString()}`}
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
              contentStyle={{ fontSize: "12px" }}
            />

          <Bar
              dataKey="revenue"
              fill="url(#revenueGradient)"
              radius={[6, 6, 0, 0]}
              name="Revenue"
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}

export default RevnueChart;
