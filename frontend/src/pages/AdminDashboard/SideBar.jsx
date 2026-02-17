import React from "react";
import {
  BookOpen,
  LayoutDashboard,
  Users,
  Tags,
  ChevronLeft,
  ChevronRight,
  UserRoundPlus,
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
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { path: "/admin/lead", label: "Lead Management", icon: <Users size={18} /> },
    { path: "/admin/course", label: "Courses", icon: <BookOpen size={18} /> },
    { path: "/admin/coupon", label: "Coupon", icon: <Tags size={18} /> },
    { path: "/admin/staff-salary", label: "Staff", icon: <UserRoundPlus size={18} /> },
  ];

  return (
    <div
      className={`
        ${collapsed ? "w-20" : "w-72"}
        transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        bg-[#FBF4E2] text-[#6b1d14]
        backdrop-blur-xl border-r border-slate-200/50
        flex flex-col h-screen sticky top-0 z-50 relative
      `}
    >
      {/* 🔥 Arrow Control */}
      <div className="absolute top-4 right-3 z-50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#6b1d14]/70 hover:text-[#6b1d14]
          transition-all duration-300 hover:scale-110"
        >
          {collapsed ? (
            <ChevronRight className="transition-transform duration-500" size={22} />
          ) : (
            <ChevronLeft className="transition-transform duration-500" size={22} />
          )}
        </button>
      </div>

      {/* Logo Section */}
      <div
        className={`
          border-b border-slate-200/50 flex items-center
          ${collapsed ? "pt-16 pb-6 justify-center" : "p-6"}
          transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        `}
      >
        <div className="flex items-center space-x-3">
          <div
            className="
              w-10 h-10 bg-[#D4AF37] rounded-xl
              flex items-center justify-center shadow-lg
              flex-shrink-0
              transition-transform duration-500
              hover:scale-105
            "
          >
            <BookOpen className="text-[#6b1d14]" />
          </div>

          {/* Smooth fade + slide */}
          <div
            className={`
              overflow-hidden whitespace-nowrap
              transition-all duration-500
              ${collapsed
                ? "opacity-0 translate-x-[-10px] w-0"
                : "opacity-100 translate-x-0 w-auto"}
            `}
          >
            <h1 className="font-serif font-extrabold text-2xl text-[#6b1d14] tracking-normal">
              KAUMUDI
            </h1>
            <p className="text-[10px] text-[#6b1d14]/70 uppercase font-bold tracking-widest">
              Sanskrit Academy
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center group relative px-4 py-3 rounded-2xl
                transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                ${isActive
                  ? "bg-[#6b1d14] text-white shadow-md shadow-[#6b1d14]/20"
                  : "hover:bg-[#F3E6C9] text-[#6b1d14]/70"}
              `}
            >
              <div
                className={`
                  flex items-center justify-center
                  transition-all duration-300
                  ${isActive ? "text-[#D4AF37]" : "group-hover:text-[#6b1d14]"}
                `}
              >
                {item.icon}
              </div>

              {/* Smooth text animation */}
              <span
                className={`
                  ml-4 text-sm font-semibold
                  transition-all duration-500
                  ${collapsed
                    ? "opacity-0 translate-x-[-8px] w-0"
                    : "opacity-100 translate-x-0 w-auto"}
                  ${isActive ? "text-white" : "text-[#6b1d14]/80"}
                `}
              >
                {item.label}
              </span>

              {isActive && !collapsed && (
                <div className="absolute right-4 w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div
        className={`
          transition-all duration-500
          ${collapsed ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"}
        `}
      >
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
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
