import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdVideocam, MdImage } from "react-icons/md";

const AddCourse = ({
  open,
  onClose,
  form,
  setForm,
  saveCourse,
  editId,
  savingCourse = false,
}) => {
  // Reset form when opening for new course
  useEffect(() => {
    if (open && !editId) {
      setForm((prev) => ({
        ...prev,
        faculty: prev.faculty || "",
        level: prev.level || "Prathama (Beginner)",
        mode: prev.mode || "ONLINE",
        language: prev.language || "",
      }));
    }
  }, [open, editId, setForm]);

  if (!open) return null;

  // ================= IMAGE HANDLER =================
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
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

  // Handle faculty input change
  const handleFacultyChange = (e) => {
    setForm({ ...form, faculty: e.target.value });
  };

  // Handle level change
  const handleLevelChange = (e) => {
    setForm({ ...form, level: e.target.value });
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
          className="fixed h-full inset-0 bg-black/30 backdrop-blur-sm z-40"
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
              className="p-2 rounded-lg hover:bg-[#EFE3D5] transition-colors"
            >
              <MdClose size={22} />
            </button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* THUMBNAIL */}
            <div>
              <p className="text-xs font-bold text-[#856966] mb-2 uppercase">
                Course Thumbnail <span className="text-red-500">*</span>
              </p>

              <label className="flex items-center justify-center h-32 rounded-2xl border-2 border-dashed border-[#D1B062] cursor-pointer bg-[#EFE3D5] overflow-hidden hover:border-[#6b1d14] transition-colors">
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

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImage}
                />
              </label>
            </div>

            {/* TITLE */}
            <div>
              <p className="text-xs font-bold text-[#856966] mb-2 uppercase">
                Course Title <span className="text-red-500">*</span>
              </p>
              <input
                placeholder="e.g. Advanced Sanskrit Grammar"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#D1B062]"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <p className="text-xs font-bold text-[#856966] mb-2 uppercase">
                Description <span className="text-red-500">*</span>
              </p>
              <textarea
                placeholder="Detailed course description..."
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-[#EFE3D5] h-28 outline-none focus:ring-2 focus:ring-[#D1B062] resize-none"
              />
            </div>

            {/* SYLLABUS */}
            <div>
              <p className="text-xs font-bold text-[#856966] mb-2 uppercase">
                Syllabus
              </p>
              <textarea
                placeholder="Course syllabus (one per line)"
                value={form.syllabus || ""}
                onChange={(e) => setForm({ ...form, syllabus: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#EFE3D5] h-28 outline-none focus:ring-2 focus:ring-[#D1B062] resize-none"
              />
            </div>

            {/* FACULTY & LEVEL */}
            <div>
              <p className="text-xs font-bold text-[#856966] mb-2 uppercase">
                Faculty & Difficulty <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    placeholder="Faculty Name"
                    value={form.faculty || ""}
                    onChange={handleFacultyChange}
                    className="w-full p-3 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#D1B062]"
                  />
                  {!form.faculty && (
                    <p className="text-xs text-red-500 mt-1">Required</p>
                  )}
                </div>
                <div>
                  <select
                    value={form.level || "Prathama (Beginner)"}
                    onChange={handleLevelChange}
                    className="w-full p-3 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#D1B062]"
                  >
                    <option value="Prathama (Beginner)">
                      Prathama (Beginner)
                    </option>
                    <option value="Madhyama (Intermediate)">
                      Madhyama (Intermediate)
                    </option>
                    <option value="Kovida (Advanced)">Kovida (Advanced)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PRICE + MODE */}
            <div>
              <p className="text-xs font-bold text-[#856966] mb-2 uppercase">
                Pricing & Mode <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    placeholder="Price (₹)"
                    type="number"
                    min="0"
                    value={form.price || ""}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#D1B062]"
                  />
                </div>

                <select
                  value={form.mode || "ONLINE"}
                  onChange={(e) => setForm({ ...form, mode: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#D1B062]"
                >
                  <option value="ONLINE">ONLINE</option>
                  <option value="OFFLINE">OFFLINE</option>
                  <option value="HYBRID">HYBRID</option>
                </select>
              </div>
            </div>

            {/* DURATION + LANGUAGE */}
            <div>
              <p className="text-xs font-bold text-[#856966] mb-2 uppercase">
                Duration & Language <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    placeholder="e.g. 3 Months"
                    value={form.duration || ""}
                    onChange={(e) =>
                      setForm({ ...form, duration: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#D1B062]"
                  />
                </div>

                <div>
                  <input
                    placeholder="e.g. Sanskrit, English"
                    value={
                      Array.isArray(form.language)
                        ? form.language.join(", ")
                        : form.language || ""
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        language: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#D1B062]"
                  />
                </div>
              </div>
            </div>

            {/* SCHEDULING */}
            <div>
              <p className="text-xs font-bold text-[#856966] mb-2 uppercase">
                Course Schedule
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#856966] mb-1">Start Date</p>
                  <input
                    type="date"
                    value={form.startDate || ""}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#D1B062]"
                  />
                </div>

                <div>
                  <p className="text-xs text-[#856966] mb-1">End Date</p>
                  <input
                    type="date"
                    value={form.endDate || ""}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#D1B062]"
                  />
                </div>
              </div>
            </div>

            {/* VIDEO SECTION */}
            <div className="space-y-4">
              <p className="text-sm font-bold text-[#6b1d14]">Course Videos</p>

              {/* VIDEO 1 - Intro */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#856966] uppercase">
                  Intro Video
                </label>

                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setForm({
                          ...form,
                          video1File: file,
                          video1: URL.createObjectURL(file),
                          video1Name: file.name,
                        });
                      }
                    }}
                    className="w-full p-3 rounded-xl bg-[#EFE3D5] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6b1d14] file:text-white hover:file:bg-[#D1B062] cursor-pointer"
                  />
                </div>

                {form.video1 && (
                  <div className="mt-2">
                    <video
                      src={form.video1}
                      controls
                      className="w-full h-32 rounded-xl object-cover"
                    />
                    <p className="text-xs text-[#856966] mt-1 truncate">
                      {form.video1Name || "Intro video"}
                    </p>
                  </div>
                )}
              </div>

              {/* VIDEO 2 - Demo */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#856966] uppercase">
                  Demo Lecture Video
                </label>

                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setForm({
                          ...form,
                          video2File: file,
                          video2: URL.createObjectURL(file),
                          video2Name: file.name,
                        });
                      }
                    }}
                    className="w-full p-3 rounded-xl bg-[#EFE3D5] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6b1d14] file:text-white hover:file:bg-[#D1B062] cursor-pointer"
                  />
                </div>

                {form.video2 && (
                  <div className="mt-2">
                    <video
                      src={form.video2}
                      controls
                      className="w-full h-32 rounded-xl object-cover"
                    />
                    <p className="text-xs text-[#856966] mt-1 truncate">
                      {form.video2Name || "Demo video"}
                    </p>
                  </div>
                )}
              </div>

              {/* Legacy video upload (keeping for backward compatibility) */}
              <label className="flex items-center justify-between px-4 py-3 bg-[#EFE3D5] rounded-xl cursor-pointer hover:bg-[#e6d4c2] transition-colors">
                <span className="text-sm truncate">
                  {form.videoName || "Upload additional video"}
                </span>
                <MdVideocam size={22} className="text-[#6b1d14]" />
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={handleVideo}
                />
              </label>
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-[#D1B062]/40 flex gap-3 bg-[#FBF4E2]">
            <button
              onClick={onClose}
              disabled={savingCourse}
              className="flex-1 py-3 rounded-xl bg-[#EFE3D5] disabled:opacity-50 hover:bg-[#e6d4c2] transition-colors font-medium"
            >
              Cancel
            </button>

            <button
              onClick={saveCourse}
              disabled={savingCourse}
              className="flex-1 py-3 rounded-xl text-white font-bold disabled:opacity-70 transition-all hover:bg-[#8b2d21] active:scale-95"
              style={{ backgroundColor: "#6b1d14" }}
            >
              {savingCourse ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  SAVING...
                </span>
              ) : (
                "SAVE COURSE"
              )}
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
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      ease: "linear",
                    }}
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
