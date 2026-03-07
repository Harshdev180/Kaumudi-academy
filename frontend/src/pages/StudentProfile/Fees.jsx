import React, { useState, useCallback } from "react";
import {
  Download,
  History,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Coins,
  IndianRupee,
  Calendar,
  ShieldCheck,
  Landmark,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Hash,
} from "lucide-react";
import { useEffect } from "react";
import {
  getProfileEnrollments,
  getProfileMe,
  createPaymentOrder,
  verifyPayment,
  createEmiInstallment,
  verifyEmiInstallment,
} from "../../lib/api";
import logo from "../../assets/logo-bgremove.webp";

const FeePurchase = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentEnrollmentId, setStudentEnrollmentId] = useState("");
  const [studentPhone, setStudentPhone] = useState("");

  const loadFees = useCallback(async () => {
    try {
      // Add cache-busting timestamp
      const res = await getProfileEnrollments();
      
      // Also fetch profile to get student's enrollment ID and phone
      let enrollmentId = "";
      let studentPhone = "";
      try {
        const profileRes = await getProfileMe();
        if (profileRes.data?.enrollmentId) {
          enrollmentId = profileRes.data.enrollmentId;
          setStudentEnrollmentId(enrollmentId);
        }
        // Get phone from profile
        if (profileRes.data?.phone || profileRes.data?.phoneNumber) {
          studentPhone = profileRes.data.phone || profileRes.data.phoneNumber;
          setStudentPhone(studentPhone);
        }
      } catch (profileErr) {
        console.log("Could not fetch profile for enrollment ID:", profileErr);
      }

      console.log("Enrollment response:", res);
      console.log("Enrollment data:", res.data);

      // adjust if your backend structure differs abc
      const formatted = res.data.map((item) => {
        // Get payment info from enrollment
        const payment = item.payment || {};

        // Get course - it could be an object with _id or just an ObjectId
        const courseData = item.course;
        const courseId = courseData?._id || courseData;

        // Get original amount and discount
        const originalAmount = Number(payment.originalAmount) || 0;
        const discountAmount = Number(payment.discountAmount) || 0;
        const paidAmount = Number(payment.finalAmount) || 0;
        let paymentMode = payment.paymentMode || "FULL";
        const couponCode = payment.couponCode || null;

        // Calculate discounted total (original - discount)
        const discountedTotal = originalAmount - discountAmount;

        // For EMI, remaining is the rest of the installments (70% remaining)
        // For FULL, remaining is discountedTotal - paidAmount
        let remaining = 0;
        let isPaid = false;

        // Detect EMI by payment pattern: if paidAmount is ~30% of discountedTotal, treat as EMI
        // This handles cases where paymentMode was saved incorrectly as "FULL"
        const paidPercentage =
          discountedTotal > 0 ? (paidAmount / discountedTotal) * 100 : 0;
        const isEmiPattern = paidPercentage > 0 && paidPercentage < 50; // Paid less than 50% suggests EMI

        if (paymentMode === "EMI" || isEmiPattern) {
          // For EMI, remaining is the remaining amount after first payment
          paymentMode = "EMI"; // Force EMI mode for display
          remaining = discountedTotal - paidAmount;
          // console.log("EMI calculation:", { discountedTotal, paidAmount, remaining, paidPercentage });
          // Only fully paid if remaining is 0 or negative
          isPaid = remaining <= 0;
        } else {
          // For FULL payment
          remaining = discountedTotal - paidAmount;
          isPaid = remaining <= 0;
        }

        return {
          id: item._id,
          courseId: courseId,
          course: courseData,
          date: new Date(item.createdAt).toLocaleDateString(),
          desc: courseData?.title || "Course",
          type: courseData?.category || "Academic",
          // Total includes processing fee (discountedTotal + 99)
          totalAmount: discountedTotal + 99,
          paidAmount: paidAmount,
          // Remaining is course amount without processing fee
          remaining: Math.max(discountedTotal - paidAmount, 0),
          // Add payment mode and coupon info
          paymentMode: paymentMode,
          couponCode: couponCode,
          discountAmount: discountAmount,
          originalAmount: originalAmount,
          isPaid: isPaid,
          // Add payment ID for Receipt No. column
          paymentId: payment._id || payment.id || null,
          // Add enrollment ID for receipt - use student's fixed enrollment ID
          enrollmentId: enrollmentId || (item._id 
            ? `KSA-${new Date(item.createdAt).getFullYear()}-${String(item._id).slice(-6).toUpperCase()}` 
            : '-'),
          // Store the raw enrollment ID
          rawEnrollmentId: item._id,
        };
      });

      setPaymentHistory(formatted);
    } catch (err) {
      console.error("Failed to load fee data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFees();
  }, [loadFees]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFees();
  };

  const totalFee = paymentHistory.reduce(
    (sum, item) => {
      // Total enrollment = discounted course price + processing fee (99)
      // item.totalAmount already includes processing fee
      return sum + item.totalAmount;
    },
    0,
  );

  const totalPaid = paymentHistory.reduce(
    (sum, item) => {
      // Paid amount includes processing fee (99) if payment was made
      const processingFee = item.paidAmount > 0 ? 99 : 0;
      return sum + item.paidAmount + processingFee;
    },
    0,
  );

  const totalPending = totalFee - totalPaid;

  const feeSummary = [
    {
      label: "Total Enrollment",
      amount: totalFee.toLocaleString(),
      icon: <IndianRupee size={22} />,
      gradient: "from-amber-500 to-amber-600",
    },
    {
      label: "Paid Amount",
      amount: totalPaid.toLocaleString(),
      icon: <CheckCircle2 size={22} />,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Pending Amount",
      amount: totalPending.toLocaleString(),
      icon: <AlertCircle size={22} />,
      gradient: "from-rose-500 to-rose-600",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(paymentHistory.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = paymentHistory.slice(indexOfFirstRow, indexOfLastRow);

  const loadRazorpay = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay && typeof window.Razorpay === "function") {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        if (window.Razorpay && typeof window.Razorpay === "function") {
          resolve();
        } else {
          reject(new Error("Razorpay failed to initialize"));
        }
      };
      script.onerror = () =>
        reject(new Error("Failed to load Razorpay script"));
      document.head.appendChild(script);
    });
  };

  const handlePayment = async (item, evt) => {
    if (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }

    try {
      let courseId = item.courseId;

      if (
        !courseId &&
        typeof item.course === "object" &&
        item.course !== null
      ) {
        courseId = item.course._id;
      } else if (!courseId && item.course) {
        courseId = item.course;
      }

      if (!courseId) {
        alert("Course ID not found.");
        return;
      }

      const paymentMode = item.paymentMode === "EMI" ? "EMI" : "FULL";

      try {
        await loadRazorpay();
      } catch (err) {
        console.error("Failed to load Razorpay:", err);
        alert("Failed to load payment system. Please refresh and try again.");
        return;
      }

      let orderResponse;

      if (paymentMode === "EMI") {
        console.log("Creating EMI installment order for course:", courseId);
        orderResponse = await createEmiInstallment({
          courseId: courseId,
        });

        console.log("EMI installment response:", orderResponse);

        if (!orderResponse.success) {
          alert(
            orderResponse.message || "Failed to create EMI installment order",
          );
          return;
        }
      } else {
        orderResponse = await createPaymentOrder({
          courseId: courseId,
          paymentMode: paymentMode,
        });

        if (!orderResponse.success) {
          alert(orderResponse.message || "Failed to create payment order");
          return;
        }
      }

      const userFirstName =
        localStorage.getItem("kaumudi_user_first_name") || "";
      const userLastName = localStorage.getItem("kaumudi_user_last_name") || "";
      const userEmail = localStorage.getItem("kaumudi_user_email") || "";

      console.log("Creating Razorpay with amount:", orderResponse.amount);

      const razorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.amount,
        currency: "INR",
        order_id: orderResponse.orderId,
        name: "Kaumudi Trust",
        description:
          paymentMode === "EMI"
            ? `EMI Installment for ${item.desc}`
            : `Payment for ${item.desc}`,
        handler: async function (response) {
          try {
            let verifyResponse;

            if (paymentMode === "EMI") {
              verifyResponse = await verifyEmiInstallment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                paymentId: orderResponse.paymentId,
              });
            } else {
              verifyResponse = await verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
            }

            if (verifyResponse.success) {
              alert(
                paymentMode === "EMI"
                  ? "EMI installment payment successful!"
                  : "Payment successful!",
              );
              // Force complete page reload with cache bypass
              window.location.reload();
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification error.");
          }
        },
        prefill: {
          name: `${userFirstName} ${userLastName}`.trim(),
          email: userEmail,
          contact: "",
        },
        theme: { color: "#74271E" },
      };

      console.log("Razorpay options:", razorpayOptions);

      try {
        const RazorpayConstructor = window.Razorpay;
        console.log("Razorpay constructor:", typeof RazorpayConstructor);

        if (!RazorpayConstructor) {
          throw new Error("Razorpay not available");
        }

        const rzp = new RazorpayConstructor(razorpayOptions);
        rzp.open();
      } catch (openError) {
        console.error("Error opening Razorpay:", openError);
        alert("Failed to open payment window. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed: " + (err.message || "Unknown error"));
    }

    return false;
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const formatINR = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

  const handleDownloadReceipt = (item) => {
    const remaining = item.remaining || 0;
    const status =
      remaining <= 0
        ? "Paid"
        : item.paymentMode === "EMI"
          ? "Partial"
          : "Pending";

    // Get user details from localStorage
    const studentName =
      localStorage.getItem("kaumudi_user_name") ||
      `${(localStorage.getItem("kaumudi_user_first_name") || "").trim()} ${(localStorage.getItem("kaumudi_user_last_name") || "").trim()}`.trim() ||
      "Student";
    const studentEmail = localStorage.getItem("kaumudi_user_email") || "";
    const studentId = localStorage.getItem("kaumudi_user_id") || "";
    // Use studentPhone from state (fetched from profile), fallback to localStorage
    const phone = studentPhone || 
      localStorage.getItem("kaumudi_user_phone") ||
      localStorage.getItem("kaumudi_user_whatsapp") ||
      "-";
    const studentAddress =
      localStorage.getItem("kaumudi_user_address") || "Not Provided";

    // Calculate financial details
    const basePrice = item.originalAmount || 0;
    const discount = item.discountAmount || 0;
    const discountPercentage =
      basePrice > 0 ? Math.round((discount / basePrice) * 100) : 0;
    const processingFee = 99;
    const subtotalAfterDiscount = basePrice - discount;
    const taxableAmount = subtotalAfterDiscount + processingFee;
    // const gstAmount = Math.round(taxableAmount * 0.18);
    const netTotal = taxableAmount;

    // Get current timestamp
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const dateString = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Academic Receipt - ${item.paymentId ? item.paymentId.slice(-6) : item.academicReceiptNumber || "—"}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <style>
        @page {
            size: A4;
            margin: 0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: #f3f4f6;
            margin: 0;
            padding: 20px;
        }

        .receipt-container {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            padding: 15mm;
            position: relative;
            box-sizing: border-box;
        }

        .receipt {
            background: white;
            border: 1px solid #e8dfd0;
            position: relative;
            min-height: 100%;
            display: flex;
            flex-direction: column;
        }

        /* Academic Header Strip */
        .academic-strip {
            background: linear-gradient(135deg, #74271E 0%, #8B3D2F 50%, #C9A050 100%);
            height: 6px;
            width: 100%;
        }

        /* Main Header */
        .receipt-header {
            padding: 30px 40px 20px;
            border-bottom: 2px solid #f0e9dc;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
        }

        .institution-info {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .institution-logo {
            width: 80px;
            height: 80px;
            background: #faf7f2;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #C9A050;
            overflow: hidden;
        }

        .institution-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            background: #74271E;
        }

        .institution-text h1 {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 800;
            color: #74271E;
            margin-bottom: 2px;
            letter-spacing: -0.3px;
        }

        .institution-text p {
            font-size: 12px;
            color: #8c7a56;
            font-weight: 600;
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }

        .receipt-title-section {
            text-align: right;
        }

        .receipt-title {
            background: #74271E;
            color: white;
            padding: 6px 16px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 1px;
            display: inline-block;
        }

        .receipt-number {
            margin-top: 8px;
            font-size: 11px;
            color: #4b5563;
            font-weight: 600;
        }

        .receipt-number span {
            color: #74271E;
            font-weight: 700;
            font-family: monospace;
            font-size: 13px;
            margin-left: 4px;
        }

        /* Watermark */
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            font-weight: 900;
            color: rgba(201, 160, 80, 0.05);
            white-space: nowrap;
            font-family: 'Playfair Display', serif;
            pointer-events: none;
            z-index: 0;
        }

        /* Content Sections */
        .receipt-content {
            padding: 30px 40px;
            position: relative;
            z-index: 1;
            flex-grow: 1;
        }

        /* Info Grid */
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 25px;
        }

        .info-card {
            background: #faf7f2;
            border-radius: 12px;
            padding: 15px;
            border: 1px solid #e8dfd0;
        }

        .info-label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #8c7a56;
            margin-bottom: 4px;
        }

        .info-value {
            font-size: 14px;
            font-weight: 700;
            color: #1f2937;
        }

        .info-sub {
            font-size: 12px;
            color: #6b7280;
            margin-top: 2px;
        }

        /* Academic Details */
        .academic-details {
            background: #fff;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            border: 1px solid #e8dfd0;
        }

        .section-title {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 15px;
            font-size: 13px;
            font-weight: 700;
            color: #74271E;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            border-bottom: 1px solid #f0e9dc;
            padding-bottom: 8px;
        }

        .course-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }

        .course-item {
            display: flex;
            flex-direction: column;
        }

        .course-label {
            font-size: 10px;
            font-weight: 600;
            color: #8c7a56;
            text-transform: uppercase;
        }

        .course-value {
            font-size: 14px;
            font-weight: 700;
            color: #1f2937;
        }

        /* Transaction Table */
        .transaction-table {
            width: 100%;
            margin-bottom: 25px;
            border-collapse: collapse;
        }

        .transaction-table th {
            text-align: left;
            padding: 12px;
            background: #74271E;
            color: white;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .transaction-table td {
            padding: 12px;
            border-bottom: 1px solid #e8dfd0;
            font-size: 13px;
        }

        /* Fee Breakdown */
        .fee-breakdown {
            margin-bottom: 25px;
        }

        .breakdown-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #e8dfd0;
        }

        .breakdown-label {
            font-size: 13px;
            color: #4b5563;
        }

        .breakdown-value {
            font-weight: 600;
            color: #1f2937;
        }

        .total-row {
            margin-top: 10px;
            padding: 12px 0;
            border-top: 2px solid #74271E;
            border-bottom: 2px solid #74271E;
            font-weight: 800;
            font-size: 16px;
            color: #74271E;
        }

        /* Payment Summary */
        .payment-summary {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }

        .summary-card {
            padding: 15px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid #e8dfd0;
        }

        .summary-card.paid { background: #f0fdf4; border-color: #bbf7d0; }
        .summary-card.due { background: #fff7ed; border-color: #fed7aa; }

        .summary-amount { font-size: 20px; font-weight: 800; color: #1f2937; }
        .summary-label { font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; }

        /* Footer */
        .receipt-footer {
            padding: 30px 40px;
            border-top: 1px solid #f0e9dc;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
        }

        .signature-area {
            text-align: center;
        }

        .signature-line {
            width: 100%;
            height: 1px;
            background: #1f2937;
            margin: 40px auto 10px;
        }

        .signature-text {
            font-size: 12px;
            font-weight: 700;
            color: #4b5563;
            text-transform: uppercase;
        }

        .footer-note {
            font-size: 10px;
            color: #6b7280;
            line-height: 1.5;
        }

        /* Action Buttons */
        .action-buttons {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 15px;
            z-index: 100;
        }

        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .btn-primary { background: #74271E; color: white; }
        .btn-secondary { background: #C9A050; color: white; }

        @media print {
            body { background: white; padding: 0; }
            .receipt-container { margin: 0; border: none; box-shadow: none; width: 210mm; height: 297mm; }
            .action-buttons { display: none !important; }
            .receipt { border: none; }
            .receipt-header, .academic-details, .fee-breakdown, .payment-summary, .receipt-footer {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="receipt-container" id="receipt-container">
        <div class="receipt" id="receipt">
            <div class="academic-strip"></div>
            
            <div class="receipt-header">
                <div class="institution-info">
                    <div class="institution-logo">
                        <img src="${logo}" alt="Kaumudi Logo" />
                    </div>
                    <div class="institution-text">
                        <h1>Kaumudi Sanskrit Academy</h1>
                        <p>Education for Excellence</p>
                    </div>
                </div>
                
                <div class="receipt-title-section">
                    <div class="receipt-title">ACADEMIC RECEIPT</div>
                    <div class="receipt-number">
                        Receipt No: <span>${item.paymentId ? item.paymentId.slice(-6) : item.academicReceiptNumber || "—"}</span>
                    </div>
                </div>
                
                <div class="watermark">KAUMUDI ACADEMY</div>
            </div>
            
            <div class="receipt-content">
                <div class="info-grid">
                    <div class="info-card">
                        <div class="info-label">Student Name</div>
                        <div class="info-value">${studentName}</div>
                    </div>
                    
                    <div class="info-card">
                        <div class="info-label">Contact Details</div>
                        <div class="info-value">${phone}</div>
                        <div class="info-sub">${studentEmail}</div>
                    </div>
                </div>
                
                <div class="academic-details">
                    <div class="section-title">Academic Information</div>
                    <div class="course-details">
                        <div class="course-item">
                            <span class="course-label">Course Enrolled</span>
                            <span class="course-value">${item.desc}</span>
                        </div>
                        <div class="course-item">
                            <span class="course-label">Enrollment ID</span>
                            <span class="course-value">${item.enrollmentId}</span>
                        </div>
                        <div class="course-item">
                            <span class="course-label">Payment Mode</span>
                            <span class="course-value">${item.paymentMode}</span>
                        </div>
                        <div class="course-item">
                            <span class="course-label">Course Category</span>
                            <span class="course-value">${item.type}</span>
                        </div>
                    </div>
                </div>
                
                <table class="transaction-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th style="text-align: right;">Original</th>
                            <th style="text-align: right;">Discount</th>
                            <th style="text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="font-weight: 700;">${item.desc}</td>
                            <td style="text-align: right;">${formatINR(basePrice)}</td>
                            <td style="text-align: right; color: #16a34a;">${discount > 0 ? "-" + formatINR(discount) : "—"}</td>
                            <td style="text-align: right; font-weight: 700;">${formatINR(item.totalAmount)}</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="fee-breakdown">
                    <div class="section-title">Fee Breakdown</div>
                    <div class="breakdown-row">
                        <span class="breakdown-label">Net Course Fee</span>
                        <span class="breakdown-value">${formatINR(subtotalAfterDiscount)}</span>
                    </div>
                    <div class="breakdown-row">
                        <span class="breakdown-label">Processing Fee</span>
                        <span class="breakdown-value">${formatINR(processingFee)}</span>
                    </div>
                    
                    <div class="breakdown-row total-row">
                        <span class="breakdown-label">Total Amount Paid</span>
                        <span class="breakdown-value">${formatINR(netTotal)}</span>
                    </div>
                </div>
                
                <div class="payment-summary">
                    <div class="summary-card paid">
                        <div class="summary-amount">${formatINR(item.paidAmount > 0 ? item.paidAmount + 99 : 0)}</div>
                        <div class="summary-label">Amount Paid</div>
                    </div>
                    
                    <div class="summary-card due">
                        <div class="summary-amount">${formatINR(remaining)}</div>
                        <div class="summary-label">Balance Due</div>
                    </div>
                </div>
            </div>

            <div class="receipt-footer">
                <div class="footer-note">
                    <p><strong>Generation Date:</strong> ${dateString}</p>
                    <p><strong>Generation Time:</strong> ${timeString}</p>
                    <p><strong>Transaction ID:</strong> ${item.id.slice(-12).toUpperCase()}</p>
                    <p style="margin-top: 10px;">* This is a computer generated receipt and does not require a physical signature.</p>
                </div>
                
                <div class="signature-area">
                    <div class="signature-line"></div>
                    <div class="signature-text">Authorized Signatory</div>
                    <div style="font-size: 11px; color: #74271E; font-weight: 800; margin-top: 5px;">KAUMUDI SANSKRIT ACADEMY</div>
                </div>
            </div>
        </div>
        
        <div class="action-buttons">
            <button class="btn btn-primary" onclick="window.print()">
                Print Receipt
            </button>
            <button class="btn btn-secondary" onclick="downloadPDF()">
                Download PDF
            </button>
        </div>
    </div>

    <script>
        function downloadPDF() {
            const element = document.getElementById('receipt-container');
            const opt = {
                margin: 0,
                filename: 'Kaumudi_Receipt_${item.paymentId ? item.paymentId.slice(-6) : "Receipt"}.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true, 
                    logging: false,
                    letterRendering: true
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait' 
                }
            };
            html2pdf().set(opt).from(element).save();
        }
    </script>
</body>
</html>
`;

    const w = window.open("", "PRINT", "height=700,width=900");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#74271E] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">
            Loading your fee details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 mt-8 px-4 sm:px-6 lg:px-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-[#74271E] to-[#8b3d32] p-8 rounded-3xl text-white">
        <div>
          <h2 className="text-4xl font-bold font-serif mb-2">Fee Ledger</h2>
          <p className="text-[#c9a050] text-sm font-medium flex items-center gap-2">
            <ShieldCheck size={16} />
            Track and manage all your academic payments in one place
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl">
          <Wallet size={20} className="text-[#c9a050]" />
          <span className="font-semibold">
            Total Transactions: {paymentHistory.length}
          </span>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {feeSummary.map((item, idx) => (
          <div
            key={idx}
            className="group relative bg-white rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border border-gray-100"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
            />

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#74271E] via-[#c9a050] to-[#74271E] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#74271E]/10 to-[#c9a050]/10 flex items-center justify-center text-[#74271E] group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {item.label}
                </span>
              </div>

              <h4 className="text-3xl font-bold text-[#74271E] mb-2">
                ₹ {item.amount}
              </h4>

              <div className="h-1 w-12 bg-gradient-to-r from-[#74271E] to-[#c9a050] rounded-full group-hover:w-20 transition-all duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* PAYMENT HISTORY TABLE */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-[#74271E]/10 border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#74271E]/10 flex items-center justify-center">
                <History className="text-[#74271E]" size={20} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">
                  Transaction History
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Complete record of your payments and enrollments
                </p>
              </div>
            </div>

            <div>
              {/* <span className="text-xs font-semibold bg-[#74271E]/10 text-[#74271E] px-4 py-2 rounded-lg">
                {paymentHistory.length} Records
              </span> */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#74271E] bg-white border border-[#e8dfd0] rounded-full hover:bg-[#faf7f2] transition disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full table-fixed text-sm">
            {/* Header */}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-500 uppercase tracking-wider text-xs">
                <th className="w-[140px] px-6 py-4 text-left font-semibold">
                  Date
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  Description
                </th>

                <th className="w-[170px] px-6 py-4 text-left font-semibold">
                  Receipt No.
                </th>

                <th className="w-[130px] px-6 py-4 text-left font-semibold">
                  Total
                </th>

                <th className="w-[140px] px-6 py-4 text-left font-semibold">
                  Remaining
                </th>

                <th className="w-[140px] px-6 py-4 text-center font-semibold">
                  Status
                </th>

                <th className="w-[200px] px-6 py-4 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100">
              {currentRows.map((item) => {
                const isPaid = item.isPaid;
                const remaining = item.remaining || 0;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#74271E]/5 transition-colors duration-200"
                  >
                    {/* Date */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <Calendar size={14} className="text-gray-400" />
                        {item.date}
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-800">
                          {item.desc}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            {item.type}
                          </span>

                          {item.paymentMode === "EMI" && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                              <Wallet size={10} />
                              EMI
                            </span>
                          )}

                          {item.couponCode && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                              {item.couponCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Receipt */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-600 font-mono text-xs">
                        <Hash size={12} className="text-[#c9a050]" />
                        {item.paymentId
                          ? item.paymentId.slice(-6)
                          : item.academicReceiptNumber || "—"}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-6 py-5">
                      <span className="font-bold text-[#74271E] text-base">
                        {formatINR(item.totalAmount)}
                      </span>
                    </td>

                    {/* Remaining */}
                    <td className="px-6 py-5">
                      {remaining > 0 ? (
                        <span className="font-semibold text-amber-600">
                          {formatINR(remaining)}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <CheckCircle2 size={14} />
                          Cleared
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5 text-center">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">
                          <CheckCircle2 size={12} />
                          Paid
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handlePayment(item, e);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#74271E] to-[#8b3d32] rounded-lg hover:shadow-md hover:scale-105 transition-all"
                        >
                          <Wallet size={12} />
                          Pay Now
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleDownloadReceipt(item)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-gray-200 text-gray-600 rounded-lg hover:border-[#74271E] hover:text-[#74271E] hover:bg-[#74271E]/5 transition"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100 bg-gray-50/50">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {indexOfFirstRow + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-700">
                {Math.min(indexOfLastRow, paymentHistory.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {paymentHistory.length}
              </span>{" "}
              entries
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-[#74271E] hover:text-[#74271E] hover:bg-white transition-all duration-300 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-300 ${
                      currentPage === i + 1
                        ? "bg-[#74271E] text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-[#74271E] hover:text-[#74271E] hover:bg-white transition-all duration-300 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeePurchase;
