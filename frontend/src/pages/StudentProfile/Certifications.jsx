import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Download,
  ExternalLink,
  CheckCircle2,
  BadgeCheck,
  Shield,
  Calendar,
  Hash,
  Medal,
  Star,
  FileCheck,
  Sparkles,
  Eye,
} from "lucide-react";
import { getProfileCertificates } from "../../lib/api";
import logo from "../../assets/logo-bgremove.webp";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleDownloadCertificate = (cert) => {
    const studentName =
      localStorage.getItem("kaumudi_user_name") ||
      `${(localStorage.getItem("kaumudi_user_first_name") || "").trim()} ${(localStorage.getItem("kaumudi_user_last_name") || "").trim()}`.trim() ||
      "Student";

    const studentId = localStorage.getItem("kaumudi_user_id") || "KSA-STUDENT";
    const enrollmentId = cert.enrollmentId || studentId;
    const sanskritName =
      localStorage.getItem("kaumudi_user_name_sanskrit") ||
      localStorage.getItem("kaumudi_user_name_hindi") ||
      "श्रद्धेय छात्र";

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Excellence - ${cert.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(135deg, #1a2a3a 0%, #2c3e50 100%);
            font-family: 'Montserrat', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .certificate-container {
            max-width: 1300px;
            width: 100%;
            background: white;
            border-radius: 24px;
            box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.6);
            overflow: hidden;
            position: relative;
        }

        /* Premium Background Pattern */
        .certificate-bg-pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                linear-gradient(135deg, rgba(198, 156, 109, 0.05) 0%, rgba(139, 30, 30, 0.05) 100%),
                repeating-linear-gradient(45deg, rgba(198, 156, 109, 0.02) 0px, rgba(198, 156, 109, 0.02) 20px, rgba(139, 30, 30, 0.02) 20px, rgba(139, 30, 30, 0.02) 40px);
            pointer-events: none;
        }

        /* Decorative Border */
        .certificate-border {
            position: absolute;
            top: 15px;
            left: 15px;
            right: 15px;
            bottom: 15px;
            border: 1px solid rgba(198, 161, 91, 0.3);
            border-radius: 20px;
            pointer-events: none;
        }

        /* Ornate Corners */
        .ornate-corner {
            position: absolute;
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, transparent 0%, transparent 50%, rgba(198, 161, 91, 0.1) 100%);
            border: 2px solid rgba(198, 161, 91, 0.2);
            z-index: 1;
        }

        .corner-tl {
            top: 10px;
            left: 10px;
            border-right: none;
            border-bottom: none;
            border-top-left-radius: 24px;
            background: linear-gradient(135deg, rgba(198, 161, 91, 0.1) 0%, transparent 50%);
        }

        .corner-tr {
            top: 10px;
            right: 10px;
            border-left: none;
            border-bottom: none;
            border-top-right-radius: 24px;
            background: linear-gradient(225deg, rgba(198, 161, 91, 0.1) 0%, transparent 50%);
        }

        .corner-bl {
            bottom: 10px;
            left: 10px;
            border-right: none;
            border-top: none;
            border-bottom-left-radius: 24px;
            background: linear-gradient(45deg, rgba(198, 161, 91, 0.1) 0%, transparent 50%);
        }

        .corner-br {
            bottom: 10px;
            right: 10px;
            border-left: none;
            border-top: none;
            border-bottom-right-radius: 24px;
            background: linear-gradient(315deg, rgba(198, 161, 91, 0.1) 0%, transparent 50%);
        }

        .certificate-content {
            position: relative;
            padding: 50px 60px;
            z-index: 2;
            background: rgba(255, 255, 255, 0.98);
        }

        /* Decorative Header Line */
        .header-decoration {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            margin-bottom: 20px;
        }

        .decoration-line {
            height: 2px;
            width: 60px;
            background: linear-gradient(90deg, transparent, #C6A15B, transparent);
        }

        .decoration-icon {
            color: #C6A15B;
            font-size: 24px;
            opacity: 0.6;
        }

        /* Logo and Academy Header */
        .certificate-header {
            text-align: center;
            display:flex;
            margin-bottom: 30px;
            position: relative;
        }

        .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30px;
            margin-bottom: 20px;
        }

        .certificate-logo {
            width: 100px;
            height: 100px;
            background: #74271E;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 15px 30px -10px rgba(139, 30, 30, 0.4);
            border: 3px solid #fff;
            outline: 2px solid #C6A15B;
        }

        .certificate-logo img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(255, 255, 255, 0.8);
        }

        .academy-info {
            text-align: left;
        }

        .academy-name {
            font-size: 42px;
            font-family: 'Playfair Display', serif;
            font-weight: 900;
            background: #74271E;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1.1;
            margin-bottom: 5px;
        }

        .academy-subtitle {
            font-size: 16px;
            color: #666;
            font-weight: 400;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .academy-subtitle span {
            color: #C6A15B;
            font-weight: 600;
        }

        .academy-motto {
            font-size: 14px;
            color: #C6A15B;
            font-style: italic;
            margin-top: 5px;
            padding-left: 20px;
            border-left: 3px solid #C6A15B;
        }

        /* Title Section */
        .title-section {
            text-align: center;
            margin: 40px 0 20px;
            position: relative;
        }

        .certificate-title {
            font-size: 56px;
            font-family: 'Playfair Display', serif;
            font-weight: ;
            color: #8B1E1E;
            letter-spacing: 4px;
            margin-bottom: 10px;
            text-transform: uppercase;
            text-shadow: 2px 2px 4px rgba(139, 30, 30, 0.1);
        }

        .title-ornament {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin: 10px 0;
        }

        .ornament {
            font-size: 24px;
            color: #74271E;
            opacity: 0.5;
        }

        .ornament-line {
            height: 2px;
            width: 100px;
            background: linear-gradient(90deg, transparent, #C6A15B, #8B1E1E, #C6A15B, transparent);
        }

        .certificate-subtitle {
            font-size: 18px;
            color: #C6A15B;
            font-weight: 400;
            letter-spacing: 6px;
            text-transform: uppercase;
            font-style: italic;
        }

        /* Main Content */
        .certificate-body {
            text-align: center;
            margin: 40px 0;
        }

        .presented-to {
            font-size: 16px;
            color: #666;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 6px;
            font-weight: 300;
        }

        .student-name {
            font-size: 64px;
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            color: #1a2a3a;
            margin-bottom: 10px;
            line-height: 1.2;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .student-name-sanskrit {
            font-size: 36px;
            color: #C6A15B;
            margin-bottom: 30px;
            font-family: 'Cormorant Garamond', serif;
            font-style: italic;
        }

        .achievement-text {
            font-size: 18px;
            color: #444;
            line-height: 1.8;
            max-width: 900px;
            margin: 0 auto 30px;
            font-weight: 300;
        }

        .course-name {
            font-size: 32px;
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            color: #8B1E1E;
            margin: 20px 0;
            padding: 15px 30px;
            display: inline-block;
            background: linear-gradient(135deg, rgba(198, 161, 91, 0.1) 0%, rgba(139, 30, 30, 0.1) 100%);
            border-radius: 50px;
        }

        /* Premium Grade Badge */
        .grade-badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: #74271E;
            color: white;
            padding: 15px 50px;
            border-radius: 50px;
            font-size: 24px;
            font-weight: 700;
            margin: 30px 0;
            box-shadow: 0 20px 40px -10px rgba(139, 30, 30, 0.4);
            position: relative;
            overflow: hidden;
        }

        .grade-badge::before {
            content: '';
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            background: linear-gradient(45deg, rgba(255,255,255,0.2) 0%, transparent 100%);
            transform: rotate(45deg);
        }

        .badge-star {
            font-size: 28px;
            opacity: 0.8;
        }

        /* Enhanced Details Grid */
        .details-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            margin: 50px 0;
            padding: 40px;
            background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
            border-radius: 20px;
            box-shadow: inset 0 2px 10px rgba(0,0,0,0.03), 0 10px 20px -10px rgba(0,0,0,0.1);
            border: 1px solid rgba(198, 161, 91, 0.2);
        }

        .detail-item {
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            transition: transform 0.3s ease;
        }

        .detail-item:hover {
            transform: translateY(-5px);
        }

        .detail-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            color: #8B1E1E;
            border: 2px solid rgba(198, 161, 91, 0.3);
            font-size: 24px;
        }

        .detail-label {
            font-size: 12px;
            color: #C6A15B;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .detail-value {
            font-size: 18px;
            font-weight: 600;
            color: #1a2a3a;
        }

        /* Premium Footer */
        .certificate-footer {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 50px;
            align-items: center;
            margin-top: 60px;
            padding-top: 40px;
            border-top: 2px solid;
            border-image: linear-gradient(90deg, transparent, #C6A15B, #8B1E1E, #C6A15B, transparent) 1;
        }

        .signature-area {
            text-align: center;
            position: relative;
        }

        .signature-line {
            width: 250px;
            height: 2px;
            background: repeating-linear-gradient(90deg, #8B1E1E 0px, #8B1E1E 10px, transparent 10px, transparent 20px);
            margin: 0 auto 15px;
        }

        .signature-name {
            font-family: 'Playfair Display', serif;
            font-size: 22px;
            font-weight: 600;
            color: #1a2a3a;
            margin-bottom: 5px;
        }

        .signature-title {
            font-size: 13px;
            color: #C6A15B;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 500;
        }

        .seal {
            width: 120px;
            height: 120px;
            background: #74271E;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 56px;
            font-family: 'Playfair Display', serif;
            box-shadow: 0 20px 40px -10px rgba(139, 30, 30, 0.5);
            margin: 0 auto;
            border: 4px solid rgba(255, 255, 255, 0.3);
            outline: 2px solid #C6A15B;
            position: relative;
        }

        .seal::after {
            content: '';
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
        }

        .footer-verse {
            text-align: center;
            font-size: 18px;
            color: #C6A15B;
            font-style: italic;
            margin-top: 40px;
            padding: 20px;
            background: linear-gradient(135deg, rgba(198, 161, 91, 0.05) 0%, rgba(139, 30, 30, 0.05) 100%);
            border-radius: 50px;
            font-family: 'Cormorant Garamond', serif;
        }

        /* Verification Badge */
        .verification-badge {
            position: absolute;
            bottom: 30px;
            right: 30px;
            font-size: 12px;
            color: #999;
            display: flex;
            align-items: center;
            gap: 5px;
            background: rgba(255,255,255,0.9);
            padding: 8px 15px;
            border-radius: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .verification-badge svg {
            width: 14px;
            height: 14px;
            fill: #C6A15B;
        }

        /* Action Buttons - Enhanced */
        .action-buttons {
            position: fixed;
            bottom: 30px;
            right: 30px;
            display: flex;
            gap: 15px;
            z-index: 1000;
        }

        .btn {
            padding: 16px 32px;
            border: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
            transition: all 0.4s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 20px 40px -10px rgba(0,0,0,0.3);
            position: relative;
            overflow: hidden;
        }

        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s ease;
        }

        .btn:hover::before {
            left: 100%;
        }

        .btn-primary {
            background: #74271E;
            color: white;
        }

        .btn-secondary {
            background: white;
            color: #1a2a3a;
            border: 1px solid rgba(198, 161, 91, 0.3);
        }

        .btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 30px 50px -10px rgba(0,0,0,0.5);
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }
            .action-buttons {
                display: none;
            }
            .certificate-container {
                box-shadow: none;
            }
        }

        @media (max-width: 768px) {
            .certificate-content {
                padding: 30px;
            }
            .logo-container {
                flex-direction: column;
                gap: 15px;
            }
            .academy-info {
                text-align: center;
            }
            .academy-motto {
                border-left: none;
                padding-left: 0;
            }
            .student-name {
                font-size: 42px;
            }
            .certificate-title {
                font-size: 36px;
            }
            .title-ornament {
                flex-wrap: wrap;
            }
            .details-grid {
                grid-template-columns: 1fr;
                padding: 20px;
            }
            .certificate-footer {
                grid-template-columns: 1fr;
                gap: 30px;
            }
        }
    </style>
