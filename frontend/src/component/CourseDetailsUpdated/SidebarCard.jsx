import React, { useState, useEffect } from 'react';
import { CheckCircle, Flame } from 'lucide-react';

const SidebarCard = () => {
  // Seats Progress State
  const [leftSeats, setLeftSeats] = useState(0);
  const totalSeats = 25;
  const targetLeft = 4;

  // Features Animation State (Checklist)
  const [visibleFeatures, setVisibleFeatures] = useState(0);
  const features = [
    "120+ Hours of Live Instruction",
    "Certificate of Completion",
    "Access to Library & Recordings",
    "Lifetime Discussion Forum Access"
  ];

  useEffect(() => {
    // Number & Progress animation
    if (leftSeats < targetLeft) {
      const timer = setTimeout(() => setLeftSeats(prev => prev + 1), 150);
      return () => clearTimeout(timer);
    }
  }, [leftSeats]);

  useEffect(() => {
    // Checklist one-by-one animation
    if (visibleFeatures < features.length) {
      const timer = setTimeout(() => {
        setVisibleFeatures(prev => prev + 1);
      }, 500); // Har feature 0.5 second baad check hoga
      return () => clearTimeout(timer);
    }
  }, [visibleFeatures]);

  const progressPercent = ((totalSeats - targetLeft) / totalSeats) * 100;

  return (
    <div className="sticky top-10 bg-white rounded-[24px]  overflow-hidden shadow-xl border border-gray-100 max-w-[380px] min-h-[850px] flex flex-col">
      {/* Header Section */}
      <div className="relative bg-[#631D11] p-8 text-white text-center flex-none">
        <div className="absolute top-0 right-0 w-25 h-10 bg-[#C4A04D]" 
             style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}>
        </div>

        <p className="text-[12px] uppercase tracking-[0.25em] font-bold text-stone-300 mb-2">Full Course Fee</p>
        
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="text-4xl font-extrabold tracking-tight">₹14,999</span>
          <span className="text-xl line-through text-stone-400 font-medium">₹24,000</span>
        </div>

        <div className="mt-6 inline-block bg-[#B18E40] text-[#3D1A16] text-[11px] font-bold px-6 py-2 rounded-full shadow-md">
          EMI STARTS AT ₹1,500/MO
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-8 flex-grow flex flex-col justify-between space-y-10">
        <div className="space-y-10">
          {/* Progress Bar & Seat Info */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-2">
                <Flame size={22} className="text-[#B18E40] fill-[#B18E40]" />
                <span className="text-[#631D11] font-bold text-[15px] leading-tight">
                  Limited Seats<br/>Remaining
                </span>
              </div>
              <span className="font-extrabold text-[#631D11] text-right text-[15px]">
                {leftSeats} / {totalSeats}<br/>
                <span className="font-medium text-[12px] text-gray-500 uppercase tracking-wide">left</span>
              </span>
            </div>
            
            <div className="w-full bg-[#F3F0E9] h-3.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#B18E40] h-full rounded-full shadow-inner transition-all duration-1000 ease-out"
                style={{ width: `${leftSeats > 0 ? progressPercent : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Features List - One-by-one animation */}
          <ul className="space-y-5">
            {features.map((item, i) => (
              <li 
                key={i} 
                className={`flex gap-7 items-start leading-snug transition-all duration-500 ${
                  i < visibleFeatures ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
              >
                <CheckCircle 
                  size={24} 
                  className={`text-[#B18E40] shrink-0 transition-transform duration-500 ${
                    i < visibleFeatures ? "scale-100" : "scale-0"
                  }`} 
                  fill="#B18E401A"
                  strokeWidth={2.5} 
                />
                <span className="text-[#7A5C58] font-bold text-[18px]">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons & Footer */}
        <div className="space-y-11">
          <div className="space-y-9">
            <button className="w-full bg-[#631D11] text-white py-5 rounded-2xl font-bold text-xl hover:text-[#631D11] hover:bg-[#d6b15c] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
              Enroll Now <span className="text-2xl">→</span>
            </button>

            <button className="w-full border-2 border-[#22C55E] text-[#22C55E] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition-colors">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Inquiry
            </button>
          </div>

          <p className="text-[11px] text-gray-400 text-center px-4 leading-relaxed font-semibold">
            Secure payment via Razorpay. Money-back<br/>guarantee within 7 days.
          </p>
        </div>
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default SidebarCard;