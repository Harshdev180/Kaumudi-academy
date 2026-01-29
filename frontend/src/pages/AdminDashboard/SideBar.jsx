import React from "react";
import { MdSupportAgent } from "react-icons/md";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  ChevronRight,
  X, // Close icon mobile ke liye
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// isOpen aur toggleSidebar props layout se aayenge
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/admin/lead",
      label: "Lead Management",
      icon: <Users size={20} />,
    },
    {
      path: "/admin/courses",
      label: "Courses Management",
      icon: <BookOpen size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile Overlay: Jab sidebar khulega toh piche ka area dark ho jayega */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Main Container */}
      <aside
        className={`
                w-72 bg-[#fef0c6] text-[#6b1d14] flex flex-col fixed inset-y-0 left-0 shadow-2xl z-50 
                transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                md:translate-x-0
            `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden absolute right-4 top-8 p-2 text-white/50 hover:text-white"
        >
          <X size={24} />
        </button>

        {/* Academy Branding Section */}
        <div className="p-8 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#D4AF37] p-2 rounded-xl shadow-inner">
              <BookOpen className="text-[#8B6A21]" />
            </div>
            <h1 className="font-serif font-extrabold text-2xl tracking-normal text-[#6b1d14]">
              KAUMUDI
            </h1>
          </div>
          <p className="text-xs text-[#6b1d14] uppercase tracking-[0.1em] font-bold ml-1">
            Sanskrit Academy Admin
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar py-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) toggleSidebar();
                }}
                className={`flex items-center justify-between p-4 rounded-r-2xl transition-all duration-300 group ${
                  isActive
                    ? "bg-[#D4AF37]/70 border border-[#6b1d14] text-[#6b1d14] font-bold shadow-lg translate-x-2"
                    : "hover:bg-white/10 text-[#6b1d14] hover:text-[#6b1d14]"
                }`}
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span className="text-sm tracking-wide">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Support Section */}
        <div className="p-6 mt-auto border-t border-white/10 bg-[#fef0c6] sticky bottom-0">
          <Link
            to="/admin/settings"
            className="flex items-center gap-4 p-4 text-[#6b1d14] hover:text-black transition-colors text-sm"
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <button className="w-full mt-4 flex items-center justify-center gap-2 bg-[#F3E6C9] hover:bg-[#D4AF37] hover:text-black text-[#6b1d14] py-4 rounded-2xl text-xs font-bold transition-all border border-[#D4AF37]/20 shadow-md">
            <MdSupportAgent size={18} />
            <span>Support</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
