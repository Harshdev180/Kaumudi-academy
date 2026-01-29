import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Ticket, Mail, Search, Bell, Plus, MoreVertical, Calendar, MessageSquare, ChevronDown, TrendingUp } from 'lucide-react';

const academyColors = {
    primaryGold: "#b8973d",
    accentDark: "#8B6A21",
    parchment: "#FBF4E2",
    bgLight: "#f1e4c8",
    bgDark: "#1e1b14",
    chartGold: "#D4AF37",
    chartDark: "#2C261D",
    chartMuted: "#A68942",
    chartSlate: "#4A453E",
    chartSage: "#6B705C"
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const AdminDashboard = () => {
    const [user] = useState({
        name: "Acharya Sharma",
        role: "Head Administrator",
        avatar: "https://ui-avatars.com/api/?name=Acharya+Sharma&background=b8973d&color=fff"
    });

    const [stats, setStats] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [inquiries, setInquiries] = useState([]);

    useEffect(() => {
        setStats([
            { id: 1, icon: <BookOpen />, label: "Total Courses", value: "42", trend: "+5%", up: true },
            { id: 2, icon: <Users />, label: "Active Students", value: "1,280", trend: "-2%", up: false },
            { id: 3, icon: <Ticket />, label: "Coupons", value: "156", trend: "+12%", up: true },
            { id: 4, icon: <Mail />, label: "Inquiries", value: "12", status: "New" }
        ]);

        setCampaigns([
            { label: "Google Ads", val: 85, color: academyColors.bgDark },
            { label: "FB / Insta", val: 65, color: academyColors.primaryGold },
            { label: "WhatsApp", val: 92, color: academyColors.accentDark },
            { label: "YouTube", val: 45, color: academyColors.chartMuted },
            { label: "Referrals", val: 30, color: "#C5B358" }
        ]);

        setInquiries([
            { id: 1, name: "Rahul Deshpande", course: "Panini Vyakarana", status: "New", color: "bg-orange-50 text-[#8B6A21] border border-orange-100" },
            { id: 2, name: "Ananya Iyer", course: "Advanced Upanishad", status: "In Review", color: "bg-zinc-100 text-zinc-600 border border-zinc-200" }
        ]);
    }, []);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex-1 md:ml-0 min-h-screen font-sans relative overflow-hidden" // Added relative & overflow-hidden
            style={{ backgroundColor: academyColors.bgLight }}
        >
            {/* --- STEP 3: SHLOK WATERMARK IMPLEMENTATION --- */}
            <div className="absolute inset-0 pointer-events-none select-none z-0 flex flex-col justify-around items-center opacity-[0.03] overflow-hidden">
                <div className="font-heritage text-[15rem] whitespace-nowrap rotate-[-12deg] text-[#6b1d14]">
                    विद्या ददाति विनयं
                </div>
                <div className="font-heritage text-[12rem] whitespace-nowrap rotate-[-12deg] text-[#6b1d14] ml-96">
                    ज्ञानं परमं बलम्
                </div>
                <div className="font-heritage text-[15rem] whitespace-nowrap rotate-[-12deg] text-[#6b1d14] mr-96">
                    योगः कर्मसु कौशलम्
                </div>
            </div>
            {/* ----------------------------------------------- */}

            {/* Header */}
            <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-[#f1e4c8]/80 backdrop-blur-md border border-b-[#6b1d14] sticky top-0 z-40" style={{ borderColor: `${academyColors.primaryGold}20` }}>
                <div className="relative w-full max-w-xs md:max-w-md hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 " size={18} />
                    <input type="text" placeholder="Search insights..." className="w-full rounded-xl pl-10 pr-4 py-2 text-sm bg-zinc-100 border-1 border-[#74271E] focus:ring-1 focus:ring-[#b8973d]/20 transition-all outline-none" />
                </div>

                <div className="flex items-center gap-4 lg:gap-8 ml-auto">
                    <div className="flex gap-2 border-r pr-4 border-zinc-200">
                        <IconButton icon={<Bell size={20} />} hasBadge />
                        <IconButton icon={<MessageSquare size={20} />} />
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-black text-zinc-800">{user.name}</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">{user.role}</p>
                        </div>
                        <img src={user.avatar} className="w-10 h-10 rounded-xl border-2 shadow-sm" style={{ borderColor: academyColors.primaryGold }} alt="avatar" />
                    </div>
                </div>
            </header>

            <div className="relative z-10 p-4 lg:p-10 max-w-[1600px] mx-auto"> {/* Added relative z-10 */}
                {/* Title Section */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-heritage font-black text-[#6b1d14] tracking-tight">Academy Overview</h2>
                        <p className="text-sm text-[#d6b15c ] mt-1 italic font-medium">Elevating Sanskrit education with modern tech.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-[#6b1d14] rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-[#6b1d14]/90 hover:text-white transition-all"> This Month</button>
                    </div>
                </motion.div>

                {/* Animated Stats Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map(s => (
                        <motion.div
                            key={s.id}
                            whileHover={{ y: -5 }}
                            className="bg-white/40 backdrop-blur-md p-6 rounded-[1.5rem] border-[0.5px] border-[#b8973d]/20 hadow-[0_8px_30px_rgba(107,29,20,0.04)] relative overflow-hidden group"
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2.5 rounded-xl" style={{ backgroundColor: academyColors.parchment, color: academyColors.primaryGold }}>{s.icon}</div>
                                    {s.trend && <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${s.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{s.trend}</span>}
                                    {s.status && <span className="text-[9px] font-black px-2 py-1 bg-orange-50 text-[#8B6A21] rounded-md uppercase border border-orange-100">{s.status}</span>}
                                </div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{s.label}</p>
                                <p className="text-3xl font-black mt-1 text-zinc-900">{s.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm p-8 rounded-[2rem] border border-zinc-100 shadow-sm">
                        <h3 className="font-bold text-lg mb-6 text-zinc-800 flex items-center gap-2 font-heritage uppercase tracking-wider">
                            <TrendingUp size={20} className="text-[#b8973d]" /> Enrollment Growth
                        </h3>
                        <div className="h-48 w-full bg-zinc-50/50 rounded-2xl relative overflow-hidden border border-zinc-100">
                            <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                                <motion.path
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                    d="M0,120 C80,130 150,40 250,60 C350,80 380,20 400,10"
                                    stroke={academyColors.primaryGold} strokeWidth="3" fill="none" strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                        <div className="flex justify-between mb-10">
                            <h3 className="font-bold text-lg text-zinc-800 font-heritage uppercase tracking-wider">Campaign Analytics</h3>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100 text-green-600 text-[10px] font-black">LIVE</div>
                        </div>
                        <div className="flex items-end justify-between h-48 gap-3 px-2">
                            {campaigns.map((item, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center group/bar relative h-full justify-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${item.val}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="w-full max-w-[32px] rounded-t-xl relative cursor-pointer shadow-sm"
                                        style={{ backgroundColor: item.color }}
                                    >
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                                    </motion.div>
                                    <span className="mt-4 text-[9px] font-black text-zinc-400 uppercase tracking-tighter text-center whitespace-nowrap">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Recent Inquiries */}
                <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b flex justify-between items-center bg-zinc-50/30">
                        <h3 className="font-bold text-lg text-zinc-800 font-heritage uppercase tracking-wider">Recent Inquiries</h3>
                        <button className="text-[10px] font-black uppercase tracking-widest text-[#b8973d] hover:underline transition-all">Refresh List</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                                <tr>
                                    <th className="px-10 py-5">Student</th>
                                    <th className="px-10 py-5">Course</th>
                                    <th className="px-10 py-5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {inquiries.map((inq, idx) => (
                                    <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-10 py-6 font-bold text-zinc-800">{inq.name}</td>
                                        <td className="px-10 py-6 italic text-zinc-500 text-sm font-sans">{inq.course}</td>
                                        <td className="px-10 py-6">
                                            <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase ${inq.color}`}>{inq.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const IconButton = ({ icon, hasBadge }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2.5 bg-white rounded-xl border border-zinc-100 shadow-sm hover:border-zinc-300 transition-colors"
    >
        {icon}
        {hasBadge && <span className="absolute top-2 right-2 w-2 h-2 bg-[#b8973d] rounded-full border-2 border-white" />}
    </motion.button>
);

export default AdminDashboard;