import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CurriculumAccordion = () => {
  // openIndex ko -1 set kiya hai taaki initially sab band rahein
  const [openIndex, setOpenIndex] = useState(-1); 
  const navigate = useNavigate();

  const modules = [
    {
      title: "Introduction to Paspashahnika",
      isLocked: false,
      content: [
        "Purpose of Grammar (Vyakarana-prayojanam)",
        "Concept of Shabda and Artha",
        "Linguistic Analysis methodology in Mahabhashya"
      ]
    },
    { 
      title: "Shivasutra and Pratyahara Analysis", 
      isLocked: false,
      content: [
        "Significance of Maheshwara Sutras",
        "Formation of Pratyaharas",
        "Phonetic classifications"
      ]
    },
    { 
      title: "Sutra Interpretation Principles", 
      isLocked: true, 
      content: [] 
    }
  ];

  const handleToggle = (index, isLocked) => {
    if (isLocked) {
      navigate('/login'); 
      return;
    }
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="font-sans-serif">
      <div className="flex items-center gap-3 mb-8 mt-12">
        <div className="w-1.5 h-8 bg-[#d6b15c]"></div>
        <h2 className="text-[28px] font-bold text-[#74271E]">Curriculum</h2>
      </div>

      <div className="space-y-4">
        {modules.map((module, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div 
              key={index} 
              className={`rounded-[16px] overflow-hidden border border-[#E8DFD3] shadow-sm transition-all ${isOpen ? 'ring-1 ring-[#B18E40]' : ''}`}
            >
              <button 
                onClick={() => handleToggle(index, module.isLocked)}
                className={`w-full flex justify-between items-center p-6 text-left transition-colors ${isOpen ? 'bg-white' : 'bg-white hover:bg-[#F9F5F0]'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold ${module.isLocked ? 'bg-[#D9C5B2] text-white' : 'bg-[#631D11] text-white'}`}>
                    {index + 1}
                  </div>
                  <span className={`text-[18px] font-bold ${module.isLocked ? 'text-gray-400' : 'text-[#631D11]'}`}>
                    {module.title}
                  </span>
                </div>
                
                <div className="text-gray-400">
                  {module.isLocked ? (
                    <Lock size={20} className="text-[#B18E40]" />
                  ) : isOpen ? (
                    <ChevronUp size={24} className="text-[#631D11]" />
                  ) : (
                    <ChevronDown size={24} className="text-[#631D11]" />
                  )}
                </div>
              </button>
              
              {isOpen && !module.isLocked && (
                <div className="bg-[#EFE3C8] p-8 border-t border-[#D9C5B2]">
                  <ul className="space-y-4">
                    {module.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[#631D11] font-medium text-[16px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#631D11] mt-2 shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CurriculumAccordion;