import React from 'react';

const ScheduleTable = () => {
  const batches = [
    {
      type: "Weekday Batch ",
      days: "Mon, Wed, Fri",
      time: "07:00 AM - 08:30 AM",
      date: "15th Oct, 2024"
    },
    {
      type: "Weekend Intensive",
      days: "Sat, Sun",
      time: "06:00 PM - 08:30 PM",
      date: "20th Oct, 2024"
    }
  ];

  return (
    <section className="pb-1 font-sans-serif">
      {/* Section Heading matching the style */}
      <div className="flex items-center gap-3 mb-8 mt-12">
        <div className="w-1.5 h-8 bg-[#d6b15c]"></div>
        <h2 className="text-[28px] font-bold text-[#74271E]">Batch Schedule</h2>
      </div>

      <div className="bg-white rounded-[20px] overflow-hidden shadow-xl border border-[#E8DFD3]">
        <table className="w-full text-left border-collapse">
          {/* Header with specific beige/tan color */}
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
                {/* Batch Type in Dark Maroon/Red */}
                <td className="p-8 font-bold text-[#631D11] text-[16px] max-w-[160px] leading-tight">
                  {batch.type}
                </td>
                
                {/* Days and Time in standard text color */}
                <td className="p-8 text-[#3D1A16] text-[15px] font-medium">
                  {batch.days}
                </td>
                
                <td className="p-8 text-[#3D1A16] text-[15px] font-medium leading-relaxed">
                  {batch.time}
                </td>
                
                {/* Date column */}
                <td className="p-8 text-[#3D1A16] text-[15px] font-bold">
                  {batch.date}
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