import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate backend verification for JWT 
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF8] p-4 font-serif relative overflow-hidden">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-[0_0_50px_rgba(255,215,140,0.3)] border-2 border-[#d4af37]/20 z-10 animate-in fade-in zoom-in duration-500">

        {/* Academy Branding [cite: 10] */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full border-2 border-[#800000] p-1 mb-4 flex items-center justify-center bg-orange-50">
            <img src="https://i.pinimg.com/1200x/25/4c/d4/254cd406e7942239d413a61b8dbdfddb.jpg" alt="Academy Logo" className="w-16 h-16 object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-[#800000] tracking-tight">Admin Secure Login</h2>
          <p className="text-sm text-gray-500 italic mt-1  tracking-widest font-sans">Preserving Tradition through Technology</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Administrator ID Field [cite: 145] */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1">Administrator ID</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800000] transition-colors" size={18} />
              <input
                type="text"
                placeholder="Enter admin username"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-all font-sans"
                required
              />
            </div>
          </div>

          {/* Access Key Field (Password) [cite: 146] */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1">Access Key</label>
              <button type="button" className="text-xs text-[#800000] hover:underline font-sans">Forgot Key?</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800000] transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter secure password"
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-all font-sans"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Workstation Checkbox */}
          <div className="flex items-center space-x-2 px-1">
            <input type="checkbox" id="remember" className="rounded border-gray-300 text-[#800000] focus:ring-[#800000]" />
            <label htmlFor="remember" className="text-sm text-gray-600 font-sans cursor-pointer">Remember this workstation</label>
          </div>

          {/* Submit Button [cite: 152] */}
          <button
            disabled={isLoading}
            className="w-full bg-[#5c1c11] hover:bg-[#4a1a12] text-white py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#800000]/20 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <ShieldCheck size={20} />
                <span>Authorize Access</span>
              </>
            )}
          </button>
        </form>

        {/* Institutional Footer [cite: 157] */}
        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400 mb-2 uppercase text-[10px] font-bold tracking-[0.2em]">
            <Lock size={12} />
            <span>Secure Institutional Session</span>
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed font-sans px-4">
            Authorized personnel only. All access attempts are logged and monitored by the Academy Security System.
          </p>
        </div>
      </div>

      {/* Footer  */}
      <footer className="absolute bottom-6 w-full text-center">
        <p className="text-[10px] text-white/40 uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} Kaumudi Sanskrit Academy. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AdminLogin;