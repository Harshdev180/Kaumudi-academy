import React from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Ticket, PlayCircle, Lock } from "lucide-react";

export default function CourseSidebar() {
  
  const sidebarContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
  };

  const slowReveal = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <motion.aside 
      variants={sidebarContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="space-y-8 w-full max-w-[420px]"
    >
      {/* 1. VIDEO PREVIEW SECTION (Inspired by Image 2) */}
     

      {/* 2. PRICE & ENROLL CARD (Main Section) */}
      <motion.div 
        variants={slowReveal}
        className="bg-[#FFF8F0] rounded-2xl border border-[#eee] p-8 md:p-10 space-y-10 shadow-sm relative overflow-hidden"
      >
        {/* Header Badges */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black tracking-widest bg-[#6b1d14] text-white px-4 py-2 rounded-full">
            EARLY BIRD OFFER
          </span>
          <span className="text-[11px] font-bold text-[#b42318] flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#b42318] rounded-full animate-ping"></span>
            Ends in 2 Days
          </span>
        </div>

        {/* Pricing Area */}
        <div className="space-y-4 py-4 border-b border-orange-100/50">
          <div className="flex items-end gap-3">
            <span className="text-6xl font-black text-[#6b1d14] tracking-tighter">₹299</span>
            <span className="text-2xl text-gray-400 line-through font-medium">₹549</span>
            <span className="text-lg font-bold text-green-600 mb-1">45% OFF</span>
          </div>
          <p className="text-sm font-medium text-gray-500 italic italic">Limited time offer: Valid for next 24 hours</p>
        </div>

        {/* Coupon & CTA */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#6b1d14] uppercase tracking-widest">
              <Ticket size={18} /> Apply Promo Code
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 border-2 border-orange-100 rounded-xl px-4 py-4 text-sm font-bold focus:outline-none focus:border-[#6b1d14] bg-white transition-all shadow-inner"
                placeholder="KAUMUDI2024"
              />
              <button className="px-6 rounded-xl border-2 border-[#6b1d14] text-[#6b1d14] text-xs font-black uppercase tracking-widest hover:bg-[#6b1d14] hover:text-white transition-all">
                Apply
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#6b1d14] text-white py-6 rounded-2xl font-black text-xl shadow-xl shadow-[#6b1d14]/20"
            >
              Enroll Now & Start Learning →
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full border-2 border-[#6b1d14] text-[#6b1d14] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 bg-white/50"
            >
              Contact Academy
            </motion.button>
          </div>
        </div>

        {/* Deliverables Checklist (Extended Spacing) */}
        <div className="pt-10 border-t border-orange-100 space-y-6">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">What's included:</h4>
          <ul className="space-y-5 text-[15px] font-medium text-gray-700">
            {[
              "Lifetime access to recorded lectures",
              "Digital Sanskrit Dictionary & Resource Pack",
              "Direct access to instructor via Discord",
              "Authenticated Certification on completion"
            ].map((text, i) => (
              <li key={i} className="flex gap-4 items-center">
                <div className="p-1 bg-green-100 rounded-full">
                  <Check size={14} className="text-green-700" strokeWidth={3} />
                </div>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* 3. TRUST CARD (As requested) */}
      <motion.div 
        variants={slowReveal}
        className="bg-[#FFF8F0] rounded-[2rem] p-10 text-center border border-[#eee] shadow-lg space-y-6"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FFF8F0] flex items-center justify-center border border-orange-50 shadow-inner">
          <Shield className="text-[#6b1d14]" size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-[#2b2b2b]">Academy Verified Trust</h3>
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            100% Secure Checkout & 14-day Refund Policy
          </p>
          <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <Lock size={12} /> Secure 256-bit Encryption
          </div>
        </div>
      </motion.div>
    </motion.aside>
  );
}