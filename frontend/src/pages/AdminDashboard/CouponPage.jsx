import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Plus, Percent, Copy, Pencil, IndianRupee, Power } from "lucide-react";

/*  COUPON DATA */
const initialCoupons = [
    {
        id: 1,
        code: "KAUMUDI10",
        discountType: "percentage",
        discount: 10,
        course: "Shlok",
        start: "2026-05-20T10:00",
        end: "2026-05-30T23:59",
        is_active: true,
    },
    {
        id: 2,
        code: "FLAT500",
        discountType: "flat",
        discount: 500,
        course: "BA",
        start: "2026-06-01T10:00",
        end: "2026-06-10T23:59",
        is_active: true,
    },
];

/* STATUS AUTOMATION */
const getStatus = (coupon) => {
    const now = new Date();
    const start = new Date(coupon.start);
    const end = new Date(coupon.end);

    if (!coupon.is_active) return "disabled";
    if (now < start) return "upcoming";
    if (now > end) return "expired";
    return "active";
};

function CouponPage() {
    const [coupons, setCoupons] = useState(initialCoupons);

    const [showForm, setShowForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    /* 🔥 FORM STATE UPDATED */
    const [formData, setFormData] = useState({
        code: "",
        discount: "",
        discountType: "percentage",
        course: "",
        start: "",
        end: "",
    });

    const copyCode = (code) => navigator.clipboard.writeText(code);

    /* SAVE CREATE + EDIT */
    const handleSaveCoupon = () => {
        if (!formData.code) return;

        if (editingCoupon) {
            setCoupons((prev) =>
                prev.map((c) =>
                    c.id === editingCoupon.id
                        ? {
                            ...c,
                            ...formData,
                            discount: Number(formData.discount),
                        }
                        : c
                )
            );
        } else {
            setCoupons((prev) => [
                ...prev,
                {
                    ...formData,
                    discount: Number(formData.discount),
                    id: Date.now(),
                    is_active: true,
                },
            ]);
        }

        setShowForm(false);
        setEditingCoupon(null);
        setFormData({
            code: "",
            discount: "",
            discountType: "percentage",
            course: "",
            start: "",
            end: "",
        });
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
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#74271E] via-[#8a2a1f] to-[#5a1b14] text-white p-8 shadow-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black">Coupon Control Center</h2>
                        <p className="text-white/80 text-sm mt-1">
                            Smart Discount Automation Panel
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setEditingCoupon(null);
                            setShowForm(true);
                        }}
                        className="flex items-center gap-2 bg-[#D4AF37] text-[#74271E] px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                    >
                        <Plus size={16} />
                        Create Coupon
                    </button>
                </div>
            </div>

            {/* COUPON LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {coupons.map((coupon) => {
                    const status = getStatus(coupon);

                    return (
                        <motion.div
                            key={coupon.id}
                            whileHover={{ y: -6 }}
                            className="bg-[#FBF4E2] rounded-2xl border border-[#74271E]/10 p-5 shadow-sm hover:shadow-xl transition"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <span
                                        className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor[status]}`}
                                    >
                                        {status.toUpperCase()}
                                    </span>

                                    <h3 className="mt-3 text-lg font-bold text-[#74271E]">
                                        {coupon.code}
                                    </h3>
                                </div>

                                {coupon.discountType === "percentage" ? (
                                    <Percent className="text-[#D4AF37]" />
                                ) : (
                                    <IndianRupee className="text-[#D4AF37]" />
                                )}
                            </div>

                            <p className="text-sm text-[#74271E]/70 mt-2">
                                Course: <span className="font-semibold">{coupon.course}</span>
                            </p>

                            {/* 🔥 AUTO TEXT CHANGE */}
                            <p className="text-2xl font-black text-[#74271E] mt-2">
                                {coupon.discountType === "percentage"
                                    ? `${coupon.discount}% OFF`
                                    : `₹${coupon.discount} OFF`}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-[#74271E]/60 mt-3">
                                <Clock size={14} />
                                Valid Till {new Date(coupon.end).toLocaleDateString()}
                            </div>

                            <div className="flex gap-3 mt-4 flex-wrap">
                                <button
                                    onClick={() => copyCode(coupon.code)}
                                    className="flex items-center gap-1 text-xs bg-[#74271E]/10 text-[#74271E] px-3 py-1 rounded-full hover:bg-[#74271E] hover:text-white transition"
                                >
                                    <Copy size={14} />
                                    Copy
                                </button>

                                <button
                                    onClick={() => {
                                        setEditingCoupon(coupon);
                                        setFormData(coupon);
                                        setShowForm(true);
                                    }}
                                    className="flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white transition"
                                >
                                    <Pencil size={14} />
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        setCoupons((prev) =>
                                            prev.map((c) =>
                                                c.id === coupon.id
                                                    ? { ...c, is_active: !c.is_active }
                                                    : c
                                            )
                                        )
                                    }
                                    className="text-xs bg-[#D4AF37]/20 text-[#74271E] px-3 py-1 rounded-full hover:bg-[#D4AF37] hover:text-white transition"
                                >
                                    <Power />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* MODAL */}
            {showForm && (
                <div
                    onClick={() => setShowForm(false)} // ✅ Outside click close
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.96 }}
                        transition={{ duration: 0.25 }}
                        className="w-[420px] rounded-[28px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.2)] relative"
                    >

                        {/* 🔥 TOP HEADER */}
                        <div className="bg-gradient-to-r from-[#74271E] via-[#8a2a1f] to-[#5a1b14] px-6 py-5 text-white relative">

                            <h3 className="text-xl font-black">
                                {editingCoupon ? "Edit Coupon" : "Create Coupon"}
                            </h3>

                            {/* ✅ CLOSE BUTTON */}
                            <button
                                onClick={() => setShowForm(false)}
                                className="absolute right-4 top-4 text-white/80 hover:text-white transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* FORM BODY */}
                        <div className="bg-[#FBF4E2] p-6 space-y-4">

                            {/* Discount Type */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        setFormData({ ...formData, discountType: "percentage" })
                                    }
                                    className={`flex-1 py-2 rounded-xl text-xs font-semibold ${formData.discountType === "percentage"
                                        ? "bg-[#74271E] text-white"
                                        : "bg-[#F3E6C9] text-[#74271E]"
                                        }`}
                                >
                                    % Percentage
                                </button>

                                <button
                                    onClick={() =>
                                        setFormData({ ...formData, discountType: "flat" })
                                    }
                                    className={`flex-1 py-2 rounded-xl text-xs font-semibold ${formData.discountType === "flat"
                                        ? "bg-[#74271E] text-white"
                                        : "bg-[#F3E6C9] text-[#74271E]"
                                        }`}
                                >
                                    ₹ Flat
                                </button>
                            </div>

                            <input
                                placeholder="Coupon Code"
                                value={formData.code}
                                onChange={(e) =>
                                    setFormData({ ...formData, code: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-[#74271E]/20 bg-[#F3E6C9]"
                            />

                            <input
                                placeholder={
                                    formData.discountType === "percentage"
                                        ? "Discount %"
                                        : "Flat Amount ₹"
                                }
                                value={formData.discount}
                                onChange={(e) =>
                                    setFormData({ ...formData, discount: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-[#74271E]/20 bg-[#F3E6C9]"
                            />

                            <input
                                placeholder="Course Name"
                                value={formData.course}
                                onChange={(e) =>
                                    setFormData({ ...formData, course: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-[#74271E]/20 bg-[#F3E6C9]"
                            />

                            <input
                                type="datetime-local"
                                value={formData.start}
                                onChange={(e) =>
                                    setFormData({ ...formData, start: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-[#74271E]/20 bg-[#F3E6C9]"
                            />

                            <input
                                type="datetime-local"
                                value={formData.end}
                                onChange={(e) =>
                                    setFormData({ ...formData, end: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-[#74271E]/20 bg-[#F3E6C9]"
                            />

                            <button
                                onClick={handleSaveCoupon}
                                className="w-full bg-gradient-to-r from-[#74271E] via-[#8a2a1f] to-[#5a1b14] text-white font-semibold py-3 rounded-xl hover:scale-[1.02] transition"
                            >
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
