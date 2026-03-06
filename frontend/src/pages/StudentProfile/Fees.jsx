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

  const loadFees = useCallback(async () => {
    try {
      // Add cache-busting timestamp
      const res = await getProfileEnrollments();

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
          // Show discounted total instead of original
          totalAmount: discountedTotal,
          paidAmount: paidAmount,
          remaining: Math.max(remaining, 0),
          // Add payment mode and coupon info
          paymentMode: paymentMode,
          couponCode: couponCode,
          discountAmount: discountAmount,
          originalAmount: originalAmount,
          isPaid: isPaid,
          // Add payment ID for Receipt No. column
          paymentId: payment._id || payment.id || null,
          // Add enrollment ID for receipt
          enrollmentId: item._id,
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
    (sum, item) => sum + item.totalAmount,
    0,
  );

  const totalPaid = paymentHistory.reduce(
    (sum, item) => sum + item.paidAmount,
    0,
  );

  const totalPending = paymentHistory.reduce(
    (sum, item) => sum + (item.remaining || 0),
    0,
  );

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
    const studentPhone =
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
    const preTaxTotal = subtotalAfterDiscount + processingFee;
    const gstAmount = Math.round((preTaxTotal * 18) / 100);
    const netTotal = preTaxTotal + gstAmount;

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
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: #f3f4f6;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .receipt-container {
            max-width: 900px;
            width: 100%;
            margin: 0 auto;
        }

        .receipt {
            background: white;
            border-radius: 32px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            overflow: hidden;
            position: relative;
        }

        /* Academic Header Strip */
        .academic-strip {
            background: linear-gradient(135deg, #74271E 0%, #8B3D2F 50%, #C9A050 100%);
            height: 8px;
            width: 100%;
        }

        /* Main Header */
        .receipt-header {
            padding: 30px 40px 20px;
            border-bottom: 2px solid #f0e9dc;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            position: relative;
        }

        .institution-info {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .institution-logo {
            width: 90px;
            height: 90px;
            background: #faf7f2;
            border-radius: 20px;
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
        }

        .institution-text h1 {
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            font-weight: 800;
            background: linear-gradient(135deg, #74271E 0%, #C9A050 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 5px;
            letter-spacing: -0.5px;
        }

        .institution-text p {
            font-size: 14px;
            color: #8c7a56;
            font-weight: 500;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .sanskrit-motto {
            font-family: 'Playfair Display', serif;
            font-size: 18px;
            color: #C9A050;
            font-weight: 700;
            margin-top: 5px;
        }

        .receipt-title-section {
            text-align: right;
        }

        .receipt-title {
            background: linear-gradient(135deg, #74271E 0%, #8B3D2F 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: 800;
            font-size: 24px;
            letter-spacing: 2px;
            display: inline-block;
            box-shadow: 0 10px 20px -5px rgba(116, 39, 30, 0.3);
        }

        .receipt-number {
            margin-top: 15px;
            font-size: 14px;
            color: #4b5563;
            background: #f3f4f6;
            padding: 8px 20px;
            border-radius: 30px;
            display: inline-block;
            font-weight: 600;
        }

        .receipt-number span {
            color: #74271E;
            font-weight: 700;
            font-family: monospace;
            font-size: 16px;
            margin-left: 8px;
        }

        /* Watermark */
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            font-weight: 900;
            color: rgba(201, 160, 80, 0.03);
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
        }

        /* Info Grid */
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }

        .info-card {
            background: #faf7f2;
            border-radius: 20px;
            padding: 20px;
            border: 1px solid #e8dfd0;
            transition: all 0.3s ease;
        }

        .info-card:hover {
            border-color: #C9A050;
            box-shadow: 0 10px 25px -5px rgba(201, 160, 80, 0.2);
        }

        .info-icon {
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #74271E;
            margin-bottom: 15px;
            border: 1px solid #e8dfd0;
        }

        .info-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #8c7a56;
            margin-bottom: 5px;
        }

        .info-value {
            font-size: 16px;
            font-weight: 700;
            color: #1f2937;
            line-height: 1.4;
        }

        .info-sub {
            font-size: 13px;
            color: #6b7280;
            margin-top: 5px;
        }

        /* Academic Details Section */
        .academic-details {
            background: linear-gradient(135deg, #f8f4ee 0%, #faf7f2 100%);
            border-radius: 24px;
            padding: 25px;
            margin-bottom: 30px;
            border: 1px solid #e8dfd0;
        }

        .section-title {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            font-size: 16px;
            font-weight: 700;
            color: #74271E;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .section-title svg {
            width: 20px;
            height: 20px;
        }

        .course-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .course-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .course-label {
            font-size: 12px;
            font-weight: 600;
            color: #8c7a56;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .course-value {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
        }

        .course-badge {
            display: inline-block;
            padding: 4px 12px;
            background: #74271E;
            color: #C9A050;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-left: 10px;
        }

        /* Transaction Table */
        .transaction-table {
            width: 100%;
            margin-bottom: 30px;
            border-collapse: collapse;
        }

        .transaction-table th {
            text-align: left;
            padding: 15px;
            background: #74271E;
            color: #C9A050;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .transaction-table th:first-child {
            border-radius: 12px 0 0 12px;
        }

        .transaction-table th:last-child {
            border-radius: 0 12px 12px 0;
        }

        .transaction-table td {
            padding: 15px;
            border-bottom: 1px solid #e8dfd0;
            font-size: 15px;
        }

        .transaction-table tr:last-child td {
            border-bottom: none;
        }

        .course-name {
            font-weight: 700;
            color: #74271E;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 6px 15px;
            border-radius: 30px;
            font-size: 12px;
            font-weight: 700;
        }

        .status-paid {
            background: #ecf7f1;
            color: #16a34a;
            border: 1px solid #16a34a;
        }

        .status-partial {
            background: #fff7ed;
            color: #c2410c;
            border: 1px solid #c2410c;
        }

        .status-pending {
            background: #fee2e2;
            color: #dc2626;
            border: 1px solid #dc2626;
        }

        /* Fee Breakdown */
        .fee-breakdown {
            background: #faf7f2;
            border-radius: 24px;
            padding: 25px;
            margin-bottom: 30px;
            border: 1px solid #e8dfd0;
        }

        .breakdown-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px dashed #d4c5b0;
        }

        .breakdown-row:last-child {
            border-bottom: none;
        }

        .breakdown-label {
            font-size: 14px;
            color: #4b5563;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .breakdown-value {
            font-weight: 600;
            color: #1f2937;
        }

        .discount-value {
            color: #16a34a;
            font-weight: 700;
        }

        .total-row {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #74271E;
            font-weight: 800;
            font-size: 18px;
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
            background: white;
            border: 1px solid #e8dfd0;
            border-radius: 20px;
            padding: 20px;
            text-align: center;
        }

        .summary-card.paid {
            background: linear-gradient(135deg, #ecf7f1 0%, #d9f0e3 100%);
            border-color: #16a34a;
        }

        .summary-card.due {
            background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
            border-color: #c2410c;
        }

        .summary-amount {
            font-size: 28px;
            font-weight: 800;
            margin: 10px 0 5px;
        }

        .summary-label {
            font-size: 13px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Footer */
        .receipt-footer {
            margin-top: 40px;
            padding-top: 25px;
            border-top: 2px solid #C9A050;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
        }

        .signature-area {
            text-align: center;
        }

        .signature-line {
            width: 200px;
            height: 1px;
            background: #1f2937;
            margin: 10px auto 15px;
        }

        .signature-text {
            font-size: 13px;
            font-weight: 600;
            color: #4b5563;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .stamp {
            margin-top: 15px;
            color: #74271E;
            font-weight: 800;
            font-size: 14px;
            opacity: 0.7;
        }

        .footer-note {
            text-align: right;
            font-size: 12px;
            color: #6b7280;
        }

        .footer-note p {
            margin: 5px 0;
        }

        .verification-code {
            font-family: monospace;
            background: #f3f4f6;
            padding: 5px 10px;
            border-radius: 8px;
            font-size: 12px;
            color: #74271E;
            display: inline-block;
            margin-top: 10px;
        }

        /* Print and Download Buttons */
        .action-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
            padding: 20px;
        }

        .btn {
            padding: 14px 30px;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s ease;
        }

        .btn-primary {
            background: #74271E;
            color: white;
            box-shadow: 0 8px 16px rgba(116, 39, 30, 0.2);
        }

        .btn-primary:hover {
            background: #5c1f17;
            transform: translateY(-2px);
            box-shadow: 0 12px 24px rgba(116, 39, 30, 0.3);
        }

        .btn-secondary {
            background: #C9A050;
            color: white;
            box-shadow: 0 8px 16px rgba(201, 160, 80, 0.2);
        }

        .btn-secondary:hover {
            background: #b08a40;
            transform: translateY(-2px);
            box-shadow: 0 12px 24px rgba(201, 160, 80, 0.3);
        }

        /* Print Styles */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .receipt {
                box-shadow: none;
                border: 1px solid #e5e7eb;
            }
            
            .action-buttons {
                display: none;
            }
            
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="receipt" id="receipt">
            <div class="academic-strip"></div>
            
            <div class="receipt-header">
                <div class="institution-info">
                    <div class="institution-logo">
                        <img src="${logo}" alt="Kaumudi Logo" />
                    </div>
                    <div class="institution-text">
                        <h1>Kaumudi Sanskrit Academy</h1>
                        <p>पुरातनं ज्ञानं नवीनं च दृष्टिकोणम्</p>
                        <div class="sanskrit-motto">विद्या परं भूषणम्</div>
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
                <!-- Student & Basic Info Grid -->
                <div class="info-grid">
                    <div class="info-card">
                        <div class="info-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div class="info-label">Student Name</div>
                        <div class="info-value">${studentName}</div>
                        <div class="info-sub">ID: KDS${studentId.slice(-8) || "2024001"}</div>
                    </div>
                    
                    <div class="info-card">
                        <div class="info-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </div>
                        <div class="info-label">Email & Phone</div>
                        <div class="info-value">${studentEmail}</div>
                        <div class="info-sub">${studentPhone}</div>
                    </div>
                </div>
                
                <!-- Academic Details -->
                <div class="academic-details">
                    <div class="section-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z"></path>
                            <path d="M12 12l4-2v4l-4 2-4-2v-4l4 2z"></path>
                        </svg>
                        Academic Information
                    </div>
                    
                    <div class="course-details">
                        <div class="course-item">
                            <span class="course-label">Course Enrolled</span>
                            <span class="course-value">${item.desc}</span>
                        </div>
                        <div class="course-item">
                            <span class="course-label">Category</span>
                            <span class="course-value">${item.type} <span class="course-badge">${item.paymentMode}</span></span>
                        </div>
                        <div class="course-item">
                            <span class="course-label">Enrollment ID</span>
                            <span class="course-value">${item.enrollmentId}</span>
                        </div>
                        <div class="course-item">
                            <span class="course-label">Duration</span>
                            <span class="course-value">${item.course?.duration || "12 Months"}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Transaction Table -->
                <table class="transaction-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Original Amount</th>
                            <th>Discount</th>
                            <th>Final Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="course-name">${item.desc}</td>
                            <td>${formatINR(basePrice)}</td>
                            <td class="discount-value">${discount > 0 ? "-" + formatINR(discount) : "—"}</td>
                            <td>${formatINR(item.totalAmount)}</td>
                            <td>
                                <span class="status-badge ${status === "Paid" ? "status-paid" : status === "Partial" ? "status-partial" : "status-pending"}">
                                    ${status === "Paid" ? "✓" : status === "Partial" ? "⏳" : "!"} ${status}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <!-- Fee Breakdown -->
                <div class="fee-breakdown">
                    <div class="section-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 6v6l4 2"></path>
                        </svg>
                        Fee Breakdown
                    </div>
                    
                    <div class="breakdown-row">
                        <span class="breakdown-label">Course Fee</span>
                        <span class="breakdown-value">${formatINR(basePrice)}</span>
                    </div>
                    
                    ${
                      discount > 0
                        ? `
                    <div class="breakdown-row">
                        <span class="breakdown-label">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 12H4M12 4v16"></path>
                            </svg>
                            Discount (${item.couponCode || "Applied"}) - ${discountPercentage}%
                        </span>
                        <span class="breakdown-value discount-value">-${formatINR(discount)}</span>
                    </div>
                    `
                        : ""
                    }
                    
                    <div class="breakdown-row">
                        <span class="breakdown-label">Processing Fee</span>
                        <span class="breakdown-value">${formatINR(processingFee)}</span>
                    </div>
                    
                    <div class="breakdown-row">
                        <span class="breakdown-label">GST (18%)</span>
                        <span class="breakdown-value">${formatINR(gstAmount)}</span>
                    </div>
                    
                    <div class="breakdown-row total-row">
                        <span class="breakdown-label">Total Amount</span>
                        <span class="breakdown-value">${formatINR(netTotal)}</span>
                    </div>
                </div>
                
                <!-- Payment Summary -->
                <div class="payment-summary">
                    <div class="summary-card paid">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" style="margin: 0 auto;">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <div class="summary-amount">${formatINR(item.paidAmount)}</div>
                        <div class="summary-label">Amount Paid</div>
                        <div style="font-size: 12px; color: #16a34a; margin-top: 8px;">${new Date().toLocaleDateString()}</div>
                    </div>
                    
                    <div class="summary-card due">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c2410c" stroke-width="2" style="margin: 0 auto;">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <div class="summary-amount">${formatINR(remaining)}</div>
                        <div class="summary-label">Balance Due</div>
                        <div style="font-size: 12px; color: #c2410c; margin-top: 8px;">Due by: ${new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}</div>
                    </div>
                </div>
                
                <!-- Footer with Signatures -->
                <div class="receipt-footer">
                    <div class="signature-area">
                        <div class="signature-line"></div>
                        <div class="signature-text">Student Signature</div>
                        <div class="stamp">(दस्ताक्षर)</div>
                    </div>
                    
                    <div class="signature-area">
                        <div class="signature-line"></div>
                        <div class="signature-text">Authorized Signatory</div>
                        <div class="stamp">Kaumudi Academy</div>
                    </div>
                    
                    <div class="footer-note">
                        <p>Generated on: ${dateString} at ${timeString}</p>
                        <p>For any queries, contact accounts@kaumudi.academy</p>
                        <div class="verification-code">
                            Verification: ${item.id.slice(-8).toUpperCase()}
                        </div>
                    </div>
                    
                    <div class="footer-note" style="text-align: left;">
                        <p>Payment Mode: <strong>${item.paymentMode}</strong></p>
                        <p>Transaction ID: ${item.id.slice(-12).toUpperCase()}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="action-buttons no-print">
            <button class="btn btn-primary" onclick="window.print()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <path d="M6 9V3h12v6"></path>
                    <rect x="6" y="15" width="12" height="6" rx="2"></rect>
                </svg>
                Print Receipt
            </button>
            <button class="btn btn-secondary" onclick="downloadPDF()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download PDF
            </button>
        </div>
    </div>

    <script>
        function downloadPDF() {
            const element = document.getElementById('receipt');
            const opt = {
                margin: [10, 10, 10, 10],
                filename: 'Kaumudi_Receipt_${item.academicReceiptNumber}.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
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
                        {item.paymentId ? item.paymentId.slice(-6) : item.academicReceiptNumber || "—"}
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
