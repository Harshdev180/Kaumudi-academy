import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MdSearch,
    MdSchool,
    MdPerson,
    MdEmail,
    MdPhone,
    MdDelete,
    MdCheckCircle
} from "react-icons/md";
import {
    getAdminInquiries,
    updateAdminInquiryStatus,
    deleteAdminInquiry
} from "../../lib/api";

const InquiryManagement = () => {

    // ================= STATE =================
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [inquiries, setInquiries] = useState([]);
    const [updatingId, setUpdatingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    // ================= LOADER =================
    useEffect(() => {
        let mounted = true;
        const fetchInquiries = async () => {
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
                    if (Array.isArray(list)) all.push(...list);
                    total = pagination?.total ?? total;
                    if (!pagination) break;
                    if (list.length < limit) break;
                    if (typeof total === "number" && all.length >= total) break;
                    page += 1;
                }

                if (mounted) {
                    setInquiries(Array.isArray(all) ? all : []);
                }
            } catch (err) {
                if (mounted) {
                    setError(err?.response?.data?.message || "Failed to load inquiries.");
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchInquiries();
        return () => {
            mounted = false;
        };
    }, []);

    const formatPreferredLevel = (level) => {
        if (!level) return "General";
        return level.charAt(0) + level.slice(1).toLowerCase();
    };

    const formatStatus = (status) => {
        if (status === "CONTACTED") return "Contacted";
        if (status === "CLOSED") return "Closed";
        return "New";
    };

    const normalized = useMemo(() => {
        return (inquiries || []).map((item) => ({
            id: item?._id || item?.id,
            name: item?.fullName || "Unnamed",
            email: item?.email || "",
            phone: item?.whatsappNumber || item?.phoneNumber || "",
            level: formatPreferredLevel(item?.preferredLevel),
            message: item?.message || "",
            status: item?.status || "NEW",
            createdAt: item?.createdAt || ""
        }));
    }, [inquiries]);

    // ================= FILTER =================
    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return normalized.filter(i => {
            const matchSearch = !term || [
                i.name,
                i.email,
                i.phone,
                i.level,
                i.message
            ].some(val => (val || "").toLowerCase().includes(term));
            const matchFilter = filter === "All" || i.status === filter;
            return matchSearch && matchFilter;
        });
    }, [search, filter, normalized]);

    // ================= STATS =================
    const stats = {
        total: normalized.length,
        new: normalized.filter(i => i.status === "NEW").length,
        contacted: normalized.filter(i => i.status === "CONTACTED").length,
        closed: normalized.filter(i => i.status === "CLOSED").length
    };

    // ================= ACTIONS =================
    const updateStatus = async (id, status) => {
        // Show confirmation when closing an inquiry
        if (status === "CLOSED") {
            const confirmed = window.confirm("Are you sure you want to close this inquiry? This action indicates the inquiry has been resolved.");
            if (!confirmed) return;
        }
        try {
            setUpdatingId(id);
            const response = await updateAdminInquiryStatus(id, status);
            const payload = response?.data ?? response;
            const updated = payload?.data ?? payload;
            if (updated && (updated?._id || updated?.id)) {
                setInquiries(prev =>
                    prev.map(i =>
                        (i?._id || i?.id) === id ? updated : i
                    )
                );
            } else {
                setInquiries(prev =>
                    prev.map(i =>
                        (i?._id || i?.id) === id ? { ...i, status } : i
                    )
                );
            }
        } catch (err) {
            console.error("Failed to update status:", err);
            alert(err?.response?.data?.message || "Failed to update status.");
        } finally {
            setUpdatingId(null);
        }
    };

    const deleteInquiry = async (id) => {
        if (!window.confirm("Delete this inquiry?")) return;
        try {
            setDeletingId(id);
            await deleteAdminInquiry(id);
            setInquiries(prev =>
                prev.filter(i => (i?._id || i?.id) !== id)
            );
        } catch (err) {
            console.error("Failed to delete inquiry:", err);
            alert(err?.response?.data?.message || "Failed to delete inquiry.");
        } finally {
            setDeletingId(null);
        }
    };

    // ================= LOADER UI =================
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F3E6C9] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-14 h-14 border-4 border-[#D1B062] border-t-[#6b1d14] rounded-full"
                />
            </div>
        );
    }

    // ================= UI =================
    return (
        <main className="min-h-screen bg-[#F3E6C9] p-8 space-y-10">

            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl px-6 md:px-10 py-10 text-white shadow-lg"
                style={{
                    background:
                        "linear-gradient(135deg,#7a1f16 0%, #8c2a1e 45%, #6b1d14 100%)",
                }}
            >
                <h1 className="text-3xl md:text-4xl font-black">
                    Student Inquiry Management
                </h1>
                <p className="text-sm text-white/90 mt-1">
                    Manage student course inquiries & follow-ups.
                </p>
            </motion.div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-14 relative z-10">
                {[
                    { label: "Total Inquiries", value: stats.total },
                    { label: "New", value: stats.new },
                    { label: "Contacted", value: stats.contacted },
                    { label: "Closed", value: stats.closed }
                ].map((card, i) => (
                    <div key={i} className="bg-[#FBF4E2] rounded-2xl p-6 shadow-md flex flex-col justify-between min-h-[110px]">
                        <p className="text-sm text-[#7c5a3c]">{card.label}</p>
                        <h3 className="text-3xl font-black text-[#6b1d14]">
                            {card.value}
                        </h3>
                    </div>
                ))}
            </div>

            {/* SEARCH + FILTER */}
            <div className="flex flex-wrap gap-4 justify-between">
                <div className="relative w-full md:w-[350px]">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#856966]" />
                    <input
                        placeholder="Search student..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#FBF4E2] outline-none"
                    />
                </div>

                <div className="flex gap-3">
                    {["All", "NEW", "CONTACTED", "CLOSED"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === tab
                                    ? "bg-[#6b1d14] text-white"
                                    : "bg-[#FBF4E2] text-[#856966]"
                                }`}
                        >
                            {tab === "All" ? "All" : formatStatus(tab)}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="text-red-600 font-semibold">{error}</div>
            )}

            {/* INQUIRY LIST */}
            <div className="grid lg:grid-cols-3 gap-3">
                <AnimatePresence>
                    {!error && filtered.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="col-span-full text-[#856966] text-sm"
                        >
                            No inquiries found.
                        </motion.div>
                    )}
                    {filtered.map((inq) => (
                        <motion.div
                            key={inq.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-[#FBF4E2] border border-[#D1B062]/60 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-xl transition"
                        >
                            <div className="flex justify-between">
                                <h3 className="font-bold text-[#6b1d14]">
                                    {inq.name}
                                </h3>

                                <span className={`text-xs px-3 py-1 rounded-full ${inq.status === "CLOSED"
                                        ? "bg-zinc-200 text-zinc-600"
                                        : inq.status === "CONTACTED"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-green-100 text-green-700"
                                    }`}>
                                    {formatStatus(inq.status)}
                                </span>
                            </div>

                            <div className="text-sm text-[#856966] space-y-1">
                                <p className="flex items-center gap-2"><MdSchool /> {inq.level}</p>
                                <p className="flex items-center gap-2"><MdEmail /> {inq.email}</p>
                                <p className="flex items-center gap-2"><MdPhone /> {inq.phone}</p>
                            </div>

                            <p className="text-sm text-[#6b1d14]">
                                {inq.message}
                            </p>

                            <div className="flex justify-between pt-2">
                                <button
                                    onClick={() => {
                                        const nextStatus = inq.status === "NEW" ? "CONTACTED" : "CLOSED";
                                        updateStatus(inq.id, nextStatus);
                                    }}
                                    disabled={inq.status === "CLOSED" || updatingId === inq.id}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-lg ${inq.status === "CLOSED"
                                            ? "text-zinc-400 cursor-not-allowed"
                                            : "text-green-700 hover:bg-green-50"
                                        }`}
                                >
                                    <MdCheckCircle />
                                    {inq.status === "NEW"
                                        ? (updatingId === inq.id ? "Updating..." : "Mark Contacted")
                                        : inq.status === "CONTACTED"
                                            ? (updatingId === inq.id ? "Updating..." : "Close")
                                            : "Closed"}
                                </button>

                                <button
                                    onClick={() => deleteInquiry(inq.id)}
                                    disabled={deletingId === inq.id}
                                    className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg disabled:opacity-60"
                                >
                                    <MdDelete /> {deletingId === inq.id ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

        </main>
    );
};

export default InquiryManagement;
