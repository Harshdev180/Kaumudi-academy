import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdSearch, MdNotifications, MdFileDownload, MdAdd,
  MdAutoStories, MdSchool, MdTranslate, MdMoreVert,
  MdFilterList, MdChevronLeft, MdChevronRight, MdDelete, MdEdit,
  MdClose, MdSave, MdCloudUpload
} from 'react-icons/md';
import AddCourse from './AddCourse';
import { getAllCoursesForAdmin, createCourse, updateCourse, deleteCourse, toggleCourseStatus } from '../../lib/api';

const CourseManagement = () => {

  const palette = {
    primary: "#6b1d14",
    parchment: "#FBF4E2",
    bg: "#F3E6C9",
    gold: "#D1B062",
    textMuted: "#856966"
  };

  const initialForm = {
    title: "",
    description: "",
    syllabus: "",
    duration: "",
    mode: "ONLINE",
    price: "",
    language: "Sanskrit",
    startDate: "",
    endDate: "",
    image: "",
    imageFile: null,
    imagePreview: "",
    videoFile: null,
    videoName: ""
  };

  // 2. STATE MANAGEMENT
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllCoursesForAdmin();
      const payload = response?.data ?? response;
      const data = Array.isArray(payload) ? payload : payload?.data || [];

      const formattedCourses = data.map((course, index) => ({
        id: course._id || course.id || index,
        title: course.title || "Untitled Course",
        level: course.level || "Prathama (Beginner)",
        dur: course.duration || "—",
        mode: course.mode || "ONLINE",
        price: course.price ?? 0,
        status: course.status === "ACTIVE" ? "Published" : "Draft",
        rawStatus: course.status || "INACTIVE",
        image: course.image?.url || "",
        description: course.description || "",
        syllabus: course.syllabus || "",
        language: Array.isArray(course.language)
          ? course.language.join(", ")
          : course.language || "",
        startDate: course.startDate ? course.startDate.slice(0, 10) : "",
        endDate: course.endDate ? course.endDate.slice(0, 10) : "",
        icon: <MdAutoStories />
      }));

      setCourses(formattedCourses);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch courses from API
  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= FILTER =================
  const filteredCourses = useMemo(() => {
    return courses.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || c.status === filter)
    );
  }, [search, filter, courses]);

  // ================= STATS =================
  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === "Published").length,
    draft: courses.filter(c => c.status === "Draft").length
  };

  // ================= CRUD =================
  const openAdd = () => {
    setEditId(null);
    setForm(initialForm);
    setDrawerOpen(true);
  };

  const openEdit = (course) => {
    setEditId(course.id);
    setForm({
      title: course.title || "",
      description: course.description || "",
      syllabus: course.syllabus || "",
      duration: course.dur || "",
      mode: course.mode || "ONLINE",
      price: course.price ?? "",
      language: course.language || "Sanskrit",
      startDate: course.startDate || "",
      endDate: course.endDate || "",
      image: course.image || "",
      imageFile: null,
      imagePreview: course.image || "",
      videoFile: null,
      videoName: ""
    });
    setDrawerOpen(true);
  };

  const saveCourse = async () => {
    try {
      setSaving(true);
      if (!form.title.trim() || !form.description.trim() || !form.duration.trim() || !form.mode || !form.price || !form.startDate || !form.endDate || !form.language.trim()) {
        alert("Please fill all required fields.");
        setSaving(false);
        return;
      }
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      if (form.syllabus) payload.append("syllabus", form.syllabus);
      payload.append("duration", form.duration);
      payload.append("mode", form.mode);
      payload.append("price", Number(form.price));
      const languageList = form.language
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      payload.append("language", JSON.stringify(languageList));
      payload.append("startDate", form.startDate);
      payload.append("endDate", form.endDate);
      if (form.imageFile) payload.append("image", form.imageFile);

      if (editId) {
        await updateCourse(editId, payload);
      } else {
        await createCourse(payload);
      }

      await fetchCourses();
      setDrawerOpen(false);
      setEditId(null);
      setForm(initialForm);
    } catch (err) {
      console.error("Failed to save course:", err);
      alert("Failed to save course. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await toggleCourseStatus(id);
      const nextStatus = response?.status || response?.data?.status;
      setCourses(courses.map(c => {
        if (c.id !== id) return c;
        const isActive = (nextStatus || c.rawStatus) === "ACTIVE"
          ? "Published"
          : "Draft";
        return {
          ...c,
          rawStatus: nextStatus || c.rawStatus,
          status: isActive
        };
      }));
    } catch (err) {
      console.error("Failed to toggle course status:", err);
      alert("Failed to update course status.");
    }
  };

  const deleteCourseItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id);
        setCourses(courses.filter(c => c.id !== id));
      } catch (err) {
        console.error("Failed to delete course:", err);
        alert("Failed to delete course.");
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#F3E6C9] p-8 space-y-8">

      {/* PREMIUM HEADING */}
      

      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#74271E] via-[#8a2a1f] to-[#5a1b14] text-white p-8 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
              <MdAutoStories />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Course Management
              </h1>
              <p className="text-sm text-white/80 mt-1">
                Manage Sanskrit academy courses and visibility.
              </p>
            </div>
          </div>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#D4AF37] text-[#74271E] px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
          >
            <MdAdd size={16} />
            Add Course
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        {[{ label: "Total Courses", value: stats.total },
        { label: "Published", value: stats.published },
        { label: "Draft", value: stats.draft }].map((card, i) => (
          <div key={i} className="bg-[#FBF4E2] rounded-2xl p-6 border border-[#D1B062]/30">
            <p className="text-xs text-[#856966]">{card.label}</p>
            <h3 className="text-3xl font-black text-[#6b1d14]">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-wrap justify-between gap-4">
        <div className="relative w-full md:w-[350px]">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#856966]" size={20} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search course..."
            className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#FBF4E2] outline-none"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full border-4 border-[#E2D4A6] border-t-[#74271E] animate-spin mx-auto mb-4"></div>
            <p style={{ color: palette.textMuted }}>Loading courses...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
          <p>{error}</p>
        </div>
      )}
      
      {/* Content */}
      {!loading && !error && (
        <>
          {/* FILTERS */}
        <div className="flex items-center gap-2 border-b" style={{ borderColor: palette.goldDivider + '20' }}>
          {["All", "Published", "Draft"].map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)} className="px-6 py-3 text-sm font-bold relative" style={{ color: filter === tab ? palette.primary : palette.textMuted }}>
              {tab}
              {filter === tab && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: palette.primary }} />}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-[#fcf8f0]/30 border rounded-4xl overflow-hidden shadow-sm" style={{ borderColor: palette.goldDivider + '20' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-225">
              <thead>
                <tr className="border-b border-[#D1B062]/50" style={{ backgroundColor: palette.parchment + '40' }}>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#856966]">Course Title</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#856966]">Duration</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#856966]">Mode</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#856966]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center text-[#856966]">Visibility</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right text-[#856966]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: palette.goldDivider + '10' }}>
                <AnimatePresence mode="popLayout">
                  {filteredCourses.map((course) => (
                    <motion.tr key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} layout className="group hover:bg-[#FBF4E2]/20 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="size-11 rounded-2xl flex items-center justify-center text-xl" style={{ backgroundColor: palette.parchment, color: palette.primary }}>{course.icon}</div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-[#641e16]">{course.title}</span>
                            <span className="text-[10px] font-bold text-[#856966]">{course.level}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-[#856966]">{course.dur}</td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black" style={{ backgroundColor: palette.parchment, color: palette.accentDark }}>{course.mode}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`flex items-center gap-2 text-xs font-bold ${course.status === 'Published' ? 'text-green-600' : 'text-orange-400'}`}>
                          <span className={`size-1.5 rounded-full ${course.status === 'Published' ? 'bg-green-600' : 'bg-orange-400'}`}></span>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-center">
                          <div onClick={() => toggleStatus(course.id)} className="w-10 h-5 rounded-full relative transition-all cursor-pointer" style={{ backgroundColor: course.status === 'Published' ? palette.primary : '#CBD5E1' }}>
                            <motion.div animate={{ x: course.status === 'Published' ? 20 : 4 }} className="absolute top-0.5 size-4 bg-white rounded-full shadow-sm" />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                          <button onClick={() => openEdit(course)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><MdEdit size={18} /></button>
                          <button onClick={() => deleteCourseItem(course.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><MdDelete size={18} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
        </>
        )}

      <AddCourse
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        form={form}
        setForm={setForm}
        saveCourse={saveCourse}
        editId={editId}
      />

    </main>
  );
};

export default CourseManagement;
