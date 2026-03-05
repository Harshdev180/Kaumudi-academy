import React from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { motion } from "framer-motion";

// Default fallback data when no API data is available
const defaultData = [
  { name: "No Data", value: 1, color: "#E2E8F0" },
];

function SalesChart({ data }) {
  // Use API data if available, otherwise show default message
  const chartData = data && data.length > 0 ? data : defaultData;

  // Calculate total for percentage
  const total = chartData.reduce((sum, item) => sum + (item.value || 0), 0);

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
        <h2 className="text-lg font-bold text-slate-800">Sales by Faculty</h2>
        <p className="text-sm text-slate-500">Course distribution by instructor</p>
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
                data={chartData}
                cx="50%"
                cy="50%"
                dataKey="value"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                stroke="#ffffff"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
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
                formatter={(value, name, props) => {
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return [`${value} (${percentage}%)`, props.payload.name || "Category"];
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
          {chartData.map((item, index) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
            return (
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
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {item.name === "No Data" ? "—" : `${percentage}%`}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SalesChart;
