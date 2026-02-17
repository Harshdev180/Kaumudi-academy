import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Plus, Percent, Copy, Power } from "lucide-react";
import { createCoupon, toggleCouponStatus, getAllCouponsForAdmin } from "../../lib/api";

/* STATUS AUTOMATION */
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
    const [coupons, setCoupons] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        code: "",
        discount: "",
        startTime: "",
        endTime: "",
    });

    const copyCode = (code) => navigator.clipboard.writeText(code);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await getAllCouponsForAdmin();
                const payload = response?.data ?? response;
                const list = payload?.data ?? payload ?? [];
                const mapped = Array.isArray(list)
                    ? list.map((c) => ({
                        id: c._id || c.id,
                        code: c.code,
                        discount: c.discountPercentage,
                        startTime: c.startTime,
                        endTime: c.endTime,
                        isActive: c.isActive ?? true,
                    }))
                    : [];
                setCoupons(mapped);
            } catch (err) {
                console.error("Failed to fetch coupons:", err);
                setError("Failed to load coupons.");
            } finally {
                setLoading(false);
            }
        };
        fetchCoupons();
    }, []);

    const handleSaveCoupon = async () => {
        if (!formData.code || !formData.discount || !formData.startTime || !formData.endTime) return;

        try {
            const response = await createCoupon({
                code: formData.code,
                discountPercentage: Number(formData.discount),
                startTime: formData.startTime,
                endTime: formData.endTime,
            });

            const payload = response?.data ?? response;
            const created = payload?.data ?? payload;

            if (created) {
                setCoupons((prev) => [
                    ...prev,
                    {
                        id: created._id || Date.now(),
                        code: created.code,
                        discount: created.discountPercentage,
                        startTime: created.startTime,
                        endTime: created.endTime,
                        isActive: created.isActive ?? true,
                    },
                ]);
            }

            setShowForm(false);
            setFormData({
                code: "",
                discount: "",
                startTime: "",
                endTime: "",
            });
        } catch (error) {
            console.error("Failed to create coupon:", error);
            alert(error?.response?.data?.message || "Failed to create coupon.");
        }
    };

    const handleToggleCoupon = async (coupon) => {
        try {
            const response = await toggleCouponStatus(coupon.id);
            const nextActive = response?.isActive ?? response?.data?.isActive;
            setCoupons((prev) =>
                prev.map((c) =>
                    c.id === coupon.id ? { ...c, isActive: typeof nextActive === "boolean" ? nextActive : !c.isActive } : c
                )
            );
        } catch (error) {
            console.error("Failed to toggle coupon:", error);
            alert("Failed to toggle coupon.");
        }
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
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-[#D4AF37] text-[#74271E] px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
                    >
                        <Plus size={16} />
                        Create Coupon
                    </button>
                </div>
            </div>

            {/* COUPON LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading && (
                    <div className="text-sm text-[#74271E]/70">Loading coupons...</div>
                )}
                {!loading && error && (
                    <div className="text-sm text-red-600">{error}</div>
                )}
                {!loading && !error && coupons.length === 0 && (
                    <div className="text-sm text-[#74271E]/70">No coupons yet. Create one to get started.</div>
                )}
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

                                <Percent className="text-[#D4AF37]" />
                            </div>

                            <p className="text-2xl font-black text-[#74271E] mt-2">
                                {coupon.discount}% OFF
                            </p>

                            <div className="flex items-center gap-2 text-xs text-[#74271E]/60 mt-3">
                                <Clock size={14} />
                                Valid Till {new Date(coupon.endTime).toLocaleDateString()}
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
                                    onClick={() => handleToggleCoupon(coupon)}
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
                    onClick={() => setShowForm(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.96 }}
                        transition={{ duration: 0.25 }}
                        className="w-[420px] rounded-[28px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.2)] relative"
                    >

                        {/* TOP HEADER */}
                        <div className="bg-gradient-to-r from-[#74271E] via-[#8a2a1f] to-[#5a1b14] px-6 py-5 text-white relative">
                            <h3 className="text-xl font-black">
                                Create Coupon
                            </h3>

                            <button
                                onClick={() => setShowForm(false)}
                                className="absolute right-4 top-4 text-white/80 hover:text-white transition"
                            >
                                x
                            </button>
                        </div>

                        {/* FORM BODY */}
                        <div className="bg-[#FBF4E2] p-6 space-y-4">
                            <input
                                placeholder="Coupon Code"
                                value={formData.code}
                                onChange={(e) =>
                                    setFormData({ ...formData, code: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-[#74271E]/20 bg-[#F3E6C9]"
                            />

                            <input
                                placeholder="Discount %"
                                value={formData.discount}
                                onChange={(e) =>
                                    setFormData({ ...formData, discount: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-[#74271E]/20 bg-[#F3E6C9]"
                            />

                            <input
                                type="datetime-local"
                                value={formData.startTime}
                                onChange={(e) =>
                                    setFormData({ ...formData, startTime: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-[#74271E]/20 bg-[#F3E6C9]"
                            />

                            <input
                                type="datetime-local"
                                value={formData.endTime}
                                onChange={(e) =>
                                    setFormData({ ...formData, endTime: e.target.value })
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
