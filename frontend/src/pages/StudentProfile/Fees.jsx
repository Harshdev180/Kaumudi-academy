import React from "react";
import {
  CreditCard,
  Download,
  Receipt,
  History,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Coins,
  ArrowUpRight,
  ShieldCheck,
  Landmark,
} from "lucide-react";

const FeePurchase = () => {
  const feeSummary = [
    {
      label: "Total Fee",
      amount: "50,000",
      icon: <Coins size={24} />,
      color: "bg-emerald-100",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-300",
    },
    {
      label: "Paid Amount",
      amount: "35,000",
      icon: <CheckCircle2 size={24} />,
      color: "bg-blue-100",
      textColor: "text-blue-600",
      borderColor: "border-blue-300",
    },
    {
      label: "Pending Amount",
      amount: "15,000",
      icon: <AlertCircle size={24} />,
      color: "bg-red-100",
      textColor: "text-red-600",
      borderColor: "border-red-300",
    },
  ];

  const paymentHistory = [
    {
      date: "July 1, 2024",
      desc: "Tuition Fee Installment 1",
      amount: "15,000",
      status: "Paid",
      type: "Academic",
    },
    {
      date: "August 5, 2024",
      desc: "Exam Fee 2024",
      amount: "5,000",
      status: "Paid",
      type: "Examination",
    },
    {
      date: "September 10, 2024",
      desc: "Library Fee",
      amount: "1,000",
      status: "Paid",
      type: "Facility",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-12 mt-6">
      {/* 1. TOP HEADER SECTION */}
      {/* <div className="flex flex-col md:flex-row justify-between items-end gap-6 px-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-[#c9a050] rounded-full" />
            <h3 className="text-3xl font-serif font-bold text-gray-800 tracking-tight">Fee Ledger</h3>
          </div>
          <p className="text-sm text-gray-400 max-w-md">Detailed overview of your academic investments and transaction history.</p>
        </div>
        
        <button className="flex items-center gap-2 px-8 py-4 bg-[#74271E] text-white rounded-2xl font-bold text-xs shadow-xl shadow-[#74271E]/20 hover:bg-[#5a1e17] transition-all active:scale-95">
          <Wallet size={16} /> Make a Payment
        </button>
      </div> */}

      {/* 2. SUMMARY CARDS - Figma Inspired */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pt-5">
        {feeSummary.map((item, idx) => (
          <div
            key={idx}
            className={`${item.color} ${item.borderColor} border rounded-[2.5rem] p-8 flex items-center justify-between group hover:shadow-lg transition-all duration-500`}
          >
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                {item.label}
              </p>
              <h4 className={`text-3xl font-bold font-serif ${item.textColor}`}>
                ₹ {item.amount}
              </h4>
            </div>
            <div
              className={`p-4 bg-white rounded-2xl shadow-sm ${item.textColor}`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-black/5 overflow-hidden">
        {/* Table Header */}
        <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
          <div className="flex items-center gap-3">
            <History className="text-[#c9a050]" size={20} />
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-700">
              Payment History
            </h4>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-gray-100">
            Total Transactions: {paymentHistory.length}
          </span>
        </div>

        {/* Payment History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/50">
                <th className="px-10 py-5">Date</th>
                <th className="px-6 py-5">Description</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-10 py-5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paymentHistory.map((item, idx) => (
                <tr
                  key={idx}
                  className="group hover:bg-[#fdfbf7] transition-colors"
                >
                  <td className="px-10 py-6">
                    <p className="text-sm font-bold text-gray-700">
                      {item.date}
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-800">
                        {item.desc}
                      </p>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#c9a050]/70">
                        {item.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-base font-bold text-[#74271E]">
                      ₹ {item.amount}
                    </p>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      <CheckCircle2 size={12} /> {item.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[#74271E] hover:text-[#74271E] transition-all group-hover:shadow-md">
                      <Download size={14} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. FOOTER SECURITY BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#74271E] to-[#4a1813] p-10 rounded-[2.5rem] text-white flex items-center gap-8 relative overflow-hidden">
          <Landmark
            className="absolute -right-6 -bottom-6 opacity-10"
            size={180}
          />
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
            <ShieldCheck size={32} className="text-[#c9a050]" />
          </div>
          <div className="relative z-10">
            <h5 className="font-serif font-bold text-xl mb-2">
              Secure Transactions
            </h5>
            <p className="text-sm text-white/60 leading-relaxed font-light">
              All payments are encrypted using bank-grade security protocols. We
              accept all major cards, UPI, and Net Banking.
            </p>
          </div>
        </div>

        <div className="bg-[#fdfbf7] p-10 rounded-[2.5rem] border border-[#e6d5b8]/30 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <AlertCircle className="text-[#c9a050]" size={24} />
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-700">
              Need Assistance?
            </p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            If you encounter any issues regarding your fee installments or
            receipt generation, please contact the Registrar's Office.
          </p>
          <div className="flex gap-4">
            <button className="text-[10px] font-black uppercase tracking-[0.15em] text-[#74271E] border-b-2 border-[#74271E] pb-1">
              Raise a Ticket
            </button>
            <button className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-gray-600 pb-1">
              Billing FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeePurchase;
