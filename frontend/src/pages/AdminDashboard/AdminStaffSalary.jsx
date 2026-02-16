import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MdAdd,
    MdEdit,
    MdDelete,
    MdSearch,
    MdPayments,
    MdPerson,
    MdClose
} from "react-icons/md";

const AdminStaffSalary = () => {

    /* ================= THEME ================= */
    const palette = {
        primary: "#6b1d14",
        parchment: "#FBF4E2",
        bg: "#F3E6C9",
        gold: "#D1B062",
        textMuted: "#856966"
    };

    /* ================= STATE ================= */

    const [staff, setStaff] = useState([
        {
            id: 1,
            name: "Ajay Sharma",
            role: "Sanskrit Teacher",
            salary: 25000,
            bonus: 2000,
            deduction: 0,
            status: "Active",
            paid: false,
            image: ""
        }
    ]);

    const [search, setSearch] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        role: "",
        salary: "",
        bonus: "",
        deduction: "",
        status: "Active",
        image: ""
    });

    /* ================= FILTER ================= */

    const filteredStaff = useMemo(() => {
        return staff.filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, staff]);

    /* ================= STATS ================= */

    const stats = {
        total: staff.length,
        active: staff.filter(s => s.status === "Active").length,
        paid: staff.filter(s => s.paid).length,
        pending: staff.filter(s => !s.paid).length
    };

    /* ================= CRUD ================= */

    const openAdd = () => {
        setEditId(null);
        setForm({
            name: "",
            role: "",
            salary: "",
            bonus: "",
            deduction: "",
            status: "Active",
            image: ""
        });
        setDrawerOpen(true);
    };

    const openEdit = (s) => {
        setEditId(s.id);
        setForm(s);
        setDrawerOpen(true);
    };

    const saveStaff = (e) => {
        e.preventDefault();

        if (editId) {
            setStaff(prev =>
                prev.map(s => s.id === editId ? { ...form, id: editId } : s)
            );
        } else {
            setStaff(prev => [
                { ...form, id: Date.now(), paid: false },
                ...prev
            ]);
        }

        setDrawerOpen(false);
    };

    const deleteStaff = (id) => {
        setStaff(prev => prev.filter(s => s.id !== id));
    };

    const togglePay = (id) => {
        setStaff(prev =>
            prev.map(s =>
                s.id === id ? { ...s, paid: !s.paid } : s
            )
        );
    };

    /* ================= UI ================= */

    return (
        <main className="min-h-screen bg-[#F3E6C9] p-8 space-y-8">

            {/* ================= HEADING ================= */}
            <div className="relative rounded-3xl overflow-hidden border border-[#D1B062]/30">
                <div className="absolute inset-0 bg-gradient-to-r from-[#6b1d14] via-[#7a2318] to-[#6b1d14]" />

                <div className="relative px-8 py-8 flex justify-between items-center text-white">
                    <div>
                        <h1 className="text-3xl font-black">Staff Salary Management</h1>
                        <p className="text-sm text-white/80">
                            Manage staff payroll, schedule payments and control academy salary structure.
                        </p>
                    </div>

                    <button
                        onClick={openAdd}
                        // className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl"
                        className="flex items-center gap-2 bg-[#D4AF37] text-[#74271E] px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"

                    >
                        <MdAdd /> Add Staff
                    </button>
                </div>
            </div>

            {/* ================= STATS ================= */}
            <div className="grid md:grid-cols-4 gap-6">
                {[
                    { label: "Total Staff", value: stats.total },
                    { label: "Active", value: stats.active },
                    { label: "Salary Paid", value: stats.paid },
                    { label: "Pending", value: stats.pending }
                ].map((card, i) => (
                    <div key={i} className="bg-[#FBF4E2] p-6 rounded-2xl border border-[#D1B062]/30">
                        <p className="text-xs text-[#856966]">{card.label}</p>
                        <h3 className="text-3xl font-black text-[#6b1d14]">{card.value}</h3>
                    </div>
                ))}
            </div>

            {/* ================= SEARCH ================= */}
            {/* <div className="relative w-full md:w-[350px]">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#856966]" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search staff..."
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#FBF4E2]"
                />
            </div> */}

            {/* ================= STAFF CARDS ================= */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {filteredStaff.map(s => {

                    const finalSalary =
                        Number(s.salary || 0) +
                        Number(s.bonus || 0) -
                        Number(s.deduction || 0);

                    return (
                        <motion.div
                            key={s.id}
                            layout
                            className="bg-[#FBF4E2] rounded-2xl overflow-hidden border border-[#D1B062]/30 shadow-sm"
                        >

                            {/* IMAGE */}
                            <div className="h-36 bg-[#EFE3D5] overflow-hidden">
                                {s.image ? (
                                    <img src={s.image} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#6b1d14] text-3xl">
                                        <MdPerson />
                                    </div>
                                )}
                            </div>

                            {/* BODY */}
                            <div className="p-5 space-y-3">

                                <h3 className="font-bold text-[#6b1d14]">{s.name}</h3>
                                <p className="text-sm text-[#78322a]">{s.role}</p>

                                <div className="text-sm text-[#714b47]">
                                    Salary: ₹{finalSalary}
                                </div>

                                {/* STATUS */}
                                <div className="flex justify-between items-center">

                                    <button
                                        onClick={() => togglePay(s.id)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${s.paid
                                                ? "bg-green-100 text-green-600"
                                                : "bg-orange-100 text-orange-500"
                                            }`}
                                    >
                                        {s.paid ? "Paid" : "Pending"}
                                    </button>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEdit(s)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <MdEdit />
                                        </button>

                                        <button
                                            onClick={() => deleteStaff(s.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <MdDelete />
                                        </button>
                                    </div>

                                </div>
                            </div>

                        </motion.div>
                    );
                })}
            </div>

            {/* ================= DRAWER ================= */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/30"
                            onClick={() => setDrawerOpen(false)}
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="fixed right-6 top-6 bottom-6 w-[420px] bg-[#F7EFE6] rounded-3xl p-6 z-50"
                        >

                            <div className="flex justify-between mb-6">
                                <h2 className="font-bold text-[#6b1d14]">
                                    {editId ? "Edit Staff" : "Add Staff"}
                                </h2>

                                <button onClick={() => setDrawerOpen(false)}>
                                    <MdClose />
                                </button>
                            </div>

                            <form onSubmit={saveStaff} className="space-y-4">

                                <input
                                    placeholder="Staff Name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full p-3 bg-[#EFE3D5] rounded-xl"
                                />

                                <input
                                    placeholder="Role"
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    className="w-full p-3 bg-[#EFE3D5] rounded-xl"
                                />

                                <div className="grid grid-cols-3 gap-2">
                                    <input
                                        placeholder="Salary"
                                        value={form.salary}
                                        onChange={(e) => setForm({ ...form, salary: e.target.value })}
                                        className="p-3 bg-[#EFE3D5] rounded-xl"
                                    />

                                    <input
                                        placeholder="Bonus"
                                        value={form.bonus}
                                        onChange={(e) => setForm({ ...form, bonus: e.target.value })}
                                        className="p-3 bg-[#EFE3D5] rounded-xl"
                                    />

                                    <input
                                        placeholder="Deduction"
                                        value={form.deduction}
                                        onChange={(e) => setForm({ ...form, deduction: e.target.value })}
                                        className="p-3 bg-[#EFE3D5] rounded-xl"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 text-white rounded-xl"
                                    style={{ backgroundColor: palette.primary }}
                                >
                                    SAVE STAFF
                                </button>

                            </form>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </main>
    );
};

export default AdminStaffSalary;
