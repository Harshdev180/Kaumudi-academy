import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Plus, Power, Edit2, Trash2, X } from "lucide-react";
import {
  createCoupon,
  toggleCouponStatus,
  getAllCouponsForAdmin,
  updateCoupon,
  deleteCoupon,
} from "../../lib/api";

/* ================= STATUS ================= */
const getStatus = (coupon) => {
  const now = new Date();
  const start = new Date(coupon.startTime);
  const end = new Date(coupon.endTime);

  if (!coupon.isActive) return "disabled";
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
    return "disabled";
  if (now < start) return "upcoming";
  if (now > end) return "expired";
  return "active";
};

const formatInputDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

function CouponPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    discount: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    let mounted = true;
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAllCouponsForAdmin();
        const payload = response?.data ?? response;
        const list = payload?.data ?? payload ?? [];
        if (mounted) {
          const mapped = Array.isArray(list)
            ? list.map((c) => ({
              id: c?._id || c?.id,
              code: c?.code || "",
              type: c?.discountType || "percentage",
              discount:
                c?.discountValue ??
                c?.discountPercentage ??
                0,
              startTime: c?.startTime,
              endTime: c?.endTime,
              isActive: !!c?.isActive,
            }))
            : [];
          setCoupons(mapped);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.response?.data?.message || "Failed to load coupons.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCoupons();
    return () => {
      mounted = false;
    };
  }, []);

  const sortedCoupons = useMemo(() => {
    return [...coupons].sort((a, b) => {
      const aTime = new Date(a.startTime || 0).getTime();
      const bTime = new Date(b.startTime || 0).getTime();
      return bTime - aTime;
    });
  }, [coupons]);

  const discountWarning =
    formData.type === "percentage" &&
    Number(formData.discount || 0) > 100;

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  /* ================= SAVE ================= */
  const handleSaveCoupon = async () => {
    if (
      !formData.code ||
      !formData.discount ||
      !formData.startTime ||
      !formData.endTime
    )
      return;
    if (discountWarning) {
      setError("Percentage discount cannot exceed 100%");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        code: formData.code.trim().toUpperCase(),
        discountType: formData.type,
        discountValue: Number(formData.discount),
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      const response = editId
        ? await updateCoupon(editId, payload)
        : await createCoupon(payload);

      const apiPayload = response?.data ?? response;
      const created = apiPayload?.data ?? apiPayload;

      const nextCoupon = created
        ? {
          id: created?._id || created?.id,
          code: created?.code || payload.code,
          type: created?.discountType || payload.discountType,
          discount:
            created?.discountValue ??
            created?.discountPercentage ??
            payload.discountValue,
          startTime: created?.startTime || payload.startTime,
          endTime: created?.endTime || payload.endTime,
          isActive: !!created?.isActive,
        }
        : {
          id: editId || Date.now(),
          code: payload.code,
          type: payload.discountType,
          discount: payload.discountValue,
          startTime: payload.startTime,
          endTime: payload.endTime,
          isActive: true,
        };

      setCoupons((prev) =>
        editId
          ? prev.map((c) => (c.id === editId ? nextCoupon : c))
          : [nextCoupon, ...prev],
      );
      showToast(editId ? "Coupon updated" : "Coupon created");
      setEditId(null);
      setShowForm(false);
      setFormData({
        code: "",
        type: "percentage",
        discount: "",
        startTime: "",
        endTime: "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save coupon.");
    } finally {
      setSaving(false);
    }
  };

  /* ================= EDIT ================= */
  const openEdit = (coupon) => {
    setEditId(coupon.id);
    setFormData({
      code: coupon.code,
      type: coupon.type || "percentage",
      discount: coupon.discount,
      startTime: formatInputDate(coupon.startTime),
      endTime: formatInputDate(coupon.endTime),
    });
    setShowForm(true);
  };

  const handleDeleteCoupon = async (coupon) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      setDeletingId(coupon.id);
      await deleteCoupon(coupon.id);
      setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
      showToast("Coupon deleted");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to delete coupon.");
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= TOGGLE ================= */
  const handleToggleCoupon = async (coupon) => {
    try {
      setTogglingId(coupon.id);
      const response = await toggleCouponStatus(coupon.id);
      const payload = response?.data ?? response;
      const nextActive =
        typeof payload?.isActive === "boolean" ? payload.isActive : !coupon.isActive;

      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, isActive: nextActive } : c)),
      );
      showToast(nextActive ? "Coupon enabled" : "Coupon disabled");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to toggle coupon.");
    } finally {
      setTogglingId(null);
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
      {toast && (
        <div className="fixed top-6 right-6 z-[200] bg-[#74271E] text-white px-4 py-2 rounded-xl shadow-lg text-sm">
          {toast}
        </div>
      )}

      {/* HEADER */}
      <div className="rounded-3xl bg-gradient-to-r from-[#74271E] via-[#8a2a1f] to-[#5a1b14] text-white p-6 md:p-8 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
        <h2 className="text-sm md:text-3xl font-black w-full md:w-auto">Coupon Control Center</h2>

        <button
          onClick={() => {
            setEditId(null);
            setFormData({
              code: "",
              type: "percentage",
              discount: "",
              startTime: "",
              endTime: "",
            });
            setShowForm(true);
          }}
          className="flex items-center gap-1 bg-[#D4AF37] text-[#74271E] px-3 py-2 md:px-5 md:py-2 rounded-full font-semibold text-xs md:text-sm w-full md:w-auto justify-center"
        >
          <Plus size={18} />
          <span className="hidden md:inline">Create Coupon</span>
          <span className="md:hidden">New Coupon</span>
        </button>
      </div>

      {error && <div className="text-red-600 font-semibold">{error}</div>}

      {/* COUPONS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading && (
          <div className="text-[#74271E] text-sm">Loading coupons...</div>
        )}
        {!loading && sortedCoupons.length === 0 && (
          <div className="text-[#74271E]/70 text-sm">No coupons found.</div>
        )}

        {sortedCoupons.map((coupon) => {
          const status = getStatus(coupon);

          return (
            <motion.div
              key={coupon.id}
              whileHover={{ y: -4 }}
              className="bg-[#FBF4E2] rounded-2xl p-5 border border-[#74271E]/10"
            >
              <span
                className={`text-xs px-3 py-1 rounded-full ${statusColor[status]}`}
              >
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
                {coupon.endTime
                  ? new Date(coupon.endTime).toLocaleDateString()
                  : "--"}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => openEdit(coupon)}
                  className="p-2 rounded-lg bg-[#74271E]/10 text-[#74271E]"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={() => handleDeleteCoupon(coupon)}
                  disabled={deletingId === coupon.id}
                  className="p-2 rounded-lg bg-red-100 text-red-600 disabled:opacity-60"
                >
                  <Trash2 size={16} />
                </button>

                <button
                  onClick={() => handleToggleCoupon(coupon)}
                  disabled={togglingId === coupon.id}
                  className="p-2 rounded-lg bg-[#D4AF37]/20 text-[#74271E] disabled:opacity-60"
                >
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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#FBF4E2] w-[420px] rounded-3xl overflow-hidden"
          >
            <div className="bg-[#74271E] text-white p-5 flex justify-between">
              <h3>{editId ? "Edit Coupon" : "Create Coupon"}</h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 rounded-md hover:bg-white/10 transition"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                placeholder="Coupon Code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-[#F3E6C9]"
              />

              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-[#F3E6C9]"
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>

              <input
                placeholder="Discount"
                type="number"
                min="1"
                max={formData.type === "percentage" ? "100" : undefined}
                value={formData.discount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount: e.target.value,
                  })
                }
                className="w-full p-3 rounded-xl bg-[#F3E6C9]"
              />
              {discountWarning && (
                <div className="text-xs font-semibold text-red-600">
                  Percentage discount cannot exceed 100%.
                </div>
              )}

              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-[#F3E6C9]"
              />

              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-[#F3E6C9]"
              />

              <button
                onClick={handleSaveCoupon}
                disabled={saving}
                className="w-full bg-[#74271E] text-white py-3 rounded-xl disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Coupon"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default CouponPage;
