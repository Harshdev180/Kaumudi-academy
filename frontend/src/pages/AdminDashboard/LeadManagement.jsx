import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, Search, Trash2, Loader2, Calendar, Clock, CheckCircle } from 'lucide-react';
import {
    getAdminInquiries,
    updateAdminInquiryStatus,
    deleteAdminInquiry
} from "../../lib/api";

const formatPreferredLevel = (level) => {
    if (!level) return "General";
    return level.charAt(0) + level.slice(1).toLowerCase();
};

const formatDate = (date) => {
    try {
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(date);
    } catch {
        return "";
    }
};

const formatRelativeTime = (date) => {
    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
};

const mapStatusToLabel = (status) => {
    if (status === "CONTACTED") return "Contacted";
    if (status === "CLOSED") return "Closed";
    return "New";
};

const LeadManagement = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedLead, setSelectedLead] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All Leads");
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                setError("");
                const all = [];
                let page = 1;
                const limit = 50;
                let total = null;

                while (true) {
                    const response = await getAdminInquiries({ page, limit });
                    const payload = response?.data ?? response;
                    const list = payload?.data ?? payload ?? [];
                    const pagination = payload?.pagination ?? response?.pagination;
                    if (Array.isArray(list)) {
                        all.push(...list);
                    }
                    total = pagination?.total ?? total;
                    if (!pagination) break;
                    if (list.length < limit) break;
                    if (typeof total === "number" && all.length >= total) break;
                    page += 1;
                }

                const mapped = Array.isArray(all) ? all.map((item) => {
                    const createdAt = item?.createdAt ? new Date(item.createdAt) : null;
                    return {
                        id: item?._id || item?.id,
                        name: item?.fullName || "Unnamed",
                        vedicName: item?.vedicName || "",
                        course: formatPreferredLevel(item?.preferredLevel),
                        time: createdAt ? formatRelativeTime(createdAt) : "",
                        date: createdAt ? formatDate(createdAt) : "",
                        status: mapStatusToLabel(item?.status),
                        email: item?.email || "",
                        phone: item?.phoneNumber || "",
                        message: item?.message || "",
                        rawStatus: item?.status || "NEW",
                        createdAt: item?.createdAt || ""
                    };
                }) : [];
                setLeads(mapped);
            } catch (err) {
                console.error("Failed to load leads:", err);
                setError(err?.response?.data?.message || "Failed to load leads. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    // --- Actions ---
    const handleUpdateStatus = async (id, nextStatus = "CONTACTED") => {
        try {
            setUpdating(true);
            const response = await updateAdminInquiryStatus(id, nextStatus);
            const updated = response?.data?.data || response?.data || response;
            const updatedLead = updated
                ? {
                    id: updated?._id || id,
                    name: updated?.fullName || "Unnamed",
                    vedicName: updated?.vedicName || "",
                    course: formatPreferredLevel(updated?.preferredLevel),
                    time: updated?.createdAt ? formatRelativeTime(new Date(updated.createdAt)) : "",
                    date: updated?.createdAt ? formatDate(new Date(updated.createdAt)) : "",
                    status: mapStatusToLabel(updated?.status),
                    email: updated?.email || "",
                    phone: updated?.phoneNumber || "",
                    message: updated?.message || "",
                    rawStatus: updated?.status || nextStatus,
                    createdAt: updated?.createdAt || ""
                }
                : null;
            setLeads(prev => prev.map(lead => lead.id === id ? (updatedLead || {
                ...lead,
                status: mapStatusToLabel(nextStatus),
                rawStatus: nextStatus
            }) : lead));
            setSelectedLead(prev => prev && prev.id === id ? (updatedLead || {
                ...prev,
                status: mapStatusToLabel(nextStatus),
                rawStatus: nextStatus
            }) : prev);
        } catch (err) {
            console.error("Failed to update status:", err);
            alert(err?.response?.data?.message || "Failed to update status.");
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteLead = async (id) => {
        if (!window.confirm("Delete this lead?")) return;
        try {
            setDeleting(true);
            await deleteAdminInquiry(id);
            setLeads(prev => prev.filter(lead => lead.id !== id));
            setSelectedLead(null);
        } catch (err) {
            console.error("Failed to delete lead:", err);
            alert(err?.response?.data?.message || "Failed to delete lead.");
        } finally {
            setDeleting(false);
        }
    };

    const filteredLeads = useMemo(() => {
        const term = searchQuery.trim().toLowerCase();
        return leads.filter(lead => {
            const matchFilter = activeFilter === "All Leads" || lead.status === activeFilter;
            const matchSearch = !term || [
                lead.name,
                lead.email,
                lead.phone,
                lead.course
            ].some(value => (value || "").toLowerCase().includes(term));
            return matchFilter && matchSearch;
        });
    }, [leads, activeFilter, searchQuery]);

    return (
        <div className="flex h-screen w-full bg-[#f1e4c8] overflow-hidden font-sans text-[#201412]">
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
                            <FilterBadge
                                label="Closed"
                                count={leads.filter(l => l.status === 'Closed').length}
                                active={activeFilter === "Closed"}
                                onClick={() => setActiveFilter("Closed")}
                            />
                        </div>

                        {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#641e16]" size={32} /></div> : (
                            <motion.div layout className="grid gap-4">
                                {!loading && error && (
                                    <div className="text-sm text-red-600">{error}</div>
                                )}
                                {!loading && !error && filteredLeads.length === 0 && (
                                    <div className="text-sm text-[#641e16]/70">No leads found.</div>
                                )}
                                {filteredLeads.map((lead) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ x: 5 }}
                                        key={lead.id}
                                        onClick={() => setSelectedLead(lead)}
                                        className={`bg-[#fcf8f0]/30 p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${selectedLead?.id === lead.id ? 'border-[#D4AF37] shadow-lg ring-1 ring-[#D4AF37]' : 'border-zinc-100 shadow-sm'}`}
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
                                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${lead.status === 'New'
                                                ? 'bg-green-100 text-green-700'
                                                : lead.status === 'Closed'
                                                    ? 'bg-zinc-200 text-zinc-600'
                                                    : 'bg-blue-100 text-blue-700'}`}>{lead.status}</span>
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
                                className="w-full lg:w-100 bg-[#fcf8f0]/30 rounded-3xl border border-zinc-100 shadow-2xl p-6 sticky top-0"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="font-black text-xl text-[#641e16]">Lead Details</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDeleteLead(selectedLead.id)}
                                            disabled={deleting}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        >
                                            {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={18} />}
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
                                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">ID: #{(selectedLead.id || "").toString().slice(-6)}</p>
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
                                    <TimelineItem icon={<Clock size={10} />} date={selectedLead.time || "--"} title="Inquiry Received" desc={selectedLead.message || "Inquiry received."} />
                                    <TimelineItem icon={<Calendar size={10} />} date={selectedLead.date || "--"} title="Submitted" desc="Captured in lead management." isLast />
                                </div>

                                <button
                                    onClick={() => handleUpdateStatus(selectedLead.id, "CONTACTED")}
                                    disabled={selectedLead.status !== "New" || updating}
                                    className={`w-full mt-10 py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${selectedLead.status === "Contacted"
                                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                                        : selectedLead.status === "Closed"
                                            ? "bg-zinc-200 text-zinc-500 cursor-not-allowed"
                                        : "bg-[#641e16] text-white shadow-[#641e16]/20 hover:bg-[#4d1711]"
                                        }`}
                                >
                                    {selectedLead.status === "Contacted" ? (
                                        <><CheckCircle size={18} /> Status: Contacted</>
                                    ) : selectedLead.status === "Closed" ? (
                                        <>Status: Closed</>
                                    ) : (
                                        updating ? <><Loader2 size={18} className="animate-spin" /> Updating...</> : "Update Status to Contacted"
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
