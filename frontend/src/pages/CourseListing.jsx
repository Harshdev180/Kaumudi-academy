import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  RotateCcw,
  Check,
  Clock, BarChart3
} from "lucide-react";

const AllCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Shastras");
  const [modeFilter, setModeFilter] = useState("All Modes");
  const [levelFilter, setLevelFilter] = useState("Any Level");
  const [durationFilter, setDurationFilter] = useState("Any");

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
      image: "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=600",
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
      image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=600",
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
      image: "https://images.unsplash.com/photo-1516410529446-2c777cb7366d?auto=format&fit=crop&q=80&w=600",
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
      image: "https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?auto=format&fit=crop&q=80&w=600",
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
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
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
      image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=600",
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

      const matchesDuration =
        durationFilter === "Any" ||
        (durationFilter === "<3m" && course.duration.toLowerCase().includes("week")) ||
        (durationFilter === "6m" && course.duration.includes("6")) ||
        (durationFilter === "1y+" && course.duration.toLowerCase().includes("year"));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMode &&
        matchesLevel &&
        matchesDuration
      );
    });
  }, [searchQuery, activeCategory, modeFilter, levelFilter, durationFilter]);

  const isFiltered =
    searchQuery !== "" ||
    activeCategory !== "All Shastras" ||
    modeFilter !== "All Modes" ||
    levelFilter !== "Any Level";

  return (
    <div className="min-h-screen bg-[#f1e4c8] font-serif text-[#2D2417] selection:bg-[#B38B3F] selection:text-white antialiased">
      
      {/* --- REFINED HERO SECTION --- */}
      <header className="px-6 lg:px-10 pt-8 pb-16 max-w-screen-2xl mx-auto">
        <div className="relative h-[360px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=1600"
            alt="Ancient Sanskrit Manuscripts"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E2A1E]/90 via-[#1E2A1E]/60 to-transparent"></div>

          <div className="relative z-10 h-full flex items-center px-10 lg:px-20 pt-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-[1px] w-6 bg-[#c9a84e]"></div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#c9a84e]">
                  The Digital Gurukul
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight font-serif">
                Master the <span className="text-[#c9a84e]">Shastras</span> <br /> 
                with Living Traditions
              </h1>

              <p className="text-sm sm:text-base text-[#E6E2D3] leading-relaxed max-w-lg mb-8 opacity-80 font-normal">
                Explore the depths of Vedic wisdom and Paninian logic. 
                Bridge ancient heritage with modern structural analysis 
                through our curated Shastra archives.
              </p>
            </div>

            <div className="hidden lg:block absolute right-24 top-1/2 -translate-y-1/2 opacity-5">
              <span className="text-[200px] font-serif text-white select-none">ॐ</span>
            </div>
          </div>
        </div>
      </header>

      {/* ================= SEARCH BAR (BELOW HERO) ================= */}
      <div className="px-6 lg:px-10 max-w-screen-2xl mx-auto -mt-10 relative z-30">
        <div className="bg-[#FBF4E2] rounded-2xl shadow-lg border border-[#EDE4CF] p-4 flex flex-col lg:flex-row lg:items-center gap-4">

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for courses (e.g. Vyakarana, Gita, Panini)..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#FBF8F2] border border-[#E6DDC8] text-sm outline-none focus:border-[#B38B3F]"
            />
          </div>

          {/* Grid/List + Count */}
          <div className="flex items-center gap-3 justify-between lg:justify-end">
            {/* <div className="flex rounded-xl overflow-hidden border border-[#E6DDC8]">
              <button className="px-4 py-2 bg-[#4A1D1D] text-white text-sm font-semibold">
                Grid
              </button>
              <button className="px-4 py-2 text-sm text-[#6B5A3E] bg-[#FBF8F2]">
                List
              </button>
            </div> */}
            <span className="text-sm text-stone-500">
              {filteredCourses.length} courses found
            </span>
          </div>
        </div>
      </div>


      <div className="px-10 max-w-screen-2xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12">
        {/* ================= FILTER SECTION ================= */}
        <section className="relative z-20">
          <div className="sticky top-24">
            <div className="bg-[#FBF4E2] rounded-2xl border border-[#E2D4A6]/60 p-7 shadow-sm space-y-8">

              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#E6DDC8]">
                <h3 className="text-xl font-bold text-[#2D2417] font-serif">Filters</h3>
                <button
                  onClick={() => {
                    resetFilters();
                    setDurationFilter("Any");
                  }}
                  className="text-[10px] font-bold tracking-widest text-[#7A2E1D] hover:text-[#4A1D1D] transition-colors uppercase"
                >
                  Clear All
                </button>
              </div>

              {/* COURSE MODE */}
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] text-[#8B6D31] mb-5 uppercase opacity-80">
                  Course Mode
                </p>

                <div className="space-y-3">
                  {[
                    { label: "Online Live", value: "LIVE" },
                    { label: "Self-paced", value: "RECORDED" },
                    { label: "Physical Class", value: "PHYSICAL" },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className="group flex items-center gap-3 text-sm cursor-pointer text-[#4A4135] hover:text-[#2D2417] transition-colors"
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={modeFilter === item.value}
                          onChange={() =>
                            setModeFilter(modeFilter === item.value ? "All Modes" : item.value)
                          }
                          className="peer appearance-none w-5 h-5 border border-[#E2D4A6] rounded bg-[#FDFCF7] checked:bg-[#4A1D1D] checked:border-[#4A1D1D] transition-all cursor-pointer"
                        />
                        <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-[#E6DDC8] via-transparent to-transparent" />

              {/* DURATION */}
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] text-[#8B6D31] mb-5 uppercase opacity-80">Duration</p>

                <div className="space-y-3">
                  {[
                    { label: "Short-term (< 3m)", value: "<3m" },
                    { label: "6 Months", value: "6m" },
                    { label: "1 Year+", value: "1y+" },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className="group flex items-center gap-3 text-sm cursor-pointer text-[#4A4135] hover:text-[#2D2417] transition-colors"
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          name="duration"
                          checked={durationFilter.includes(item.value)}
                          onChange={() => 
                            setDurationFilter(durationFilter === item.value ? "Any" : item.value)
                          }
                          className="peer appearance-none w-5 h-5 border border-[#E2D4A6] rounded-full bg-[#FDFCF7] checked:border-[5px] checked:border-[#4A1D1D] transition-all cursor-pointer"
                        />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-[#E6DDC8] via-transparent to-transparent" />

              {/* LEVEL */}
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] text-[#8B6D31] mb-5 uppercase opacity-80">Level</p>

                <div className="space-y-3">
                  {[
                    { label: "Prathama (Beginner)", value: "Beginner" },
                    { label: "Madhyama (Intermediate)", value: "Intermediate" },
                    { label: "Kovida (Advanced)", value: "Advanced" },
                  ].map((lvl) => (
                    <label
                      key={lvl.value}
                      className="group flex items-center gap-3 text-sm cursor-pointer text-[#4A4135] hover:text-[#2D2417] transition-colors"
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={levelFilter === lvl.value}
                          onChange={() =>
                            setLevelFilter(levelFilter === lvl.value ? "Any Level" : lvl.value)
                          }
                          className="peer appearance-none w-5 h-5 border border-[#E2D4A6] rounded bg-[#FDFCF7] checked:bg-[#4A1D1D] checked:border-[#4A1D1D] transition-all cursor-pointer"
                        />
                        <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      <span className="font-medium">{lvl.label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* --- GRID OF KNOWLEDGE --- */}
        <main className="py-2">

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="group relative bg-[#FBF4E2] rounded-xl p-4 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border border-[#E2D4A6]/30 flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-3">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-[#4A1D1D] text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-md">
                        {course.mode}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-[#4A1D1D]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center items-center text-center p-6 translate-y-4 group-hover:translate-y-0">
                      <span className="text-[#B38B3F] text-[8px] font-black uppercase tracking-[0.2em] mb-2">Level: {course.level}</span>
                      <p className="text-white text-[11px] italic leading-relaxed">{course.duration} intensive study led by {course.instructor}.</p>
                      <div className="mt-4 w-8 h-[1px] bg-[#B38B3F]"></div>
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-1 h-1 rounded-full bg-[#B38B3F]"></div>
                      <span className="text-[11px] font-semibold text-stone-500">{course.instructor}</span>
                    </div>
                    <h3 className="font-bold text-lg text-[#2D2417] leading-tight mb-4 group-hover:text-[#4A1D1D] transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed mb-2 line-clamp-3">
                      Deep study into {course.category}. A {course.duration} immersive journey for {course.level} seekers.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4 mb-4 border-t border-[#E2D4A6]/30">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-7 rounded-lg bg-[#FDFCF7] flex items-center justify-center border border-[#E2D4A6]/40 shadow-sm">
                          <Clock className="w-3.5 h-3.5 text-[#8B6D31]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-[#4A4135]">{course.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 pl-4 border-l border-[#E2D4A6]/30">
                        <div className="w-8 h-7 rounded-lg bg-[#FDFCF7] flex items-center justify-center border border-[#E2D4A6]/40 shadow-sm">
                          <BarChart3 className="w-3.5 h-3.5 text-[#8B6D31]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-[#4A4135]">{course.level}</span>
                        </div>
                      </div>
                    </div>

                    
                    
                    <div className="mt-auto pt-3 border-t border-[#E2D4A6]/40 flex items-center justify-between">
                      {/* PRICE */}
                      <span className="text-lg font-bold text-[#4A1D1D] tabular-nums tracking-tight">
                        ₹{course.price}
                      </span>

                      <Link 
                        to={`/course/${course.id}`} 
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#c9a84e] text-white text-[10px] font-bold uppercase tracking-wider rounded-md transition-all duration-300 hover:bg-[#b38b3f] shadow-sm active:scale-95 group/link"
                      >
                        Learn More 
                        <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center justify-center bg-white border border-[#E2D4A6] rounded-2xl text-center">
              <div className="w-16 h-16 bg-[#FDFCF7] rounded-full flex items-center justify-center mb-6 border border-[#E2D4A6]">
                <Search className="w-6 h-6 text-stone-300" />
              </div>
              <h3 className="text-2xl font-bold text-[#2D2417] mb-2">No Shastras Found</h3>
              <p className="text-stone-500 italic mb-8">Try adjusting your filters to find what you seek.</p>
              <button onClick={resetFilters} className="px-8 py-3 bg-[#4A1D1D] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                Reset All Filters
              </button>
            </div>
          )}

          {/* --- REFINED PAGINATION --- */}
          <div className="flex justify-center items-center gap-2 mt-20 pb-10">
            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E2D4A6] text-[#8B6D31] hover:bg-[#4A1D1D] hover:text-white transition-all group">
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <div className="flex items-center gap-2 px-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all ${
                    n === 1 ? "bg-[#4A1D1D] text-white shadow-lg" : "text-[#8B6D31] bg-[#FBF4E2] hover:bg-[#FDFCF7] border border-transparent hover:border-[#B38B3F]"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E2D4A6] text-[#8B6D31] hover:bg-[#4A1D1D] hover:text-white transition-all group">
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllCoursesPage;