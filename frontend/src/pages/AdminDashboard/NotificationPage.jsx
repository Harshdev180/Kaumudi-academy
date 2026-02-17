import { Clock, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert } from "./Alert";

function NotificationsPage() {

    const navigate = useNavigate();



    // LOCAL STATE
    const [notifications, setNotifications] = useState(Alert);

    // FILTER STATE (Always Active)
    const [activeFilter, setActiveFilter] = useState("all");

    // DELETE FUNCTION
    const handleDelete = (id) => {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
    };

    // DETAIL PAGE NAVIGATION
    const [selectedNotification, setSelectedNotification] = useState(null);

    const openDetail = (item) => {
        setSelectedNotification(item);
    };

    // FILTER LOGIC
    const filteredNotifications =
        activeFilter === "all"
            ? notifications
            : notifications.filter((n) => n.type === activeFilter);

    return (
        <div className="min-h-screen bg-[#F1E4C8] p-4 md:p-8">

            {/* HEADER */}
            <div className="
              relative mb-10 rounded-3xl overflow-hidden
              bg-gradient-to-r from-[#74271E] via-[#8a2a1f] to-[#5a1b14]
              text-white px-6 md:px-10 py-8 shadow-lg">

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

                    <div className="
                      bg-[#D4AF37] text-[#74271E]
                      font-semibold text-xs px-4 py-2
                      rounded-full w-fit shadow-md">
                        Smart Alert Center
                    </div>

                </div>
            </div>

            {/* FILTER BAR  */}
            <div className="flex flex-wrap gap-3 mb-6">
                {["all", "course", "coupon", "payment", "inquiry"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveFilter(type)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition
                            ${activeFilter === type
                                ? "bg-[#74271E] text-white"
                                : "bg-[#FBF4E2] text-[#74271E] border border-[#74271E]/20"
                            }`}
                    >
                        {type.toUpperCase()}
                    </button>
                ))}
            </div>


            {/* LIST */}
            <div className="space-y-6">

                {filteredNotifications.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4 }}
                        onClick={() => openDetail(item)}
                        className="
                          cursor-pointer bg-[#FBF4E2]
                          border border-[#74271E]/10
                          rounded-2xl p-5
                          flex justify-between items-start
                          shadow-sm hover:shadow-xl transition"
                    >

                        {/* LEFT */}
                        <div className="flex gap-4">

                            {/* DELETE BTN */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item.id);
                                }}
                                className="
                                  w-9 h-9 rounded-lg
                                  bg-[#74271E]/10 text-[#74271E]
                                  flex items-center justify-center
                                  hover:bg-red-100 hover:text-red-500 transition">
                                <X size={16} />
                            </button>

                            {/* CONTENT */}
                            <div>

                                <span className="
                                  text-[11px] px-3 py-[3px]
                                  rounded-full bg-[#74271E]/10
                                  text-[#74271E] font-semibold">
                                    {item.type || "Notification"}
                                </span>

                                <p className="mt-2 text-sm md:text-base font-semibold text-[#5a1b14]">
                                    {item.type === "inquiry" ? (
                                        <>
                                            <span className="text-[#74271E] font-bold">
                                                {item.user}
                                            </span>{" "}
                                            • {item.message}
                                        </>
                                    ) : (
                                        item.message
                                    )}
                                </p>

                                <p className="text-xs md:text-sm text-[#74271E]/60 mt-1 max-w-xl">
                                    {item.description}
                                </p>

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
                        <div className="flex items-center gap-2 text-xs text-[#74271E]/60">
                            <Clock size={14} />
                            Just now
                        </div>

                    </motion.div>
                ))}

            </div>
        </div>
    );
}

export default NotificationsPage;
