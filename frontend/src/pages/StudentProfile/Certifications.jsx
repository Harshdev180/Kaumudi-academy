import React from 'react';
import { Award, Download, ExternalLink, ShieldCheck } from 'lucide-react';

const Certifications = () => {
  const certificates = [
    {
      id: "CERT-987654",
      title: "Rigveda Bhashya",
      sanskritTitle: "ऋग्वेद भाष्य",
      date: "December 20, 2023",
      grade: "A+",
      issuer: "Kaumudi Sanskrit Academy"
    },
    {
      id: "CERT-102938",
      title: "Sanskrit Grammar Foundation",
      sanskritTitle: "संस्कृत व्याकरण आधार",
      date: "January 15, 2024",
      grade: "O",
      issuer: "Kaumudi Sanskrit Academy"
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header matching Dashboard Title Style */}
      {/* <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800">My Certifications</h2>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">
          Pramana | प्रमाण
        </p>
      </div> */}

      {/* 2-Column Grid for the perfect "Standard" card size */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-black/5 flex flex-col relative overflow-hidden group hover:shadow-md transition-all">
            
            {/* Background Mandala Detail */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#c9a050]/5 rounded-full border-4 border-[#c9a050]/10 border-dotted" />

            <div className="flex items-start justify-between mb-5 relative z-10">
              <div className="flex gap-4 items-center">
                {/* Icon box */}
                <div className="w-12 h-12 bg-[#fdfbf7] border border-[#e6d5b8] rounded-xl flex items-center justify-center shadow-sm">
                  <Award size={24} className="text-[#c9a050]" strokeWidth={1.5} />
                </div>
                <div>
                  {/* Replaced navy blue with #74271E for Title */}
                  <h3 className="text-lg font-serif font-bold text-[#74271E] leading-tight">
                    {cert.title}
                  </h3>
                  <p className="text-[13px] text-gray-400 font-serif italic">
                    {cert.sanskritTitle}
                  </p>
                </div>
              </div>
              <div className="hidden sm:block">
                 <ShieldCheck size={20} className="text-[#c9a050] opacity-30" />
              </div>
            </div>

            {/* Info Section */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#f7f1e3]/40 p-3 rounded-xl border border-[#e6d5b8]/20">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Issue Date</p>
                <p className="text-xs font-bold text-gray-700">{cert.date}</p>
              </div>
              <div className="bg-[#f7f1e3]/40 p-3 rounded-xl border border-[#e6d5b8]/20">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Grade</p>
                {/* Replaced navy blue with #74271E for Grade text */}
                <p className="text-xs font-bold text-[#74271E]">{cert.grade}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-3">
              {/* Main Button background updated to #74271E */}
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#74271E] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#5a1e17] transition-all shadow-sm active:scale-95">
                <Download size={16} />
                Download PDF
              </button>
              <button className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-[#c9a050] hover:border-[#c9a050]/30 transition-all">
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certifications;