import React, { useState } from 'react';
import { Eye, EyeOff, GraduationCap, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom'; // Routing ke liye

export default function Login() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#d4e4d4] via-[#f0f4f0] to-[#b8cbb8] font-sans p-4">
      
      <div className="w-full max-w-[450px] bg-[#fffcf5] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-white/50 p-10 relative text-center">
        
        {/* Title Section */}
        <div className="mb-10">
          <div className="flex justify-center mb-3">
            <GraduationCap size={60} className="text-[#b8973d]" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#4a3a1a] tracking-tight">Student Login</h2>
          <p className="text-[#b8973d] text-sm font-semibold mt-1 tracking-wide">
            Welcome back to the Institute
          </p>
        </div>

        {/* Form Fields */}
        <form className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#8c7a56] uppercase tracking-[0.15em] pl-1">Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your registered email"
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#e8dfc4] focus:ring-2 focus:ring-[#b8973d]/20 outline-none transition text-gray-700 text-sm shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-bold text-[#8c7a56] uppercase tracking-[0.15em]">Password</label>
              <a href="#" className="text-[10px] font-bold text-[#b8973d] hover:underline uppercase tracking-wider">Forgot?</a>
            </div>
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} 
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#e8dfc4] focus:ring-2 focus:ring-[#b8973d]/20 outline-none transition text-gray-700 text-sm shadow-sm"
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

          <button className="w-full bg-[#b8973d] hover:bg-[#a68632] transition-all transform hover:scale-[1.02] active:scale-[0.98] py-4 rounded-2xl font-bold text-white uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 mt-4">
            Sign In 
          </button>
        </form>

        {/* Bottom Link (Replaced Encrypted Access) */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-[#5a6b5a] font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#6b1d14] font-bold hover:text-[#b8973d] transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}