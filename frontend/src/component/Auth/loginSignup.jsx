import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/useAuthHook";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Sparkles,
  Flower2,
  ArrowLeft,
} from "lucide-react";
import authHeroImg from "../../assets/login.webp";

const AuthPage = () => {
  // --- STATES ---
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false); // Forgot Password toggle
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { token } = useParams(); // URL se reset token pakadne ke liye

  useEffect(() => {
    if (token) return;
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    if (mode === "signup") {
      setIsLogin(false);
      setIsForgot(false);
    } else if (mode === "login") {
      setIsLogin(true);
      setIsForgot(false);
    } else if (mode === "forgot") {
      setIsLogin(true);
      setIsForgot(true);
    }
  }, [location.search, token]);

  // --- INITIAL FORM STATE ---
  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    role: "STUDENT",
  };

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpStatus, setOtpStatus] = useState({ type: "", msg: "" });
  const [otpCooldown, setOtpCooldown] = useState(0);

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = setInterval(() => setOtpCooldown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [otpCooldown]);

  // --- BACKEND HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (!isLogin && name === "email") {
      if (isEmailVerified) setIsEmailVerified(false);
      if (isOtpSent) setIsOtpSent(false);
      if (otp) setOtp("");
      if (otpStatus.msg) setOtpStatus({ type: "", msg: "" });
      if (otpCooldown) setOtpCooldown(0);
    }
  };

const handleSendOtp = async () => {
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    setOtpStatus({ type: "error", msg: "Enter a valid email address" });
    return;
  }
  
  // Add validation for signup fields before sending OTP
  if (!isLogin) {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setOtpStatus({ type: "error", msg: "Please fill first name and last name first" });
      return;
    }
    if (formData.password.length < 8) {
      setOtpStatus({ type: "error", msg: "Password must be at least 8 characters" });
      return;
    }
    if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      setOtpStatus({ type: "error", msg: "Password must contain letters and numbers" });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setOtpStatus({ type: "error", msg: "Passwords do not match" });
      return;
    }
  }
  
  if (otpCooldown > 0 || isVerifying) return;
  
  setIsVerifying(true);
  setOtpStatus({ type: "", msg: "" });
  
  try {
    // For signup, send all registration data
    if (!isLogin) {
      const resp = await api.post("/auth/student/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber || undefined,
        address: formData.address || undefined,
      });
      
      if (resp.data?.success) {
        setIsOtpSent(true);
        setOtpCooldown(60);
        setOtpStatus({ type: "success", msg: "OTP sent to your email" });
      } else {
        setOtpStatus({ 
          type: "error", 
          msg: resp.data?.message || "Failed to send OTP" 
        });
      }
    }
  } catch (err) {
    console.error("Send OTP error:", err);
    
    // Handle different error status codes
    if (err.response?.status === 409) {
      setOtpStatus({ 
        type: "error", 
        msg: "This email is already registered. Please login instead." 
      });
      // Optionally switch to login mode after a delay
      setTimeout(() => {
        setIsLogin(true);
        setIsForgot(false);
      }, 3000);
    } else if (err.response?.status === 500) {
      setOtpStatus({ 
        type: "error", 
        msg: "Server error. Please try again later." 
      });
      console.error("Server error details:", err.response?.data);
    } else {
      setOtpStatus({ 
        type: "error", 
        msg: err.response?.data?.message || "Failed to send OTP" 
      });
    }
  } finally {
    setIsVerifying(false);
  }
};

const handleVerifyOtp = async () => {
  if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
    setOtpStatus({ type: "error", msg: "Enter a valid 6-digit OTP" });
    return;
  }
  
  setIsVerifying(true);
  setOtpStatus({ type: "", msg: "" });
  
  try {
    const resp = await api.post("/auth/student/verify-otp", {
      email: formData.email,
      otp: otp.trim(),
    });
    
    if (resp.data?.success) {
      setIsEmailVerified(true);
      setIsOtpSent(false);
      setOtp("");
      setOtpStatus({ type: "success", msg: "Email verified successfully!" });
      
      // If verification returns a token (auto-login), handle it
      if (resp.data?.token) {
        login(resp.data.user, resp.data.token);
        navigate("/student/overview");
      }
    } else {
      setOtpStatus({
        type: "error",
        msg: resp.data?.message || "Invalid or expired OTP",
      });
    }
  } catch (err) {
    console.error("Verify OTP error:", err);
    setOtpStatus({ 
      type: "error", 
      msg: err.response?.data?.message || "Verification failed" 
    });
  } finally {
    setIsVerifying(false);
  }
};

