// TableSection.jsx
import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import React from "react";

function TableSection({ type, topCourses = [], recentOrders = [] }) {
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
    <>
      {/* ── TOP COURSES ── */}
      {type === "top" && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 overflow-hidden">
          <div className="p-6 border-b border-slate-200/50">
            <h3 className="text-lg font-bold text-slate-800">Top Courses</h3>
            <p className="text-sm text-slate-500">Best performing courses</p>
          </div>

          <div className="divide-y divide-slate-100">
            {topCourses.length === 0 ? (
              <p className="px-6 py-8 text-sm text-center text-slate-400">
                No course data yet
              </p>
            ) : (
              topCourses.slice(0, 5).map((course, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800 truncate">
                      {course.name}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {course.sales} sales
                    </p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-semibold text-slate-800">
                      {course.revenue}
                    </p>
                    <div
                      className={`flex items-center justify-end gap-1 ${
                        course.trend === "up"
                          ? "text-emerald-500"
                          : "text-red-400"
                      }`}
                    >
                      {course.trend === "up" ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span className="text-sm font-medium">
                        {course.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── RECENT ORDERS ── */}
      {type === "orders" && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 overflow-hidden">
          <div className="p-6 border-b border-slate-200/50">
            <h3 className="text-lg font-bold text-slate-800">
              Recent Enrollments
            </h3>
            <p className="text-sm text-slate-500">Latest course purchases</p>
          </div>

          {recentOrders.length === 0 ? (
            <p className="px-6 py-8 text-sm text-center text-slate-400">
              No orders yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {[
                      "Enrollment ID",
                      "Customer",
                      "Course",
                      "Amount",
                      "Status",
                      "Date",
                    ].map((h, i) => (
                      <th
                        key={i}
                        className="text-left p-4 text-sm font-semibold text-slate-600"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order, index) => (
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
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {order.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default TableSection;
