import React, { useState } from "react";
import {
  Download,
  History,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Coins,
  ShieldCheck,
  Landmark,
  ChevronLeft,
  ChevronRight,
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

  useEffect(() => {
    const loadFees = async () => {
      try {
        const res = await getProfileEnrollments();
        console.log("enrollment data:", res.data); // check shape first

        // console.log("Enrollment response:", res.data);

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
          };
        });

        setPaymentHistory(formatted);
      } catch (err) {
        console.error("Failed to load fee data", err);
      } finally {
        setLoading(false);
      }
    };

    loadFees();
  }, []);

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
      label: "Total Fee",
      amount: totalFee.toLocaleString(),
      icon: <Coins size={22} />,
    },
    {
      label: "Paid Amount",
      amount: totalPaid.toLocaleString(),
      icon: <CheckCircle2 size={22} />,
    },
    {
      label: "Pending Amount",
      amount: totalPending.toLocaleString(),
      icon: <AlertCircle size={22} />,
    },
  ];

  /* PAGINATION LOGIC ADDED */
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(paymentHistory.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = paymentHistory.slice(indexOfFirstRow, indexOfLastRow);

  // Function to load Razorpay script dynamically
  const loadRazorpay = () => {
    return new Promise((resolve, reject) => {
      // Check if Razorpay is already loaded - use the checkout.js version (has open method)
      console.log(
        "Checking Razorpay: window.Razorpay =",
        typeof window.Razorpay,
      );

      if (window.Razorpay && typeof window.Razorpay === "function") {
        resolve();
        return;
      }

      const script = document.createElement("script");
      // Use checkout.js which has the open method (same as courseBuy.jsx)
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        console.log(
          "Razorpay loaded, window.Razorpay:",
          typeof window.Razorpay,
        );
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
    // Prevent default and stop propagation
    if (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }

    try {
      // Use course ID from the enrollment
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

      // Load Razorpay script first
      try {
        await loadRazorpay();
      } catch (err) {
        console.error("Failed to load Razorpay:", err);
        alert("Failed to load payment system. Please refresh and try again.");
        return;
      }

      let orderResponse;

      // Check if this is an EMI payment - use the new EMI installment endpoint
      if (paymentMode === "EMI") {
        console.log("Creating EMI installment order for course:", courseId);

        // Use the new EMI installment API for continuing EMI payments
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
        // Use the original payment order API for full payments
        orderResponse = await createPaymentOrder({
          courseId: courseId,
          paymentMode: paymentMode,
        });

        if (!orderResponse.success) {
          alert(orderResponse.message || "Failed to create payment order");
          return;
        }
      }

      // Get user info from localStorage for prefill
      const userFirstName =
        localStorage.getItem("kaumudi_user_first_name") || "";
      const userLastName = localStorage.getItem("kaumudi_user_last_name") || "";
      const userEmail = localStorage.getItem("kaumudi_user_email") || "";

      // Razorpay options
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

            // Use the appropriate verification API based on payment mode
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

      // Open Razorpay - using checkout.js version (has open method)
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
    const studentName =
      localStorage.getItem("kaumudi_user_name") ||
      `${(localStorage.getItem("kaumudi_user_first_name") || "").trim()} ${(localStorage.getItem("kaumudi_user_last_name") || "").trim()}`.trim() ||
      "Student";
    const studentEmail = localStorage.getItem("kaumudi_user_email") || "";
    const studentId = localStorage.getItem("kaumudi_user_id") || "";

    const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Receipt ${item.id || ""}</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

<style>

@page { size:A4; margin:18mm; }

body{
font-family:Inter,system-ui;
background:#faf7f2;
color:#2D2417;
margin:0;
}

.wrap{
position:relative;
max-width:850px;
margin:24px auto;
background:#fff;
border-radius:20px;
border:1px solid #e8dfd0;
box-shadow:0 15px 40px rgba(0,0,0,0.08);
overflow:hidden;
}

.watermark{
position:absolute;
inset:0;
background:url('${logo}') center / 42% no-repeat;
opacity:0.05;
pointer-events:none;
}

.header{
display:flex;
justify-content:space-between;
align-items:center;
padding:22px 26px;
background:linear-gradient(90deg,#3b120e,#5a1e17,#2a0b08);
border-bottom:4px solid #d6b15c;
}

.brand{
display:flex;
align-items:center;
gap:12px;
}

.brand img{
width:58px;
height:58px;
object-fit:contain;
border-radius:12px;
background:#74271E;
padding:6px;
}

.org{
font-weight:900;
letter-spacing:0.08em;
color:#d6b15c;
font-size:15px;
text-transform:uppercase;
}

.sub{
font-size:11px;
color:#e9d8b5;
letter-spacing:0.1em;
}

.receipt-badge{
font-weight:800;
font-size:12px;
color:#d6b15c;
border:1px solid #d6b15c;
padding:6px 12px;
border-radius:999px;
}

.section{
padding:20px 26px;
border-bottom:1px solid #efe4cf;
}

.grid{
display:grid;
grid-template-columns:repeat(2,1fr);
gap:14px 30px;
}

.label{
font-size:11px;
font-weight:800;
letter-spacing:.1em;
text-transform:uppercase;
color:#8c7a56;
}

.value{
font-size:14px;
font-weight:700;
}

.title{
padding:18px 26px 6px;
}

.title h1{
margin:0;
font-size:22px;
color:#74271E;
}

.row{
display:flex;
justify-content:space-between;
margin:10px 0;
}

.amount{
font-weight:900;
font-size:18px;
color:#74271E;
}

.amount.small{
font-size:14px;
color:#999;
text-decoration:line-through;
}

.discount-box{
background:#f0fdf4;
border:1px solid #dcfce7;
border-radius:12px;
padding:12px;
margin-bottom:14px;
}

.footer{
padding:16px 26px;
font-size:11px;
display:flex;
justify-content:space-between;
align-items:center;
border-top:1px dashed #efe4cf;
}

.actions{
display:flex;
gap:10px;
padding:0 26px 22px;
}

.btn{
padding:10px 14px;
border:none;
border-radius:10px;
font-weight:800;
cursor:pointer;
background:#74271E;
color:#fff;
}

.btn-outline{
background:#fff;
border:1px solid #74271E;
color:#74271E;
}

.badge-paid{
background:#ecf7f1;
border:1px solid #a7f3d0;
color:#0f766e;
padding:5px 10px;
border-radius:999px;
font-weight:800;
font-size:11px;
}

.badge-emi{
background:#fef3c7;
border:1px solid #fcd34d;
color:#b45309;
padding:5px 10px;
border-radius:999px;
font-weight:800;
font-size:11px;
}

.badge-pending{
background:#fff7ed;
border:1px solid #fed7aa;
color:#b45309;
padding:5px 10px;
border-radius:999px;
font-weight:800;
font-size:11px;
}

@media print{
.actions{display:none}
.wrap{border:none}
}

</style>
</head>

<body>

<div class="wrap">
<div class="watermark"></div>

<!-- HEADER -->
<div class="header">
<div class="brand">
<img src="${logo}" />
<div>
<div class="org">Kaumudi Sanskrit Academy</div>
<div class="sub">Official Payment Receipt</div>
</div>
</div>
<div class="receipt-badge">Receipt #${item.id || "-"}</div>
</div>

<!-- COURSE -->
<div class="title">
<h1>${item.desc || "Course Fee Payment"}</h1>
</div>

<!-- STUDENT DETAILS -->
<div class="section">
<div class="grid">

<div>
<div class="label">Student Name</div>
<div class="value">${item.studentName || "Student"}</div>
</div>

<div>
<div class="label">Enrollment No</div>
<div class="value">${item.enrollmentNo || "-"}</div>
</div>

<div>
<div class="label">Email</div>
<div class="value">${item.email || "-"}</div>
</div>

<div>
<div class="label">Phone</div>
<div class="value">${item.phone || "-"}</div>
</div>

</div>
</div>

<!-- RECEIPT DETAILS -->
<div class="section">
<div class="grid">

<div>
<div class="label">Student</div>
<div class="value">${studentName}</div>
</div>

<div>
<div class="label">Email</div>
<div class="value">${studentEmail || "-"}</div>
</div>

<div>
<div class="label">Enrollment ID</div>
<div class="value">${item.id || "-"}</div>
</div>

<div>
<div class="label">Student ID</div>
<div class="value">${studentId || "-"}</div>
</div>

<div>
<div class="label">Date</div>
<div class="value">${item.date || "-"}</div>
</div>

<div>
<div class="label">Payment Mode</div>
<div class="value">${item.paymentMode || "FULL"}</div>
</div>

<div>
<div class="label">Category</div>
<div class="value">${item.type || "Academic"}</div>
</div>

<div>
<div class="label">Status</div>
<div class="value">
<span class="${
      status === "Paid"
        ? "badge-paid"
        : status === "Partial"
          ? "badge-emi"
          : "badge-pending"
    }">
${status}
</span>
</div>
</div>

</div>
</div>

<!-- PAYMENT BREAKDOWN -->
<div class="section">

${
  item.discountAmount > 0
    ? `
<div class="discount-box">

<div class="row">
<div class="label">Original Amount</div>
<div class="amount small">${formatINR(item.originalAmount)}</div>
</div>

<div class="row">
<div class="label">Discount (${item.couponCode || "Applied"})</div>
<div class="amount" style="color:#16a34a">-${formatINR(item.discountAmount)}</div>
</div>

</div>
`
    : ""
}

<div class="row">
<div class="label">Total Amount</div>
<div class="amount">${formatINR(item.totalAmount)}</div>
</div>

<div class="row">
<div class="label">Paid Amount</div>
<div class="amount">${formatINR(item.paidAmount)}</div>
</div>

<div class="row">
<div class="label">Remaining</div>
<div class="amount">${formatINR(remaining)}</div>
</div>

</div>

<!-- FOOTER -->
<div class="footer">
<div>© Kaumudi Sanskrit Academy</div>
<div>www.kaumudi.academy</div>
</div>

<div class="actions">
<button class="btn" onclick="window.print()">Print</button>
<button class="btn btn-outline" onclick="window.close()">Close</button>
</div>

</div>

<script>
(function(){

function download(){
var el=document.querySelector('.wrap');
if(!el||!window.html2pdf)return;

html2pdf().set({
margin:[10,10,10,10],
filename:'Receipt_${String(item.id || item.desc || "Payment").replace(/[^a-z0-9]/gi, "_")}.pdf',
image:{type:'jpeg',quality:0.98},
html2canvas:{scale:2,useCORS:true},
jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}
}).from(el).save().then(function(){
setTimeout(function(){window.close();},600);
});

}

setTimeout(download,400);

})();
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
      <div className="p-10 text-center text-gray-400">Loading fee data...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16 mt-4 px-4">
      {/* PAGE HEADER */}
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#74271E]">
            Fee Ledger
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Overview of your academic payments and transaction history.
          </p>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-[#74271E] text-white rounded-2xl font-semibold text-sm shadow-lg shadow-[#74271E]/20 hover:bg-[#5c1f17] transition-all active:scale-95">
          <Wallet size={16} /> Make a Payment
        </button>
      </div> */}

      {/* SUMMARY CARDS - Compact Premium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {feeSummary.map((item, idx) => (
          <div
            key={idx}
            className="relative bg-white border border-[#e8dfd0] rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#74271E] via-[#c9a050] to-[#74271E]" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                  {item.label}
                </p>
                <h4 className="text-2xl font-semibold text-[#74271E]">
                  ₹ {item.amount}
                </h4>
              </div>

              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#74271E]/5 flex items-center justify-center text-[#c9a050] group-hover:bg-[#74271E]/10 transition">
                {item.icon}
              </div>
            </div>

            {/* Subtle Decorative Glow */}
            <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-[#c9a050]/5 rounded-full blur-2xl" />
          </div>
        ))}
      </div>

      {/* PAYMENT HISTORY TABLE */}
      <div className="bg-white rounded-3xl shadow-xl shadow-[#74271E]/5 border border-[#e8dfd0] overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#f0e9dc] flex justify-between items-center bg-[#faf7f2]">
          <div className="flex items-center gap-3">
            <History className="text-[#c9a050] shrink-0" size={20} />
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-700">
              Payment History
            </h4>
          </div>
          <span className="text-xs font-semibold text-gray-400 bg-white px-4 py-2 rounded-full border border-[#eee3d2] whitespace-nowrap shrink-0 ml-2">
            {paymentHistory.length} Transactions
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase tracking-widest text-gray-400 bg-[#faf7f2]">
                <th className="px-8 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Remaining</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-right">Receipt</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f3ede3]">
              {currentRows.map((item) => {
                // For EMI payments, always show Pay Now since there's remaining
                // For FULL payments, show Paid only if fully paid
                const isPaid = item.isPaid;
                const remaining = item.remaining || 0;

                console.log("Table row:", {
                  id: item.id,
                  paymentMode: item.paymentMode,
                  isPaid: item.isPaid,
                  remaining,
                  calculatedIsPaid: isPaid,
                });

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#fbf7f1] transition-all duration-300"
                  >
                    <td className="px-8 py-5 text-sm font-medium text-gray-600">
                      {item.date}
                    </td>

                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {item.desc}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[10px] uppercase tracking-widest text-[#c9a050]/70 font-bold">
                            {item.type}
                          </span>
                          {item.paymentMode === "EMI" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                              EMI
                            </span>
                          )}
                          {item.couponCode && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
                              {item.couponCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-base font-serif font-bold text-[#74271E]">
                      ₹ {item.totalAmount.toLocaleString()}
                    </td>

                    <td className="px-6 py-5 text-base font-serif font-bold text-[#74271E]">
                      ₹ {remaining.toLocaleString()}
                    </td>

                    <td className="px-6 py-5 text-center">
                      {isPaid ? (
                        <span className="inline-flex items-center shrink-0 whitespace-nowrap gap-2 px-4 py-1.5 bg-[#ecf7f1] text-emerald-600 rounded-full text-xs font-semibold border border-emerald-100">
                          <CheckCircle2 size={14} className="shrink-0" />
                          Paid
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("Button clicked for item:", item.id);
                            handlePayment(item, e);
                          }}
                          className="inline-flex items-center shrink-0 whitespace-nowrap gap-2 px-4 py-1.5 bg-[#74271E] text-white rounded-full text-xs font-semibold hover:bg-[#5c1f17] transition cursor-pointer"
                        >
                          <Wallet size={14} className="shrink-0" />
                          Pay Now
                        </button>
                      )}
                    </td>

                    <td className="px-8 py-5 text-right">
                      <button
                        className="inline-flex items-center shrink-0 whitespace-nowrap gap-2 px-4 py-2 bg-white border border-[#e8dfd0] text-gray-600 rounded-xl text-xs font-semibold hover:border-[#74271E] hover:text-[#74271E] transition-all hover:shadow-md"
                        onClick={() => handleDownloadReceipt(item)}
                      >
                        <Download size={14} className="shrink-0" />
                        Download
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION UI ADDED */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-4 border-t border-[#f0e9dc] bg-white">
            {/* LEFT SIDE - PAGE INFO */}
            <div className="text-sm font-medium text-gray-600">
              Page {currentPage} of {totalPages}
            </div>

            {/* RIGHT SIDE - ICON BUTTONS */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e8dfd0] text-gray-600 hover:border-[#74271E] hover:text-[#74271E] transition disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e8dfd0] text-gray-600 hover:border-[#74271E] hover:text-[#74271E] transition disabled:opacity-40"
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
