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
    <footer className="relative bg-gradient-to-b from-[#6a241c] to-[#4f1913] text-white pt-24 pb-10">
      {/* top divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#d6b15c]/60 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">
        {/* MAIN GRID */}
        <div className="grid md:grid-cols-4 gap-14 mb-15 items-start">
          {/* BRAND */}
          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="flex items-center gap-3"
            >
              <div className="bg-[#d6b15c] text-[#74271E] h-11 w-11 rounded-xl grid place-items-center text-xl shadow-lg">
                🪔
              </div>

              <div className="leading-tight">
                <div className="font-black tracking-wide text-lg">KAUMUDI</div>
                <div className="text-[10px] tracking-widest text-white/70 uppercase">
                  Sanskrit Academy
                </div>
              </div>
            </motion.div>

            <p className="text-[#ecd9c5] text-sm leading-relaxed max-w-xs">
              Reviving Sanskrit’s timeless wisdom through scholarly rigor,
              authentic pedagogy, and global access.
            </p>

            <div className="flex gap-4 pt-2">
              {socials.map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.12, rotate: 6 }}
                  href="#"
                  className="h-10 w-10 rounded-full bg-[#74271E]
                    flex items-center justify-center text-[#d6b15c]
                    shadow-md hover:bg-[#d6b15c] hover:text-[#74271E]"
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
                    className="group flex items-center gap-2 text-sm text-[#ecd9c5]
                      hover:text-[#d6b15c] transition"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#d6b15c]
                        opacity-0 group-hover:opacity-100 transition"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RESOURCES */}
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
                    className="group flex items-center gap-2 text-sm text-[#ecd9c5]
                      hover:text-[#d6b15c] transition"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#d6b15c]
                        opacity-0 group-hover:opacity-100 transition"
                    />
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

            <div className="space-y-4 text-sm text-[#ecd9c5]">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#d6b15c] mt-[2px]" />
                <p>
                  108 Vidya Vihar, Sanskrit Marg,
                  <br />
                  Varanasi, UP, India
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#d6b15c]" />
                <a href="mailto:contact@kaumudi.edu.in">
                  contact@kaumudi.edu.in
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#d6b15c]" />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </div>
            </div>

            {/* newsletter aligned */}
            <div className="pt-2">
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

        {/* bottom bar */}
        <div
          className="pt-8 border-t border-[#d6b15c]/20
          flex flex-col md:flex-row items-center justify-between
          gap-4 text-xs text-[#ecd9c5]/70"
        >
          <p>© {year} Kaumudi Sanskrit Academy. All Wisdom Reserved.</p>

          <div className="flex gap-6">
            {["Privacy Policy", "Terms", "Cookies"].map((t) => (
              <Link key={t} to="/" className="hover:text-[#d6b15c] transition">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
