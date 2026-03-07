// hooks/useDashboard.js
import { useState, useEffect } from "react";
import { api } from "./api";

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await api.get("/dashboard/stats", {
          headers: { "Content-Type": "application/json" },
        });
        
        // Log the response for debugging
        console.log("Dashboard API Response:", res.data);
        
        if (res.data && res.data.success && res.data.data) {
          setData(res.data.data);
          
          // Log revenue chart data specifically
          console.log("Revenue Chart Data:", res.data.data.revenueChart);
          console.log("Sales Chart Data:", res.data.data.salesChart);
        } else {
          console.warn("Invalid response structure:", res.data);
          setError("Invalid response from server");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        console.error("Error response:", err.response?.data);
        setError(err?.response?.data?.message || err?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { data, loading, error };
};
