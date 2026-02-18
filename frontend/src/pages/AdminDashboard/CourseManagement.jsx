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
  const [loading, setLoading] = useState(true);

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

  // ================= FAKE LOADER (API READY) =================
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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

  // ================= LOADER UI =================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3E6C9] flex items-center justify-center">
        <motion.div className="flex flex-col items-center gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="w-14 h-14 rounded-full border-4 border-[#D1B062] border-t-[#6b1d14]"
          />
          <motion.p
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            className="text-[#6b1d14] font-semibold tracking-wide"
          >
            Loading Courses...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // ================= UI =================
  return (
    <main className="min-h-screen bg-[#F3E6C9] p-8 space-y-10">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl px-6 md:px-10 py-10 text-white shadow-lg"
        style={{
          background:
            "linear-gradient(135deg,#7a1f16 0%, #8c2a1e 45%, #6b1d14 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,#D4AF37,transparent_60%)]" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Course Management
            </h1>
            <p className="text-sm text-white/90 mt-1">
              Manage Sanskrit academy courses and visibility.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#e6b86a] hover:bg-[#d9a956] text-[#4a2b07] px-5 py-2 rounded-xl text-sm font-semibold shadow transition"
          >
            <MdAdd size={16} />
            Add Course
          </button>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 -mt-14 relative z-10">
        {[
          { label: "Total Courses", value: stats.total },
          { label: "Published", value: stats.published },
          { label: "Draft", value: stats.draft }
        ].map((card, i) => (
          <div
            key={i}
            className="bg-[#efe2d2] rounded-2xl p-6 shadow-md flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-[#7c5a3c]">{card.label}</p>
              <h3 className="text-3xl font-black text-[#6b1d14]">
                {card.value}
              </h3>
            </div>
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
            className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#FBF4E2] outline-none shadow-sm"
          />
        </div>
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

      {/* COURSE GRID */}
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
