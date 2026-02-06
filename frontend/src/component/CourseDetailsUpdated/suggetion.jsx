import React, { useRef } from "react";
import { motion } from "framer-motion"; // Framer motion import kiya
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
  { id: 1, title: "Vyakaran Shastra", description: "Learn core Paninian grammar and sentence construction from basics.", language: "Hindi & Sanskrit", price: "9,599", duration: "1 Year", level: "Beginner", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500", type: "ONLINE" },
  { id: 2, title: "Shlok", description: "Explore the precise art of Swara and Akshara in Vedic recitation.", language: "Sanskrit", price: "699", duration: "6 Weeks", level: "Intermediate", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500", type: "IN-PERSON" },
  { id: 3, title: "Spoken Sanskrit (Level-1)", description: "Journey through the metaphysical teachings of ancient Upanishads.", language: "Hindi & English", price: "2,499", duration: "3 Months", level: "Advanced", image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=500", type: "ONLINE" },
  { id: 4, title: "UGC NET", description: "Understanding the essential values and teachings for modern life.", language: "English", price: "1,499", duration: "- Weeks", level: "Beginner", image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=500", type: "ONLINE" },
  { id: 5, title: "BA", description: "Deep dive into the philosophy and practice of classical yoga.", language: "Sanskrit & Hindi", price: "3,999", duration: "- Weeks", level: "Intermediate", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500", type: "IN-PERSON" },
  { id: 6, title: "Shlok", description: "Speak Sanskrit fluently with our immersive speaking program.", language: "Sanskrit", price: "699", duration: "6 Weeks", level: "Intermediate", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500", type: "ONLINE" },
];

const CourseCard = ({ course, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      // Slide-in animation jab view mein aaye
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-3"
    >
      <motion.div 
        // Hover animation: Card halka sa upar uthega
        whileHover={{ y: -10 }}
        className="bg-white rounded-3xl overflow-hidden flex flex-col h-full shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl"
      >
        <div className="relative h-48 overflow-hidden">
          <motion.img 
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            src={course.image} 
            className="w-full h-full object-cover" 
            alt={course.title} 
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white text-[#6b1d14] text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1 uppercase">
              <Globe size={12} /> {course.language}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="bg-[#74271E] text-white text-[10px] font-bold px-3 py-1 rounded-md shadow-sm">{course.type}</span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow text-left">
          <h3 className="text-[#74271E] font-bold text-lg leading-tight mb-3 font-serif line-clamp-1">{course.title}</h3>
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
            <span className="text-xl font-bold text-[#74271E]">₹{course.price}</span>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate("/details", { state: { course } });
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }}
              className="bg-[#74271E] text-white text-[12px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#d6b15c] transition-colors"
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
    // py-8 add kiya taaki card ke animation ko space mile aur shake na ho
    <section className="w-full py-8 font-sans-serif pb-2 overflow-hidden"> 
      <div className="max-w-[1190px] mx-auto px-1">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-3 mb-1 mt-2">
            <div className="w-1.5 h-8 bg-[#d6b15c]"></div>
            <h2 className="text-[28px] font-bold text-[#74271E]">Recommended Courses</h2>
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

        {/* overflow-visible zaroori hai animation smooth rakhne ke liye */}
        <div className="relative overflow-visible"> 
          <div 
            ref={scrollRef} 
            className="flex overflow-x-hidden no-scrollbar scroll-smooth py-4"
            style={{ scrollbarWidth: 'none' }}
          >
            {courses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
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