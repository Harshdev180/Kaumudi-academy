import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdDelete
} from "react-icons/md";

import AddCourse from "./AddCourse";
import {
  getAllCoursesForAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCourseStatus
} from "../../lib/api";

const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

const parseLanguageInput = (value) => {
  if (Array.isArray(value)) {
    return value.map((lang) => String(lang).trim()).filter(Boolean);
  }
  if (!value) return [];
  return String(value)
    .split(",")
    .map((lang) => lang.trim())
    .filter(Boolean);
};

const CourseManagement = () => {

  const initialForm = {
    title: "",
    description: "",
    syllabus: "",
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
    videoFile: null,
    videoName: ""
  };

  /* ================= STATE ================= */

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [savingCourse, setSavingCourse] = useState(false);
  const [error, setError] = useState("");

  const [courses, setCourses] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);

  /* ================= FETCH COURSES ================= */

  const mapCourse = (course) => {
    const languageValue = Array.isArray(course?.language)
      ? course.language.join(", ")
      : course?.language || "";

    return {
      id: course?._id || course?.id,
      title: course?.title || "Untitled Course",
      description: course?.description || "",
      syllabus: course?.syllabus || "",
      duration: course?.duration || "",
      faculty: course?.instructor || course?.faculty || "",
      level: course?.level || "Prathama (Beginner)",
      mode: course?.mode || "ONLINE",
      price: course?.price ?? "",
      status: course?.status === "ACTIVE" ? "Published" : "Draft",
      language: languageValue,
      startDate: toDateInputValue(course?.startDate),
      endDate: toDateInputValue(course?.endDate),
      image: course?.image?.url || course?.image || "",
      imagePreview: course?.image?.url || course?.image || ""
    };
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllCoursesForAdmin();
      const payload = response?.data ?? response;
      const data = Array.isArray(payload) ? payload : payload?.data || [];
      const formatted = Array.isArray(data) ? data.map(mapCourse) : [];
      setCourses(formatted);

    } catch (err) {
      console.error("Failed to load courses:", err);
      setError("Failed to load courses. Please try again.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* ================= FILTER ================= */

  const filteredCourses = useMemo(() => {
    const term = search.trim().toLowerCase();
    return courses.filter((course) => {
      const title = (course.title || "").toLowerCase();
      const matchSearch = !term || title.includes(term);
      const matchFilter = filter === "All" || course.status === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter, courses]);

  /* ================= ACTIONS ================= */

  const openAdd = () => {
    setEditId(null);
    setForm(initialForm);
    setError("");
    setDrawerOpen(true);
  };

  const openEdit = (course) => {
    setEditId(course.id);
    setForm({
      ...initialForm,
      ...course,
      imageFile: null,
      imagePreview: course.image || course.imagePreview || ""
    });
    setError("");
    setDrawerOpen(true);
  };

  const buildCoursePayload = (data) => {
    const payload = new FormData();
    const languages = parseLanguageInput(data.language);
    payload.append("title", data.title.trim());
    payload.append("description", data.description.trim());
    payload.append("syllabus", data.syllabus?.trim() || "");
    payload.append("duration", data.duration.trim());
    if (data.faculty?.trim()) {
      payload.append("instructor", data.faculty.trim());
    }
    payload.append("level", data.level || "Prathama (Beginner)");
    payload.append("mode", data.mode);
    payload.append("price", String(Number(data.price)));
    payload.append("language", JSON.stringify(languages));
    payload.append("startDate", data.startDate);
    payload.append("endDate", data.endDate);
    if (data.imageFile) {
      payload.append("image", data.imageFile);
    }
    return payload;
  };

  const validateCourse = (data, isEdit) => {
    if (!data.title.trim()) return "Course title is required.";
    if (data.title.trim().length < 3) return "Course title must be at least 3 characters.";
    if (!data.description.trim()) return "Description is required.";
    if (data.description.trim().length < 10) return "Description must be at least 10 characters.";
    if (!data.duration.trim()) return "Duration is required.";
    if (!data.level) return "Course level is required.";
    if (!data.mode) return "Course mode is required.";
    if (data.price === "" || data.price === null) return "Price is required.";
    const priceValue = Number(data.price);
    if (Number.isNaN(priceValue)) return "Valid price is required.";
    if (!data.startDate) return "Start date is required.";
    if (!data.endDate) return "End date is required.";
    if (new Date(data.endDate) <= new Date(data.startDate)) {
      return "End date must be after start date.";
    }
    const languages = parseLanguageInput(data.language);
    if (!languages.length) return "At least one language is required.";
    if (!isEdit && !data.imageFile && !data.image) {
      return "Course thumbnail image is required.";
    }
    return null;
  };

  const saveCourse = async (e) => {
    e.preventDefault();
    const validationError = validateCourse(form, !!editId);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setSavingCourse(true);
      const payload = buildCoursePayload(form);
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
      alert(err?.response?.data?.message || "Failed to save course.");
    } finally {
      setSavingCourse(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await toggleCourseStatus(id);
      const nextStatus = response?.status || response?.data?.status;
      setCourses(prev =>
        prev.map(course =>
          course.id === id
            ? {
              ...course,
              status: nextStatus
                ? (nextStatus === "ACTIVE" ? "Published" : "Draft")
                : (course.status === "Published" ? "Draft" : "Published")
            }
            : course
        )
      );
    } catch (err) {
      console.error("Failed to update course status:", err);
      alert("Failed to update course status.");
    }
  };

  const deleteCourseItem = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await deleteCourse(id);
      setCourses(prev => prev.filter(course => course.id !== id));
    } catch (err) {
      console.error("Failed to delete course:", err);
      alert("Failed to delete course.");
    }
  };

  /* ================= UI ================= */

  if (loading && courses.length === 0) {
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
        <h1 className="text-3xl font-black">Course Management</h1>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#e6b86a] text-[#4a2b07] px-5 py-2 rounded-xl font-semibold"
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

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
      {!error && filteredCourses.length === 0 && (
        <div className="text-sm text-[#74271E]/70">No courses found.</div>
      )}

      {/* GRID */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-[#FBF4E2] rounded-3xl p-5 space-y-3">

            <h3 className="font-bold text-[#6b1d14]">{course.title}</h3>
            <p className="text-sm text-[#856966]">Faculty: {course.faculty}</p>
            <p className="text-xs text-[#6b1d14] bg-[#EFE3D5] inline-block px-3 py-1 rounded-full">
              Level: {course.level}
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => toggleStatus(course.id)}
                className="px-3 py-1 bg-[#EFE3D5] rounded-full text-xs"
              >
                {course.status}
              </button>

              <div className="flex gap-2 text-xl text-[#6b1d14]">
                <button onClick={() => openEdit(course)}>
                  <MdEdit />
                </button>
                <button onClick={() => deleteCourseItem(course.id)}>
                  <MdDelete />
                </button>
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
