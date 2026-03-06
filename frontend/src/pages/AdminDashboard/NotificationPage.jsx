import {
  Clock,
  Trash,
  Loader2,
  RefreshCw,
  Bell,
  CreditCard,
  GraduationCap,
  MessageCircle,
  MoreHorizontal,
  CheckCircle,
  X,
  ExternalLink,
  User,
  BookOpen,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../lib/api";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Notification categories with icons and labels
  const categories = [
    { id: "all", label: "All", icon: Bell, color: "bg-gray-500" },
    {
      id: "payment",
      label: "Payments",
      icon: CreditCard,
      color: "bg-[#74271E]",
    },
    {
      id: "enrollment",
      label: "Enrollment",
      icon: GraduationCap,
      color: "bg-green-500",
    },
    {
      id: "student_query",
      label: "Student Query",
      icon: MessageCircle,
      color: "bg-purple-500",
    },
    {
      id: "others",
      label: "Others",
      icon: MoreHorizontal,
      color: "bg-orange-500",
    },
  ];

  // ── Fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, []);

  // Handle highlight parameter from URL (when navigating from Smart Alerts)
  useEffect(() => {
    const highlightId = searchParams.get("highlight");
    if (highlightId && notifications.length > 0) {
      const notificationToHighlight = notifications.find(
        (n) => n.id === highlightId,
      );
      if (notificationToHighlight) {
        setSelectedNotification(notificationToHighlight);
        // Clear the URL parameter after opening
        navigate("/admin/notifications", { replace: true });
      }
    }
  }, [notifications, searchParams]);

  const fetchNotifications = async (
    filter = activeFilter,
    page = currentPage,
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams();
      if (filter !== "all") {
        params.append("type", filter);
      }
      params.append("limit", "10");
      params.append("page", page.toString());

      const res = await api.get(`/admin/notifications?${params.toString()}`);
      const raw = res.data?.data || [];
      const paginationData = res.data?.pagination || {};

      // Update pagination state
      setTotalPages(paginationData.pages || 1);
      setTotal(paginationData.total || 0);
      setCurrentPage(paginationData.page || 1);

      const normalized = raw.map((n) => ({
        id: n._id,
        type: (n.type || "notification").toLowerCase(),
        subType: n.subType || null,
        title: n.title,
        message: n.message,
        priority: n.priority || "MEDIUM",
        actionUrl: n.actionUrl || null,
        metadata: n.metadata || {},
        createdAt: n.createdAt,
        isRead: n.isRead,
      }));

      setNotifications(normalized);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/notifications/stats");
      setStats(res.data?.data || null);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  // Handle filter change
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setCurrentPage(1); // Reset to first page when filter changes
    fetchNotifications(filterId, 1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchNotifications(activeFilter, newPage);
    }
  };

  // ── Mark all as read ────────────────────────────────────────────
  const handleMarkAllRead = async () => {
    try {
      await api.patch("/admin/notifications/read-all");
      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      fetchStats();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeletingId(id);
    // Optimistic remove
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    try {
      await api.delete(`/admin/notifications/${id}`);
      fetchStats();
    } catch (err) {
      console.error("Failed to delete notification:", err);
      // Refetch to restore if failed
      fetchNotifications();
    } finally {
      setDeletingId(null);
    }
  };

  // ── Mark single as read ─────────────────────────────────────────
  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/admin/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      fetchStats();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  // ── Handle notification click ────────────────────────────────────────
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
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

  // ── Relative time helper ─────────────────────────────────────────
  const timeAgo = (dateStr) => {
    if (!dateStr) return "Just now";
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Get badge count for category
  const getBadgeCount = (categoryId) => {
    if (!stats) return 0;
    if (categoryId === "all") return stats.all?.unread || 0;
    return stats[categoryId]?.unread || 0;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "border-l-red-500";
      case "MEDIUM":
        return "border-l-yellow-500";
      case "LOW":
        return "border-l-gray-400";
      default:
        return "border-l-gray-400";
    }
  };

  // Get category icon
  const getCategoryIcon = (type) => {
    const category = categories.find((c) => c.id === type);
    if (category) {
      const Icon = category.icon;
      return <Icon size={16} />;
    }
    return <Bell size={16} />;
  };

  // Get category color
  const getCategoryColor = (type) => {
    const category = categories.find((c) => c.id === type);
    return category?.color || "bg-gray-500";
  };

  // Format notification details for display
  const formatDetails = (notification) => {
    const details = [];
    const { metadata, subType, actionUrl } = notification;

    // Add course and payment details
    if (metadata) {
      if (metadata.courseName)
        details.push({
          label: "Course Name",
          value: metadata.courseName,
          isBold: true,
        });

      // Handle EMI/Installment payments - show total price, total paid, and remaining
      if (
        metadata.totalPrice &&
        (metadata.totalPaid !== undefined ||
          metadata.remainingAmount !== undefined)
      ) {
        details.push({
          label: "Total Price",
          value: `₹${metadata.totalPrice}`,
          isBold: true,
        });
        if (metadata.totalPaid !== undefined) {
          details.push({
            label: "Total Paid",
            value: `₹${metadata.totalPaid}`,
            isBold: true,
          });
        }
        if (
          metadata.remainingAmount !== undefined &&
          metadata.remainingAmount > 0
        ) {
          details.push({
            label: "Remaining",
            value: `₹${metadata.remainingAmount.toFixed(2)}`,
            isBold: true,
          });
        }
      } else if (metadata.totalPrice) {
        // Regular payments - show total, paid, and remaining
        details.push({
          label: "Total Price",
          value: `₹${metadata.totalPrice}`,
          isBold: true,
        });
        // Calculate remaining amount
        const paidAmount =
          metadata.paidPrice || metadata.paidAmount || metadata.amount || 0;
        const remainingAmount = metadata.totalPrice - paidAmount;
        if (remainingAmount > 0) {
          details.push({
            label: "Remaining Amount",
            value: `₹${remainingAmount.toFixed(2)}`,
            isBold: true,
          });
        }
      }

      if (metadata.discountAmount)
        details.push({
          label: "Discount",
          value: `₹${metadata.discountAmount}`,
          isBold: true,
        });
      if (metadata.paidPrice || metadata.paidAmount)
        details.push({
          label: "Paid Price",
          value: `₹${metadata.paidPrice || metadata.paidAmount}`,
          isBold: true,
        });
      if (metadata.paymentId)
        details.push({
          label: "Payment ID",
          value: String(metadata.paymentId).slice(-8),
        });
      if (
        metadata.amount &&
        !metadata.paidPrice &&
        !metadata.paidAmount &&
        !metadata.totalPaid
      )
        details.push({
          label: "Amount Paid",
          value: `₹${metadata.amount}`,
          isBold: true,
        });
      if (metadata.inquiryId)
        details.push({
          label: "Inquiry ID",
          value: String(metadata.inquiryId).slice(-8),
        });
      if (metadata.enrollmentId)
        details.push({
          label: "Enrollment ID",
          value: String(metadata.enrollmentId),
        });
      if (metadata.isTest)
        details.push({ label: "Note", value: "Test Payment" });
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

  return (
    <div className="min-h-screen bg-[#F1E4C8] p-4 md:p-8">
      {/* HEADER */}
      <div className="relative mb-10 rounded-3xl overflow-hidden bg-gradient-to-r from-[#74271E] via-[#8a2a1f] to-[#5a1b14] text-white px-6 md:px-10 py-8 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.25),transparent_60%)]" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wide">
              Academy Notifications
            </h2>
            <p className="text-xs sm:text-sm text-white/80 mt-1">
              Stay updated with academy activities & smart alerts
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => fetchNotifications()}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition"
              title="Refresh"
            >
              <RefreshCw
                size={14}
                sm:size={16}
                className={loading ? "animate-spin" : ""}
              />
            </button>
            <button
              onClick={handleMarkAllRead}
              className="bg-[#D4AF37] hover:bg-[#c9a040] text-[#74271E] font-semibold text-[10px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-full w-fit shadow-md flex items-center gap-1.5 sm:gap-2"
            >
              <CheckCircle size={12} sm:size={14} />
              <span className="hidden xs:inline">Mark All Read</span>
              <span className="xs:hidden">Mark All</span>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        {categories.map((cat) => {
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              onClick={() => handleFilterChange(cat.id)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold transition flex items-center gap-1.5 sm:gap-2 ${
                activeFilter === cat.id
                  ? "bg-[#74271E] text-white"
                  : "bg-[#FBF4E2] text-[#74271E] border border-[#74271E]/20 hover:bg-[#74271E]/10"
              }`}
            >
              <Icon size={12} sm:size={14} />
              {cat.label.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-[#74271E]/60">
          <Loader2 size={36} className="animate-spin text-[#74271E]" />
          <p className="text-sm font-medium">Loading notifications...</p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-red-500 font-semibold">{error}</p>
          <button
            onClick={() => fetchNotifications()}
            className="px-5 py-2 text-sm font-bold text-white bg-[#74271E] rounded-xl hover:bg-[#74271E]/90 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-2 text-[#74271E]/50">
          <Bell size={48} className="opacity-50" />
          <p className="text-xl font-bold text-[#74271E]">No notifications</p>
          <p className="text-sm">Nothing here for the selected filter.</p>
        </div>
      )}

      {/* LIST */}
      {!loading && !error && notifications.length > 0 && (
        <div className="space-y-4">
          <AnimatePresence>
            {notifications.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: 120,
                  scale: 0.95,
                  transition: { duration: 0.35 },
                }}
                whileHover={{ y: -2 }}
                onClick={() => handleNotificationClick(item)}
                className={`border-l-4 ${getPriorityColor(item.priority)} rounded-xl p-3 sm:p-5 flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 shadow-sm hover:shadow-md transition cursor-pointer ${
                  item.isRead ? "bg-[#FBF4E2]/50" : "bg-white"
                }`}
              >
                {/* LEFT */}
                <div className="flex gap-3 sm:gap-4 flex-1">
                  {/* Category Icon */}
                  <div
                    className={`mt-1 p-1.5 sm:p-2 h-full rounded-lg ${getCategoryColor(item.type)} text-white flex-shrink-0`}
                  >
                    {getCategoryIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#74271E]/10 text-[#74271E] font-semibold uppercase">
                        {item.type.replace("_", " ")}
                      </span>
                      {item.priority === "HIGH" && (
                        <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold uppercase">
                          Urgent
                        </span>
                      )}
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                      )}
                    </div>

                    <p className="mt-1.5 sm:mt-2 text-sm font-semibold text-[#5a1b14] truncate">
                      {item.title}
                    </p>

                    {item.message && (
                      <p className="text-xs text-[#74271E]/70 mt-1 line-clamp-2 sm:line-clamp-none">
                        {item.message}
                      </p>
                    )}

                    {/* Metadata display - only show amount, not studentId/courseId */}
                    {item.metadata && item.metadata.amount && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                        <span className="text-[9px] sm:text-[10px] bg-green-100 text-green-600 px-1.5 sm:px-2 py-0.5 rounded">
                          ₹{item.metadata.amount}
                        </span>
                      </div>
                    )}

                    <span className="text-xs text-[#74271E]/50 mt-2 block">
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-auto sm:ml-0">
                  {!item.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(item.id);
                      }}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition"
                      title="Mark as read"
                    >
                      <CheckCircle size={12} sm:size={14} />
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    disabled={deletingId === item.id}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#74271E]/10 text-[#74271E] flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition disabled:opacity-50"
                  >
                    {deletingId === item.id ? (
                      <Loader2
                        size={12}
                        sm:size={14}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash size={12} sm:size={14} />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 sm:mx-auto overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#74271E] to-[#5a1b14] p-4 sm:p-6 text-white flex-shrink-0">
                {/* Type Badge at Top */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-[#D4AF37] text-[#74271E] text-xs font-bold rounded-full uppercase">
                    {selectedNotification.type === "student_query"
                      ? "New Registration"
                      : selectedNotification.type
                          ?.replace("_", " ")
                          .toUpperCase()}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${getCategoryColor(selectedNotification.type)} text-white`}
                    >
                      {getCategoryIcon(selectedNotification.type)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold truncate">
                        {selectedNotification.title}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition flex-shrink-0"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                {/* User Info Section */}
                {selectedNotification.metadata?.userDetails && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-[#74271E]/5 to-[#D4AF37]/5 rounded-xl border border-[#74271E]/10">
                    <p className="text-xs text-[#74271E] font-semibold uppercase mb-2">
                      User Information
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#74271E] text-white flex items-center justify-center font-bold flex-shrink-0">
                        {selectedNotification.metadata.userDetails.name?.charAt(
                          0,
                        ) || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">
                          {selectedNotification.metadata.userDetails.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {selectedNotification.metadata.userDetails.email}
                        </p>
                        {selectedNotification.metadata.userDetails.phone &&
                          selectedNotification.metadata.userDetails.phone !==
                            "N/A" && (
                            <p className="text-sm text-gray-500">
                              {selectedNotification.metadata.userDetails.phone}
                            </p>
                          )}
                        {(selectedNotification.metadata.enrollmentId || selectedNotification.metadata.userDetails?.enrollmentId) && (
                          <p className="text-xs text-[#74271E] font-semibold mt-1">
                            Enrollment ID: {selectedNotification.metadata.enrollmentId || selectedNotification.metadata.userDetails?.enrollmentId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    Message
                  </p>
                  <p className="text-gray-800 break-words">
                    {selectedNotification.message}
                  </p>
                </div>

                {/* Details */}
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    Additional Details
                  </p>
                  <div className="space-y-2">
                    {formatDetails(selectedNotification).map(
                      (detail, index) => (
                        <div
                          key={index}
                          className={`flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm ${detail.isBold ? "bg-gray-50 -mx-2 px-2 py-1 rounded" : ""}`}
                        >
                          <span className="text-gray-500">{detail.label}</span>
                          {detail.isAction ? (
                            <button
                              onClick={(e) =>
                                handleActionClick(e, detail.value)
                              }
                              className="text-[#74271E] font-medium hover:underline flex items-center gap-1 mt-1 sm:mt-0"
                            >
                              {detail.value} <ExternalLink size={12} />
                            </button>
                          ) : (
                            <span
                              className={`text-gray-800 font-medium truncate ${detail.isBold ? "font-bold text-[#74271E]" : ""}`}
                            >
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
              onClick={() => handlePageChange(currentPage - 1)}
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
                    onClick={() => handlePageChange(page)}
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
              onClick={() => handlePageChange(currentPage + 1)}
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
}

export default NotificationsPage;
