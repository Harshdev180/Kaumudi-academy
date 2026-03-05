import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdPerson,
  MdSchool,
  MdAdd,
  MdClose,
  MdEdit,
  MdDelete,
  MdToggleOn,
  MdToggleOff,
  MdBookmark,
} from "react-icons/md";
import { IndianRupee } from "lucide-react";
import {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  toggleStaffStatus,
  toggleStaffPayment,
} from "../../lib/api";

const FacultyManagement = () => {
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [paymentUpdatingId, setPaymentUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [faculty, setFaculty] = useState([]);

  const [form, setForm] = useState({
    name: "",
    role: "",
    salary: "",
    description: "",
    bonus: "",
    deduction: "",
    status: "ACTIVE",
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    const fetchFaculty = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAllStaff();
        const payload = response?.data ?? response;
        const list = payload?.data ?? payload ?? [];
        if (mounted) {
          const mapped = Array.isArray(list)
            ? list.map((item) => ({
                id: item?._id || item?.id,
                name: item?.name || "Unnamed",
                course: item?.role || "Faculty",
                description: item?.description || "",
                salary: item?.salary ?? 0,
                bonus: item?.bonus ?? 0,
                deduction: item?.deduction ?? 0,
                netSalary: item?.netSalary ?? item?.salary ?? 0,
                status: item?.status || "ACTIVE",
                paid: !!item?.paid,
              }))
            : [];
          setFaculty(mapped);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err?.response?.data?.message || "Failed to load faculty list.",
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchFaculty();
    return () => {
      mounted = false;
    };
  }, []);

  /* ================= STATS ================= */

  const stats = useMemo(() => {
    const total = faculty.length;
    const active = faculty.filter((f) => f.status === "ACTIVE").length;
    const inactive = faculty.filter((f) => f.status === "INACTIVE").length;
    const paid = faculty.filter((f) => f.paid).length;
    const pending = total - paid;
    return { total, active, inactive, paid, pending };
  }, [faculty]);

  /* ================= ADD FACULTY ================= */

  const resetForm = () => {
    setForm({
      name: "",
      role: "",
      salary: "",
      bonus: "",
      description: "",
      deduction: "",
      status: "ACTIVE",
    });
    setValidationErrors({});
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setDrawerOpen(true);
  };

  const openEdit = (item) => {
    setForm({
      name: item.name || "",
      role: item.course || "",
      salary: item.salary ?? "",
      description: item.description || "",
      bonus: item.bonus ?? "",
      deduction: item.deduction ?? "",
      status: item.status || "ACTIVE",
    });
    setEditingId(item.id);
    setDrawerOpen(true);
  };

  const addFaculty = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setValidationErrors({});

    // Validate numeric fields
    const errors = {};

    // Salary validation
    const salaryStr = String(form.salary || "");
    const salaryNum = Number(form.salary);
    if (!form.salary || salaryStr.trim() === "") {
      errors.salary = "Salary is required";
    } else if (isNaN(salaryNum) || salaryNum < 0) {
      errors.salary = "Salary must be a valid positive number";
    }

    // Bonus validation (optional but must be valid if provided)
    const bonusStr = String(form.bonus || "");
    if (bonusStr && bonusStr.trim() !== "") {
      const bonusNum = Number(form.bonus);
      if (isNaN(bonusNum) || bonusNum < 0) {
        errors.bonus = "Bonus must be a valid positive number";
      }
    }

    // Deduction validation (optional but must be valid if provided)
    const deductionStr = String(form.deduction || "");
    if (deductionStr && deductionStr.trim() !== "") {
      const deductionNum = Number(form.deduction);
      if (isNaN(deductionNum) || deductionNum < 0) {
        errors.deduction = "Deduction must be a valid positive number";
      }
    }

    // Name validation
    if (!form.name || form.name.trim() === "") {
      errors.name = "Faculty name is required";
    }

    // Role validation
    if (!form.role || form.role.trim() === "") {
      errors.role = "Faculty role is required";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSubmitting(false);
      return;
    }

    try {
      const requestPayload = {
        name: form.name,
        role: form.role,
        salary: form.salary,
        bonus: form.bonus || 0,
        description: form?.description,
        deduction: form.deduction || 0,
        status: form.status || "ACTIVE",
      };

      const response = editingId
        ? await updateStaff(editingId, requestPayload)
        : await createStaff(requestPayload);
      const responsePayload = response?.data ?? response;
      const created = responsePayload?.data ?? responsePayload;
      const next = created
        ? {
            id: created?._id || created?.id,
            name: created?.name || form.name,
            course: created?.role || form.role,
            description: created?.description ?? form.description ?? "",
            salary: created?.salary ?? form.salary,
            bonus: created?.bonus ?? form.bonus ?? 0,
            deduction: created?.deduction ?? form.deduction ?? 0,
            netSalary: created?.netSalary ?? created?.salary ?? form.salary,
            status: created?.status || form.status || "ACTIVE",
            paid: !!created?.paid,
          }
        : {
            id: Date.now(),
            name: form.name,
            course: form.role,
            description: form.description,
            salary: form.salary,
            bonus: form.bonus || 0,
            deduction: form.deduction || 0,
            netSalary:
              Number(form.salary || 0) +
              Number(form.bonus || 0) -
              Number(form.deduction || 0),
            status: form.status || "ACTIVE",
            paid: false,
          };

      setFaculty((prev) =>
        editingId
          ? prev.map((f) => (f.id === editingId ? next : f))
          : [next, ...prev],
      );
      resetForm();
      setDrawerOpen(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add faculty.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this faculty member?")) return;
    try {
      setDeletingId(id);
      await deleteStaff(id);
      setFaculty((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete faculty.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      setStatusUpdatingId(item.id);
      const response = await toggleStaffStatus(item.id);
      const payload = response?.data ?? response;
      const nextStatus =
        payload?.status || (item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE");
      setFaculty((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: nextStatus } : f)),
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update status.");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleTogglePayment = async (item) => {
    try {
      setPaymentUpdatingId(item.id);
      const response = await toggleStaffPayment(item.id);
      const payload = response?.data ?? response;
      const paid =
        typeof payload?.paid === "boolean" ? payload.paid : !item.paid;
      setFaculty((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, paid } : f)),
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update payment.");
    } finally {
      setPaymentUpdatingId(null);
    }
  };

  const formatMoney = (value) => {
    const num = Number(value || 0);
    return num.toLocaleString("en-IN");
  };

  return (
    <main className="min-h-screen bg-[#F3E6C9] p-6 space-y-8">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl px-8 py-10 text-white shadow-lg bg-[#6b1d14]">
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
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#e6b86a] text-[#4a2b07] px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
          >
            <MdAdd /> Add Faculty
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 -mt-14 relative z-10">
        {[
          { label: "Total Faculty", value: stats.total },
          { label: "Active", value: stats.active },
          { label: "Inactive", value: stats.inactive },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-[#FBF4E2] rounded-2xl p-6 shadow-md"
          >
            <p className="text-sm text-[#7c5a3c]">{card.label}</p>
            <h3 className="text-3xl font-black text-[#6b1d14]">{card.value}</h3>
          </div>
        ))}
      </div>

      {error && <div className="text-red-600 font-semibold">{error}</div>}

      {/* FACULTY CARDS */}
      {!loading && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 ">
          {faculty.map((f) => (
            <motion.div
              key={f.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FBF4E2] rounded-3xl p-6 shadow-md border border-[#D1B062]/40 "
            >
              {/* TOP */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 text-[#6b1d14] flex items-center justify-center flex-shrink-0">
                  <MdPerson size={24} />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-[#6b1d14] text-base">
                    {f.name}
                  </h3>
                  <p className="text-xs text-[#856966]">{f.course}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                    f.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-zinc-200 text-zinc-600"
                  }`}
                >
                  {f.status}
                </span>
                {/* <span
                  className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                    f.paid
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {f.paid == "Paid" }
                </span> */}
              </div>

              {/* DETAILS WITH ACTIONS */}
              <div className="flex justify-between items-start gap-1 ">
                {/* LEFT: DETAILS */}
                <div className="space-y-2.5 text-xs md:text-sm text-[#4A2B07] flex-1">
                  <div className="flex items-center gap-2">
                    <MdSchool
                      className="text-[#6b1d14] flex-shrink-0"
                      size={18}
                    />
                    <span>{f.course}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <IndianRupee
                      className="text-[#6b1d14] flex-shrink-0"
                      size={18}
                    />
                    <span>Salary: {formatMoney(f.salary)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <IndianRupee
                      className="text-[#6b1d14] flex-shrink-0"
                      size={18}
                    />
                    <span>Net: {formatMoney(f.netSalary)}</span>
                  </div>

                  {(Number(f.bonus) > 0 || Number(f.deduction) > 0) && (
                    <div className="text-xs text-[#856966] pt-1">
                      Bonus: {formatMoney(f.bonus)} · Deduction:{" "}
                      {formatMoney(f.deduction)}
                    </div>
                  )}
                </div>

                {/* RIGHT: ACTION ICONS */}
                <div className="flex flex-col gap-2 pt-1 -mr-1">
                  <motion.button
                    onClick={() => openEdit(f)}
                    title="Edit"
                    whileHover={{ scale: 1.2, color: "#8a2a1f" }}
                    whileTap={{ scale: 0.9 }}
                    className="text-[#6b1d14] hover:text-[#8a2a1f] transition flex-shrink-0"
                  >
                    <MdEdit size={22} />
                  </motion.button>

                  <motion.button
                    onClick={() => handleDelete(f.id)}
                    disabled={deletingId === f.id}
                    title="Delete"
                    whileHover={{ scale: 1.2, color: "#dc2626" }}
                    whileTap={{ scale: 0.9 }}
                    className="text-red-600 hover:text-red-700 transition disabled:opacity-60 flex-shrink-0"
                  >
                    <MdDelete size={22} />
                  </motion.button>

                  <motion.button
                    onClick={() => handleToggleStatus(f)}
                    disabled={statusUpdatingId === f.id}
                    title={f.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    whileHover={{ scale: 1.2, color: "#8a2a1f" }}
                    whileTap={{ scale: 0.9 }}
                    className="text-[#6b1d14] hover:text-[#8a2a1f] transition disabled:opacity-60 flex-shrink-0"
                  >
                    {f.status === "ACTIVE" ? (
                      <MdToggleOn size={22} />
                    ) : (
                      <MdToggleOff size={22} />
                    )}
                  </motion.button>
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
                      <h2 className="text-2xl font-black text-[#6b1d14]">
                        Add Faculty
                      </h2>
                      <p className="text-xs text-[#856966] font-medium">
                        Create new faculty member
                      </p>
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
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg bg-white border-2 ${validationErrors.name ? "border-red-500 focus:border-red-500" : "border-[#D1B062]/30 focus:border-[#D1B062]"} focus:outline-none transition text-[#6b1d14] placeholder-[#856966]/50`}
                    />
                    {validationErrors.name && (
                      <p className="text-xs text-red-500 font-medium">
                        {validationErrors.name}
                      </p>
                    )}
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
                      Faculty Role
                    </label>
                    <input
                      required
                      placeholder="e.g., Paninian Grammar"
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg bg-white border-2 ${validationErrors.role ? "border-red-500 focus:border-red-500" : "border-[#D1B062]/30 focus:border-[#D1B062]"} focus:outline-none transition text-[#6b1d14] placeholder-[#856966]/50`}
                    />
                    {validationErrors.role && (
                      <p className="text-xs text-red-500 font-medium">
                        {validationErrors.role}
                      </p>
                    )}
                  </motion.div>

                  {/* DESCRIPTION FIELD */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.17 }}
                    className="space-y-2"
                  >
                    <label className="text-xs font-bold text-[#6b1d14] uppercase tracking-wider flex items-center gap-2">
                      Description
                    </label>

                    <textarea
                      rows={4}
                      placeholder="Write faculty description..."
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white border-2 border-[#D1B062]/30 focus:border-[#D1B062] focus:outline-none transition text-[#6b1d14] placeholder-[#856966]/50 resize-none"
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
                      <IndianRupee size={14} />
                      Monthly Salary
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#856966] font-bold">
                        ₹
                      </span>
                      <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="25000"
                        value={form.salary}
                        onChange={(e) =>
                          setForm({ ...form, salary: e.target.value })
                        }
                        className={`w-full px-4 py-3 pl-7 rounded-lg bg-white border-2 ${validationErrors.salary ? "border-red-500 focus:border-red-500" : "border-[#D1B062]/30 focus:border-[#D1B062]"} focus:outline-none transition text-[#6b1d14] placeholder-[#856966]/50`}
                      />
                    </div>
                    {validationErrors.salary && (
                      <p className="text-xs text-red-500 font-medium">
                        {validationErrors.salary}
                      </p>
                    )}
                  </motion.div>

                  {/* BONUS FIELD */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22 }}
                    className="space-y-2"
                  >
                    <label className="text-xs font-bold text-[#6b1d14] uppercase tracking-wider flex items-center gap-2">
                      <IndianRupee size={14} />
                      Bonus
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      value={form.bonus}
                      onChange={(e) =>
                        setForm({ ...form, bonus: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg bg-white border-2 ${validationErrors.bonus ? "border-red-500 focus:border-red-500" : "border-[#D1B062]/30 focus:border-[#D1B062]"} focus:outline-none transition text-[#6b1d14] placeholder-[#856966]/50`}
                    />
                    {validationErrors.bonus && (
                      <p className="text-xs text-red-500 font-medium">
                        {validationErrors.bonus}
                      </p>
                    )}
                  </motion.div>

                  {/* DEDUCTION FIELD */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24 }}
                    className="space-y-2"
                  >
                    <label className="text-xs font-bold text-[#6b1d14] uppercase tracking-wider flex items-center gap-2">
                      <IndianRupee size={14} />
                      Deduction
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      value={form.deduction}
                      onChange={(e) =>
                        setForm({ ...form, deduction: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-lg bg-white border-2 ${validationErrors.deduction ? "border-red-500 focus:border-red-500" : "border-[#D1B062]/30 focus:border-[#D1B062]"} focus:outline-none transition text-[#6b1d14] placeholder-[#856966]/50`}
                    />
                    {validationErrors.deduction && (
                      <p className="text-xs text-red-500 font-medium">
                        {validationErrors.deduction}
                      </p>
                    )}
                  </motion.div>

                  {/* STATUS FIELD */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.26 }}
                    className="space-y-2"
                  >
                    <label className="text-xs font-bold text-[#6b1d14] uppercase tracking-wider flex items-center gap-2">
                      <MdBookmark size={14} />
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white border-2 border-[#D1B062]/30 focus:border-[#D1B062] focus:outline-none transition text-[#6b1d14]"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </motion.div>

                  {/* SUBMIT BUTTON */}
                  <motion.button
                    type="submit"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 8px 20px rgba(107, 29, 20, 0.15)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    disabled={submitting}
                    className="w-full py-3.5 mt-6 bg-gradient-to-r from-[#6b1d14] to-[#7a2517] text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
                  >
                    <MdAdd size={18} />
                    {submitting
                      ? "Saving..."
                      : editingId
                        ? "Update Faculty Member"
                        : "Save Faculty Member"}
                  </motion.button>

                  {/* CANCEL OPTION */}
                  <motion.button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setDrawerOpen(false);
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ backgroundColor: "#E8DFD3" }}
                    className="w-full py-3 bg-[#EFE3D5] text-[#6b1d14] rounded-lg font-bold transition"
                  >
                    Cancel
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
};

export default FacultyManagement;
