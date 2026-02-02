import React from 'react';
import { motion } from 'framer-motion';
import {
    MdSearch, MdNotifications, MdChatBubbleOutline, MdKeyboardArrowDown,
    MdMenuBook, MdPeopleOutline, MdConfirmationNumber, MdMailOutline,
    MdTrendingUp, MdBarChart, MdChevronLeft, MdChevronRight
} from 'react-icons/md';

const Dashboard = () => {
    // EXACT COLOR PALETTE
    const theme = {
        primaryGold: "#b8973d",
        accentDark: "#8B6A21",
        parchment: "#FBF4E2",
        bgLight: "#f1e4c8",
        bgDark: "#1e1b14",
        chartGold: "#D4AF37",
        chartDark: "#2C261D",
        chartMuted: "#A68942",
        chartSlate: "#4A453E",
        chartSage: "#6B705C",
        textDark: "#6b1d14"
    };

    const stats = [
        { title: "TOTAL COURSES", value: "42", change: "+5%", icon: <MdMenuBook /> },
        { title: "ACTIVE STUDENTS", value: "1,280", change: "-2%", icon: <MdPeopleOutline /> },
        { title: "COUPONS", value: "156", change: "+12%", icon: <MdConfirmationNumber /> },
        { title: "INQUIRIES", value: "12", change: "NEW", icon: <MdMailOutline /> },
    ];

    return (
        <div className="min-h-screen p-4 sm:p-8 font-serif" style={{ backgroundColor: theme.bgLight, backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')` }}>
            {/* 1. TOP NAVIGATION BAR */}
            <header className="flex items-center justify-between mb-10 bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm">
                <div className="relative w-full max-w-md">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl" style={{ color: theme.textMuted }} />
                    <input
                        type="text"
                        placeholder="Search insights..."
                        className="w-full bg-[#FBF4E2]/40 border-none rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-1 transition-all"
                        style={{ focusRingColor: theme.primary }}
                    />
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex gap-2">
                        <button className="p-2 rounded-xl bg-white border border-[#D1B062]/30 shadow-sm"><MdNotifications className="text-xl" /></button>
                        <button className="p-2 rounded-xl bg-white border border-[#D1B062]/30 shadow-sm"><MdChatBubbleOutline className="text-xl" /></button>
                    </div>
                    <div className="flex items-center gap-3 border-l pl-6" style={{ borderColor: theme.goldDivider + '40' }}>
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold leading-none" style={{ color: theme.textDark }}>Acharya Sharma</p>
                            <p className="text-[10px] font-medium mt-1 uppercase" style={{ color: theme.textMuted }}>Head Administrator</p>
                        </div>
                        <div className="size-10 rounded-full border-2 p-0.5 shadow-md" style={{ borderColor: theme.primary }}>
                            <img src="https://ui-avatars.com/api/?name=Acharya+Sharma&background=b8973d&color=fff" className="rounded-full" alt="profile" />
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. PAGE HEADING & ACTION */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ color: theme.accentDark }}>Academy Overview</h1>
                    <p className="text-sm italic" style={{ color: theme.textMuted }}>Elevating Sanskrit education with modern tech.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2 rounded-xl bg-white border text-xs font-bold flex items-center gap-2 shadow-sm" style={{ borderColor: theme.goldDivider }}>
                        THIS MONTH <MdKeyboardArrowDown />
                    </button>
                    <button className="px-5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-lg hover:opacity-90 transition-all" style={{ backgroundColor: theme.textDark }}>
                        + New Course
                    </button>
                </div>
            </div>

            {/* 3. STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <motion.div
                        whileHover={{ y: -5 }}
                        key={idx}
                        className="p-6 rounded-[2rem] bg-white/10 border border-[#6b1d14]/20 shadow-xl shadow-[#D1B062]/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.change === 'NEW' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="size-10 rounded-xl flex items-center justify-center text-xl text[#6b1d14] mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: theme.parchment,  }}>
                            {stat.icon}
                        </div>
                        <p className="text-[10px] text-[#6b1d14] font-black tracking-widest uppercase opacity-60 mb-1">{stat.title}</p>
                        <h3 className="text-3xl font-bold" style={{ color: theme.textDark }}>{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* 4. ANALYTICS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Enrollment Growth Card */}
                <div className="bg-white/20 p-8 rounded-[2.5rem] border border-white shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xs text-[#6b1d14] font-bold uppercase tracking-widest flex items-center gap-2">
                            <MdTrendingUp className="text-lg " style={{ color: theme.primaryGold }} /> ENROLLMENT GROWTH
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-1 bg-orange-50 text-orange-600 rounded-lg">+18%</span>
                    </div>
                    <div className="h-48 w-full flex items-end gap-1">
                        {/* Dummy SVG Chart to match screenshot style */}
                        <svg viewBox="0 0 400 100" className="w-full h-full">
                            <path d="M0,80 Q50,90 100,70 T200,40 T300,60 T400,20" fill="none" stroke={theme.primaryGold} strokeWidth="3" />
                            <path d="M0,80 Q50,90 100,70 T200,40 T300,60 T400,20 V100 H0 Z" fill={`url(#goldGrad)`} opacity="0.6" />
                            <defs>
                                <linearGradient id="goldGrad" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor={theme.primaryGold} />
                                    <stop offset="100%" stopColor="#6b1d14" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* Campaign Analytics Card */}
                <div className="bg-white/20 p-8 rounded-[2.5rem] border border-white shadow-xl relative">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xs font-black uppercase tracking-widest">CAMPAIGN ANALYTICS</h4>
                        <span className="text-[10px] font-bold px-2 py-1 bg-green-50 text-green-600 rounded-lg">LIVE</span>
                    </div>
                    <div className="flex justify-around items-end h-40 pt-4">
                        {[80, 50, 90, 40].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-3">
                                <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} className="w-8 rounded-t-lg" style={{ backgroundColor: i % 2 === 0 ? theme.textDark : theme.primary, opacity: 1 - i * 0.2 }}></motion.div>
                                <span className="text-[8px] font-bold uppercase opacity-50">{['Google Ads', 'FB/Insta', 'WhatsApp', 'YouTube'][i]}</span>
                            </div>
                        ))}
                    </div>
                    {/* <div className="absolute bottom-6 right-8 flex items-center gap-2 bg-[#FBF4E2] px-3 py-1 rounded-full text-[9px] font-bold">
                        Top performing channel <MdChevronRight />
                    </div> */}
                </div>
            </div>

            {/* 5. RECENT INQUIRIES TABLE */}
            <div className="bg-[#fcf8f0]/30 rounded-[2.5rem]  overflow-hidden border border-white/40">
                {/* Header Section */}
                <div className="px-10 py-7 border-b border-[#D1B062]/20 flex justify-between items-center">
                    <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-[#6b1d14]/70">Recent Inquiries</h4>
                    <button className="text-[10px] font-black uppercase tracking-widest text-[#433629]/50 flex items-center gap-2 hover:text-[#b8973d] transition-colors bg-white/40 px-4 py-2 rounded-xl shadow-sm">
                        Refresh List <span className="text-lg">›</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="text-xs   uppercase text-[#6b1d14] tracking-[0.45em]">
                                <th className="px-12 py-6">Student</th>
                                <th className="px-12 py-6">Course</th>
                                <th className="px-12 py-6">Status</th> {/* Matching the double status column in your image */}
                                <th className="px-12 py-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D1B062]/10">
                            {[
                                { name: "Rahul Deshpande", initial: "RD", course: "Panini Vyakarana", status: "NEW" },
                                { name: "Ananya Iyer", initial: "AI", course: "Advanced Upanishad", status: "IN REVIEW" },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-white/50 transition-all duration-300">
                                    {/* Student Cell with Badge */}
                                    <td className="px-12 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="relative">
                                                <div className="size-12 rounded-full flex items-center justify-center text-[13px] font-bold bg-[#6b1d14] text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_2px_2px_8px_rgba(255,255,255,0.8)] border border-white/50">
                                                    {row.initial}
                                                </div>
                                            </div>
                                            <span className="text-[15px] font-bold text-[#6b1d14]">{row.name}</span>
                                        </div>
                                    </td>

                                    {/* Course Cell */}
                                    <td className="px-12 py-8 text-sm italic text-[#6b1d14]/70 font-medium">
                                        {row.course}
                                    </td>

                                    {/* Status Pills */}
                                    <td className="px-12 py-8">
                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase bg-[#FBF4E2] border border-[#6b1d14]/30 shadow-sm ${row.status === 'NEW' ? 'text-[#6b1d14]' : 'text-[#6b1d14]/70'}`}>
                                            {row.status}
                                        </span>
                                    </td>

                                    {/* <td className="px-12 py-8">
              <button className="px-6 py-2 rounded-xl text-[10px] font-black text-[#6b1d14]/80 bg-white/40 border border-white shadow-sm hover:shadow-md transition-all">
                View
              </button>
            </td> */}

                                    {/* The Main "Pressable" Button */}
                                    <td className="px-12 py-8 text-right">
                                        <button className="px-10 py-3 rounded-2xl bg-[#fdf9f0] border-b-4 border-[#d1b062]/40 border-x border-t border-[#d1b062]/20 text-[11px] font-black text-[#433629] shadow-md hover:brightness-105 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-widest">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


