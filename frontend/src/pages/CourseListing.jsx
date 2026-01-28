import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Clock,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  BarChart,
  Filter,
  RotateCcw,
  User,
  ExternalLink,
} from "lucide-react";
import courseListingImg from "../assets/courselisting2.jpg";

const AllCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Shastras");
  const [modeFilter, setModeFilter] = useState("All Modes");
  const [levelFilter, setLevelFilter] = useState("Any Level");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    "All Shastras",
    "Veda & Upanishad",
    "Vyakarana (Grammar)",
    "Yoga & Ayurveda",
    "Darshana (Philosophy)",
    "Sahitya (Literature)",
    "Language",
  ];

  const courses = [
    {
      id: 1,
      title: "Foundations of Sanskrit Vyakaran (Level 1)",
      category: "Vyakarana (Grammar)",
      instructor: "Acharya Sharma",
      duration: "12 Weeks",
      level: "Beginner",
      mode: "ONLINE",
      price: "4,999",
      image:
        "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 2,
      title: "Mandukya Upanishad Deep Dive",
      category: "Veda & Upanishad",
      instructor: "Swami Jnananda",
      duration: "8 Weeks",
      level: "Intermediate",
      mode: "LIVE",
      price: "6,499",
      image:
        "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 3,
      title: "Kalidasa's Meghaduta: Aesthetics",
      category: "Sahitya (Literature)",
      instructor: "Dr. Meenakshi",
      duration: "6 Weeks",
      level: "Advanced",
      mode: "ONLINE",
      price: "3,200",
      image:
        "https://images.unsplash.com/photo-1516410529446-2c777cb7366d?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 4,
      title: "Sanskrit 101: Foundation",
      category: "Language",
      instructor: "Acharya Raghav",
      duration: "16 Weeks",
      level: "Beginner",
      mode: "RECORDED",
      price: "2,999",
      image:
        "https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 5,
      title: "Patanjali's Yoga Sutras",
      category: "Yoga & Ayurveda",
      instructor: "Vidushi Aruna",
      duration: "10 Weeks",
      level: "Intermediate",
      mode: "ONLINE",
      price: "5,500",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 6,
      title: "Deciphering Ancient Scripts",
      category: "Darshana (Philosophy)",
      instructor: "Dr. S. Murthy",
      duration: "14 Weeks",
      level: "Advanced",
      mode: "LIVE",
      price: "7,800",
      image:
        "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=600",
    },
  ];

  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("All Shastras");
    setModeFilter("All Modes");
    setLevelFilter("Any Level");
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "All Shastras" || course.category === activeCategory;
      const matchesMode =
        modeFilter === "All Modes" || course.mode === modeFilter.toUpperCase();
      const matchesLevel =
        levelFilter === "Any Level" || course.level === levelFilter;
      return matchesSearch && matchesCategory && matchesMode && matchesLevel;
    });
  }, [searchQuery, activeCategory, modeFilter, levelFilter]);

  const isFiltered =
    searchQuery !== "" ||
    activeCategory !== "All Shastras" ||
    modeFilter !== "All Modes" ||
    levelFilter !== "Any Level";

  return (
    <div className="min-h-screen bg-[#fef0c6] font-serif text-[#2D2417] selection:bg-[#B38B3F] selection:text-white antialiased">
      
      {/* --- HERO --- */}
      <header className="px-10 pt-10 pb-24 max-w-screen-2xl mx-auto">
        <div className="relative h-[360px] lg:h-[400px] rounded-2xl overflow-hidden bg-[#2F3A2A]">

          {/* Background Image */}
          <img
            src={courseListingImg}
            alt="Explore Our Shastras"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />

          {/* Soft Olive Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E2A1E]/80 via-[#2F3A2A]/60 to-[#1E2A1E]/80"></div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-12 lg:px-20 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5">
              Explore Our Shastras
            </h1>

            <p className="text-base sm:text-lg text-[#E6E2D3] leading-relaxed max-w-xl">
              Dive deep into the ocean of Vedic wisdom, Paninian grammar, and classical
              Indian philosophies with our expert Acharyas.
            </p>
          </div>
        </div>
      </header>

      {/* ================= FILTER SECTION ================= */}

      <section className="px-10 max-w-screen-2xl mx-auto -mt-15 relative z-20">
        <div className="bg-[#fff7e0] rounded-2xl border border-[#E2D4A6] px-8 py-8 lg:px-10 lg:py-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]">

          {/* Search + Selects */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-8">

            {/* Search */}
            <div className="flex-1">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B6D31] mb-3">
                <Search className="w-3 h-3" /> Search
              </label>
              <input
                type="text"
                value={searchQuery}
                placeholder="Search for courses (e.g. Panini, Vedanta, Yoga Sutras...)"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FFF9E8] border border-[#E2D4A6] text-sm outline-none focus:border-[#B38B3F] placeholder:text-stone-400"
              />
            </div>

            {/* Mode + Level */}
            <div className="flex flex-wrap gap-6">
              {[
                {
                  label: "Mode",
                  value: modeFilter,
                  set: setModeFilter,
                  opts: ["All Modes", "Online", "Live", "Recorded"],
                },
                {
                  label: "Level",
                  value: levelFilter,
                  set: setLevelFilter,
                  opts: ["Any Level", "Beginner", "Intermediate", "Advanced"],
                },
              ].map((filter) => (
                <div key={filter.label} className="min-w-[160px]">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B6D31] mb-3">
                    {filter.label}
                  </label>
                  <select
                    value={filter.value}
                    onChange={(e) => filter.set(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FFF9E8] border border-[#E2D4A6] text-xs font-bold uppercase cursor-pointer outline-none focus:border-[#B38B3F]"
                  >
                    {filter.opts.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}

              {/* Reset */}
              {isFiltered && (
                <button
                  onClick={resetFilters}
                  className="self-end flex items-center gap-2 px-4 py-3 rounded-xl bg-[#B38B3F] text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-[#E2D4A6]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition ${
                  activeCategory === cat
                    ? "bg-[#B38B3F] text-white"
                    : "bg-[#FFF9E8] text-[#6B5A2E] border border-[#E2D4A6] hover:border-[#B38B3F]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- GRID OF KNOWLEDGE --- */}
      <main className="px-10 max-w-screen-2xl mx-auto py-24">
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group relative bg-[#fff7e0] rounded-2xl overflow-hidden transition-all duration-700 hover:shadow-[20px_20px_60px_-15px_rgba(74,29,29,0.15)] hover:-translate-y-2"
              >
                {/* Image Container with Matting Effect */}
                <div className="relative h-72 overflow-hidden rounded-t-2xl">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover rounded-t-xl grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110"
                  />

                  {/* Elegant Mode Tag */}
                  <div className="absolute top-6 left-6 flex flex-col items-start gap-1">
                    <span className="bg-[#4A1D1D] text-[#FDFCF7] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                      {course.mode}
                    </span>
                    {/* <span className="bg-[#B38B3F] text-white px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                      {course.category.split(" ")[0]}
                    </span> */}
                  </div>

                  {/* Hover Statistics Overlay */}
                  <div className="absolute inset-0 bg-[#2D2417]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center items-center text-center p-8 translate-y-4 group-hover:translate-y-0">
                    <p className="text-[#B38B3F] text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-center">
                      Curriculum Insight
                    </p>
                    <p className="text-white/80 text-xs italic font-light leading-relaxed">
                      Deep study into {course.category} led by{" "}
                      {course.instructor}. A {course.duration} immersive journey
                      for {course.level} seekers.
                    </p>
                    <div className="mt-6 w-10 h-[1px] bg-[#B38B3F]"></div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 lg:p-8 relative">
                  {/* Background Accent Character (Subtle Watermark) */}
                  {/* <span className="absolute top-4 right-6 text-7xl font-serif text-stone-50 select-none pointer-events-none transition-colors group-hover:text-stone-100">
                    अ
                  </span> */}

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#B38B3F]"></div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                        {course.instructor}
                      </span>
                    </div>

                    <h3 className="font-bold text-2xl text-[#2D2417] leading-[1.2] mb-8 min-h-[60px] group-hover:text-[#4A1D1D] transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Technical Specifications Grid */}
                    <div className="grid grid-cols-2 border-y border-[#F3EEE0] mb-8">
                      <div className="py-4 border-r border-[#F3EEE0] flex flex-col gap-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">
                          Duration
                        </span>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#B38B3F]" />
                          <span className="text-xs font-bold text-[#2D2417]">
                            {course.duration}
                          </span>
                        </div>
                      </div>
                      <div className="py-4 pl-6 flex flex-col gap-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">
                          Proficiency
                        </span>
                        <div className="flex items-center gap-2">
                          <BarChart className="w-3.5 h-3.5 text-[#B38B3F]" />
                          <span className="text-xs font-bold text-[#2D2417]">
                            {course.level}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter mb-0.5">
                          Course Fee
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-bold text-[#2D2417]">
                            ₹
                          </span>
                          <span className="text-3xl font-black text-[#2D2417] tracking-tighter">
                            {course.price}
                          </span>
                        </div>
                      </div>

                      <Link 
                        to={`/course/${course.id}`} 
                        className="relative group/btn overflow-hidden px-6 py-3 rounded-xl bg-[#4A1D1D] text-[#FDFCF7] text-[10px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2"
                      >
                        Syllabus 
                        <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Results State */
          <div className="py-32 flex flex-col items-center justify-center bg-stone-50 border border-[#E5D5B5] text-center">
            <div className="w-20 h-20 bg-[#F3EEE0] rounded-full flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-stone-300" />
            </div>
            <h3 className="text-3xl font-bold text-[#2D2417] mb-2">
              No Shastras Found
            </h3>
            <p className="text-stone-500 italic max-w-xs mx-auto mb-8">
              Our archives didn't find anything matching "{searchQuery}". Try a
              broader term.
            </p>
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 bg-[#4A1D1D] text-white px-8 py-4 text-xs font-black uppercase tracking-widest shadow-xl"
            >
              <RotateCcw className="w-4 h-4" /> Reset All Filters
            </button>
          </div>
        )}

        {/* --- PRESTIGE PAGINATION --- */}
        <div className="flex justify-center items-center gap-3 mt-24">
          <button className="w-14 h-14 flex items-center justify-center border border-[#E5D5B5] hover:bg-[#4A1D1D] hover:text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              className={`w-14 h-14 flex items-center justify-center text-xs font-black tracking-widest transition-all ${n === 1 ? "bg-[#4A1D1D] text-white shadow-2xl" : "bg-[#fff7e0] border border-[#E5D5B5] hover:border-[#4A1D1D]"}`}
            >
              {n}
            </button>
          ))}
          <button className="w-14 h-14 flex items-center justify-center border border-[#E5D5B5] hover:bg-[#4A1D1D] hover:text-white transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default AllCoursesPage;
