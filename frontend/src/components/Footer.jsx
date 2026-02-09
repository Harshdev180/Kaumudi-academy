import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import wheel from "../assets/wheel.jpg";

const socials = [Facebook, Twitter, Instagram, Linkedin];

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submitEmail = () => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      setSent(false);
      setError("Please enter a valid email");
      return;
    }
    setError("");
    setSent(true);
  };

  return (
    <footer className="relative overflow-hidden text-white pt-28 pb-12">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: `url(${wheel})` }}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3b120e]/85 via-[#5a1e17]/80 to-[#2a0b08]/85" />

      {/* GOLD RADIAL GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,177,92,0.12),transparent_60%)]" />

      {/* TOP DIVIDER */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#d6b15c]/60 to-transparent" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        {/* MAIN GRID */}
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          {/* BRAND */}
          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="flex items-center gap-3"
            >
              <div className="bg-[#d6b15c] text-[#74271E] h-11 w-11 rounded-xl grid place-items-center text-xl shadow-[0_0_25px_rgba(214,177,92,0.45)]">
                🪔
              </div>

              <div className="leading-tight">
                <div className="font-black tracking-wide text-lg">KAUMUDI</div>
                <div className="text-[10px] tracking-widest text-white uppercase">
                  Sanskrit Academy
                </div>
              </div>
            </motion.div>

            <p className="text-white text-sm leading-relaxed max-w-xs tracking-wider">
              Reviving Sanskrit’s timeless wisdom through scholarly rigor,
              authentic pedagogy, and global access.
            </p>

            <div className="flex gap-4 pt-2">
              {socials.map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="h-10 w-10 rounded-full bg-[#74271E]
                    flex items-center justify-center text-[#d6b15c]
                    shadow-md hover:bg-[#d6b15c] hover:text-[#74271E] transition"
                  aria-label={Icon.name}
                  title={Icon.name}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold flex items-center gap-3">
              Quick Links
              <span className="w-8 h-[2px] bg-[#d6b15c] rounded-full" />
            </h4>

            <ul className="space-y-4">
              {[
                { label: "Home", to: "/#hero" },
                { label: "Courses", to: "/allcourses#hero" },
                { label: "About", to: "/about#hero" },
                { label: "Faculty", to: "/faculty#hero" },
                { label: "Contact", to: "/contact#hero" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-sm text-white 
                      hover:text-[#d6b15c] transition font-bold"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300">
                      <ArrowRight size={12} />
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COURSES */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold flex items-center gap-3">
              Courses
              <span className="w-8 h-[2px] bg-[#d6b15c] rounded-full" />
            </h4>

            <ul className="space-y-4">
              {[
                { label: "Shloks", to: "/" },
                { label: "Spoken Sanskrit", to: "/" },
                { label: "Vyakaran Shastra", to: "/" },
                { label: "UGC NET", to: "/" },
                { label: "B.A.", to: "/" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-sm text-white
                      hover:text-[#d6b15c] transition font-bold"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300">
                      <ArrowRight size={12} />
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold flex items-center gap-3">
              Stay Connected
              <span className="w-8 h-[2px] bg-[#d6b15c] rounded-full" />
            </h4>

            <div className="space-y-4 text-sm text-white font-bold">
              <div className="flex items-start gap-3">
                <MapPin
                  size={16}
                  className="text-white mt-[2px] hover:text-[#d6b15c]"
                />
                <p>
                  108 Vidya Vihar, Sanskrit Marg,
                  <br />
                  Varanasi, UP, India
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  size={16}
                  className="text-white hover:text-[#d6b15c] font-bold"
                />
                <a href="mailto:contact@kaumudi.edu.in">
                  contact@kaumudi.edu.in
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  size={16}
                  className="text-white hover:text-[#d6b15c] font-bold"
                />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </div>
            </div>

            {/* NEWSLETTER */}
            <div className="pt-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-[#74271E]/90 border border-[#d6b15c]/30
                    rounded-xl px-4 py-3 text-sm text-[#ecd9c5]
                    placeholder-[#ecd9c5]/40
                    focus:outline-none focus:ring-2
                    focus:ring-[#d6b15c]/40"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSent(false);
                    setError("");
                  }}
                />

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2
                    p-2 bg-[#d6b15c] rounded-lg text-[#74271E]"
                  onClick={submitEmail}
                >
                  <ArrowRight size={16} />
                </motion.button>
              </div>

              {error && (
                <div className="mt-2 text-[#f3c0b7] text-xs">{error}</div>
              )}
              {sent && !error && (
                <div className="mt-2 text-[#d6b15c] text-xs">
                  Subscribed successfully
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          className="pt-8 border-t border-white
          flex flex-col md:flex-row items-center justify-between
          gap-4 text-xs text-white font-bold"
        >
          <p>© {year} Kaumudi Sanskrit Academy. All Wisdom Reserved.</p>

          <div className="flex gap-6 font-bold text-white">
            <Link to="/privacy" className="hover:text-[#d6b15c] transition">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-[#d6b15c] transition">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-[#d6b15c] transition">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
