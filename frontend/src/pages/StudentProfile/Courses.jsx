import React, { useState } from 'react';
import { Search, Filter, Clock, Users, Star, PlayCircle } from 'lucide-react';

const Courses = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Grammar', 'Literature', 'Chanting', 'Philosophy'];

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
      image: "bg-[#2a1b0a]" 
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
      image: "bg-[#74271E]" // Replaced #1a4571
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
      image: "bg-[#c9a050]"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search for courses..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#c9a050]/50 shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === cat 
                ? 'bg-[#74271E] text-white shadow-md' // Replaced #1a4571
                : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-black/5 flex flex-col group">
            {/* Course Image/Hero Section */}
            <div className={`h-44 ${course.image} relative flex items-center justify-center p-6 text-center`}>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              <p className="relative z-10 text-[#c9a050] font-serif text-sm border-b border-[#c9a050]/30 pb-1">
                {course.title}
              </p>
              <button className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle size={24} />
              </button>
            </div>

            {/* Course Details */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-[#c9a050] uppercase tracking-widest bg-[#c9a050]/10 px-2 py-1 rounded">
                  {course.category}
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-bold text-gray-700">{course.rating}</span>
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-800 mb-1 leading-snug">
                {course.title}
              </h3>
              <p className="text-xs text-gray-400 mb-4">By {course.instructor}</p>

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

              {/* Progress or Enroll Button */}
              <div className="mt-auto">
                {course.progress > 0 ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500">
                      <span>Progress: {course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#74271E] h-full rounded-full transition-all duration-700" // Replaced #1a4571
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    {/* Updated Button Colors */}
                    <button className="w-full mt-4 bg-[#74271E] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#5a1e17] transition-all">
                      Continue Learning
                    </button>
                  </div>
                ) : (
                  /* Updated Outline Button Colors */
                  <button className="w-full bg-white border-2 border-[#74271E] text-[#74271E] py-3 rounded-xl font-bold text-sm hover:bg-[#74271E] hover:text-white transition-all">
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;