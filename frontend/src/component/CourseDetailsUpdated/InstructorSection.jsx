import React from "react";

const InstructorSection = () => {
  return (
    <section className="font-sans-serif w-full ">
      {/* Section Heading */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-1.5 h-8 bg-[#d6b15c]"></div>

        <h2 className="text-[22px] md:text-[26px] font-bold text-[#74271E]">
          Your Instructor
        </h2>
      </div>

      {/* Main Card */}
      <div className="bg-white h-65 p-5 md:p-10 rounded-3xl shadow-sm border border-stone-100 flex flex-col md:flex-row items-center md:items-start gap-7 md:gap-8">
        {/* Profile Image */}
        <div className="relative shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-[#74271E] border border-[#74271E]">
            <img
              src="https://i.pinimg.com/1200x/4d/ce/47/4dce475c98aa927bd3bc5186fea452f0.jpg"
              alt="Acharya Dr. Vasudev Shastry"
              className="w-full h-full rounded-full object-cover border-[3px] border-[#B18E40]"
            />
          </div>
        </div>

        {/* Details Content */}
        <div className="flex-2 min-w-0 text-center md:text-left">
          <h3 className="text-[16px] md:text-[25px] font-bold text-[#74271E] mb-1">
            Acharya Dr. Vasudev Shastry
          </h3>

          <p className="text-[#d6b15c] text-xl md:text-xl font-bold uppercase  mb-1">
            PHD IN VYAKARANA, BANARAS HINDU UNIVERSITY
          </p>

          <p className="text-[#7A5C58] text-[13px] md:text-[14px] leading-relaxed font-medium max-w-2xl mb-2">
            With over 25 years of teaching experience, Acharya Vasudev has
            guided thousands of students through the complexities of Sanskrit
            Grammar. Recipient of several national academic awards.
          </p>

          {/* Tags - Now Below the Paragraph in One Line */}

          <div className="flex items-center gap-3 justify-center md:justify-start overflow-x-auto no-scrollbar pb-3">
            {["25+ Yrs Exp", "100+ Publications", "Veda Ratna Awardee"].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-3 py-2 bg-[#F9F5F0] text-[#74271E] text-[11px] md:text-[12px] font-bold rounded-full border border-[#E8DFD3] whitespace-nowrap shadow-sm"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
};

export default InstructorSection;
