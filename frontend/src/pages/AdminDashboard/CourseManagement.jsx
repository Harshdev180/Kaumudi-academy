import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdDelete,
  MdAutoStories,
  MdSchool,
  MdTranslate
} from "react-icons/md";
import AddCourse from "./AddCourse";
import { Plus } from "lucide-react";

const CourseManagement = () => {

  const palette = {
    primary: "#6b1d14",
    parchment: "#FBF4E2",
    bg: "#F3E6C9",
    gold: "#D1B062",
    textMuted: "#856966"
  };

  // ================= STATE =================
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Paninian Grammar Basics",
      description: "Foundation course of Paninian Sanskrit Grammar",
      level: "Beginner",
      dur: "6 Months",
      mode: "ONLINE",
      price: "240",
      status: "Published",
      image: "",
      icon: <MdAutoStories />
    },
    {
      id: 2,
      title: "Advanced Kavya Study",
      description: "Classical Sanskrit poetry analysis",
      level: "Advanced",
      dur: "4 Months",
      mode: "HYBRID",
      price: "350",
      status: "Draft",
      image: "",
      icon: <MdSchool />
    }
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    level: "Beginner",
    dur: "3 Months",
    mode: "ONLINE",
    price: "",
    status: "Draft",
    image: ""
  });

  // ================= FILTER =================
  const filtered = useMemo(() => {
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
    setForm({
      title: "",
      description: "",
      level: "Beginner",
      dur: "3 Months",
      mode: "ONLINE",
      price: "",
      status: "Draft",
      image: ""
    });
    setDrawerOpen(true);
  };

  const openEdit = (course) => {
    setEditId(course.id);
    setForm(course);
    setDrawerOpen(true);
  };

  const saveCourse = (e) => {
    e.preventDefault();

    if (editId) {
      setCourses(prev =>
        prev.map(c => c.id === editId ? { ...c, ...form } : c)
      );
    } else {
      setCourses(prev => [
        { ...form, id: Date.now(), icon: <MdTranslate /> },
        ...prev
      ]);
    }

    setDrawerOpen(false);
  };

  const deleteCourse = (id) => {
    setCourses(prev => prev.filter(c => c.id !== id));
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

  // ================= UI =================
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

        {/* <button
          onClick={openAdd}
          className="flex items-center gap-2 px-6 py-3 text-white rounded-xl shadow-lg"
          style={{ backgroundColor: palette.primary }}
        >
          <MdAdd size={20} /> Add Course
        </button> */}
      </div>

      {/* FILTER */}
      <div className="flex gap-4">
        {["All", "Published", "Draft"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold ${filter === tab ? "text-white" : "text-[#856966]"}`}
            style={{ backgroundColor: filter === tab ? palette.primary : "transparent" }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* PREMIUM COURSE GRID */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map(course => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[#FBF4E2] border border-[#D1B062]/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >

              {/* IMAGE TOP */}
              <div className="w-full h-[180px] bg-[#EFE3D5] overflow-hidden">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[#6b1d14] text-3xl">
                    {course.icon}
                  </div>
                )}
              </div>

              {/* BODY */}
              <div className="p-5 space-y-3">

                <h3 className="font-bold text-[#6b1d14]">
                  {course.title}
                </h3>

                <p className="text-xs text-[#856966] line-clamp-2">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-2 text-[11px] text-[#856966]">
                  <span>{course.level}</span>
                  <span>•</span>
                  <span>{course.dur}</span>
                  <span>•</span>
                  <span>{course.mode}</span>
                </div>

                <div className="flex justify-between items-center pt-2">

                  <button
                    onClick={() => toggleStatus(course.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${course.status === "Published"
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-500"
                      }`}
                  >
                    {course.status}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(course)}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                    >
                      <MdEdit size={18} />
                    </button>

                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>

                </div>

              </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* DRAWER */}
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
