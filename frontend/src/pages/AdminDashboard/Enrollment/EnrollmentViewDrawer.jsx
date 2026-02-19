import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdPerson, MdSchool, MdCurrencyRupee, MdEvent } from "react-icons/md";

function EnrollmentViewDrawer({ open, onClose, data }) {

    if (!open || !data) return null;

    return (
        <AnimatePresence>

            {/* ===== BACKDROP ===== */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
            />

            {/* ===== DRAWER ===== */}
            <motion.div
                initial={{ x: "110%" }}
                animate={{ x: 0 }}
                exit={{ x: "110%" }}
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
                className="
                fixed right-4 top-[72px] lg:top-[76px] bottom-4 w-[420px] max-w-[92vw] bg-[#FBF4E2] rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.25)] border border-[#D1B062]/30 z-[200] flex flex-col overflow-hidden ">

                {/* ===== PREMIUM HEADER ===== */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#D1B062]/30 bg-[#EFE3D5]/60 backdrop-blur-md">

                    <div>
                        <h2 className="text-lg font-bold text-[#6b1d14]">
                            Enrollment Details
                        </h2>
                        <p className="text-xs text-[#856966]">
                            View enrolled student information
                        </p>
                    </div>

                    {/* CLOSE BUTTON */}
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-[#EFE3D5] transition"
                    >
                        <MdClose size={22} />
                    </button>

                </div>

                {/* ===== CONTENT ===== */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">

                    {/* STUDENT */}
                    <div className="bg-[#EFE3D5]/60 rounded-2xl p-4 flex items-center gap-3">
                        <MdPerson size={22} className="text-[#6b1d14]" />
                        <div>
                            <p className="text-xs text-[#856966]">Student</p>
                            <p className="font-bold text-[#6b1d14]">{data.name}</p>
                            <p className="text-xs text-[#856966]">{data.email}</p>
                        </div>
                    </div>

                    {/* COURSE */}
                    <div className="bg-[#EFE3D5]/60 rounded-2xl p-4 flex items-center gap-3">
                        <MdSchool size={22} className="text-[#6b1d14]" />
                        <div>
                            <p className="text-xs text-[#856966]">Course</p>
                            <p className="font-semibold">{data.course}</p>
                        </div>
                    </div>

                    {/* PRICE */}
                    <div className="bg-[#EFE3D5]/60 rounded-2xl p-4 flex items-center gap-3">
                        <MdCurrencyRupee size={22} className="text-[#6b1d14]" />
                        <div>
                            <p className="text-xs text-[#856966]">Price</p>
                            <p className="font-semibold">₹ {data.price}</p>
                        </div>
                    </div>

                    {/* DATE */}
                    <div className="bg-[#EFE3D5]/60 rounded-2xl p-4 flex items-center gap-3">
                        <MdEvent size={22} className="text-[#6b1d14]" />
                        <div>
                            <p className="text-xs text-[#856966]">Enrollment Date</p>
                            <p className="font-semibold">
                                {data.date} • {data.time}
                            </p>
                        </div>
                    </div>

                    {/* PAYMENT BADGE */}
                    <div className="pt-2">
                        <span
                            className={`px-4 py-2 rounded-xl text-sm font-bold
                            ${data.payment === "Paid"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            Payment : {data.payment}
                        </span>
                    </div>

                </div>

                {/* ===== FOOTER ===== */}
                <div className="p-6 border-t border-[#D1B062]/30">
                    <button
                        onClick={onClose}
                        className="w-full bg-[#6b1d14] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
                    >
                        Close
                    </button>
                </div>

            </motion.div>
        </AnimatePresence>
    );
}

export default EnrollmentViewDrawer;
