import React from 'react';
import { MdSupportAgent } from "react-icons/md";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    TicketPercent,
    Settings,
    ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    // Navigation Items array for easy maintenance
    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        // { path: '/admin/course-management', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/leads', label: 'Lead Management', icon: <Users size={20} /> },
        { path: '/admin/courses', label: 'Courses Management', icon: <BookOpen size={20} /> },
        { path: '/admin/coupons', label: 'Coupons & Discounts', icon: <TicketPercent size={20} /> },
    ];

    return (
        <aside className="w-72 bg-[#641e16] text-white hidden md:flex flex-col fixed h-screen shadow-2xl z-50">

            {/* Academy Branding Section */}
            <div className="p-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#D4AF37] p-2 rounded-xl shadow-inner">
                        <BookOpen className="text-[#641e16]" />
                    </div>
                    <h1 className="font-serif font-black text-xl tracking-tight text-[#FFFDF8]">
                        KAUMUDI
                    </h1>
                </div>
                <p className="text-[10px] text-orange-200/50 uppercase tracking-[0.3em] font-bold ml-1">
                    Sanskrit Academy Admin
                </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-[#D4AF37] text-[#641e16] font-bold shadow-lg translate-x-2'
                                : 'hover:bg-white/10 text-orange-100/70 hover:text-white'
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

            {/* Bottom  */}
            <div className="p-6 mt-auto border-t border-white/10 bg-[#541912]">
                <Link
                    to="/admin/settings"
                    className="flex items-center gap-4 p-4 text-orange-100/50 hover:text-white transition-colors text-sm"
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </Link>
                <button className="w-full mt-4 flex items-center justify-center gap-2 bg-[#D4AF37]/10 hover:bg-white hover:text-black text-[#D4AF37] py-4 rounded-2xl text-xs font-bold transition-all border border-[#D4AF37]/20">
                    {/* <LogOut  /> */}
                    <MdSupportAgent size={18} />
                    <span>Support</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;