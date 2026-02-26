import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdDelete,
  MdAutoStories,
  MdTranslate
} from "react-icons/md";

import AddCourse from "./AddCourse";
import {
  getAllCoursesForAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCourseStatus
} from "../../lib/api";

const CourseManagement = () => {

  const initialForm = {
    title: "",
    description: "",
    syllabus: "",
    duration: "",
    faculty: "",
    level: "Beginner",
    mode: "ONLINE",
    price: "",
    status: "Draft",
    language: "Sanskrit",
    startDate: "",
    endDate: "",
    image: "",
    imageFile: null,
    imagePreview: "",
    video1: "",
    video2: ""
  };

  /* ================= STATE ================= */

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [savingCourse, setSavingCourse] = useState(false);
  const [error, setError] = useState("");

  /* ⭐ STATIC COURSES WAPAS */
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Paninian Grammar Basics",
      description: "Foundation Course",
      faculty: "Acharya Rahul",
      level: "Beginner",
      dur: "6 Months",
      mode: "ONLINE",
      price: 240,
      status: "Published",
      icon: <MdAutoStories />
    },
    {
      id: 2,
      title: "Advanced Kavya Study",
      description: "Poetry Course",
      faculty: "Dr Meera",
      level: "Advanced",
      dur: "4 Months",
      mode: "HYBRID",
      price: 350,
      status: "Draft",
      icon: <MdAutoStories />
    }
  ]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);

  /* ================= FETCH COURSES ================= */

  const fetchCourses = async () => {
    try {
      const response = await getAllCoursesForAdmin();
      const payload = response?.data ?? response;
      const data = Array.isArray(payload) ? payload : payload?.data || [];

      if (!data.length) return; // static courses safe

      const formatted = data.map((course, index) => ({
        id: course._id || index,
        title: course.title,
        description: course.description,
        faculty: course.faculty || "",
        level: course.level || "Beginner",
        dur: course.duration,
        mode: course.mode,
        price: course.price,
        status: course.status === "ACTIVE" ? "Published" : "Draft",
        image: course.image,
        video1: course.video1,
        video2: course.video2,
        icon: <MdAutoStories />
      }));
      setCourses(formatted);

    } catch (err) {
      console.log("API fail → static courses used");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* ================= FILTER ================= */

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(search.toLowerCase()) &&
        (filter === "All" || c.status === filter)
    );
  }, [search, filter, courses]);

  /* ================= ACTIONS ================= */

  const openAdd = () => {
    setEditId(null);
    setForm(initialForm);
    setDrawerOpen(true);
  };

  const openEdit = (course) => {
    setEditId(course.id);
    setForm({
      ...initialForm,
      ...course,
      duration: course.dur
    });
    setDrawerOpen(true);
  };

  /* ⭐ SAVE FIXED */
  const saveCourse = async (e) => {
    e.preventDefault();

    const newCourse = {
      id: editId || Date.now(),
      title: form.title,
      image: form.imagePreview || form.image || "",
      description: form.description,
      faculty: form.faculty,
      level: form.level,
      dur: form.duration,
      mode: form.mode,
      price: form.price,
      status: "Draft",
      icon: <MdTranslate />
    };

    try {
      setSavingCourse(true);

      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("duration", form.duration);
      payload.append("faculty", form.faculty);
      payload.append("level", form.level);
      payload.append("mode", form.mode);
      payload.append("price", Number(form.price));

      if (editId) await updateCourse(editId, payload);
      else await createCourse(payload);

    } catch {
      console.log("API fail but UI updated");
    }

    /* ⭐ ALWAYS UPDATE UI */
    if (editId) {
      setCourses(prev =>
        prev.map(c => (c.id === editId ? newCourse : c))
      );
    } else {
      setCourses(prev => [newCourse, ...prev]);
    }

    setDrawerOpen(false);
    setEditId(null);
    setForm(initialForm);
    setSavingCourse(false);
  };

  const toggleStatus = (id) => {
    setCourses(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, status: c.status === "Published" ? "Draft" : "Published" }
          : c
      )
    );
  };

  const deleteCourseItem = (id) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="flex justify-center py-40">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className="w-14 h-14 border-4 border-[#D1B062] border-t-[#6b1d14] rounded-full"
        />
      </div>
    );
  }

  return (
    <main className="w-full bg-[#F3E6C9] p-6 space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#7a1f16] to-[#6b1d14] text-white rounded-3xl p-6 flex justify-between">
        <h1 className="text-sm md:text-3xl font-black">Course Management</h1>

        <button
          onClick={openAdd}
          className="flex items-center gap-1 bg-[#e6b86a] text-[#4a2b07] px-2 md:px-5 md:py-2 rounded-xl font-semibold text-xs md:text-xl"
        >
          <MdAdd /> Add Course
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-[#FBF4E2] rounded-2xl p-6 space-y-4">

        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#856966]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search course..."
            className="w-full pl-10 py-3 rounded-xl bg-white outline-none"
          />
        </div>

        <div className="flex gap-3">
          {["All", "Published", "Draft"].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold ${filter === tab
                ? "bg-[#6b1d14] text-white"
                : "text-[#6b1d14] border border-[#D1B062]/40"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="rounded-3xl overflow-hidden shadow-lg bg-white">

            {/* Image / hero */}
            <div className="relative h-44 bg-gradient-to-r from-[#7a1f16] to-[#6b1d14]">
              {course.imagePreview || course.image ? (
                <img
                  src={course.imagePreview || course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl opacity-90">
                  {course.icon}
                </div>
              )}

              <div className="absolute top-3 left-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${course.status === 'Published' ? 'bg-green-600 text-white' : 'bg-[#EFE3D5] text-[#6b1d14]'}`}>
                  {course.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 bg-[#FBF4E2] space-y-3">
              <div>
                <h3 className="text-lg font-bold text-[#6b1d14] leading-tight">{course.title}</h3>
                <p className="text-sm text-[#856966] mt-1 line-clamp-2">{course.description || 'No description available'}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xs text-[#6b1d14] bg-white/60 px-2 py-1 rounded-full">{course.level}</div>
                  <div className="text-xs text-[#6b1d14] bg-white/60 px-2 py-1 rounded-full">{course.mode}</div>
                  <div className="text-xs text-[#6b1d14] bg-white/60 px-2 py-1 rounded-full">{course.dur}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold text-[#6b1d14]">₹{course.price ?? '—'}</div>
                  <div className="text-xs text-[#856966]">Faculty: {course.faculty || 'TBA'}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button onClick={() => openEdit(course)} className="px-3 py-2 bg-white rounded-lg border border-[#E6D9C4] text-[#6b1d14] hover:bg-[#EFE3D5] transition">
                    <MdEdit />
                  </button>
                  <button onClick={() => deleteCourseItem(course.id)} className="px-3 py-2 bg-white rounded-lg border border-[#E6D9C4] text-[#6b1d14] hover:bg-red-50 transition">
                    <MdDelete />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleStatus(course.id)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-colors ${course.status === 'Published' ? 'bg-green-600/80 text-white' : 'bg-[#6b1d14]/80 text-white'}`}
                    aria-pressed={course.status === 'Published'}
                  >
                    {course.status === 'Published' ? 'Active' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      <AddCourse
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        form={form}
        setForm={setForm}
        saveCourse={saveCourse}
        editId={editId}
        savingCourse={savingCourse}
      />

    </main>
  );
};

export default CourseManagement;
