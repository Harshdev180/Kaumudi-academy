import React, { useState } from 'react';
import { X, Phone, Mail, Search, } from 'lucide-react';

const LeadManagement = () => {
    const [selectedLead, setSelectedLead] = useState(null);

    const leads = [
        { id: 1, name: "Aryan Sharma", course: "Advanced Paninian Grammar", time: "2h ago", status: "New", email: "aryan@example.com", phone: "+91 98765 43210" },
        { id: 2, name: "Meera Iyer", course: "Sanskrit Vyakaran", time: "3h ago", status: "Contacted", email: "meera@example.com", phone: "+91 99887 76655" },
        { id: 3, name: "Besic Sharma", course: "Vedic Chanting", time: "1d ago", status: "Follow-up", email: "besic@example.com", phone: "+91 88776 65544" }
    ];

    return (
        <div className="flex min-h-screen bg-[#FFFDF8] font-sans text-[#201412]">
            {/*  Main Content Area */}
            <main className="flex-1 md:ml-64 p-4 md:p-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-[#641e16]">Lead Management</h2>
                        <p className="text-zinc-500 text-sm mt-1 italic">Track and convert student inquiries globally.</p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#641e16]/20 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Leads List */}
                    <div className="flex-1 space-y-4">
                        <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                            <FilterBadge label="All Leads" active />
                            <FilterBadge label="New Inquiries" count="4" />
                            <FilterBadge label="Follow-ups" />
                        </div>

                        {leads.map((lead) => (
                            <div
                                key={lead.id}
                                onClick={() => setSelectedLead(lead)}
                                className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-[#641e16] font-bold">
                                        {lead.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold group-hover:text-[#641e16] transition-colors">{lead.name}</h4>
                                        <p className="text-xs text-zinc-500">{lead.course}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter block mb-1">{lead.time}</span>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${lead.status === 'New' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {lead.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Lead Details Panel (Conditional Sidebar) */}
                    {selectedLead && (
                        <div className="w-full lg:w-100 bg-white rounded-3xl border border-zinc-100 shadow-2xl p-6 animate-in slide-in-from-right duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-black text-xl text-[#641e16]">Lead Details</h3>
                                <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-8 p-4 bg-[#FFFDF8] rounded-2xl border border-orange-100">
                                <div className="w-16 h-16 rounded-2xl bg-[#641e16] text-white flex items-center justify-center text-xl font-bold">
                                    {selectedLead.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-xl font-black">{selectedLead.name}</h4>
                                    <p className="text-xs text-zinc-500 font-medium">Inquired on Oct 24, 2023</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <ContactInfo icon={<Mail size={14} />} label="Email" value={selectedLead.email} />
                                <ContactInfo icon={<Phone size={14} />} label="Phone" value={selectedLead.phone} />
                            </div>

                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Activity Timeline</h5>
                                <TimelineItem date="10:15 AM" title="Website Inquiry Received" desc="Student wants to deep dive into Vyakaran rules." />
                                <TimelineItem date="11:30 AM" title="Brochure Sent" desc="Fee structure shared via automated email." isLast />
                            </div>

                            <button className="w-full mt-10 bg-[#641e16] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#641e16]/20 hover:scale-[1.02] transition-transform">
                                Mark as Contacted
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// Helper Components
const NavItem = ({ icon, label, active }) => (
    <div className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-orange-300 text-[#641e16] font-bold shadow-lg' : 'hover:bg-white/10 text-orange-100/70'}`}>
        {icon} <span className="text-sm tracking-wide">{label}</span>
    </div>
);

const FilterBadge = ({ label, count, active }) => (
    <button className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${active ? 'bg-[#641e16] text-white border-[#641e16]' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'}`}>
        {label} {count && <span className="ml-2 bg-orange-300 text-[#641e16] px-1.5 py-0.5 rounded-md text-[10px]">{count}</span>}
    </button>
);

const ContactInfo = ({ icon, label, value }) => (
    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
        <p className="text-[9px] font-bold text-zinc-400 uppercase mb-1 flex items-center gap-1">{icon} {label}</p>
        <p className="text-xs font-bold truncate">{value}</p>
    </div>
);

const TimelineItem = ({ date, title, desc, isLast }) => (
    <div className="relative pl-6 pb-6">
        {!isLast && <div className="absolute left-[3px] top-2 w-0.5 h-full bg-zinc-100"></div>}
        <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-orange-300 ring-4 ring-white"></div>
        <p className="text-[10px] text-zinc-400 font-bold mb-1">{date}</p>
        <h6 className="text-xs font-bold">{title}</h6>
        <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{desc}</p>
    </div>
);

export default LeadManagement;