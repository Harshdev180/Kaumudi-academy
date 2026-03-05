import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  X,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginSuperAdmin, forgotPassword } from "../../lib/api";
import { useAuth } from "../../context/useAuthHook";
import adminlogin from "../../assets/adminlogin.webp";
import SEO from "../../components/SEO";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openForgot, setOpenForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const role = "SUPER_ADMIN";
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter admin email and password.");
      return;
    }
    try {
      setIsLoading(true);
      const data = await loginSuperAdmin(email, password);
      const token = data?.token;
      if (token) {
        const userPayload = data?.user || data?.admin || data?.data || {};
        const firstName =
          userPayload?.firstName || userPayload?.firstname || null;
        const lastName = userPayload?.lastName || userPayload?.lastname || null;
        const name =
          userPayload?.name ||
          userPayload?.fullName ||
          userPayload?.full_name ||
          (firstName || lastName
            ? [firstName, lastName].filter(Boolean).join(" ")
            : null);
        login(
          { email, role: data?.role || role, firstName, lastName, name },
          token,
        );
      }
      navigate("/admin/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Admin login failed.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotKey = async () => {
    if (!forgotEmail.trim()) {
      alert("Please enter your admin email");
      return;
    }
    try {
      setForgotLoading(true);
      const response = await forgotPassword(forgotEmail, role);
      alert(
        response?.message ||
          "Reset link sent to your email. Please check your inbox.",
      );
      setForgotEmail("");
      setOpenForgot(false);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Failed to send reset link. Please try again.";
      alert(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#f1e4c8] min-h-screen flex items-center justify-center px-4"
    >
      <SEO
        title="Admin Login | Kaumudi Sanskrit Academy"
        description="Secure admin login for Kaumudi Sanskrit Academy."
        canonicalPath="/admin-login"
        robots="noindex, nofollow"
        og={{ type: "website" }}
      />
      {/* MAIN CARD */}
      <div className="w-full max-w-5xl bg-[#f7efe6] rounded-3xl overflow-hidden shadow-xl border border-[#d4af37]/20 grid md:grid-cols-[45%_55%]">
        {/* LEFT IMAGE */}
        <div className="relative hidden md:flex items-center justify-center bg-[#eadcc8]">
          <img
            src={adminlogin}
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

        <div className="p-6 md:p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-[#5c1c11] bg-white border border-[#d4af37]/40 px-4 py-2 rounded-lg text-center">
              Admin Access
            </div>

            {/* Administrator ID Field [cite: 145] */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1">
                Admin Email
              </label>
              <div className="relative group">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800000] transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="admin@kaumudi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-all font-sans"
                  required
                />
              </div>
            </div>

            {/* Access Key Field (Password) [cite: 146] */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1">
                  Access Key
                </label>
                <button
                  type="button"
                  onClick={() => setOpenForgot(true)}
                  className="text-xs text-[#800000] hover:underline font-sans"
                >
                  Forgot Key?
                </button>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800000] transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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

            {/* REMEMBER */}
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="accent-[#800000]" />
              <span className="text-sm text-gray-600">
                Remember this workstation
              </span>
            </div>

            {/* Submit Button [cite: 152] */}
            {error && (
              <div className="text-red-600 text-sm font-semibold text-center">
                {error}
              </div>
            )}

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
          <div>
            {" "}
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
      </div>

      {/* FORGOT KEY MODAL */}
      {openForgot && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onKeyDown={(e) => e.key === "Escape" && setOpenForgot(false)}
        >
          <div className="bg-[#f7efe6] rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#800000]">
                Recover Access Key
              </h3>
              <X
                size={18}
                className="cursor-pointer"
                onClick={() => setOpenForgot(false)}
              />
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
              {forgotLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminLogin;
