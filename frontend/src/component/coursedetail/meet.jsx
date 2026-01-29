import React from 'react';
import { motion } from 'framer-motion'; // 1. Motion import kiya
import { Mail, Award, Globe } from 'lucide-react';

const InstructorCard = () => {
  // 2. Slow & Smooth Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5, // Heading ke 0.5s baad Card aayega
      }
    }
  };

  const itemSlow = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1.2, // 1.2 second slow transition
        ease: [0.22, 1, 0.36, 1] // Premium Cinematic Ease
      } 
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show" 
      viewport={{ once: true, amount: 0.2 }}
      className="flex flex-col items-center justify-center p-8 py-8 bg-transparent"
    >
      
      {/* 3. Heading Section - Yeh pehle aayega */}
      <motion.div variants={itemSlow} className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-[#6b1d14] tracking-tight">Meet Your Acharya</h2>
        <div className="h-1.5 w-16 bg-[#6b1d14] mx-auto mt-2 rounded-full"></div>
      </motion.div>

      {/* 4. Instructor Card Content - Yeh second aayega */}
      <motion.div 
        variants={itemSlow}
        className="relative bg-[#FFF8F0] rounded-2xl shadow-lg border border-[#f3e6d5] p-8 max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start gap-10"
      >
        
        {/* Profile Image Section */}
        <div className="relative flex-shrink-0">
          <div className="w-44 h-44 rounded-full border-[4px] border-[#6b1d14] overflow-hidden p-1 bg-white shadow-md">
            <img 
              src="src/assets/image1.jpeg" 
              alt="Dr. Vikram Shastri"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-[#6b1d14]/5 blur-xl rounded-full scale-110"></div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-3xl font-black text-[#6b1d14]">Dr. Vikram Shastri</h3>
            <p className="text-[#8b2b22] font-bold text-sm tracking-wide mt-1 uppercase">
              PhD in Vyakarana, Varanasi Hindu University
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed text-base md:text-lg">
            With over 25 years of experience in decoding Vedic phonology and Paninian 
            morphology, Dr. Shastri has guided over 5,000 students worldwide. His 
            methodology bridges the gap between oral tradition and computational 
            linguistics.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 pt-4">
            {[Mail, Award, Globe].map((Icon, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.1, backgroundColor: "#6b1d14", color: "#fff" }} // Hover effect added
                transition={{ duration: 0.3 }}
                className="p-3 rounded-xl bg-[#FFF8F0] text-[#6b1d14] transition-all cursor-pointer shadow-sm border border-gray-100"
              >
                <Icon className="w-5 h-5" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InstructorCard;