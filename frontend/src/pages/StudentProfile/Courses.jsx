import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Clock, Users, Star, PlayCircle } from "lucide-react";

const Courses = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "Grammar", "Literature", "Chanting", "Philosophy"];

  const courses = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-8 mt-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
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
              className={`h-44 ${course.image} relative flex items-center justify-center p-6 text-center`}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
              <p className="relative z-10 text-[#c9a050] font-serif text-sm border-b border-[#c9a050]/30 pb-1">
                {course.title}
              </p>
              <motion.button
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
    </div>
  );
};

export default Courses;
