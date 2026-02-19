import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Clock,
  Users,
  Star,
  PlayCircle,
  SearchX,
} from "lucide-react";
import { getMyEnrollments } from "../../lib/api";
const Courses = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [notification, setNotification] = useState(null);

  const categories = ["All", "Grammar", "Literature", "Chanting", "Philosophy"];

  const staticFallback = [
    {
      id: "course-1",
      title: "Introduction to Sanskrit Grammar",
      category: "Grammar",
      instructor: "Dr. Ananya Rao",
      duration: "12 Hours",
      students: "1.2k",
      rating: 4.8,
      progress: 65,
      image: "bg-[#2a1b0a]",
    },
    {
      id: "course-2",
      title: "Vedic Chanting Basics",
      category: "Chanting",
      instructor: "Acharya Shastri",
      duration: "8 Hours",
      students: "850",
      rating: 4.9,
      progress: 0,
      image: "bg-[#74271E]",
    },
    {
      id: "course-3",
      title: "Panini's Ashtadhyayi - Vol 1",
      category: "Grammar",
      instructor: "Dr. Ananya Rao",
      duration: "24 Hours",
      students: "500",
      rating: 5.0,
      progress: 10,
      image: "bg-[#c9a050]",
    },
  ];

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getMyEnrollments();
        const payload = response?.data ?? response;
        const list = Array.isArray(payload) ? payload : payload?.data || [];

        const mapped = list.map((en) => {
          const c = en.course || en;
          return {
            id: c._id || c.id || en.id,
            title: c.title || en.courseTitle || "Untitled Course",
            category: c.category || "General",
            instructor: c.instructor || en.instructor || "Faculty",
            duration: c.duration || "",
            students: c.enrolledCount || en.students || "—",
            rating: c.rating || 4.8,
            progress: en.progress ?? c.progress ?? 0,
            image: c.image?.url ? `url(${c.image.url})` : null,
            raw: en,
          };
        });

        setCourses(mapped.length ? mapped : staticFallback);
        setNotification({
          type: "success",
          message: `Loaded ${mapped.length || staticFallback.length} courses`,
        });
        setTimeout(() => setNotification(null), 2500);
      } catch (err) {
        console.error("Failed to load enrollments:", err);
        setError("Unable to load your courses right now.");
        setCourses(staticFallback);
        setNotification({
          type: "warning",
          message: "Showing fallback courses",
        });
        setTimeout(() => setNotification(null), 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesCat = activeFilter === "All" || c.category === activeFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        (c.instructor || "").toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [courses, activeFilter, search]);

  const goToCourse = (course) => {
    const id =
      course.id ||
      course.raw?.course?._id ||
      course.raw?.courseId ||
      "panini-01";
    setNotification({ type: "info", message: "Opening course…" });
    setTimeout(() => setNotification(null), 1500);
    navigate(`/coursedetail/${id}`, { state: { course } });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-8 mt-6">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
              notification.type === "success"
                ? "bg-green-500"
                : notification.type === "warning"
                  ? "bg-yellow-500"
                  : "bg-[#74271E]"
            } text-white`}
          >
            <span className="text-sm font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search for courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#c9a050]/50 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === cat
                  ? "bg-[#74271E] text-white shadow-md"
                  : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading your courses...</div>
      ) : error && !filtered.length ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto mt-10 bg-[#FBF8F2] border border-[#E6DDC8] rounded-2xl shadow-md p-8 text-center"
        >
          {/* Icon */}
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-[#74271E]/10 grid place-items-center">
            <SearchX className="w-7 h-7 text-[#74271E]" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-[#74271E] mb-2">
            No courses found
          </h3>

          {/* Message */}
          <p className="text-sm text-[#6B5A3E] leading-relaxed">
            We couldn’t find any courses matching your filters. Try adjusting
            your search or selecting a different category.
          </p>

          {/* Hint */}
          <div className="mt-5 text-xs text-gray-500">
            Tip: Clear filters to explore all courses
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-black/5 flex flex-col group"
            >
              {/* Course Image/Hero Section */}
              <div
                className={`h-44 relative flex items-center justify-center p-6 text-center ${
                  course.image && !String(course.image).startsWith("url(")
                    ? course.image
                    : ""
                }`}
                style={
                  course.image && String(course.image).startsWith("url(")
                    ? {
                        backgroundImage: course.image,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {}
                }
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                <p className="relative z-10 text-[#c9a050] font-serif text-sm border-b border-[#c9a050]/30 pb-1">
                  {course.title}
                </p>
                <motion.button
                  onClick={() => goToCourse(course)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <PlayCircle size={24} />
                </motion.button>
              </div>

              {/* Course Details */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-[#c9a050] uppercase tracking-widest bg-[#c9a050]/10 px-2 py-1 rounded">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-bold text-gray-700">
                      {course.rating}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-gray-800 mb-1 leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  By {course.instructor}
                </p>

                <div className="flex items-center gap-4 text-gray-500 text-[11px] font-medium mb-6">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{course.students} Students</span>
                  </div>
                </div>

                {/* Progress Section (Always visible as they are enrolled) */}
                <div className="mt-auto">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500">
                      <span>Progress: {course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${course.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-[#74271E] h-full rounded-full"
                      />
                    </div>
                    <motion.button
                      onClick={() => goToCourse(course)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 bg-[#74271E] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#5a1e17] transition-all"
                    >
                      {course.progress > 0
                        ? "Continue Learning"
                        : "Start Learning"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
