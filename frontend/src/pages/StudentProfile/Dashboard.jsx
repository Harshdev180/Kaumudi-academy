import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Dashboard = () => {
  // --- CALENDAR LOGIC START ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const handlePrevMonth = () =>
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  const handleNextMonth = () =>
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  // --- CALENDAR LOGIC END ---

  return (
    <div className="grid grid-cols-12 gap-6 mt-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="col-span-12 lg:col-span-8 bg-[#74271E] rounded-[2.5rem] p-12 relative overflow-hidden flex items-center shadow-2xl min-h-[280px] group"
      >
        {/* GEOMETRY */}
        <div className="absolute -right-20 -top-20 w-[450px] h-[450px] opacity-[0.35] pointer-events-none group">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full text-[#c9a050] animate-[spin_60s_linear_infinite] group-hover:animate-[spin_30s_linear_infinite] transition-all duration-1000"
          >
            {/* Concentric Circles for Depth */}
            <circle
              cx="100"
              cy="100"
              r="95"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="4 4"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.25"
            />

            {/* Geometric Lotus/Mandala Pattern */}
            <defs>
              <path
                id="petal"
                d="M100,20 C110,50 110,80 100,100 C90,80 90,50 100,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </defs>

            {/* Rotating Petal Layers */}
            {[...Array(12)].map((_, i) => (
              <use
                key={`layer1-${i}`}
                href="#petal"
                transform={`rotate(${i * 30} 100 100)`}
              />
            ))}

            {[...Array(24)].map((_, i) => (
              <use
                key={`layer2-${i}`}
                href="#petal"
                transform={`rotate(${i * 15} 100 100) scale(0.7)`}
                transform-origin="center"
                className="opacity-50"
              />
            ))}

            {/* Center Bindu */}
            <circle cx="100" cy="100" r="2" fill="currentColor" />
          </svg>

          {/* Soft Radial Glow to bleed the edges */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#74271E]/40 to-[#74271E] rounded-full" />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 space-y-3">
          {/* Professional Badge-style Greeting */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c9a050] animate-pulse" />
            <span className="text-[10px] font-black text-[#c9a050] uppercase tracking-[0.3em]">
              Svāgatam | स्वागतम्
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif text-white leading-[1.25]">
            Welcome back, <br />
            <span className="font-bold bg-gradient-to-r from-white via-white to-[#c9a050] bg-clip-text text-transparent py-10">
              Arjun Sharma | अर्जुन शर्मा
            </span>
          </h2>

          {/* Quick Status Sub-line */}
          <p className="text-[11px] text-white/50 font-medium tracking-wide">
            You have <span className="text-[#f7f1e3]">2 sessions</span>{" "}
            scheduled for this week.
          </p>
        </div>

        {/* Bottom subtle accent gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </motion.div>

      {/* LIVE FUNCTIONAL CALENDAR CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
        className="col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex flex-col"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-800">Calendar</h3>
          <div className="flex gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          {monthName} {year}
        </p>

        <div className="grid grid-cols-7 text-center text-[10px] gap-y-2 font-bold text-gray-400 uppercase tracking-tighter">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d}>{d}</div>
          ))}

          {/* Empty slots for correct day alignment */}
          {[...Array(firstDayOfMonth)].map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Dynamic Days */}
          {[...Array(daysInMonth(year, currentDate.getMonth()))].map((_, i) => {
            const day = i + 1;
            const isSelected =
              day === selectedDay &&
              currentDate.getMonth() === new Date().getMonth();
            const isToday =
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth();

            return (
              <motion.div
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`py-1.5 flex items-center justify-center rounded-full transition-colors cursor-pointer text-xs 
                  ${isSelected ? "bg-[#c9a050] text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}
                  ${isToday && !isSelected ? "border border-[#c9a050] text-[#c9a050]" : ""}
                `}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {day}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 space-y-2">
          <div className="bg-red-50/50 border-l-4 border-[#74271E] p-2 rounded-r flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#74271E]">
              Next Session: Oct 25, 4:00 PM
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#74271E] animate-pulse"></div>
          </div>
        </div>
      </motion.div>

      {/* Progress Summary - Unified Professional Version */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="col-span-12 lg:col-span-4 bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5 flex flex-col h-full group hover:shadow-md transition-all duration-500"
      >
        {/* Header Section - Matches Continue Learning Layout */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-800 tracking-tight">
              Progress Summary
            </h3>
            <p className="text-sm text-[#c9a050] font-medium italic">
              Abhyāsa • अभ्यास
            </p>
          </div>
        </div>

        {/* Main Metrics Content */}
        <div className="flex-1 flex flex-col justify-center gap-8">
          {[
            { label: "Courses Completed", val: "04", total: "10", percent: 40 },
            { label: "Learning Hours", val: "120", total: "160", percent: 75 },
            { label: "Current Streak", val: "15", total: "30", percent: 50 },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-6 group/item cursor-default"
            >
              {/* Progress Circle */}
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#f8f9fa"
                    strokeWidth="5"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke={idx === 1 ? "#c9a050" : "#74271E"}
                    strokeWidth="5"
                    strokeDasharray={175.9}
                    strokeDashoffset={175.9 - (175.9 * stat.percent) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 group-hover/item:opacity-80"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold text-gray-600">
                  {stat.percent}%
                </span>
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 mb-0.5">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-gray-900 leading-none">
                    {stat.val}
                  </span>
                  <span className="text-xs font-medium text-gray-300">
                    / {stat.total}
                  </span>
                </div>
              </div>

              {/* Subtle hover detail to match the premium feel */}
              <div className="opacity-0 group-hover/item:opacity-100 transition-opacity pr-2 text-gray-200">
                <div className="w-1.5 h-1.5 border-t-2 border-r-2 border-current rotate-45" />
              </div>
            </div>
          ))}
        </div>

        {/* Progress Insight - Matches the "Last Studied" metadata style */}
        <div className="mt-6">
          <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#c9a050] animate-pulse" />
            You are in the top 5% of active students this week
          </p>
        </div>
      </motion.div>

      {/* Continue Learning - Professional Version */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        className="col-span-12 lg:col-span-4 bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5 flex flex-col h-full group hover:shadow-md transition-all duration-500"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-800 tracking-tight">
              Continue Learning
            </h3>
            <p className="text-sm text-[#c9a050] font-medium italic">
              Anuvartatām • अनुवर्तताम्
            </p>
          </div>
          {/* View All Button - Redirects to Courses */}
          <button
            onClick={() => (window.location.href = "/student/courses")}
            className="text-[11px] font-bold text-gray-400 hover:text-[#74271E] transition-colors uppercase tracking-wider flex items-center gap-1 group/link"
          >
            View All
            <span className="group-hover/link:translate-x-0.5 transition-transform">
              →
            </span>
          </button>
        </div>

        {/* Course Thumbnail Area */}
        <div className="relative h-44 rounded-[2rem] mb-6 overflow-hidden group/thumb cursor-pointer">
          {/* Background Image / Pattern Overlay */}
          <div className="absolute inset-0 bg-[#2a1b0a] flex items-center justify-center">
            {/* Subtle Geometric Pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(#c9a050 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <p className="relative z-10 text-[#c9a050] font-serif text-lg text-center px-6 leading-relaxed">
              Introduction to <br />
              <span className="font-bold">Sanskrit Grammar</span>
            </p>
          </div>
        </div>

        {/* Progress Info */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-3">
            <p className="text-sm font-bold text-gray-800">
              Vyākaraṇa Prārambha
            </p>
            <span className="text-xs font-bold text-[#74271E]">65%</span>
          </div>

          <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "65%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-r from-[#74271E] to-[#c9a050] h-full rounded-full"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            Last studied: 2 days ago
          </p>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 w-full bg-[#74271E] text-white py-4 rounded-2xl font-bold text-sm shadow-lg hover:bg-[#5a1e17] transition-all flex items-center justify-center gap-2"
        >
          Resume Course
        </motion.button>
      </motion.div>

      {/* Daily Shloka Card - Professionally Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="col-span-12 lg:col-span-4 bg-[#fdfbf7] rounded-[2.5rem] p-10 shadow-sm border border-[#e6d5b8] flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-md transition-all duration-500"
      >
        {/* Layered Decorative Frame (Corners) */}
        <div className="absolute top-6 left-6 w-10 h-10 border-t-[1px] border-l-[1px] border-[#c9a050]/40 rounded-tl-2xl transition-all" />
        <div className="absolute bottom-6 right-6 w-10 h-10 border-b-[1px] border-r-[1px] border-[#c9a050]/40 rounded-br-2xl transition-all" />

        {/* Subtle Background Watermark (OM or Flower Symbol) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <svg
            viewBox="0 0 100 100"
            className="w-64 h-64 text-[#c9a050] fill-current"
          >
            <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90C27.9 90 10 72.1 10 50S27.9 10 50 10s40 17.9 40 40-17.9 40-40 40z" />
          </svg>
        </div>

        {/* Label */}
        <h3 className="font-black text-[#c9a050] uppercase tracking-[0.3em] text-[10px] mb-8 relative z-10">
          Daily Shloka • दैनिक श्लोक
        </h3>

        {/* Main Sanskrit Text - Increased Line Height for Elegance */}
        <div className="font-serif text-2xl text-gray-800 leading-[2] mb-6 relative z-10 drop-shadow-sm">
          <p>असतो मा सद्गमय ।</p>
          <p>तमसो मा ज्योतिर्गमय ।</p>
          <p>मृत्योर्मा अमृतं गमय ।</p>
        </div>

        {/* Transliteration Section - Clean & Readable */}
        <div className="space-y-2 relative z-10">
          <div className="h-[1px] w-12 bg-gray-200 mx-auto mb-4" />
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed max-w-[280px]">
            asato mā sadgamaya | tamaso mā jyotirgamaya |<br />
            mṛtyormā amṛtaṃ gamaya |
          </p>
        </div>

        {/* Translation - Premium Italic Styling */}
        <div className="mt-8 px-6 py-3 bg-[#f7f1e3]/40 rounded-2xl border border-[#e6d5b8]/20 relative z-10">
          <p className="text-[12px] text-[#74271E] italic leading-relaxed font-serif">
            "Lead me from the unreal to the real, from darkness to light, from
            death to immortality."
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
