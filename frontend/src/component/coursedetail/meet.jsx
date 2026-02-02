import React from 'react';
import { Mail, Award, Globe } from 'lucide-react';

const InstructorCard = () => {
  return (
    /* Background color updated to match the academy theme in the images */
    <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
      <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center tracking-tight">Meet Your Acharya</h2>
      
      {/* Permanent Deep Shadow added here */}
      <div className=" relative bg-[#FFF8F0]  rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 p-8 max-w-3xl flex flex-col md:flex-row items-center md:items-start gap-8">
        
        {/* Profile Image with Golden Circle */}
        <div className="relative flex-shrink-0">
          <div className="w-40 h-40 rounded-full border-[3px] border-[#C19A5B] overflow-hidden p-1 bg-[#FFF8F0]  shadow-md">
            <img 
              src="src/assets/image1.jpeg" 
              alt="Dr. Vikram Shastri"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {/* Subtle Golden Glow behind image */}
          <div className="absolute inset-0 -z-10 bg-[#C19A5B]/20 blur-2xl rounded-full scale-90"></div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col space-y-3">
          <div>
            <h3 className="text-2xl font-extrabold text-[#C19A5B]">Dr. Vikram Shastri</h3>
            <p className="text-[#C19A5B] font-bold text-sm tracking-wide mt-1">
              PhD in Vyakarana, Varanasi Hindu University
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed text-sm md:text-[15px]">
            With over 25 years of experience in decoding Vedic phonology and Paninian 
            morphology, Dr. Shastri has guided over 5,000 students worldwide. His 
            methodology bridges the gap between oral tradition and computational 
            linguistics.
          </p>

          {/* Social Icons with their own subtle permanent shadow */}
          <div className="flex gap-5 pt-3">
            <div className="p-2 rounded-full bg-[#FFF8F0]  text-gray-500 hover:text-[#6b1d14] transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-50">
                <Mail className="w-5 h-5" />
            </div>
            <div className="p-2 rounded-full bg-[#FFF8F0]  text-gray-500 hover:text-[#6b1d14] transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-50">
                <Award className="w-5 h-5" />
            </div>
            <div className="p-2 rounded-full bg-[#FFF8F0]  text-gray-500 hover:text-[#6b1d14] transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-50">
                <Globe className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Decorative Corner */}
        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-gray-200 rounded-br-2xl"></div>
      </div>
    </div>
  );
};

export default InstructorCard;