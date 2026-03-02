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
import { getProfileEnrollments } from "../../lib/api";
import { createPaymentOrder } from "../../lib/api";
import logo from "../../assets/logo-bgremove.webp";

const FeePurchase = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFees = async () => {
      try {
        const res = await getProfileEnrollments();

        console.log(res);

        // adjust if your backend structure differs
        const formatted = res.data.map((item) => ({
          id: item._id,
          date: new Date(item.createdAt).toLocaleDateString(),
          desc: item.course?.title || "Course",
          type: item.course?.category || "Academic",
          totalAmount: item?.payment?.originalAmount || 0,
          paidAmount: item?.payment?.finalAmount || 0,
        }));

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

  const totalPending = totalFee - totalPaid;

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

  const handlePayment = async (item) => {
    try {
      await createPaymentOrder({
        courseId: item.id,
      });

      // refresh data
      window.location.reload();
    } catch (err) {
      alert("Payment failed");
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const formatINR = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

  const handleDownloadReceipt = (item) => {
    const remaining = (item.totalAmount || 0) - (item.paidAmount || 0);
    const status =
      (item.paidAmount || 0) >= (item.totalAmount || 0) ? "Paid" : "Pending";

    const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Receipt ${item.id || ""}</title>

      <style>
        body {
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          background:#faf7f2;
          color:#2D2417;
          margin:0;
        }

        .container {
          max-width: 720px;
          margin: 30px auto;
          background:#ffffff;
          border:1px solid #e8dfd0;
          border-radius:16px;
          padding:32px;
        }

        /* HEADER */
        .header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          border-bottom:1px solid #eee3d2;
          padding-bottom:18px;
          margin-bottom:22px;
        }

        .brand {
          display:flex;
          align-items:center;
          gap:14px;
        }

        .logo-box {
          background:#74271E;
          height:48px;
          width:48px;
          border-radius:12px;
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow:0 0 18px rgba(214,177,92,0.45);
        }

        .logo-box img {
          height:32px;
          width:auto;
        }

        .brand-title {
          font-size:18px;
          font-weight:800;
          color:#74271E;
        }

        .brand-sub {
          font-size:12px;
          color:#6b4b3e;
        }

        .receipt-meta {
          text-align:right;
        }

        .title {
          font-size:20px;
          font-weight:800;
          color:#74271E;
        }

        .meta {
          font-size:12px;
          color:#6b4b3e;
        }

        .section {
          padding-top:14px;
          margin-top:14px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          row-gap: 16px;   /* reduced */
          column-gap: 40px;
          margin-top: 6px; /* slightly tighter */
        }

        .detail {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail.right {
          text-align: right;
          align-items: flex-end;
        }

        .row {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin:10px 0;
        }

        .label {
          font-size:12px;
          font-weight:700;
          color:#8c7a56;
          letter-spacing:0.08em;
          text-transform:uppercase;
        }

        .value {
          font-size:14px;
          font-weight:700;
          color:#2D2417;
        }

        .amount {
          font-size:18px;
          font-weight:800;
          color:#74271E;
        }

        .badge {
          display:inline-block;
          padding:6px 12px;
          border-radius:999px;
          font-size:11px;
          font-weight:700;
        }

        .badge-paid {
          background:#ecf7f1;
          color:#0f766e;
          border:1px solid #a7f3d0;
        }

        .badge-pending {
          background:#fff7ed;
          color:#b45309;
          border:1px solid #fed7aa;
        }

        .footer {
          margin-top:24px;
          font-size:11px;
          color:#6b4b3e;
          border-top:1px solid #eee3d2;
          padding-top:14px;
        }

        @media print {
          .actions { display:none }
          .container { box-shadow:none; }
        }

        .actions {
          margin-top:20px;
          display:flex;
          gap:10px;
        }

        .btn {
          padding:10px 14px;
          background:#74271E;
          color:#fff;
          border:none;
          border-radius:10px;
          font-weight:800;
          font-size:12px;
          letter-spacing:0.08em;
          cursor:pointer;
        }

        .btn-outline {
          background:#fff;
          color:#74271E;
          border:1px solid #74271E;
        }

      </style>
    </head>

    <body>
      <div class="container">

        <!-- HEADER -->
        <div class="header">
          <div class="brand">
            <div class="logo-box">
              <img src="${logo}" alt="logo" />
            </div>
            <div>
              <div class="brand-title">Kaumudi Sanskrit Academy</div>
              <div class="brand-sub">Excellence in Sanskrit Learning</div>
            </div>
          </div>

          <div class="receipt-meta">
            <div class="title">Payment Receipt</div>
            <div class="meta">Receipt No: ${item.id || "-"}</div>
          </div>
        </div>

        <!-- DETAILS -->
        <div class="section">
          <div class="details-grid">

            <div class="detail">
              <div class="label">Date</div>
              <div class="value">${item.date || "-"}</div>
            </div>

            <div class="detail right">
              <div class="label">Status</div>
              <span class="badge ${
                status === "Paid" ? "badge-paid" : "badge-pending"
              }">${status}</span>
            </div>

            <div class="detail">
              <div class="label">Course</div>
              <div class="value">${item.desc || "Course"}</div>
            </div>

            <div class="detail right">
              <div class="label">Category</div>
              <div class="value">${item.type || "Academic"}</div>
            </div>

          </div>
        </div>

        <!-- AMOUNTS -->
        <div class="section">
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
          This is a computer-generated receipt.  
          For queries, contact ksacademy@gmail.com.
        </div>

        <div class="actions">
          <button class="btn" onclick="window.print()">Print</button>
          <button class="btn btn-outline" onclick="window.close()">Close</button>
        </div>

      </div>
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
      {/* PAGE HEADER */}
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
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
                const isPaid = item.paidAmount >= item.totalAmount;
                const remaining = item.totalAmount - item.paidAmount;

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
                        <span className="text-[10px] uppercase tracking-widest text-[#c9a050]/70 font-bold">
                          {item.type}
                        </span>
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
                          onClick={() => handlePayment(item)}
                          className="inline-flex items-center shrink-0 whitespace-nowrap gap-2 px-4 py-1.5 bg-[#74271E] text-white rounded-full text-xs font-semibold hover:bg-[#5c1f17] transition"
                        >
                          <Wallet size={14} className="shrink-0" />
                          Pay Now
                        </button>
                      )}
                    </td>

                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => handleDownloadReceipt(item)}
                        className="inline-flex items-center shrink-0 whitespace-nowrap gap-2 px-4 py-2 bg-white border border-[#e8dfd0] text-gray-600 rounded-xl text-xs font-semibold hover:border-[#74271E] hover:text-[#74271E] transition-all hover:shadow-md"
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
