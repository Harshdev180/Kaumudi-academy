import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, Search, Trash2, Loader2, Calendar, Clock, CheckCircle } from 'lucide-react';

const LeadManagement = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All Leads");

    useEffect(() => {
        // Simulating data fetch
        setTimeout(() => {
            setLeads([
                { id: 1, name: "Aryan Sharma", course: "Advanced Paninian Grammar", time: "2h ago", status: "New", email: "aryan@example.com", phone: "+91 98765 43210", date: "24 Oct 2023" },
                { id: 2, name: "Meera Iyer", course: "Sanskrit Vyakaran", time: "3h ago", status: "Contacted", email: "meera@example.com", phone: "+91 99887 76655", date: "23 Oct 2023" },
                { id: 3, name: "Besic Sharma", course: "Vedic Chanting", time: "1d ago", status: "Follow-up", email: "besic@example.com", phone: "+91 88776 65544" }

            ]);
            setLoading(false);
        }, 800);
    }, []);

    // --- Actions ---
    const handleUpdateStatus = (id) => {
        const updatedLeads = leads.map(lead =>
            lead.id === id ? { ...lead, status: "Contacted" } : lead
        );
        setLeads(updatedLeads);
        // Instant update in sidebar
        setSelectedLead(prev => ({ ...prev, status: "Contacted" }));
    };

    const handleDeleteLead = (id) => {
        setLeads(leads.filter(lead => lead.id !== id));
        setSelectedLead(null);
    };

    const filteredLeads = leads.filter(lead =>
        (activeFilter === "All Leads" || lead.status === activeFilter) &&
        (lead.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex h-screen w-full bg-[#F3E6C9] overflow-hidden font-sans text-[#201412]">
            <main className="flex-1 h-full overflow-y-auto p-4 md:p-10 custom-scrollbar">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-[#641e16]">Lead Management</h2>
                        <p className="text-zinc-500 text-sm italic">Track and convert student inquiries globally.</p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#641e16]/20 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Leads List Area */}
                    <div className="flex-1 w-full space-y-4">
                        <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
                            <FilterBadge
                                label="All Leads"
                                active={activeFilter === "All Leads"}
                                onClick={() => setActiveFilter("All Leads")}
                            />
                            <FilterBadge
                                label="New"
                                count={leads.filter(l => l.status === 'New').length}
                                active={activeFilter === "New"}
                                onClick={() => setActiveFilter("New")}
                            />
                            <FilterBadge
                                label="Contacted"
                                count={leads.filter(l => l.status === 'Contacted').length}
                                active={activeFilter === "Contacted"}
                                onClick={() => setActiveFilter("Contacted")}
                            />
                        </div>

                        {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#641e16]" size={32} /></div> : (
                            <motion.div layout className="grid gap-4">
                                {filteredLeads.map((lead) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ x: 5 }}
                                        key={lead.id}
                                        onClick={() => setSelectedLead(lead)}
                                        className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${selectedLead?.id === lead.id ? 'border-[#D4AF37] shadow-lg ring-1 ring-[#D4AF37]' : 'border-zinc-100 shadow-sm'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-[#D4AF37] font-bold shadow-inner">
                                                {lead.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#641e16]">{lead.name}</h4>
                                                <p className="text-xs text-zinc-500 font-medium">{lead.course}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">{lead.time}</span>
                                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${lead.status === 'New' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{lead.status}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Lead Detail Panel */}
                    <AnimatePresence mode="wait">
                        {selectedLead && (
                            <motion.div
                                key={selectedLead.id}
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 300, opacity: 0 }}
                                className="w-full lg:w-100 bg-white rounded-3xl border border-zinc-100 shadow-2xl p-6 sticky top-0"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="font-black text-xl text-[#641e16]">Lead Details</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDeleteLead(selectedLead.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-zinc-100 rounded-full"><X size={20} /></button>
                                    </div>
                                </div>

                                <div className="p-4 bg-[#FFFDF8] rounded-2xl border border-orange-100 flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-[#641e16] text-white flex items-center justify-center text-xl font-bold shadow-lg">
                                        {selectedLead.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-[#201412]">{selectedLead.name}</h4>
                                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">ID: #KA-00{selectedLead.id}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <ContactInfo icon={<Mail size={12} />} label="Email" value={selectedLead.email} />
                                    <ContactInfo icon={<Phone size={12} />} label="Phone" value={selectedLead.phone} />
                                </div>

                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                                        <span className="w-4 h-px bg-zinc-200"></span> Recent Activity
                                    </h5>
                                    <TimelineItem icon={<Clock size={10} />} date="10:15 AM" title="Inquiry Received" desc="Interested in Grammar." />
                                    <TimelineItem icon={<Calendar size={10} />} date="11:30 AM" title="Brochure Sent" desc="Shared via email." isLast />
                                </div>

                                <button
                                    onClick={() => handleUpdateStatus(selectedLead.id)}
                                    disabled={selectedLead.status === "Contacted"}
                                    className={`w-full mt-10 py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${selectedLead.status === "Contacted"
                                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                                        : "bg-[#641e16] text-white shadow-[#641e16]/20 hover:bg-[#4d1711]"
                                        }`}
                                >
                                    {selectedLead.status === "Contacted" ? (
                                        <><CheckCircle size={18} /> Status: Contacted</>
                                    ) : (
                                        "Update Status to Contacted"
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

// --- HELPER COMPONENTS (Define them here to avoid "Not Defined" error) ---

const FilterBadge = ({ label, count, active, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${active ? 'bg-[#641e16] text-white shadow-md' : 'bg-white text-zinc-500 border-zinc-200'
        }`}>
        {label}
        {count !== undefined && (
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${active ? 'bg-white/20' : 'bg-orange-100 text-[#641e16]'}`}>
                {count}
            </span>
        )}
    </button>
);

const ContactInfo = ({ icon, label, value }) => (
    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 hover:bg-white transition-colors">
        <p className="text-[9px] font-bold text-zinc-400 uppercase mb-1 flex items-center gap-1 opacity-70">
            {icon} {label}
        </p>
        <p className="text-xs font-bold truncate text-[#641e16]">{value}</p>
    </div>
);

const TimelineItem = ({ icon, date, title, desc, isLast }) => (
    <div className="relative pl-6 pb-6">
        {!isLast && <div className="absolute left-[3.5px] top-2 w-px h-full bg-zinc-100"></div>}
        <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-[#D4AF37] ring-4 ring-white shadow-sm"></div>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold mb-1">
            {icon} {date}
        </div>
        <h6 className="text-xs font-bold text-zinc-700">{title}</h6>
        <p className="text-[11px] text-zinc-500 italic mt-0.5 leading-relaxed">"{desc}"</p>
    </div>
);

export default LeadManagement;