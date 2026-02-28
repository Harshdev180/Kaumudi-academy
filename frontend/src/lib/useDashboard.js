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
        const res = await api.get("/dashboard/stats", {
          headers: { "Content-Type": "application/json" },
        });
        setData(res.data.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { data, loading, error };
};
