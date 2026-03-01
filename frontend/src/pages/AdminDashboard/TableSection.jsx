// TableSection.jsx
import {
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useState } from "react";

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

  // pagination state
  const [topPage, setTopPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const TOP_PER_PAGE = 5;
  const ORDER_PER_PAGE = 8;

  const topTotalPages = Math.max(
    1,
    Math.ceil((topCourses?.length || 0) / TOP_PER_PAGE),
  );
  const orderTotalPages = Math.max(
    1,
    Math.ceil((recentOrders?.length || 0) / ORDER_PER_PAGE),
  );

  const topStart = (topPage - 1) * TOP_PER_PAGE;
  const topSlice = topCourses.slice(topStart, topStart + TOP_PER_PAGE);

  const orderStart = (orderPage - 1) * ORDER_PER_PAGE;
  const orderSlice = recentOrders.slice(orderStart, orderStart + ORDER_PER_PAGE);

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
              <>
                {topSlice.map((course, index) => (
                  <div
                    key={`${course?.name || "course"}-${topStart + index}`}
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
                ))}

                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/50 bg-white/60">
                  <span className="text-xs font-medium text-slate-500">
                    Page {topPage} of {topTotalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTopPage((p) => Math.max(1, p - 1))}
                      disabled={topPage === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-800 transition disabled:opacity-40"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={() =>
                        setTopPage((p) => Math.min(topTotalPages, p + 1))
                      }
                      disabled={topPage === topTotalPages}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-800 transition disabled:opacity-40"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </>
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
              No Enrollments yet
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
                  {orderSlice.map((order, index) => (
                    <tr
                      key={`${order.id}-${orderStart + index}`}
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

              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/50 bg-white/60">
                <span className="text-xs font-medium text-slate-500">
                  Page {orderPage} of {orderTotalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                    disabled={orderPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-800 transition disabled:opacity-40"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() =>
                      setOrderPage((p) => Math.min(orderTotalPages, p + 1))
                    }
                    disabled={orderPage === orderTotalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-800 transition disabled:opacity-40"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default TableSection;
