import React, { useState } from 'react';
import { Eye, EyeOff, GraduationCap, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginStudent, setAuthToken } from '../../lib/api';

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    try {
      setLoading(true);
      const data = await loginStudent(email, password);
      const token = data?.token;
      if (token) {
        const userPayload = data?.user || data?.student || data?.data || {};
        const firstName = userPayload?.firstName || userPayload?.firstname || null;
        const lastName = userPayload?.lastName || userPayload?.lastname || null;
        const name =
          userPayload?.name ||
          userPayload?.fullName ||
          userPayload?.full_name ||
          (firstName || lastName ? [firstName, lastName].filter(Boolean).join(' ') : null);
        localStorage.setItem('kaumudi_token', token);
        localStorage.setItem('kaumudi_role', 'STUDENT');
        localStorage.setItem('kaumudi_user_email', email);
        if (firstName) localStorage.setItem('kaumudi_user_first_name', firstName);
        else localStorage.removeItem('kaumudi_user_first_name');
        if (lastName) localStorage.setItem('kaumudi_user_last_name', lastName);
        else localStorage.removeItem('kaumudi_user_last_name');
        if (name) localStorage.setItem('kaumudi_user_name', name);
        else localStorage.removeItem('kaumudi_user_name');
        setAuthToken(token);
      }
      navigate('/student/overview', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

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
        <form className="space-y-6 text-left" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#8c7a56] uppercase tracking-[0.15em] pl-1">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#e8dfc4] focus:ring-2 focus:ring-[#b8973d]/20 outline-none transition text-gray-700 text-sm shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-bold text-[#8c7a56] uppercase tracking-[0.15em]">Password</label>
              <Link to="/forgot-password" className="text-[10px] font-bold text-[#b8973d] hover:underline uppercase tracking-wider">Forgot?</Link>
            </div>
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}

          <button
            disabled={loading}
            className="w-full bg-[#b8973d] hover:bg-[#a68632] transition-all transform hover:scale-[1.02] active:scale-[0.98] py-4 rounded-2xl font-bold text-white uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
          >
            {loading ? 'Signing In...' : 'Sign In'}
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
