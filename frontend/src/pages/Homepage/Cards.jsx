import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCourses } from "../../lib/api";

export default function Cards() {
  const [index, setIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getAllCourses();
        setCourses(res?.data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 640) return 1; // < sm
      if (w < 1024) return 2; // sm..lg
      return 3; // >= lg
    };
    const apply = () => {
      const n = calc();
      setItemsPerSlide((prev) => {
        if (prev !== n) {
          // clamp index to new bounds
          const maxStart = Math.max(0, courses.length - n);
          if (index > maxStart) setIndex(maxStart);
        }
        return n;
      });
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [index]);

  const visible = courses.slice(index, index + itemsPerSlide);

  const next = () => {
    if (index < courses.length - itemsPerSlide) {
      setIndex((i) => i + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
    }
  };

  const fadeLeft = {
    hidden: { opacity: 0, x: -40 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const staggerContainer = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const cardAnim = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="py-16 bg-[#f1e4c8] overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-6">
        {/* HEADER */}
        <div className="flex items-end justify-between mb-12 relative">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-3xl md:text-4xl font-black text-[#74271E] font-serif tracking-wide">
              Explore Our Courses
            </h2>
            <div className="w-16 h-[3px] bg-[#d6b15c] rounded-full mt-3" />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden md:block absolute -top-30 -left-10 text-[140px] font-black uppercase tracking-widest text-[#74271E]/10 select-none pointer-events-none z-0"
          >
            Courses
          </motion.span>

          {/* ARROWS */}
          <div className="flex gap-3 relative z-10">
            {/* LEFT */}
            <motion.button
              onClick={prev}
              disabled={index === 0}
              whileHover={{ scale: index === 0 ? 1 : 1.08 }}
              whileTap={{ scale: 0.9 }}
              className={`h-11 w-11 rounded-full flex items-center justify-center
              border transition-colors duration-200
              ${
                index === 0
                  ? "border-[#74271E]/20 text-[#74271E]/40 cursor-not-allowed"
                  : "border-[#74271E]/40 text-[#74271E] hover:bg-[#74271E] hover:text-white"
              }`}
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </motion.button>

            {/* RIGHT */}
            <motion.button
              onClick={next}
              disabled={index >= courses.length - itemsPerSlide}
              whileHover={{
                scale: index >= courses.length - itemsPerSlide ? 1 : 1.08,
              }}
              whileTap={{ scale: 0.9 }}
              className={`h-11 w-11 rounded-full flex items-center justify-center
              border transition-colors duration-200
              ${
                index >= courses.length - itemsPerSlide
                  ? "border-[#74271E]/20 text-[#74271E]/40 cursor-not-allowed"
                  : "border-[#74271E]/40 text-[#74271E] hover:bg-[#74271E] hover:text-white"
              }`}
            >
              <ArrowRight size={18} strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>

        {/* CARDS */}
        <motion.div
          key={index} // Force re-render animation on slide change
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {visible.map((course) => (
            <motion.div
              key={course._id}
              variants={cardAnim}
              whileHover={{
                y: -12,
                scale: 1.02,
                transition: { duration: 0.4, ease: "easeOut" },
              }}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#74271E]/10"
            >
              {/* Image */}
              <Link
                to={`/coursedetail/${course._id}`}
                className="block h-56 overflow-hidden"
              >
                <motion.img
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  src={course.image?.url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </Link>

              {/* Content */}
              <div className="p-7 bg-white">
                <div className="text-xs font-bold text-[#d6b15c] uppercase tracking-wider mb-2">
                  Featured Course
                </div>

                <h3 className="text-xl font-bold text-[#74271E] font-serif mb-3">
                  {course.title}
                </h3>

                <p className="text-[#7b5a4c] leading-relaxed text-sm mb-6 line-clamp-3">
                  {course.description}
                </p>

                <Link
                  to={`/coursedetail/${course._id}`}
                  className="inline-flex items-center bg-[#74271E] p-3 rounded-3xl text-white font-bold text-sm hover:gap-2 transition-all"
                >
                  View Details
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="flex justify-center mt-10"
          whileHover={{ y: -4, scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
        >
          <Link
            to="/allcourses"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#74271E] px-8 py-4 font-bold text-white shadow-lg transition hover:bg-[#5e1f18] focus:outline-none focus:ring-2 focus:ring-[#d6b15c]"
          >
            <span>View All Courses</span>
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
