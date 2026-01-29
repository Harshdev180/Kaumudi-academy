import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Clock,
  BarChart2,
  ArrowRight,
  Globe, // Naya icon language ke liye
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* PREMIUM CINEMATIC VARIANTS (1.2s Slow) */
const headingVariant = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 1.2, 
      ease: [0.22, 1, 0.36, 1] 
    },
  },
};

const listVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, 
      delayChildren: 0.5,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 1.2, 
      ease: [0.22, 1, 0.36, 1] 
    },
  },
};

// 1. Updated Data with Language and Description
const courses = [
  { id: 1, title: "Foundations of Sanskrit Vyakaran (Level 1)", description: "Learn core Paninian grammar and sentence construction from basics.", language: "Hindi & Sanskrit", price: "4,999", duration: "12 Weeks", level: "Beginner", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400", type: "ONLINE" },
  { id: 2, title: "Mastering Vedic Chanting & Phonetics", description: "Explore the precise art of Swara and Akshara in Vedic recitation.", language: "Sanskrit", price: "7,500", duration: "8 Weeks", level: "Intermediate", image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400", type: "IN-PERSON" },
  { id: 3, title: "Upanishad Darshanam: Deep Philosphy", description: "Journey through the metaphysical teachings of ancient Upanishads.", language: "Hindi & English", price: "12,000", duration: "6 Months", level: "Advanced", image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=400", type: "ONLINE" },
  { id: 4, title: "Yoga Sutras of Patanjali", description: "Detailed study of Patanjali's Ashtanga Yoga framework.", language: "English", price: "5,500", duration: "10 Weeks", level: "Beginner", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400", type: "ONLINE" },
  { id: 5, title: "Manuscriptology & Paleography", description: "Training in reading and preserving ancient Indian scripts.", language: "Hindi & English", price: "9,200", duration: "14 Weeks", level: "Advanced", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400", type: "ONLINE" },
  { id: 6, title: "Bhagavad Gita: Karma Yoga", description: "Practical application of Gita's teachings in modern life.", language: "Hindi", price: "3,999", duration: "4 Weeks", level: "Intermediate", image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400", type: "IN-PERSON" },
];

const CourseCard = ({ course }) => {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -8, scale: 1.02 }} 
      whileTap={{ scale: 0.98 }} 
      className="w-full sm:w-1/2 md:w-1/3 flex-shrink-0 px-3 mb-6"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-md flex flex-col h-full border border-gray-100 hover:shadow-2xl transition-all duration-500">
        <div className="relative h-48 overflow-hidden group">
          <img
            src={course.image}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt={course.title}
          />
          {/* Top Label */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 text-[#6b1d14] text-[10px] font-bold px-2 py-1 rounded shadow flex items-center gap-1 uppercase tracking-wider">
              <Globe size={10} /> {course.language}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="bg-[#6b1d14] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
              {course.type}
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
            className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/20 backdrop-blur-md hover:bg-white transition-all"
          >
            <Heart size={18} className={isLiked ? "fill-red-500 text-red-500" : "text-white"} />
          </button>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-[#4A3A1A] font-bold text-md leading-tight mb-2">
            {course.title}
          </h3>
          
          {/* 2. Added Description */}
          <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center justify-between text-gray-500 mb-6">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Clock size={14} className="text-[#6b1d14]" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <BarChart2 size={14} className="text-[#6b1d14]" />
              <span>{course.level}</span>
            </div>
          </div>
          <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
            <span className="text-lg font-bold text-[#6b1d14]">₹ {course.price}</span>
            <button
              onClick={() => navigate("/coursedetails")}
              className="flex items-center gap-1 text-[#6b1d14] font-bold text-xs hover:gap-2 transition-all"
            >
              View Details <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function CourseCarousel() {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: dir === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-[#F3EAD3] w-full py-12 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto relative px-4 md:px-0">

        {/* 1. HEADING - Pehle aayegi (Slow Reveal) */}
        <motion.div
          variants={headingVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-extrabold text-[#6b1d14] tracking-tight uppercase">
            Recommended Courses
          </h2>
          <div className="h-1.5 w-16 bg-[#6b1d14] mx-auto mt-3 rounded-full"></div>
        </motion.div>

        {/* NAV BUTTONS */}
        <button onClick={() => scroll("left")} className="absolute -left-4 md:-left-13 top-[60%] -translate-y-1/2 z-30 bg-white p-3 rounded-full shadow-xl hover:bg-[#6b1d14] hover:text-white transition-all active:scale-90">
          <ChevronLeft size={24} />
        </button>
        <button onClick={() => scroll("right")} className="absolute -right-4 md:-right-13 top-[60%] -translate-y-1/2 z-30 bg-white p-3 rounded-full shadow-xl hover:bg-[#6b1d14] hover:text-white transition-all active:scale-90">
          <ChevronRight size={24} />
        </button>

        {/* 2. CARDS CONTAINER - Sequence mein load honge */}
        <motion.div
          ref={scrollRef}
          variants={listVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex overflow-x-hidden scroll-smooth -mx-3 pb-6 pt-2"
        >
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}