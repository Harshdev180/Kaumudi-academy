// ChartSection.jsx
import React from "react";
import RevnueChart from "./RevnueChart";
import SalesChart from "./SalesChart";

function ChartSection({ revenueChart, salesChart, salesByCategory }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <RevnueChart data={revenueChart} />
      </div>
      <div className="space-y-6">
        <SalesChart data={salesByCategory} />
      </div>
    </div>
  );
}

export default ChartSection;