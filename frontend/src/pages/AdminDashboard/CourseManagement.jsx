import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdSearch, MdNotifications, MdFileDownload, MdAdd,
  MdAutoStories, MdSchool, MdTranslate, MdMoreVert,
  MdFilterList, MdChevronLeft, MdChevronRight, MdDelete, MdEdit,
  MdClose, MdSave, MdCloudUpload
} from 'react-icons/md';
import { getAllCoursesForAdmin, createCourse, updateCourse } from '../../lib/api';

const CourseManagement = () => {
  // 1. COLORS & THEME
  const palette = {
    primary: "#6b1d14",
    accentDark: "#6b1d14",
    goldDivider: "#D1B062",
    parchment: "#FBF4E2",
    bgLight: "#f8f7f6",
    textDark: "#171212",
    textMuted: "#856966"
  };

  // 2. STATE MANAGEMENT
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  
  // Form State for Add New Course
  const [formData, setFormData] = useState({ title: '', level: 'Beginner', price: '', duration: '3 Months', mode: 'ONLINE' });

  // 3. Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAllCoursesForAdmin();
        const data = Array.isArray(response) ? response : response.data || [];
        
        // Transform API response to match UI format
        const formattedCourses = data.map((course, index) => ({
          id: course._id || course.id || index,
          title: course.title || 'Untitled Course',
          level: course.level || 'Beginner',
          dur: course.duration || '3 Months',
          mode: course.mode || 'ONLINE',
          price: course.price || '0',
          status: course.status === 'active' ? 'Published' : 'Draft',
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

    fetchCourses();
  }, []);

  // 3. LOGIC: Search & Filter
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === "All" || course.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filter, courses]);

  // 4. FUNCTIONAL LOGIC: Export, Add, Toggle, Delete
  const handleExport = () => {
    const headers = "Title,Level,Duration,Mode,Price,Status\n";
    const csv = filteredCourses.map(c => `${c.title},${c.level},${c.dur},${c.mode},${c.price},${c.status}`).join("\n");
    const blob = new Blob([headers + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "Course_List.csv";
    link.click();
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        title: formData.title,
        level: formData.level,
        price: parseFloat(formData.price),
        duration: formData.dur,
        mode: formData.mode,
        status: 'draft'
      };
      
      const response = await createCourse(courseData);
      const newCourse = response.data || response;
      
      const newEntry = {
        id: newCourse._id || newCourse.id || Date.now(),
        title: newCourse.title,
        level: newCourse.level,
        dur: newCourse.duration,
        mode: newCourse.mode,
        price: newCourse.price,
        status: 'Draft',
        icon: <MdAutoStories />,
      };
      
      setCourses([newEntry, ...courses]);
      setIsModalOpen(false);
      setFormData({ title: '', level: 'Beginner', price: '', dur: '3 Months', mode: 'ONLINE' });
    } catch (err) {
      console.error("Failed to create course:", err);
      alert("Failed to create course. Please try again.");
    }
  };

  const toggleStatus = async (id) => {
    try {
      const course = courses.find(c => c.id === id);
      const newStatus = course.status === "Published" ? "draft" : "active";
      
      await updateCourse(id, { status: newStatus });
      
      setCourses(courses.map(c => c.id === id ? { ...c, status: c.status === "Published" ? "Draft" : "Published" } : c));
    } catch (err) {
      console.error("Failed to toggle course status:", err);
      alert("Failed to update course status.");
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        // Note: Backend may not have delete endpoint, using updateCourse with status as fallback
        await updateCourse(id, { status: 'deleted' });
        setCourses(courses.filter(c => c.id !== id));
      } catch (err) {
        console.error("Failed to delete course:", err);
        alert("Failed to delete course.");
      }
    }
  };

  return (
    <main className="flex-1 md:ml-0 min-h-screen bg-[#F3E6C9] flex flex-col transition-all duration-300">
      {/* HEADER */}
      <header className="h-1 border border-b-[#6b1d14] bg-[#F3E6C9] flex items-center justify-between px-8 mt-8 sticky top-0 z-10 " style={{ borderColor: palette.goldDivider + '30' }}>
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative w-full">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl" style={{ color: palette.textMuted }} />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by title..." className="w-full border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 outline-none transition-all" style={{ backgroundColor: palette.bgLight }} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold bg-white" style={{ borderColor: palette.goldDivider }}>
            <MdFileDownload size={18} /> Export
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-bold shadow-lg" style={{ backgroundColor: palette.primary }}>
            <MdAdd size={20} /> New Course
          </button>
        </div>
      </header>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 space-y-8">
        {/* HEADING */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: palette.accentDark }}>Course Management</h2>
            <p className="text-sm mt-1" style={{ color: palette.textMuted }}>Showing {filteredCourses.length} courses total</p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full border-4 border-[#E2D4A6] border-t-[#74271E] animate-spin mx-auto mb-4"></div>
              <p style={{ color: palette.textDark }}>Loading courses...</p>
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
                          {/* <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><MdEdit size={18} /></button> */}
                          <button onClick={() => deleteCourse(course.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><MdDelete size={18} /></button>
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
      </motion.div>

      {/* ADD NEW COURSE MODAL (LOGIC IMPLEMENTED) */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-[450px] bg-white z-50 shadow-2xl p-8 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-[#171212]">Add Course</h2>
                <button onClick={() => setIsModalOpen(false)}><MdClose size={24} /></button>
              </div>
              <form onSubmit={handleAddCourse} className="space-y-6">
                <input required placeholder="Course Title" className="w-full p-3 bg-gray-50 rounded-xl outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Price" type="number" className="w-full p-3 bg-gray-50 rounded-xl outline-none" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                  <select className="w-full p-3 bg-gray-50 rounded-xl outline-none" value={formData.mode} onChange={e => setFormData({ ...formData, mode: e.target.value })}>
                    <option>ONLINE</option>
                    <option>HYBRID</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-4 text-white rounded-xl font-black" style={{ backgroundColor: palette.primary }}>SAVE COURSE</button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
};

export default CourseManagement;