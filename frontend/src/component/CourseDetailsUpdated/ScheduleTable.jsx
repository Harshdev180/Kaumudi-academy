import React from 'react';

const ScheduleTable = ({ scheduleData }) => {
  // Agar props se data aaye toh wo, nahi toh default data
  const batches = scheduleData || [
    {
      type: "Weekday Batch ",
      days: "Mon, Wed, Fri",
      time: "07:00 AM - 08:30 AM",
      Date: "15th Oct, 2024"
    },
    {
      type: "Weekend Intensive",
      days: "Sat, Sun",
      time: "06:00 PM - 08:30 PM",
      Date: "20th Oct, 2024"
    }
  ];

  return (
    <section className="pb-1 font-sans-serif">
      <div className="flex items-center gap-3 mb-8 mt-12">
        <div className="w-1.5 h-8 bg-[#d6b15c]"></div>
        <h2 className="text-[28px] font-bold text-[#74271E]">Batch Schedule</h2>
      </div>

      <div className="bg-white rounded-[20px] overflow-hidden shadow-xl border border-[#E8DFD3]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#D9C5B2] text-[#631D11]">
            <tr>
              <th className="p-8 text-[16px] font-bold tracking-tight">Batch Type</th>
              <th className="p-8 text-[16px] font-bold tracking-tight">Days</th>
              <th className="p-8 text-[16px] font-bold tracking-tight">Time (IST)</th>
              <th className="p-8 text-[16px] font-bold tracking-tight">Start Date</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-[#F2E8CF]">
            {batches.map((batch, idx) => (
              <tr key={idx} className="hover:bg-[#F9F5F0] transition-colors">
                <td className="p-8 font-bold text-[#631D11] text-[16px] max-w-[160px] leading-tight">
                  {batch.type}
                </td>
                <td className="p-8 text-[#3D1A16] text-[15px] font-medium">
                  {batch.days}
                </td>
                <td className="p-8 text-[#3D1A16] text-[15px] font-medium leading-relaxed">
                  {batch.time}
                </td>
                <td className="p-8 text-[#3D1A16] text-[15px] font-bold">
                  {batch.Date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ScheduleTable;