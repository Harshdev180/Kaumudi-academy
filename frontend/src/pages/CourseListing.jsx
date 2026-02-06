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
  Clock, BarChart3,
  Filter,
  BookOpen
} from "lucide-react";

const AllCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Shastras");
  const [modeFilter, setModeFilter] = useState([]); 
  const [levelFilter, setLevelFilter] = useState([]);
  const [durationFilter, setDurationFilter] = useState([]);

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
    setModeFilter([]);
    setLevelFilter([]);
    setDurationFilter([]);
  };

  // Helper to toggle items in an array
  const handleToggleFilter = (state, setter, value) => {
    if (state.includes(value)) {
      setter(state.filter((item) => item !== value));
    } else {
      setter([...state, value]);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "All Shastras" || course.category === activeCategory;

      // Check if array is empty (all allowed) OR if the course mode is in the array
      const matchesMode =
        modeFilter.length === 0 || modeFilter.includes(course.mode);

      const matchesLevel =
        levelFilter.length === 0 || levelFilter.includes(course.level);

      const matchesDuration =
        durationFilter.length === 0 ||
        (durationFilter.includes("<3m") && course.duration.toLowerCase().includes("week")) ||
        (durationFilter.includes("6m") && course.duration.includes("6")) ||
        (durationFilter.includes("1y+") && course.duration.toLowerCase().includes("year"));

      return matchesSearch && matchesCategory && matchesMode && matchesLevel && matchesDuration;
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
      <header className="px-4 lg:px-10 pt-6 pb-14 max-w-screen-2xl mx-auto">
        <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-[#E2D4A6]/50">
          <img
            src="https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=1600"
            alt="Ancient Sanskrit Manuscripts"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E2A1E] via-[#1E2A1E]/70 to-transparent"></div>

          <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-16">
            <div className="flex items-center gap-3 mb-5">
                <div className="h-[1px] w-6 bg-[#c9a84e]"></div>
                <span className="text-[13px] font-semibold uppercase tracking-widest text-[#c9a84e]">
                  The Digital Gurukul
                </span>
              </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Master the <span className="text-[#c9a84e] italic">Shastras</span> <br /> 
              with Living Traditions
            </h1>

            <p className="text-base md:text-lg text-[#E6E2D3] leading-relaxed max-w-xl opacity-90 font-light">
              Bridge ancient heritage with modern structural analysis 
              through our curated Shastra archives and expert-led pathways.
            </p>
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
              placeholder="Search for courses"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#FBF8F2] border border-[#E6DDC8] text-sm outline-none focus:border-[#B38B3F]"
            />
          </div>

          <div className="flex items-center gap-3 justify-between lg:justify-end">
            {/* Quick Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 px-2 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat 
                    ? "bg-[#74271E] text-white shadow-md shadow-[#74271E]/20" 
                    : "bg-white text-[#6B5A3E] border border-[#E6DDC8] hover:border-[#B38B3F]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-10 max-w-screen-2xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
      
        {/* ================= FILTER SECTION ================= */}
        <aside className="space-y-6 pb-5">
          <div className="sticky top-24 bg-[#FBF4E2] rounded-3xl border border-[#E2D4A6]/60 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#74271E]" />
                <h3 className="text-lg font-bold text-[#2D2417]">Refine Search</h3>
              </div>
              <button
                onClick={resetFilters}
                className="text-[10px] font-bold tracking-widest text-[#74271E] hover:underline uppercase"
              >
                Reset
              </button>
            </div>

            {/* Filter Groups */}
            <div className="space-y-10">
              {[
                { title: "Mode of Study", state: modeFilter, setter: setModeFilter, options: [
                  { label: "Online Live", val: "LIVE" },
                  { label: "Self-paced", val: "RECORDED" },
                  { label: "Physical Class", val: "PHYSICAL" }
                ]},
                { title: "Duration", state: durationFilter, setter: setDurationFilter, options: [
                  { label: "Short-term", val: "<3m" },
                  { label: "6 Months", val: "6m" },
                  { label: "1 Year+", val: "1y+" },
                ]},
                { title: "Difficulty Level", state: levelFilter, setter: setLevelFilter, options: [
                  { label: "Prathama (Beginner)", val: "Beginner" },
                  { label: "Madhyama (Intermediate)", val: "Intermediate" },
                  { label: "Kovida (Advanced)", val: "Advanced" }
                ]}
              ].map((group, i) => (
                <div key={i}>
                  <p className="text-[10px] font-black tracking-[0.15em] text-[#8B6D31] mb-5 uppercase opacity-70">
                    {group.title}
                  </p>
                  <div className="space-y-3">
                    {group.options.map((opt) => (
                      <label key={opt.val} className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            // Check if this specific value is in the state array
                            checked={group.state.includes(opt.val)}
                            onChange={() => handleToggleFilter(group.state, group.setter, opt.val)}
                            className="peer appearance-none w-5 h-5 border-2 border-[#E2D4A6] rounded-md checked:bg-[#74271E] checked:border-[#74271E] transition-all"
                          />
                          <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-sm font-medium text-[#4A4135] group-hover:text-[#74271E] transition-colors">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>


        {/* --- GRID OF KNOWLEDGE --- */}
        <main className="py-4">

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border border-[#E2D4A6]/40 flex flex-col h-full"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#74271E] text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                        {course.mode}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow bg-[#FDFCF7]/50 group-hover:bg-white transition-colors">
                    {/* <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-1 h-1 rounded-full bg-[#B38B3F]"></div>
                      <span className="text-[11px] font-semibold text-stone-500">{course.instructor}</span>
                    </div> */}
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-3.5 h-3.5 text-[#B38B3F]" />
                      <span className="text-[11px] font-bold text-[#8B6D31] uppercase tracking-wide">{course.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#2D2417] leading-snug mb-3 group-hover:text-[#74271E] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed mb-2 line-clamp-3">
                      Deep study into {course.category}. A {course.duration} immersive journey for {course.level} seekers.
                    </p>

                    <div className="mt-auto">
                      <div className="flex items-center justify-between py-4 border-y border-[#E2D4A6]/30 mb-5">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#B38B3F]" />
                          <span className="text-xs font-bold text-[#4A4135]">{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BarChart3 className="w-4 h-4 text-[#B38B3F]" />
                          <span className="text-xs font-bold text-[#4A4135]">{course.level}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#74271E] tabular-nums tracking-tight">
                          ₹{course.price}
                        </span>
                        <Link 
                          to={`/course/${course.id}`} 
                          className="flex items-center  gap-2 px-3 py-2 bg-[#c9a84e] text-white text-[10px] font-bold uppercase tracking-wider rounded-md transition-all duration-300 hover:bg-[#b38b3f] shadow-sm active:scale-95 group/link"
                        >
                          Learn More 
                          <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                        </Link>
                      </div>
                      
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
              <button onClick={resetFilters} className="px-8 py-3 bg-[#74271E] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                Reset All Filters
              </button>
            </div>
          )}

          {/* --- REFINED PAGINATION --- */}
          <div className="flex justify-center items-center gap-3 mt-16">
            <button className="p-3 rounded-xl border border-[#E2D4A6] text-[#8B6D31] hover:bg-white transition-all disabled:opacity-30">
              <ChevronLeft className="w-5 h-5" />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`w-11 h-11 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  n === 1 ? "bg-[#74271E] text-white shadow-xl shadow-[#74271E]/20" : "text-[#8B6D31] bg-white border border-[#E2D4A6] hover:border-[#B38B3F]"
                }`}
              >
                {n}
              </button>
            ))}
            <button className="p-3 rounded-xl border border-[#E2D4A6] text-[#8B6D31] hover:bg-white transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllCoursesPage;
