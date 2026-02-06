import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);

  const colors = {
    brand: '#b8973d',
    bgGradient: 'from-[#d4e4d4] via-[#f0f4f0] to-[#b8cbb8]',
    textDark: '#74271E',
    label: '#8c7a56',
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center bg-[#f1e4c8] p-4 font-sans-serif`}>
      
      
      {/* Main Container - Height Fixed at 650px */}
      <motion.div 
      
        layout
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`relative bg-[#f1e4c8] w-full max-w-[950px] h-[650px] rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.15)] overflow-hidden flex ${isLogin ? 'flex-col md:flex-row' : 'flex-col md:flex-row-reverse'}`}
      >
        
        
        {/* --- Side Image Panel --- */}
        <motion.div 
          layout
          className="relative w-full md:w-[45%] h-[250px] md:h-full bg-[#74271E] overflow-hidden"
        >
          <img 
            src="https://i.pinimg.com/736x/9a/70/b1/9a70b1c6dd4d5ad5d59a3d5723c43ba9.jpg" 
            alt="Academy" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 p-10 flex flex-col justify-between text-white z-10">
            <div className="flex items-center gap-2">
              <GraduationCap size={50} className="text-[#b8973d]" />
              <span className="font-bold text-xl tracking-tight">Kaumudi Sanskrit Academy</span>
            </div>
            <div>
              <h2 className="text-4xl font-extrabold leading-tight mb-4">
                Exploring new frontiers, one step at a Time.
              </h2>
            </div>
          </div>
        </motion.div>

        {/* --- Form Panel --- */}
        <motion.div 
          layout
          className="w-full md:w-[55%] h-full p-8 md:p-14 flex flex-col justify-center bg-[#fffcf5] relative"
        >

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col"
            >
              <h1 className="text-3xl font-black text-[#74271E] mb-1">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-[#b8973d] text-xs font-semibold mb-6">
                {isLogin ? "Login to your student dashboard" : "Register yourself for the new session"}
              </p>

              {/* Social Buttons Section - Icons Fixed */}
              <div className="flex gap-4 mb-6">
                {/* Google Button */}
                <button className="flex-1 flex items-center justify-center gap-3 border border-[#e8dfc4] py-3 rounded-xl text-[12px] font-bold text-[#4a3a1a] bg-white hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>

                {/* Facebook Button */}
                <button className="flex-1 flex items-center justify-center gap-3 border border-[#e8dfc4] py-3 rounded-xl text-[12px] font-bold text-[#4a3a1a] bg-white hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
                  <svg width="18" height="18" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <hr className="border-[#e8dfc4]" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fffcf5] px-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Or use email
                </span>
              </div>

              <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#8c7a56] uppercase pl-1">First Name</label>
                      <input type="text" placeholder="Vikram" className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e8dfc4] outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#8c7a56] uppercase pl-1">Last Name</label>
                      <input type="text" placeholder="Shastri" className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e8dfc4] outline-none text-sm" />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#8c7a56] uppercase pl-1">Email Address</label>
                  <input type="email" placeholder="name@example.com" className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e8dfc4] outline-none text-sm" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between px-1">
                    <label className="text-[10px] font-bold text-[#8c7a56] uppercase">Password</label>
                    {isLogin && <a href="#" className="text-[10px] font-bold text-[#b8973d] hover:underline">Forgot?</a>}
                  </div>
                  <div className="relative">
                    <input 
                      type={showPass ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e8dfc4] outline-none text-sm" 
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

                {!isLogin && (
                  <div className="flex items-start gap-2 py-0.5">
                    <input type="checkbox" className="mt-1 accent-[#b8973d]" id="terms" />
                    <label htmlFor="terms" className="text-[10px] text-[#8c7a56] font-medium leading-tight cursor-pointer">
                      I agree to the <span className="text-[#b8973d] underline">Terms & Conditions</span>
                    </label>
                  </div>
                )}

                <button className="w-full bg-[#74271E] hover:opacity-95 transition-all py-3.5 rounded-2xl font-bold text-white uppercase tracking-widest shadow-lg mt-2 active:scale-95 text-sm">
                  {isLogin ? "Sign In" : "Sign Up"}
                </button>
              </form>

              {/* Footer Switcher */}
              <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                <p className="text-xs text-[#5a6b5a] font-medium">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[#74271E] font-bold hover:text-[#b8973d] transition-colors"
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;