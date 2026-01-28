import React, { useState } from 'react';
import { Eye, EyeOff, GraduationCap, Lock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#d4e4d4] via-[#f0f4f0] to-[#b8cbb8] font-sans p-4">
      
      {/* Main Registration Card */}
      <div className="w-full max-w-[480px] bg-[#fffcf5] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-white/50 p-10 relative mt-4">
        
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <GraduationCap size={60} className="text-[#b8973d]" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#4a3a1a] tracking-tight">Student Registration</h2>
          <p className="text-[#b8973d] text-sm font-semibold mt-1 tracking-wide">
            Join the Sankast Heritage Institute
          </p>
        </div>

        {/* Form Fields */}
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#8c7a56] uppercase tracking-[0.15em] pl-1">First Name</label>
              <input 
                type="text" 
                placeholder="Vikram"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#e8dfc4] focus:ring-2 focus:ring-[#b8973d]/20 outline-none transition text-gray-700 text-sm shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#8c7a56] uppercase tracking-[0.15em] pl-1">Last Name</label>
              <input 
                type="text" 
                placeholder="Shastri"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#e8dfc4] focus:ring-2 focus:ring-[#b8973d]/20 outline-none transition text-gray-700 text-sm shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#8c7a56] uppercase tracking-[0.15em] pl-1">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#e8dfc4] focus:ring-2 focus:ring-[#b8973d]/20 outline-none transition text-gray-700 text-sm shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#8c7a56] uppercase tracking-[0.15em] pl-1">Create Password</label>
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} 
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#e8dfc4] focus:ring-2 focus:ring-[#b8973d]/20 outline-none transition text-gray-700 text-sm shadow-sm"
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#b8973d]"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#8c7a56] uppercase tracking-[0.15em] pl-1">Confirm Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#e8dfc4] focus:ring-2 focus:ring-[#b8973d]/20 outline-none transition text-gray-700 text-sm shadow-sm"
            />
          </div>

          <button className="w-full bg-[#b8973d] hover:bg-[#a68632] transition-all py-4 rounded-2xl font-bold text-white uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 mt-4">
            Create Account 
          </button>
        </form>


         {/* External Links Section */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center ">
                <p className="text-sm text-[#5a6b5a] font-medium">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#6b1d14] font-bold hover:text-[#b8973d] transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>
      </div>

    </div>
  );
}