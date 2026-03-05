// Dashboard.jsx
import React from "react";
import StatsGrid from "./StatsGrid";
import ChartSection from "./ChartSection";
import TableSection from "./TableSection";
import ActivityFeed from "./ActivityFeed";
import { useDashboard } from "../../lib/useDashboard";
import { Loader2 } from "lucide-react";

function Dashboard() {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-[#6b1d14]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm font-medium text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-sm">
          <p className="text-red-600 font-semibold">Something went wrong</p>
          <p className="text-sm text-red-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsGrid stats={data?.stats} />

      {/* Charts */}
      <ChartSection
        revenueChart={data?.revenueChart}
        salesChart={data?.salesChart}
        salesByCategory={data?.salesByCategory}
      />

      {/* TOP COURSES + INQUIRIES */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TableSection type="top" topCourses={data?.topCourses} />
        </div>
        <ActivityFeed inquiries={data?.recentInquiries} />
      </div>

      {/* RECENT ORDERS FULL WIDTH */}
      <TableSection type="orders" recentOrders={data?.recentOrders} />
    </div>
  );
}

export default Dashboard;