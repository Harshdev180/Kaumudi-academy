import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  LayoutDashboard,
  Users,
  Tags,
  ChevronLeft,
  ChevronRight,
  UserRoundPlus,
  LogOut,
  UserRoundPen,
  Menu,
  X,
  BookUser,
  UserStar,
  Image,
} from "lucide-react";
import logo from "../../assets/logo-bgremove.webp";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuthHook";

function Sidebar({
  collapsed,
  setCollapsed,
  isMobile,
  mobileOpen,
  setMobileOpen,
}) {
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // whenever screen resizes to desktop ensure sidebar is closed (this mirrors
  // behaviour in layout and avoids leaving mobileOpen true on wide screens)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen, setMobileOpen]);

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

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout("/admin-login");
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      path: "/admin/student-inquiry",
      label: "Student Inquiry",
      icon: <Users size={18} />,
    },
    {
      path: "/admin/faculty-management",
      label: "Faculty Management",
      icon: <UserStar size={18} />,
    },
    { path: "/admin/course", label: "Courses", icon: <BookOpen size={18} /> },
    { path: "/admin/coupon", label: "Coupon", icon: <Tags size={18} /> },
    // { path: "/admin/staff-salary", label: "Staff Management", icon: <UserRoundPlus size={18} /> },
    {
      path: "/admin/student-management",
      label: "Student Management",
      icon: <UserRoundPen size={18} />,
    },
    {
      path: "/admin/enroll-students",
      label: "Student Fees ",
      icon: <BookUser size={18} />,
    },
    // {
    //   path: "/admin/gallery",
    //   label: "Gallery",
    //   icon: <Image size={18} />,
    // },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setMobileOpen(false);
              setCollapsed(true);
            }}
            className="fixed inset-0 bg-black/40 z-[998] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.div
        initial={false}
        animate={{
          x: isMobile ? (mobileOpen ? 0 : -288) : 0,

          // ⭐ MOBILE PAR COLLAPSE IGNORE
          width: isMobile ? 288 : collapsed ? 80 : 288,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 45, mass: 1 }}
        className="fixed lg:sticky top-0 left-0 h-screen z-[999]
  bg-[#FBF4E2] text-[#6b1d14]
  border-r border-slate-200/50
  flex flex-col flex-shrink-0 lg:translate-x-0 overflow-hidden"
      >
        {/* CLOSE BTN MOBILE */}
        <div className="lg:hidden absolute top-4 right-4">
          <button
            onClick={() => {
              setMobileOpen(false);
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* DESKTOP COLLAPSE BUTTON */}
        <div className="hidden lg:block absolute top-4 right-3 z-50">
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
          </button>
        </div>

        {/* LOGO */}
        <motion.div
          layout // animate padding/justify changes
          className={`border-b border-slate-200/50 flex items-center ${collapsed ? "pt-16 pb-6 justify-center" : "p-6"}`}
        >
          <motion.div
            layout // animate size/scale
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
              className="relative z-10 brightness-110 contrast-110 object-contain h-full w-full"
            />
          </motion.div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3"
              >
                <h1 className="font-serif font-extrabold text-2xl">KAUMUDI</h1>
                <p className="text-[10px] uppercase font-bold tracking-widest">
                  Sanskrit Academy
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* NAVIGATION */}
        <nav
          className={`flex-1 p-4 space-y-2 ${collapsed ? "overflow-hidden" : "overflow-y-auto"}`}
        >
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  setMobileOpen(false);
                }}
                className={`relative group flex items-center px-4 py-3 rounded-2xl transition-all duration-300
                ${
                  isActive
                    ? "bg-[#6b1d14] text-[#D4AF37]"
                    : "hover:bg-[#F3E6C9] text-[#6b1d14]/70"
                }`}
              >
                <div>{item.icon}</div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="ml-4 text-sm font-semibold"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* PROFILE + LOGOUT ICON */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="p-4 border-t border-slate-200/50 bg-[#F3E6C9]/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center font-bold">
                    {profileInitials}
                  </div>

                  <div>
                    <p className="text-sm font-bold">{profileName}</p>
                    <p className="text-[10px] uppercase font-black text-[#6b1d14]/60">
                      {profileRole}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* LOGOUT MODAL SAME (UNCHANGED) */}
      <AnimatePresence>
        {showLogoutModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-999"
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-90 bg-[#FBF4E2] rounded-3xl shadow-2xl z-[1000] p-6 text-center"
            >
              <h2 className="text-xl font-bold text-[#6b1d14] mb-2">
                Confirm Logout
              </h2>

              <p className="text-sm text-[#856966] mb-6">
                Are you sure you want to logout from admin panel?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#EFE3D5]"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmLogout}
                  className="flex-1 py-3 rounded-xl text-white bg-[#6b1d14]"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
