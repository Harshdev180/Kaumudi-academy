import React from "react";
import { motion } from "framer-motion";
import { Clock, FileText, Languages } from "lucide-react";

const HeroSection = ({ data }) => {
  const title = data?.title || "Sanskrit Course";
  const level = data?.level || "All Levels";
  const duration = data?.duration || "";
  const language = Array.isArray(data?.language)
    ? data.language.join(", ")
    : data?.language || "";
  const description =
    data?.description ||
    "Explore this course guided by scholars with a blend of tradition and structure.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-16"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-[1px] w-6 bg-[#c9a84e]" />
        <span className="text-[12px] md:text-[13px] font-semibold uppercase tracking-widest text-[#c9a84e]">
          Kaumudi Sanskrit Academy
        </span>
      </div>
      <h1 className="text-3xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-4">
        {title}
      </h1>
      <div className="flex flex-wrap items-center gap-2.5 md:gap-3 mb-5">
        {level && (
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-white px-3 py-1.5 rounded-md text-xs md:text-sm font-bold border border-white/15">
            <FileText size={14} />
            {level}
          </span>
        )}
        {duration && (
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-white px-3 py-1.5 rounded-md text-xs md:text-sm font-bold border border-white/15">
            <Clock size={14} />
            {duration}
          </span>
        )}
        {language && (
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-white px-3 py-1.5 rounded-md text-xs md:text-sm font-bold border border-white/15">
            <Languages size={14} />
            {language}
          </span>
        )}
      </div>
      <p className="text-sm md:text-base text-[#E6E2D3] leading-relaxed max-w-2xl opacity-90">
        {description}
      </p>
      <div className="mt-6">
        <a
          href="#syllabus"
          className="inline-flex items-center gap-2 bg-[#c9a84e] text-[#631D11] px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_10px_20px_rgba(201,168,78,0.3)] hover:shadow-[0_15px_30px_rgba(201,168,78,0.45)] transition-shadow"
        >
          Explore Curriculum
        </a>
      </div>
    </motion.div>
  );
};

export default HeroSection;
