import React from 'react';

const InstructorSection = () => {
  return (
    <section className="font-sans-serif w-full px-2">
      {/* Section Heading */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-7 bg-[#B18E40]"></div>
        <h2 className="text-[22px] md:text-[26px] font-bold text-[#631D11]">Your Instructor</h2>
      </div>

      {/* Main Card */}
      <div className="bg-white p-5 md:p-8 rounded-[24px] shadow-sm border border-stone-100 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
        
        {/* Profile Image */}
        <div className="relative shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-[#B18E40]/20 border border-[#B18E40]/30">
            <img 
              src="src/assets/image1.jpeg" 
              alt="Acharya Dr. Vasudev Shastry" 
              className="w-full h-full rounded-full object-cover border-[3px] border-[#B18E40]"
            />
          </div>
        </div>

        {/* Details Content */}
        <div className="flex-1 min-w-0 text-center md:text-left">
          <h3 className="text-[22px] md:text-[23px] font-bold text-[#631D11] mb-1">
            Acharya Dr. Vasudev Shastry
          </h3>
          
          <p className="text-[#B18E40] text-[12px] md:text-[13px] font-bold uppercase tracking-tight mb-2">
            PHD IN VYAKARANA, BANARAS HINDU UNIVERSITY
          </p>
          
          <p className="text-[#7A5C58] text-[13px] md:text-[14px] leading-relaxed font-medium max-w-2xl mb-5">
            With over 25 years of teaching experience, Acharya Vasudev has guided 
            thousands of students through the complexities of Sanskrit Grammar. 
            Recipient of several national academic awards.
          </p>

          {/* Tags - Now Below the Paragraph in One Line */}
          <div className="flex items-center gap-2 justify-center md:justify-start overflow-x-auto no-scrollbar pb-1">
            {[
              "25+ Yrs Exp", 
              "100+ Publications", 
              "Veda Ratna Awardee"
            ].map((tag) => (
              <span 
                key={tag} 
                className="px-3 py-1.5 bg-[#F9F5F0] text-[#631D11] text-[11px] md:text-[10px] font-bold rounded-full border border-[#E8DFD3] whitespace-nowrap shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
};

export default InstructorSection;