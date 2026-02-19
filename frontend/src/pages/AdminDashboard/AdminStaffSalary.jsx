import React, { useEffect, useMemo, useState } from "react";
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
import {
    getAllStaff,
    createStaff,
    updateStaff,
    deleteStaff as deleteStaffApi,
    toggleStaffPayment
} from "../../lib/api";

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

    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

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

    const mapStaff = (item) => ({
        id: item?._id || item?.id,
        name: item?.name || "",
        role: item?.role || "",
        salary: item?.salary ?? 0,
        bonus: item?.bonus ?? 0,
        deduction: item?.deduction ?? 0,
        status: item?.status === "INACTIVE" ? "Inactive" : "Active",
        paid: !!item?.paid,
        image: item?.image || ""
    });

    const buildPayload = (data) => ({
        name: data.name?.trim(),
        role: data.role?.trim(),
        salary: Number(data.salary) || 0,
        bonus: Number(data.bonus) || 0,
        deduction: Number(data.deduction) || 0,
        status: data.status === "Inactive" ? "INACTIVE" : "ACTIVE",
        image: data.image || ""
    });

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await getAllStaff();
                const payload = response?.data ?? response;
                const list = payload?.data ?? payload ?? [];
                const mapped = Array.isArray(list) ? list.map(mapStaff) : [];
                setStaff(mapped);
            } catch (err) {
                console.error("Failed to load staff:", err);
                setError("Failed to load staff. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

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

    const saveStaff = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.role.trim() || !form.salary) {
            alert("Please fill all required fields.");
            return;
        }
        try {
            setSaving(true);
            const payload = buildPayload(form);
            if (editId) {
                const response = await updateStaff(editId, payload);
                const updated = response?.data ?? response;
                const updatedStaff = updated?.data ?? updated;
                setStaff(prev =>
                    prev.map(s => s.id === editId ? mapStaff(updatedStaff) : s)
                );
            } else {
                const response = await createStaff(payload);
                const created = response?.data ?? response;
                const createdStaff = created?.data ?? created;
                if (createdStaff) {
                    setStaff(prev => [mapStaff(createdStaff), ...prev]);
                }
            }
            setDrawerOpen(false);
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
        } catch (err) {
            console.error("Failed to save staff:", err);
            alert(err?.response?.data?.message || "Failed to save staff.");
        } finally {
            setSaving(false);
        }
    };

    const deleteStaff = async (id) => {
        if (!window.confirm("Delete this staff member?")) return;
        try {
            await deleteStaffApi(id);
            setStaff(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error("Failed to delete staff:", err);
            alert("Failed to delete staff.");
        }
    };

    const togglePay = async (id) => {
        try {
            const response = await toggleStaffPayment(id);
            const nextPaid = response?.paid ?? response?.data?.paid;
            setStaff(prev =>
                prev.map(s =>
                    s.id === id ? { ...s, paid: typeof nextPaid === "boolean" ? nextPaid : !s.paid } : s
                )
            );
        } catch (err) {
            console.error("Failed to update payment status:", err);
            alert("Failed to update payment status.");
        }
    };

    /* ================= UI ================= */

    return (
        <main className="min-h-screen bg-[#F3E6C9] p-8 space-y-10">

            {/* ================= PREMIUM HEADER ================= */}
            <div
                className="relative overflow-hidden rounded-3xl px-8 py-10 text-white shadow-lg"
                style={{
                    background:
                        "linear-gradient(135deg,#7a1f16 0%, #8c2a1e 45%, #6b1d14 100%)",
                }}
            >
                {/* texture overlay */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,#D4AF37,transparent_60%)]" />

                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                    {/* LEFT */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                            Staff Salary Management
                        </h1>
                        <p className="text-sm text-white/90 mt-1">
                            Manage staff payroll, schedule payments and control academy salary structure.
                        </p>
                    </div>

                    {/* RIGHT BUTTON */}
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-[#e6b86a] hover:bg-[#d9a956] text-[#4a2b07] px-5 py-2 rounded-xl text-sm font-semibold shadow transition"
                    >
                        <MdAdd />
                        Add Staff
                    </button>

                </div>
            </div>

            {/* ================= FLOATING STATS CARDS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 -mt-14 relative z-10">

                {[
                    { label: "Total Staff", value: stats.total },
                    { label: "Active", value: stats.active },
                    { label: "Salary Paid", value: stats.paid },
                    { label: "Pending", value: stats.pending }
                ].map((card, i) => (
                    <div
                        key={i}
                        className="bg-[#FBF4E2] rounded-2xl p-6 shadow-md flex items-center justify-between"
                    >
                        <div>
                            <p className="text-sm text-[#7c5a3c]">{card.label}</p>
                            <h3 className="text-3xl font-black text-[#6b1d14]">
                                {card.value}
                            </h3>
                        </div>
                    </div>
                ))}

            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading && (
                    <div className="text-sm text-[#74271E]/70">Loading staff...</div>
                )}
                {!loading && error && (
                    <div className="text-sm text-red-600">{error}</div>
                )}
                {!loading && !error && filteredStaff.length === 0 && (
                    <div className="text-sm text-[#74271E]/70">No staff found.</div>
                )}
                {!loading && !error && filteredStaff.map(s => {

                    const finalSalary =
                        Number(s.salary || 0) +
                        Number(s.bonus || 0) -
                        Number(s.deduction || 0);

                    return (
                        <motion.div
                            key={s.id}
                            layout
                            className="bg-[#FBF4E2] w-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-transform transform hover:scale-105 border border-transparent"
                        >

                            {/* IMAGE */}
                            <div className="flex justify-center mt-4">
                                <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                                    {s.image ? (
                                        <img src={s.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <MdPerson className="text-5xl text-gray-500" />
                                    )}
                                </div>
                            </div>

                            {/* BODY */}
                            <div className="p-6 text-center space-y-2">

                                <h3 className="text-lg font-semibold text-gray-800">{s.name}</h3>
                                <p className="text-sm text-gray-500">{s.role}</p>

                                <div className="mt-3 text-md font-medium text-gray-700">
                                    Salary: ₹{finalSalary}
                                </div>

                                {/* STATUS */}
                                <div className="flex justify-center items-center mt-4 space-x-2">

                                    <button
                                        onClick={() => togglePay(s.id)}
                                        className={`px-4 py-1 rounded-full text-xs font-semibold ${s.paid
                                            ? "bg-green-100 text-green-600"
                                            : "bg-orange-100 text-orange-500"
                                            }`}
                                    >
                                        {s.paid ? "Paid" : "Pending"}
                                    </button>

                                </div>

                                <div className="flex justify-center gap-3 mt-3">
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
                                    disabled={saving}
                                    className="w-full py-3 text-white rounded-xl"
                                    style={{ backgroundColor: palette.primary }}
                                >
                                    {saving ? "Saving..." : "SAVE STAFF"}
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
