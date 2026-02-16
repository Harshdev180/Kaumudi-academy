import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Languages,
  Sparkles,
  ScrollText,
  Bell,
  Flower2,
} from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [selectedLang, setSelectedLang] = useState("SK");

  // Animation Variants
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
      {/* Rotating Mandala Left */}
      <motion.div
        variants={mandalaRotate}
        animate="animate"
        className="absolute -top-40 -left-40 w-[600px] h-[600px] border border-[#b8973d]/10 rounded-full flex items-center justify-center opacity-30 pointer-events-none"
      >
        <div className="w-[450px] h-[450px] border border-dashed border-[#b8973d]/20 rounded-full" />
        <Flower2 size={100} className="absolute text-[#b8973d]/10" />
      </motion.div>

      {/* Floating Sparkles */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-20 right-[20%] text-[#b8973d]"
      >
        <Sparkles size={40} />
      </motion.div>

      {/* --- MAIN AUTH CARD --- */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`relative bg-[#fffcf5] w-full max-w-[1000px] min-h-[600px] rounded-[50px] shadow-[0_50px_120px_rgba(116,39,30,0.25)] overflow-hidden flex flex-col md:flex-row transition-all duration-1000 ease-in-out ${!isLogin ? "md:flex-row-reverse" : ""}`}
      >
        {/* --- LEFT SIDE: THE GURUKUL EXPERIENCE --- */}
        <motion.div
          layout
          className="relative w-full md:w-[50%] h-[320px] md:h-auto bg-[#74271E] overflow-hidden"
        >
          {/* Main Image with Vedic Filter */}
          <motion.img
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            src="https://i.pinimg.com/736x/9a/70/b1/9a70b1c6dd4d5ad5d59a3d5723c43ba9.jpg"
            alt="Gurukul"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#74271E] via-transparent to-black/40 p-10 flex flex-col justify-between z-10 text-white">
            {/* Logo Section */}
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

            {/* Shloka and Message */}
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
                    {isLogin ? "पुनरागतं स्वागतम्" : "नूतन पञ्जीकरणम्"}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black leading-tight">
                    {isLogin ? "Deepen Your" : "Start Your"} <br />
                    <span className="text-[#b8973d]">Vedic Journey.</span>
                  </h2>
                  <p className="text-gray-300 text-[11px] italic font-light leading-relaxed">
                    {isLogin ? (
                      <>
                        <span className="text-[#b8973d] font-bold not-italic block mb-0.5">
                          “सा विद्या या विमुक्तये”
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
            <motion.div
              key={isLogin ? "login" : "signup"}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className={`w-full ${isLogin ? "space-y-10" : "space-y-0"}`}
            >
              <header className={isLogin ? "mb-8" : "mb-4"}>
                <h1 className="text-3xl font-black text-[#74271E] mb-1">
                  {isLogin ? "Welcome Back" : "Join the Gurukul"}
                </h1>
                <p className="text-[#8c7a56] text-[12px] font-medium">
                  {isLogin
                    ? "Sign in to access your Vedas and lessons."
                    : "Register yourself for the divine wisdom."}
                </p>
              </header>

              <form className={isLogin ? "space-y-6" : "space-y-3"} onSubmit={(e) => e.preventDefault()}>
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="First Name " placeholder="Vikram" />
                    <InputGroup label="Last Name " placeholder="Shastri" />
                  </div>
                )}

                <InputGroup
                  label="Email Address "
                  placeholder="shastri@kaumudi.com"
                  type="email"
                />

                <div className="space-y-1.5">
                  <div className="flex justify-between px-1">
                    <label className="text-[10px] font-bold text-[#74271E] uppercase tracking-wider">
                      Password{" "}
                    </label>
                    {isLogin && (
                      <button className="text-[10px] font-bold text-[#74271E] hover:underline transition-all">
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full px-5 py-3 rounded-2xl bg-[#fdfaf2] border border-[#e8dfc4] focus:border-[#b8973d] focus:ring-4 focus:ring-[#b8973d]/10 outline-none transition-all shadow-inner text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#74271E] transition-colors"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* --- CONFIRM PASSWORD FIELD (Signup Only) --- */}
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#74271E] uppercase tracking-wider px-1">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full px-5 py-3 rounded-2xl bg-[#fdfaf2] border border-[#e8dfc4] focus:border-[#b8973d] focus:ring-4 focus:ring-[#b8973d]/10 outline-none transition-all shadow-inner text-sm"
                      />
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(116,39,30,0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-[#74271E] py-4 rounded-2xl font-bold text-white uppercase tracking-[0.3em] flex items-center justify-center gap-3 relative group ${isLogin ? "mt-6" : "mt-2"}`}
                >
                  <span className="relative z-10 text-xs">
                    {isLogin ? "Enter Gurukul" : "Create Account"}
                  </span>
                  <Sparkles
                    size={18}
                    className="text-[#b8973d] group-hover:rotate-12 transition-transform"
                  />
                </motion.button>
              </form>

              {/* Social Login Section */}
              <div className={isLogin ? "mt-10" : "mt-6"}>
                <div className="relative flex items-center justify-center mb-5">
                  <div className="w-full h-[1px] bg-gray-200" />
                  <span className="absolute bg-[#fffcf5] px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Or Continue With
                  </span>
                </div>
                <div className="flex gap-4">
                  <SocialButton provider="Google" />
                  <SocialButton provider="Facebook" />
                </div>
              </div>

              {/* Toggle Switch */}
              <footer className={isLogin ? "mt-10 text-center" : "mt-6 text-center"}>
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
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const InputGroup = ({ label, placeholder, type = "text" }) => (
  <div className="space-y-1 flex-1">
    <label className="text-[10px] font-bold text-[#74271E] uppercase tracking-wider ml-1">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-5 py-3 rounded-2xl bg-[#fdfaf2] border border-[#e8dfc4] focus:border-[#b8973d] focus:ring-4 focus:ring-[#b8973d]/10 outline-none transition-all shadow-inner text-sm"
    />
  </div>
);

const SocialButton = ({ provider }) => (
  <motion.button
    whileHover={{ y: -2, backgroundColor: "#fdfaf2" }}
    className="flex-1 border border-[#e8dfc4] py-3 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-bold text-[#74271E] transition-all active:scale-95 shadow-sm"
  >
    {provider === "Google" ? (
      <svg width="14" height="14" viewBox="0 0 24 24">
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
    ) : (
      <svg width="14" height="14" fill="#1877F2" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )}
    {provider}
  </motion.button>
);

export default AuthPage;