import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  User,
  Settings,
  LogOut,
  Trash2,
  AlertTriangle,
  X,
  Menu,
  IndianRupee,
} from "lucide-react";
import logo from "../../assets/logo-bgremove.webp";
import { motion, AnimatePresence } from "framer-motion";
import wheel from "../../assets/wheel.webp";
import { useAuth } from "../../context/useAuthHook"; //for logout

const Sidebar = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile state

  const menuItems = [
    {
      path: "overview",
      label: "Overview",
      icon: <LayoutDashboard size={20} />,
    },
    { path: "courses", label: "Courses", icon: <BookOpen size={20} /> },
    {
      path: "certificates",
      label: "Certificates",
      icon: <Award size={20} />,
    },
    // { path: "profile", label: "Profile", icon: <User size={20} /> },
    { path: "payments", label: "Payments", icon: <IndianRupee size={20} /> },
    { path: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  const { logout } = useAuth();

  const handleLogout = () => {
    logout("/");
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/user/delete");

      localStorage.removeItem("token");
      navigate("/", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* MOBILE TRIGGER (Visible only on small screens) */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-3 bg-[#74271E] text-white rounded-xl shadow-lg border border-white/10"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR ASIDE */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[60] w-64 bg-[#74271E] text-white flex flex-col shrink-0 shadow-2xl transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* BACKGROUND IMAGE */}
        <motion.div
          initial={{ scale: 1.04, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 bg-center bg-cover pointer-events-none z-0"
          style={{
            backgroundImage: `url(${wheel})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />

        {/* DARK OVERLAY */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-b from-[#3b120e]/80 via-[#5a1e17]/75 to-[#2a0b08]/80 pointer-events-none z-0"
        />

        {/* GOLD RADIAL GLOW */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,177,92,0.18),transparent_70%)] pointer-events-none z-0"
        />

        {/* LOGO SECTION */}
        <div className="px-6 pt-8 pb-6 relative z-10">
          <div className="flex items-center justify-between lg:justify-start gap-3">
            <div className="flex items-center gap-3">
              <div
                className="
                  relative
                  bg-[#74271E]
                  h-12 w-12
                  rounded-xl
                  grid place-items-center
                  text-lg
                  p-1
                  overflow-hidden
                  transition-all duration-500
                  group-hover:scale-110
                  shadow-[0_0_18px_rgba(214,177,92,0.55)]
                  before:absolute before:inset-0
                  before:rounded-xl
                  before:bg-[radial-gradient(circle,rgba(214,177,92,0.55),transparent_70%)]
                  before:opacity-70
                  before:blur-md
                  before:animate-pulse
                "
              >
                <img
                  src={logo}
                  alt="logo"
                  className="relative z-10 brightness-110 contrast-110"
                />
              </div>
              <div>
                <div className="text-sm font-black tracking-widest uppercase">
                  KAUMUDI
                </div>
                <div className="text-[10px] tracking-[0.18em] text-white/75">
                  SANSKRIT ACADEMY
                </div>
              </div>
            </div>
            {/* Close button inside sidebar on Mobile */}
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setIsMobileOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1 relative z-10 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)} // Auto-close on link click
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-[#c9a050] text-[#74271E] font-bold shadow-lg"
                    : "text-white hover:bg-white/20 hover:text-white"
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-sm font-medium tracking-wide">
                {item.label}
              </span>
              {window.location.pathname.includes(item.path) && (
                <span className="ml-auto w-1.5 h-6 rounded-full bg-white/30" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* FOOTER ACTIONS - Stays at bottom */}
        <div className="p-4 mt-auto border-t border-white/10 space-y-1 relative z-10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 group"
          >
            <LogOut
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
            <span className="text-sm font-medium">Logout</span>
          </button>
          {/* <button
            onClick={() => {
              setShowDeleteModal(true);
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center gap-4 px-6 py-3 rounded-xl text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
          >
            <Trash2 size={20} />
            <span className="text-sm font-medium">Delete Account</span>
          </button> */}
        </div>
      </aside>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 text-center space-y-4">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                  <AlertTriangle size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-gray-800">
                    Are you sure?
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    This action is permanent. All your progress, certifications,
                    and course access will be lost forever.
                  </p>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20"
                  >
                    Yes, Delete My Account
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 py-4 px-8 border-t border-gray-100 flex justify-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Action requires irreversible confirmation
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
