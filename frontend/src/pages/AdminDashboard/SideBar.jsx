import React from 'react';
import { MdSupportAgent } from "react-icons/md";
import {
  LayoutDashboard, Users, BookOpen, Settings, ChevronRight, X, LucideMessageCircleQuestionMark
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// import { MdSupportAgent } from "react-icons/md";



const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { path: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: 'lead', label: 'Lead Management', icon: <Users size={18} /> },
    { path: 'course', label: 'Courses Management', icon: <BookOpen size={18} /> },
    // { path: '/admin/inquiry', label: 'Inquiries', icon: <LucideMessageCircleQuestionMark size={18} /> }
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
                w-72 bg-[#FBF4E2] text-[#6b1d14] flex flex-col fixed inset-y-0 left-0 border-r border-gray-300 z-50 
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
              <BookOpen className="text-[#6b1d14]" />
            </div>
            <h1 className="font-serif font-extrabold text-2xl tracking-normal text-[#6b1d14]">
              KAUMUDI
            </h1>
          </div>
          <p className="text-xs text-[#6b1d14] uppercase tracking-[0.1em] font-bold ml-1">
            Sanskrit Academy Admin
          </p>
        </div>


        {/* Navigation (Scrollable Middle Section) */}
        <nav className="px-4 py-6 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
                className={` flex items-center justify-between  px-5 py-3  rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#F3E6C9] border border-[#b8973d]/40 shadow-sm' : 'hover:bg-[#F3E6C9]/60 text-[#6b1d14]/70'}`}>
                <div className="flex items-center gap-4">
                  <div
                    className={` p-2 rounded-xl ${isActive ? 'bg-[#D4AF37] text-[#6b1d14]' : 'bg-white/70 text-[#6b1d14]/70'}`} >
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium tracking-wide">
                    {item.label}
                  </span>
                </div>

                {isActive && (
                  <ChevronRight size={16} className="text-[#b8973d]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Support Section */}
        <div className="p-6 mt-auto border-t border-white/10 bg-[#FBF4E2] sticky bottom-0">
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
