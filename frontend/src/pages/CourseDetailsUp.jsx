import React, { useState, useRef, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Download,
  FileText,
  Clock,
  BookOpen,
  Globe,
  Award,
  Users,
  ChevronRight,
  Star,
  Play,
  Calendar,
  TrendingUp,
  Shield,
  Sparkles,
  BookMarked,
  GraduationCap,
  Layers,
  Target,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  ThumbsUp,
} from "lucide-react";

// Import components
import SidebarCard from "../component/CourseDetailsUpdated/SidebarCard";
import InstructorSection from "../component/CourseDetailsUpdated/InstructorSection";
import CurriculumAccordion from "../component/CourseDetailsUpdated/CurriculumAccordion";
import ScheduleTable from "../component/CourseDetailsUpdated/ScheduleTable";
import Suggetion from "../component/CourseDetailsUpdated/suggetion";
import { getCourseDetail } from "../lib/api";
import SEO from "../components/SEO";

// ==================== HERO SECTION ====================
const HeroSection = ({ data }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  const {
    title = "Sanskrit Course",
    level = "All Levels",
    duration = "",
    language = "",
    description = "Explore this comprehensive Sanskrit course guided by experienced scholars.",
    category = "",
    mode = "ONLINE",
    startDate = "",
    endDate = "",
    studentsEnrolled = "1,234",
    rating = "4.8",
    totalReviews = "128",
    instructor = {},
    image = "",
  } = data || {};

  const languageDisplay = Array.isArray(language)
    ? language.join(", ")
    : language || "";

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return null;
    }
  };

  const startDateFormatted = formatDate(startDate);
  const endDateFormatted = formatDate(endDate);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.section className="relative overflow-hidden">
      {/* Animated Background Pattern */}
      {/* <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMCA0MCAyMCAyMCAwIDAgMSAwLTQweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzlhODRlIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-[#c9a84e]/5 to-transparent rounded-full blur-3xl"
        />
      </div> */}

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-32 h-32 bg-[#74271E]/5 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Breadcrumb with Glass Effect */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm mb-8 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full w-fit border border-white/10"
        >
          {[
            { label: "Home", path: "/" },
            { label: "Courses", path: "/allcourses" },
            { label: title, path: "#" },
          ].map((item, index, array) => (
            <React.Fragment key={item.label}>
              {index > 0 && (
                <ChevronRight size={14} className="text-[#74271E]/40" />
              )}
              {index === array.length - 1 ? (
                <span className="text-[#74271E] font-medium truncate max-w-[150px] sm:max-w-[200px]">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.path}
                  className="text-[#74271E]/70 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              )}
            </React.Fragment>
          ))}
        </motion.nav>

        {/* Main Content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 lg:gap-16"
        >
          {/* Left Column */}
          <div className="space-y-6">
            {/* Academy Badge with Animation */}
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <motion.div
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-[2px] w-12 bg-gradient-to-r from-[#74271E] to-transparent"
              />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#74271E]">
                Kaumudi Sanskrit Academy
              </span>
            </motion.div>

            {/* Title with Gradient */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold"
            >
              <span className="text-[#74271E]">{title}</span>
            </motion.h1>

            {/* Rating & Stats */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-6"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= Math.floor(parseFloat(rating))
                          ? "text-[#c9a84e] fill-[#c9a84e]"
                          : "text-white/30"
                      }
                    />
                  ))}
                </div>
                <span className="text-[#74271E] text-sm font-medium">
                  {rating} ({totalReviews} reviews)
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#74271E]/70">
                <Eye size={16} />
                <span className="text-sm">1.2k watching</span>
              </div>

              <div className="flex items-center gap-2 text-[#74271E]/70">
                <ThumbsUp size={16} />
                <span className="text-sm">98% positive</span>
              </div>
            </motion.div>

            {/* Instructor Card */}
            {/* {instructor?.name && (
              <motion.div
                variants={scaleIn}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 w-fit"
              >
                <div className="relative">
                  {instructor.image ? (
                    <img
                      src={instructor.image}
                      alt={instructor.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#74271E]"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#74271E] to-[#b8943a] flex items-center justify-center">
                      <Award size={24} className="text-[#631D11]" />
                    </div>
                  )}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                  />
                </div> */}
            {/* <div>
                  <span className="text-white/60 text-xs uppercase tracking-wider">
                    Instructor
                  </span>
                  <p className="text-white font-semibold">
                    {instructor.name}
                    {instructor.qualification && (
                      <span className="block text-xs text-white/50 font-normal">
                        {instructor.qualification}
                      </span>
                    )}
                  </p>
                </div>
              </motion.div>
            )} */}

            {/* Tags with Hover Effects */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              {[
                {
                  icon: BookOpen,
                  label: level,
                  color: "from-blue-500/20 to-blue-600/20",
                },
                {
                  icon: Clock,
                  label: duration,
                  color: "from-green-500/20 to-green-600/20",
                },
                {
                  icon: Globe,
                  label: languageDisplay,
                  color: "from-purple-500/20 to-purple-600/20",
                },
                {
                  icon: GraduationCap,
                  label: mode,
                  color: "from-orange-500/20 to-orange-600/20",
                },
              ].map(
                (item, index) =>
                  item.label && (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={`group relative overflow-hidden backdrop-blur-sm px-4 py-2 rounded-full border border-white/10`}
                    >
                      <div className="absolute inset-0 bg-[#74271E]/10 group-hover:bg-white/10 transition-colors duration-300" />
                      <div className="relative flex items-center gap-2">
                        <item.icon size={16} className="text-[#74271E]" />
                        <span className="text-[#74271E] text-sm font-medium">
                          {item.label}
                        </span>
                      </div>
                    </motion.div>
                  ),
              )}
            </motion.div>

            {/* Schedule Info */}
            {(startDateFormatted || category) && (
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-6 text-sm"
              >
                {category && (
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-[#74271E]" />
                    <span className="text-[#74271E]/70">Category:</span>
                    <span className="text-[#74271E] font-medium">
                      {category}
                    </span>
                  </div>
                )}
                {startDateFormatted && endDateFormatted && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#74271E]" />
                    <span className="text-[#74271E]/70">Next Batch:</span>
                    <span className="text-[#74271E] font-medium">
                      {startDateFormatted} — {endDateFormatted}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Description with Typing Effect */}
            <motion.div variants={fadeUp} className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#74271E] to-transparent" />
              <p className="text-[#74271E] pl-4">{description}</p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <motion.a
                href="#syllabus"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden bg-[#74271E] text-white px-8 py-4 rounded-xl font-semibold shadow-2xl"
              >
                <motion.div
                  animate={{ x: ["0%", "200%"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />
                <span className="relative flex items-center gap-2">
                  Get Started Now
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </motion.a>

              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Play size={18} fill="white" />
                Watch Preview
              </motion.button> */}

              {/* Social Actions */}
              {/* <div className="flex items-center gap-2 ml-auto">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
                >
                  <Heart size={18} className="text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
                >
                  <Bookmark size={18} className="text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
                >
                  <Share2 size={18} className="text-white" />
                </motion.button>
              </div> */}
            </motion.div>
          </div>

          {/* Right Column - Stats & Preview Card */}
          <motion.div variants={fadeUp} className="space-y-6">
            {/* Stats Grid - Responsive Sizes */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              {" "}
              {/* Responsive gaps */}
              {[
                {
                  icon: Users,
                  label: "Students",
                  value: studentsEnrolled,
                  color: "from-blue-500 to-blue-600",
                },
                {
                  icon: Layers,
                  label: "Level",
                  value: level,
                  color: "from-green-500 to-green-600",
                },
                {
                  icon: BookMarked,
                  label: "Lessons",
                  value: "48",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  icon: TrendingUp,
                  label: "Success Rate",
                  value: "94%",
                  color: "from-orange-500 to-orange-600",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -5 }}
                  className="bg-white backdrop-blur-sm rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 border border-[#74271E]/10"
                >
                  <div
                    className={`w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-lg md:rounded-xl lg:rounded-2xl bg-[#74271E] flex items-center justify-center mb-2 md:mb-3 lg:mb-4`}
                  >
                    <stat.icon size={16} className="text-white md:hidden" />{" "}
                    {/* Mobile size */}
                    <stat.icon
                      size={20}
                      className="text-white hidden md:block lg:hidden"
                    />{" "}
                    {/* Tablet size */}
                    <stat.icon
                      size={28}
                      className="text-white hidden lg:block"
                    />{" "}
                    {/* Desktop size */}
                  </div>
                  <p className="text-[#74271E]/60 text-xs md:text-sm lg:text-base mb-1">
                    {stat.label}
                  </p>
                  <p className="text-[#74271E] font-bold text-lg md:text-xl lg:text-2xl">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Course Preview Card */}
          {/* <motion.div
              whileHover={{ y: -5 }}
              className="relative group overflow-hidden bg-white backdrop-blur-sm rounded-3xl p-6 border border-[#74271E]/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84e]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <h3 className="text-[#74271E] font-semibold mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-[#74271E]" />
                  Course Highlights
                </h3>

                <div className="space-y-4 mb-6">
                  {[
                    "Live interactive sessions",
                    "Downloadable study materials",
                    "Certificate of completion",
                    "24/7 doubt clearing support",
                    "Access on mobile & TV",
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#74271E]/20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#74271E]" />
                      </div>
                      <span className="text-[#74271E] text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div> */}

          {/* Progress Bar */}
          {/* <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#74271E]">Course Progress</span>
                    <span className="text-[#74271E] font-medium">68%</span>
                  </div>
                  <div className="h-2 bg-[#74271E]/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "68%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-[#c9a84e] to-[#74271E] rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div> */}

          {/* Trust Badges */}
          {/* <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              {[
                { icon: Shield, label: "30-Day Refund" },
                { icon: Award, label: "Certificate" },
                { icon: Heart, label: "Lifetime Access" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <item.icon size={16} className="text-[#c9a84e]" />
                  <span className="text-white/70 text-xs">{item.label}</span>
                </div>
              ))}
            </div> */}
        </motion.div>
      </div>
    </motion.section>
  );
};

// ==================== MAIN COURSE DETAILS COMPONENT ====================
const CourseDetails = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Default Data
  const defaultCourse = {
    id: "panini-01",
    title: "Advanced Paninian Grammar: Mahabhashya Study",
    level: "Advanced Certification",
    description:
      "A comprehensive deep-dive into the foundational texts of Sanskrit linguistic philosophy under expert guidance. This course combines traditional teaching methods with modern pedagogical approaches.",
    price: "14,999",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop",
    instructor: {
      name: "Acharya Dr. Vasudev Shastry",
      qualification: "PhD in Vyakarana, BHU",
      bio: "With over 25 years of teaching experience, Acharya Vasudev has guided thousands of students through the complexities of Sanskrit Grammar.",
      tags: ["25+ Yrs Exp", "100+ Publications", "Veda Ratna Awardee"],
      image:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop",
    },
    curriculum: [
      { title: "Introduction to Panini", lessons: 5, duration: "2h 30m" },
      { title: "Sutra Analysis", lessons: 8, duration: "4h 15m" },
    ],
    schedule: [
      { date: "Mon, Jan 15", topic: "Introduction", duration: "2h" },
      { date: "Wed, Jan 17", topic: "Basic Concepts", duration: "2h" },
    ],
  };

  const [courseData, setCourseData] = useState(null);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      const incomingData = location.state?.course;

      if (incomingData) {
        const merged = {
          ...defaultCourse,
          _id: incomingData.id || incomingData._id,
          id: incomingData.id || incomingData._id,
          title: incomingData.title,
          price: incomingData.price,
          level: incomingData.level,
          duration: incomingData.duration,
          language: incomingData.language,
          instructor: {
            name:
              incomingData.instructorName ||
              incomingData.instructor?.name ||
              defaultCourse.instructor.name,
            qualification:
              incomingData.instructorQualification ||
              incomingData.instructor?.qualification ||
              defaultCourse.instructor.qualification,
            bio:
              incomingData.instructorBio ||
              incomingData.instructor?.bio ||
              defaultCourse.instructor.bio,
            tags:
              incomingData.instructorTags ||
              incomingData.instructor?.tags ||
              defaultCourse.instructor.tags,
            image:
              incomingData.instructorImage ||
              incomingData.instructor?.image ||
              defaultCourse.instructor.image,
          },
          curriculum: incomingData.curriculum || defaultCourse.curriculum,
          schedule: incomingData.schedule || defaultCourse.schedule,
          image: incomingData.image || defaultCourse.image,
          description: incomingData.description || defaultCourse.description,
        };
        setCourseData(merged);
      } else if (id) {
        try {
          setLoading(true);
          setError("");
          const response = await getCourseDetail(id);
          const apiCourse = response?.data?.data || response?.data || response;

          const merged = {
            ...defaultCourse,
            _id: apiCourse._id || apiCourse.id,
            id: apiCourse._id || apiCourse.id,
            title: apiCourse.title || defaultCourse.title,
            price: apiCourse.price || defaultCourse.price,
            level: apiCourse.level || defaultCourse.level,
            duration: apiCourse.duration || "8 weeks",
            language: Array.isArray(apiCourse.language)
              ? apiCourse.language
              : [apiCourse.language || "Sanskrit"],
            image:
              apiCourse.image?.url || apiCourse.image || defaultCourse.image,
            description: apiCourse.description || defaultCourse.description,
            category: apiCourse.category || "Grammar",
            mode: apiCourse.mode || "ONLINE",
            startDate: apiCourse.startDate || "2024-02-01",
            endDate: apiCourse.endDate || "2024-03-25",
            instructor: {
              name: apiCourse.instructor || defaultCourse.instructor.name,
              qualification: defaultCourse.instructor.qualification,
              bio: defaultCourse.instructor.bio,
              tags: defaultCourse.instructor.tags,
              image: defaultCourse.instructor.image,
            },
            curriculum: defaultCourse.curriculum,
            schedule: defaultCourse.schedule,
          };
          setCourseData(merged);
        } catch (err) {
          console.error("Failed to fetch course:", err);
          setError("Failed to load course details. Using default data.");
          setCourseData(defaultCourse);
        } finally {
          setLoading(false);
        }
      } else {
        setCourseData(defaultCourse);
      }
    };

    fetchCourse();
  }, [id, location.state]);

  useEffect(() => {
    if (courseData) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsPlaying(false);
    }
  }, [courseData?.title]);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDownloadBrochure = async () => {
    try {
      setDownloading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const url =
        courseData?.brochure?.url ||
        courseData?.brochure ||
        courseData?.image ||
        "";
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f1e4c8] min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#74271E] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error && !courseData) {
    return (
      <div className="bg-[#f1e4c8] min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 text-center max-w-md shadow-2xl"
        >
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl font-bold">!</span>
          </div>
          <h3 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Course
          </h3>
          <p className="text-stone-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/courses")}
            className="px-8 py-3 bg-[#74271E] text-white rounded-xl font-bold hover:bg-[#5a1f15] transition-colors"
          >
            Back to Courses
          </button>
        </motion.div>
      </div>
    );
  }

  if (!courseData) return null;

  return (
    <div className="bg-[#f1e4c8] min-h-screen">
      <SEO
        title={`${courseData.title} | Kaumudi Sanskrit Academy`}
        description={courseData.description?.slice(0, 160)}
        canonicalPath={`/coursedetail/${id || courseData.id || courseData._id || ""}`}
        og={{ type: "article", image: courseData.image }}
      />

      <HeroSection data={courseData} />

      {/* Sticky Tab Navigation */}
      {/* <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#74271E]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
            {[
              { id: "overview", label: "Overview", icon: BookOpen },
              { id: "curriculum", label: "Curriculum", icon: Layers },
              { id: "instructor", label: "Instructor", icon: GraduationCap },
              { id: "schedule", label: "Schedule", icon: Calendar },
              { id: "reviews", label: "Reviews", icon: MessageCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  document
                    .getElementById(tab.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#74271E] text-[#74271E]"
                    : "border-transparent text-[#74271E]/60 hover:text-[#74271E]"
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Course Demo Section */}
            <section id="overview">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-[#c9a84e] to-[#b8943a] rounded-full" />
                  <h2 className="text-2xl md:text-3xl font-bold text-[#74271E]">
                    Course Preview
                  </h2>
                </div>

                <div className="relative group aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    poster={courseData.image}
                    onPause={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                    controls={isPlaying}
                  >
                    <source
                      src="https://www.w3schools.com/html/mov_bbb.mp4"
                      type="video/mp4"
                    />
                  </video>

                  {!isPlaying && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={handlePlayVideo}
                      className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-t from-black/50 via-transparent to-transparent cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-20 h-20 bg-[#74271E] rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl"
                      >
                        <Play size={30} fill="white" className="ml-1" />
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </section>

            {/* Syllabus Download Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white to-[#f1e4c8]/30 rounded-3xl p-8 border border-[#74271E]/10 shadow-xl"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#74271E] rounded-2xl blur-lg opacity-30" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-[#74271E] to-[#8B3A2A] rounded-2xl flex items-center justify-center">
                      <FileText size={32} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl md:text-2xl text-[#74271E] mb-1">
                      Course Syllabus
                    </h3>
                    <p className="text-[#74271E]/70">
                      Complete curriculum breakdown for {courseData.level} level
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadBrochure}
                  disabled={downloading}
                  className={`group relative flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    downloading
                      ? "bg-[#A88C64] text-white cursor-not-allowed"
                      : "bg-[#74271E] text-white hover:bg-[#c9a84e] hover:text-[#74271E] shadow-xl"
                  }`}
                >
                  {downloading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Preparing...</span>
                    </>
                  ) : (
                    <>
                      <Download
                        size={20}
                        className="group-hover:-translate-y-1 transition-transform"
                      />
                      <span>Download Syllabus</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Content Sections with IDs for Navigation */}
            <div id="curriculum">
              <CurriculumAccordion curriculumData={courseData.curriculum} />
            </div>

            <div id="instructor">
              <InstructorSection instructor={courseData.instructor} />
            </div>

            <div id="schedule">
              <ScheduleTable scheduleData={courseData.schedule} />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <SidebarCard price={courseData.price} courseData={courseData} />

              {/* Live Chat Support */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-[#74271E] to-[#8B3A2A] rounded-3xl p-6 text-white shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <h4 className="font-semibold">Need Help?</h4>
                </div>
                <p className="text-white/80 text-sm mb-4">
                  Our support team is available 24/7 to assist you
                </p>
                <button className="w-full bg-white text-[#74271E] py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors">
                  Start Live Chat
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="mt-16">
          <Suggetion />
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