</head>
<body>
    <div class="certificate-container" id="certificate">
        <div class="certificate-bg-pattern"></div>
        
        <!-- Ornate Corners -->
        <div class="ornate-corner corner-tl"></div>
        <div class="ornate-corner corner-tr"></div>
        <div class="ornate-corner corner-bl"></div>
        <div class="ornate-corner corner-br"></div>
        
        <div class="certificate-border"></div>
        
        <div class="certificate-content">
            <!-- Header with Logo -->
            <div class="certificate-header">
                <div class="logo-container">
                    <div class="certificate-logo">
                        <img src="${logo}" alt="Kaumudi Sanskrit Academy">
                    </div>
                    <div class="academy-info">
                        <h1 class="academy-name">KAUMUDI SANSKRIT ACADEMY</h1>
                        <div class="academy-subtitle">
                            <span>✦</span> Established 2026 <span>✦</span>
                        </div>
                        <div class="academy-motto">
                            विद्या ददाति विनयम् • Knowledge Brings Humility
                        </div>
                    </div>
                </div>
            </div>

            <!-- Title Section with Ornaments -->
            <div class="title-section">
                <div class="header-decoration">
                    <div class="decoration-line"></div>
                    <span class="decoration-icon">✦</span>
                    <div class="decoration-line"></div>
                </div>
                
                <h2 class="certificate-title">CERTIFICATE OF EXCELLENCE</h2>
                
                <div class="title-ornament">
                    <span class="ornament">✧</span>
                    <div class="ornament-line"></div>
                    <span class="ornament">प्रमाण-पत्रम्</span>
                    <div class="ornament-line"></div>
                    <span class="ornament">✧</span>
                </div>
            </div>

            <!-- Body -->
            <div class="certificate-body">
                <div class="presented-to">THIS CERTIFICATE IS PROUDLY PRESENTED TO</div>
                
                <div class="student-name">${studentName}</div>
                <div class="student-name-sanskrit">${sanskritName}</div>
                
                <div class="achievement-text">
                    In recognition of outstanding academic achievement and demonstrated mastery in
                </div>
                
                <div class="course-name">${cert.title}</div>
                
                <div class="grade-badge">
                    <span class="badge-star">★</span>
                    GRADE ACHIEVED: ${cert.grade}
                    <span class="badge-star">★</span>
                </div>
                
                <div class="achievement-text">
                    Having successfully completed all course requirements with exceptional merit,<br>
                    demonstrating profound understanding and scholarly excellence in the subject.
                </div>
            </div>

            <!-- Enhanced Details Grid -->
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-icon">📅</div>
                    <div class="detail-label">Issue Date</div>
                    <div class="detail-value">${cert.date}</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-icon">🔖</div>
                    <div class="detail-label">Certificate ID</div>
                    <div class="detail-value">${cert.certificateId.slice(-10).toUpperCase()}</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-icon">🎓</div>
                    <div class="detail-label">Enrollment ID</div>
                    <div class="detail-value">${enrollmentId}</div>
                </div>
            </div>

            <!-- Enhanced Footer -->
            <div class="certificate-footer">
                <div class="signature-area">
                    <div class="signature-line"></div>
                    <div class="signature-title">Academy Director</div>
                </div>
                
                <div class="seal">
                    <span>ॐ</span>
                </div>
                
                <div class="signature-area">
                    <div class="signature-line"></div>
                    <div class="signature-title">Course Instructor</div>
                </div>
            </div>
            
            <div class="footer-verse">
                ॥ विद्या ददाति विनयम् । विनयाद् याति पात्रताम् ॥<br>
                <span style="font-size: 14px; color: #999;">पात्रत्वात् धनमाप्नोति । धनात् धर्मं ततः सुखम् ॥</span>
            </div>

            <!-- Verification Badge -->
            <div class="verification-badge">
                <svg viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Verify at: kaumudiacademy.edu/verify/${cert.certificateId.slice(-6)}
            </div>
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
        <button class="btn btn-secondary" onclick="window.print()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/>
            </svg>
            Print Certificate
        </button>
        <button class="btn btn-primary" onclick="downloadPDF()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Download PDF
        </button>
    </div>

    <script>
        function downloadPDF() {
            const element = document.getElementById('certificate');
            const opt = {
                margin: 0.5,
                filename: 'KSA_Certificate_of_Excellence_${cert.certificateId.slice(-6)}.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true, 
                    logging: false,
                    letterRendering: true,
                    backgroundColor: '#ffffff'
                },
                jsPDF: { 
                    unit: 'in', 
                    format: 'a4', 
                    orientation: 'landscape'
                }
            };
            html2pdf().set(opt).from(element).save();
        }
    </script>
