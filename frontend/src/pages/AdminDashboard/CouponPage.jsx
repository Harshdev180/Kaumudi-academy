import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Plus, Power, Edit2, Trash2 } from "lucide-react";
import { createCoupon, toggleCouponStatus } from "../../lib/api";

/* ================= STATUS ================= */
const getStatus = (coupon) => {
    const now = new Date();
    const start = new Date(coupon.startTime);
    const end = new Date(coupon.endTime);

    if (!coupon.isActive) return "disabled";
    if (now < start) return "upcoming";
    if (now > end) return "expired";
    return "active";
};

function CouponPage() {

    /* ⭐ STATIC DATA WAPAS */
    const [coupons, setCoupons] = useState([
        {
            id: 1,
            code: "SANSKRIT10",
            type: "percentage",
            discount: 10,
            startTime: "2026-01-01T00:00",
            endTime: "2026-12-31T00:00",
            isActive: true
        },
        {
            id: 2,
            code: "FLAT500",
            type: "flat",
            discount: 500,
            startTime: "2026-01-01T00:00",
            endTime: "2026-08-30T00:00",
            isActive: true
        }
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        code: "",
        type: "percentage",
        discount: "",
        startTime: "",
        endTime: "",
    });

    /* ================= SAVE ================= */
    const handleSaveCoupon = async () => {

        if (!formData.code || !formData.discount) return;

        const newCoupon = {
            id: editId || Date.now(),
            code: formData.code,
            type: formData.type,
            discount: Number(formData.discount),
            startTime: formData.startTime,
            endTime: formData.endTime,
            isActive: true
        };

        try {
            // ⭐ API TRY (FAIL HO TO BHI UI SAVE HOGA)
            await createCoupon({
                code: formData.code,
                discountType: formData.type,
                discountValue: Number(formData.discount),
                startTime: formData.startTime,
                endTime: formData.endTime,
            });
        } catch (err) {
            console.log("API failed but UI updated");
        }

        if (editId) {
            setCoupons(prev =>
                prev.map(c => (c.id === editId ? newCoupon : c))
            );
        } else {
            setCoupons(prev => [newCoupon, ...prev]);
        }

        setEditId(null);
        setShowForm(false);

        setFormData({
            code: "",
            type: "percentage",
            discount: "",
            startTime: "",
            endTime: "",
        });
    };

    /* ================= EDIT ================= */
    const openEdit = (coupon) => {
        setEditId(coupon.id);
        setFormData({
            code: coupon.code,
            type: coupon.type,
            discount: coupon.discount,
            startTime: coupon.startTime,
            endTime: coupon.endTime,
        });
        setShowForm(true);
    };

    /* ================= DELETE ================= */
    const deleteCoupon = (id) => {
        setCoupons(prev => prev.filter(c => c.id !== id));
    };

    /* ================= TOGGLE ================= */
    const handleToggleCoupon = async (coupon) => {
        try {
            await toggleCouponStatus(coupon.id);
        } catch (e) {
            console.log("API toggle fail but UI updated");
        }

        setCoupons(prev =>
            prev.map(c =>
                c.id === coupon.id ? { ...c, isActive: !c.isActive } : c
            )
        );
    };

    const statusColor = {
        active: "bg-green-100 text-green-600",
        expired: "bg-red-100 text-red-600",
        upcoming: "bg-yellow-100 text-yellow-600",
        disabled: "bg-gray-100 text-gray-500",
    };

    return (
        <div className="min-h-screen bg-[#F1E4C8] p-6 space-y-8">

            {/* HEADER */}
            <div className="rounded-3xl bg-gradient-to-r from-[#74271E] via-[#8a2a1f] to-[#5a1b14] text-white p-8 flex justify-between">
                <h2 className="text-3xl font-black">Coupon Control Center</h2>

                <button
                    onClick={() => {
                        setEditId(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 bg-[#D4AF37] text-[#74271E] px-5 py-2 rounded-full font-semibold"
                >
                    <Plus size={16} /> Create Coupon
                </button>
            </div>

            {/* COUPONS */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {coupons.map((coupon) => {
                    const status = getStatus(coupon);

                    return (
                        <motion.div key={coupon.id} whileHover={{ y: -4 }}
                            className="bg-[#FBF4E2] rounded-2xl p-5 border border-[#74271E]/10">

                            <span className={`text-xs px-3 py-1 rounded-full ${statusColor[status]}`}>
                                {status}
                            </span>

                            <h3 className="mt-3 font-bold text-[#74271E]">{coupon.code}</h3>

                            <p className="text-2xl font-black text-[#74271E] mt-2">
                                {coupon.type === "flat"
                                    ? `₹${coupon.discount} OFF`
                                    : `${coupon.discount}% OFF`}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-[#74271E]/60 mt-3">
                                <Clock size={14} />
                                {new Date(coupon.endTime).toLocaleDateString()}
                            </div>

                            <div className="flex gap-3 mt-4">

                                <button onClick={() => openEdit(coupon)}
                                    className="p-2 rounded-lg bg-[#74271E]/10 text-[#74271E]">
                                    <Edit2 size={16} />
                                </button>

                                <button onClick={() => deleteCoupon(coupon.id)}
                                    className="p-2 rounded-lg bg-red-100 text-red-600">
                                    <Trash2 size={16} />
                                </button>

                                <button onClick={() => handleToggleCoupon(coupon)}
                                    className="p-2 rounded-lg bg-[#D4AF37]/20 text-[#74271E]">
                                    <Power size={16} />
                                </button>

                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* DRAWER */}
            {showForm && (
                <div
                    onClick={() => setShowForm(false)}
                    className="fixed inset-0 bg-black/40 flex items-center justify-center"
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: .95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#FBF4E2] w-[420px] rounded-3xl overflow-hidden"
                    >

                        <div className="bg-[#74271E] text-white p-5 flex justify-between">
                            <h3>{editId ? "Edit Coupon" : "Create Coupon"}</h3>
                            <button onClick={() => setShowForm(false)}>✕</button>
                        </div>

                        <div className="p-6 space-y-4">

                            <input
                                placeholder="Coupon Code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="w-full p-3 rounded-xl bg-[#F3E6C9]"
                            />

                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full p-3 rounded-xl bg-[#F3E6C9]"
                            >
                                <option value="percentage">Percentage</option>
                                <option value="flat">Flat Amount</option>
                            </select>

                            <input
                                placeholder="Discount"
                                value={formData.discount}
                                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                className="w-full p-3 rounded-xl bg-[#F3E6C9]"
                            />

                            <input
                                type="datetime-local"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full p-3 rounded-xl bg-[#F3E6C9]"
                            />

                            <input
                                type="datetime-local"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full p-3 rounded-xl bg-[#F3E6C9]"
                            />

                            <button
                                onClick={handleSaveCoupon}
                                className="w-full bg-[#74271E] text-white py-3 rounded-xl">
                                Save Coupon
                            </button>

                        </div>
                    </motion.div>
                </div>
            )}

        </div>
    );
}

export default CouponPage;
