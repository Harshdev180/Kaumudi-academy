import React from "react";
import {
  Download,
  History,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Coins,
  ShieldCheck,
  Landmark,
} from "lucide-react";

const FeePurchase = () => {
  const feeSummary = [
    {
      label: "Total Fee",
      amount: "50,000",
      icon: <Coins size={22} />,
    },
    {
      label: "Paid Amount",
      amount: "35,000",
      icon: <CheckCircle2 size={22} />,
    },
    {
      label: "Pending Amount",
      amount: "15,000",
      icon: <AlertCircle size={22} />,
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
    <div className="max-w-6xl mx-auto space-y-12 pb-16 mt-8 px-4">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
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
      </div>

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

              <div className="w-10 h-10 rounded-xl bg-[#74271E]/5 flex items-center justify-center text-[#c9a050] group-hover:bg-[#74271E]/10 transition">
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
            <History className="text-[#c9a050]" size={20} />
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-700">
              Payment History
            </h4>
          </div>
          <span className="text-xs font-semibold text-gray-400 bg-white px-4 py-2 rounded-full border border-[#eee3d2]">
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
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ede3]">
              {paymentHistory.map((item, idx) => (
                <tr
                  key={idx}
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
                    ₹ {item.amount}
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ecf7f1] text-emerald-600 rounded-full text-xs font-semibold border border-emerald-100">
                      <CheckCircle2 size={14} />
                      {item.status}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e8dfd0] text-gray-600 rounded-xl text-xs font-semibold hover:border-[#74271E] hover:text-[#74271E] transition-all hover:shadow-md">
                      <Download size={14} />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Security Card */}
        <div className="bg-gradient-to-br from-[#74271E] via-[#5e2018] to-[#3f1410] p-10 rounded-3xl text-white flex items-center gap-8 relative overflow-hidden shadow-xl">
          <Landmark
            className="absolute -right-6 -bottom-6 opacity-10"
            size={180}
          />

          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
            <ShieldCheck size={30} className="text-[#c9a050]" />
          </div>

          <div className="relative z-10">
            <h5 className="font-serif font-bold text-xl mb-2">
              Secure Transactions
            </h5>
            <p className="text-sm text-white/70 leading-relaxed">
              All payments are encrypted using bank-grade security protocols.
              We support UPI, Cards, and Net Banking.
            </p>
          </div>
        </div>

        {/* Help Card */}
        <div className="bg-white border border-[#e8dfd0] shadow-md p-10 rounded-3xl flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <AlertCircle className="text-[#c9a050]" size={24} />
            <p className="text-xs font-black uppercase tracking-widest text-gray-700">
              Need Assistance?
            </p>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Facing issues with installments or receipt downloads? Contact the
            Registrar's Office for quick assistance.
          </p>

          <div className="flex gap-6">
            <button className="text-xs font-bold uppercase tracking-widest text-[#74271E] border-b-2 border-[#74271E] pb-1">
              Raise a Ticket
            </button>
            {/* <button className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600 pb-1">
              Billing FAQ
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeePurchase;