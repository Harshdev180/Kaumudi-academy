import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { subscribeToNewsletter } from "../lib/api";
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
import wheel from "../assets/wheel.webp";
import { AnimatePresence } from "framer-motion";
import logo from "../assets/logo-bgremove.webp";
import { getAllCourses } from "../lib/api"; // Import the API function

const socials = [Instagram];

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]); // State to store courses
  const mapUrl =
    "https://www.google.com/maps/search/?api=1&query=Kadi%2C%20Mehsana%2C%20Gujarat%2C%20India";

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourses();
        const list = response?.courses || response?.data || response || [];
        setCourses(list);
      } catch (err) {
        console.error("Failed to fetch courses for footer:", err);
      }
    };

    fetchCourses();
  }, []);

  const submitEmail = async () => {
    // Robust email regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email.trim());

    if (!email) {
      setSent(false);
      setError("Email is required");
      return;
    }

    if (!isValid) {
      setSent(false);
      setError("Please enter a valid academic email address");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await subscribeToNewsletter(email.trim());
      setSent(true);
      setError("");
      setEmail("");
      // Reset success message after 5 seconds
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Subscription failed. Please try again.";
      setError(msg);
      setSent(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Map course labels to their actual titles or IDs
  const courseLinks = [
    {
      label: "Shloks",
      findCourse: (courses) =>
        courses.find(
          (c) =>
            c.title?.toLowerCase().includes("shlok") ||
            c.name?.toLowerCase().includes("shlok"),
        ),
    },
    {
      label: "Spoken Sanskrit",
      findCourse: (courses) =>
        courses.find(
          (c) =>
            c.title?.toLowerCase().includes("spoken") ||
            c.name?.toLowerCase().includes("spoken"),
        ),
    },
    {
      label: "Vyakaran Shastra",
      findCourse: (courses) =>
        courses.find(
          (c) =>
            c.title?.toLowerCase().includes("vyakaran") ||
            c.name?.toLowerCase().includes("vyakaran"),
        ),
    },
    {
      label: "UGC NET",
      findCourse: (courses) =>
        courses.find(
          (c) =>
            c.title?.toLowerCase().includes("ugc") ||
            c.name?.toLowerCase().includes("ugc") ||
            c.title?.toLowerCase().includes("net") ||
            c.name?.toLowerCase().includes("net"),
        ),
    },
    {
      label: "B.A.",
      findCourse: (courses) =>
        courses.find(
          (c) =>
            c.title?.toLowerCase().includes("b.a.") ||
            c.name?.toLowerCase().includes("b.a.") ||
            c.title?.toLowerCase().includes("ba") ||
            c.name?.toLowerCase().includes("ba"),
        ),
    },
  ];

  // Generate links with actual course IDs
  const footerLinks = courseLinks.map((link) => {
    const matchedCourse = link.findCourse(courses);

    return {
      label: link.label,
      to: matchedCourse
        ? `/coursedetail/${matchedCourse._id || matchedCourse.id}`
        : "/allcourses", // Fallback to all courses if not found
      state: matchedCourse ? { course: matchedCourse } : undefined,
    };
  });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <footer className="relative overflow-hidden text-white pt-16 sm:pt-20 md:pt-24 lg:pt-20 pb-8 sm:pb-10 md:pb-10">
      {/* BACKGROUND IMAGE */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${wheel})` }}
      />

      {/* DARK OVERLAY */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-b from-[#3b120e]/90 via-[#5a1e17]/85 to-[#2a0b08]/90"
      />

      {/* GOLD RADIAL GLOW */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,177,92,0.15),transparent_70%)]"
      />

      {/* TOP DIVIDER - Animated */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#d6b15c]/80 to-transparent origin-left"
      />

      {/* CONTENT */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* MAIN GRID */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-12 sm:mb-16 md:mb-20"
        >
          {/* BRAND */}
          <motion.div
            variants={fadeInUp}
            className="space-y-4 sm:space-y-5 md:space-y-6"
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="flex items-center gap-2 sm:gap-3"
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
                <div className="font-black tracking-wide text-base sm:text-lg">
                  KAUMUDI
                </div>
                <div className="text-[8px] sm:text-[9px] md:text-[10px] tracking-widest text-white/90 uppercase">
                  Sanskrit Academy
                </div>
              </div>
            </motion.div>

            <p className="text-white/90 text-xs sm:text-sm leading-relaxed max-w-xs tracking-wider">
              Reviving Sanskrit's timeless wisdom through scholarly rigor,
              authentic pedagogy, and global access.
            </p>

            <motion.div
              variants={staggerContainer}
              className="flex gap-2 sm:gap-3 md:gap-4 pt-1 sm:pt-2"
            >
              {socials.map((Icon, i) => (
                <motion.a
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.15, rotate: 8, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://www.instagram.com/sanskritstation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full bg-[#74271E]
                    flex items-center justify-center text-[#d6b15c]
                    shadow-md hover:bg-[#d6b15c] hover:text-[#74271E] transition-all duration-300"
                  aria-label={`${Icon.name} social link`}
                  title={Icon.name}
                >
                  <Icon size={14} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* QUICK LINKS */}
          <motion.div
            variants={fadeInUp}
            className="space-y-4 sm:space-y-5 md:space-y-6"
          >
            <h4 className="text-base sm:text-lg font-bold flex items-center gap-2 sm:gap-3">
              Quick Links
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: 32 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-[2px] bg-[#d6b15c] rounded-full"
              />
            </h4>

            <ul className="space-y-2 sm:space-y-3 md:space-y-4">
              {[
                { label: "Home", to: "/#hero" },
                { label: "Courses", to: "/allcourses#hero" },
                { label: "About", to: "/about#hero" },
                { label: "Faculty", to: "/faculty#hero" },
                { label: "Contact", to: "/contact#hero" },
              ].map((link) => (
                <motion.li
                  key={link.label}
                  whileHover={{ x: 8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-xs sm:text-sm text-white/90 
                      hover:text-[#d6b15c] transition-colors duration-300 font-medium"
                  >
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      whileHover={{ width: 16, opacity: 1 }}
                      className="overflow-hidden"
                    >
                      <ArrowRight size={10} className="text-[#d6b15c]" />
                    </motion.span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* COURSES */}
          <motion.div
            variants={fadeInUp}
            className="space-y-4 sm:space-y-5 md:space-y-6"
          >
            <h4 className="text-base sm:text-lg font-bold flex items-center gap-2 sm:gap-3">
              Courses
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: 32 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-[2px] bg-[#d6b15c] rounded-full"
              />
            </h4>

            <ul className="space-y-2 sm:space-y-3 md:space-y-4">
              {footerLinks.map((link) => (
                <motion.li
                  key={link.label}
                  whileHover={{ x: 8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={link.to}
                    state={link.state}
                    className="group flex items-center gap-2 text-xs sm:text-sm text-white/90
                      hover:text-[#d6b15c] transition-colors duration-300 font-medium"
                  >
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      whileHover={{ width: 16, opacity: 1 }}
                      className="overflow-hidden"
                    >
                      <ArrowRight size={10} className="text-[#d6b15c]" />
                    </motion.span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* CONTACT */}
          <motion.div
            variants={fadeInUp}
            className="space-y-4 sm:space-y-5 md:space-y-6"
          >
            <h4 className="text-base sm:text-lg font-bold flex items-center gap-2 sm:gap-3">
              Stay Connected
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: 32 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-[2px] bg-[#d6b15c] rounded-full"
              />
            </h4>

            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-white/90 font-medium">
              <motion.a
                whileHover={{ x: 4 }}
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 sm:gap-3 hover:text-[#d6b15c] transition-colors"
                aria-label="Open location in Google Maps"
                title="Open in Google Maps"
              >
                <MapPin
                  size={14}
                  className="text-white/70 mt-[2px] group-hover:text-[#d6b15c] transition-colors flex-shrink-0"
                />
                <span className="text-white/90">
                  Kadi, Mehsana,
                  <br />
                  Gujarat, India
                </span>
              </motion.a>

              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 sm:gap-3"
              >
                <Mail
                  size={14}
                  className="text-white/70 hover:text-[#d6b15c] transition-colors flex-shrink-0"
                />
                <a
                  href="mailto:contact@kaumudi.edu.in"
                  className="hover:text-[#d6b15c] transition-colors break-all"
                >
                  ksacademy@gmail.com
                </a>
              </motion.div>

              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 sm:gap-3"
              >
                <Phone
                  size={14}
                  className="text-white/70 hover:text-[#d6b15c] transition-colors flex-shrink-0"
                />
                <a
                  href="tel:+9175672 23072"
                  className="hover:text-[#d6b15c] transition-colors"
                >
                  +91 75672 23072
                </a>
              </motion.div>
            </div>

            {/* NEWSLETTER */}
            <motion.div whileHover={{ y: -2 }} className="pt-4 sm:pt-5 md:pt-6">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your academic email"
                    className={`w-full bg-[#74271E]/90 border ${
                      error ? "border-red-500" : "border-[#d6b15c]/30"
                    } rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm
                      text-[#ecd9c5] placeholder-[#ecd9c5]/40
                      focus:outline-none focus:ring-2 focus:ring-[#d6b15c]/40
                      transition-all duration-300`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSent(false);
                      setError("");
                    }}
                    onKeyPress={(e) => e.key === "Enter" && submitEmail()}
                    disabled={isSubmitting}
                  />

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2
                      p-1.5 sm:p-2 bg-[#d6b15c] rounded-lg text-[#74271E]
                      hover:shadow-lg transition-shadow disabled:opacity-50"
                    onClick={submitEmail}
                    disabled={isSubmitting}
                    aria-label="Subscribe to newsletter"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-[#74271E] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight size={14} />
                    )}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 text-[#f3c0b7] text-[10px] sm:text-xs font-bold"
                    >
                      ⚠ {error}
                    </motion.div>
                  )}
                  {sent && !error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 text-[#d6b15c] text-[10px] sm:text-xs font-bold"
                    >
                      ✓ Subscribed successfully!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* BOTTOM BAR */}
        <motion.div
          variants={fadeInUp}
          className="pt-6 sm:pt-7 md:pt-8 border-t border-white/20
            flex flex-col sm:flex-row items-center justify-between
            gap-3 sm:gap-4 text-[10px] sm:text-xs text-white/80 font-medium"
        >
          <p>© {year} Kaumudi Sanskrit Academy. All Wisdom Reserved.</p>

          <p className="opacity-70">
            Designed & Developed by{" "}
            <a
              href="https://graphura.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d6b15c] transition font-bold"
            >
              Graphura India Private Limited
            </a>
          </p>

          <div className="flex gap-4 sm:gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="hover:text-[#d6b15c] transition-colors duration-300 relative group"
              >
                {item}
                <motion.span
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                  className="absolute -bottom-1 left-0 h-px bg-[#d6b15c]"
                />
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
