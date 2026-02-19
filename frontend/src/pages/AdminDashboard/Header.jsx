import React, { useRef, useEffect } from 'react'
import { Bell, Settings, BellRing, X } from 'lucide-react'
import { AlertTriangle, TicketPercent, CreditCard, Tag, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"
import { Alert } from "./Alert";
import { useNavigate, useLocation } from "react-router-dom";

function Header({ showAlerts, setShowAlerts }) {

    const alertRef = useRef(null)
    const searchRef = useRef(null)
    const navigate = useNavigate();
    const location = useLocation();

    /* ================= DYNAMIC TITLE ================= */
    

    const latestAlerts = [...Alert]
        .sort((a, b) => b.id - a.id)
        .slice(0, 4);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (alertRef.current && !alertRef.current.contains(e.target)) {
                setShowAlerts(false)
            }
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchOpen(false)
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
        <div className='relative z-[9999]'>

            {/* ⭐ GOLDEN GLOW TOP BORDER */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-pulse" />

            <div className='bg-gradient-to-r from-[#74271E] via-[#8a2a1f] to-[#5a1b14] border-b border-[#D4AF37]/20 px-4 md:px-6 py-4'>

                <div className='flex items-center justify-between'>

                    {/* LEFT TITLE */}
                    <div className='flex flex-col'>
                        <motion.h1
                            key={location.pathname}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='text-xl md:text-2xl font-black text-white tracking-wide'
                        >
                           Admin Dashboard
                        </motion.h1>

                        <span className='text-[11px] text-[#D4AF37]/80 font-medium'>
                            Kaumudi Sanskrit Academy Panel
                        </span>
                    </div>

                    {/* RIGHT ACTIONS */}
                    <div className='flex items-center gap-3'>

                        {/*  Alerts */}
                        <div className='relative' ref={alertRef}>
                            <button
                                onClick={() => setShowAlerts(!showAlerts)}
                                className='relative p-2.5 rounded-xl text-[#D4AF37] bg-white/5 hover:bg-[#D4AF37] hover:text-[#74271E] transition'
                            >
                                <Bell className='w-5 h-5' />

                                <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
                                    {Alert.length}
                                </span>
                            </button>

                            <AnimatePresence>
                                {showAlerts && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className='absolute right-0 mt-3 w-80 rounded-3xl shadow-xl bg- text-[#6b1d14] overflow-hidden'
                                    >

                                        <div className='px-5 py-4  flex items-center bg-[#EFE3D5] justify-between'>
                                            <div className='flex items-start  gap-3'>
                                                <BellRing className='w-5 h-5 text-[#6b1d14]' />
                                                <h4 className='font-semibold  text-[#6b1d14]'>Smart Alerts</h4>
                                            </div>

                                            <button onClick={() => setShowAlerts(false)}>
                                                <X className='w-4 h-4' />
                                            </button>
                                        </div>

                                        <div className='px-3 py-2 space-y-2 max-h-72 bg-[#6b1d14]  overflow-y-auto'>
                                            {latestAlerts.map((alert) => (
                                                <motion.div
                                                    key={alert.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    onClick={() => {
                                                        setShowAlerts(false);
                                                        navigate(`/admin/notifications/${alert.id}`);
                                                    }}
                                                    className='flex items-start gap-3 p-3 rounded-2xl bg-white/80 hover:bg-[#D4AF37] hover:text-[#6b1d14] cursor-pointer'
                                                >
                                                    <div className='w-9 h-9 rounded-xl flex items-center justify-center bg-[#D4AF37]/20  hover:text-[#6b1d14]'>
                                                        {getAlertIcon(alert.type)}
                                                    </div>

                                                    <p className='text-sm'>{alert.message}</p>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div
                                            onClick={() => {
                                                setShowAlerts(false);
                                                navigate("/admin/notifications");
                                            }}
                                            className='px-5 py-3 text-center text-sm text-white bg-[#6b1d14] hover:text-[#D4AF37] cursor-pointer'
                                        >
                                            View All Notifications →
                                        </div>

                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ⚙️ Settings */}
                        <button
                            onClick={() => navigate("/admin/settings")}
                            className='p-2.5 rounded-xl text-[#D4AF37] bg-white/5 hover:bg-[#D4AF37] hover:text-[#74271E] transition'
                        >
                            <Settings className='w-5 h-5' />
                        </button>

                        {/* ⭐ PROFILE AVATAR */}
                        <div className='flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl'>
                            <div className='w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-xs font-bold text-[#D4AF37]'>
                                AS
                            </div>

                            <div className='hidden md:block'>
                                <p className='text-xs text-white font-semibold'>Ajay Sharma</p>
                                <p className='text-[10px] text-[#D4AF37]/80'>Admin</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
