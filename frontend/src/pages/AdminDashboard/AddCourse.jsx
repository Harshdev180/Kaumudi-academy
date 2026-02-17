import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MdClose,
    MdVideocam,
    MdImage
} from "react-icons/md";

const AddCourse = ({
    open,
    onClose,
    form,
    setForm,
    saveCourse,
    editId
}) => {

    if (!open) return null;

    // ================= IMAGE HANDLER =================
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);

            // IMPORTANT FIX — image key same as CourseManagement
            setForm({ ...form, image: url });
        }
    };

    // ================= VIDEO HANDLER =================
    const handleVideo = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, video: file.name });
        }
    };

    return (
        <AnimatePresence>
            <>

                {/* BACKDROP */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                />

                {/* DRAWER */}
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 20 }}
                    className="fixed right-4 top-4 bottom-4 w-[95%] max-w-[500px] bg-[#F7EFE6] rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
                >

                    {/* HEADER */}
                    <div className="flex justify-between items-center px-6 py-5 border-b border-[#D1B062]/40 bg-[#FBF4E2]">
                        <h2 className="text-lg font-bold text-[#6b1d14]">
                            {editId ? "Edit Course" : "Create Course"}
                        </h2>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-[#EFE3D5]"
                        >
                            <MdClose size={22} />
                        </button>
                    </div>

                    {/* BODY */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {/* THUMBNAIL */}
                        <div>
                            <p className="text-xs font-bold text-[#856966] mb-2 uppercase">
                                Course Thumbnail
                            </p>

                            <label className="flex items-center justify-center h-32 rounded-2xl border-2 border-dashed border-[#D1B062] cursor-pointer bg-[#EFE3D5] overflow-hidden">

                                {form.image ? (
                                    <img
                                        src={form.image}
                                        alt="thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-[#6b1d14]">
                                        <MdImage size={28} />
                                        <span className="text-xs mt-1">Upload Image</span>
                                    </div>
                                )}

                                <input type="file" hidden onChange={handleImage} />
                            </label>
                        </div>

                        {/* TITLE */}
                        <input
                            placeholder="Course Title"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            className="w-full p-3 rounded-xl bg-[#EFE3D5] outline-none"
                        />

                        {/* DESCRIPTION */}
                        <textarea
                            placeholder="Description"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full p-3 rounded-xl bg-[#EFE3D5] h-28 outline-none"
                        />

                        {/* VIDEO */}
                        <div>
                            <p className="text-xs font-bold text-[#856966] mb-2 uppercase">
                                Intro Video
                            </p>

                            <label className="flex items-center justify-between px-4 py-3 bg-[#EFE3D5] rounded-xl cursor-pointer">
                                <span className="text-sm truncate">
                                    {form.video || "Upload intro video"}
                                </span>
                                <MdVideocam size={22} />
                                <input type="file" hidden onChange={handleVideo} />
                            </label>
                        </div>

                        {/* PRICE + MODE */}
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                placeholder="Price"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                className="p-3 rounded-xl bg-[#EFE3D5] outline-none"
                            />

                            <select
                                value={form.mode}
                                onChange={e => setForm({ ...form, mode: e.target.value })}
                                className="p-3 rounded-xl bg-[#EFE3D5] outline-none"
                            >
                                <option>ONLINE</option>
                                <option>HYBRID</option>
                                <option>OFFLINE</option>
                            </select>
                        </div>

                        {/* DURATION + LEVEL */}
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                placeholder="Duration"
                                value={form.dur}
                                onChange={e => setForm({ ...form, dur: e.target.value })}
                                className="p-3 rounded-xl bg-[#EFE3D5] outline-none"
                            />

                            <select
                                value={form.level}
                                onChange={e => setForm({ ...form, level: e.target.value })}
                                className="p-3 rounded-xl bg-[#EFE3D5] outline-none"
                            >
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>

                        {/* SCHEDULING */}
                        <div>
                            <p className="text-xs font-bold text-[#856966] mb-2 uppercase">
                                Scheduling
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    value={form.startDate || ""}
                                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                                    className="p-3 rounded-xl bg-[#EFE3D5] outline-none"
                                />

                                <input
                                    type="date"
                                    value={form.endDate || ""}
                                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                                    className="p-3 rounded-xl bg-[#EFE3D5] outline-none"
                                />
                            </div>
                        </div>

                        {/* STATUS */}
                        <div>
                            <p className="text-xs font-bold text-[#856966] mb-2 uppercase">
                                Visibility
                            </p>

                            <select
                                value={form.status}
                                onChange={e => setForm({ ...form, status: e.target.value })}
                                className="w-full p-3 rounded-xl bg-[#EFE3D5] outline-none"
                            >
                                <option>Draft</option>
                                <option>Published</option>
                                <option>Hidden</option>
                                <option>Inactive</option>
                            </select>
                        </div>

                    </div>

                    {/* FOOTER */}
                    <div className="p-6 border-t border-[#D1B062]/40 flex gap-3 bg-[#FBF4E2]">

                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-[#EFE3D5]"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={saveCourse}
                            className="flex-1 py-3 rounded-xl text-white font-bold"
                            style={{ backgroundColor: "#6b1d14" }}
                        >
                            SAVE COURSE
                        </button>

                    </div>

                </motion.div>
            </>
        </AnimatePresence>
    );
};

export default AddCourse;
