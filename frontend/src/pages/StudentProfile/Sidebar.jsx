import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Award, User, Settings } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { path: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: 'courses', label: 'Courses', icon: <BookOpen size={20} /> },
    { path: 'certifications', label: 'Certifications', icon: <Award size={20} /> },
    { path: 'profile', label: 'Profile', icon: <User size={20} /> },
    { path: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    /* Background changed to #74271E */
    <aside className="w-64 bg-[#74271E] text-white flex flex-col shrink-0 shadow-2xl">
      <div className="p-10 flex flex-col items-center">
        <div className="w-16 h-16 mb-4 text-[#c9a050]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c-1.2 0-2.4.6-3 1.7A3.6 3.6 0 0 0 5 8c0 3 7 13 7 13s7-10 7-13a3.6 3.6 0 0 0-4-3.3c-.6-1-1.8-1.7-3-1.7z" />
            <circle cx="12" cy="8" r="2" />
          </svg>
        </div>
        <h1 className="text-center font-serif text-lg leading-tight tracking-wider text-[#c9a050] uppercase">
          Sanskrit <br /> Academy
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                /* Active state text changed to #74271E */
                ? 'bg-[#c9a050] text-[#74271E] font-bold shadow-lg' 
                : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="text-sm font-medium tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;