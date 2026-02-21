import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";

function EnrollmentTable({
    enrollments,
    onView,
    onEdit,
    onDelete,
    onMarkPaid
}) {

    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleView = (row) => {
        setSelectedRow(row);
        setViewOpen(true);
    };

    const handleEdit = (row) => {
        setSelectedRow(row);
        setEditOpen(true);
    };

    const handleMarkPaid = (id) => {
        setEnrollments(prev =>
            prev.map(r =>
                r.id === id ? { ...r, payment: "Paid" } : r
            )
        );
    };


    return (
        <div className="bg-[#FBF4E2] rounded-3xl border border-[#D1B062]/30 overflow-hidden">

            {/* ================= HEADER (desktop only) ================= */}
            <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr_2fr] px-6 py-4 text-sm font-bold text-[#6b1d14] bg-[#EFE3D5]/60">
                <span>Student</span>
                <span>Course</span>
                <span>Price</span>
                <span>Payment</span>
                <span>Date</span>
                <span className="text-right">Action</span>
            </div>

            {/* ================= ROW LIST ================= */}

            {/* Mobile cards */}
            <div className="md:hidden divide-y border-t border-[#D1B062]/20">
                {enrollments.map((row) => (
                    <motion.div
                        key={row.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-4 py-4 bg-[#FBF4E2]"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <p className="font-bold text-[#6b1d14]">{row.name}</p>
                                <p className="text-xs text-[#856966]">{row.email}</p>
                                <p className="text-sm text-[#6b1d14] mt-2">{row.course}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">₹ {row.price}</p>
                                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${row.payment === "Paid" ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {row.payment}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 gap-3">
                            <div className="text-xs text-[#856966]">
                                <div>{row.date}</div>
                                <div>{row.time}</div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button onClick={() => onView(row)} className="px-3 py-2 rounded-lg bg-[#EFE3D5] text-[#6b1d14] font-semibold text-sm"><MdVisibility /></button>
                                <button onClick={() => onEdit(row)} className="px-3 py-2 rounded-lg bg-[#EFE3D5] text-[#6b1d14] font-semibold text-sm"><MdEdit /></button>
                                <button onClick={() => onDelete(row.id)} className="p-2 rounded-lg bg-red-100 text-red-600"><MdDelete /></button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Desktop rows */}
            <div className="hidden md:block">
                {enrollments.map((row) => (
                    <motion.div
                        key={row.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ backgroundColor: "#EFE3D540" }}
                        className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr_2fr] px-6 py-4 items-center border-t border-[#D1B062]/20 transition"
                    >

                        {/* STUDENT */}
                        <div>
                            <p className="font-bold text-[#6b1d14]">{row.name}</p>
                            <p className="text-xs text-[#856966]">{row.email}</p>
                        </div>

                        {/* COURSE */}
                        <p className="text-[#6b1d14]/80">{row.course}</p>

                        {/* PRICE */}
                        <p className="font-semibold">₹ {row.price}</p>

                        {/* PAYMENT STATUS */}
                        <span
                            className={`px-3 py-1 rounded-lg text-xs font-bold w-fit ${row.payment === "Paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            ₹ {row.payment}
                        </span>

                        {/* DATE */}
                        <div>
                            <p>{row.date}</p>
                            <p className="text-xs text-[#856966]">{row.time}</p>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end items-center gap-6 whitespace-nowrap">

                            {/* VIEW */}
                            <motion.button
                                whileTap={{ scale: 0.92 }}
                                onClick={() => onView(row)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EFE3D5] text-[#6b1d14] font-semibold text-sm"
                            >
                                <MdVisibility />
                            </motion.button>

                            {/* EDIT */}
                            <motion.button
                                whileTap={{ scale: 0.92 }}
                                onClick={() => onEdit(row)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EFE3D5] text-[#6b1d14] font-semibold text-sm"
                            >
                                <MdEdit />
                            </motion.button>

                            {/* DELETE */}
                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => onDelete(row.id)}
                                className="p-2 rounded-lg bg-red-100 text-red-600"
                            >
                                <MdDelete />
                            </motion.button>

                        </div>

                    </motion.div>
                ))}
            </div>


        </div>
    );
}

export default EnrollmentTable;