import React, { useState } from "react";
import { motion } from "framer-motion";

import {
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [openForgot, setOpenForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // LOGIN
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1200);
  };

  // FORGOT KEY
  const handleForgotKey = () => {
    if (!forgotEmail) return;
    setForgotLoading(true);

    setTimeout(() => {
      setForgotLoading(false);
      alert("Reset link sent successfully.");
      setOpenForgot(false);
      setForgotEmail("");
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#f1e4c8] min-h-screen flex items-center justify-center px-4"
    >


      {/* MAIN CARD */}
      <div className="w-full max-w-5xl bg-[#f7efe6] rounded-3xl overflow-hidden shadow-xl border border-[#d4af37]/20 grid md:grid-cols-[45%_55%]">

        {/* LEFT IMAGE */}
        <div className="relative hidden md:flex items-center justify-center bg-[#eadcc8]">

          <img
            src="https://i.pinimg.com/1200x/06/72/38/0672383215952a5cfc406218c734a067.jpg"
            alt="Sanskrit Guru"
            className="w-full h-120 object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#5c1c11]/60 via-transparent to-transparent flex items-end p-8">
            <div className="text-white">
              <h2 className="text-xl font-semibold">
                KAUMUDI Sanskrit Academy
              </h2>
              <p className="text-xs opacity-80 font-sans mt-1">
                Traditional Knowledge • Modern Administration
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-8 md:p-10 flex flex-col justify-center">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#800000]">
              Admin Secure Login
            </h1>
            <p className="text-sm text-gray-500 italic font-sans">
              Preserving Tradition through Technology
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* ADMIN ID */}
            <div>
              <label className="text-xs font-bold uppercase text-gray-600">
                Administrator ID
              </label>

              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-4 py-3 bg-[#efe3d5] rounded-xl outline-none focus:ring-2 focus:ring-[#800000]/20"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between">
                <label className="text-xs font-bold uppercase text-gray-600">
                  Access Key
                </label>

                <button
                  type="button"
                  onClick={() => setOpenForgot(true)}
                  className="text-xs text-[#800000] hover:underline"
                >
                  Forgot Key?
                </button>
              </div>

              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter secure password"
                  className="w-full pl-10 pr-12 py-3 bg-[#efe3d5] rounded-xl outline-none focus:ring-2 focus:ring-[#800000]/20"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* REMEMBER */}
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="accent-[#800000]" />
              <span className="text-sm text-gray-600">
                Remember this workstation
              </span>
            </div>

            {/* LOGIN BUTTON */}
            <button
              disabled={isLoading}
              className="w-full bg-[#6b1f12] hover:bg-[#5c1c11] hover:shadow-lg hover:scale-[1.01] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Authorize Access
                </>
              )}
            </button>
          </form>

          {/* 👉 NEW REGISTER OPTION (SMOOTH UI) */}
          <p className="text-sm text-center text-[#8D6F61] mt-6">
            Don’t have an admin account?
            <span
              onClick={() => navigate("/admin-register")}
              className="text-[#7B2C21] font-semibold ml-1 cursor-pointer hover:underline transition-all duration-300"
            >
              Create one
            </span>
          </p>

          <p className="text-center text-[11px] text-gray-400 mt-3">
            Secure Institutional Session • Authorized Personnel Only
          </p>
        </div>
      </div>

      {/* FORGOT KEY MODAL */}
      {openForgot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#f7efe6] rounded-2xl w-full max-w-sm p-6 shadow-xl">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#800000]">
                Recover Access Key
              </h3>
              <X size={18} className="cursor-pointer" onClick={() => setOpenForgot(false)} />
            </div>

            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="Admin Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-[#efe3d5] rounded-xl outline-none"
              />
            </div>

            <button
              onClick={handleForgotKey}
              className="w-full mt-5 bg-[#6b1f12] text-white py-2.5 rounded-xl font-bold flex justify-center items-center gap-2"
            >
              {forgotLoading ? <Loader2 className="animate-spin" size={16} /> : "Send Reset Link"}
            </button>
          </div>
        </div>
      )}
    </motion.div>

  );
};

export default AdminLogin;
