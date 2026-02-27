import { Clock, Trash, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { api } from "../../lib/api";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ── Fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/admin/notifications");
      const raw = res.data?.data || [];

      const normalized = raw.map((n) => ({
        id: n._id,
        type: (n.type || "notification").toLowerCase(),
        message: n.title,
        description: n.message,
        user: n.metadata?.user || null,
        inquiryType: n.metadata?.inquiryType || null,
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

  // ── Delete ───────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeletingId(id);
    // Optimistic remove
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    try {
      await api.delete(`/admin/notifications/${id}`);
    } catch (err) {
      console.error("Failed to delete notification:", err);
      // Refetch to restore if failed
      fetchNotifications();
    } finally {
      setDeletingId(null);
    }
  };

  // ── Filter ───────────────────────────────────────────────────────
  const filteredNotifications =
    activeFilter === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  // ── Relative time helper ─────────────────────────────────────────
  const timeAgo = (dateStr) => {
    if (!dateStr) return "Just now";
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#F1E4C8] p-4 md:p-8">

      {/* HEADER */}
      <div className="relative mb-10 rounded-3xl overflow-hidden bg-gradient-to-r from-[#74271E] via-[#8a2a1f] to-[#5a1b14] text-white px-6 md:px-10 py-8 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.25),transparent_60%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-wide">
              Academy Notifications
            </h2>
            <p className="text-sm text-white/80 mt-1">
              Stay updated with academy activities & smart alerts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchNotifications}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <div className="bg-[#D4AF37] text-[#74271E] font-semibold text-xs px-4 py-2 rounded-full w-fit shadow-md">
              Smart Alert Center
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["all", "course", "coupon", "payment", "inquiry"].map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
              activeFilter === type
                ? "bg-[#74271E] text-white"
                : "bg-[#FBF4E2] text-[#74271E] border border-[#74271E]/20"
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
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
            onClick={fetchNotifications}
            className="px-5 py-2 text-sm font-bold text-white bg-[#74271E] rounded-xl hover:bg-[#74271E]/90 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && filteredNotifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-2 text-[#74271E]/50">
          <p className="text-xl font-bold text-[#74271E]">No notifications</p>
          <p className="text-sm">Nothing here for the selected filter.</p>
        </div>
      )}

      {/* LIST */}
      {!loading && !error && (
        <div className="space-y-6">
          <AnimatePresence>
            {filteredNotifications.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 120, scale: 0.95, transition: { duration: 0.35 } }}
                whileHover={{ y: -4 }}
                className={`border border-[#74271E]/10 rounded-2xl p-5 flex justify-between items-start shadow-sm hover:shadow-xl transition ${
                  item.isRead ? "bg-[#FBF4E2]" : "bg-white"
                }`}
              >
                {/* LEFT */}
                <div className="flex gap-4">
                  <div>
                    <span className="text-[11px] px-3 py-[3px] rounded-full bg-[#74271E]/10 text-[#74271E] font-semibold">
                      {item.type || "Notification"}
                    </span>

                    <p className="mt-2 text-sm md:text-base font-semibold text-[#5a1b14]">
                      {item.type === "inquiry" && item.user ? (
                        <>
                          <span className="text-[#74271E] font-bold">{item.user}</span>{" "}
                          • {item.message}
                        </>
                      ) : (
                        item.message
                      )}
                    </p>

                    {item.description && (
                      <p className="text-xs md:text-sm text-[#74271E]/60 mt-1 max-w-xl">
                        {item.description}
                      </p>
                    )}

                    {item.type === "inquiry" && item.inquiryType && (
                      <span className="text-xs text-[#74271E]/80 font-medium block mt-1">
                        Inquiry Type: {item.inquiryType}
                      </span>
                    )}

                    <span className="text-xs text-[#74271E] font-medium mt-2 block">
                      Kaumudi Sanskrit Academy
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-[#74271E]/60">
                    <Clock size={14} />
                    {timeAgo(item.createdAt)}
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="w-9 h-9 rounded-lg bg-[#74271E]/10 text-[#74271E] flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition disabled:opacity-50"
                  >
                    {deletingId === item.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash size={16} />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;