import React, { useState } from "react";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CurriculumAccordion = ({ curriculumData }) => {
  const [openIndex, setOpenIndex] = useState(-1);
  const navigate = useNavigate();

  // --- LOGIC ADDED: Login Check ---
  const isLoggedIn = !!localStorage.getItem("kaumudi_token");

  const fallbackModules = [
    {
      title: "Introduction to Paspashahnika",
      isLocked: false,
      content: [
        "Purpose of Grammar (Vyakarana-prayojanam)",
        "Concept of Shabda and Artha",
        "Linguistic Analysis methodology in Mahabhashya",
      ],
    },
    {
      title: "Shivasutra and Pratyahara Analysis",
      isLocked: false,
      content: [
        "Significance of Maheshwara Sutras",
        "Formation of Pratyaharas",
        "Phonetic classifications",
      ],
    },
    {
      title: "Sutra Interpretation Principles",
      isLocked: true,
      content: [
        "Sutra structure analysis",
        "Paribhasha implementation",
        "Vartika perspectives",
      ], // Content add kiya takki login ke baad empty na dikhe
    },
  ];

  const modules = Array.isArray(curriculumData) && curriculumData.length
    ? curriculumData
    : curriculumData && typeof curriculumData === "object"
    ? Object.entries(curriculumData).map(([title, items]) => ({
        title,
        isLocked: false,
        content: Array.isArray(items) ? items : [],
      }))
    : fallbackModules;

  const handleToggle = (index, isLocked) => {
    // Agar module locked hai AUR user login NAHI hai, tabhi redirect karein
    if (isLocked && !isLoggedIn) {
      navigate("/auth");
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
          // UI Logic: Agar login hai toh lock icon hide kar sakte hain ya color change
          const showAsLocked = module.isLocked && !isLoggedIn;

          return (
            <div
              key={index}
              className={`rounded-[16px] overflow-hidden border border-[#E8DFD3] shadow-sm transition-all ${isOpen ? "ring-1 ring-[#B18E40]" : ""}`}
            >
              <button
                onClick={() => handleToggle(index, module.isLocked)}
                className={`w-full flex justify-between items-center p-6 text-left transition-colors ${isOpen ? "bg-white" : "bg-white hover:bg-[#F9F5F0]"}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold ${showAsLocked ? "bg-[#D9C5B2] text-white" : "bg-[#631D11] text-white"}`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-[18px] font-bold ${showAsLocked ? "text-gray-400" : "text-[#631D11]"}`}
                  >
                    {module.title}
                  </span>
                </div>

                <div className="text-gray-400">
                  {showAsLocked ? (
                    <Lock size={20} className="text-[#B18E40]" />
                  ) : isOpen ? (
                    <ChevronUp size={24} className="text-[#631D11]" />
                  ) : (
                    <ChevronDown size={24} className="text-[#631D11]" />
                  )}
                </div>
              </button>

              {/* Login hone par ya unlocked hone par content dikhayein */}
              {isOpen && (!module.isLocked || isLoggedIn) && (
                <div className="bg-[#EFE3C8] p-8 border-t border-[#D9C5B2]">
                  <ul className="space-y-4">
                    {module.content &&
                      module.content.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-[#631D11] font-medium text-[16px]"
                        >
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
