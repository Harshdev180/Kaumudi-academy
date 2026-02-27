import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Send,
  User,
  MessageCircle,
  Mail,
  BookOpen,
  Clock,
  Globe,
  Award,
} from "lucide-react";
import { submitInquiry } from "../../lib/api";

export default function Inquiry() {
  const location = useLocation();

  const incoming = location.state?.course || location.state;

  const courseData = {
    title: incoming?.title || incoming?.courseName || "Sanskrit for Beginners",
    language: incoming?.language || "Sanskrit/Hindi",
    duration: incoming?.duration || "6 Months",
    level: incoming?.level || "Beginner",
  };

  const [form, setForm] = useState({
    fullName: "",
    vedicName: "",
    whatsappNumber: "", // ✅ FIXED: matches schema field name directly
    email: "",
    preferredLevel: "BEGINNER",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      await submitInquiry({
        fullName: form.fullName,
        vedicName: form.vedicName || "",
        email: form.email,
        whatsappNumber: form.whatsappNumber, // ✅ FIXED: correct field name for schema
        preferredLevel: form.preferredLevel.toUpperCase(),
        message: form.message || "",
        course: {
          title: courseData.title,
          duration: courseData.duration,
          language: courseData.language,
          level: courseData.level,
        },
      });
      setSuccess(
        "Inquiry submitted successfully. Our team will reach out soon.",
      );
      setForm({
        fullName: "",
        vedicName: "",
        whatsappNumber: "",
        email: "",
        preferredLevel: "BEGINNER",
        message: "",
      });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to submit inquiry";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const inputStyle =
    "w-full border-b-2 bg-white/40 backdrop-blur-sm p-4 outline-none border-[#641e16]/20 focus:border-[#641e16] focus:bg-white/60 transition-all duration-300 rounded-t-lg placeholder:text-[#8d6e6a]";
  const labelStyle =
    "text-[10px] uppercase tracking-[2px] font-bold text-[#641e16] mb-1 ml-1 flex items-center gap-2";

  return (
    <div className="min-h-screen bg-[#f1e4c8] text-[#2b1d1b] font-sans-serif relative overflow-hidden">
      {/* --- Decorative Background Elements --- */}

      {/* --- Hero Section --- */}
      <section className="relative text-center pt-9 pb-12 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-block mb-4 px-4 py-1 rounded-full border border-[#641e16]/20 bg-[#641e16]/5 text-[#641e16] text-lg font-bold tracking-widest uppercase"
        >
          Inquiry Form
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-[#641e16] leading-tight"
        >
          Begin Your{" "}
          <span className="italic font-sans-serif text-[#b38b3f]">Journey</span>{" "}
          <br />
          with Kaumudi
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 max-w-2xl mx-auto text-[#5f4b48] text-lg leading-relaxed"
        >
          Connecting seekers with the wisdom of Sanskrit learning. Fill the form
          and our scholars will reach out to you within 24 hours.
        </motion.p>
      </section>

      {/* --- Main Content Section --- */}
      <section className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-10 pb-24 relative z-10 justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-8 lg:col-start-3 relative"
        >
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#d6b15c] rounded-2xl rotate-12 -z-10 shadow-lg hidden md:block opacity-50" />

          <div className="bg-white/50 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(100,30,22,0.15)] border border-white/50 p-6 md:p-12 overflow-hidden relative">
            {/* Form Header */}
            <div className="flex items-center gap-4 mb-10 border-b border-[#641e16]/10 pb-6">
              <div className="w-12 h-12 bg-[#641e16] rounded-xl flex items-center justify-center text-white shadow-lg">
                <Send size={24} />
              </div>
              <div>
                <h3 className="text-3xl text-[#641e16] font-bold">
                  Course Inquiry
                </h3>
                <p className="text-sm text-[#7a5c58]">
                  Please provide your details below
                </p>
              </div>
            </div>

            <form className="grid gap-8" onSubmit={handleSubmit}>
              {/* User Basic Info Group */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={labelStyle}>
                    <User size={14} /> Full Name
                  </label>
                  <input
                    className={inputStyle}
                    placeholder="E.g. Rahul Sharma"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>
                    <MessageCircle size={14} /> WhatsApp Number
                  </label>
                  <input
                    className={inputStyle}
                    placeholder="10-digit number"
                    name="whatsappNumber"
                    value={form.whatsappNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelStyle}>
                  <Mail size={14} /> Email Address
                </label>
                <input
                  className={inputStyle}
                  placeholder="rahul@example.com"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={labelStyle}>
                    <Award size={14} /> Preferred Level
                  </label>
                  <select
                    name="preferredLevel"
                    value={form.preferredLevel}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>
                    <User size={14} /> Vedic Name (optional)
                  </label>
                  <input
                    className={inputStyle}
                    placeholder="If any"
                    name="vedicName"
                    value={form.vedicName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Pre-filled Course Details Box */}
              <div className="bg-[#641e16]/5 p-6 md:p-8 rounded-2xl border-2 border-dashed border-[#641e16]/90 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-40 transition-opacity">
                  <BookOpen size={80} />
                </div>

                <p className="text-xs font-black text-[#641e16]/80 mb-6 uppercase tracking-[3px] opacity-70">
                  Selected Course Details
                </p>

                <div className="grid md:grid-cols-2 gap-y-6 gap-x-10">
                  <div className="flex flex-col border-l-2 border-[#641e16]/20 pl-4">
                    <label className="text-[10px] text-[#8d6e6a] uppercase font-bold">
                      Course Title
                    </label>
                    <input
                      className="bg-transparent text-[#641e16] font-bold text-lg outline-none py-1 cursor-default"
                      value={courseData.title}
                      readOnly
                    />
                  </div>

                  <div className="flex flex-col border-l-2 border-[#641e16]/20 pl-4">
                    <label className="text-[10px] text-[#8d6e6a] uppercase font-bold flex items-center gap-1">
                      <Clock size={10} /> Duration
                    </label>
                    <input
                      className="bg-transparent text-[#641e16] font-bold outline-none py-1 cursor-default"
                      value={courseData.duration}
                      readOnly
                    />
                  </div>

                  <div className="flex flex-col border-l-2 border-[#641e16]/20 pl-4">
                    <label className="text-[10px] text-[#8d6e6a] uppercase font-bold flex items-center gap-1">
                      <Globe size={10} /> Language
                    </label>
                    <input
                      className="bg-transparent text-[#641e16] font-bold outline-none py-1 cursor-default"
                      value={courseData.language}
                      readOnly
                    />
                  </div>

                  <div className="flex flex-col border-l-2 border-[#641e16]/20 pl-4">
                    <label className="text-[10px] text-[#8d6e6a] uppercase font-bold flex items-center gap-1">
                      <Award size={10} /> Level
                    </label>
                    <input
                      className="bg-transparent text-[#641e16] font-bold outline-none py-1 cursor-default"
                      value={courseData.level}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className={labelStyle}>
                  <MessageCircle size={14} /> Your Message
                </label>
                <textarea
                  className={`${inputStyle} rounded-lg`}
                  rows="4"
                  placeholder="Tell us about your learning goals or any specific concerns..."
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 font-semibold">{error}</div>
              )}
              {success && (
                <div className="text-green-700 font-semibold">{success}</div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#4d1711" }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="relative overflow-hidden group bg-[#641e16] text-white py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span className="relative z-10">
                  {loading ? "Sending..." : "Send Inquiry"}
                </span>
                <Send
                  size={20}
                  className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>

              <p className="text-center text-xs text-[#8d6e6a]">
                By clicking send, you agree to our{" "}
                <span className="underline cursor-pointer hover:text-[#641e16]">
                  <Link to="/privacy">Privacy Policy</Link>
                </span>
                .
              </p>
            </form>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
