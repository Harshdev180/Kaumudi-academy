import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

function EnrollmentEditDrawer({
    open,
    onClose,
    form,
    setForm,
    onSave
}) {

    if (!open) return null;

    return (
        <AnimatePresence>

            {/* OVERLAY */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
            />

            {/* DRAWER */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className=" fixed right-4 top-[72px] lg:top-[76px] bottom-4 w-[420px] max-w-[92vw] bg-[#FBF4E2] rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.25)] border border-[#D1B062]/30 z-[200] flex flex-col overflow-hidden"
            >

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#D1B062]/30">

                    <h2 className="text-xl font-bold text-[#6b1d14]">
                        Edit Enrollment
                    </h2>

                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl bg-[#EFE3D5] flex items-center justify-center hover:scale-105 transition"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

                    {/* NAME */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#856966] uppercase">
                            Student Name
                        </label>

                        <input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full p-3 rounded-xl bg-[#EFE3D5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        />
                    </div>

                    {/* COURSE FIELD */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#856966] uppercase">
                            Course
                        </label>

                        <input
                            value={form.course}
                            onChange={(e) => setForm({ ...form, course: e.target.value })}
                            className="w-full p-3 rounded-xl bg-[#EFE3D5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        />
                    </div>

                    {/* PAYMENT STATUS */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#856966] uppercase">
                            Payment Status
                        </label>

                        <select
                            value={form.payment}
                            onChange={(e) => setForm({ ...form, payment: e.target.value })}
                            className="w-full p-3 rounded-xl bg-[#EFE3D5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        >
                            <option>Pending</option>
                            <option>Paid</option>
                        </select>
                    </div>

                </div>

                {/* FOOTER */}
                <div className="px-6 py-5 border-t border-[#D1B062]/30">

                    <button
                        onClick={onSave}
                        className="
              w-full py-3 rounded-xl
              bg-gradient-to-r from-[#6b1d14] to-[#8a2a1f]
              text-white font-semibold
              hover:scale-[1.02]
              active:scale-[0.98]
              transition
            "
                    >
                        Save Changes
                    </button>

                </div>

            </motion.div>

        </AnimatePresence>
    );
}

export default EnrollmentEditDrawer;
