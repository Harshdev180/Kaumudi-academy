import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdClose,
  MdVideocam,
  MdImage,
  MdAdd,
  MdDelete,
  MdEdit,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";

const AddCourse = ({
  open,
  onClose,
  form,
  setForm,
  saveCourse,
  editId,
  savingCourse = false,
  staffList = [],
  onHasPendingCurriculum, // Callback to notify parent about pending items
  curriculumError, // Error message from parent
}) => {
  const todayStr = new Date().toISOString().split("T")[0];
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

  // CURRICULUM EDITOR STATE
  const [curriculumItems, setCurriculumItems] = useState([]);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemContent, setNewItemContent] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // BATCH SCHEDULE STATE
  const [batchSchedules, setBatchSchedules] = useState([]);
  const [newBatch, setNewBatch] = useState({
    batchType: "",
    days: "",
    startTime: "",
    endTime: "",
  });
  const [editingBatchIndex, setEditingBatchIndex] = useState(null);

  const handleAddBatch = () => {
    if (!newBatch.batchType.trim()) return;
    setBatchSchedules([...batchSchedules, { ...newBatch }]);
    setNewBatch({ batchType: "", days: "", startTime: "", endTime: "" });
  };

  const handleDeleteBatch = (index) => {
    setBatchSchedules(batchSchedules.filter((_, i) => i !== index));
  };

  const handleEditBatch = (index) => {
    setNewBatch(batchSchedules[index]);
    setEditingBatchIndex(index);
  };

  const handleUpdateBatch = () => {
    if (!newBatch.batchType.trim()) return;
    const updated = [...batchSchedules];
    updated[editingBatchIndex] = { ...newBatch };
    setBatchSchedules(updated);
    setNewBatch({ batchType: "", days: "", startTime: "", endTime: "" });
    setEditingBatchIndex(null);
  };

  const cancelBatchEdit = () => {
    setNewBatch({ batchType: "", days: "", startTime: "", endTime: "" });
    setEditingBatchIndex(null);
  };

  // Update form.batchSchedule when batchSchedules changes
  useEffect(() => {
    if (isInitialized) {
      setForm((prev) => ({
        ...prev,
        batchSchedule: batchSchedules,
      }));
    }
  }, [batchSchedules, isInitialized, setForm]);

  // Initialize curriculum items only when the drawer opens for edit
  useEffect(() => {
    console.log(
      "AddCourse useEffect - open:",
      open,
      "form.curriculumText:",
      form?.curriculumText,
      "form.batchSchedule:",
      form?.batchSchedule,
    );
    if (open) {
      // Always initialize on open
      if (form?.curriculumText) {
        try {
          const parsed = JSON.parse(form.curriculumText);
          if (Array.isArray(parsed)) {
            setCurriculumItems(parsed);
            console.log("Loaded curriculum items:", parsed);
          }
        } catch (e) {
          console.error("Failed to parse curriculum:", e);
          setCurriculumItems([]);
        }
      } else {
        setCurriculumItems([]);
      }
      // Also initialize batch schedules
      if (form?.batchSchedule && Array.isArray(form.batchSchedule)) {
        setBatchSchedules(form.batchSchedule);
        console.log("Loaded batch schedules:", form.batchSchedule);
      } else {
        setBatchSchedules([]);
      }
      setIsInitialized(true);
    } else {
      // Reset when drawer closes
      setCurriculumItems([]);
      setNewItemTitle("");
      setNewItemContent("");
      setEditingIndex(null);
      setIsInitialized(false);
    }
  }, [open, form?.curriculumText, form?.batchSchedule]);

  // Update form.curriculumText when curriculumItems changes
  useEffect(() => {
    if (isInitialized && curriculumItems) {
      setForm((prev) => ({
        ...prev,
        curriculumText: JSON.stringify(curriculumItems, null, 2),
      }));
    }
  }, [curriculumItems, isInitialized, setForm]);

  // Check if there are pending (unsaved) items
  const hasPendingItems = () => {
    return newItemTitle.trim() !== "" || newItemContent.trim() !== "";
  };

  // Notify parent about pending curriculum items
  useEffect(() => {
    if (onHasPendingCurriculum) {
      onHasPendingCurriculum(hasPendingItems());
    }
  }, [newItemTitle, onHasPendingCurriculum]);

  const handleAddCurriculumItem = () => {
    if (!newItemTitle.trim()) return;

    const contentArray = newItemContent
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const newItem = {
      title: newItemTitle.trim(),
      isLocked: false,
      content: contentArray,
    };

    setCurriculumItems([...curriculumItems, newItem]);
    setNewItemTitle("");
    setNewItemContent("");
  };

  const handleDeleteCurriculumItem = (index) => {
    setCurriculumItems(curriculumItems.filter((_, i) => i !== index));
  };

  const handleEditCurriculumItem = (index) => {
    const item = curriculumItems[index];
    setNewItemTitle(item.title);
    setNewItemContent(item.content.join("\n"));
    setEditingIndex(index);
  };

  const handleUpdateCurriculumItem = () => {
    if (!newItemTitle.trim()) return;

    const contentArray = newItemContent
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const updatedItem = {
      title: newItemTitle.trim(),
      isLocked: curriculumItems[editingIndex]?.isLocked || false,
      content: contentArray,
    };

    const updatedItems = [...curriculumItems];
    updatedItems[editingIndex] = updatedItem;
    setCurriculumItems(updatedItems);
    setNewItemTitle("");
    setNewItemContent("");
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setNewItemTitle("");
    setNewItemContent("");
    setEditingIndex(null);
  };

  // Add any pending (un-added) curriculum items before saving
  const savePendingCurriculumItems = () => {
    if (newItemTitle.trim()) {
      handleAddCurriculumItem();
    }
  };

  const moveCurriculumItemUp = (index) => {
    if (index === 0) return;
    const newItems = [...curriculumItems];
    [newItems[index - 1], newItems[index]] = [
      newItems[index],
      newItems[index - 1],
    ];
    setCurriculumItems(newItems);
  };

  const moveCurriculumItemDown = (index) => {
    if (index === curriculumItems.length - 1) return;
    const newItems = [...curriculumItems];
    [newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ];
    setCurriculumItems(newItems);
  };

  if (!open) return null;

  // ================= IMAGE HANDLER =================
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, imageFile: file, imagePreview: url }));
    }
  };

  // ================= VIDEO HANDLER (legacy) =================
  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, videoFile: file, videoName: file.name }));
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
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
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
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full p-3 rounded-xl bg-[#EFE3D5] h-28 outline-none focus:ring-2 focus:ring-[#D1B062] resize-none"
              />
            </div>

            {/* SYLLABUS */}
            {/* <div>
              <p className="text-xs font-bold text-[#856966] mb-2 uppercase">
                Syllabus
              </p>
              <textarea
                placeholder="Course syllabus (one per line)"
                value={form.syllabus || ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, syllabus: e.target.value }))
                }
                className="w-full p-3 rounded-xl bg-[#EFE3D5] h-28 outline-none focus:ring-2 focus:ring-[#D1B062] resize-none"
              />
            </div> */}

            {/* CURRICULUM */}
            <div>
              <p className="text-xs font-bold text-[#856966] mb-2 uppercase">
                Curriculum
              </p>

              {/* Error message from parent */}
              {curriculumError &&
                (newItemTitle.trim() || newItemContent.trim()) && (
                  <div className="bg-red-100 text-red-700 border border-red-300 px-3 py-2 rounded-lg mb-3 text-sm">
                    {curriculumError}
                  </div>
                )}

              {/* Warning when there's content but no title */}
              {!curriculumError &&
                newItemContent.trim() &&
                !newItemTitle.trim() && (
                  <div className="bg-amber-100 text-amber-700 border border-amber-300 px-3 py-2 rounded-lg mb-3 text-sm">
                    Please add a module title to save the topics
                  </div>
                )}

              {/* Add New Item Form */}
              <div className="bg-[#EFE3D5] rounded-xl p-4 mb-4 space-y-3">
                <input
                  placeholder="Module/Chapter Title"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#D1B062]"
                />
                <textarea
                  placeholder="Content/Topics (one per line)"
                  value={newItemContent}
                  onChange={(e) => setNewItemContent(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#D1B062] h-20 resize-none"
                />
                <div className="flex gap-2">
                  {editingIndex !== null ? (
                    <>
                      <button
                        onClick={handleUpdateCurriculumItem}
                        className="flex-1 py-2 bg-[#D1B062] text-[#6b1d14] rounded-lg font-semibold hover:bg-[#c9a355] transition-colors"
                      >
                        Update
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleAddCurriculumItem}
                      disabled={!newItemTitle.trim()}
                      className="flex-1 py-2 bg-[#D1B062] text-[#6b1d14] rounded-lg font-semibold hover:bg-[#c9a355] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <MdAdd size={18} /> Add Module
                    </button>
                  )}
                </div>
              </div>

              {/* Curriculum Items List */}
              {curriculumItems.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {curriculumItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 border border-[#D1B062]/30 flex items-start justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {/* Move Up/Down Buttons */}
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveCurriculumItemUp(index)}
                            disabled={index === 0}
                            className="p-1 text-[#856966] hover:text-[#6b1d14] hover:bg-[#EFE3D5] rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <MdArrowUpward size={14} />
                          </button>
                          <button
                            onClick={() => moveCurriculumItemDown(index)}
                            disabled={index === curriculumItems.length - 1}
                            className="p-1 text-[#856966] hover:text-[#6b1d14] hover:bg-[#EFE3D5] rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <MdArrowDownward size={14} />
                          </button>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#6b1d14] text-sm">
                            {index + 1}. {item.title}
                          </h4>
                          {item.content && item.content.length > 0 && (
                            <ul className="mt-1 ml-4 text-xs text-gray-600">
                              {item.content.slice(0, 3).map((content, i) => (
                                <li key={i}>• {content}</li>
                              ))}
                              {item.content.length > 3 && (
                                <li className="text-gray-400 italic">
                                  +{item.content.length - 3} more...
                                </li>
                              )}
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => handleEditCurriculumItem(index)}
                          className="p-2 text-[#856966] hover:text-[#6b1d14] hover:bg-[#EFE3D5] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <MdEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCurriculumItem(index)}
                          className="p-2 text-[#856966] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <MdDelete size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {curriculumItems.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">
                  No curriculum modules added yet. Add your first module above.
                </p>
              )}
            </div>

            {/* BATCH SCHEDULE */}
            <div>
              <p className="text-xs font-bold text-[#856966] mb-2 uppercase">
                Batch Schedule
              </p>

              {/* Add New Batch Form */}
              <div className="bg-[#EFE3D5] rounded-xl p-4 mb-4 space-y-3">
                <input
                  placeholder="Batch Type (e.g., Weekday Batch, Weekend Intensive)"
                  value={newBatch.batchType}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, batchType: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#D1B062]"
                />
                <input
                  placeholder="Days (e.g., Mon, Wed, Fri or Sat, Sun)"
                  value={newBatch.days}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, days: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#D1B062]"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={newBatch.startTime || ""}
                      onChange={(e) =>
                        setNewBatch({ ...newBatch, startTime: e.target.value })
                      }
                      className="w-full p-3 rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#D1B062]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={newBatch.endTime || ""}
                      onChange={(e) =>
                        setNewBatch({ ...newBatch, endTime: e.target.value })
                      }
                      className="w-full p-3 rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#D1B062]"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {editingBatchIndex !== null ? (
                    <>
                      <button
                        onClick={handleUpdateBatch}
                        className="flex-1 py-2 bg-[#D1B062] text-[#6b1d14] rounded-lg font-semibold hover:bg-[#c9a355] transition-colors"
                      >
                        Update Batch
                      </button>
                      <button
                        onClick={cancelBatchEdit}
                        className="flex-1 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleAddBatch}
                      disabled={!newBatch.batchType.trim()}
                      className="flex-1 py-2 bg-[#D1B062] text-[#6b1d14] rounded-lg font-semibold hover:bg-[#c9a355] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <MdAdd size={18} /> Add Batch
                    </button>
                  )}
                </div>
              </div>

              {/* Batch List */}
              {batchSchedules.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {batchSchedules.map((batch, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 border border-[#D1B062]/30 flex items-start justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#6b1d14] text-sm">
                          {batch.batchType}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          <span className="font-medium">Days:</span>{" "}
                          {batch.days}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Time:</span>{" "}
                          {batch.startTime} - {batch.endTime}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => handleEditBatch(index)}
                          className="p-2 text-[#856966] hover:text-[#6b1d14] hover:bg-[#EFE3D5] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <MdEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteBatch(index)}
                          className="p-2 text-[#856966] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <MdDelete size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {batchSchedules.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">
                  No batch schedules added yet. Add your first batch above.
                </p>
              )}
            </div>

            {/* FACULTY & LEVEL */}
            <div>
              <p className="text-xs font-bold text-[#856966] mb-2 uppercase">
                Faculty & Difficulty <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <select
                    value={form.instructor || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        instructor: e.target.value,
                      }))
                    }
                    className="w-full p-3 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#D1B062]"
                    required
                  >
                    <option value="">Select Faculty</option>
                    {staffList
                      .filter((staff) => staff.status === "ACTIVE")
                      .map((staff) => (
                        <option key={staff._id} value={staff._id}>
                          {staff.name} ({staff.role})
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <select
                    value={form.level || "Prathama (Beginner)"}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, level: e.target.value }))
                    }
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
                <input
                  placeholder="Price (₹)"
                  type="number"
                  min="0"
                  value={form.price || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="w-full p-3 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#D1B062]"
                />
                <select
                  value={form.mode || "ONLINE"}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, mode: e.target.value }))
                  }
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
                <input
                  placeholder="e.g. 3 Months"
                  value={form.duration || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, duration: e.target.value }))
                  }
                  className="w-full p-3 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#D1B062]"
                />
                <input
                  placeholder="e.g. Sanskrit, English"
                  value={
                    Array.isArray(form.language)
                      ? form.language.join(", ")
                      : form.language || ""
                  }
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, language: e.target.value }))
                  }
                  className="w-full p-3 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#D1B062]"
                />
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
                    min={todayStr}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full p-3 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#D1B062]"
                  />
                </div>
                <div>
                  <p className="text-xs text-[#856966] mb-1">End Date</p>
                  <input
                    type="date"
                    value={form.endDate || ""}
                    min={form.startDate || todayStr}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, endDate: e.target.value }))
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
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setForm((prev) => ({
                        ...prev,
                        video1File: file,
                        video1: URL.createObjectURL(file),
                        video1Name: file.name,
                      }));
                    }
                  }}
                  className="w-full p-3 rounded-xl bg-[#EFE3D5] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6b1d14] file:text-white hover:file:bg-[#D1B062] cursor-pointer"
                />
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
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setForm((prev) => ({
                        ...prev,
                        video2File: file,
                        video2: URL.createObjectURL(file),
                        video2Name: file.name,
                      }));
                    }
                  }}
                  className="w-full p-3 rounded-xl bg-[#EFE3D5] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6b1d14] file:text-white hover:file:bg-[#D1B062] cursor-pointer"
                />
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

              {/* Legacy video upload */}
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
