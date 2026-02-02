import React from 'react';
import { BookOpen, MoreVertical, RefreshCw, ChevronRight } from 'lucide-react';

const RecentInquirie = () => {
    // Theme from your assets
    const theme = {
        primary: "#b8973d",
        accentDark: "#8B6A21",
        parchment: "#FBF4E2",
        textDark: "#2d241c",
        goldDivider: "#D1B062"
    };

    const inquiries = [
        { name: "Rahul Deshpande", initial: "RD", course: "Panini Vyakarana Basics", date: "Oct 24, 2024", status: "NEW" },
        { name: "Ananya Iyer", initial: "AI", course: "Advanced Upanishad Study", date: "Oct 23, 2024", status: "IN REVIEW" },
        { name: "Vikram Singh", initial: "VS", course: "Introductory Bhagavad Gita", date: "Oct 22, 2024", status: "CONTACTED" }
    ];

    return (
        <div className="w-full  ">
            <div className=" rounded-[2.5rem]  overflow-hidden shadow-lg ">

                {/* Header matching image */}
                <div className="px-10 py-8 border-b border-[#D1B062] flex justify-between items-center bg-white/20">
                    <div className="flex items-center gap-3">
                        <h4 className="text-xl font-bold text-[#433629]">Recent Course Inquiries</h4>
                    </div>
                    <button className="text-sm font-bold text-[#8B6A21] hover:underline flex items-center gap-1">
                        View All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[11px] font-black uppercase text-[#6b1d14] tracking-[0.2em] border-b border-[#D1B062]/80">
                                <th className="px-10 py-6">Student Name</th>
                                <th className="px-10 py-6">Course Interest</th>
                                <th className="px-10 py-6">Date</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D1B062]/5">
                            {inquiries.map((row, i) => (
                                <tr key={i} className=" hover:bg-white/50 transition-all group">
                                    {/* Student with Badge */}
                                    <td className="px-10 py-7 ">
                                        <div className="flex items-center gap-4 ">
                                            <div className="relative">
                                                <div className="size-11 rounded-full flex items-center justify-center text-xs font-bold bg-[#FBF4E2] text-[#6b1d14] shadow-inner border border-white/50">
                                                    {row.initial}
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-[#6b1d14] rounded-full border-2 border-[#fcf8f0] shadow-sm" />
                                            </div>
                                            <span className="font-bold text-[#2d241c]">{row.name}</span>
                                        </div>
                                    </td>

                                    {/* Course */}
                                    <td className="px-10 py-7 italic text-[#433629]/70 font-medium ">
                                        {row.course}
                                    </td>

                                    {/* Date Column Added */}
                                    <td className="px-10 py-7 text-sm text-[#433629]/60 font-semibold">
                                        {row.date}
                                    </td>

                                    {/* Status Pill */}
                                    <td className="px-10 py-7">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-sm border border-[#D1B062]/20
                      ${row.status === 'NEW' ? 'bg-[#FBF4E2] text-[#b8973d]' :
                                                row.status === 'IN REVIEW' ? 'bg-[#F1F1F1] text-[#856966]' :
                                                    'bg-[#E7F7EF] text-[#22c55e]'}`}>
                                            {row.status}
                                        </span>
                                    </td>

                                    {/* Actions matching functional image */}
                                    <td className="px-10 py-7 text-right">
                                        <div className="flex items-center justify-end gap-4">
                                            {/* Premium Action Button */}
                                            <button className="px-6 py-2 rounded-xl bg-[#fdf9f0] border-b-2 border-[#d1b062]/40 border-x border-t border-[#d1b062]/20 text-[10px] font-black text-[#433629] shadow-sm active:border-b-0 active:translate-y-0.5 transition-all">
                                                VIEW
                                            </button>
                                            <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
                                                <MoreVertical size={18} className="text-[#856966]" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RecentInquirie;