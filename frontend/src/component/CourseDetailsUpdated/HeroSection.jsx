import React from "react";

const HeroSection = ({ data }) => {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl shadow-xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={
            data?.image ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv8HjlPpt0rOT7SHaevW0xmnEg9DCgkEfvrA&s"
          }
          alt="Course Background"
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5C1D13]/95 via-[#5C1D13]/85 to-[#5C1D13]/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-[150px] sm:min-h-[200px] md:min-h-[300px] px-6 sm:px-10 md:px-16 py-12">
        <div className="max-w-3xl space-y-5 text-white animate-fadeIn">
          {/* Badge */}
          <span className="inline-block bg-[#74271E] text-[11px] sm:text-xs font-semibold tracking-widest px-4 py-2 rounded-full uppercase border border-[#944335] transition-all duration-300 hover:bg-[#8A2E23]">
            {data?.level || "Advanced Certification"}
          </span>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight transition-all duration-500">
            {data?.title || "Advanced Paninian Grammar: Mahabhashya Study"}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-white/90 italic max-w-2xl transition-opacity duration-500">
            {data?.description ||
              "A comprehensive deep-dive into the foundational texts of Sanskrit linguistic philosophy."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
