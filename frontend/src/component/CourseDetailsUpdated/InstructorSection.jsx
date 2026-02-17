import React from "react";

const InstructorSection = ({ instructor }) => {
  return (
    <section className="font-sans-serif w-full ">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-1.5 h-8 bg-[#d6b15c]"></div>
        <h2 className="text-[22px] md:text-[26px] font-bold text-[#74271E]">Your Instructor</h2>
      </div>

         <div className="bg-white min-h-fit p-6 md:p-10 rounded-3xl shadow-sm border border-stone-100 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
            {/* Instructor Photo Section */}
            <div className="relative flex-shrink-0">
              {/* Image size is now fluid: smaller on mobile, larger on md screens */}
              <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full p-1 bg-[#74271E] border border-[#74271E]">
                <img
                  src={instructor?.image || "https://i.pinimg.com/1200x/4d/ce/47/4dce475c98aa927bd3bc5186fea452f0.jpg"}
                  alt={instructor?.name || "Acharya Dr. Vasudev Shastry"}
                  className="w-full h-full rounded-full object-cover border-[3px] border-[#B18E40]"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0 flex flex-col items-center md:items-start text-center md:text-left">
              {/* Name */}
              <h3 className="text-xl sm:text-2xl md:text-[28px] font-bold text-[#74271E] mb-1 leading-tight">
                {instructor?.name || "Acharya Dr. Vasudev Shastry"}
              </h3>

              {/* Qualification */}
              <p className="text-[#d6b15c] text-sm sm:text-base md:text-lg font-bold uppercase mb-3 tracking-wide">
                {instructor?.qualification || "PHD IN VYAKARANA, BANARAS HINDU UNIVERSITY"}
              </p>

              {/* Bio/Description - Added responsive width control */}
              <p className="text-[#7A5C58] text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed font-medium max-w-full md:max-w-2xl mb-4">
                {instructor?.bio || "With over 25 years of teaching experience, Acharya Vasudev has guided thousands of students through the complexities of Sanskrit Grammar."}
              </p>

              {/* Tags - Better wrapping for mobile responsiveness */}
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start w-full">
                {(instructor?.tags || ["25+ Yrs Exp", "100+ Publications", "Veda Ratna Awardee"]).map((tag) => (
                  <span key={tag} className="px-3 py-1.5 md:px-4 md:py-2 bg-[#F9F5F0] text-[#74271E] text-[10px] md:text-[12px] font-bold rounded-full border border-[#E8DFD3] whitespace-nowrap shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
    </section>
  );
};

export default InstructorSection;