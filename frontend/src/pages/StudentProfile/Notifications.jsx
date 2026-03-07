import React, { useState, useEffect } from "react";
import {
  Bell,
  Check,
  CheckCircle,
  Search,
  Calendar,
  Inbox,
  Loader2,
  CreditCard,
  GraduationCap,
  MessageCircle,
  MoreHorizontal,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

const Notifications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [activeCategory, setActiveCategory] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // Notification categories
  const categories = [
    { id: "all", label: "All" },
    { id: "payment", label: "Payments" },
    { id: "enrollment", label: "Enrollment" },
    { id: "student_query", label: "Queries" },
    { id: "others", label: "Others" },
  ];

  // Get category icon
  const getCategoryIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "payment":
        return <CreditCard size={18} />;
      case "enrollment":
        return <GraduationCap size={18} />;
      case "student_query":
        return <MessageCircle size={18} />;
      default:
        return <MoreHorizontal size={18} />;
    }
  };

  // Get category color
  const getCategoryColor = (type) => {
    switch (type?.toLowerCase()) {
      case "payment":
        return "bg-green-100 text-green-600";
      case "enrollment":
        return "bg-blue-100 text-blue-600";
      case "student_query":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-orange-100 text-orange-600";
    }
  };

  // ── Fetch notifications from backend ──────────────────────────────
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (page = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", page.toString());

      const res = await api.get(`/student/notifications?${params.toString()}`);
      // Backend returns: { success: true, data: [...] }
      const raw = res.data?.data || [];
      const paginationData = res.data?.pagination || {};

      // Update pagination state
      setTotalPages(paginationData.pages || 1);
      setTotal(paginationData.total || 0);
      setCurrentPage(paginationData.page || 1);

      // Normalize backend fields → component fields
      const normalized = raw.map((n) => ({
        id: n._id,
        title: n.title,
        msg: n.message,
        type: (n.type || "others").toLowerCase(),
        subType: n.subType || null,
        actionUrl: n.actionUrl || null,
        priority: n.priority || "MEDIUM",
        date: new Date(n.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        createdAt: n.createdAt,
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
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n)),
    );

    try {
      if (notif.unread) {
        // Call student-specific endpoint
        await api.patch(`/student/notifications/${id}/read`);
      }
    } catch (err) {
      console.error("Failed to update notification:", err);
      // Revert optimistic update on failure
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: notif.unread } : n)),
      );
    }
  };

  // ── Mark all as read ───────────────────────────────────────────────
  const markAllRead = async () => {
    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

    try {
      await api.patch("/student/notifications/read-all");
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      // Refetch to restore correct state
      fetchNotifications();
    }
  };

  // ── Handle notification click ────────────────────────────────────────
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    if (notification.unread) {
      toggleReadStatus(notification.id);
    }
  };

  // ── Handle action click ─────────────────────────────────────────────
  const handleActionClick = (e, actionUrl) => {
    e.stopPropagation();
    if (actionUrl) {
      navigate(actionUrl);
      setSelectedNotification(null);
    }
  };

  // ── Filter ─────────────────────────────────────────────────────────
  const filtered = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.msg?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || n.type === activeCategory;

    const matchesTab =
      activeTab === "All" || (activeTab === "Unread" && n.unread);

    return matchesSearch && matchesCategory && matchesTab;
  });

  // Get unread count
  const unreadCount = notifications.filter((n) => n.unread).length;

  // ── Relative time helper ─────────────────────────────────────────
  const timeAgo = (dateStr) => {
    if (!dateStr) return "Just now";
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Format notification details for display
  const formatDetails = (notification) => {
    const details = [];
    const { metadata, type, subType, actionUrl } = notification;

    // Add user details if available (student's own info)
    if (metadata?.userDetails) {
      const user = metadata.userDetails;
      details.push({ label: "Name", value: user.name || "N/A", isBold: true });
      details.push({ label: "Email", value: user.email || "N/A" });
      if (user.phone && user.phone !== "N/A") {
        details.push({ label: "Phone", value: user.phone });
      }
    }

    // Add type info
    details.push({
      label: "Category",
      value: type?.replace("_", " ").toUpperCase() || "N/A",
    });
    details.push({
      label: "Type",
      value: subType?.replace("_", " ") || "Notification",
    });

    // Add metadata fields
    if (metadata) {
      if (metadata.courseId)
        details.push({
          label: "Course ID",
          value: String(metadata.courseId).slice(-8),
        });
      if (metadata.paymentId)
        details.push({
          label: "Payment ID",
          value: String(metadata.paymentId).slice(-8),
        });
      if (metadata.amount)
        details.push({ label: "Amount", value: `₹${metadata.amount}` });
      if (metadata.enrollmentId)
        details.push({
          label: "Enrollment ID",
          value: String(metadata.enrollmentId),
        });
      if (metadata.response)
        details.push({ label: "Response", value: metadata.response });
    }

    // Add timestamp
    if (notification.createdAt) {
      details.push({
        label: "Received",
        value: new Date(notification.createdAt).toLocaleString(),
      });
    }

    return details;
  };

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto antialiased">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#74271E]">
            My Notifications
          </h1>
          <p className="text-sm text-gray-500">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notifications`
              : "You're all caught up!"}
          </p>
        </div>
        <button
          onClick={markAllRead}
          disabled={loading || unreadCount === 0}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#74271E] bg-[#74271E]/5 hover:bg-[#74271E]/10 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle size={18} /> Mark all read
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setCurrentPage(1); // Reset to first page when category changes
              fetchNotifications(1);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition flex items-center gap-2 ${
              activeCategory === cat.id
                ? "bg-[#74271E] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {cat.label}
            {cat.id !== "all" && getCategoryIcon(cat.id)}
          </button>
        ))}
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
              {tab === "Unread" && unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                  {unreadCount}
                </span>
              )}
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
                  className={`group flex items-start gap-5 p-6 transition-all relative cursor-pointer ${
                    idx !== filtered.length - 1 ? "border-b border-gray-50" : ""
                  } ${notif.unread ? "bg-[#c9a050]/5" : "hover:bg-gray-50/80"}`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  {/* Unread accent bar */}
                  {notif.unread && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#c9a050] rounded-r-full" />
                  )}

                  {/* Category Icon */}
                  <div
                    className={`mt-1 p-3 rounded-2xl shrink-0 transition-all duration-500 ${
                      notif.unread
                        ? getCategoryColor(notif.type)
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {notif.unread ? (
                      getCategoryIcon(notif.type)
                    ) : (
                      <Bell size={22} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-0.5">
                        {/* Category Badge */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium uppercase">
                            {notif.type?.replace("_", " ")}
                          </span>
                          {notif.priority === "HIGH" && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium uppercase">
                              Urgent
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-gray-900 text-sm md:text-base">
                          {notif.title}
                        </h3>
                      </div>

                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>

                    {notif.msg && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {notif.msg}
                      </p>
                    )}

                    {/* Action hint for unread */}
                    {notif.unread && (
                      <span className="text-[10px] text-[#c9a050] font-medium mt-2 block opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to mark as read
                      </span>
                    )}
                  </div>

                  {/* Unread indicator dot */}
                  {notif.unread && (
                    <div className="w-2 h-2 bg-[#c9a050] rounded-full mt-2" />
                  )}
                </motion.div>
              ))
            ) : (
              <div className="py-24 flex flex-col items-center justify-center gap-3 text-gray-400">
                <Inbox size={48} className="opacity-30" />
                <p className="text-base font-semibold text-gray-500">
                  No notifications
                </p>
                <p className="text-sm">
                  {activeCategory !== "all" || searchQuery
                    ? "Try adjusting your filters"
                    : "You're all caught up!"}
                </p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* NOTIFICATION DETAILS MODAL */}
      <AnimatePresence>
        {selectedNotification && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setSelectedNotification(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#74271E] to-[#5a1b14] p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${getCategoryColor(selectedNotification.type)} text-white`}
                    >
                      {getCategoryIcon(selectedNotification.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        {selectedNotification.title}
                      </h3>
                      <p className="text-xs text-white/70 mt-0.5">
                        {selectedNotification.type
                          ?.replace("_", " ")
                          .toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    Message
                  </p>
                  <p className="text-gray-800">
                    {selectedNotification.msg || selectedNotification.message}
                  </p>
                </div>

                {/* Details */}
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    Details
                  </p>
                  <div className="space-y-2">
                    {formatDetails(selectedNotification).map(
                      (detail, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-500">{detail.label}</span>
                          {detail.isAction ? (
                            <button
                              onClick={(e) =>
                                handleActionClick(e, detail.value)
                              }
                              className="text-[#74271E] font-medium hover:underline flex items-center gap-1"
                            >
                              {detail.value} <ExternalLink size={12} />
                            </button>
                          ) : (
                            <span className="text-gray-800 font-medium">
                              {detail.value}
                            </span>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PAGINATION */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * 10 + 1} to{" "}
            {Math.min(currentPage * 10, total)} of {total} notifications
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newPage = currentPage - 1;
                setCurrentPage(newPage);
                fetchNotifications(newPage);
              }}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#74271E]/10 text-[#74271E] hover:bg-[#74271E]/20"
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      fetchNotifications(page);
                    }}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                      page === currentPage
                        ? "bg-[#74271E] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => {
                const newPage = currentPage + 1;
                setCurrentPage(newPage);
                fetchNotifications(newPage);
              }}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#74271E]/10 text-[#74271E] hover:bg-[#74271E]/20"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
