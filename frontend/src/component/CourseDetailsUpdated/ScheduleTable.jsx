import React from 'react';

const ScheduleTable = ({ scheduleData }) => {
  // Support both old format (schedule) and new format (batchSchedule)
  const batches = scheduleData || [];

  // If no data, don't render anything
  if (!batches || !Array.isArray(batches) || batches.length === 0) {
    return null;
  }

  return (
    <section className="pb-1 font-sans-serif">
      <div className="flex items-center gap-3 mb-8 mt-12">
        <div className="w-1.5 h-8 bg-[#d6b15c]"></div>
        <h2 className="text-[28px] font-bold text-[#74271E]">Batch Schedule</h2>
      </div>

      <div className="bg-white rounded-[20px] shadow-xl border border-[#E8DFD3] overflow-hidden">
        {/* FIX: Is div ko add kiya gaya hai table ko scrollable banane ke liye */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]"> 
            {/* min-w-[600px] ensure karta hai ki columns squeeze na hon aur sub dikhayi den */}
            <thead className="bg-[#D9C5B2] text-[#631D11]">
              <tr>
                <th className="p-8 text-[16px] font-bold tracking-tight whitespace-nowrap">Batch Type</th>
                <th className="p-8 text-[16px] font-bold tracking-tight whitespace-nowrap">Days</th>
                <th className="p-8 text-[16px] font-bold tracking-tight whitespace-nowrap">Start Time</th>
                <th className="p-8 text-[16px] font-bold tracking-tight whitespace-nowrap">End Time</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[#F2E8CF]">
              {batches.map((batch, idx) => (
                <tr key={idx} className="hover:bg-[#F9F5F0] transition-colors">
                  <td className="p-8 font-bold text-[#631D11] text-[16px] leading-tight whitespace-nowrap">
                    {batch.batchType || batch.type || "N/A"}
                  </td>
                  <td className="p-8 text-[#3D1A16] text-[15px] font-medium whitespace-nowrap">
                    {batch.days || "N/A"}
                  </td>
                  <td className="p-8 text-[#3D1A16] text-[15px] font-medium leading-relaxed whitespace-nowrap">
                    {batch.startTime || "N/A"}
                  </td>
                  <td className="p-8 text-[#3D1A16] text-[15px] font-medium leading-relaxed whitespace-nowrap">
                    {batch.endTime || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ScheduleTable;