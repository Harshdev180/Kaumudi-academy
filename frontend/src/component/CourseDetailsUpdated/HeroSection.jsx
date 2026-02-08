import React from 'react';

const HeroSection = ({ data }) => {
  return (
    <div className="relative bg-[#5C1D13] font-sans-serif rounded-2xl overflow-hidden text-white shadow-xl">
      <div className="absolute inset-0 opacity-20">
        <img 
          src={data?.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv8HjlPpt0rOT7SHaevW0xmnEg9DCgkEfvrA&s"} 
          alt="Sanskrit Manuscripts" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative p-6 md:p-25 space-y-4">
        <span className="bg-[#74271E] text-[10px] font-bold tracking-[0.2em] px-3 py-1 rounded-full uppercase border border-[#944335]">
          {data?.level || "Advanced Certification"}
        </span>
        <h1 className="text-3xl text-white md:text-5xl font-bold leading-tight max-w-2xl">
          {data?.title || "Advanced Paninian Grammar: Mahabhashya Study"}
        </h1>
        <p className="text-white/90 text-lg max-w-xl italic">
          {data?.description || "A comprehensive deep-dive into the foundational texts of Sanskrit linguistic philosophy."}
        </p>
      </div>
    </div>
  );
};

export default HeroSection;