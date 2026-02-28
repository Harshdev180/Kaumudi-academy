import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react"; // Icons add kiye
import logo from "../assets/logo-bgremove.webp";
import { useAuth } from "../context/useAuthHook";

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
  hidden: { opacity: 0, y: -12, height: 0 },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { type: "spring", stiffness: 300, damping: 30, duration: 0.35 },
  },
  exit: {
    opacity: 0,
    y: -8,
    height: 0,
    transition: { duration: 0.22, ease: "easeIn" },
  },
};

const underlineVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1 },
};

const mobileListContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const mobileItem = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

/* ------------------ COMPONENT ------------------ */

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, loading, logout } = useAuth();

  const { pathname } = useLocation();
  const isHome = pathname === "/";

  // --- LOGIN LOGIC (use AuthContext first, fallback to storage) ---
  const role = user?.role?.toUpperCase();

  const isStudentLoggedIn = !loading && isAuthenticated && role === "STUDENT";

  // console.log("ROLE:", role);
  // console.log("USER:", user);
  // console.log("isStudentLoggedIn:", isStudentLoggedIn);

  // const profilePath =
  //   role === "ADMIN" || role === "SUPER_ADMIN" ? "/admin" : "/student/overview";

  const handleLogout = () => {
    setOpen(false);
    logout("/");
  };

  /* Scroll shadow */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close on route change */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Body scroll lock when mobile menu is open */
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    if (typeof document !== "undefined" && document.body) {
      document.body.style.overflow = open ? "hidden" : "";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // Accessibility: focus first menu item when opened and close on Escape
  useEffect(() => {
    if (!open) return;
    const first = mobileMenuRef.current?.querySelector("a,button");
    first?.focus?.();

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div
            className="
    relative
    bg-[#74271E]
    h-12 w-12
    rounded-xl
    grid place-items-center
    text-lg
    p-1
    overflow-hidden
    transition-all duration-500
    group-hover:scale-110
    shadow-[0_0_18px_rgba(214,177,92,0.55)]
    before:absolute before:inset-0
    before:rounded-xl
    before:bg-[radial-gradient(circle,rgba(214,177,92,0.55),transparent_70%)]
    before:opacity-70
    before:blur-md
    before:animate-pulse
  "
          >
            <img
              src={logo}
              alt="logo"
              className="relative z-10 brightness-110 contrast-110"
            />
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

        {/* ---------------- DESKTOP NAV (visible on large screens) ---------------- */}
        <ul className="hidden lg:flex items-center gap-10 font-semibold flex-wrap">
          {NAV_ITEMS.map(({ label, to }) => {
            const isActive = pathname === to;
            return (
              <li key={label} className="relative">
                <Link
                  to={to}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-sm tracking-wide transition-colors duration-200 ease-out focus:outline-none ${
                    isActive
                      ? "text-[#d6b15c]"
                      : "text-white hover:text-[#d6b15c]"
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
          {isStudentLoggedIn ? (
            <div className="hidden lg:flex items-center gap-4">
              {/* Profile Link */}
              <Link
                to={"/student/overview"}
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
            <Link to="/auth" className="hidden lg:block">
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
            className="lg:hidden p-2 rounded-xl bg-[#d6b15c]/15 text-[#d6b15c] hover:bg-[#d6b15c]/25 transition-colors focus:outline-none"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ---------------- MOBILE MENU ---------------- */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            {/* Panel */}
            <motion.div
              id="mobile-menu"
              ref={mobileMenuRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="lg:hidden relative z-50 bg-[#74271E] border-t border-[#dccbb4]/25 overflow-hidden"
            >
              <motion.div
                variants={mobileListContainer}
                initial="hidden"
                animate="show"
                className="px-6 py-6 space-y-5"
              >
                {/* Profile link in Mobile Menu */}
                {isStudentLoggedIn && (
                  <motion.div variants={mobileItem}>
                    <Link
                      to="/student/overview"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-[#d6b15c]"
                    >
                      <User size={20} />
                      <span className="font-bold">Profile</span>
                    </Link>
                  </motion.div>
                )}

                {NAV_ITEMS.map(({ label, to }) => (
                  <motion.div key={label} variants={mobileItem}>
                    <Link
                      to={to}
                      onClick={() => setOpen(false)}
                      className={`block text-lg font-medium tracking-wide transition-colors ${
                        pathname === to
                          ? "text-[#d6b15c]"
                          : "text-[#e6d0bd] hover:text-[#d6b15c]"
                      }`}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-5 border-t border-[#dccbb4]/25">
                  {isStudentLoggedIn ? (
                    <motion.div variants={mobileItem}>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#d6b15c] text-[#74271E] border border-[#d6b15c] font-bold text-lg"
                      >
                        <LogOut size={20} /> Logout
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div variants={mobileItem}>
                      <Link to="/auth" onClick={() => setOpen(false)}>
                        <span className="block text-center py-3 rounded-xl bg-[#d6b15c] text-[#74271E] font-bold text-lg shadow-lg">
                          Student Login
                        </span>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
