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

const InquiryManagement = () => {

    // ================= STATE =================
    const [loading, setLoading] = useState(true);

    const [inquiries, setInquiries] = useState([
        {
            id: 1,
            name: "Rahul Sharma",
            email: "rahul@mail.com",
            phone: "9876543210",
            course: "Paninian Grammar Basics",
            message: "I want more details about online batch.",
            status: "Pending",
            date: "2026-02-12"
        },
        {
            id: 2,
            name: "Anita Verma",
            email: "anita@mail.com",
            phone: "9898989898",
            course: "Advanced Kavya Study",
            message: "Is offline class available?",
            status: "Resolved",
            date: "2026-02-10"
        },
        {
            id: 3,
            name: "Anita Verma",
            email: "anita@mail.com",
            phone: "9898989898",
            course: "Advanced Kavya Study",
            message: "Is offline class available?",
            status: "Resolved",
            date: "2026-02-10"
        }
    ]);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    // ================= LOADER =================
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    // ================= FILTER =================
    const filtered = useMemo(() => {
        return inquiries.filter(i =>
            i.name.toLowerCase().includes(search.toLowerCase()) &&
            (filter === "All" || i.status === filter)
        );
    }, [search, filter, inquiries]);

    // ================= STATS =================
    const stats = {
        total: inquiries.length,
        pending: inquiries.filter(i => i.status === "Pending").length,
        resolved: inquiries.filter(i => i.status === "Resolved").length
    };

    // ================= ACTIONS =================
    const markResolved = (id) => {
        setInquiries(prev =>
            prev.map(i =>
                i.id === id ? { ...i, status: "Resolved" } : i
            )
        );
    };

    const deleteInquiry = (id) => {
        setInquiries(prev => prev.filter(i => i.id !== id));
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 -mt-14 relative z-10">
                {[
                    { label: "Total Inquiries", value: stats.total },
                    { label: "Pending", value: stats.pending },
                    { label: "Resolved", value: stats.resolved }
                ].map((card, i) => (
                    <div key={i} className="bg-[#FBF4E2] rounded-2xl p-6 shadow-md">
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
                    {["All", "Pending", "Resolved"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === tab
                                    ? "bg-[#6b1d14] text-white"
                                    : "bg-[#FBF4E2] text-[#856966]"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* INQUIRY LIST */}
            <div className="grid lg:grid-cols-3 gap-3">
                <AnimatePresence>
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

                                <span className={`text-xs px-3 py-1 rounded-full ${inq.status === "Resolved"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-orange-100 text-orange-600"
                                    }`}>
                                    {inq.status}
                                </span>
                            </div>

                            <div className="text-sm text-[#856966] space-y-1">
                                <p className="flex items-center gap-2"><MdSchool /> {inq.course}</p>
                                <p className="flex items-center gap-2"><MdEmail /> {inq.email}</p>
                                <p className="flex items-center gap-2"><MdPhone /> {inq.phone}</p>
                            </div>

                            <p className="text-sm text-[#6b1d14]">
                                {inq.message}
                            </p>

                            <div className="flex justify-between pt-2">
                                <button
                                    onClick={() => markResolved(inq.id)}
                                    className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg"
                                >
                                    <MdCheckCircle /> Resolve
                                </button>

                                <button
                                    onClick={() => deleteInquiry(inq.id)}
                                    className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg"
                                >
                                    <MdDelete /> Delete
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
