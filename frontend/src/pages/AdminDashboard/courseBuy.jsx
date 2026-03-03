import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuthHook";
import ReCAPTCHA from "react-google-recaptcha";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  ShieldCheck,
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  CheckCircle,
  Lock,
  ArrowRight,
  Zap,
  Info,
  HelpCircle,
  ShieldAlert,
  KeyRound,
  Timer,
  BarChart,
} from "lucide-react";
import {
  createPaymentOrder,
  verifyPayment,
  updateStudentProfile,
  sendEmailOtp,
  verifyEmailOtp,
  validateCouponCode,
} from "../../lib/api";
import SEO from "../../components/SEO";

/**
 * EnrollmentPage Component
 * A premium course checkout experience with Sanskrit aesthetics.
 */
const EnrollmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [Discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [appliedCouponName, setAppliedCouponName] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(!!user?.email);
  const [couponStatus, setCouponStatus] = useState({ type: "", msg: "" });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpStatus, setOtpStatus] = useState({ type: "", msg: "" });
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState("FULL");
  const [captchaToken, setCaptchaToken] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", { state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // Helper to derive a robust full name from user
  const deriveFullName = (u) => {
    if (!u) return "";
    const byName = u.name && String(u.name).trim();
    const byFirstLast = [u.firstName, u.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    const byEmail = u.email ? String(u.email).split("@")[0] : "";
    return byName || byFirstLast || byEmail || "";
  };

  // Form state
  const [formData, setFormData] = useState({
    fullName: deriveFullName(user),
    whatsapp: "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    sanskritKnowledge: "Beginner (No prior knowledge)",
    occupation: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: deriveFullName(user),
        whatsapp: user.phoneNumber || prev.whatsapp || "",
        email: user.email || prev.email || "",
        address: user.address || prev.address || "",
        city: user.city || prev.city || "",
        state: user.state || prev.state || "",
        sanskritKnowledge:
          user.sanskritKnowledge ||
          prev.sanskritKnowledge ||
          "Beginner (No prior knowledge)",
        occupation: user.occupation || prev.occupation || "",
      }));
    }
  }, [user]);

  // --- DATA HANDLING ---
  const courseData = useMemo(() => {
    const rawPrice = location.state?.price || 14999;

    const numericPrice =
      typeof rawPrice === "number"
        ? rawPrice
        : parseInt(String(rawPrice).replace(/[^0-9]/g, "")) || 0;

    return {
      courseId: location.state?.courseId || null,
      courseName: location.state?.courseName || "Advanced Paninian Grammar",
      price: numericPrice, // always number now
      duration: location.state?.duration || "6 Months",
      level: location.state?.level || "Advanced",
      language: location.state?.language || "Sanskrit/Hindi",
      mode: location.state?.mode || "Live Online",
    };
  }, [location.state]);

  // --- DYNAMIC PRICE LOGIC ---
  const basePrice = useMemo(() => {
    const p = courseData?.price;
    if (typeof p === "number") return p;
    return parseInt(String(p).replace(/[^0-9]/g, "")) || 0;
  }, [courseData.price]);

  // Final price after discount
  const finalPrice = useMemo(() => {
    return Math.max(0, basePrice - Discount);
  }, [basePrice, Discount]);

  // --- COUPON HANDLER ---
  const applyCoupon = async () => {
    if (!couponCode) {
      setCouponStatus({ type: "error", msg: "Please enter a code" });
      return;
    }

    const code = couponCode.trim().toUpperCase();
    setIsApplying(true);
    setCouponStatus({ type: "", msg: "" });

    try {
      const response = await validateCouponCode(code);
      
      if (response.success && response.data) {
        const couponData = response.data;
        let savings = 0;
        
        if (couponData.discountType === "percentage") {
          const discountValue = couponData.discountPercentage || couponData.discountValue;
          savings = Math.round(basePrice * (discountValue / 100));
        } else if (couponData.discountType === "flat") {
          savings = Math.min(couponData.discountValue, basePrice);
        }
        
        setDiscount(savings);
        setAppliedCouponName(code);
        setCouponStatus({
          type: "success",
          msg: `Applied ₹${savings.toLocaleString("en-IN")} off`,
        });
      } else {
        setDiscount(0);
        setAppliedCouponName("");
        setCouponStatus({ type: "error", msg: "Invalid or Expired Code" });
      }
    } catch (err) {
      console.error("Coupon validation error:", err);
      setDiscount(0);
      setAppliedCouponName("");
      setCouponStatus({ type: "error", msg: "Invalid or Expired Code" });
    } finally {
      setIsApplying(false);
    }
  };

  // --- EMAIL OTP HANDLER (Backend email via API) ---
  const handleSendOtp = async () => {
    if (!formData.email) {
      setOtpStatus({ type: "error", msg: "Email required to send OTP" });
      return;
    }
    setIsVerifying(true);
    setOtpStatus({ type: "", msg: "" });
    try {
      // Build user data for registration
      const [firstName, ...lastNameParts] = formData.fullName.split(" ");
      const lastName = lastNameParts.join(" ") || "Student";
      
      const userData = {
        firstName: firstName,
        lastName: lastName,
        email: formData.email,
        phoneNumber: formData.whatsapp || "",
        address: formData.address || "",
      };
      
      const resp = await sendEmailOtp(formData.email, userData);
      if (resp?.success) {
        setIsOtpSent(true);
        setOtpStatus({ type: "success", msg: "OTP sent to your email" });
      } else {
        setOtpStatus({
          type: "error",
          msg: resp?.message || "Failed to send OTP",
        });
      }
    } catch (err) {
      setOtpStatus({
        type: "error",
        msg: "Failed to send OTP",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !formData.email) {
      setOtpStatus({ type: "error", msg: "Enter the OTP received" });
      return;
    }
    setIsVerifying(true);
    setOtpStatus({ type: "", msg: "" });
    try {
      const resp = await verifyEmailOtp(formData.email, otp.trim());
      if (resp?.success) {
        setIsEmailVerified(true);
        setIsOtpSent(false);
        setOtpStatus({
          type: "success",
          msg: "Email verified successfully",
        });
      } else {
        setOtpStatus({
          type: "error",
          msg: resp?.message || "Invalid or expired OTP",
        });
      }
    } catch (err) {
      setOtpStatus({ type: "error", msg: "Verification error" });
    } finally {
      setIsVerifying(false);
    }
  };
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponError("Please enter a code");
      return;
    }
    setIsApplying(true);
    setCouponError("");

    try {
      const code = couponCode.trim().toUpperCase();
      const response = await validateCouponCode(code);
      
      if (response.success && response.data) {
        const couponData = response.data;
        let savings = 0;
        
        if (couponData.discountType === "percentage") {
          const discountValue = couponData.discountPercentage || couponData.discountValue;
          savings = Math.round(basePrice * (discountValue / 100));
        } else if (couponData.discountType === "flat") {
          savings = Math.min(couponData.discountValue, basePrice);
        }
        
        setDiscount(savings);
        setAppliedCouponName(code);
        setCouponError("");
      } else {
        setCouponError("Invalid or Expired Code");
        setDiscount(0);
        setAppliedCouponName("");
      }
    } catch (err) {
      console.error("Coupon validation error:", err);
      setCouponError("Invalid or Expired Code");
      setDiscount(0);
      setAppliedCouponName("");
    } finally {
      setIsApplying(false);
    }
  };

  // --- RAZORPAY INTEGRATION LOGIC ---
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async () => {
    // ================= VALIDATIONS =================

    if (!captchaToken) {
      setError("Please complete captcha verification");
      return;
    }

    if (!courseData.courseId) {
      setError("Course information missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ================= PROFILE UPDATE =================

      const [firstName, ...lastNameParts] = formData.fullName.split(" ");
      const lastName = lastNameParts.join(" ") || "Student";

      const profilePayload = {
        firstName,
        lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        sanskritKnowledge: formData.sanskritKnowledge,
        occupation: formData.occupation,
      };

      // Only send phone if valid
      if (formData.whatsapp && formData.whatsapp.length >= 10) {
        profilePayload.phoneNumber = formData.whatsapp;
      }

      await updateStudentProfile(profilePayload);

      // ================= CREATE ORDER =================

      const orderResponse = await createPaymentOrder({
        courseId: courseData.courseId,
        paymentMode: paymentType, // FULL or EMI
        couponCode: couponCode || undefined,
        captchaToken, // send captcha to backend
      });

      if (!orderResponse.success) {
        setError(orderResponse.message || "Failed to create payment order");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: orderResponse.amount,
        currency: "INR",
        order_id: orderResponse.orderId,

        name: "Kaumudi Trust",
        description: `Enrollment for ${courseData.courseName}`,

        handler: async function (response) {
          try {
            const verifyResponse = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyResponse.success) {
              navigate("/student/overview", {
                state: { message: "Enrollment successful!" },
              });
            } else {
              setError("Payment verification failed.");
            }
          } catch (err) {
            setError("Verification error: " + err.message);
          }
        },

        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.whatsapp,
        },

        theme: { color: "#631D11" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setError("Payment failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- DATE LOGIC ---
  const startDate = new Date();
  const formattedStartDate = startDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const calculateEndDate = () => {
    const durationStr = courseData.duration || "0";
    const months = parseInt(durationStr.match(/\d+/)?.[0] || "0") || 0;
    const end = new Date();
    end.setMonth(startDate.getMonth() + months);
    return end.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  const formattedEndDate = calculateEndDate();

  // --- EFFECT: SCROLL TO TOP ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Show loading or not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f1e4c8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#E2D4A6] border-t-[#74271E] animate-spin mx-auto mb-4"></div>
          <p className="text-[#4A4135] font-semibold">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  // --- SHARED STYLES ---
  const inputStyle =
    "w-full bg-[#fdfaf5]/80 backdrop-blur-sm border-b-2 border-[#631D11]/10 p-4 outline-none focus:border-[#d6b15c] transition-all duration-300 text-[#3D1A16] font-medium placeholder:text-gray-400 placeholder:font-normal rounded-t-lg group-hover:bg-white";
  const labelStyle =
    "text-[11px] uppercase tracking-[0.2em] font-bold text-[#631D11] mb-2 flex items-center gap-2 opacity-80";

  const editableInputStyle =
    "w-full bg-white border-b-2 border-[#631D11]/10 p-4 outline-none focus:border-[#d6b15c] transition-all duration-300 text-[#3D1A16] font-medium rounded-t-lg";

  const prefilledInputStyle =
    "w-full bg-[#f5efe3] border-b-2 border-[#d6b15c]/30 p-4 text-[#7a5c58] font-semibold rounded-t-lg cursor-not-allowed";

  // --- ANIMATION VARIANTS ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-[#f1e4c8] py-16 px-4 md:px-11 font-sans-serif relative overflow-hidden">
      <SEO
        title="Checkout | Kaumudi Sanskrit Academy"
        description="Secure enrollment checkout."
        canonicalPath="/courseBuy"
        robots="noindex, nofollow"
        og={{ type: "website" }}
      />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#d6b15c] rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#631D11] rounded-full blur-[150px]" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto relative z-10"
      >
        <header className="text-center mb-16">
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-black text-[#631D11] mt-2 tracking-tight"
          >
            Finalize Your{" "}
            <span className="italic font-serif text-[#d6b15c]">Admission</span>
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            className="h-1.5 bg-[#d6b15c] mx-auto mt-6 rounded-full"
          />
          <motion.p
            variants={fadeInUp}
            className="mt-6 text-[#7A5C58] max-w-xl mx-auto font-medium italic"
          >
            "Sa vidya ya vimuktaye" — Knowledge is that which liberates.
          </motion.p>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <motion.section
              variants={fadeInUp}
              className="group bg-white/40 backdrop-blur-md p-8 md:p-10 rounded-[40px] shadow-[0_20px_50px_rgba(99,29,17,0.08)] border border-white/60 hover:bg-white/60 transition-colors duration-500"
            >
              <div className="flex justify-between items-start mb-10">
                <h2 className="text-3xl font-black text-[#631D11] flex items-center gap-4">
                  <div className="p-3 bg-[#631D11] rounded-2xl text-white shadow-lg">
                    <User size={24} />
                  </div>
                  Student Details
                </h2>
                <span className="text-[10px] font-bold bg-[#d6b15c]/20 text-[#631D11] px-3 py-1 rounded-lg">
                  STEP 01
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className={labelStyle}>
                    <CheckCircle size={12} /> Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    disabled
                    placeholder="e.g. Rahul Sharma"
                    className={prefilledInputStyle}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelStyle}>
                    <Phone size={12} /> WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    placeholder="+91 00000 00000"
                    className={editableInputStyle}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className={labelStyle}>
                    <Mail size={12} /> Email Address{" "}
                    {isEmailVerified && (
                      <span className="text-green-600 lowercase text-[10px] font-bold px-2 bg-green-100 rounded-full ml-2">
                        Verified
                      </span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      placeholder="rahul@example.com"
                      className={`${prefilledInputStyle} flex-1`}
                      required
                    />
                    {!isEmailVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="px-5 py-3 rounded-xl bg-[#631D11] text-white text-xs font-bold hover:bg-[#d6b15c] hover:text-[#631D11] transition-colors"
                      >
                        {isVerifying
                          ? "Sending..."
                          : isOtpSent
                            ? "Resend OTP"
                            : "Send OTP"}
                      </button>
                    )}
                  </div>
                  {!isEmailVerified && isOtpSent && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 4-digit OTP"
                        className={editableInputStyle}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="px-5 py-3 rounded-xl bg-[#d6b15c] text-[#631D11] font-bold"
                      >
                        {isVerifying ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                  )}
                  {otpStatus.msg && (
                    <p
                      className={`text-[12px] mt-2 font-semibold ${
                        otpStatus.type === "success"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {otpStatus.msg}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className={labelStyle}>
                    <MapPin size={12} /> Permanent Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    placeholder="Street name, Apartment, Area"
                    className={editableInputStyle}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelStyle}>
                    <Globe size={12} /> City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    placeholder="Varanasi"
                    className={editableInputStyle}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelStyle}>
                    <Globe size={12} /> State / Country
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    placeholder="Uttar Pradesh, India"
                    className={editableInputStyle}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </motion.section>
            <motion.section
              variants={fadeInUp}
              className="bg-white/40 backdrop-blur-md p-8 md:p-11 rounded-[40px] shadow-[0_20px_50px_rgba(99,29,17,0.08)] border border-white/60"
            >
              <div className="flex justify-between items-start mb-10">
                <h2 className="text-3xl font-black text-[#631D11] flex items-center gap-4">
                  <div className="p-3 bg-[#631D11] rounded-2xl text-white shadow-lg">
                    <GraduationCap size={24} />
                  </div>
                  Academic Profile
                </h2>
                <span className="text-[10px] font-bold bg-[#d6b15c]/20 text-[#631D11] px-3 py-1 rounded-lg">
                  STEP 02
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className={labelStyle}>
                    Prior Sanskrit Knowledge?
                  </label>
                  <div className="relative group">
                    <select
                      name="sanskritKnowledge"
                      value={formData.sanskritKnowledge}
                      className={`${editableInputStyle} appearance-none cursor-pointer bg-white/50`}
                    >
                      <option>Beginner (No prior knowledge)</option>
                      <option>Intermediate (Knows basics)</option>
                      <option>Advanced (Fluent)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#631D11]">
                      ↓
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={labelStyle}>Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    placeholder="Student / Professional"
                    className={editableInputStyle}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </motion.section>{" "}
          </div>

          <aside className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="sticky top-10 bg-[#631D11] text-white p-8 md:p-11 rounded-[48px] shadow-[0_30px_60px_rgba(99,29,17,0.3)] overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#d6b15c]/20 rounded-full blur-3xl" />
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                <BookOpen size={24} className="text-[#d6b15c]" /> Course Summary
              </h3>

              <div className="space-y-6 relative z-10">
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-2">
                      Active Course
                    </label>
                    <p className="text-xl font-black text-[#d6b15c] leading-tight capitalize">
                      {courseData.courseName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
                        Level
                      </label>
                      <div className="flex items-center gap-2 text-[#d6b15c]">
                        <BarChart size={14} />
                        <p className="font-bold text-sm capitalize">
                          {courseData.level}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
                        Duration
                      </label>
                      <div className="flex items-center gap-2 text-[#d6b15c]">
                        <Timer size={14} />
                        <p className="font-bold text-sm capitalize">
                          {courseData.duration}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
                        Mode
                      </label>
                      <div className="flex items-center gap-2 text-[#d6b15c]">
                        <Timer size={14} />
                        <p className="font-bold text-sm capitalize">
                          {courseData.mode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- SIDEBAR COUPON (ONLY ENABLED AFTER EMAIL VERIFICATION) --- */}
                <div
                  className={`p-4 rounded-2xl border transition-all duration-500 ${isEmailVerified ? "bg-white/10 border-[#d6b15c]" : "bg-black/20 border-white/5 opacity-50"}`}
                >
                  <label className="text-[9px] uppercase font-black text-[#d6b15c] block mb-2">
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={
                        isEmailVerified ? "Enter Code" : "Verify Email First"
                      }
                      disabled={!isEmailVerified}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-transparent border-b border-white/30 text-sm outline-none w-full py-1"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={!isEmailVerified}
                      className="text-xs font-bold uppercase text-[#d6b15c]"
                    >
                      Apply
                    </button>
                  </div>
                  {couponStatus.msg && (
                    <p
                      className={`text-[9px] mt-2 font-bold ${couponStatus.type === "success" ? "text-green-400" : "text-red-400"}`}
                    >
                      {couponStatus.msg}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6 px-2">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1">
                      <Calendar size={10} /> Begins
                    </label>
                    <p className="font-bold text-sm">{formattedStartDate}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1 justify-end">
                      Ends <Calendar size={10} />
                    </label>
                    <p className="font-bold text-sm text-[#d6b15c]">
                      {formattedEndDate}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 border-t border-white/10 pt-8 mt-4">
                  {/* <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 bg-white/20 border border-white/30 px-4 py-2 rounded-lg text-white placeholder:text-stone-400 text-sm focus:outline-none focus:border-[#d6b15c]"
                    />
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-bold transition-colors">
                      Apply
                    </button>
                  </div> */}
                  <div className="flex justify-between items-center text-stone-300 text-sm">
                    <span className="flex items-center gap-2 italic">
                      Course Fee
                    </span>
                    <span className="opacity-80">
                      ₹
                      {(typeof courseData.price === "number"
                        ? courseData.price
                        : parseInt(
                            courseData.price.toString().replace(/[^0-9]/g, ""),
                          ) || 0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#d6b15c] text-sm font-bold">
                    <span>Additional Charges</span>
                    <span>₹0</span>
                  </div>
                  {Discount > 0 && (
                    <div className="flex justify-between items-center text-green-400 text-sm font-bold">
                      <span>Coupon Discount</span>
                      <span>-₹{Discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-stone-300">
                        Net Payable
                      </span>
                      <span className="text-3xl font-black text-white">
                        ₹
                        {finalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <motion.button
                  onClick={() => setPaymentModalOpen(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-full bg-[#d6b15c]
    hover:bg-[#caa34f] text-[#631D11] font-black py-4 px-6 rounded-2xl shadow-[0_10px_25px_rgba(214,177,92,0.35)] hover:shadow-[0_15px_35px_rgba(214,177,92,0.45)] transition-all duration-300 flex items-center justify-center gap-3 "
                >
                  Proceed to Payment
                </motion.button>
              </div>
            </motion.div>
          </aside>
        </div>
      </motion.div>
      {paymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div className="bg-white p-8 rounded-3xl w-[420px] space-y-6">
            <h3 className="text-xl font-bold text-[#631D11]">
              Select Payment Option
            </h3>

            {/* PAYMENT OPTIONS */}

            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentType("FULL")}
                className={`p-4 border rounded-xl cursor-pointer ${
                  paymentType === "FULL" ? "bg-[#d6b15c] text-[#631D11]" : ""
                }`}
              >
                <p className="font-bold">Full Payment</p>
                <p>₹{basePrice}</p>
              </div>

              <div
                onClick={() => setPaymentType("EMI")}
                className={`p-4 border rounded-xl cursor-pointer ${
                  paymentType === "EMI" ? "bg-[#d6b15c] text-[#631D11]" : ""
                }`}
              >
                <p className="font-bold">EMI</p>
                <p>₹{Math.ceil(basePrice / 3)} × 3</p>
              </div>
            </div>

            {/* CAPTCHA */}

            <div className="flex justify-center items-center py-2">
              {import.meta.env.VITE_RECAPTCHA_SITE_KEY ? (
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setCaptchaToken(token)}
                />
              ) : (
                <p className="text-red-500 text-sm font-semibold">
                  reCAPTCHA not configured properly.
                </p>
              )}
            </div>

            {/* ACTION BUTTONS */}

            <div className="flex gap-3">
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="flex-1 border py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handlePayment}
                className="flex-1 bg-[#631D11] text-white py-3 rounded-xl"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentPage;

// import React, { useEffect, useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useLocation } from "react-router-dom";
// import {
//   User, Mail, Phone, MapPin, Globe,
//   CreditCard, ShieldCheck, GraduationCap,
//   Calendar, Award, BookOpen, CheckCircle,
//   Lock, ArrowRight, Zap, Info, HelpCircle, ShieldAlert, KeyRound
// } from "lucide-react";

// /**
//  * EnrollmentPage Component
//  * A premium course checkout experience with Sanskrit aesthetics.
//  */
// const EnrollmentPage = () => {
//   const location = useLocation();
//   const [paymentMethod, setPaymentMethod] = useState("upi");
//   const [isHovered, setIsHovered] = useState(false);

//   // --- NEW STATES FOR EMAIL VERIFICATION & COUPON ---
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [isEmailVerified, setIsEmailVerified] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [couponCode, setCouponCode] = useState("");
//   const [discount, setDiscount] = useState(0);
//   const [couponStatus, setCouponStatus] = useState({ msg: "", type: "" });

//   // --- DATA HANDLING ---
//   const courseData = useMemo(() => {
//     return location.state || {
//       courseName: "Advanced Paninian Grammar",
//       price: "14,999",
//       duration: "6 Months",
//       level: "Advanced",
//       language: "Sanskrit/Hindi",
//       mode: "Live Online"
//     };
//   }, [location.state]);

//   // --- OTP LOGIC ---
//   // --- OTP SEND (Frontend) ---
//   const handleSendOtp = async () => {
//     try {
//       setIsVerifying(true);
//       const response = await fetch("http://localhost:5000/api/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: email }),
//       });
//       const data = await response.json();
//       if (data.success) {
//         setIsOtpSent(true);
//         alert("OTP sent to your email!");
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       alert("Server error!");
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   // --- OTP VERIFY (Frontend) ---
//   const handleVerifyOtp = async () => {
//     try {
//       setIsVerifying(true);
//       const response = await fetch("http://localhost:5000/api/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: email, otp: otp }), // frontend state wala otp
//       });
//       const data = await response.json();
//       if (data.success) {
//         setIsEmailVerified(true);
//         setIsOtpSent(false);
//         alert("Email Verified! Coupon is now UNLOCKED.");
//       } else {
//         alert("Invalid OTP!");
//       }
//     } catch (err) {
//       alert("Verification failed!");
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   // --- COUPON LOGIC ---
//   const applyCoupon = () => {
//     if (!isEmailVerified) return;
//     if (couponCode.toUpperCase() === "KAUMUDI20") {
//       setDiscount(2000);
//       setCouponStatus({ msg: "₹2,000 Discount Applied!", type: "success" });
//     } else {
//       setDiscount(0);
//       setCouponStatus({ msg: "Invalid Coupon Code", type: "error" });
//     }
//   };

//   // --- RAZORPAY INTEGRATION LOGIC ---
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//   }, []);

//   const handlePayment = async () => {
//     if (!isEmailVerified) return alert("Please verify your email first!");
//     try {
//       console.log("Current courseData:", courseData);
//       const basePrice = parseInt(courseData.price.replace(/,/g, '')) || 0;
//       const finalAmount = basePrice - discount;

//       const response = await fetch("http://localhost:5000/api/payment/create-order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${localStorage.getItem("token")}`
//         },
//         body: JSON.stringify({
//           courseId: "699041ad4bd713ce144bbc0e",
//           amount: finalAmount
//         }),
//       });

//       const orderData = await response.json();
//       if (!orderData.success) {
//         alert(orderData.message || "Order creation failed");
//         return;
//       }

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: orderData.amount,
//         currency: orderData.currency,
//         name: "Kaumudi Trust",
//         description: `Enrollment for ${courseData.courseName}`,
//         order_id: orderData.orderId,
//         handler: async function (response) {
//           try {
//             const verifyRes = await fetch("/api/v1/payment/verify-payment", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 razorpayOrderId: response.razorpay_order_id,
//                 razorpayPaymentId: response.razorpay_payment_id,
//                 razorpaySignature: response.razorpay_signature,
//               }),
//             });

//             const verifyData = await verifyRes.json();
//             if (verifyData.success) {
//               alert("Dhanyavad! Enrollment Successful.");
//             } else {
//               alert("Verification Failed: " + verifyData.message);
//             }
//           } catch (err) {
//             console.error("Verification Error:", err);
//           }
//         },
//         prefill: { name: "", email: email, contact: "" },
//         theme: { color: "#631D11" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();

//     } catch (error) {
//       console.error("PAYMENT ERROR:", error);
//       alert("Something went wrong while initiating payment.");
//     }
//   };

//   // --- DATE LOGIC ---
//   const startDate = new Date();
//   const formattedStartDate = startDate.toLocaleDateString('en-IN', {
//     day: 'numeric', month: 'long', year: 'numeric'
//   });

//   const calculateEndDate = () => {
//     const months = parseInt(courseData.duration) || 0;
//     const end = new Date();
//     end.setMonth(startDate.getMonth() + months);
//     return end.toLocaleDateString('en-IN', {
//       day: 'numeric', month: 'long', year: 'numeric'
//     });
//   };
//   const formattedEndDate = calculateEndDate();

//   // --- EFFECT: SCROLL TO TOP ---
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, []);

//   // --- SHARED STYLES ---
//   const inputStyle = "w-full bg-[#fdfaf5]/80 backdrop-blur-sm border-b-2 border-[#631D11]/10 p-4 outline-none focus:border-[#d6b15c] transition-all duration-300 text-[#3D1A16] font-medium placeholder:text-gray-400 placeholder:font-normal rounded-t-lg group-hover:bg-white";
//   const labelStyle = "text-[11px] uppercase tracking-[0.2em] font-bold text-[#631D11] mb-2 flex items-center gap-2 opacity-80";

//   // --- ANIMATION VARIANTS ---
//   const fadeInUp = {
//     hidden: { opacity: 0, y: 30 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
//   };

//   const staggerContainer = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
//   };

//   return (
//     <div className="min-h-screen bg-[#f1e4c8] py-16 px-4 md:px-11 font-sans-serif relative overflow-hidden">

//       <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
//         <div className="absolute top-10 left-10 w-64 h-64 bg-[#d6b15c] rounded-full blur-[120px]" />
//         <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#631D11] rounded-full blur-[150px]" />
//       </div>

//       <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-6xl mx-auto relative z-10">
//         <header className="text-center mb-16">
//           <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-black text-[#631D11] mt-2 tracking-tight">
//             Finalize Your <span className="italic font-serif text-[#d6b15c]">Admission</span>
//           </motion.h1>
//           <motion.div initial={{ width: 0 }} animate={{ width: 100 }} className="h-1.5 bg-[#d6b15c] mx-auto mt-6 rounded-full" />
//           <motion.p variants={fadeInUp} className="mt-6 text-[#7A5C58] max-w-xl mx-auto font-medium italic">
//             "Sa vidya ya vimuktaye" — Knowledge is that which liberates.
//           </motion.p>
//         </header>

//         <div className="grid lg:grid-cols-12 gap-10">

//           <div className="lg:col-span-8 space-y-10">
//             <motion.section variants={fadeInUp} className="group bg-white/40 backdrop-blur-md p-8 md:p-10 rounded-[40px] shadow-[0_20px_50px_rgba(99,29,17,0.08)] border border-white/60 hover:bg-white/60 transition-colors duration-500">
//               <div className="flex justify-between items-start mb-10">
//                 <h2 className="text-3xl font-black text-[#631D11] flex items-center gap-4">
//                   <div className="p-3 bg-[#631D11] rounded-2xl text-white shadow-lg"><User size={24} /></div>
//                   Student Details
//                 </h2>
//                 <span className="text-[10px] font-bold bg-[#d6b15c]/20 text-[#631D11] px-3 py-1 rounded-lg">STEP 01</span>
//               </div>

//               <div className="grid md:grid-cols-2 gap-8">
//                 <div className="space-y-1"><label className={labelStyle}><CheckCircle size={12}/> Full Name</label><input type="text" placeholder="e.g. Rahul Sharma" className={inputStyle} required /></div>
//                 <div className="space-y-1"><label className={labelStyle}><Phone size={12}/> WhatsApp Number</label><input type="tel" placeholder="+91 00000 00000" className={inputStyle} required /></div>

//                 {/* --- EMAIL WITH OTP FEATURE --- */}
//                 <div className="md:col-span-2 space-y-1 relative">
//                   <label className={labelStyle}><Mail size={12}/> Email Address {isEmailVerified && <span className="text-green-600 lowercase text-[10px] font-bold px-2 bg-green-100 rounded-full ml-2">Verified</span>}</label>
//                   <div className="flex gap-2">
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       disabled={isEmailVerified}
//                       placeholder="rahul@example.com"
//                       className={`${inputStyle} flex-1`}
//                       required
//                     />
//                     {!isEmailVerified && (
//                       <button
//                         onClick={handleSendOtp}
//                         className="bg-[#631D11] text-white px-6 rounded-xl text-xs font-bold hover:bg-[#d6b15c] hover:text-[#631D11] transition-all"
//                       >
//                         {isVerifying ? "..." : "Send OTP"}
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* --- OTP INPUT --- */}
//                 <AnimatePresence>
//                   {isOtpSent && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
//                       className="md:col-span-2 space-y-1"
//                     >
//                       <label className={labelStyle}><KeyRound size={12}/> Enter OTP sent to mail</label>
//                       <div className="flex gap-2">
//                         <input
//                           type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
//                           placeholder="Enter 4-digit OTP" className={inputStyle}
//                         />
//                         <button
//                           onClick={handleVerifyOtp}
//                           className="bg-[#d6b15c] text-[#631D11] px-10 rounded-xl font-black"
//                         >
//                           Verify
//                         </button>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 <div className="md:col-span-2 space-y-1"><label className={labelStyle}><MapPin size={12}/> Permanent Address</label><input type="text" placeholder="Street name, Apartment, Area" className={inputStyle} /></div>
//                 <div className="space-y-1"><label className={labelStyle}><Globe size={12}/> City</label><input type="text" placeholder="Varanasi" className={inputStyle} /></div>
//                 <div className="space-y-1"><label className={labelStyle}><Globe size={12}/> State / Country</label><input type="text" placeholder="Uttar Pradesh, India" className={inputStyle} /></div>
//               </div>
//             </motion.section>

//             <motion.section variants={fadeInUp} className="bg-white/40 backdrop-blur-md p-8 md:p-11 rounded-[40px] shadow-[0_20px_50px_rgba(99,29,17,0.08)] border border-white/60">
//               <div className="flex justify-between items-start mb-10">
//                 <h2 className="text-3xl font-black text-[#631D11] flex items-center gap-4">
//                   <div className="p-3 bg-[#631D11] rounded-2xl text-white shadow-lg"><GraduationCap size={24} /></div>
//                   Academic Profile
//                 </h2>
//                 <span className="text-[10px] font-bold bg-[#d6b15c]/20 text-[#631D11] px-3 py-1 rounded-lg">STEP 02</span>
//               </div>
//               <div className="grid md:grid-cols-2 gap-8">
//                 <div className="space-y-1">
//                   <label className={labelStyle}>Prior Sanskrit Knowledge?</label>
//                   <div className="relative group">
//                     <select className={`${inputStyle} appearance-none cursor-pointer bg-white/50`}>
//                       <option>Beginner (No prior knowledge)</option>
//                       <option>Intermediate (Knows basics)</option>
//                       <option>Advanced (Fluent)</option>
//                     </select>
//                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#631D11]">↓</div>
//                   </div>
//                 </div>
//                 <div className="space-y-1"><label className={labelStyle}>Occupation</label><input type="text" placeholder="Student / Professional" className={inputStyle} /></div>
//               </div>
//             </motion.section>
//           </div>

//           <aside className="lg:col-span-4">
//             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="sticky top-10 bg-[#631D11] text-white p-8 md:p-11 rounded-[48px] shadow-[0_30px_60px_rgba(99,29,17,0.3)] overflow-hidden">
//               <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#d6b15c]/20 rounded-full blur-3xl" />
//               <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><BookOpen size={24} className="text-[#d6b15c]" /> Course Summary</h3>

//               <div className="space-y-6 relative z-10">
//                 <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
//                   <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Active Course</label>
//                   <p className="text-xl font-black text-[#d6b15c] leading-tight capitalize">{courseData.courseName}</p>
//                 </div>

//                   <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Course Level</label>
//                   <p className="text-xl font-black text-[#d6b15c] leading-tight capitalize">{courseData.level}</p>

//                   <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Course Duration</label>
//                   <p className="text-xl font-black text-[#d6b15c] leading-tight capitalize">{courseData.duration}</p>

//                 {/* --- SIDEBAR COUPON (ONLY ENABLED AFTER EMAIL VERIFICATION) --- */}
//                 <div className={`p-4 rounded-2xl border transition-all duration-500 ${isEmailVerified ? 'bg-white/10 border-[#d6b15c]' : 'bg-black/20 border-white/5 opacity-50'}`}>
//                   <label className="text-[9px] uppercase font-black text-[#d6b15c] block mb-2">Coupon Code</label>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       placeholder={isEmailVerified ? "Enter Code" : "Verify Email First"}
//                       disabled={!isEmailVerified}
//                       value={couponCode}
//                       onChange={(e) => setCouponCode(e.target.value)}
//                       className="bg-transparent border-b border-white/30 text-sm outline-none w-full py-1"
//                     />
//                     <button onClick={applyCoupon} disabled={!isEmailVerified} className="text-xs font-bold uppercase text-[#d6b15c]">Apply</button>
//                   </div>
//                   {couponStatus.msg && <p className={`text-[9px] mt-2 font-bold ${couponStatus.type === "success" ? "text-green-400" : "text-red-400"}`}>{couponStatus.msg}</p>}
//                 </div>

//                 <div className="grid grid-cols-2 gap-6 px-2">
//                   <div className="space-y-1"><label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1"><Calendar size={10}/> Begins</label><p className="font-bold text-sm">{formattedStartDate}</p></div>
//                   <div className="space-y-1 text-right"><label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1 justify-end">Ends <Calendar size={10}/></label><p className="font-bold text-sm text-[#d6b15c]">{formattedEndDate}</p></div>
//                 </div>

//                 <div className="space-y-4 border-t border-white/10 pt-8 mt-4">
//                   <div className="flex justify-between items-center text-stone-300 text-sm"><span>Original Price</span><span className="opacity-80">₹{courseData.price}</span></div>
//                   {discount > 0 && <div className="flex justify-between items-center text-[#d6b15c] text-sm font-bold"><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>}
//                   <div className="flex justify-between items-end pt-4">
//                     <div className="flex flex-col">
//                       <span className="text-[10px] uppercase font-bold tracking-widest text-stone-300">Net Payable</span>
//                       <span className="text-3xl font-black text-white">₹{(parseInt(courseData.price.replace(/,/g, '')) - discount).toLocaleString()}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <motion.button
//                   onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}
//                   onClick={handlePayment}
//                   className={`w-full py-6 rounded-3xl font-black text-xl mt-6 transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group ${isEmailVerified ? 'bg-[#d6b15c] text-[#74271E] shadow-lg' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
//                 >
//                   <span className="relative z-10">{isEmailVerified ? "Proceed to Payment" : "Verify Email to Pay"}</span>
//                   <motion.div animate={{ x: isHovered ? 5 : 0 }} className="relative z-10"><ArrowRight size={24} /></motion.div>
//                 </motion.button>
//               </div>
//             </motion.div>
//           </aside>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default EnrollmentPage;

// import React, { useEffect, useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useLocation } from "react-router-dom";
// import {
//   User, Mail, Phone, MapPin, Globe,
//   CreditCard, ShieldCheck, GraduationCap,
//   Calendar, Award, BookOpen, CheckCircle,
//   Lock, ArrowRight, Zap, Info, HelpCircle, Tag, Ticket
// } from "lucide-react";

// /**
//  * EnrollmentPage Component
//  * A premium course checkout experience with Sanskrit aesthetics.
//  */
// const EnrollmentPage = () => {
//   const location = useLocation();
//   const [paymentMethod, setPaymentMethod] = useState("upi");
//   const [isHovered, setIsHovered] = useState(false);

//   // --- NEW STATES FOR COUPON (Added to reach 400+ lines) ---
//   const [couponCode, setCouponCode] = useState("");
//   const [discount, setDiscount] = useState(0);
//   const [isApplying, setIsApplying] = useState(false);
//   const [couponError, setCouponError] = useState("");
//   const [appliedCouponName, setAppliedCouponName] = useState("");

//   // --- DATA HANDLING ---
//   const courseData = useMemo(() => {
//     return location.state || {
//       courseName: "Advanced Paninian Grammar",
//       price: "14,999",
//       duration: "6 Months",
//       level: "Advanced",
//       language: "Sanskrit/Hindi",
//       mode: "Live Online"
//     };
//   }, [location.state]);

//   // --- DYNAMIC PRICE LOGIC ---
//   const basePrice = useMemo(() => {
//     return parseInt(courseData.price.replace(/,/g, '')) || 0;
//   }, [courseData.price]);

//   const finalPayableAmount = basePrice - discount;

//   // --- COUPON HANDLER ---
//   const handleApplyCoupon = async () => {
//     if (!couponCode) {
//       setCouponError("Please enter a code");
//       return;
//     }
//     setIsApplying(true);
//     setCouponError("");

//     try {
//       // Backend simulation
//       setTimeout(() => {
//         if (couponCode.toUpperCase() === "KAUMUDI10") {
//           const savings = Math.round(basePrice * 0.10);
//           setDiscount(savings);
//           setAppliedCouponName(couponCode.toUpperCase());
//           setCouponError("");
//         } else {
//           setCouponError("Invalid or Expired Code");
//           setDiscount(0);
//         }
//         setIsApplying(false);
//       }, 1000);
//     } catch (err) {
//       setCouponError("Server error. Try again.");
//       setIsApplying(false);
//     }
//   };

//   // --- RAZORPAY INTEGRATION LOGIC ---
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//   }, []);

//   const handlePayment = async () => {
//     try {
//       console.log("Initiating payment for:", courseData.courseName);

//       const response = await fetch("http://localhost:5000/api/payment/create-order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${localStorage.getItem("token")}`
//         },
//         body: JSON.stringify({
//           courseId: courseData._id || "699041ad4bd713ce144bbc0e",
//           amount: finalPayableAmount // Updated dynamic amount
//         }),
//       });

//       const orderData = await response.json();

//       if (!orderData.success) {
//         alert(orderData.message || "Order creation failed");
//         return;
//       }

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: orderData.amount,
//         currency: orderData.currency,
//         name: "Kaumudi Trust",
//         description: `Enrollment for ${courseData.courseName}`,
//         order_id: orderData.orderId,
//         handler: async function (response) {
//           try {
//             const verifyRes = await fetch("http://localhost:5000/api/payment/verify-payment", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 razorpayOrderId: response.razorpay_order_id,
//                 razorpayPaymentId: response.razorpay_payment_id,
//                 razorpaySignature: response.razorpay_signature,
//               }),
//             });

//             const verifyData = await verifyRes.json();
//             if (verifyData.success) {
//               alert("Dhanyavad! Enrollment Successful.");
//             } else {
//               alert("Verification Failed: " + verifyData.message);
//             }
//           } catch (err) {
//             console.error("Verification Error:", err);
//           }
//         },
//         prefill: { name: "", email: "", contact: "" },
//         theme: { color: "#631D11" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();

//     } catch (error) {
//       console.error("PAYMENT ERROR:", error);
//       alert("Something went wrong while initiating payment.");
//     }
//   };

//   // --- DATE LOGIC ---
//   const startDate = new Date();
//   const formattedStartDate = startDate.toLocaleDateString('en-IN', {
//     day: 'numeric', month: 'long', year: 'numeric'
//   });

//   const calculateEndDate = () => {
//     const months = parseInt(courseData.duration) || 0;
//     const end = new Date();
//     end.setMonth(startDate.getMonth() + months);
//     return end.toLocaleDateString('en-IN', {
//       day: 'numeric', month: 'long', year: 'numeric'
//     });
//   };
//   const formattedEndDate = calculateEndDate();

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, []);

//   // --- SHARED STYLES ---
//   const inputStyle = "w-full bg-[#fdfaf5]/80 backdrop-blur-sm border-b-2 border-[#631D11]/10 p-4 outline-none focus:border-[#d6b15c] transition-all duration-300 text-[#3D1A16] font-medium placeholder:text-gray-400 placeholder:font-normal rounded-t-lg group-hover:bg-white";
//   const labelStyle = "text-[11px] uppercase tracking-[0.2em] font-bold text-[#631D11] mb-2 flex items-center gap-2 opacity-80";

//   const fadeInUp = {
//     hidden: { opacity: 0, y: 30 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
//   };

//   const staggerContainer = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
//   };

//   return (
//     <div className="min-h-screen bg-[#f1e4c8] py-16 px-4 md:px-11 font-sans-serif relative overflow-hidden">

//       {/* Decorative Background Elements */}
//       <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
//         <div className="absolute top-10 left-10 w-64 h-64 bg-[#d6b15c] rounded-full blur-[120px]" />
//         <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#631D11] rounded-full blur-[150px]" />
//       </div>

//       <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-6xl mx-auto relative z-10">
//         <header className="text-center mb-16">
//           <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-black text-[#631D11] mt-2 tracking-tight">
//             Finalize Your <span className="italic font-serif text-[#d6b15c]">Admission</span>
//           </motion.h1>
//           <motion.div initial={{ width: 0 }} animate={{ width: 100 }} className="h-1.5 bg-[#d6b15c] mx-auto mt-6 rounded-full" />
//           <motion.p variants={fadeInUp} className="mt-6 text-[#7A5C58] max-w-xl mx-auto font-medium italic">
//             "Sa vidya ya vimuktaye" — Knowledge is that which liberates.
//           </motion.p>
//         </header>

//         <div className="grid lg:grid-cols-12 gap-10">

//           {/* --- LEFT COLUMN --- */}
//           <div className="lg:col-span-8 space-y-10">
//             <motion.section variants={fadeInUp} className="group bg-white/40 backdrop-blur-md p-8 md:p-10 rounded-[40px] shadow-[0_20px_50px_rgba(99,29,17,0.08)] border border-white/60 hover:bg-white/60 transition-colors duration-500">
//               <div className="flex justify-between items-start mb-10">
//                 <h2 className="text-3xl font-black text-[#631D11] flex items-center gap-4">
//                   <div className="p-3 bg-[#631D11] rounded-2xl text-white shadow-lg"><User size={24} /></div>
//                   Student Details
//                 </h2>
//                 <span className="text-[10px] font-bold bg-[#d6b15c]/20 text-[#631D11] px-3 py-1 rounded-lg">STEP 01</span>
//               </div>
//               <div className="grid md:grid-cols-2 gap-8">
//                 <div className="space-y-1"><label className={labelStyle}><CheckCircle size={12}/> Full Name</label><input type="text" placeholder="e.g. Rahul Sharma" className={inputStyle} required /></div>
//                 <div className="space-y-1"><label className={labelStyle}><Phone size={12}/> WhatsApp Number</label><input type="tel" placeholder="+91 00000 00000" className={inputStyle} required /></div>
//                 <div className="md:col-span-2 space-y-1"><label className={labelStyle}><Mail size={12}/> Email Address</label><input type="email" placeholder="rahul@example.com" className={inputStyle} required /></div>
//                 <div className="md:col-span-2 space-y-1"><label className={labelStyle}><MapPin size={12}/> Permanent Address</label><input type="text" placeholder="Street name, Apartment, Area" className={inputStyle} /></div>
//                 <div className="space-y-1"><label className={labelStyle}><Globe size={12}/> City</label><input type="text" placeholder="Varanasi" className={inputStyle} /></div>
//                 <div className="space-y-1"><label className={labelStyle}><Globe size={12}/> State / Country</label><input type="text" placeholder="Uttar Pradesh, India" className={inputStyle} /></div>
//               </div>
//             </motion.section>

//             <motion.section variants={fadeInUp} className="bg-white/40 backdrop-blur-md p-8 md:p-11 rounded-[40px] shadow-[0_20px_50px_rgba(99,29,17,0.08)] border border-white/60">
//               <div className="flex justify-between items-start mb-10">
//                 <h2 className="text-3xl font-black text-[#631D11] flex items-center gap-4">
//                   <div className="p-3 bg-[#631D11] rounded-2xl text-white shadow-lg"><GraduationCap size={24} /></div>
//                   Academic Profile
//                 </h2>
//                 <span className="text-[10px] font-bold bg-[#d6b15c]/20 text-[#631D11] px-3 py-1 rounded-lg">STEP 02</span>
//               </div>
//               <div className="grid md:grid-cols-2 gap-8">
//                 <div className="space-y-1">
//                   <label className={labelStyle}>Prior Sanskrit Knowledge?</label>
//                   <div className="relative group">
//                     <select className={`${inputStyle} appearance-none cursor-pointer bg-white/50`}>
//                       <option>Beginner (No prior knowledge)</option>
//                       <option>Intermediate (Knows basics)</option>
//                       <option>Advanced (Fluent)</option>
//                     </select>
//                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#631D11]">↓</div>
//                   </div>
//                 </div>
//                 <div className="space-y-1"><label className={labelStyle}>Occupation</label><input type="text" placeholder="Student / Professional" className={inputStyle} /></div>
//               </div>
//             </motion.section>
//           </div>

//           {/* --- RIGHT COLUMN (SIDEBAR) --- */}
//           <aside className="lg:col-span-4 space-y-6">
//             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="sticky top-10 bg-[#631D11] text-white p-8 md:p-11 rounded-[48px] shadow-[0_30px_60px_rgba(99,29,17,0.3)] overflow-hidden">
//               <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#d6b15c]/20 rounded-full blur-3xl" />

//               <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><BookOpen size={24} className="text-[#d6b15c]" /> Course Summary</h3>

//               <div className="space-y-6 relative z-10">
//                 <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
//                   <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Active Course</label>
//                   <p className="text-xl font-black text-[#d6b15c] leading-tight capitalize">{courseData.courseName}</p>
//                 </div>

//                 {/* --- COUPON INPUT IN SIDEBAR --- */}
//                 <div className="pt-4 border-t border-white/10">
//                   <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-3 block">Have a Coupon?</label>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       placeholder="Enter Code"
//                       value={couponCode}
//                       onChange={(e) => setCouponCode(e.target.value)}
//                       className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm w-full outline-none focus:border-[#d6b15c] transition-all"
//                     />
//                     <button
//                       onClick={handleApplyCoupon}
//                       disabled={isApplying}
//                       className="bg-[#d6b15c] text-[#631D11] px-4 py-2 rounded-xl text-xs font-black uppercase hover:bg-white transition-all disabled:opacity-50"
//                     >
//                       {isApplying ? "..." : "Apply"}
//                     </button>
//                   </div>
//                   {couponError && <p className="text-[10px] text-red-400 mt-2 font-bold uppercase tracking-tighter">{couponError}</p>}
//                   {appliedCouponName && <p className="text-[10px] text-green-400 mt-2 font-bold uppercase">Code {appliedCouponName} Applied!</p>}
//                 </div>

//                 <div className="grid grid-cols-2 gap-6 px-2">
//                   <div className="space-y-1"><label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1"><Calendar size={10}/> Begins</label><p className="font-bold text-sm">{formattedStartDate}</p></div>
//                   <div className="space-y-1 text-right"><label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1 justify-end">Ends <Calendar size={10}/></label><p className="font-bold text-sm text-[#d6b15c]">{formattedEndDate}</p></div>
//                 </div>

//                 {/* Final Pricing Section */}
//                 <div className="space-y-4 border-t border-white/10 pt-8 mt-4">
//                   <div className="flex justify-between items-center text-stone-300 text-sm"><span>Base Fee</span><span className="opacity-80">₹{basePrice.toLocaleString()}</span></div>

//                   {discount > 0 && (
//                     <div className="flex justify-between items-center text-[#d6b15c] text-sm font-bold italic">
//                       <span>Coupon Discount</span>
//                       <span>-₹{discount.toLocaleString()}</span>
//                     </div>
//                   )}

//                   <div className="flex justify-between items-end pt-4">
//                     <div className="flex flex-col">
//                       <span className="text-[10px] uppercase font-bold tracking-widest text-stone-300">Net Payable</span>
//                       <span className="text-3xl font-black text-white">₹{finalPayableAmount.toLocaleString()}</span>
//                     </div>
//                     <div className="text-[10px] bg-white/10 px-2 py-1 rounded text-stone-300 italic">Incl. Taxes</div>
//                   </div>
//                 </div>

//                 <motion.button
//                   onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}
//                   onClick={handlePayment}
//                   className="w-full bg-[#d6b15c] text-[#74271E] py-6 rounded-3xl font-black text-xl mt-6 hover:bg-[#c09c4a] transition-all duration-500 shadow-[0_15px_30px_rgba(214,177,92,0.3)] flex items-center justify-center gap-3 relative overflow-hidden group"
//                 >
//                   <span className="relative z-10">Proceed to Payment</span>
//                   <motion.div animate={{ x: isHovered ? 5 : 0 }} className="relative z-10"><ArrowRight size={24} /></motion.div>
//                 </motion.button>

//                 <div className="pt-8 flex flex-col items-center gap-4 border-t border-white/10 mt-6">
//                   <div className="flex items-center gap-3 text-[11px] text-stone-300 bg-black/20 p-4 rounded-2xl border border-white/5">
//                     <ShieldCheck size={32} className="text-[#d6b15c] shrink-0" />
//                     <p className="leading-snug">Your enrollment is protected by <strong>100% Money Back Guarantee</strong>. Verified by Kaumudi Trust.</p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </aside>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default EnrollmentPage;

// import React, { useEffect, useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useLocation } from "react-router-dom";
// import {
//   User, Mail, Phone, MapPin, Globe,
//   CreditCard, ShieldCheck, GraduationCap,
//   Calendar, Award, BookOpen, CheckCircle,
//   Lock, ArrowRight, Zap, Info, HelpCircle
// } from "lucide-react";

// /**
//  * EnrollmentPage Component
//  * A premium course checkout experience with Sanskrit aesthetics.
//  */
// const EnrollmentPage = () => {
//   const location = useLocation();
//   const [paymentMethod, setPaymentMethod] = useState("upi");
//   const [isHovered, setIsHovered] = useState(false);

//   // --- DATA HANDLING ---
//   const courseData = useMemo(() => {
//     return location.state || {
//       courseName: "Advanced Paninian Grammar",
//       price: "14,999",
//       duration: "6 Months",
//       level: "Advanced",
//       language: "Sanskrit/Hindi",
//       mode: "Live Online"
//     };
//   }, [location.state]);

//   // --- RAZORPAY INTEGRATION LOGIC ---
//   // --- RAZORPAY INTEGRATION LOGIC ---
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//   }, []);

//   const handlePayment = async () => {
//     try {
//       console.log("Current courseData:", courseData);

//       const cleanPrice = parseInt(courseData.price.replace(/,/g, '')) || 0;
//   // console.log("Extracted ID:", courseData?._id);
//       // 1. Backend se Order ID mangwana (Aapki API URL yahan badlein)
//       // Note: courseId aur couponCode aapko state ya props se mil raha hoga
//       const response = await fetch("http://localhost:5000/api/payment/create-order", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": `Bearer ${localStorage.getItem("token")}`
//   },
//   body: JSON.stringify({
//     courseId: "699041ad4bd713ce144bbc0e"  ,
//     amount: cleanPrice // Razorpay ke liye amount paise mein bhejna hota hai
//   }),
//       });

//       const orderData = await response.json();

//       if (!orderData.success) {
//         alert(orderData.message || "Order creation failed");
//         return;
//       }

//       // 2. Razorpay Options Setup
//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID, // .env se key lein
//         amount: orderData.amount, // Backend se aaya hua amount (already * 100)
//         currency: orderData.currency,
//         name: "Kaumudi Trust",
//         description: `Enrollment for ${courseData.courseName}`,
//         order_id: orderData.orderId, // Backend ki Order ID zaroori hai
//         handler: async function (response) {
//           // 3. Payment Verification (Backend ko data bhejna)
//           try {
//             const verifyRes = await fetch("/api/v1/payment/verify-payment", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 razorpayOrderId: response.razorpay_order_id,
//                 razorpayPaymentId: response.razorpay_payment_id,
//                 razorpaySignature: response.razorpay_signature,
//               }),
//             });

//             const verifyData = await verifyRes.json();
//             if (verifyData.success) {
//               alert("Dhanyavad! Enrollment Successful.");
//               // Yahan aap success page par redirect kar sakte hain
//             } else {
//               alert("Verification Failed: " + verifyData.message);
//             }
//           } catch (err) {
//             console.error("Verification Error:", err);
//           }
//         },
//         prefill: {
//           name: "", // Student details se populate karein
//           email: "",
//           contact: ""
//         },
//         theme: {
//           color: "#631D11",
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();

//     } catch (error) {
//       console.error("PAYMENT ERROR:", error);
//       alert("Something went wrong while initiating payment.");
//     }
//   };

//   // --- DATE LOGIC ---
//   const startDate = new Date();
//   const formattedStartDate = startDate.toLocaleDateString('en-IN', {
//     day: 'numeric', month: 'long', year: 'numeric'
//   });

//   const calculateEndDate = () => {
//     const months = parseInt(courseData.duration) || 0;
//     const end = new Date();
//     end.setMonth(startDate.getMonth() + months);
//     return end.toLocaleDateString('en-IN', {
//       day: 'numeric', month: 'long', year: 'numeric'
//     });
//   };
//   const formattedEndDate = calculateEndDate();

//   // --- EFFECT: SCROLL TO TOP ---
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, []);

//   // --- SHARED STYLES ---
//   const inputStyle = "w-full bg-[#fdfaf5]/80 backdrop-blur-sm border-b-2 border-[#631D11]/10 p-4 outline-none focus:border-[#d6b15c] transition-all duration-300 text-[#3D1A16] font-medium placeholder:text-gray-400 placeholder:font-normal rounded-t-lg group-hover:bg-white";
//   const labelStyle = "text-[11px] uppercase tracking-[0.2em] font-bold text-[#631D11] mb-2 flex items-center gap-2 opacity-80";

//   // --- ANIMATION VARIANTS ---
//   const fadeInUp = {
//     hidden: { opacity: 0, y: 30 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
//   };

//   const staggerContainer = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
//   };

//   return (
//     <div className="min-h-screen bg-[#f1e4c8] py-16 px-4 md:px-11 font-sans-serif relative overflow-hidden">

//       {/* Decorative Background Elements */}
//       <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
//         <div className="absolute top-10 left-10 w-64 h-64 bg-[#d6b15c] rounded-full blur-[120px]" />
//         <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#631D11] rounded-full blur-[150px]" />
//       </div>

//       <motion.div
//         variants={staggerContainer}
//         initial="hidden"
//         animate="visible"
//         className="max-w-6xl mx-auto relative z-10"
//       >
//         {/* --- HEADER SECTION --- */}
//         <header className="text-center mb-16">
//           <motion.h1
//             variants={fadeInUp}
//             className="text-4xl md:text-6xl font-black text-[#631D11] mt-2 tracking-tight"
//           >
//             Finalize Your <span className="italic font-serif text-[#d6b15c]">Admission</span>
//           </motion.h1>

//           <motion.div
//             initial={{ width: 0 }}
//             animate={{ width: 100 }}
//             className="h-1.5 bg-[#d6b15c] mx-auto mt-6 rounded-full"
//           />

//           <motion.p variants={fadeInUp} className="mt-6 text-[#7A5C58] max-w-xl mx-auto font-medium italic">
//             "Sa vidya ya vimuktaye" — Knowledge is that which liberates.
//           </motion.p>
//         </header>

//         <div className="grid lg:grid-cols-12 gap-10">

//           {/* --- LEFT COLUMN: ENROLLMENT FORM --- */}
//           <div className="lg:col-span-8 space-y-10">

//             {/* 1. Student Information */}
//             <motion.section
//               variants={fadeInUp}
//               className="group bg-white/40 backdrop-blur-md p-8 md:p-10 rounded-[40px] shadow-[0_20px_50px_rgba(99,29,17,0.08)] border border-white/60 hover:bg-white/60 transition-colors duration-500"
//             >
//               <div className="flex justify-between items-start mb-10">
//                 <h2 className="text-3xl font-black text-[#631D11] flex items-center gap-4">
//                   <div className="p-3 bg-[#631D11] rounded-2xl text-white shadow-lg">
//                     <User size={24} />
//                   </div>
//                   Student Details
//                 </h2>
//                 <span className="text-[10px] font-bold bg-[#d6b15c]/20 text-[#631D11] px-3 py-1 rounded-lg">STEP 01</span>
//               </div>

//               <div className="grid md:grid-cols-2 gap-8">
//                 <div className="space-y-1">
//                   <label className={labelStyle}><CheckCircle size={12}/> Full Name</label>
//                   <input type="text" placeholder="e.g. Rahul Sharma" className={inputStyle} required />
//                 </div>
//                 <div className="space-y-1">
//                   <label className={labelStyle}><Phone size={12}/> WhatsApp Number</label>
//                   <input type="tel" placeholder="+91 00000 00000" className={inputStyle} required />
//                 </div>
//                 <div className="md:col-span-2 space-y-1">
//                   <label className={labelStyle}><Mail size={12}/> Email Address</label>
//                   <input type="email" placeholder="rahul@example.com" className={inputStyle} required />
//                 </div>
//                 <div className="md:col-span-2 space-y-1">
//                   <label className={labelStyle}><MapPin size={12}/> Permanent Address</label>
//                   <input type="text" placeholder="Street name, Apartment, Area" className={inputStyle} />
//                 </div>
//                 <div className="space-y-1">
//                   <label className={labelStyle}><Globe size={12}/> City</label>
//                   <input type="text" placeholder="Varanasi" className={inputStyle} />
//                 </div>
//                 <div className="space-y-1">
//                   <label className={labelStyle}><Globe size={12}/> State / Country</label>
//                   <input type="text" placeholder="Uttar Pradesh, India" className={inputStyle} />
//                 </div>
//               </div>
//             </motion.section>

//             {/* 2. Academic Background */}
//             <motion.section
//               variants={fadeInUp}
//               className="bg-white/40 backdrop-blur-md p-8 md:p-11 rounded-[40px] shadow-[0_20px_50px_rgba(99,29,17,0.08)] border border-white/60"
//             >
//               <div className="flex justify-between items-start mb-10">
//                 <h2 className="text-3xl font-black text-[#631D11] flex items-center gap-4">
//                   <div className="p-3 bg-[#631D11] rounded-2xl text-white shadow-lg">
//                     <GraduationCap size={24} />
//                   </div>
//                   Academic Profile
//                 </h2>
//                 <span className="text-[10px] font-bold bg-[#d6b15c]/20 text-[#631D11] px-3 py-1 rounded-lg">STEP 02</span>
//               </div>

//               <div className="grid md:grid-cols-2 gap-8">
//                 <div className="space-y-1">
//                   <label className={labelStyle}>Prior Sanskrit Knowledge?</label>
//                   <div className="relative group">
//                     <select className={`${inputStyle} appearance-none cursor-pointer bg-white/50`}>
//                       <option>Beginner (No prior knowledge)</option>
//                       <option>Intermediate (Knows basics)</option>
//                       <option>Advanced (Fluent)</option>
//                     </select>
//                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#631D11]">↓</div>
//                   </div>
//                 </div>
//                 <div className="space-y-1">
//                   <label className={labelStyle}>Occupation</label>
//                   <input type="text" placeholder="Student / Professional" className={inputStyle} />
//                 </div>
//               </div>
//             </motion.section>
//           </div>

//           {/* --- RIGHT COLUMN: SUMMARY --- */}
//           <aside className="lg:col-span-4">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="sticky top-10 bg-[#631D11] text-white p-8 md:p-11 rounded-[48px] shadow-[0_30px_60px_rgba(99,29,17,0.3)] overflow-hidden"
//             >
//               {/* Card Accents */}
//               <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#d6b15c]/20 rounded-full blur-3xl" />
//               <div className="absolute top-1/2 -left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

//               <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
//                 <BookOpen size={24} className="text-[#d6b15c]" />
//                 Course Summary
//               </h3>

//               <div className="space-y-6 relative z-10">
//                 <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
//                   <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Active Course</label>
//                   <p className="text-xl font-black text-[#d6b15c] leading-tight capitalize">{courseData.courseName}</p>

//                   <div className="mt-4 flex items-center gap-2 text-xs text-stone-300">
//                     <Zap size={14} className="text-yellow-400" />
//                     <span>Instant access after payment</span>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-6 px-2">
//                   <div className="space-y-1">
//                     <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1">
//                       <Calendar size={10}/> Begins
//                     </label>
//                     <p className="font-bold text-sm">{formattedStartDate}</p>
//                   </div>
//                   <div className="space-y-1 text-right">
//                     <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1 justify-end">
//                       Ends <Calendar size={10}/>
//                     </label>
//                     <p className="font-bold text-sm text-[#d6b15c]">{formattedEndDate}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between px-2 pt-2">
//                   <div className="flex flex-col">
//                     <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Level</span>
//                     <span className="font-bold text-sm">{courseData.level}</span>
//                   </div>
//                   <div className="h-8 w-px bg-white/10" />
//                   <div className="flex flex-col text-right">
//                     <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Duration</span>
//                     <span className="font-bold text-sm">{courseData.duration}</span>
//                   </div>
//                 </div>

//                 {/* Final Pricing */}
//                 <div className="space-y-4 border-t border-white/10 pt-8 mt-4">
//                   <div className="flex justify-between items-center text-stone-300 text-sm">
//                     <span className="flex items-center gap-2 italic">Standard Fee</span>
//                     <span className="opacity-80">₹20,000</span>
//                   </div>
//                   <div className="flex justify-between items-center text-[#d6b15c] text-sm font-bold">
//                     <span>Discount Applied</span>
//                     <span>-₹{(20000 - parseInt(courseData.price.replace(',', ''))).toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between items-end pt-4">
//                     <div className="flex flex-col">
//                       <span className="text-[10px] uppercase font-bold tracking-widest text-stone-300">Net Payable</span>
//                       <span className="text-3xl font-black text-white">₹{courseData.price}</span>
//                     </div>
//                     <div className="text-[10px] bg-white/10 px-2 py-1 rounded text-stone-300">Incl. Taxes</div>
//                   </div>
//                 </div>

//                 <motion.button
//                   onHoverStart={() => setIsHovered(true)}
//                   onHoverEnd={() => setIsHovered(false)}
//                   onClick={handlePayment} // Razorpay function trigger
//                   className="w-full bg-[#d6b15c] text-[#74271E] py-6 rounded-3xl font-black text-xl mt-6 hover:bg-[#c09c4a] transition-all duration-500 shadow-[0_15px_30px_rgba(214,177,92,0.3)] flex items-center justify-center gap-3 relative overflow-hidden group"
//                 >
//                   <span className="relative z-10">Proceed to Payment</span>
//                   <motion.div
//                     animate={{ x: isHovered ? 5 : 0 }}
//                     className="relative z-10"
//                   >
//                     <ArrowRight size={24} />
//                   </motion.div>
//                   <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//                 </motion.button>

//                 <div className="pt-8 flex flex-col items-center gap-4 border-t border-white/10 mt-6">
//                   <div className="flex items-center gap-3 text-[11px] text-stone-300 bg-black/20 p-4 rounded-2xl border border-white/5">
//                     <ShieldCheck size={32} className="text-[#d6b15c] shrink-0" />
//                     <p className="leading-snug">
//                       Your enrollment is protected by <strong>100% Money Back Guarantee</strong> within 7 days. Verified by Kaumudi Trust.
//                     </p>
//                   </div>

//                   {/* <div className="flex gap-4 opacity-40">
//                     <Info size={16} />
//                     <HelpCircle size={16} />
//                   </div> */}
//                 </div>
//               </div>
//             </motion.div>
//           </aside>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default EnrollmentPage;
