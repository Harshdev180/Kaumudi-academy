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
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className=" bg-[#FBF4E2] rounded-3xl overflow-hidden border border-[#D1B062]/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">

            {/* ================= IMAGE SECTION ================= */}
            <div className="h-44 w-full bg-[#EFE3D5] relative">

                {student.image ? (
                    <img
                        src={student.image}
                        alt={student.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#6b1d14]/40 text-sm font-semibold">
                        No Image
                    </div>
                )}

                {/* STATUS TOGGLE */}
                <button
                    onClick={onToggleStatus}
                    className="absolute top-3 right-3 bg-white/80 backdrop-blur-md rounded-full p-1 shadow"
                >
                    {student.status === "Active"
                        ? <MdToggleOn size={26} className="text-green-600" />
                        : <MdToggleOff size={26} className="text-gray-400" />
                    }
                </button>

            </div>

            {/* ================= CONTENT ================= */}
            <div className="p-5 space-y-3 flex flex-col flex-1">

                <h3 className="font-bold text-[#6b1d14] text-base">
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
                    <MdCreditCard className="text-[#6b1d14]" />

                    <button
                        onClick={onTogglePayment}
                        className={`px-3 py-1 rounded-full font-semibold
            ${student.payment === "Paid"
                                ? "bg-green-100 text-green-600"
                                : "bg-orange-100 text-orange-600"}`}
                    >
                        {student.payment}
                    </button>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2 mt-auto pt-4">

                    <button
                        onClick={onEdit}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                        <MdEdit size={18} />
                    </button>

                    <button
                        onClick={() => {
                            if (window.confirm("Delete this student?")) {
                                onDelete();
                            }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        <MdDelete size={18} />
                    </button>

                </div>

            </div>

        </motion.div>
    );
}
