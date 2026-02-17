import React, { useRef, useEffect } from 'react'
import { Bell, Filter, Search, Settings, BellRing, X } from 'lucide-react'
import { AlertTriangle, TicketPercent, CreditCard, Tag, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"
import { Alert } from "./Alert";
import { useNavigate } from "react-router-dom";

function Header({ showAlerts, setShowAlerts }) {

    const alertRef = useRef(null)
    const navigate = useNavigate();

    // 🔥 Latest 4 alerts only (Newest first)
    const latestAlerts = [...Alert]
        .sort((a, b) => b.id - a.id)
        .slice(0, 4);

    // Outside click close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (alertRef.current && !alertRef.current.contains(e.target)) {
                setShowAlerts(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [setShowAlerts])


    const getAlertIcon = (type) => {
        switch (type) {
            case "coupon":
                return <TicketPercent className="w-4 h-4" />;
            case "payment":
                return <CreditCard className="w-4 h-4" />;
            case "discount":
                return <Tag className="w-4 h-4" />;
            case "inquiry":
                return <Mail className="w-4 h-4" />;
            default:
                return <AlertTriangle className="w-4 h-4" />;
        }
    };

    return (
        <div className='relative z-[9999] bg-[#74271E] backdrop-blur-xl border-b border-slate-300 px-4 md:px-6 py-4'>
            <div className='flex items-center justify-between'>

                {/* Left Section */}
                <div className='flex items-center'>
                    <h1 className='text-xl md:text-2xl font-black text-white'>
                        Admin Dashboard
                    </h1>
                </div>

                {/* Center Search */}
                <div className='flex-1 max-w-md mx-4 md:mx-8 hidden sm:block'>
                    <div className='relative'>
                        <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
                        <input
                            type="text"
                            placeholder='Search Anything'
                            className='w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <button className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600'>
                            <Filter />
                        </button>
                    </div>
                </div>

                {/* Right Section */}
                <div className='flex items-center space-x-3'>

                    {/*  Notification */}
                    <div className='relative' ref={alertRef}>
                        <button
                            onClick={() => setShowAlerts(!showAlerts)}
                            className='relative p-2.5 rounded-xl text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#74271E] transition-colors'>
                            <Bell className='w-5 h-5' />

                            {/* Total Alerts Badge */}
                            <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
                                {Alert.length}
                            </span>
                        </button>

                        <AnimatePresence>
                            {showAlerts && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20, scale: 0.94 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.94 }}
                                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                    className='absolute right-0 mt-3 w-80 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] bg-gradient-to-br from-[#74271E] via-[#8a2a1f] to-[#5a1b14] text-white z-[99999] overflow-hidden'
                                >

                                    {/* Header */}
                                    <div className='px-5 py-4 bg-white/10 backdrop-blur-md flex items-center justify-between'>
                                        <div className='flex items-start gap-3'>
                                            <div className='w-9 h-9 rounded-xl flex items-center justify-center bg-[#D4AF37]/20 text-[#D4AF37]'>
                                                <BellRing className='w-5 h-5' />
                                            </div>

                                            <div>
                                                <h4 className='font-semibold tracking-wide text-[#D4AF37]'>
                                                    Smart Alerts
                                                </h4>
                                                <p className='text-xs text-white/70 mt-1'>
                                                    Stay updated with academy activity
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setShowAlerts(false)}
                                            className='text-white/70 hover:text-white transition'
                                        >
                                            <X className='w-4 h-4' />
                                        </button>
                                    </div>

                                    {/* Alerts List */}
                                    <div className=' px-3 py-2 space-y-2 max-h-72 overflow-y-auto hide-scrollbar'>
                                        {latestAlerts.map((alert) => (
                                            <motion.div
                                                key={alert.id}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => {
                                                    setShowAlerts(false);
                                                    navigate(`/admin/notifications/${alert.id}`);
                                                }}
                                                className='relative flex items-start gap-3 p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition cursor-pointer'
                                            >

                                                <span className='absolute right-3 top-3 w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse'></span>

                                                <div className='w-9 h-9 rounded-xl flex items-center justify-center bg-[#D4AF37]/20 text-[#D4AF37]'>
                                                    {getAlertIcon(alert.type)}
                                                </div>

                                                <div className='flex-1'>
                                                    <p className='text-sm leading-snug font-medium'>
                                                        {alert.message}
                                                    </p>

                                                    <span className='text-[11px] text-white/60'>
                                                        Just now
                                                    </span>
                                                </div>

                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div
                                        onClick={() => {
                                            setShowAlerts(false);
                                            navigate("/admin/notifications");
                                        }}
                                        className='px-5 py-3 text-center text-sm text-[#D4AF37] hover:bg-white/10 transition cursor-pointer'
                                    >
                                        View All Notifications →
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ⚙️ Settings Redirect FIXED */}
                    <button
                        onClick={() => navigate("/admin/settings")}
                        className='p-2.5 rounded-xl text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#74271E] transition-all duration-200 active:scale-95'
                    >
                        <Settings className='w-5 h-5' />
                    </button>

                </div>
            </div>
        </div>
    )
}

export default Header
