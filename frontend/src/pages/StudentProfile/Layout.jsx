import React, { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Bell, CheckCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../../components/SEO";

const Layout = () => {
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const notifyRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setIsNotifyOpen(false);
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

  const last = (
    location.pathname.split("/").filter(Boolean).pop() || "overview"
  ).toLowerCase();
  const titleMap = {
    overview: "Overview",
    dashboard: "Overview",
    courses: "Courses",
    certifications: "Certifications",
    profile: "Profile",
    payments: "Payments",
    settings: "Settings",
  };
  const pageTitle = titleMap[last] || "Overview";
  const initials = "TS";

  return (
    <div className="flex h-screen bg-[#f7f1e3] font-sans text-gray-800 overflow-hidden">
      <SEO
        title={`Student • ${pageTitle} | Kaumudi Sanskrit Academy`}
        description="Student dashboard area. Personalized overview, courses, certificates, and settings."
        canonicalPath={location.pathname}
        robots="noindex, nofollow"
        og={{ type: "website" }}
      />
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 flex items-center justify-between px-4 md:px-10 bg-gradient-to-r from-[#f3e6c9] to-[#FBF4E2] border-b border-[#e6d5b8]/50 shrink-0 z-40">
          <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left gap-2 font-serif w-full">
            <h2 className="text-2xl font-bold capitalize tracking-tight text-[#74271E]">
              {pageTitle}
            </h2>
            <div className="h-1 w-8 bg-[#c9a050] rounded-full"></div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center bg-white/60 border border-[#e6d5b8] rounded-2xl px-4 py-2 focus-within:bg-white transition-all shadow-sm">
              <ul className="hidden lg:flex items-center gap-10 font-semibold flex-wrap">
                {NAV_ITEMS.map(({ label, to }) => {
                  const isActive = location.pathname === to;
                  return (
                    <li key={label} className="relative">
                      <Link
                        to={to}
                        aria-current={isActive ? "page" : undefined}
                        className="text-sm tracking-wide transition-colors duration-200 ease-out focus:outline-none text-[#74271E] font-bold"
                      >
                        {label}
                      </Link>
                      <motion.span
                        className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[#d6b15c] rounded"
                        variants={underlineVariants}
                        initial="hidden"
                        animate={isActive ? "visible" : "hidden"}
                        transition={{ duration: 0.25 }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex items-center gap-3 md:gap-8">
              <div className="relative" ref={notifyRef}>
                <button
                  onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                  className="relative p-2 text-[#74271E] hover:bg-[#c9a050]/10 rounded-xl transition-colors"
                >
                  <Bell size={22} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#FBF4E2]"></span>
                </button>

                {/* 1. NOTIFICATION DROPDOWN */}
                <AnimatePresence>
                  {isNotifyOpen && (
                    <>
                      {/* MOBILE ONLY BACKDROP - Darkens screen when open on phone */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsNotifyOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 lg:hidden"
                      />

                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="
          /* Position Logic */
          fixed inset-x-4 top-24 mx-auto             /* Mobile: Centered floating */
          lg:absolute lg:inset-x-auto lg:right-0 lg:top-full lg:mt-3 /* Desktop: Under Bell */
          
          /* Size Logic */
          w-auto max-w-[400px] lg:w-[450px] 
          
          /* Styling */
          bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] 
          border border-[#e6d5b8] overflow-hidden z-50
        "
                      >
                        {/* DESKTOP TRIANGLE POINTER */}
                        <div className="hidden lg:block absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 border-l border-t border-[#e6d5b8]" />

                        <div className="relative bg-white">
                          {/* Header */}
                          <div className="p-5 flex justify-between items-center border-b border-gray-50">
                            <div>
                              <h3 className="font-bold text-[#74271E] text-sm tracking-widest uppercase">
                                Notifications
                              </h3>
                              <p className="text-[10px] text-gray-400 font-medium">
                                You have {notifications.length} new updates
                              </p>
                            </div>
                            <button
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                              onClick={() => setIsNotifyOpen(false)}
                            >
                              <X size={18} className="text-gray-400" />
                            </button>
                          </div>

                          {/* List Area */}
                          <div className="max-h-[50vh] lg:max-h-[400px] overflow-y-auto no-scrollbar">
                            {notifications.length > 0 ? (
                              notifications.map((n) => (
                                <div
                                  key={n.id}
                                  onClick={() => {
                                    setSelectedNotification(n);
                                    setIsNotifyOpen(false);
                                  }}
                                  className="p-5 flex gap-4 hover:bg-[#f7f1e3]/40 cursor-pointer border-b border-gray-50 transition-all group"
                                >
                                  <div className="w-11 h-11 bg-[#f7f1e3] rounded-2xl flex items-center justify-center text-[#c9a050] shrink-0 group-hover:bg-[#74271E] group-hover:text-white transition-colors">
                                    <Bell size={18} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                      <p className="font-bold text-sm text-gray-800 truncate group-hover:text-[#74271E]">
                                        {n.title}
                                      </p>
                                      <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap bg-gray-50 px-2 py-0.5 rounded-md">
                                        {n.time}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
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

                          {/* Footer */}
                          <div className="p-3 bg-gray-50/50">
                            <button
                              onClick={() => {
                                navigate("/student/notifications");
                                setIsNotifyOpen(false);
                              }}
                              className="w-full py-3 text-xs font-black tracking-widest text-[#74271E] bg-white border border-[#e6d5b8] rounded-xl shadow-sm hover:shadow-md hover:bg-[#74271E] hover:text-white transition-all uppercase"
                            >
                              View Full History
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
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
