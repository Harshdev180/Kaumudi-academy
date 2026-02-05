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
  { id: 1, title: "Foundations of Sanskrit Vyakaran...", description: "Learn core Paninian grammar and sentence construction from basics.", language: "Hindi & Sanskrit", price: "4,999", duration: "12 Weeks", level: "Beginner", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500", type: "ONLINE" },
  { id: 2, title: "Mastering Vedic Chanting &...", description: "Explore the precise art of Swara and Akshara in Vedic recitation.", language: "Sanskrit", price: "7,500", duration: "8 Weeks", level: "Intermediate", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500", type: "IN-PERSON" },
  { id: 3, title: "Upanishad Darshanam: Deep...", description: "Journey through the metaphysical teachings of ancient Upanishads.", language: "Hindi & English", price: "12,000", duration: "6 Months", level: "Advanced", image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=500", type: "ONLINE" },
  { id: 4, title: "Introduction to Bhagavad Gita", description: "Understanding the essential values and teachings for modern life.", language: "English", price: "3,500", duration: "4 Weeks", level: "Beginner", image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=500", type: "ONLINE" },
  { id: 5, title: "Patanjali Yoga Sutras", description: "Deep dive into the philosophy and practice of classical yoga.", language: "Sanskrit & Hindi", price: "8,999", duration: "16 Weeks", level: "Intermediate", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500", type: "IN-PERSON" },
  { id: 6, title: "Sanskrit Conversation Mastery", description: "Speak Sanskrit fluently with our immersive speaking program.", language: "Sanskrit", price: "6,000", duration: "10 Weeks", level: "Intermediate", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500", type: "ONLINE" },
];

const CourseCard = ({ course, index }) => {
  const navigate = useNavigate();

  return (
    // Padding px-2 wahi rakha hai jo aapke original code mein tha
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-2"
    >
      {/* Animation wrap kiya hai bina classes change kiye */}
      <motion.div 
        whileHover={{ y: -5 }} 
        className="bg-white rounded-3xl overflow-hidden flex flex-col h-full shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
      >
        <div className="relative h-48 overflow-hidden">
          <motion.img 
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
            src={course.image} className="w-full h-full object-cover" alt={course.title} 
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white text-[#6b1d14] text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1 uppercase">
              <Globe size={12} /> {course.language}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="bg-[#6b1d14] text-white text-[10px] font-bold px-3 py-1 rounded-md shadow-sm">{course.type}</span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow text-left">
          <h3 className="text-[#631D11] font-bold text-lg leading-tight mb-3 font-serif line-clamp-1">{course.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">{course.description}</p>
          
          <div className="flex items-center justify-between text-gray-600 mb-6">
            <div className="flex items-center gap-1.5 text-sm">
              <Clock size={16} className="text-[#6b1d14]" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <BarChart2 size={16} className="text-[#6b1d14]" />
              <span>{course.level}</span>
            </div>
          </div>

          <div className="mt-auto flex justify-between items-center">
            <span className="text-xl font-bold text-[#6b1d14]">₹{course.price}</span>
            <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => {
               navigate("/coursedetail");
               window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }}
              className="bg-[#6b1d14] text-white text-[12px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#d6b15c] transition-all active:scale-95"
            >
              View Details <ArrowRight size={14} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function CourseCarousel() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth / (window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 2 : 1);
      scrollRef.current.scrollBy({ 
        left: dir === "left" ? -cardWidth : cardWidth, 
        behavior: "smooth" 
      });
    }
  };

  return (
    // Saari spacing aur margins aapke original code wali hi hain
    <section className="w-full py-2 font-sans-serif min-h-screen">
      <div className="max-w-[1200px] mx-auto -px-6">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-3 mb-2 mt-4">
            <div className="w-1.5 h-8 bg-[#d6b15c]"></div>
            <h2 className="text-[28px] font-bold text-[#631D11]">Recommended Courses</h2>
          </div>

          <div className="flex pr-10 gap-5">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => scroll("left")} className="bg-white p-3 rounded-full shadow-md text-[#6b1d14] hover:text-[#d6b15c] hover:bg-[#631D11] transition-all border border-gray-100">
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => scroll("right")} className="bg-white p-3 rounded-full shadow-md text-[#6b1d14] hover:text-[#d6b15c] hover:bg-[#631D11] transition-all border border-gray-100">
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>

        <div className="relative pr-3 overflow-hidden">
          <div 
            ref={scrollRef} 
            className="flex overflow-x-hidden no-scrollbar scroll-smooth mx-1"
            style={{ scrollbarWidth: 'none' }}
          >
            {courses.map((course, index) => <CourseCard key={course.id} course={course} index={index} />)}
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