import React, { useRef, useEffect, useState } from "react";
import {
  Bell,
  Settings,
  BellRing,
  X,
  CreditCard,
  GraduationCap,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { AlertTriangle, TicketPercent, Tag, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../lib/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuthHook";
import { MdMenu } from "react-icons/md";

function Header({ showAlerts, setShowAlerts, mobileOpen, setMobileOpen }) {
  const alertRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeAlertFilter, setActiveAlertFilter] = useState("all");

  // Alert categories
  const alertCategories = [
    { id: "all", label: "All", color: "bg-gray-500" },
    { id: "payment", label: "Payments", color: "bg-green-500" },
    { id: "enrollment", label: "Enrollment", color: "bg-blue-500" },
    { id: "student_query", label: "Student Query", color: "bg-purple-500" },
    { id: "others", label: "Others", color: "bg-orange-500" },
  ];

  useEffect(() => {
    api
      .get("/admin/notifications")
      .then((res) => setNotifications(res.data?.data || []))
      .catch((err) => console.error("Failed to fetch notifications:", err));
  }, []);

  const latestAlerts = notifications.slice(0, 4);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (alertRef.current && !alertRef.current.contains(e.target)) {
        setShowAlerts(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowAlerts]);

  const getAlertIcon = (type) => {
    switch (type) {
      case "coupon":
        return <TicketPercent className="w-4 h-4" />;
      case "payment":
        return <CreditCard className="w-4 h-4" />;
      case "discount":
        return <Tag className="w-4 h-4" />;
      case "inquiry":
        return <Mail className="w-4 h-4" />;
      case "enrollment":
        return <GraduationCap className="w-4 h-4" />;
      case "student_query":
        return <MessageCircle className="w-4 h-4" />;
      case "others":
        return <MoreHorizontal className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const displayName = (() => {
    if (user?.name) return user.name;
    if (user?.firstName || user?.lastName) {
      return [user?.firstName, user?.lastName].filter(Boolean).join(" ");
    }
    if (user?.email) return user.email;
    return "Admin";
  })();

  const displayRole = (() => {
    if (user?.role === "SUPER_ADMIN") return "Admin";
    if (user?.role === "ADMIN") return "Administrator";
    if (user?.role) return user.role.replace(/_/g, " ");
    return "Administrator";
  })();

  const initials = (() => {
    if (user?.name) {
      const parts = user.name.trim().split(/\s+/).filter(Boolean);
      if (parts.length >= 2)
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      if (parts.length === 1 && parts[0])
        return parts[0].slice(0, 2).toUpperCase();
    }
    if (user?.firstName || user?.lastName) {
      const first = user?.firstName?.[0] || "";
      const last = user?.lastName?.[0] || "";
      const combined = `${first}${last}`.trim();
      if (combined) return combined.toUpperCase();
    }
    if (user?.email) {
      const base = user.email.split("@")[0] || "";
      const letters = base.replace(/[^a-zA-Z0-9]/g, "");
      if (letters.length >= 2) return letters.slice(0, 2).toUpperCase();
      if (letters.length === 1) return letters.toUpperCase();
    }
    return "AD";
  })();

  const profileName = loading ? "Loading..." : displayName;
  const profileRole = loading ? "Checking..." : displayRole;
  const profileInitials = loading ? "--" : initials;

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div className="relative z-[9999]">
      {/* ⭐ GOLDEN GLOW TOP BORDER */}
      {/* <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-pulse" /> */}

      <div className="bg-gradient-to-r from-[#74271E] via-[#8a2a1f] to-[#5a1b14] border-b border-[#D4AF37]/20 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* LEFT TITLE */}
          <div className="flex items-center gap-3">
            {isMobile && (
              <motion.button
                onClick={() => setMobileOpen(!mobileOpen)}
                whileTap={{ scale: 0.92 }}
                className="p-2 rounded-lg bg-[#D1B062]/20 text-[#D4AF37] hover:bg-[#D1B062] hover:text-[#6b1d14] transition lg:hidden"
              >
                <MdMenu size={20} />
              </motion.button>
            )}
            <div className="flex flex-col">
              <motion.h1
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className=" text-md md:text-2xl font-black text-white tracking-wide"
              >
                {isMobile ? "Dashboard" : "Admin Dashboard"}
              </motion.h1>

              {!isMobile && (
                <span className="text-[11px] text-[#D4AF37]/80 font-medium">
                  Kaumudi Sanskrit Academy Panel
                </span>
              )}
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            {/*  Alerts */}
            <div className="relative" ref={alertRef}>
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="relative p-2.5 rounded-xl text-[#D4AF37] bg-white/5 hover:bg-[#D4AF37] hover:text-[#74271E] transition"
              >
                <Bell className="w-5 h-5" />

                {notifications.some((n) => !n.isRead) && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white" />
                )}
              </button>

              <AnimatePresence>
                {showAlerts && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed left-1/2 -translate-x-1/2 top-20 w-[92vw] max-w-sm md:absolute md:left-auto md:translate-x-0 md:right-0 md:top-auto md:mt-3 md:w-80 rounded-3xl shadow-xl text-[#6b1d14] overflow-hidden z-[9999]"
                  >
                    <div className="px-5 py-4 flex items-center bg-[#EFE3D5] justify-between">
                      <div className="flex items-start gap-3">
                        <BellRing className="w-5 h-5 text-[#6b1d14]" />
                        <h4 className="font-semibold text-[#6b1d14]">
                          Smart Alerts
                        </h4>
                      </div>

                      <button onClick={() => setShowAlerts(false)}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Category Filter Buttons */}
                    <div className="px-3 py-2 flex flex-wrap gap-2 bg-[#EFE3D5] border-t border-[#74271E]/10">
                      {alertCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveAlertFilter(cat.id)}
                          className={`px-3 py-1 rounded-full text-[10px] font-semibold transition ${
                            activeAlertFilter === cat.id
                              ? "bg-[#74271E] text-white"
                              : "bg-[#74271E]/10 text-[#74271E] hover:bg-[#74271E]/20"
                          }`}
                        >
                          {cat.label.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <div className="px-3 py-2 space-y-2 max-h-72 bg-[#6b1d14] overflow-y-auto">
                      {notifications
                        .filter(
                          (n) =>
                            activeAlertFilter === "all" ||
                            (n.type || "").toUpperCase() ===
                              activeAlertFilter.toUpperCase(),
                        )
                        .slice(0, 4)
                        .map((alert) => (
                          <motion.div
                            key={alert._id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => {
                              setShowAlerts(false);
                              navigate(
                                `/admin/notifications?highlight=${alert._id}`,
                              );
                            }}
                            className="flex items-start gap-3 p-3 rounded-2xl bg-white/80 hover:bg-[#D4AF37] hover:text-[#6b1d14] cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#D4AF37]/20">
                              {getAlertIcon((alert.type || "").toLowerCase())}
                            </div>
                            <div className="flex flex-col">
                              <p className="text-sm font-semibold">
                                {alert.title}
                              </p>
                              <p className="text-xs opacity-70 line-clamp-1">
                                {alert.message}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                    <div
                      onClick={() => {
                        setShowAlerts(false);
                        navigate("/admin/notifications");
                      }}
                      className="px-5 py-3 text-center text-sm text-white bg-[#6b1d14] hover:text-[#D4AF37] cursor-pointer"
                    >
                      View All Notifications →
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ⚙️ Settings */}
            <button
              onClick={() => navigate("/admin/settings")}
              className="p-2.5 rounded-xl text-[#D4AF37] bg-white/5 hover:bg-[#D4AF37] hover:text-[#74271E] transition"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* ⭐ PROFILE AVATAR */}
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-xs font-bold text-[#D4AF37]">
                {profileInitials}
              </div>

              <div className="hidden md:block">
                <p className="text-xs text-white font-semibold">
                  {profileName}
                </p>
                <p className="text-[10px] text-[#D4AF37]/80">{profileRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
