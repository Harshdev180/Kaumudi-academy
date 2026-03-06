import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Monitor, PlayCircle, Users } from "lucide-react";
import {
  getMyEnrollments,
  getProfileEnrollments,
  getCourseProgress,
} from "../../lib/api";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const filters = ["ALL", "ACTIVE", "COMPLETED", "DROPPED"];

  const filteredCourses = useMemo(() => {
    const term = search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesFilter =
        activeFilter === "ALL" || course.status === activeFilter;
      const matchesSearch =
        !term ||
        course.title.toLowerCase().includes(term) ||
        course.instructor.toLowerCase().includes(term);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, courses, search]);

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // useEffect(() => {
  //   const fetchEnrollments = async () => {
  //     try {
  //       setLoading(true);
  //       setError("");
  //       const response = await getMyEnrollments();
  //       const payload = response?.data ?? response;
  //       const list = Array.isArray(payload) ? payload : payload?.data || [];

  //       const mapped = list.map((en) => {
  //         const c = en.course || en;
  //         return {
  //           id: c._id || c.id || en.id,
  //           title: c.title || en.courseTitle || "Untitled Course",
  //           category: c.category || "General",
  //           instructor: c.instructor || en.instructor || "Faculty",
  //           duration: c.duration || "",
  //           students: c.enrolledCount || en.students || "—",
  //           rating: c.rating || 4.8,
  //           progress: en.progress ?? c.progress ?? 0,
  //           image: c.image?.url ? `url(${c.image.url})` : null,
  //           raw: en,
  //         };
  //       });

  //       setCourses(mapped.length ? mapped : staticFallback);
  //       setNotification({
  //         type: "success",
  //         message: `Loaded ${mapped.length || staticFallback.length} courses`,
  //       });
  //       setTimeout(() => setNotification(null), 2500);
  //     } catch (err) {
  //       console.error("Failed to load enrollments:", err);
  //       setError("Unable to load your courses right now.");
  //       setCourses(staticFallback);
  //       setNotification({
  //         type: "warning",
  //         message: "Showing fallback courses",
  //       });
  //       setTimeout(() => setNotification(null), 3000);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchEnrollments();
  // }, []);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);

        const response = await getMyEnrollments();
        const payload = response?.data ?? response;
        const list = Array.isArray(payload) ? payload : payload?.data || [];

        const mapped = await Promise.all(
          list.map(async (en) => {
            const c = en.course || en;

            let progress = 0;

            try {
              const res = await getCourseProgress(c._id);
              progress = res?.data?.progress || 0;
            } catch (err) {
              console.log("progress fetch failed");
            }

            return {
              id: c._id,
              title: c.title,
              category: c.category || "General",
              instructor: c.instructor?.name || "Faculty",
              duration: c.duration || "",
              mode: c.mode || "",
              progress,
              imageUrl: c.image?.url || "",
              raw: en,
            };
          }),
        );

        setCourses(mapped);
      } catch (err) {
        console.error("Failed to load enrollments:", err);
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
    {
      console.log(course);
    }
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
    <div className="max-w-6xl mx-auto px-2 sm:px-4 space-y-6 md:space-y-8 mt-4">
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        <div className="relative w-full md:w-96 min-w-0">
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

        <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-2 md:mt-0 no-scrollbar">
          {filters.map((status) => (
            <motion.button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                activeFilter === status
                  ? "bg-[#74271E] text-white shadow-md"
                  : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === "ALL"
                ? "All"
                : status?.charAt(0) + status?.slice(1).toLowerCase()}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading enrollments...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-sm text-gray-500">No enrollments found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-black/5 flex flex-col group"
            >
              {/* Course Image/Hero Section */}
              <div className="h-32 sm:h-44 relative flex items-center justify-center p-4 sm:p-6 text-center bg-[#2a1b0a] overflow-hidden">
                {course.imageUrl && (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                {/* <p className="relative z-10 text-[#c9a050] font-serif text-sm border-b border-[#c9a050]/30 pb-1">
                  {course.title}
                </p> */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                  {/* <p className="relative z-10 text-[#c9a050] font-serif text-sm border-b border-[#c9a050]/30 pb-1">
                    {course.title}
                  </p> */}
                  <motion.button
                    onClick={() => goToCourse(course)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <PlayCircle size={24} />
                  </motion.button>
                </motion.div>
              </div>

              {/* Course Details */}
              <div className="p-4 sm:p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-[#c9a050] uppercase tracking-widest bg-[#c9a050]/10 px-2 py-1 rounded">
                    {course.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {course.status?.charAt(0) +
                      course.status?.slice(1).toLowerCase()}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-gray-800 mb-1 leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  By {course.instructor}
                </p>

                <div className="flex flex-col gap-2 text-gray-500 text-[11px] font-medium mb-6">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{course.duration || "Duration TBA"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Monitor size={14} />
                    <span>{course.mode || "Mode TBA"}</span>
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {formatDate(course.startDate)} -{" "}
                    {formatDate(course.endDate)}
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
                        animate={{ width: `${course.progress}%` }}
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
