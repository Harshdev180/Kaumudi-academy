import React, { useEffect, useState } from "react";
import {
  Award,
  Download,
  ExternalLink,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";
import { getProfileCertificates } from "../../lib/api";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadCertificates = async () => {
      try {
        const res = await getProfileCertificates();
        const list = res?.data || res || [];
        if (!active) return;
        const mapped = Array.isArray(list)
          ? list.map((item) => ({
              id: item?._id || item?.id || item?.certificateId,
              certificateId: item?.certificateId || item?._id,
              title: item?.course?.title || "Certificate",
              sanskritTitle: item?.sanskritTitle || "",
              date: item?.issuedAt
                ? new Date(item.issuedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—",
              grade: item?.grade || "—",
              issuer: "Kaumudi Sanskrit Academy",
              type: item?.type || "Course Completion",
            }))
          : [];
        setCertificates(mapped);
      } catch (error) {
        console.error("Failed to load certificates:", error);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadCertificates();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-8 px-2 sm:px-4 mt-4">
      {/* 1. HEADER SECTION */}
      {/* <div className="flex flex-col md:flex-row justify-between items-end gap-6 px-2"> */}
      {/* <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-[#c9a050] rounded-full" />
            <h3 className="text-3xl font-serif font-bold text-gray-800 tracking-tight">
              Academic Credentials
            </h3>
          </div>
          <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em]">
            Pramana-Patra | प्रमाण-पत्राणि
          </p>
        </div> */}

      {/* <div className="flex items-center gap-4 bg-[#fdfbf7] border border-[#e6d5b8]/30 px-6 py-3 rounded-2xl">
          <BadgeCheck className="text-[#c9a050]" size={20} />
          <div className="text-left">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Digital Status
            </p>
            <p className="text-xs font-bold text-gray-700">
              All Credentials Verified
            </p>
          </div>
        </div> */}
      {/* </div> */}

      {/* 2. CERTIFICATE GRID */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading certificates...</div>
      ) : certificates.length === 0 ? (
        <div className="text-sm text-gray-500">No certificates found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group bg-white rounded-[2.5rem] p-4 sm:p-8 shadow-sm border border-black/5 flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#c9a050]/10 hover:-translate-y-1"
            >
              {/* Artistic Mandala Watermark Background */}
              <div className="absolute -right-16 -top-16 opacity-[0.03] text-[#74271E] duration-1000 select-none pointer-events-none">
                <span className="text-[300px] font-serif">ॐ</span>
              </div>

              {/* Top Row: Icon & Certificate ID */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 relative z-10 gap-4 sm:gap-0">
                <div className="flex gap-5 items-center">
                  <div className="w-14 h-14 bg-[#fdfbf7] border border-[#e6d5b8]/40 rounded-2xl flex items-center justify-center shadow-inner group-hover:border-[#c9a050]/50 transition-colors">
                    <Award
                      size={28}
                      className="text-[#c9a050]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-0.5 bg-[#74271E]/5 text-[#74271E] text-[9px] font-black uppercase tracking-widest rounded-full">
                        {cert.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-gray-800 leading-tight group-hover:text-[#74271E] transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-[#c9a050] font-serif italic mt-1 font-medium">
                      {cert.sanskritTitle}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <CheckCircle2 size={20} className="text-emerald-500 mb-2" />
                  <span className="font-mono text-[10px] text-gray-300 font-bold tracking-tighter">
                    {cert.id}
                  </span>
                </div>
              </div>

              {/* Info Section with "Seal" Style Grade */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-6 sm:mb-8 relative z-10">
                <div className="sm:col-span-8 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/50">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      Issued On
                    </p>
                    <p className="text-xs font-bold text-gray-700">
                      {cert.date}
                    </p>
                  </div>
                  <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/50">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      Authority
                    </p>
                    <p className="text-[10px] font-bold text-gray-700 tracking-wider">
                      Kaumudi Academy
                    </p>
                  </div>
                </div>

                {/* Grade Seal */}
                <div className="sm:col-span-4 bg-[#fdfbf7] rounded-2xl border-2 border-dashed border-[#e6d5b8] flex flex-col items-center justify-center relative group-hover:bg-white transition-colors mt-4 sm:mt-0">
                  <p className="text-[8px] text-[#c9a050] font-black uppercase tracking-tighter absolute top-2">
                    Final Grade
                  </p>
                  <span className="text-2xl font-serif font-black text-[#74271E] mt-2">
                    {cert.grade}
                  </span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-auto pt-4 sm:pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 relative z-10">
                <button className="flex-1 flex items-center justify-center gap-3 bg-[#74271E] text-white py-3 sm:py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#5a1e17] transition-all shadow-xl shadow-[#74271E]/10 active:scale-95">
                  <Download size={16} />
                  Download Certificate
                </button>

                <button className="flex items-center gap-2 px-5 py-3 sm:py-4 rounded-2xl border border-gray-100 text-gray-400 hover:text-[#c9a050] hover:border-[#c9a050]/30 hover:bg-[#f7f1e3]/30 transition-all group/btn">
                  <ExternalLink
                    size={18}
                    className="group-hover/btn:scale-110 transition-transform"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">
                    Verify
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
