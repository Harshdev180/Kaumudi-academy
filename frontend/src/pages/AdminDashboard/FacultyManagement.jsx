import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MdPerson,
    MdSchool,
    MdAttachMoney,
    MdAdd,
    MdClose,
    MdBookmark
} from "react-icons/md";

const FacultyManagement = () => {

    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [faculty, setFaculty] = useState([
        {
            id: 1,
            name: "Acharya Rahul",
            course: "Paninian Grammar",
            salary: 25000,
        },
        {
            id: 2,
            name: "Dr. Meera",
            course: "Shlok Studies",
            salary: 18000,
        },
        {
            id: 3,
            name: "Prof. Dev",
            course: "Ved Studies",
            salary: 21000,
        },
    ]);

    const [form, setForm] = useState({
        name: "",
        course: "",
        salary: "",
    });

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(t);
    }, []);

    /* ================= STATS ================= */

    const stats = useMemo(() => ({
        total: faculty.length,
    }), [faculty]);

    /* ================= ADD FACULTY ================= */

    const addFaculty = (e) => {
        e.preventDefault();

        setFaculty(prev => [
            {
                id: Date.now(),
                name: form.name,
                course: form.course,
                salary: form.salary,
            },
            ...prev
        ]);

        setForm({ name: "", course: "", salary: "" });
        setDrawerOpen(false);
    };

    return (
        <main className="min-h-screen bg-[#F3E6C9] p-6 space-y-8">

            {/* HEADER */}
            <div
                className="relative overflow-hidden rounded-3xl px-8 py-10 text-white shadow-lg"
                style={{
                    background:
                        "linear-gradient(135deg,#7a1f16 0%, #8c2a1e 45%, #6b1d14 100%)",
                }}
            >
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,#D4AF37,transparent_60%)]" />

                <div className="relative flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black">
                            Faculty Management
                        </h1>
                        <p className="text-sm text-white/90">
                            Control faculty assignments & details.
                        </p>
                    </div>

                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="flex items-center gap-2 bg-[#e6b86a] text-[#4a2b07] px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
                    >
                        <MdAdd /> Add Faculty
                    </button>
                </div>
            </div>

            {/* STATS */}
            <div className="grid md:grid-cols-1 gap-6 -mt-14 relative z-10">
                <div className="bg-[#FBF4E2] rounded-2xl p-6 shadow-md">
                    <p className="text-sm text-[#7c5a3c]">Total Faculty</p>
                    <h3 className="text-3xl font-black text-[#6b1d14]">{stats.total}</h3>
                </div>
            </div>

            {/* FACULTY CARDS */}
            {!loading && (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {faculty.map(f => (
                        <motion.div
                            key={f.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#FBF4E2] rounded-3xl p-6 shadow-md border border-[#D1B062]/40"
                        >

                            {/* TOP */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 text-[#6b1d14] flex items-center justify-center">
                                    <MdPerson size={24} />
                                </div>

                                <div>
                                    <h3 className="font-bold text-[#6b1d14] text-base">{f.name}</h3>
                                    <p className="text-xs text-[#856966]">{f.course}</p>
                                </div>
                            </div>

                            {/* DETAILS */}
                            <div className="space-y-3 text-sm text-[#4A2B07]">

                                <div className="flex items-center gap-2">
                                    <MdSchool className="text-[#6b1d14]" />
                                    <span>{f.course}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <MdAttachMoney className="text-[#6b1d14]" />
                                    <span>₹ {f.salary}</span>
                                </div>

                            </div>

                        </motion.div>
                    ))}
                </div>
            )}

            {/* ================= ADD FACULTY DRAWER (PREMIUM) ================= */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        <motion.div
                            onClick={() => setDrawerOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                        />

                        <motion.div
                            initial={{ x: 420, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 420, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-gradient-to-b from-[#FBF4E2] to-[#F5EDE0] z-[200] shadow-2xl overflow-y-auto"
                        >
                            {/* CLOSE BUTTON */}
                            <motion.button
                                onClick={() => setDrawerOpen(false)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute top-6 right-6 text-[#6b1d14] hover:bg-[#D1B062]/20 p-2 rounded-lg transition"
                            >
                                <MdClose size={24} />
                            </motion.button>

                            {/* HEADER */}
                            <div className="relative px-6 pt-8 pb-6 border-b border-[#D1B062]/30">
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,#D1B062,transparent_70%)]" />

                                <div className="relative space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-lg bg-[#D1B062]/20">
                                            <MdPerson className="text-[#6b1d14] text-2xl" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-[#6b1d14]">Add Faculty</h2>
                                            <p className="text-xs text-[#856966] font-medium">Create new faculty member</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FORM CONTENT */}
                            <div className="p-6 space-y-6">

                                <form onSubmit={addFaculty} className="space-y-5">

                                    {/* NAME FIELD */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-xs font-bold text-[#6b1d14] uppercase tracking-wider flex items-center gap-2">
                                            <MdPerson size={14} />
                                            Faculty Name
                                        </label>
                                        <input
                                            required
                                            placeholder="e.g., Acharya Rahul"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-white border-2 border-[#D1B062]/30 focus:border-[#D1B062] focus:outline-none transition text-[#6b1d14] placeholder-[#856966]/50"
                                        />
                                    </motion.div>

                                    {/* COURSE FIELD */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-xs font-bold text-[#6b1d14] uppercase tracking-wider flex items-center gap-2">
                                            <MdSchool size={14} />
                                            Course Teaching
                                        </label>
                                        <input
                                            required
                                            placeholder="e.g., Paninian Grammar"
                                            value={form.course}
                                            onChange={(e) => setForm({ ...form, course: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-white border-2 border-[#D1B062]/30 focus:border-[#D1B062] focus:outline-none transition text-[#6b1d14] placeholder-[#856966]/50"
                                        />
                                    </motion.div>

                                    {/* SALARY FIELD */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-xs font-bold text-[#6b1d14] uppercase tracking-wider flex items-center gap-2">
                                            <MdAttachMoney size={14} />
                                            Monthly Salary
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#856966] font-bold">₹</span>
                                            <input
                                                required
                                                type="number"
                                                placeholder="25000"
                                                value={form.salary}
                                                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                                                className="w-full px-4 py-3 pl-7 rounded-lg bg-white border-2 border-[#D1B062]/30 focus:border-[#D1B062] focus:outline-none transition text-[#6b1d14] placeholder-[#856966]/50"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* SUBMIT BUTTON */}
                                    <motion.button
                                        type="submit"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25 }}
                                        whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(107, 29, 20, 0.15)" }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3.5 mt-6 bg-gradient-to-r from-[#6b1d14] to-[#7a2517] text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
                                    >
                                        <MdAdd size={18} />
                                        Save Faculty Member
                                    </motion.button>

                                    {/* CANCEL OPTION */}
                                    <motion.button
                                        type="button"
                                        onClick={() => setDrawerOpen(false)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        whileHover={{ backgroundColor: "#E8DFD3" }}
                                        className="w-full py-3 bg-[#EFE3D5] text-[#6b1d14] rounded-lg font-bold transition"
                                    >
                                        Cancel
                                    </motion.button>

                                </form>

                                {/* INFO BOX */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 }}
                                    className="mt-8 p-4 rounded-lg bg-[#D1B062]/10 border border-[#D1B062]/30 space-y-2"
                                >
                                    <p className="text-xs font-bold text-[#6b1d14] flex items-start gap-2">
                                        <span className="mt-1">ℹ️</span>
                                        Important Information
                                    </p>
                                    <p className="text-xs text-[#856966] leading-relaxed">
                                        Ensure all faculty information is accurate before saving. Faculty members will receive their details via email.
                                    </p>
                                </motion.div>

                            </div>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </main>
    );
};

export default FacultyManagement;
