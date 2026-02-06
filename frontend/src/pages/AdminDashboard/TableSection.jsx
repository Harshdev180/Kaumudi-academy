import { MoreHorizontal, TrendingUp } from 'lucide-react'
import React from 'react'


const recentOrders = [
    {
        id: "#3847",
        customer: "Prakash Bharti",
        course: "Shlok",
        amount: "699/-",
        status: "completed",
        date: "2026-01-15",
    },
    {
        id: "#3848",
        customer: "Shivam Pandey",
        course: "Spoken Sanskrit",
        amount: "2499/-",
        status: "pending",
        date: "2026-01-15",
    },
    {
        id: "#3849",
        customer: "Vishal Sharma",
        course: "Vyakaran Shastra",
        amount: "9599/-",
        status: "completed",
        date: "2026-01-14",
    },
    {
        id: "#3850",
        customer: "Suman Yadav",
        course: "UGC NET",
        amount: "1499/-",
        status: "cancelled",
        date: "2026-01-14",
    },
    {
        id: "#3850",
        customer: "Aman Gupta",
        course: "BA",
        amount: "3999/-",
        status: "cancelled",
        date: "2026-01-14",
    },

];

const topCourses = [
    {
        name: "Spoken Sanskrit",
        sales: 147,
        revenue: "₹12,000",
        trend: "up",
        change: "+12%",
    },
    {
        name: "Vyakaran Shastra",
        sales: 156,
        revenue: "₹12,587",
        trend: "up",
        change: "+8%",
    },
];

function TableSection() {
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
                            Latest course orders
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
                </div>
            </div>
        </div>
    );
}

export default TableSection;
