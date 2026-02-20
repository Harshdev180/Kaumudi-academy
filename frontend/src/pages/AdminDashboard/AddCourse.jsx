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
    editId,
    savingCourse = false
}) => {

    if (!open) return null;

    // ================= IMAGE HANDLER =================
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);

            // IMPORTANT FIX: image key same as CourseManagement
            setForm({ ...form, imageFile: file, imagePreview: url });
        }
    };

    // ================= VIDEO HANDLER =================
    const handleVideo = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, videoFile: file, videoName: file.name });
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
                    className="fixed right-4 top-4 bottom-4 w-[95%] max-w-125 bg-[#F7EFE6] rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
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

                                {form.imagePreview || form.image ? (
                                    <img
                                        src={form.imagePreview || form.image}
                                        alt="thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-[#6b1d14]">
                                        <MdImage size={28} />
                                        <span className="text-xs mt-1">Upload Image</span>
                                    </div>
                                )}

                                <input type="file" hidden accept="image/*" onChange={handleImage} />
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

                        {/* SYLLABUS */}
                        <textarea
                            placeholder="Syllabus (optional)"
                            value={form.syllabus || ""}
                            onChange={e => setForm({ ...form, syllabus: e.target.value })}
                            className="w-full p-3 rounded-xl bg-[#EFE3D5] h-24 outline-none"
                        />

                        {/* VIDEO */}
                        <div className="space-y-4">

                            <p className="text-sm font-bold text-[#6b1d14]">
                                Course Videos
                            </p>

                            {/* VIDEO 1 */}
                            <div className="space-y-1">
                                <label className="text-xs text-[#856966]">Intro Video</label>

                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            video1: URL.createObjectURL(e.target.files[0])
                                        })
                                    }
                                    className="w-full p-3 rounded-xl bg-[#EFE3D5]"
                                />

                                {form.video1 && (
                                    <video
                                        src={form.video1}
                                        controls
                                        className="w-full h-32 rounded-xl mt-2 object-cover"
                                    />
                                )}
                            </div>

                            {/* VIDEO 2 */}
                            <div className="space-y-1">
                                <label className="text-xs text-[#856966]">Demo Lecture Video</label>

                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            video2: URL.createObjectURL(e.target.files[0])
                                        })
                                    }
                                    className="w-full p-3 rounded-xl bg-[#EFE3D5]"
                                />

                                {form.video2 && (
                                    <video
                                        src={form.video2}
                                        controls
                                        className="w-full h-32 rounded-xl mt-2 object-cover"
                                    />
                                )}
                            </div>

                            <label className="flex items-center justify-between px-4 py-3 bg-[#EFE3D5] rounded-xl cursor-pointer">
                                <span className="text-sm truncate">
                                    {form.videoName || "Upload intro video"}
                                </span>
                                <MdVideocam size={22} />
                                <input type="file" hidden onChange={handleVideo} />
                            </label>

                        </div>

                        {/* PRICE + MODE */}
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="number"
                                min="0"
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
                                <option>OFFLINE</option>
                            </select>
                        </div>

                        {/* DURATION + LANGUAGE */}
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                placeholder="Duration"
                                value={form.duration}
                                onChange={e => setForm({ ...form, duration: e.target.value })}
                                className="p-3 rounded-xl bg-[#EFE3D5] outline-none"
                            />

                            <input
                                placeholder="Languages (comma separated)"
                                value={form.language || ""}
                                onChange={e => setForm({ ...form, language: e.target.value })}
                                className="p-3 rounded-xl bg-[#EFE3D5] outline-none"
                            />
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

                    </div>

                    {/* FOOTER */}
                    <div className="p-6 border-t border-[#D1B062]/40 flex gap-3 bg-[#FBF4E2]">

                        <button
                            onClick={onClose}
                            disabled={savingCourse}
                            className="flex-1 py-3 rounded-xl bg-[#EFE3D5] disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={saveCourse}
                            disabled={savingCourse}
                            className="flex-1 py-3 rounded-xl text-white font-bold disabled:opacity-70 transition"
                            style={{ backgroundColor: "#6b1d14" }}
                        >
                            {savingCourse ? "SAVING..." : "SAVE COURSE"}
                        </button>

                    </div>

                    {/* LOADER OVERLAY */}
                    <AnimatePresence>
                        {savingCourse && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl"
                            >
                                <motion.div
                                    className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                                        className="w-12 h-12 rounded-full border-4 border-[#D1B062] border-t-[#6b1d14]"
                                    />
                                    <motion.p
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 1.4 }}
                                        className="text-[#6b1d14] font-semibold text-sm"
                                    >
                                        Saving Course...
                                    </motion.p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>
            </>
        </AnimatePresence>
    );
};

export default AddCourse;
