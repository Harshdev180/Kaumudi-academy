import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  User, Mail, Phone, MapPin, Globe, 
  CreditCard, ShieldCheck, GraduationCap, 
  Calendar, Award, BookOpen, CheckCircle,
  Lock, ArrowRight, Zap, Info, HelpCircle
} from "lucide-react";
import { createPaymentOrder, verifyPayment, updateStudentProfile } from "../../lib/api";

/**
 * EnrollmentPage Component
 * A premium course checkout experience with Sanskrit aesthetics.
 */
const EnrollmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", { state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    whatsapp: "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    sanskritKnowledge: "Beginner (No prior knowledge)",
    occupation: ""
  });

  // --- DATA HANDLING ---
  const courseData = useMemo(() => {
    return {
      courseId: location.state?.courseId || null,
      courseName: location.state?.courseName || "Advanced Paninian Grammar",
      price: location.state?.price || "14,999",
      duration: location.state?.duration || "6 Months",
      level: location.state?.level || "Advanced",
      language: location.state?.language || "Sanskrit/Hindi",
      mode: location.state?.mode || "Live Online"
    };
  }, [location.state]);

  // --- RAZORPAY INTEGRATION LOGIC ---
  useEffect(() => {
    // Razorpay ki script ko load karna
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    // Validate form
    if (!formData.fullName || !formData.email || !formData.whatsapp) {
      setError("Please fill in all required fields");
      return;
    }

    if (!courseData.courseId) {
      setError("Course information is missing. Please go back and select a course again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Step 1: Update student profile with form data
      const [firstName, ...lastNameParts] = formData.fullName.split(" ");
      const lastName = lastNameParts.join(" ") || "Student";
      
      try {
        await updateStudentProfile({
          firstName,
          lastName,
          phoneNumber: formData.whatsapp,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          sanskritKnowledge: formData.sanskritKnowledge,
          occupation: formData.occupation
        });
      } catch (profileErr) {
        console.warn("Profile update failed (non-critical):", profileErr);
        // Continue with payment even if profile update fails
      }

      // Step 2: Create Razorpay order
      const orderResponse = await createPaymentOrder(courseData.courseId, couponCode || undefined);
      
      if (!orderResponse.success) {
        setError(orderResponse.message || "Failed to create payment order");
        return;
      }

      const amountInPaise = orderResponse.amount;
      const razorpayOrderId = orderResponse.orderId;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "YOUR_RAZORPAY_KEY_ID",
        amount: amountInPaise,
        currency: "INR",
        order_id: razorpayOrderId,
        name: "Kaumudi Trust",
        description: `Enrollment for ${courseData.courseName}`,
        image: "https://your-logo-url.com/logo.png",
        handler: async function (response) {
          try {
            // Step 3: Verify payment with backend
            const verifyResponse = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              courseId: courseData.courseId
            });

            if (verifyResponse.success) {
              alert("Payment Successful! Enrollment Confirmed!");
              // Redirect to profile or success page
              navigate("/profile", { 
                state: { message: "You have successfully enrolled in the course!" } 
              });
            } else {
              setError("Payment verification failed: " + (verifyResponse.message || "Unknown error"));
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            setError("Failed to verify payment: " + err.message);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.whatsapp
        },
        theme: {
          color: "#631D11",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError("Failed to initiate payment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- DATE LOGIC ---
  const startDate = new Date();
  const formattedStartDate = startDate.toLocaleDateString('en-IN', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  });

  const calculateEndDate = () => {
    const durationStr = courseData.duration || "0";
    const months = parseInt(durationStr.match(/\d+/)?.[0] || "0") || 0;
    const end = new Date();
    end.setMonth(startDate.getMonth() + months);
    return end.toLocaleDateString('en-IN', { 
      day: 'numeric', month: 'long', year: 'numeric' 
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
          <p className="text-[#4A4135] font-semibold">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // --- SHARED STYLES ---
  const inputStyle = "w-full bg-[#fdfaf5]/80 backdrop-blur-sm border-b-2 border-[#631D11]/10 p-4 outline-none focus:border-[#d6b15c] transition-all duration-300 text-[#3D1A16] font-medium placeholder:text-gray-400 placeholder:font-normal rounded-t-lg group-hover:bg-white";
  const labelStyle = "text-[11px] uppercase tracking-[0.2em] font-bold text-[#631D11] mb-2 flex items-center gap-2 opacity-80";

  // --- ANIMATION VARIANTS ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#f1e4c8] py-16 px-4 md:px-11 font-sans-serif relative overflow-hidden">
      
      {/* Decorative Background Elements */}
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
        {/* --- HEADER SECTION --- */}
        <header className="text-center mb-16"> 
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-black text-[#631D11] mt-2 tracking-tight"
          >
            Finalize Your <span className="italic font-serif text-[#d6b15c]">Admission</span>
          </motion.h1>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            className="h-1.5 bg-[#d6b15c] mx-auto mt-6 rounded-full"
          />
          
          <motion.p variants={fadeInUp} className="mt-6 text-[#7A5C58] max-w-xl mx-auto font-medium italic">
            "Sa vidya ya vimuktaye" — Knowledge is that which liberates.
          </motion.p>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* --- LEFT COLUMN: ENROLLMENT FORM --- */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 1. Student Information */}
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
                <span className="text-[10px] font-bold bg-[#d6b15c]/20 text-[#631D11] px-3 py-1 rounded-lg">STEP 01</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className={labelStyle}><CheckCircle size={12}/> Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma" 
                    className={inputStyle} 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelStyle}><Phone size={12}/> WhatsApp Number</label>
                  <input 
                    type="tel" 
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="+91 00000 00000" 
                    className={inputStyle} 
                    required 
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className={labelStyle}><Mail size={12}/> Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="rahul@example.com" 
                    className={inputStyle} 
                    required 
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className={labelStyle}><MapPin size={12}/> Permanent Address</label>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street name, Apartment, Area" 
                    className={inputStyle} 
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelStyle}><Globe size={12}/> City</label>
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Varanasi" 
                    className={inputStyle} 
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelStyle}><Globe size={12}/> State / Country</label>
                  <input 
                    type="text" 
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Uttar Pradesh, India" 
                    className={inputStyle} 
                  />
                </div>
              </div>
            </motion.section>

            {/* 2. Academic Background */}
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
                <span className="text-[10px] font-bold bg-[#d6b15c]/20 text-[#631D11] px-3 py-1 rounded-lg">STEP 02</span>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className={labelStyle}>Prior Sanskrit Knowledge?</label>
                  <div className="relative group">
                    <select 
                      name="sanskritKnowledge"
                      value={formData.sanskritKnowledge}
                      onChange={handleInputChange}
                      className={`${inputStyle} appearance-none cursor-pointer bg-white/50`}
                    >
                      <option>Beginner (No prior knowledge)</option>
                      <option>Intermediate (Knows basics)</option>
                      <option>Advanced (Fluent)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#631D11]">↓</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={labelStyle}>Occupation</label>
                  <input 
                    type="text" 
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    placeholder="Student / Professional" 
                    className={inputStyle} 
                  />
                </div>
              </div>
            </motion.section>   
          </div>

          {/* --- RIGHT COLUMN: SUMMARY --- */}
          <aside className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="sticky top-10 bg-[#631D11] text-white p-8 md:p-11 rounded-[48px] shadow-[0_30px_60px_rgba(99,29,17,0.3)] overflow-hidden"
            >
              {/* Card Accents */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#d6b15c]/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 -left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
              
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                <BookOpen size={24} className="text-[#d6b15c]" /> 
                Course Summary
              </h3>

              <div className="space-y-6 relative z-10">
                <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Active Course</label>
                  <p className="text-xl font-black text-[#d6b15c] leading-tight capitalize">{courseData.courseName}</p>
                  
                  <div className="mt-4 flex items-center gap-2 text-xs text-stone-300">
                    <Zap size={14} className="text-yellow-400" />
                    <span>Instant access after payment</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 px-2">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1">
                      <Calendar size={10}/> Begins
                    </label>
                    <p className="font-bold text-sm">{formattedStartDate}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1 justify-end">
                      Ends <Calendar size={10}/>
                    </label>
                    <p className="font-bold text-sm text-[#d6b15c]">{formattedEndDate}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Level</span>
                    <span className="font-bold text-sm">{courseData.level}</span>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Duration</span>
                    <span className="font-bold text-sm">{courseData.duration}</span>
                  </div>
                </div>

                {/* Final Pricing */}
                <div className="space-y-4 border-t border-white/10 pt-8 mt-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code" 
                      className="flex-1 bg-white/20 border border-white/30 px-4 py-2 rounded-lg text-white placeholder:text-stone-400 text-sm focus:outline-none focus:border-[#d6b15c]"
                    />
                    <button 
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-bold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-stone-300 text-sm">
                    <span className="flex items-center gap-2 italic">Course Fee</span>
                    <span className="opacity-80">₹{(typeof courseData.price === 'number' ? courseData.price : parseInt(courseData.price.toString().replace(/[^0-9]/g, '')) || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#d6b15c] text-sm font-bold">
                    <span>Additional Charges</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-stone-300">Net Payable</span>
                      <span className="text-3xl font-black text-white">₹{(typeof courseData.price === 'number' ? courseData.price : parseInt(courseData.price.toString().replace(/[^0-9]/g, '')) || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[10px] bg-white/10 px-2 py-1 rounded text-stone-300">Incl. Taxes</div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <motion.button 
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-[#d6b15c] text-[#74271E] py-6 rounded-3xl font-black text-xl mt-6 hover:bg-[#c09c4a] transition-all duration-500 shadow-[0_15px_30px_rgba(214,177,92,0.3)] flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">{loading ? "Processing..." : "Proceed to Payment"}</span>
                  {!loading && (
                    <motion.div 
                      animate={{ x: isHovered ? 5 : 0 }}
                      className="relative z-10"
                    >
                      <ArrowRight size={24} />
                    </motion.div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.button>

                <div className="pt-8 flex flex-col items-center gap-4 border-t border-white/10 mt-6">
                  <div className="flex items-center gap-3 text-[11px] text-stone-300 bg-black/20 p-4 rounded-2xl border border-white/5">
                    <ShieldCheck size={32} className="text-[#d6b15c] shrink-0" /> 
                    <p className="leading-snug">
                      Your enrollment is protected by <strong>100% Money Back Guarantee</strong> within 7 days. Verified by Kaumudi Trust.
                    </p>
                  </div>
                  
                  {/* <div className="flex gap-4 opacity-40">
                    <Info size={16} />
                    <HelpCircle size={16} />
                  </div> */}
                </div>
              </div>
            </motion.div>        
          </aside>
        </div>
      </motion.div>
    </div>
  );
};

export default EnrollmentPage;