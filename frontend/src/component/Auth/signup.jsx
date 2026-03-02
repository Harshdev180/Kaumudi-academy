import React, { useState } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { registerStudent } from "../../lib/api";

export default function Signup() {
  const [showPass, setShowPass] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!firstName || !lastName || !email || !password || !confirm) {
      setError("Please fill all required fields");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!/[A-Za-z]/.test(password)) {
      setError("Password must contain at least one letter");
      return;
    }
    if (!/\d/.test(password)) {
      setError("Password must contain at least one number");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      
      // Debug: Log the data being sent
      console.log("Registering student with:", { firstName, lastName, email, password });
      
      await registerStudent({ firstName, lastName, email, password });
      localStorage.setItem("kaumudi_user_name", `${firstName} ${lastName}`.trim());
      localStorage.setItem("kaumudi_user_email", email);
      setSuccess("Account created successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#d4e4d4] via-[#f0f4f0] to-[#b8cbb8] font-sans p-4">
      {/* Main Registration Card */}
      <div className="w-full max-w-[480px] bg-[#fffcf5] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-white/50 p-10 relative mt-4">
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <GraduationCap size={60} className="text-[#b8973d]" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#4a3a1a] tracking-tight">
            Student Registration
          </h2>
          <p className="text-[#b8973d] text-sm font-semibold mt-1 tracking-wide">
            Join the Sankast Heritage Institute
          </p>
        </div>

        {/* Form Fields */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#8c7a56] uppercase tracking-[0.15em] pl-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="Vikram"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#e8dfc4] focus:ring-2 focus:ring-[#b8973d]/20 outline-none transition text-gray-700 text-sm shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#8c7a56] uppercase tracking-[0.15em] pl-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Shastri"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#e8dfc4] focus:ring-2 focus:ring-[#b8973d]/20 outline-none transition text-gray-700 text-sm shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#8c7a56] uppercase tracking-[0.15em] pl-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#e8dfc4] focus:ring-2 focus:ring-[#b8973d]/20 outline-none transition text-gray-700 text-sm shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#8c7a56] uppercase tracking-[0.15em] pl-1">
              Create Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <label className="text-[10px] font-bold text-[#8c7a56] uppercase tracking-[0.15em] pl-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#e8dfc4] focus:ring-2 focus:ring-[#b8973d]/20 outline-none transition text-gray-700 text-sm shadow-sm"
            />
          </div>

          {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
          {success && <div className="text-green-700 text-sm font-semibold">{success}</div>}

          <button
            disabled={loading}
            className="w-full bg-[#b8973d] hover:bg-[#a68632] transition-all py-4 rounded-2xl font-bold text-white uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* External Links Section */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center ">
          <p className="text-sm text-[#5a6b5a] font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#6b1d14] font-bold hover:text-[#b8973d] transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
