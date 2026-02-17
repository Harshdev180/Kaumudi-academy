import React, { useState } from "react";
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
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuthHook";

function Sidebar({ collapsed, setCollapsed }) {

  const location = useLocation();
  const { user, loading } = useAuth();

  const displayName = (() => {
    if (user?.name) return user.name;
    if (user?.firstName || user?.lastName) {
      return [user?.firstName, user?.lastName].filter(Boolean).join(" ");
    }
    if (user?.email) return user.email;
    return "Admin";
  })();

  const displayRole = (() => {
    if (user?.role === "SUPER_ADMIN") return "Super Admin";
    if (user?.role === "ADMIN") return "Administrator";
    if (user?.role) return user.role.replace(/_/g, " ");
    return "Administrator";
  })();

  const initials = (() => {
    if (user?.name) {
      const parts = user.name.trim().split(/\s+/).filter(Boolean);
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      if (parts.length === 1 && parts[0]) return parts[0].slice(0, 2).toUpperCase();
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

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/admin/lead", label: "Lead Management", icon: <Users size={18} /> },
    { path: "/admin/course", label: "Courses", icon: <BookOpen size={18} /> },
    { path: "/admin/coupon", label: "Coupon", icon: <Tags size={18} /> },
    { path: "/admin/staff-salary", label: "Staff Management", icon: <UserRoundPlus size={18} /> },
    { path: "/admin/student-management", label: "Student Management", icon: <UserRoundPen size={18} /> },
  ];

  return (
    <>
      <div
        className={`${collapsed ? "w-20" : "w-72"}  transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]  bg-[#FBF4E2] text-[#6b1d14]  backdrop-blur-xl border-r border-slate-200/50  flex flex-col h-screen sticky top-0 z-50 relative`}
      >

        {/* Arrow Toggle */}
        <div className="absolute top-4 right-3 z-50">
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
          </button>
        </div>

        {/* LOGO */}
        <div
          className={`border-b border-slate-200/50 flex items-center
          ${collapsed ? "pt-16 pb-6 justify-center" : "p-6"}`}
        >
          <BookOpen className="text-[#6b1d14]" />
          {!collapsed && (
            <div className="ml-3">
              <h1 className="font-serif font-extrabold text-2xl">KAUMUDI</h1>
              <p className="text-[10px] uppercase font-bold tracking-widest">
                Sanskrit Academy
              </p>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <nav
          className={`flex-1 p-4 space-y-2 ${collapsed ? "overflow-hidden" : "overflow-y-auto"
            }`}
        >
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={` relative group flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${isActive ? "bg-[#6b1d14] text-[#D4AF37]" : "hover:bg-[#F3E6C9] text-[#6b1d14]/70"}`}
              >
                {/* ICON */}
                <div
                  className={`${isActive ? "text-[#D4AF37]" : "group-hover:text-[#6b1d14]"
                    }`}
                >
                  {item.icon}
                </div>

                {/* LABEL */}
                {!collapsed && (
                  <span
                    className={`ml-4 text-sm font-semibold ${isActive ? "text-[#D4AF37]" : ""
                      }`}
                  >
                    {item.label}
                  </span>
                )}

                {/* GOLD ACTIVE DOT */}
                {isActive && !collapsed && (
                  <div className="absolute right-4 w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]" />
                )}

                {/* TOOLTIP WHEN COLLAPSED */}
                {collapsed && (
                  <div
                    className=" absolute left-[70px] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap bg-[#6b1d14] text-white shadow-lg opacity-0 translate-x-[-6px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none z-[9999]">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* PROFILE + LOGOUT */}
        {!collapsed && (
          <div className="p-4 border-t border-slate-200/50 bg-[#F3E6C9]/30">
            <div className="flex items-center space-x-3 p-2 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center font-bold text-[#6b1d14]">
                {profileInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#6b1d14] truncate">
                  {profileName}
                </p>
                <p className="text-[10px] text-[#6b1d14]/60 uppercase font-black">
                  {profileRole}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl
              text-red-600 hover:bg-red-50 transition-all font-semibold text-sm"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* LOGOUT MODAL */}
      <AnimatePresence>
        {showLogoutModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] bg-[#FBF4E2] rounded-3xl shadow-2xl z-[1000] p-6 text-center"
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