const handleResendOtp = async () => {
  if (otpCooldown > 0) return;
  
  setIsVerifying(true);
  try {
    const resp = await api.post("/auth/student/resend-otp", {
      email: formData.email,
    });
    
    if (resp.data?.success) {
      setOtpCooldown(60);
      setOtpStatus({ type: "success", msg: "New OTP sent successfully" });
    } else {
      setOtpStatus({ type: "error", msg: resp.data?.message || "Failed to resend OTP" });
    }
  } catch (err) {
    console.error("Resend OTP error:", err);
    setOtpStatus({ type: "error", msg: err.response?.data?.message || "Failed to resend OTP" });
  } finally {
    setIsVerifying(false);
  }
};

  // 1. Forgot Password Logic
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", {
        email: formData.email,
        role: "STUDENT",
      });
      alert(res.data.message || "Reset link sent to your email!");
      setIsForgot(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending reset link");
    } finally {
      setLoading(false);
    }
  };

  // 2. Reset Password Logic (Jab User Email link se aayega)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, {
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      alert(res.data.message || "Password updated! Please login.");
      navigate("/auth");
    } catch (err) {
      alert(err.response?.data?.message || "Token invalid or expired");
    } finally {
      setLoading(false);
    }
  };

  // 3. Main Auth (Login/Signup) Logic
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        const apiRole = res?.data?.role || formData.role;
        if (apiRole === "ADMIN" || apiRole === "SUPER_ADMIN") {
          alert("Please use the Admin Login page for admin accounts.");
          navigate("/admin-login");
          setLoading(false);
          return;
        }
        if (res?.data?.token) {
          const userPayload =
            res?.data?.user || res?.data?.student || res?.data?.data || {};
          const firstName =
            userPayload?.firstName ||
            userPayload?.firstname ||
            formData.firstName ||
            null;
          const lastName =
            userPayload?.lastName ||
            userPayload?.lastname ||
            formData.lastName ||
            null;
          const name =
            userPayload?.name ||
            userPayload?.fullName ||
            userPayload?.full_name ||
            (firstName || lastName
              ? [firstName, lastName].filter(Boolean).join(" ")
              : null);
          login(
            {
              email: formData.email,
              role: "STUDENT",
              firstName,
              lastName,
              name,
            },
            res.data.token,
          );
        }
        setFormData(initialFormData);
        const from = location?.state?.from;
        const intended = typeof from === "string" ? from : from?.pathname;
        const fallback = "/student/overview";
        navigate(intended || fallback);
      } else {
        if (
          !formData.firstName.trim() ||
          !formData.lastName.trim() ||
          !formData.email.trim()
        ) {
          alert("Please fill first name, last name, and email.");
          setLoading(false);
          return;
        }
        if (formData.password.length < 8) {
          alert("Password must be at least 8 characters.");
          setLoading(false);
          return;
        }
        if (!/[A-Za-z]/.test(formData.password)) {
          alert("Password must contain at least one letter.");
          setLoading(false);
          return;
        }
        if (!/\d/.test(formData.password)) {
          alert("Password must contain at least one number.");
          setLoading(false);
          return;
        }
        if (
          formData.phoneNumber?.trim() &&
          !/^[6-9]\d{9}$/.test(formData.phoneNumber.trim())
        ) {
          alert("Phone number must be a valid 10-digit Indian number.");
          setLoading(false);
          return;
        }
        if (formData.address?.trim() && formData.address.trim().length < 5) {
          alert("Address must be at least 5 characters.");
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          setLoading(false);
          return;
        }
        if (!isEmailVerified) {
          alert("Please verify your email with OTP before creating account.");
          setLoading(false);
          return;
        }
        const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        };
        if (formData.phoneNumber?.trim()) {
          payload.phoneNumber = formData.phoneNumber.trim();
        }
        if (formData.address?.trim()) {
          payload.address = formData.address.trim();
        }
        await api.post("/auth/student/register", payload);
        setFormData(initialFormData);
        setIsEmailVerified(false);
        setIsOtpSent(false);
        setOtp("");
        setIsLogin(true);
        alert("Registration Successful! Please Login.");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.errors
        ? err.response.data.errors[0].message
        : err.response?.data?.message || "Something went wrong";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // --- ANIMATIONS (Vahi purani variants) ---
  const fadeUp = {
    initial: { opacity: 0, y: 30, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -30, filter: "blur(10px)" },
  };

  const mandalaRotate = {
    animate: { rotate: 360 },
    transition: { duration: 100, repeat: Infinity, ease: "linear" },
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#f1e4c8] p-4 relative overflow-hidden font-sans-serif">
      {/* --- BACKGROUND SPIRITUAL ELEMENTS --- */}
      <motion.div
        variants={mandalaRotate}
        animate="animate"
        className="absolute -top-40 -left-40 w-[600px] h-[600px] border border-[#b8973d]/10 rounded-full flex items-center justify-center opacity-30 pointer-events-none"
      >
        <div className="w-[450px] h-[450px] border border-dashed border-[#b8973d]/20 rounded-full" />
        <Flower2 size={100} className="absolute text-[#b8973d]/10" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-20 right-[20%] text-[#b8973d]"
      >
        {/* <Sparkles size={40} /> */}
      </motion.div>

      {/* --- MAIN AUTH CARD --- */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`relative bg-[#fffcf5] w-full max-w-[1000px] min-h-[600px] rounded-[50px] shadow-[0_50px_120px_rgba(116,39,30,0.25)] overflow-hidden flex flex-col md:flex-row transition-all duration-1000 ease-in-out ${!isLogin || isForgot || token ? "md:flex-row-reverse" : ""}`}
      >
        {/* --- LEFT SIDE: THE GURUKUL EXPERIENCE --- */}
        <motion.div
          layout
          className="relative w-full md:w-[50%] h-320px md:h-auto bg-[#74271E] overflow-hidden"
        >
          <motion.img
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            src={authHeroImg}
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#74271E] via-transparent to-black/40 p-10 flex flex-col justify-between z-10 text-white">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl w-fit"
            >
              <div className="bg-[#b8973d] p-2 rounded-xl">
                <GraduationCap size={28} className="text-[#74271E]" />
              </div>
              <span className="font-bold tracking-[0.15em] text-sm">
                KAUMUDI ACADEMY
              </span>
            </motion.div>

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "msg1" : "msg2"}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="space-y-3"
                >
                  <div className="inline-block px-3 py-1 bg-[#b8973d] text-[#74271E] text-[10px] font-bold rounded-full mb-1">
                    {token
                      ? "पासवर्ड परिवर्तनम्"
                      : isForgot
                        ? "संकेतशब्द विस्मरणम्"
                        : isLogin
                          ? "पुनरागतं स्वागतम्"
                          : "नूतन पञ्जीकरणम्"}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black leading-tight">
                    {isLogin ? "Deepen Your" : "Start Your"} <br />
                    <span className="text-[#b8973d]">Vedic Journey.</span>
                  </h2>
                  <p className="text-gray-300 text-[11px] italic font-light leading-relaxed">
                    {isLogin ? (
                      <>
                        <span className="text-[#b8973d] font-bold not-italic block mb-0.5">
                          “सा विद्या या विमुक्तye”
                        </span>
                        <span className="opacity-70">
                          Knowledge is that which liberates.
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[#b8973d] font-bold not-italic block mb-0.5">
                          “न हि ज्ञानेन सदृशं पवित्रमिह विद्यते”
                        </span>
                        <span className="opacity-70">
                          Nothing is more sacred than knowledge.
                        </span>
                      </>
                    )}
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className="flex items-center gap-4 text-[#b8973d]">
                <div className="w-12 h-[1px] bg-[#b8973d]/50" />
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  • Kaumudi Academy
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- RIGHT SIDE: THE FORM --- */}
        <motion.div
          layout
          className="w-full md:w-[50%] p-6 md:p-12 flex flex-col justify-center bg-[#fffcf5] relative"
        >
          <AnimatePresence mode="wait">
            {/* 1. RESET PASSWORD FORM (Jab link par click ho) */}
            {token ? (
              <motion.div
                key="reset"
                variants={fadeUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full space-y-10"
              >
                <header>
                  <h1 className="text-3xl font-black text-[#74271E] mb-1">
                    New Password
                  </h1>
                  <p className="text-[#8c7a56] text-[12px] font-medium">
                    Set a strong password for your soul's safety.
                  </p>
                </header>
                <form className="space-y-6" onSubmit={handleResetPassword}>
                  <InputGroup
                    label="New Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  <InputGroup
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  <SubmitButton loading={loading} text="Update Password" />
                </form>
              </motion.div>
            ) : /* 2. FORGOT PASSWORD FORM */
            isForgot ? (
              <motion.div
                key="forgot"
                variants={fadeUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full space-y-10"
              >
                <button
                  onClick={() => setIsForgot(false)}
                  className="flex items-center gap-2 text-[#74271E] font-bold text-[10px] uppercase tracking-widest hover:gap-3 transition-all"
                >
                  <ArrowLeft size={14} /> Back to Login
                </button>
                <header>
                  <h1 className="text-3xl font-black text-[#74271E] mb-1">
                    Recover Access
                  </h1>
                  <p className="text-[#8c7a56] text-[12px] font-medium">
                    Enter your email to receive a divine reset link.
                  </p>
                </header>
                <form className="space-y-6" onSubmit={handleForgotPassword}>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-[#74271E] uppercase tracking-wider ml-1">
                        Email Address{" "}
                        {!isLogin && isEmailVerified && (
                          <span className="ml-2 text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-bold lowercase">
                            verified
                          </span>
                        )}
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="shastri@kaumudi.com"
                        required
                        className="w-full px-5 py-3 rounded-2xl bg-[#fdfaf2] border border-[#e8dfc4] focus:border-[#b8973d] focus:ring-4 focus:ring-[#b8973d]/10 outline-none transition-all shadow-inner text-sm"
                      />
                      {!isLogin && !isEmailVerified && (
                        <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isVerifying || otpCooldown > 0}
                    className={`px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      isVerifying || otpCooldown > 0
                        ? "bg-[#A88C64] text-white cursor-not-allowed"
                        : "bg-[#74271E] text-white hover:bg-[#b8973d] hover:text-[#74271E]"
                    }`}
                  >
                    {isVerifying ? "Sending…" : otpCooldown > 0 ? `Resend in ${otpCooldown}s` : isOtpSent ? "Resend" : "Send OTP"}
                  </button>
                      )}
                    </div>
                    {!isLogin && !isEmailVerified && isOtpSent && (
                      <div className="flex gap-2 mt-2">
                           <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            maxLength="6"
                            className="w-full px-5 py-3 rounded-2xl bg-[#fdfaf2] border border-[#e8dfc4] focus:border-[#b8973d] focus:ring-4 focus:ring-[#b8973d]/10 outline-none transition-all shadow-inner text-sm"
                          />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="px-5 py-3 rounded-2xl bg-[#b8973d] text-[#74271E] font-bold"
                        >
                          {isVerifying ? "Verifying…" : "Verify"}
                        </button>
                      </div>
                    )}
                    {!isLogin && otpStatus.msg && (
                      <p
                        className={`text-[12px] mt-1 font-semibold ${
                          otpStatus.type === "success"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {otpStatus.msg}
                      </p>
                    )}
                  </div>
                  <SubmitButton loading={loading} text="Send Recovery Link" />
                </form>
              </motion.div>
            ) : (
              /* 3. MAIN LOGIN/SIGNUP FORM */
              <motion.div
                key={isLogin ? "login" : "signup"}
                variants={fadeUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`w-full ${isLogin ? "space-y-10" : "space-y-0"}`}
              >
                <header className={isLogin ? "mb-8" : "mb-4"}>
                  <h1 className="text-3xl font-black text-[#74271E] mb-1">
                    {isLogin ? "Welcome Back" : "Join the Gurukul"}
                  </h1>
                  <p className="text-[#8c7a56] text-[12px] font-medium">
                    {isLogin
                      ? "Sign in to access your Vedas."
                      : "Register for the divine wisdom."}
                  </p>
                </header>

                <form
                  className={isLogin ? "space-y-6" : "space-y-3"}
                  onSubmit={handleAuth}
                >
                  {!isLogin && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <InputGroup
                          label="First Name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Vikram"
                        />
                        <InputGroup
                          label="Last Name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Shastri"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <InputGroup
                          label="Phone"
                          name="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="9876543210"
                        />
                        <InputGroup
                          label="Address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Varanasi"
                        />
                      </div>
                    </>
                  )}

                  {isLogin ? (
                    <InputGroup
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="shastri@kaumudi.com"
                    />
                  ) : (
                    <div className="space-y-4">
                      {/* Email Input with Better Label */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-[#74271E] uppercase tracking-wider">
                            Email Address
                          </label>
                          {isEmailVerified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Verified
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            required
                            disabled={isEmailVerified}
                            className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#b8973d] focus:ring-2 focus:ring-[#b8973d]/20 outline-none transition-all shadow-sm text-sm disabled:bg-gray-50 disabled:text-gray-500"
                          />
                          
                          {!isEmailVerified && (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={isVerifying || otpCooldown > 0}
                              className="px-4 py-3 rounded-xl bg-[#74271E] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8a3a2a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all min-w-[100px] whitespace-nowrap"
                            >
                              {isVerifying ? (
                                <span className="flex items-center justify-center gap-2">
                                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  Sending
                                </span>
                              ) : otpCooldown > 0 ? (
                                `Resend in ${otpCooldown}s`
                              ) : isOtpSent ? (
                                "Resend OTP"
                              ) : (
                                "Send OTP"
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* OTP Verification Section - Only show when OTP is sent */}
                      {!isEmailVerified && isOtpSent && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100"
                        >
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-[#74271E] uppercase tracking-wider">
                              Verification Code
                            </label>
                            <span className="text-[10px] text-gray-500">
                              Enter 6-digit code
                            </span>
                          </div>

                          {/* OTP Input Field */}
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => {
                                // Only allow numbers
                                const value = e.target.value.replace(/\D/g, '');
                                setOtp(value);
                              }}
                              placeholder="• • • • • •"
                              maxLength="6"
                              className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono rounded-xl bg-white border border-gray-200 focus:border-[#b8973d] focus:ring-2 focus:ring-[#b8973d]/20 outline-none transition-all shadow-sm"
                            />

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={handleVerifyOtp}
                                disabled={otp.length !== 6 || isVerifying}
                                className="flex-1 py-3 rounded-xl bg-[#b8973d] text-white font-semibold text-sm hover:bg-[#c9a74d] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                              >
                                {isVerifying ? (
                                  <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Verifying
                                  </span>
                                ) : (
                                  "Verify OTP"
                                )}
                              </button>
                              
                              <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={otpCooldown > 0}
                                className="px-4 py-3 rounded-xl border border-[#74271E] text-[#74271E] font-semibold text-sm hover:bg-[#74271E] hover:text-white disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent transition-all"
                              >
                                Resend
                              </button>
                            </div>
                          </div>

                          {/* OTP Status Message */}
                          {otpStatus.msg && (
                            <div className={`flex items-center gap-2 text-xs p-2 rounded-lg ${
                              otpStatus.type === "success" 
                                ? "bg-green-50 text-green-700" 
                                : "bg-red-50 text-red-600"
                            }`}>
                              {otpStatus.type === "success" ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              )}
                              {otpStatus.msg}
                            </div>
                          )}

                          {/* Help Text */}
                          <p className="text-[10px] text-gray-500 text-center">
                            Didn't receive code? Check spam folder or click resend
                          </p>
                        </motion.div>
                      )}

                      {/* Status Message for Email Sending */}
                      {otpStatus.msg && !isOtpSent && (
                        <p className={`text-xs mt-1 ${
                          otpStatus.type === "success" ? "text-green-600" : "text-red-600"
                        }`}>
                          {otpStatus.msg}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex justify-between px-1">
                      <label className="text-[10px] font-bold text-[#74271E] uppercase tracking-wider">
                        Password
                      </label>
                      {isLogin && (
                        <button
                          type="button"
                          onClick={() => setIsForgot(true)}
                          className="text-[10px] font-bold text-[#74271E] hover:underline transition-all"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative group">
                      <input
                        name="password"
                        type={showPass ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        className="w-full px-5 py-3 rounded-2xl bg-[#fdfaf2] border border-[#e8dfc4] focus:border-[#b8973d] focus:ring-4 focus:ring-[#b8973d]/10 outline-none transition-all shadow-inner text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#74271E]"
                      >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <InputGroup
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                  )}

                  <SubmitButton
                    loading={loading}
                    disabled={!isLogin && !isEmailVerified}
                    text={
                      isLogin
                        ? "Enter Gurukul"
                        : isEmailVerified
                          ? "Create Account"
                          : "Verify Email to Create"
                    }
                  />
                </form>

                {/* <div className={isLogin ? "mt-10" : "mt-6"}>
                  <div className="relative flex items-center justify-center mb-5">
                    <div className="w-full h-[1px] bg-gray-200" />
                    <span className="absolute bg-[#fffcf5] px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Or Continue With
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <SocialButton provider="Google" />
                    <SocialButton provider="Facebook" />
                    <SocialButton provider="Linkedin" />
                  </div>
                </div> */}

                <footer className="mt-10 text-center">
                  <p className="text-xs text-[#8c7a56] font-medium">
                    {isLogin ? "New to the Academy?" : "Already a Vidhyarthi?"}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="ml-2 text-[#74271E] font-black border-b-2 border-[#b8973d] hover:text-[#b8973d] transition-all"
                    >
                      {isLogin ? "Create Account" : "Login Now"}
                    </button>
                  </p>
                </footer>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- REUSABLE SUB-COMPONENTS (Aapke original design ke mutabik) ---
const InputGroup = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div className="space-y-1 flex-1">
    <label className="text-[10px] font-bold text-[#74271E] uppercase tracking-wider ml-1">
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full px-5 py-3 rounded-2xl bg-[#fdfaf2] border border-[#e8dfc4] focus:border-[#b8973d] focus:ring-4 focus:ring-[#b8973d]/10 outline-none transition-all shadow-inner text-sm"
    />
  </div>
);

const SubmitButton = ({ loading, text, disabled }) => (
  <motion.button
    whileHover={{ scale: 1.02, boxShadow: "0 10px 15px rgba(116,39,30,0.2)" }}
    whileTap={{ scale: 0.98 }}
    disabled={disabled || loading}
    type="submit"
    className={`w-full py-4 rounded-2xl font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 relative group mt-4 ${
      disabled || loading
        ? "bg-[#A88C64] text-white cursor-not-allowed"
        : "bg-[#74271E] text-white"
    }`}
  >
    <span className="relative z-10 text-xs">
      {loading ? "Processing..." : text}
    </span>
  </motion.button>
);

const SocialButton = ({ provider }) => (
  <motion.button
    whileHover={{ y: -2, backgroundColor: "#fdfaf2" }}
    className="flex-1 border border-[#e8dfc4] py-3 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-bold text-[#74271E] transition-all active:scale-95 shadow-sm"
  >
    {/* SVG Icons (Keep original) */}
    {provider === "Google" && (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    )}
    {provider === "Facebook" && (
      <svg width="18" height="18" fill="#1877F2" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )}
    {provider === "Twitter" && (
      <svg width="16" height="16" fill="#000000" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.134l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )}
    {provider === "Linkedin" && (
      <svg width="18" height="18" fill="#0A66C2" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    )}
  </motion.button>
);

export default AuthPage;