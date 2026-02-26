import { motion } from "framer-motion";
import {
    MdEdit,
    MdDelete,
    MdToggleOn,
    MdToggleOff,
    MdCreditCard
} from "react-icons/md";

export default function StudentCard({
    student, onEdit, onDelete, onToggleStatus, onTogglePayment }) {

    return (
        <motion.div
            layout="position"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-[#FBF4E2] rounded-3xl overflow-hidden 
            border border-[#D1B062]/30 shadow-sm hover:shadow-2xl 
            transition-all duration-300 flex flex-col group will-change-transform transform-gpu scroll-smooth" >

            {/* ================= IMAGE SECTION ================= */}
            <div className="h-44 w-full bg-[#EFE3D5] relative overflow-hidden">

                {student.image ? (
                    <img
                        src={student.image}
                        alt={student.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#6b1d14]/40 text-sm font-semibold">
                        No Image
                    </div>
                )}

                {/* STATUS TOGGLE */}
                <button
                    onClick={onToggleStatus}
                    className="absolute top-3 left-3 bg-white/80 backdrop-blur-md 
                    rounded-full p-1.5 shadow-md hover:scale-105 transition"
                >
                    {student.status === "Active"
                        ? <MdToggleOn size={26} className="text-green-600" />
                        : <MdToggleOff size={26} className="text-gray-400" />
                    }
                </button>

                {/* EDIT DELETE (RIGHT SIDE VERTICAL) */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">

                    <button
                        onClick={onEdit}
                        className="p-2 rounded-xl bg-white/90 backdrop-blur-md 
                        text-blue-600 shadow hover:bg-blue-100 
                        transition-all duration-200 hover:scale-105"
                    >
                        <MdEdit size={18} />
                    </button>

                    <button
                        onClick={onDelete}
                        className="p-2 rounded-xl bg-white/90 backdrop-blur-md 
                        text-red-600 shadow hover:bg-red-100 
                        transition-all duration-200 hover:scale-105"
                    >
                        <MdDelete size={18} />
                    </button>

                </div>

            </div>

            {/* ================= CONTENT ================= */}
            <div className="p-5 space-y-3 flex flex-col flex-1">

                <h3 className="font-bold text-[#6b1d14] text-base tracking-wide">
                    {student.name}
                </h3>

                <p className="text-xs text-[#856966]">
                    {student.course}
                </p>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2 text-xs">

                    <span className="bg-[#EFE3D5] px-3 py-1 rounded-full">
                        {student.mode}
                    </span>

                    <span className={`px-3 py-1 rounded-full font-semibold
                        ${student.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-200 text-gray-500"}`}>
                        {student.status}
                    </span>

                </div>

                {/* PAYMENT STATUS */}
                <div className="flex items-center gap-2 text-xs mt-1">

                    <div className="w-7 h-7 rounded-lg bg-[#EFE3D5] flex items-center justify-center">
                        <MdCreditCard className="text-[#6b1d14]" />
                    </div>

                    <button
                        onClick={onTogglePayment}
                        className={`px-3 py-1 rounded-full font-semibold transition
                        ${student.payment === "Paid"
                                ? "bg-green-100 text-green-600 hover:bg-green-200"
                                : "bg-orange-100 text-orange-600 hover:bg-orange-200"}`}
                    >
                        {student.payment}
                    </button>

                </div>

            </div>

        </motion.div>
    );
}