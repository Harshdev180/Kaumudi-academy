import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  BarChart2,
  ArrowRight,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const courses = [
  { id: 1, title: "Foundations of Sanskrit Vyakaran (Level 1)", description: "Learn core Paninian grammar and sentence construction from basics.", language: "Hindi & Sanskrit", price: "4,999", duration: "12 Weeks", level: "Beginner", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400", type: "ONLINE" },
  { id: 2, title: "Mastering Vedic Chanting & Phonetics", description: "Explore the precise art of Swara and Akshara in Vedic recitation.", language: "Sanskrit", price: "7,500", duration: "8 Weeks", level: "Intermediate", image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400", type: "IN-PERSON" },
  { id: 3, title: "Upanishad Darshanam: Deep Philosphy", description: "Journey through the metaphysical teachings of ancient Upanishads.", language: "Hindi & English", price: "12,000", duration: "6 Months", level: "Advanced", image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=400", type: "ONLINE" },
  { id: 4, title: "Advanced Paninian Grammar Study", description: "A comprehensive deep-dive into foundational texts of Sanskrit linguistic.", language: "Hindi", price: "14,999", duration: "24 Weeks", level: "Advanced", image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400", type: "ONLINE" },
];

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full md:w-1/3 flex-shrink-0 px-3"
    >
      <div className="bg-white rounded-2xl overflow-hidden flex flex-col h-full border border-gray-200/50 hover:shadow-lg transition-all duration-500">
        <div className="relative h-45 overflow-hidden rounded-2xl">
          <img src={course.image} className="w-full h-full object-cover" alt={course.title} />
          <div className="absolute top-4 left-4">
            <span className="bg-white/95 text-[#6b1d14] text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
              <Globe size={10} className="inline mr-1" /> {course.language}
            </span>
          </div>
          {/* Badge Style (Online/Offline) */}
          <div className="absolute top-4 right-4">
            <span className="bg-[#6b1d14] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">{course.type}</span>
          </div>
        </div>

        <div className="p-3 flex flex-col flex-grow text-left">
          <h3 className="text-[#4A3A1A] font-bold text-[15px] leading-tight mb-3">{course.title}</h3>
          <p className="text-gray-500 text-[15px] leading-relaxed mb-6 line-clamp-2">{course.description}</p>
          
          <div className="flex items-center justify-between text-gray-500 mb-8">
            <div className="flex items-center gap-1.5 text-[13px] font-medium">
              <Clock size={16} className="text-[#6b1d14]" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] font-medium">
              <BarChart2 size={16} className="text-[#6b1d14]" />
              <span>{course.level}</span>
            </div>
          </div>

          <div className="mt-auto flex justify-between items-center pt-5 border-t border-[#6b1d14]/10">
            <span className="text-2xl font-bold text-[#6b1d14]">₹ {course.price}</span>
            
            {/* View Details Button - Updated to match Badge Style & Redirect */}
            <button 
              onClick={() => navigate("/coursedetails")} 
              className="bg-[#6b1d14] text-white text-[11px] font-bold px-4 py-2 rounded-2xl shadow-md flex items-center gap-2 hover:bg-[#B18E40] transition-all active:scale-95"
            >
              View Details <ArrowRight size={14} />
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
      const cardWidth = scrollRef.current.offsetWidth / 3;
      scrollRef.current.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
    }
  };

  return (
    <section className=" w-full py-2 overflow-hidden relative">
      <div className="w-full px-6 md:pl-[8px] md:pr-12 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#B18E40]"></div>
          <h2 className="text-[28px] font-bold text-[#631D11]">Recommended Courses</h2>
        </motion.div>
      </div>

      <div className="relative w-full px-6 md:pl-[18px] md:pr-[18px]">
        <button onClick={() => scroll("left")} className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-white p-4 rounded-full shadow-xl hover:bg-[#6b1d14] hover:text-white transition-all hidden md:flex items-center justify-center border border-gray-100">
          <ChevronLeft size={24} />
        </button>
        
        <button onClick={() => scroll("right")} className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-white p-4 rounded-full shadow-xl hover:bg-[#6b1d14] hover:text-white transition-all hidden md:flex items-center justify-center border border-gray-100">
          <ChevronRight size={24} />
        </button>

        <div 
          ref={scrollRef} 
          className="flex overflow-x-hidden no-scrollbar scroll-smooth mx-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {courses.map((course) => <CourseCard key={course.id} course={course} />)}
        </div>
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}