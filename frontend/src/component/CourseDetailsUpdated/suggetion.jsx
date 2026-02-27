import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  BarChart2,
  ArrowRight,
  Globe,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      // Responsive widths from your original layout
      className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-3"
    >
      <motion.div
        whileHover={{ y: -8 }}
        className="group bg-white rounded-[2rem] overflow-hidden flex flex-col h-full shadow-md border border-gray-100 transition-all duration-500 hover:shadow-2xl"
      >
        {/* Image Container */}
        <div className="relative h-52 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={course.image?.url || course.image}
            className="w-full h-full object-cover"
            alt={course.title}
          />
          {/* Subtle Overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-white/90 backdrop-blur-md text-[#74271E] text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 uppercase tracking-wider">
              <Globe size={12} />
              {Array.isArray(course.language)
                ? course.language[0]
                : course.language}
            </span>
          </div>

          <div className="absolute top-4 right-4 z-10">
            <span className="bg-[#74271E] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
              {course.mode}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col flex-grow text-left">
          <h3 className="text-[#3d1a16] font-bold text-xl leading-tight mb-2 font-serif group-hover:text-[#74271E] transition-colors truncate">
            {course.title}
          </h3>

          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
            {course.description}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 py-2 border-t border-gray-50 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-50 rounded-lg">
                <Clock size={14} className="text-[#6b1d14]" />
              </div>
              <span className="text-xs font-semibold text-gray-700">
                {course.duration || "Self-paced"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <BarChart2 size={14} className="text-[#6b1d14]" />
              </div>
              <span className="text-xs font-semibold text-gray-700">
                {course.level || "Beginner"}
              </span>
            </div>
          </div>

          {/* Footer: Price & CTA */}
          <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-50">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                Investment
              </span>
              <span className="text-2xl font-black text-[#74271E]">
                ₹{Number(course.price).toLocaleString("en-IN")}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate(`/coursedetail/${course._id || course.id}`, {
                  state: { course },
                });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-[#74271E] text-white p-3 rounded-2xl flex items-center justify-center hover:bg-[#d6b15c] transition-all shadow-md hover:shadow-[#d6b15c]/20"
            >
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function CourseCarousel({ courses = [] }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      // Calculation from original code for accurate sliding
      const cardWidth =
        scrollRef.current.offsetWidth /
        (window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 2 : 1);
      scrollRef.current.scrollBy({
        left: dir === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  if (!courses || courses.length === 0) return null;

  return (
    <section className="w-full py-8 font-sans-serif pb-2 overflow-hidden">
      <div className="max-w-[1190px] mx-auto px-1">
        {/* Original Heading Style with Gold Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 mb-1 mt-2">
            <div className="w-1.5 h-8 bg-[#d6b15c]"></div>
            <h2 className="text-[28px] font-bold text-[#74271E]">
              Recommended Courses
            </h2>
          </div>

          <div className="flex pr-4 sm:pr-10 gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll("left")}
              className="bg-white p-3 rounded-full shadow-md text-[#6b1d14] hover:text-white hover:bg-[#631D11] border border-gray-100"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll("right")}
              className="bg-white p-3 rounded-full shadow-md text-[#6b1d14] hover:text-white hover:bg-[#631D11] border border-gray-100"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>

        <div className="relative overflow-visible">
          <div
            ref={scrollRef}
            className="flex overflow-x-hidden no-scrollbar scroll-smooth py-3"
            style={{ scrollbarWidth: "none" }}
          >
            {courses.map((course, index) => (
              <CourseCard
                key={course._id || course.id}
                course={course}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        .font-serif { font-family: 'Playfair Display', sans-serif; }
      `}</style>
    </section>
  );
}
