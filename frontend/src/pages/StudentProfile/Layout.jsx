import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./SideBar";
import { Bell, CheckCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/useAuthHook";

const Layout = () => {
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // mobile nav state
  const navigate = useNavigate();
  const location = useLocation();
  const notifyRef = useRef(null);
  const menuRef = useRef(null);
  const { user } = useAuth();

  const underlineVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: { width: "100%", opacity: 1 },
  };

  const NAV_ITEMS = [
    { label: "Home", to: "/" },
    { label: "Courses", to: "/allcourses" },
    { label: "About", to: "/about" },
    { label: "Faculty", to: "/faculty" },
    { label: "Contact", to: "/contact" },
  ];

  // Close dropdown when clicking outside (notifications & mobile menu)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setIsNotifyOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mock Data for Sanskrit Academy
  const notifications = [
    {
      id: 1,
      title: "Course Fee Paid",
      subtitle: "Level 1: Pravesha - Confirmed",
      time: "2 hours ago",
      details: {
        course: "Pravesha",
        amount: "₹5000",
        status: "Success",
        date: "25 Feb 2026",
      },
    },
    {
      id: 2,
      title: "New Study Material",
      subtitle: "Shloka Chanting PDF uploaded",
      time: "1 day ago",
      details: { material: "Bhagavad Gita Ch 2", format: "PDF", size: "1.2MB" },
    },
    {
      id: 3,
      title: "Class Rescheduled",
      subtitle: "Sanskrit Grammar moved to 5 PM",
      time: "2 days ago",
      details: { original: "4 PM", new: "5 PM", instructor: "Acharya Ram" },
    },
  ];

  const pageTitle = location.pathname.split("/").pop() || "Overview";

  const fullName = useMemo(() => {
    if (!user) return "Student";

    if (user.name) return user.name;

    const first = user.firstName || "";
    const last = user.lastName || "";

    return [first, last].filter(Boolean).join(" ").trim() || "Student";
  }, [user]);

  const initials = React.useMemo(() => {
    if (!user) return "ST";

    if (user.name) {
      const parts = user.name.trim().split(" ");
      return parts.length === 1
        ? parts[0][0]?.toUpperCase()
        : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";

    return (first + last).toUpperCase() || "ST";
  }, [user]);

  // close mobile menu on navigation change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#f7f1e3] font-sans text-gray-800 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <header
          className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between 
    gap-4 sm:gap-0 
    px-4 sm:px-6 md:px-10 
    py-4 sm:py-0 
    sm:h-20
    bg-gradient-to-r from-[#f3e6c9] to-[#FBF4E2] 
    border-b border-[#e6d5b8]/50 
    shrink-0 z-40"
        >
          {/* LEFT SECTION */}
          <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
            <div className="flex flex-col min-w-0">
              <h2
                className="text-lg sm:text-xl md:text-2xl font-bold capitalize 
          tracking-tight text-[#74271E] truncate"
              >
                {pageTitle}
              </h2>
              <div className="h-1 w-8 bg-[#c9a050] rounded-full mt-1"></div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 md:gap-8 w-full sm:w-auto">
            {/* NAVIGATION for desktop */}
            <div
              className="hidden md:flex items-center bg-white/60 border 
        border-[#e6d5b8] rounded-2xl px-4 py-2 
        focus-within:bg-white transition-all duration-300 shadow-sm"
            >
              <ul className="flex items-center gap-6 lg:gap-10 font-semibold whitespace-nowrap overflow-x-auto no-scrollbar">
                {NAV_ITEMS.map(({ label, to }) => {
                  const isActive = location.pathname === to;
                  return (
                    <li key={label} className="relative">
                      <Link
                        to={to}
                        aria-current={isActive ? "page" : undefined}
                        className="text-sm tracking-wide transition-colors duration-300 
                    ease-out focus:outline-none text-[#74271E] font-bold"
                      >
                        {label}
                      </Link>

                      <motion.span
                        className="absolute left-0 right-0 -bottom-1 h-[2px] 
                    bg-[#d6b15c] rounded"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isActive ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ originX: 0 }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsMenuOpen((p) => !p)}
              className="md:hidden p-2 text-[#74271E] hover:bg-[#c9a050]/10 rounded-xl transition-all duration-300"
            >
              <span className="sr-only">Toggle navigation</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* MOBILE NAV OVERLAY */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                  onClick={() => setIsMenuOpen(false)}
                />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.nav
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  ref={menuRef}
                  className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 p-6 overflow-y-auto"
                >
                  <ul className="space-y-6">
                    {NAV_ITEMS.map(({ label, to }) => (
                      <li key={label}>
                        <Link
                          to={to}
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-lg font-semibold text-[#74271E]"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.nav>
              )}
            </AnimatePresence>

            {/* NOTIFICATION */}
            <div className="relative" ref={notifyRef}>
              <button
                onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                className="relative p-2 sm:p-3 text-[#74271E] 
            hover:bg-[#c9a050]/10 rounded-xl 
            transition-all duration-300"
              >
                <Bell size={22} />
                <span
                  className="absolute top-2.5 right-2.5 w-2 h-2 
            bg-red-500 rounded-full border-2 border-[#FBF4E2]"
                />
              </button>

              <AnimatePresence>
                {isNotifyOpen && (
                  <>
                    {/* MOBILE BACKDROP */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setIsNotifyOpen(false)}
                      className="fixed inset-0 bg-black/30 backdrop-blur-sm 
                  z-40 lg:hidden"
                    />

                    {/* DROPDOWN */}
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                      className="
                  fixed inset-x-4 top-24 mx-auto
                  sm:top-28
                  lg:absolute lg:inset-x-auto lg:right-0 lg:top-full lg:mt-3
                  w-auto max-w-[95%] sm:max-w-[420px] lg:w-[450px]
                  bg-white rounded-3xl
                  shadow-[0_25px_60px_rgba(0,0,0,0.18)]
                  border border-[#e6d5b8]
                  overflow-hidden z-50
                "
                    >
                      {/* Desktop pointer */}
                      <div
                        className="hidden lg:block absolute -top-2 right-6 
                  w-4 h-4 bg-white rotate-45 
                  border-l border-t border-[#e6d5b8]"
                      />

                      {/* Header */}
                      <div
                        className="p-4 sm:p-5 flex justify-between items-center 
                  border-b border-gray-100"
                      >
                        <div>
                          <h3
                            className="font-bold text-[#74271E] text-xs sm:text-sm 
                      tracking-widest uppercase"
                          >
                            Notifications
                          </h3>
                          <p className="text-[10px] text-gray-400 font-medium">
                            {notifications.length} new updates
                          </p>
                        </div>

                        <button
                          onClick={() => setIsNotifyOpen(false)}
                          className="p-2 hover:bg-gray-100 rounded-full 
                      transition-colors duration-200"
                        >
                          <X size={18} className="text-gray-400" />
                        </button>
                      </div>

                      {/* LIST */}
                      <div
                        className="max-h-[55vh] lg:max-h-[400px] 
                  overflow-y-auto no-scrollbar"
                      >
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                setSelectedNotification(n);
                                setIsNotifyOpen(false);
                              }}
                              className="p-4 sm:p-5 flex gap-4 
                          hover:bg-[#f7f1e3]/40 
                          cursor-pointer border-b border-gray-50 
                          transition-all duration-200 group"
                            >
                              <div
                                className="w-10 h-10 sm:w-11 sm:h-11 
                          bg-[#f7f1e3] rounded-2xl 
                          flex items-center justify-center 
                          text-[#c9a050] shrink-0 
                          group-hover:bg-[#74271E] 
                          group-hover:text-white 
                          transition-colors"
                              >
                                <Bell size={18} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                  <p
                                    className="font-bold text-sm text-gray-800 
                              truncate group-hover:text-[#74271E]"
                                  >
                                    {n.title}
                                  </p>
                                  <span
                                    className="text-[10px] text-gray-400 
                              font-bold whitespace-nowrap 
                              bg-gray-50 px-2 py-0.5 rounded-md"
                                  >
                                    {n.time}
                                  </span>
                                </div>

                                <p
                                  className="text-xs text-gray-500 mt-1 
                            line-clamp-1"
                                >
                                  {n.subtitle}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-10 text-center text-gray-400">
                            No new notifications
                          </div>
                        )}
                      </div>

                      {/* FOOTER */}
                      <div className="p-3 bg-gray-50/50">
                        <button
                          onClick={() => {
                            navigate("/student/notifications");
                            setIsNotifyOpen(false);
                          }}
                          className="w-full py-3 text-xs font-black tracking-widest 
                      text-[#74271E] bg-white border border-[#e6d5b8] 
                      rounded-xl shadow-sm 
                      hover:shadow-md hover:bg-[#74271E] 
                      hover:text-white transition-all uppercase"
                        >
                          View Full History
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="w-11 h-11 rounded-2xl border-2 border-[#e6d5b8] shadow-md overflow-hidden bg-[#74271E]/90 grid place-items-center text-white font-bold">
              <span>{initials}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-10 pb-10 pt-6">
          <Outlet />
        </main>

        {/* 2. NOTIFICATION DETAIL CARD (MODAL) */}
        <AnimatePresence>
          {selectedNotification && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden"
              >
                <div className="bg-[#74271E] p-4 flex justify-between items-center text-white">
                  <div className="flex items-center gap-2">
                    <Info size={18} className="text-[#c9a050]" />
                    <span className="text-sm font-medium">Notification</span>
                  </div>
                  <button onClick={() => setSelectedNotification(null)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#74271E]">
                    {selectedNotification.title}
                  </h3>
                  <div className="mt-6 bg-[#f7f1e3]/30 border border-[#e6d5b8]/30 rounded-2xl p-6">
                    <div className="space-y-3 text-sm">
                      {Object.entries(selectedNotification.details).map(
                        ([key, value]) => (
                          <div className="flex justify-between" key={key}>
                            <span className="capitalize text-gray-400">
                              {key}:
                            </span>
                            <span className="font-bold text-gray-700">
                              {value}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={() => setSelectedNotification(null)}
                      className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                    >
                      Close
                    </button>

                    <button
                      onClick={() => {
                        navigate("/student/notifications"); // Redirects to the history page
                        setSelectedNotification(null); // Closes the modal
                      }}
                      className="flex-1 py-3 font-bold bg-[#c9a050] text-[#74271E] rounded-xl shadow-lg shadow-[#c9a050]/30 active:scale-95 transition-all"
                    >
                      See History
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Layout;
