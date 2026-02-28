import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCircle, Search, Calendar, Inbox, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';

const Notifications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch notifications from backend ──────────────────────────────
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/student/notifications");
      // Backend returns: { success: true, data: [...] }
      const raw = res.data?.data || [];
      // Normalize backend fields → component fields
      const normalized = raw.map((n) => ({
        id: n._id,
        title: n.title,
        msg: n.message,
        date: new Date(n.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        type: n.type || "General",
        unread: !n.isRead,
      }));
      setNotifications(normalized);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Mark single notification as read ──────────────────────────────
  const toggleReadStatus = async (id) => {
    const notif = notifications.find((n) => n.id === id);
    if (!notif) return;

    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );

    try {
      if (notif.unread) {
        // Only call API when marking as read (backend doesn't support unread)
        await api.patch(`/admin/notifications/${id}/read`);
      }
    } catch (err) {
      console.error("Failed to update notification:", err);
      // Revert optimistic update on failure
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: notif.unread } : n))
      );
    }
  };

  // ── Mark all as read ───────────────────────────────────────────────
  const markAllRead = async () => {
    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

    try {
      await api.patch("/admin/notifications/read-all");
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      // Refetch to restore correct state
      fetchNotifications();
    }
  };

  // ── Filter ─────────────────────────────────────────────────────────
  const filtered = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.msg.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "All" || (activeTab === "Unread" && n.unread);
    return matchesSearch && matchesTab;
  });

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto antialiased">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-5">
        <div className="space-y-1" />
        <button
          onClick={markAllRead}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#74271E] bg-[#74271E]/5 hover:bg-[#74271E]/10 rounded-xl transition-all active:scale-95 disabled:opacity-50"
        >
          <CheckCircle size={18} /> Mark all read
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center">
        <div className="flex bg-white/50 backdrop-blur-sm border border-gray-200 p-1.5 rounded-2xl w-full sm:w-auto shadow-sm">
          {["All", "Unread"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${
                activeTab === tab
                  ? "bg-[#74271E] text-white shadow-md shadow-[#74271E]/20"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative flex-1 w-full group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c9a050] transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search updates..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-[#c9a050]/10 focus:border-[#c9a050] transition-all text-sm shadow-sm font-medium"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Loading State */}
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 size={36} className="animate-spin text-[#74271E]" />
            <p className="text-sm font-medium">Loading notifications...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="py-24 flex flex-col items-center justify-center text-center px-6 gap-3">
            <p className="text-red-500 font-semibold">{error}</p>
            <button
              onClick={fetchNotifications}
              className="px-4 py-2 text-sm font-bold text-white bg-[#74271E] rounded-xl hover:bg-[#74271E]/90 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Notifications List */}
        {!loading && !error && (
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((notif, idx) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={`group flex items-start gap-5 p-6 transition-all relative ${
                    idx !== filtered.length - 1 ? "border-b border-gray-50" : ""
                  } ${notif.unread ? "bg-[#c9a050]/5" : "hover:bg-gray-50/80"}`}
                >
                  {/* Unread accent bar */}
                  {notif.unread && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#c9a050] rounded-r-full" />
                  )}

                  <div
                    className={`mt-1 p-3 rounded-2xl shrink-0 transition-all duration-500 ${
                      notif.unread
                        ? "bg-[#74271E] text-white shadow-lg shadow-[#74271E]/20"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Bell
                      size={22}
                      className={notif.unread ? "animate-pulse" : ""}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#c9a050]">
                          {notif.type}
                        </span>
                        <h3
                          className={`text-lg font-bold leading-snug transition-colors ${
                            notif.unread ? "text-[#74271E]" : "text-gray-800"
                          }`}
                        >
                          {notif.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 mt-1">
                        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-gray-400 bg-white border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
                          <Calendar size={12} className="text-gray-300" />
                          {notif.date}
                        </div>

                        <button
                          onClick={() => toggleReadStatus(notif.id)}
                          className={`p-2 rounded-xl transition-all duration-300 ${
                            notif.unread
                              ? "text-[#c9a050] hover:bg-[#c9a050] hover:text-white"
                              : "text-green-500 bg-green-50"
                          }`}
                          title={notif.unread ? "Mark as read" : "Already read"}
                        >
                          {notif.unread ? (
                            <Check size={20} />
                          ) : (
                            <CheckCircle size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    <p
                      className={`text-sm mt-2 leading-relaxed max-w-[90%] transition-colors ${
                        notif.unread
                          ? "text-gray-700 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {notif.msg}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 flex flex-col items-center justify-center text-center px-6"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mb-4">
                  <Inbox size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  All caught up!
                </h3>
                <p className="text-gray-500 mt-1 max-w-xs font-medium">
                  No notifications found matching your current filters.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Notifications;