</body>
</html>
    `;

    const w = window.open("", "_blank", "width=1200,height=800");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };

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

  const handlePreview = (cert) => {
    setSelectedCert(cert);
    setShowPreview(true);
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
              sanskritTitle: item?.sanskritTitle || "प्रमाण-पत्रम्",
              date: item?.issuedAt
                ? new Date(item.issuedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—",
              grade: item?.grade || "A+",
              issuer: "Kaumudi Sanskrit Academy",
              type: item?.type || "Course Completion",
              description: item?.description || "Certificate of Excellence",
              enrollmentId: item?.enrollmentId || "",
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#C6A15B]/30 border-t-[#8B1E1E] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-gray-500 animate-pulse">
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      {/* <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-[#8B1E1E]/5 rounded-full">
            <div className="w-1 h-8 bg-[#C6A15B] rounded-full mr-3"></div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#8B1E1E]">
              Academic Credentials
            </h1>
            <div className="w-1 h-8 bg-[#C6A15B] rounded-full ml-3"></div>
          </div>
          <p className="text-sm text-[#74271E] font-medium tracking-widest uppercase">
            Pramana-Patra • प्रमाण-पत्राणि
          </p>
          <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full w-fit mx-auto">
            <Shield size={16} />
            <span className="text-xs font-semibold">
              Blockchain Verified Certificates
            </span>
          </div>
        </div>
      </div> */}

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl shadow-xl p-12 text-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#74271E] rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#74271E] rounded-full -ml-32 -mb-32"></div>

            <div className="relative z-10">
              <div className="w-24 h-24 bg-[#74271E] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Medal size={48} className="text-white" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">
                No Certificates Yet
              </h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Complete your first course to earn a prestigious certificate
                from Kaumudi Sanskrit Academy.
              </p>
              <Link
                to="/allcourses"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#8B1E1E] to-[#C6A15B] text-white font-semibold rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <span>Explore Courses</span>
                <ExternalLink size={18} />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {certificates.map((cert, index) => (
            <div
              key={cert.certificateId}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Premium Border Gradient */}
              <div className="absolute inset-0 bg-[#74271E] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-[2px] bg-white rounded-3xl"></div>

              {/* Decorative Corner Accents */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#C6A15B]/30 rounded-tl-xl"></div>
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#C6A15B]/30 rounded-tr-xl"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#C6A15B]/30 rounded-bl-xl"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#C6A15B]/30 rounded-br-xl"></div>

              {/* Content */}
              <div className="relative p-6 z-10">
                {/* Header with Type Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-[#8B1E1E]/10 to-[#C6A15B]/10 text-[#8B1E1E] text-xs font-bold rounded-full border border-[#C6A15B]/30">
                    {cert.type}
                  </span>
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                    <CheckCircle2 size={14} />
                    <span className="text-xs font-semibold">Verified</span>
                  </div>
                </div>

                {/* Icon and Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-[#74271E] rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <Award size={32} className="text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <Star size={14} className="text-[#C6A15B] fill-current" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-serif font-bold text-gray-800 leading-tight group-hover:text-[#8B1E1E] transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-[#C6A15B] font-medium italic mt-1">
                      {cert.sanskritTitle}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-gradient-to-br group-hover:from-[#8B1E1E]/5 group-hover:to-[#C6A15B]/5 transition-all">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar size={14} className="text-[#C6A15B]" />
                      <span className="text-xs font-medium">Issued</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {cert.date}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-gradient-to-br group-hover:from-[#8B1E1E]/5 group-hover:to-[#C6A15B]/5 transition-all">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Hash size={14} className="text-[#C6A15B]" />
                      <span className="text-xs font-medium">Cert ID</span>
                    </div>
                    <p className="text-xs font-mono font-semibold text-gray-800 truncate">
                      {cert.certificateId.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Grade Badge */}
                <div className="flex items-center justify-between mb-6 p-3 bg-gradient-to-r from-[#8B1E1E]/5 to-[#C6A15B]/5 rounded-xl">
                  <span className="text-sm font-medium text-gray-600">
                    Final Grade
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-serif font-bold text-[#8B1E1E]">
                      {cert.grade}
                    </span>
                    <FileCheck size={20} className="text-emerald-500" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadCertificate(cert)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#74271E] text-white py-3 px-4 rounded-xl font-semibold text-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group/btn"
                  >
                    <Download
                      size={18}
                      className="group-hover/btn:animate-bounce"
                    />
                    <span>Download</span>
                  </button>
                  {/* <button
                    onClick={() => verifyCertificate(cert.certificateId)}
                    className="p-3 border-2 border-[#C6A15B]/30 text-[#C6A15B] rounded-xl hover:bg-[#C6A15B]/10 hover:border-[#C6A15B] transition-all duration-300"
                    title="Verify Certificate"
                  >
                    <Shield size={18} />
                  </button>
                  <button
                    onClick={() => handlePreview(cert)}
                    className="p-3 border-2 border-gray-200 text-gray-400 rounded-xl hover:border-[#C6A15B] hover:text-[#C6A15B] transition-all duration-300"
                    title="Preview Certificate"
                  >
                    <Eye size={18} />
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Preview Modal */}
      {showPreview && selectedCert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-3xl">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#8B1E1E]">
                  Certificate Preview
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedCert.certificateId}
                </p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content - Simplified Preview */}
            <div className="p-6">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-dashed border-[#C6A15B]/30">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#8B1E1E] to-[#C6A15B] rounded-full flex items-center justify-center">
                    <img
                      src={logo}
                      alt="Logo"
                      className="w-16 h-16 rounded-full"
                    />
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-[#8B1E1E]">
                    {selectedCert.title}
                  </h4>
                  <p className="text-gray-600">
                    Presented to our esteemed student with grade{" "}
                    {selectedCert.grade}
                  </p>
                  <p className="text-sm text-gray-500">
                    Issued on {selectedCert.date}
                  </p>
                  <div className="flex justify-center gap-4 pt-4">
                    <button
                      onClick={() => {
                        handleDownloadCertificate(selectedCert);
                        setShowPreview(false);
                      }}
                      className="px-6 py-3 bg-[#74271E] text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                    >
                      Download Full Certificate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
