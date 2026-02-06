import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const courses = [
  {
    title: "Shlok",
    desc: "Train the mind in classical systems of reasoning and debate.",
    img: "https://thumbs.dreamstime.com/b/antique-literature-collection-old-fashioned-wisdom-preserved-generative-ai-antique-literature-collection-old-fashioned-wisdom-274867858.jpg",
  },
  {
    title: "Spoken Sanskrit (Level-1)",
    desc: "Journey through poetic masterpieces of Kalidasa and other sages.",
    img: "https://tse2.mm.bing.net/th/id/OIP.aO6k2XyBjXEcWju-JEOo_QHaE7?pid=Api&P=0&h=180",
  },
  {
    title: "Vyakarana Shastra",
    desc: "Build fluency through immersive conversational practice.",
    img: "https://i.pinimg.com/736x/6a/3a/3c/6a3a3c4378419743ff09e29c6d4796bc.jpg",
  },
  {
    title: "UGC NET",
    desc: "Explore metaphysics through Upanishadic and Brahma Sutra texts.",
    img: "https://i.pinimg.com/736x/19/6c/f4/196cf4706012f8407a08c0cf7db51339.jpg",
  },
  {
    title: "BA",
    desc: "Journey through poetic masterpieces of Kalidasa and other sages.",
    img: "https://i.pinimg.com/736x/63/74/4f/63744f0c869b1b9b3095eccdb91daa1d.jpg",
  },
];

export default function Cards() {
  const [index, setIndex] = useState(0);

  const visible = courses.slice(index, index + 3);

  const next = () => {
    if (index < courses.length - 3) {
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
    <section className="py-24 bg-[#f1e4c8] overflow-hidden">
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
            className="absolute -top-30 -left-10 text-[140px] font-black uppercase tracking-widest text-[#74271E]/10 select-none pointer-events-none z-0"
          >
            Courses
          </motion.span>

          {/* ARROWS */}
          <div className="flex gap-3 relative z-10">
            {/* LEFT */}
            <motion.button
              onClick={prev}
              disabled={index === 0}
              whileHover={{ scale: index === 0 ? 1 : 1.1 }}
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
              disabled={index >= courses.length - 3}
              whileHover={{ scale: index >= courses.length - 3 ? 1 : 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`h-11 w-11 rounded-full flex items-center justify-center
              border transition-colors duration-200
              ${
                index >= courses.length - 3
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
          {visible.map((course, i) => (
            <motion.div
              key={course.title}
              variants={cardAnim}
              whileHover={{
                y: -12,
                scale: 1.02,
                transition: { duration: 0.4, ease: "easeOut" },
              }}
              className="group relative bg-[white] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#74271E]/10"
            >
              {/* Image */}
              <div className="h-56 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  src={course.img}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-7 relative z-10 bg-white">
                <div className="text-xs font-bold text-[#d6b15c] uppercase tracking-wider mb-2">
                  Featured Course
                </div>
                <h3 className="text-xl font-bold text-[#74271E] font-serif mb-3">
                  {course.title}
                </h3>
                <p className="text-[#7b5a4c] leading-relaxed text-sm mb-6">
                  {course.desc}
                </p>

                <a
                  href="/coursedetail"
                  className="inline-flex items-center bg-[#74271E] p-3 rounded-3xl text-white font-bold text-sm hover:gap-2 transition-all"
                >
                  View Details <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <Link to="/allcourses">
            <motion.a
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="group mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-[#74271E] px-8 py-4 font-bold text-white shadow-lg transition hover:bg-[#5e1f18] focus:outline-none focus:ring-2 focus:ring-[#d6b15c]"
            >
              <span>View All Courses</span>
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </motion.a>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
