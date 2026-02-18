import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, Award, User, Settings } from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    {
      path: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { path: "courses", label: "Courses", icon: <BookOpen size={20} /> },
    {
      path: "certifications",
      label: "Certifications",
      icon: <Award size={20} />,
    },
    { path: "profile", label: "Profile", icon: <User size={20} /> },
    { path: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    /* Background changed to #74271E */
    <aside className="w-64 bg-[#74271E] text-white flex flex-col shrink-0 shadow-2xl">
      <div className="p-10 flex flex-col items-center">
        <div className="bg-[#d6b15c] text-[#74271E] h-9 w-9 rounded-xl grid place-items-center text-lg shadow-md">
          🪔
        </div>
        <div className="leading-tight">
          <div className="font-black tracking-widest text-white group-hover:text-[#d6b15c] transition">
            KAUMUDI
          </div>
          <div className="text-[11px] tracking-[0.18em] text-white/80">
            SANSKRIT ACADEMY
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? /* Active state text changed to #74271E */
                    "bg-[#c9a050] text-[#74271E] font-bold shadow-lg"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="text-sm font-medium tracking-wide">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
