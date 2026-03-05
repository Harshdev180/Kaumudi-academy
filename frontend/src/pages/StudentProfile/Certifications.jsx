import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Download,
  ExternalLink,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";
import { getProfileCertificates } from "../../lib/api";
import logo from "../../assets/logo-bgremove.webp";
import { formatEnrollmentId } from "../../lib/utils";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDownloadCertificate = (cert) => {
    const studentName = localStorage.getItem("kaumudi_user_name") || "Student";
    const studentFirstName =
      localStorage.getItem("kaumudi_user_first_name") || "";
    const studentLastName =
      localStorage.getItem("kaumudi_user_last_name") || "";
    const studentId = localStorage.getItem("kaumudi_user_id") || "";
    const enrollmentId = formatEnrollmentId(
      studentId,
      cert.issuedAt || new Date(),
    );

    // Simple transliteration for demo purposes, in real app this would come from profile
    const sanskritName = "श्रद्धेय छात्र"; // Default placeholder if not available

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Certificate - ${cert.title}</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Martel:wght@400;700;900&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<style>
  body { margin: 0; padding: 0; background: #fdfbf7; font-family: 'Cinzel', serif; }
  .cert-container {
    width: 1000px;
    height: 700px;
    padding: 40px;
    position: relative;
    box-sizing: border-box;
    background: white;
    margin: 20px auto;
    border: 20px solid #74271E;
    box-shadow: 0 0 50px rgba(0,0,0,0.1);
  }
  .inner-border {
    height: 100%;
    width: 100%;
    border: 2px solid #c9a050;
    box-sizing: border-box;
    padding: 40px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .mandala-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 500px;
    opacity: 0.03;
    z-index: 0;
  }
  .header { z-index: 1; margin-bottom: 20px; }
  .logo { width: 100px; height: 100px; margin-bottom: 15px; }
  .academy-name { font-size: 32px; font-weight: 900; color: #74271E; letter-spacing: 2px; margin: 0; }
  .sub-header { font-size: 14px; color: #c9a050; font-weight: 700; margin-top: 5px; text-transform: uppercase; letter-spacing: 4px; }
  
  .cert-title { font-size: 54px; font-weight: 900; color: #74271E; margin: 30px 0 10px; text-transform: uppercase; }
  .cert-subtitle { font-size: 18px; color: #8c7a56; margin: 0 0 30px; font-style: italic; }
  
  .presentation { font-size: 20px; color: #2D2417; margin-bottom: 10px; }
  .student-name-container { margin: 10px 0 20px; }
  .student-name-en { font-size: 42px; font-weight: 700; color: #74271E; border-bottom: 2px solid #c9a050; display: inline-block; padding: 0 40px 5px; margin-bottom: 5px; }
  .student-name-sa { font-family: 'Martel', serif; font-size: 28px; color: #8c7a56; margin: 5px 0; }
  
  .course-info { font-size: 20px; color: #2D2417; line-height: 1.6; max-width: 800px; }
  .course-name { font-weight: 700; color: #74271E; font-size: 24px; }
  
  .details-grid {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: auto;
    padding: 0 20px;
    z-index: 1;
  }
  .detail-item { text-align: left; }
  .detail-label { font-size: 10px; font-weight: 900; color: #8c7a56; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
  .detail-value { font-size: 13px; font-weight: 700; color: #74271E; }
  
  .footer-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
    margin-top: 40px;
    z-index: 1;
  }
  .sign-box { text-align: center; }
  .signature { font-family: 'Martel', serif; font-size: 22px; color: #74271E; border-bottom: 1px solid #2D2417; padding-bottom: 5px; margin-bottom: 10px; width: 200px; }
  .sign-label { font-size: 12px; font-weight: 700; color: #8c7a56; text-transform: uppercase; }
  
  .seal {
    width: 120px;
    height: 120px;
    border: 2px double #c9a050;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle, #fff, #fdfbf7);
    box-shadow: 0 0 15px rgba(201,160,80,0.2);
    position: relative;
  }
  .seal-text { font-size: 8px; font-weight: 900; color: #c9a050; text-transform: uppercase; text-align: center; padding: 5px; }
  .seal-inner { width: 80px; height: 80px; border: 1px solid #c9a050; border-radius: 50%; display: flex; items-center; justify-content: center; }
  .seal-icon { font-size: 30px; color: #c9a050; line-height: 80px; }
  
  @media print {
    .cert-container { margin: 0; box-shadow: none; border: 15px solid #74271E; }
  }
</style>
</head>
<body>
  <div class="cert-container" id="certificate">
    <div class="inner-border">
      <div class="mandala-bg">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 2" />
          <path d="M50,5 L55,45 L95,50 L55,55 L50,95 L45,55 L5,50 L45,45 Z" fill="none" stroke="currentColor" stroke-width="0.5" />
        </svg>
      </div>
      
      <div class="header">
        <img src="${logo}" class="logo" alt="Academy Logo">
        <h2 class="academy-name">Kaumudi Sanskrit Academy</h2>
        <div class="sub-header">विद्या परं भूषणम् | Vidya Param Bhushanam</div>
      </div>
      
      <div class="cert-title">Pramāṇa-Patram</div>
      <div class="cert-subtitle">Certificate of Excellence</div>
      
      <div class="presentation">This is to certify that</div>
      
      <div class="student-name-container">
        <div class="student-name-en">${studentName}</div>
        <div class="student-name-sa">${sanskritName}</div>
      </div>
      
      <div class="course-info">
        has successfully completed the course titled<br>
        <span class="course-name">${cert.title}</span><br>
        demonstrating proficiency with a final grade of <strong>${cert.grade}</strong>.
      </div>
      
      <div class="details-grid">
        <div class="detail-item">
          <div class="detail-label">Enrollment ID</div>
          <div class="detail-value">${enrollmentId}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Certificate No.</div>
          <div class="detail-value">${cert.certificateId}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Issue Date</div>
          <div class="detail-value">${cert.date}</div>
        </div>
      </div>
      
      <div class="footer-section">
        <div class="sign-box">
          <div class="signature">Dr. Rama Sharma</div>
          <div class="sign-label">Course Instructor</div>
        </div>
        
        <div class="seal">
          <div class="seal-inner">
            <span class="seal-icon">ॐ</span>
          </div>
          <div class="seal-text">OFFICIAL SEAL • कौमुदी</div>
        </div>
        
        <div class="sign-box">
          <div class="signature" style="font-family: 'Martel', serif;">आचार्यः शशिकांतः</div>
          <div class="sign-label">Academy Director</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      const element = document.getElementById('certificate');
      html2pdf().set({
        margin: 0,
        filename: 'Certificate_${cert.title.replace(/[^a-z0-9]/gi, "_")}.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'px', format: [1000, 750], orientation: 'landscape' }
      }).from(element).save().then(() => {
        setTimeout(() => window.close(), 1000);
      });
    };
  </script>
</body>
</html>
    `;

    const w = window.open("", "CERTIFICATE", "height=800,width=1100");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  };

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

  const downloadCertificate = (certificateId) => {
    window.open(
      `${import.meta.env.VITE_API_URL}/api/certificates/download/${certificateId}`,
      "_blank",
    );
  };

  const verifyCertificate = (certificateId) => {
    window.open(
      `${import.meta.env.VITE_API_URL}/api/certificates/verify/${certificateId}`,
      "_blank",
    );
  };

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
        <div className="grid grid-cols-1 gap-4 md:gap-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute -right-16 -top-16 opacity-[0.03] text-[#74271E] select-none pointer-events-none">
              <span className="text-[300px] font-serif">ॐ</span>
            </div>
            <div className="w-16 h-16 bg-[#fdfbf7] border border-[#e6d5b8]/40 rounded-2xl flex items-center justify-center shadow-inner mb-4">
              <Award size={28} className="text-[#c9a050]" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-800 leading-tight">
              No Certificates Yet
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              No course is completed yet. Complete a course to earn a
              certificate.
            </p>
            <Link
              to="/allcourses"
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#74271E] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#5a1e17] transition-all shadow-xl shadow-[#74271E]/10"
            >
              Explore Courses
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {certificates.map((cert) => (
            <div
              key={cert.certificateId}
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
                <button
                  onClick={() => downloadCertificate(cert.certificateId)}
                  className="flex-1 flex items-center justify-center gap-3 bg-[#74271E] text-white py-3 sm:py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#5a1e17] transition-all shadow-xl shadow-[#74271E]/10 active:scale-95"
                >
                  <Download size={16} />
                  Download Certificate
                </button>

                <button
                  onClick={() => verifyCertificate(cert.certificateId)}
                  className="flex items-center gap-2 px-5 py-3 sm:py-4 rounded-2xl border border-gray-100 text-gray-400 hover:text-[#c9a050] hover:border-[#c9a050]/30 hover:bg-[#f7f1e3]/30 transition-all group/btn"
                >
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
