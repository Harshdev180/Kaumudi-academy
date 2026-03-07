import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/useAuthHook";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  RotateCcw,
  Check,
  Clock,
  BarChart3,
  Filter,
  BookOpen,
  LayoutGrid,
  List,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { getAllCourses } from "../lib/api";
import SEO from "../components/SEO";

const AllCoursesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Shastras");
  const [modeFilter, setModeFilter] = useState([]);
  const [levelFilter, setLevelFilter] = useState([]);
  const [durationFilter, setDurationFilter] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [view, setView] = useState("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 6;

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getAllCourses();
      console.log(response);
      // Normalize possible shapes: array, { courses: [...] }, { items: [...] }, { data: [...] }
      const payload = response;
      const list = Array.isArray(payload)
        ? payload
        : payload?.courses || payload?.items || payload?.data || [];

      const finalList = Array.isArray(list) ? list : [];
      // Map backend Course model to UI-friendly shape expected by the listing
      const mapped = finalList.map((c) => {
        // Handle price formatting - extract numeric value
        let priceValue = c.price || 0;
        if (typeof priceValue === "string") {
          priceValue = parseInt(priceValue.replace(/[^0-9]/g, "")) || 0;
        }
        const language = Array.isArray(c.language)
          ? c.language.join(", ")
          : c.language || "";
        const image =
          c.image?.url ||
          c.image ||
          "https://i.pinimg.com/736x/c6/3c/1d/c63c1d8721a4226db27c8a2b6fd3448e.jpg";

        // Properly extract instructor name from populated object
        const instructorName = c.instructor?.name
          ? `Sanskrit with ${c.instructor.name}`
          : "";

        return {
          id: c._id || c.id,
          title: c.title || c.name || "Untitled Course",
          instructor: instructorName,
          instructorObj: c.instructor, // Keep full object for detail pages
          category: c.category || "General",
          mode: c.mode || "ONLINE",
          level: c.level || "All Levels",
          duration: c.duration || "",
          description: c.description || "",
          price: typeof priceValue === "number" ? priceValue : 0,
          priceFormatted: `₹${(typeof priceValue === "number" ? priceValue : 0).toLocaleString("en-IN")}`,
          image,
          language,
          raw: c,
        };
      });

      console.debug(
        "CourseListing: fetched courses count=",
        mapped.length,
        mapped[0],
      );
      setCourses(mapped);
    } catch (err) {
      setError("Failed to load courses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        courses
          .map((course) => course.category)
          .filter((cat) => typeof cat === "string" && cat.trim() !== ""),
      ),
    );
    return ["All Shastras", ...unique];
  }, [courses]);

  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("All Shastras");
    setModeFilter([]);
    setLevelFilter([]);
    setDurationFilter([]);
  };

  const durationOptions = useMemo(() => {
    const set = new Set(
      courses
        .map((c) => (c.duration || "").trim())
        .filter((d) => d && d.length > 0),
    );
    return Array.from(set);
  }, [courses]);

  const fixedDurationOptions = useMemo(
    () => [
      { label: "Monthly", val: "__fixed_monthly" },
      { label: "Semester", val: "__fixed_semester" },
      { label: "3 Months", val: "__fixed_3m" },
      { label: "6 Months", val: "__fixed_6m" },
      { label: "Year", val: "__fixed_year" },
    ],
    [],
  );

  const normalizedDynamicDurations = useMemo(() => {
    const fixedLabels = new Set(
      fixedDurationOptions.map((o) => o.label.toLowerCase()),
    );
    return durationOptions
      .filter((d) => !fixedLabels.has(String(d).toLowerCase()))
      .map((d) => ({ label: d, val: d }));
  }, [durationOptions, fixedDurationOptions]);

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
      const instructorName =
        typeof course.instructor === "string"
          ? course.instructor
          : course.instructor?.name || "";

      const matchesSearch =
        (course.title || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        instructorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "All Shastras" || course.category === activeCategory;

      // Check if array is empty (all allowed) OR if the course mode is in the array
      const matchesMode =
        modeFilter.length === 0 || modeFilter.includes(course.mode);

      const matchesLevel =
        levelFilter.length === 0 || levelFilter.includes(course.level);

      const cd = (course.duration || "").trim();
      const s = cd.toLowerCase();
      const weekMatch = s.match(/(\d+)\s*week/);
      const monthMatch = s.match(/(\d+)\s*month/);
      const yearMatch = s.match(/(\d+)\s*year/);
      const weeks = weekMatch ? Number(weekMatch[1]) : 0;
      const months = monthMatch ? Number(monthMatch[1]) : 0;
      const years = yearMatch ? Number(yearMatch[1]) : 0;
      const isMonthly =
        s.includes("monthly") ||
        (months === 1 && s.includes("month")) ||
        (weeks >= 3 && weeks <= 5);
      const is3m =
        (months === 3 && s.includes("month")) || (weeks >= 12 && weeks <= 14);
      const is6m =
        s.includes("semester") ||
        (months === 6 && s.includes("month")) ||
        (weeks >= 24 && weeks <= 28);
      const isYear =
        years >= 1 || (months >= 12 && s.includes("month")) || weeks >= 48;
      const matchesDuration =
        durationFilter.length === 0 ||
        durationFilter.some((val) => {
          if (val === "__fixed_monthly") return isMonthly;
          if (val === "__fixed_3m") return is3m;
          if (val === "__fixed_6m") return is6m;
          if (val === "__fixed_semester") return is6m;
          if (val === "__fixed_year") return isYear;
          return val === cd;
        });

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMode &&
        matchesLevel &&
        matchesDuration
      );
    });
  }, [
    searchQuery,
    activeCategory,
    modeFilter,
    levelFilter,
    durationFilter,
    courses,
  ]);

  const isFiltered =
    searchQuery !== "" ||
    activeCategory !== "All Shastras" ||
    modeFilter.length > 0 ||
    levelFilter.length > 0 ||
    durationFilter.length > 0;

  const parsePrice = (p) => Number(String(p).replace(/[^0-9]/g, "")) || 0;

  const parseDurationWeeks = (d) => {
    const s = String(d).toLowerCase();
    const weekMatch = s.match(/(\d+)\s*week/);
    const monthMatch = s.match(/(\d+)\s*month/);
    const yearMatch = s.match(/(\d+)\s*year/);
    if (weekMatch) return Number(weekMatch[1]);
    if (monthMatch) return Number(monthMatch[1]) * 4;
    if (yearMatch) return Number(yearMatch[1]) * 52;
    return 0;
  };

  const sortedCourses = useMemo(() => {
    const arr = [...filteredCourses];
    switch (sortBy) {
      case "priceAsc":
        arr.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case "priceDesc":
        arr.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case "durationAsc":
        arr.sort(
          (a, b) =>
            parseDurationWeeks(a.duration) - parseDurationWeeks(b.duration),
        );
        break;
      case "durationDesc":
        arr.sort(
          (a, b) =>
            parseDurationWeeks(b.duration) - parseDurationWeeks(a.duration),
        );
        break;
      default:
        break;
    }
    return arr;
  }, [filteredCourses, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedCourses.length / itemsPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedCourses = sortedCourses.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-[#f1e4c8] font-serif text-[#2D2417] selection:bg-[#B38B3F] selection:text-white antialiased">
      <SEO
        title="Sanskrit Courses | Kaumudi Sanskrit Academy by Graphura India"
        description="Explore authentic Sanskrit courses at Kaumudi Sanskrit Academy, a venture of Graphura India Private Limited. From Paninian Grammar to Vedic studies, learn from experts."
        canonicalPath="/allcourses"
        og={{ type: "website" }}
        keywords={[
          "Sanskrit courses online",
          "Learn Sanskrit grammar",
          "Kaumudi Sanskrit Academy courses",
          "Graphura India education",
          "Paninian Vyakarana",
          "Vedic studies India",
          "Ashtadhyayi classes",
          "Sanskrit certification",
          "Vyakaran Shastra",
          "Shloks and Spoken Sanskrit",
        ]}
      />
      {/* --- REFINED HERO SECTION --- */}
      <header className="px-4 lg:px-10 pt-6 pb-14 max-w-screen-2xl mx-auto">
        <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-[#E2D4A6]/50">
          <img
            src="https://i.pinimg.com/736x/c6/3c/1d/c63c1d8721a4226db27c8a2b6fd3448e.jpg"
            alt="Ancient Sanskrit Manuscripts"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E2A1E] via-[#1E2A1E]/70 to-transparent"></div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-16"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-[1px] w-6 bg-[#c9a84e]"></div>
              <span className="text-[13px] font-semibold uppercase tracking-widest text-[#c9a84e]">
                The Digital Gurukul
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Master the <span className="text-[#c9a84e] italic">Shastras</span>{" "}
              <br />
              with Living Traditions
            </h1>

            <p className="text-base md:text-lg text-[#E6E2D3] leading-relaxed max-w-xl opacity-90 font-light">
              Bridge ancient heritage with modern structural analysis through
              our curated Shastra archives and expert-led pathways.
            </p>
          </motion.div>
        </div>
      </header>

      {/* ================= SEARCH BAR (BELOW HERO) ================= */}
      <div className="px-4 sm:px-6 lg:px-10 max-w-screen-2xl mx-auto -mt-8 sm:-mt-10 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="
      bg-[#FBF4E2]
      rounded-2xl
      shadow-lg
      border border-[#EDE4CF]
      p-4
      flex flex-col gap-4
      lg:flex-row lg:items-center
    "
        >
          {/* SEARCH INPUT */}
          <motion.div layout className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for courses"
              className="
          w-full
          pl-12 pr-4 py-3
          rounded-xl
          bg-[#FBF8F2]
          border border-[#E6DDC8]
          text-sm
          outline-none
          transition-all duration-300
          focus:border-[#B38B3F]
          focus:bg-white
        "
            />
          </motion.div>

          {/* CATEGORY + FILTER AREA */}
          <div
            className="
        flex flex-col gap-3
        sm:flex-row sm:items-center sm:justify-between
        lg:justify-end
        w-full lg:w-auto
      "
          >
            {/* CATEGORY CHIPS */}
            {/* <motion.div
              layout
              className="
          flex items-center gap-2
          overflow-x-auto
          scroll-smooth
          px-1 pb-1
          no-scrollbar
          max-w-full
        "
            >
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ y: -1 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`
              whitespace-nowrap
              px-4 sm:px-5 py-2.5
              rounded-xl
              text-xs font-bold
              transition-all duration-300
              flex-shrink-0
              ${
                activeCategory === cat
                  ? "bg-[#74271E] text-white shadow-md shadow-[#74271E]/20"
                  : "bg-white text-[#6B5A3E] border border-[#E6DDC8] hover:border-[#B38B3F]"
              }
            `}
                >
                  {cat}
                </motion.button>
              ))}
            </motion.div> */}

            {/* FILTER BUTTON */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="
          lg:hidden
          inline-flex items-center justify-center gap-2
          px-4 py-2.5
          rounded-xl
          bg-[#74271E]
          text-white
          text-xs font-bold
          transition-all duration-300
          hover:bg-[#5c1f18]
          w-full sm:w-auto
        "
              onClick={() => setMobileFiltersOpen(true)}
              aria-label="Open filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="px-4 lg:px-10 max-w-screen-2xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
        {/* ================= FILTER SECTION ================= */}
        <aside className="space-y-6 pb-5 hidden lg:block">
          <div className="sticky top-24 bg-[#FBF4E2] rounded-3xl border border-[#E2D4A6]/60 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#74271E]" />
                <h3 className="text-lg font-bold text-[#2D2417]">
                  Refine Search
                </h3>
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
                {
                  title: "Mode of Study",
                  state: modeFilter,
                  setter: setModeFilter,
                  options: [
                    { label: "Online Live", val: "ONLINE" },
                    { label: "Physical Class", val: "OFFLINE" },
                  ],
                },
                {
                  title: "Duration",
                  state: durationFilter,
                  setter: setDurationFilter,
                  options: [
                    ...fixedDurationOptions,
                    // ...normalizedDynamicDurations,
                  ],
                },
                {
                  title: "Difficulty Level",
                  state: levelFilter,
                  setter: setLevelFilter,
                  options: [
                    {
                      label: "Prathama (Beginner)",
                      val: "Prathama (Beginner)",
                    },
                    {
                      label: "Madhyama (Intermediate)",
                      val: "Madhyama (Intermediate)",
                    },
                    { label: "Kovida (Advanced)", val: "Kovida (Advanced)" },
                  ],
                },
              ].map((group, i) => (
                <div key={i}>
                  <p className="text-[10px] font-black tracking-[0.15em] text-[#8B6D31] mb-5 uppercase opacity-70">
                    {group.title}
                  </p>
                  <div className="space-y-3">
                    {group.options.map((opt) => (
                      <label
                        key={opt.val}
                        className="flex items-center gap-3 group cursor-pointer"
                      >
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            // Check if this specific value is in the state array
                            checked={group.state.includes(opt.val)}
                            onChange={() =>
                              handleToggleFilter(
                                group.state,
                                group.setter,
                                opt.val,
                              )
                            }
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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-[#4A4135]">
                {sortedCourses.length} results
              </span>
              {isFiltered && (
                <>
                  {activeCategory !== "All Shastras" && (
                    <button
                      onClick={() => setActiveCategory("All Shastras")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E6DDC8] text-xs"
                    >
                      {activeCategory} <X className="w-3 h-3" />
                    </button>
                  )}
                  {modeFilter.map((m) => (
                    <button
                      key={`m-${m}`}
                      onClick={() =>
                        setModeFilter(modeFilter.filter((x) => x !== m))
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E6DDC8] text-xs"
                    >
                      {m} <X className="w-3 h-3" />
                    </button>
                  ))}
                  {levelFilter.map((l) => (
                    <button
                      key={`l-${l}`}
                      onClick={() =>
                        setLevelFilter(levelFilter.filter((x) => x !== l))
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E6DDC8] text-xs"
                    >
                      {l} <X className="w-3 h-3" />
                    </button>
                  ))}
                  {durationFilter.map((d) => (
                    <button
                      key={`d-${d}`}
                      onClick={() =>
                        setDurationFilter(durationFilter.filter((x) => x !== d))
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E6DDC8] text-xs"
                    >
                      {d === "__fixed_monthly"
                        ? "Monthly"
                        : d === "__fixed_semester"
                          ? "Semester"
                          : d === "__fixed_3m"
                            ? "3 Months"
                            : d === "__fixed_6m"
                              ? "6 Months"
                              : d === "__fixed_year"
                                ? "Year"
                                : d}{" "}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#74271E] text-white text-xs font-bold"
                  >
                    Clear All
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none pl-4 pr-10 py-2 rounded-xl bg-white border border-[#E6DDC8] text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="durationAsc">Duration: Shortest First</option>
                  <option value="durationDesc">Duration: Longest First</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B6D31]" />
              </div>
              <div className="hidden sm:flex items-center gap-1 rounded-xl border border-[#E6DDC8] p-1 bg-white">
                <button
                  onClick={() => setView("grid")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                    view === "grid"
                      ? "bg-[#74271E] text-white"
                      : "text-[#4A4135]"
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                    view === "list"
                      ? "bg-[#74271E] text-white"
                      : "text-[#4A4135]"
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 rounded-full border-4 border-[#E2D4A6] border-t-[#74271E] animate-spin mb-4"></div>
              <p className="text-[#4A4135] font-semibold">Loading courses...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 bg-red-50 rounded-2xl border border-red-200 p-8">
              <p className="text-red-600 font-semibold text-center">{error}</p>
              <button
                onClick={() => {
                  setLoading(true);
                  fetchCourses();
                }}
                className="mt-4 px-6 py-2 bg-[#74271E] text-white rounded-lg font-bold hover:bg-[#5a1f15] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : paginatedCourses.length > 0 ? (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
              }
            >
              {paginatedCourses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`group bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border border-[#E2D4A6]/40 ${
                    view === "list"
                      ? "flex flex-col sm:flex-row"
                      : "flex flex-col"
                  } h-full`}
                >
                  {/* Image Container */}
                  <div
                    className={
                      view === "list"
                        ? "relative w-full sm:w-1/3 aspect-[16/12] overflow-hidden"
                        : "relative aspect-[16/10] overflow-hidden"
                    }
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                    {/* Mode Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#74271E] text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                        {course.mode}
                      </span>
                    </div>

                    {/* Level Badge */}
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-[#74271E]/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div
                    className={`p-6 flex flex-col flex-grow bg-[#FDFCF7]/50 group-hover:bg-white transition-colors ${
                      view === "list" ? "sm:w-2/3" : ""
                    }`}
                  >
                    {/* Category */}
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-3.5 h-3.5 text-[#B38B3F]" />
                      <span className="text-[11px] font-bold text-[#8B6D31] uppercase tracking-wide">
                        {course.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#2D2417] leading-snug mb-3 group-hover:text-[#74271E] transition-colors">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-stone-600 leading-relaxed mb-4 line-clamp-3">
                      {course.description ||
                        `Deep study into ${course.category}. A ${course.duration} immersive journey for ${course.level} seekers guided by ${course.instructor}.`}
                    </p>

                    {/* Instructor (Optional - can be shown if needed) */}
                    {/* <div className="flex items-center gap-2 mb-4 text-xs text-stone-500">
                      <span className="font-medium">Instructor:</span>
                      <span>{course.instructor}</span>
                    </div> */}

                    {/* Course Details */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between py-4 border-y border-[#E2D4A6]/30 mb-5">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#B38B3F]" />
                          <span className="text-xs font-bold text-[#4A4135]">
                            {course.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BarChart3 className="w-4 h-4 text-[#B38B3F]" />
                          <span className="text-xs font-bold text-[#4A4135]">
                            {course.level}
                          </span>
                        </div>
                      </div>

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#74271E] tabular-nums tracking-tight">
                          {course.priceFormatted || "₹0"}
                        </span>
                        <button
                          onClick={() => {
                            navigate(`/coursedetail/${course.id}`, {
                              state: { course: course },
                            });
                          }}
                          className="flex items-center  gap-2 px-3 py-2 bg-[#c9a84e] text-white text-[10px] font-bold uppercase tracking-wider rounded-md transition-all duration-300 hover:bg-[#b38b3f] shadow-sm active:scale-95 group/link"
                        >
                          Learn More
                          <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center justify-center bg-white border border-[#E2D4A6] rounded-2xl text-center">
              <div className="w-16 h-16 bg-[#FDFCF7] rounded-full flex items-center justify-center mb-6 border border-[#E2D4A6]">
                <Search className="w-6 h-6 text-stone-300" />
              </div>
              <h3 className="text-2xl font-bold text-[#2D2417] mb-2">
                No Shastras Found
              </h3>
              <p className="text-stone-500 italic mb-3">
                Try adjusting your filters to find what you seek.
              </p>
              {courses.length === 0 ? (
                <p className="text-sm text-stone-400 mb-6">
                  There are no active courses available on the server right now.
                </p>
              ) : (
                <p className="text-sm text-stone-400 mb-6">
                  {`Fetched ${courses.length} courses; none match the current filters.`}
                </p>
              )}
              <button
                onClick={resetFilters}
                className="px-8 py-3 bg-[#74271E] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {sortedCourses.length > itemsPerPage && (
            /* --- REFINED PAGINATION --- */
            <div className="flex justify-center items-center gap-3 mt-16">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-3 rounded-xl border border-[#E2D4A6] text-[#8B6D31] hover:bg-white transition-all disabled:opacity-30"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`w-11 h-11 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                    n === safePage
                      ? "bg-[#74271E] text-white shadow-xl shadow-[#74271E]/20"
                      : "text-[#8B6D31] bg-white border border-[#E2D4A6] hover:border-[#B38B3F]"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={safePage === totalPages}
                className="p-3 rounded-xl border border-[#E2D4A6] text-[#8B6D31] hover:bg-white transition-all disabled:opacity-30"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </main>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[88%] max-w-sm bg-[#FBF4E2] border-r border-[#E2D4A6] shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#74271E]" />
                <h3 className="text-lg font-bold text-[#2D2417]">Filters</h3>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-lg border border-[#E2D4A6] bg-white"
                aria-label="Close filters"
              >
                <X className="w-4 h-4 text-[#74271E]" />
              </button>
            </div>

            <div className="space-y-10">
              {[
                {
                  title: "Mode of Study",
                  state: modeFilter,
                  setter: setModeFilter,
                  options: [
                    { label: "Online Live", val: "ONLINE" },
                    { label: "Physical Class", val: "OFFLINE" },
                  ],
                },
                {
                  title: "Duration",
                  state: durationFilter,
                  setter: setDurationFilter,
                  options: [
                    { label: "Short-term", val: "<3m" },
                    { label: "6 Months", val: "6m" },
                    { label: "1 Year+", val: "1y+" },
                  ],
                },
                {
                  title: "Difficulty Level",
                  state: levelFilter,
                  setter: setLevelFilter,
                  options: [
                    {
                      label: "Prathama (Beginner)",
                      val: "Prathama (Beginner)",
                    },
                    {
                      label: "Madhyama (Intermediate)",
                      val: "Madhyama (Intermediate)",
                    },
                    { label: "Kovida (Advanced)", val: "Kovida (Advanced)" },
                  ],
                },
              ].map((group, i) => (
                <div key={i}>
                  <p className="text-[10px] font-black tracking-[0.15em] text-[#8B6D31] mb-5 uppercase opacity-70">
                    {group.title}
                  </p>
                  <div className="space-y-3">
                    {group.options.map((opt) => (
                      <label
                        key={opt.val}
                        className="flex items-center gap-3 group cursor-pointer"
                      >
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={group.state.includes(opt.val)}
                            onChange={() =>
                              handleToggleFilter(
                                group.state,
                                group.setter,
                                opt.val,
                              )
                            }
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

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => {
                  setMobileFiltersOpen(false);
                  setCurrentPage(1);
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-[#74271E] text-white text-sm font-bold"
              >
                Apply & Close
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-white border border-[#E2D4A6] text-sm font-bold"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AllCoursesPage;
