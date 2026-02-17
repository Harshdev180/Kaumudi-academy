import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react"; // Icons add kiye

/* ------------------ CONFIG ------------------ */

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/allcourses" },
  { label: "About", to: "/about" },
  { label: "Faculty", to: "/faculty" },
  { label: "Contact", to: "/contact" },
];

/* ------------------ ANIMATIONS ------------------ */

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.35, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const underlineVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1 },
};

/* ------------------ COMPONENT ------------------ */

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const isHome = pathname === "/";

  // --- LOGIN LOGIC ---
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setOpen(false);
    navigate("/");
  };

  /* Scroll shadow */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      role="navigation"
      aria-label="Main Navigation"
      className={`top-0 z-50 w-full transition-all duration-500 border-b ${
        isHome ? "fixed" : "sticky"
      } ${
        isHome && !scrolled
          ? "bg-transparent border-transparent"
          : "bg-gradient-to-t from-[#3b120e]/95 via-[#5a1e17]/90 to-[#2a0b08]/95 backdrop-blur-xl border-[#dccbb4]/40 shadow-[0_14px_35px_rgba(0,0,0,0.35)]"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-5 h-16 md:h-20 flex items-center justify-between">
        {/* ---------------- BRAND ---------------- */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="bg-[#d6b15c] text-[#74271E] h-9 w-9 rounded-xl grid place-items-center text-lg shadow-md">
            🪔
          </div>
          <div className="leading-tight">
            <div className="font-black tracking-widest text-white group-hover:text-[#d6b15c] transition">
              KAUMUDI
            </div>
            <div className="text-[11px] tracking-[0.18em] text-white/80">
              SANSKRIT ACADEMY
            </div>
          </div>
        </Link>

        {/* ---------------- DESKTOP NAV ---------------- */}
        <ul className="hidden md:flex items-center gap-10 font-semibold">
          {NAV_ITEMS.map(({ label, to }) => {
            const isActive = pathname === to;
            return (
              <li key={label} className="relative">
                <Link
                  to={to}
                  className={`text-sm tracking-wide transition-colors focus:outline-none ${
                    isActive ? "text-[#d6b15c]" : "text-white hover:text-[#d6b15c]"
                  }`}
                >
                  {label}
                </Link>
                <motion.span
                  className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[#d6b15c] rounded"
                  variants={underlineVariants}
                  initial="hidden"
                  animate={isActive ? "visible" : "hidden"}
                  transition={{ duration: 0.25 }}
                />
              </li>
            );
          })}
        </ul>

        {/* ---------------- RIGHT ACTIONS ---------------- */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-4">
              {/* Profile Link */}
              <Link 
                to="/profile" 
                className="flex items-center gap-2 text-[#d6b15c] font-semibold text-sm hover:opacity-90 transition"
              >
                <div className="w-8 h-8 rounded-full bg-[#74271E]/20 flex items-center justify-center border border-[#d6b15c]/90">
                  <User size={22} />
                </div>
                <span className="text-white">Profile</span>
              </Link>
              
              {/* Logout Button */}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d6b15c] text-[#74271E] border border-[#d6b15c] font-bold text-xs shadow-lg transition-all"
              >
                <LogOut size={14} />
                Logout
              </motion.button>
            </div>
          ) : (
            <Link to="/auth" className="hidden md:block">
              <motion.span
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#d6b15c] text-[#74271E] font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                Student Login
              </motion.span>
            </Link>
          )}

          {/* ---------------- MOBILE TOGGLE ---------------- */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-xl bg-[#d6b15c]/15 text-[#d6b15c] hover:bg-[#d6b15c]/25 transition-colors focus:outline-none"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ---------------- MOBILE MENU ---------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden bg-[#74271E] border-t border-[#dccbb4]/25 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-5">
              {/* Profile link in Mobile Menu */}
              {isLoggedIn && (
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-[#d6b15c]"
                >
                  <User size={20} />
                  <span className="font-bold">My Profile</span>
                </Link>
              )}

              {NAV_ITEMS.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`block text-lg font-medium tracking-wide transition-colors ${
                    pathname === to ? "text-[#d6b15c]" : "text-[#e6d0bd] hover:text-[#d6b15c]"
                  }`}
                >
                  {label}
                </Link>
              ))}

              <div className="pt-5 border-t border-[#dccbb4]/25">
                {isLoggedIn ? (
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#d6b15c] text-[#74271E] border border-[#d6b15c] font-bold text-lg"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    <span className="block text-center py-3 rounded-xl bg-[#d6b15c] text-[#74271E] font-bold text-lg shadow-lg">
                      Student Login
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}