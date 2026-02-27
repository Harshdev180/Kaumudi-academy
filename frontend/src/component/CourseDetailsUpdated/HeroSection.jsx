import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  BookOpen,
  Globe,
  Award,
  Users,
  ChevronRight,
  Star,
  Play,
} from "lucide-react";

const HeroSection = ({ data }) => {
  // Destructure with comprehensive defaults matching your CourseDetails data structure
  const {
    title = "Sanskrit Course",
    level = "All Levels",
    duration = "",
    language = "",
    description = "Explore this comprehensive Sanskrit course guided by experienced scholars. Master the ancient language with a perfect blend of traditional wisdom and modern pedagogical structure.",
    category = "",
    mode = "ONLINE",
    startDate = "",
    endDate = "",
    studentsEnrolled = "",
    rating = "4.8",
    totalReviews = "128",
    instructor = {},
  } = data || {};

  // Format language display (handles both string and array)
  const languageDisplay = Array.isArray(language)
    ? language.join(", ")
    : language || "";

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return null;
    }
  };

  const startDateFormatted = formatDate(startDate);
  const endDateFormatted = formatDate(endDate);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="">
      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20"
      >
        {/* Breadcrumb - Left Aligned */}
        <motion.nav
          variants={itemVariants}
          className="flex items-center gap-2 text-sm text-[#74271E]/70 mb-6"
          aria-label="Breadcrumb"
        >
          <a href="/" className="hover:text-[#74271E] transition-colors">
            Home
          </a>
          <ChevronRight size={14} className="text-[#74271E]/50" />
          <a
            href="/allcourses"
            className="hover:text-[#74271E] transition-colors"
          >
            Courses
          </a>
          <ChevronRight size={14} className="text-[#74271E]/50" />
          <span className="text-[#74271E] font-medium truncate max-w-[200px]">
            {title}
          </span>
        </motion.nav>

        {/* Main Content Grid - Two Column Layout for Larger Screens */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="flex-1 max-w-3xl">
            {/* Academy Badge */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 mb-4"
            >
              <div className="h-[2px] w-8 bg-[#74271E]" />
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#74271E]">
                Kaumudi Sanskrit Academy
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#74271E] leading-[1.1] tracking-tight mb-4"
            >
              {title}
            </motion.h1>

            {/* Rating Section */}
            {(rating || totalReviews) && (
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 mb-4"
              >
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= Math.floor(parseFloat(rating))
                          ? "text-[#c9a84e] fill-[#c9a84e]"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-[#74271E] font-medium">
                  {rating} · {totalReviews} reviews
                </span>
              </motion.div>
            )}

            {/* Instructor Info - Moved here for better hierarchy */}
            {instructor?.name && (
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 mb-6"
              >
                {instructor.image ? (
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#74271E]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#74271E]/10 flex items-center justify-center">
                    <Award size={18} className="text-[#74271E]" />
                  </div>
                )}
                <div>
                  <span className="text-sm text-[#74271E]/70">Instructor</span>
                  <p className="text-[#74271E] font-semibold">
                    {instructor.name}
                    {instructor.qualification && (
                      <span className="text-xs text-[#74271E]/60 ml-2 font-normal">
                        {instructor.qualification}
                      </span>
                    )}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Meta Information Tags */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              {level && (
                <span className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm text-[#74271E] px-4 py-2 rounded-full text-sm font-medium border border-[#74271E]/20">
                  <BookOpen size={16} className="text-[#74271E]" />
                  {level}
                </span>
              )}
              {duration && (
                <span className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm text-[#74271E] px-4 py-2 rounded-full text-sm font-medium border border-[#74271E]/20">
                  <Clock size={16} className="text-[#74271E]" />
                  {duration}
                </span>
              )}
              {languageDisplay && (
                <span className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm text-[#74271E] px-4 py-2 rounded-full text-sm font-medium border border-[#74271E]/20">
                  <Globe size={16} className="text-[#74271E]" />
                  {languageDisplay}
                </span>
              )}
              {mode && (
                <span className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm text-[#74271E] px-4 py-2 rounded-full text-sm font-medium border border-[#74271E]/20">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      mode === "ONLINE" ? "bg-green-500" : "bg-blue-500"
                    }`}
                  />
                  {mode}
                </span>
              )}
            </motion.div>

            {/* Course Schedule */}
            {(startDateFormatted || category) && (
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-4 mb-6 text-sm"
              >
                {category && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#74271E]/70">Category:</span>
                    <span className="text-[#74271E] font-medium">
                      {category}
                    </span>
                  </div>
                )}
                {startDateFormatted && endDateFormatted && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#74271E]/70">Next Batch:</span>
                    <span className="text-[#74271E] font-medium">
                      {startDateFormatted} — {endDateFormatted}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-[#74271E]/80 leading-relaxed mb-8 max-w-2xl"
            >
              {description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <motion.a
                href="#syllabus"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 bg-[#74271E] text-white px-6 py-3 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Explore Curriculum
                <ChevronRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </motion.a>

              <motion.a
                href="#course-demo"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 bg-white text-[#74271E] px-6 py-3 rounded-xl font-semibold text-sm sm:text-base border-2 border-[#74271E]/20 hover:border-[#74271E]/40 transition-all duration-300"
              >
                <Play size={16} fill="#74271E" />
                Watch Demo
              </motion.a>
            </motion.div>
          </div>

          {/* Right Column - Stats/Quick Info (Optional) */}
          {studentsEnrolled && (
            <motion.div
              variants={itemVariants}
              className="lg:w-80 bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-[#74271E]/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <Users size={20} className="text-[#74271E]" />
                <span className="text-[#74271E] font-semibold">
                  {studentsEnrolled} students enrolled
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#74271E]/70">Course Access</span>
                  <span className="text-[#74271E] font-medium">Lifetime</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#74271E]/70">Certificate</span>
                  <span className="text-[#74271E] font-medium">Yes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#74271E]/70">Refund Policy</span>
                  <span className="text-[#74271E] font-medium">30 Days</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Trust Indicators - Full Width Bottom */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-6 border-t border-[#74271E]/10 flex flex-wrap items-center gap-6"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-[#74271E]/70">
              Certificate on completion
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#74271E]" />
            <span className="text-xs text-[#74271E]/70">Lifetime access</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs text-[#74271E]/70">
              30-day refund policy
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
