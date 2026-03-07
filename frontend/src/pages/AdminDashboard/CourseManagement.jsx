import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdDelete,
  MdAutoStories,
  MdTranslate,
} from "react-icons/md";
import { getAllStaff } from "../../lib/api";
import AddCourse from "./AddCourse";
import {
  getAllCoursesForAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCourseStatus,
} from "../../lib/api";

const CourseManagement = () => {
  const initialForm = {
    title: "",
    description: "",
    syllabus: "",
    curriculum: [],
    curriculumText: "",
    batchSchedule: [],
    duration: "",
    faculty: "",
    level: "Prathama (Beginner)",
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
    video2: "",
    instructor: "",
  };

  /* ================= STATE ================= */

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [savingCourse, setSavingCourse] = useState(false);
  const [error, setError] = useState("");
  const [staffList, setStaffList] = useState([]);

  const [courses, setCourses] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [hasPendingCurriculum, setHasPendingCurriculum] = useState(false);

  /* ================= FETCH COURSES ================= */

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await getAllCoursesForAdmin();
      const payload = response?.data ?? response;
      const data = Array.isArray(payload) ? payload : payload?.data || [];

      const formatted = data.map((course, index) => ({
        id: course._id || index,
        title: course.title,
        description: course.description,
        faculty: course.instructor?.name || "",
        instructor: course.instructor?._id || "", // ✅ ADD THIS
        level: course.level || "Beginner",
        dur: course.duration,
        mode: course.mode,
        price: course.price,
        status: course.status === "ACTIVE" ? "Published" : "Draft",
        image: course.image?.url || course.image || "",
        imagePublicId: course.image?.public_id || "",
        language: course.language,
        syllabus: course.syllabus,
        curriculum: course.curriculum,
        batchSchedule: course.batchSchedule || [],
        startDate: course.startDate ? course.startDate.split("T")[0] : "",
        endDate: course.endDate ? course.endDate.split("T")[0] : "",
        icon: <MdAutoStories />,
      }));
      setCourses(formatted);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await getAllStaff();
      const data = res?.data || res;
      setStaffList(data || []);
    } catch (err) {
      console.error("Failed to fetch staff", err);
    }
  };

  /* ================= FILTER ================= */

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(search.toLowerCase()) &&
        (filter === "All" || c.status === filter),
    );
  }, [search, filter, courses]);

  /* ================= ACTIONS ================= */

  const openAdd = () => {
    setEditId(null);
    setForm(initialForm);
    setDrawerOpen(true);
  };

  const openEdit = (course) => {
    console.log("Opening edit for course:", course);
    setEditId(course.id);
    // Parse curriculum if it's a string, otherwise use as-is
    let curriculumText = "";
    if (course.curriculum) {
      if (typeof course.curriculum === "string") {
        try {
          curriculumText = JSON.stringify(
            JSON.parse(course.curriculum),
            null,
            2,
          );
        } catch (e) {
          curriculumText = course.curriculum;
        }
      } else if (Array.isArray(course.curriculum)) {
        // Even if array is empty, we need to show it as JSON string
        curriculumText = JSON.stringify(course.curriculum, null, 2);
      }
    }
    console.log("curriculumText:", curriculumText);
    console.log("batchSchedule:", course.batchSchedule);

    // First set the form data
    setForm({
      ...initialForm,
      ...course,
      duration: course.dur || course.duration || "",
      curriculumText: curriculumText,
      batchSchedule: course.batchSchedule || [],
    });

    // Then open the drawer after a small delay to ensure state is updated
    setTimeout(() => {
      setDrawerOpen(true);
    }, 100);
  };

  /* ================= SAVE COURSE ================= */
  // In CourseManagement.jsx — replace the saveCourse payload section with this:

  const saveCourse = async (e) => {
    e.preventDefault();

    // Check for pending curriculum items
    if (hasPendingCurriculum) {
      setError(
        "Please click 'Add Module' to save your curriculum module before submitting.",
      );
      return;
    }

    setSavingCourse(true);
    setError("");

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (form.startDate) {
        const sd = new Date(form.startDate);
        if (sd < today) {
          setError("Start date must be upcoming (today or later).");
          setSavingCourse(false);
          return;
        }
      }
      if (form.endDate) {
        const ed = new Date(form.endDate);
        if (ed < today) {
          setError("End date must be upcoming (today or later).");
          setSavingCourse(false);
          return;
        }
      }
      if (form.startDate && form.endDate) {
        const sd = new Date(form.startDate);
        const ed = new Date(form.endDate);
        if (ed < sd) {
          setError("End date cannot be before start date.");
          setSavingCourse(false);
          return;
        }
      }
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("syllabus", form.syllabus || "");
      // Parse curriculumText to curriculum array
      let curriculumData = [];
      if (form.curriculumText) {
        try {
          curriculumData = JSON.parse(form.curriculumText);
        } catch (err) {
          console.error("Invalid curriculum JSON:", err);
        }
      }
      payload.append("curriculum", JSON.stringify(curriculumData));
      payload.append("duration", form.duration);
      payload.append("instructor", form.instructor);
      payload.append("mode", form.mode);
      payload.append("price", Number(form.price));
      payload.append("level", form.level);

      // ✅ language → JSON stringified array (validator parses JSON.parse on string)
      const langs =
        typeof form.language === "string"
          ? form.language
              .split(",")
              .map((l) => l.trim())
              .filter(Boolean)
          : Array.isArray(form.language)
            ? form.language
            : ["Sanskrit"];
      payload.append("language", JSON.stringify(langs));

      // ✅ dates → ISO 8601 format
      if (form.startDate) {
        payload.append("startDate", new Date(form.startDate).toISOString());
      }
      if (form.endDate) {
        payload.append("endDate", new Date(form.endDate).toISOString());
      }

      // ✅ batch schedule
      payload.append("batchSchedule", JSON.stringify(form.batchSchedule || []));

      // ✅ Image file
      if (form.imageFile) {
        payload.append("image", form.imageFile);
      }

      if (form.video1File) payload.append("video1", form.video1File);
      if (form.video2File) payload.append("video2", form.video2File);

      if (editId) {
        const response = await updateCourse(editId, payload);
        const updated = response?.data?.data || response?.data;

        setCourses((prev) =>
          prev.map((c) =>
            c.id === editId
              ? {
                  ...c,
                  title: updated.title,
                  description: updated.description,
                  // ✅ Extract strings, never store objects
                  faculty: updated.instructor?.name || updated.faculty || "",
                  instructor:
                    updated.instructor?._id || updated.instructor || "",
                  level: updated.level || c.level,
                  dur: updated.duration,
                  mode: updated.mode,
                  price: updated.price,
                  status: updated.status === "ACTIVE" ? "Published" : "Draft",
                  image: updated.image?.url || updated.image || c.image,
                  language: updated.language,
                  syllabus: updated.syllabus,
                  startDate: updated.startDate?.split("T")[0] || c.startDate,
                  endDate: updated.endDate?.split("T")[0] || c.endDate,
                }
              : c,
          ),
        );
      } else {
        if (!form.imageFile) {
          setError("Course thumbnail image is required.");
          setSavingCourse(false);
          return;
        }

        const response = await createCourse(payload);
        const created = response?.data?.data || response?.data;

        const newCourse = {
          id: created._id,
          title: created.title,
          description: created.description,
          faculty: created.instructor?.name || created.faculty || "",
          instructor: created.instructor?._id || created.instructor || "",
          level: created.level || "Beginner",
          dur: created.duration,
          mode: created.mode,
          price: created.price,
          status: created.status === "ACTIVE" ? "Published" : "Draft",
          image: created.image?.url || "",
          language: created.language,
          syllabus: created.syllabus,
          startDate: created.startDate?.split("T")[0] || "",
          endDate: created.endDate?.split("T")[0] || "",
          icon: <MdTranslate />,
        };

        setCourses((prev) => [newCourse, ...prev]);
      }

      setDrawerOpen(false);
      setEditId(null);
      setForm(initialForm);
    } catch (err) {
      console.error("Save course error:", err);
      const validationErrors = err?.response?.data?.errors;
      let msg;
      if (
        validationErrors &&
        Array.isArray(validationErrors) &&
        validationErrors.length > 0
      ) {
        msg = validationErrors.join(", ");
      } else {
        msg =
          err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          "Failed to save course. Please try again.";
      }
      setError(msg);
    } finally {
      setSavingCourse(false);
    }
  };

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (id) => {
    try {
      const response = await toggleCourseStatus(id);
      const newStatus = response?.data?.status; // "ACTIVE" | "INACTIVE"

      setCourses((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: newStatus
                  ? newStatus === "ACTIVE"
                    ? "Published"
                    : "Draft"
                  : c.status === "Published"
                    ? "Draft"
                    : "Published",
              }
            : c,
        ),
      );
    } catch (err) {
      console.error("Toggle status error:", err);
      setError("Failed to update course status.");
    }
  };

  /* ================= DELETE ================= */
  const deleteCourseItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete course error:", err);
      setError("Failed to delete course.");
    }
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
      <div className="relative rounded-3xl overflow-hidden text-white shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6b1d14] via-[#7a2318] to-[#6b1d14]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(209,176,98,0.22),transparent_60%)]" />
        <div className="relative px-6 md:px-8 py-6 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 flex items-center justify-center text-xl md:text-2xl">
              <MdAutoStories />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black tracking-tight">
                Course Management
              </h1>
              <p className="text-xs md:text-sm text-white/80">
                Create, edit and publish academy courses with ease.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-[#d6b15c] text-[#4a2b07] px-4 md:px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
            >
              <MdAdd /> <span className="hidden sm:inline">Add Course</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-3 rounded-xl">
          {error}
          <button
            className="ml-4 text-xs underline"
            onClick={() => setError("")}
          >
            Dismiss
          </button>
        </div>
      )}

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
          {["All", "Published", "Draft"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold ${
                filter === tab
                  ? "bg-[#6b1d14] text-white"
                  : "text-[#6b1d14] border border-[#D1B062]/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-20 text-[#856966]">
          <MdAutoStories className="mx-auto text-5xl mb-3 opacity-40" />
          <p className="text-lg font-semibold">No courses found</p>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id || course._id}
            className="group rounded-3xl overflow-hidden shadow-lg bg-[#FBF4E2] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Image / hero section */}
            <div className="relative h-48 bg-gradient-to-br from-[#7a1f16] to-[#6b1d14]">
              {course.imagePreview || course.image ? (
                <img
                  src={course.imagePreview || course.image}
                  alt={course.title || "Course thumbnail"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/400x200?text=Course+Image";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-5xl opacity-80">
                  {course.icon || "📚"}
                </div>
              )}

              {/* Status badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg ${
                    course.status === "Published"
                      ? "bg-[#6b1d14] text-white"
                      : "bg-[#EFE3D5] text-[#6b1d14]"
                  }`}
                >
                  {course.status || "Draft"}
                </span>
              </div>

              {/* Mode badge (optional) */}
              {course.mode && (
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#6b1d14] shadow-lg">
                    {course.mode}
                  </span>
                </div>
              )}
            </div>

            {/* Content section */}
            <div className="p-5 bg-[#FBF4E2] space-y-4">
              {/* Title and description */}
              <div>
                <h3 className="text-lg font-bold text-[#6b1d14] leading-tight line-clamp-2">
                  {course.title || "Untitled Course"}
                </h3>
                <p className="text-sm text-[#856966] mt-2 line-clamp-2">
                  {course.description || "No description available"}
                </p>
              </div>

              {/* Tags row */}
              <div className="flex flex-wrap items-center gap-2">
                {course.level && (
                  <span className="text-xs font-medium text-[#6b1d14] bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
                    {course.level}
                  </span>
                )}
                {course.duration && (
                  <span className="text-xs font-medium text-[#6b1d14] bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
                    {course.duration}
                  </span>
                )}
                {!course.level && !course.duration && (
                  <span className="text-xs text-[#856966]">
                    No details available
                  </span>
                )}
              </div>

              {/* Price and faculty */}
              <div className="flex items-center justify-between border-t border-[#E6D9C4] pt-3">
                <div>
                  <div className="text-sm text-[#856966]">Faculty</div>
                  <div className="text-sm font-semibold text-[#6b1d14]">
                    {course.faculty || "Faculty Not Assigned"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#856966]">Price</div>
                  <div className="text-lg font-extrabold text-[#6b1d14]">
                    ₹
                    {course.price
                      ? Number(course.price).toLocaleString("en-IN")
                      : "—"}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(course)}
                    className="p-2.5 bg-white rounded-xl border border-[#E6D9C4] text-[#6b1d14] hover:bg-[#EFE3D5] hover:border-[#6b1d14] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6b1d14] focus:ring-offset-2"
                    aria-label="Edit course"
                    title="Edit course"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteCourseItem(course.id || course._id)}
                    className="p-2.5 bg-white rounded-xl border border-[#E6D9C4] text-[#6b1d14] hover:bg-red-50 hover:border-red-500 hover:text-red-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label="Delete course"
                    title="Delete course"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={() => toggleStatus(course.id || course._id)}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    course.status === "Published"
                      ? "bg-[#6b1d14] text-white hover:bg-[#6b1d14] focus:ring-[#6b1d14]"
                      : "text-[#6b1d14] bg-white border border-white hover:border-[#6b1d14] focus:ring-[#6b1d14]"
                  }`}
                  aria-pressed={course.status === "Published"}
                >
                  {course.status === "Published" ? "Published" : "Publish"}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {filteredCourses.length === 0 && (
          <div className="col-span-full text-center py-16 px-4">
            <div className="bg-[#FBF4E2] rounded-3xl p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-[#6b1d14] mb-2">
                No Courses Found
              </h3>
              <p className="text-[#856966] mb-6">
                Get started by creating your first course
              </p>
              <button
                onClick={openAdd}
                className="px-6 py-3 bg-[#6b1d14] text-white rounded-xl font-semibold hover:bg-[#8b2d21] transition-colors"
              >
                Create New Course
              </button>
            </div>
          </div>
        )}
      </div>

      <AddCourse
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        form={form}
        setForm={setForm}
        saveCourse={saveCourse}
        editId={editId}
        savingCourse={savingCourse}
        staffList={staffList}
        onHasPendingCurriculum={setHasPendingCurriculum}
        curriculumError={error}
      />
    </main>
  );
};

export default CourseManagement;
