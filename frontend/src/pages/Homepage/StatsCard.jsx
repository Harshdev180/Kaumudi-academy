import React from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";

const StatsCard = () => {
  const SHLOKS = [
    "असतो मा सद्गमय — From falsehood to truth",
    "विद्या ददाति विनयं — Knowledge gives humility",
    "कर्मण्येवाधिकारस्ते — Do your duty without attachment",
    "सर्वे भवन्तु सुखिनः — May all beings be happy",
    "गुरुर्ब्रह्मा गुरुर्विष्णुः — Reverence to the Teacher",
    "उद्यमेन हि सिद्ध्यन्ति — Success comes through effort",
  ];

  const stats = [
    { value: 5000, label: "Students Enrolled" },
    { value: 50, label: "Courses" },
    { value: 20, label: "Acharyas" },
    { value: 10, label: "Countries" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-80px" }}
      className="bg-[#f1e4c8] overflow-hidden"
    >
      {/* Stats Grid */}
      <div
        className="
          max-w-7xl mx-auto
          px-4 sm:px-6 md:px-10
          py-12 sm:py-16
          grid
          grid-cols-2
          md:grid-cols-4
          gap-4 sm:gap-6 lg:gap-8
        "
      >
        {stats.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="
              rounded-2xl
              bg-[#74271E]
              shadow-lg
              px-4 sm:px-6
              py-6 sm:py-8
              text-center
              flex flex-col justify-center
            "
          >
            <div
              className="
                font-bold text-white
                text-xl sm:text-2xl md:text-3xl
              "
            >
              <CountUp
                end={item.value}
                duration={2}
                enableScrollSpy
                scrollSpyDelay={200}
              />
              +
            </div>

            <div
              className="
                uppercase tracking-wide
                text-white
                text-[10px] sm:text-xs md:text-sm
                mt-2 font-bold
              "
            >
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sanskrit Marquee */}
      <div
        className="
          h-14 sm:h-16 md:h-20
          overflow-hidden
          bg-[#74271E]
          flex items-center
          border-y border-[#927341]
        "
      >
        <motion.div
          className="
            inline-flex
            gap-12 sm:gap-16 md:gap-20
            whitespace-nowrap
            font-serif italic
            text-white
            text-sm sm:text-base md:text-lg
            pr-20
          "
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 55,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...SHLOKS, ...SHLOKS].map((text, i) => (
            <span key={i} className="flex items-center gap-4 opacity-90">
              <span className="tracking-wide">{text}</span>
              <Sparkle className="text-[#d6b15c] w-4 h-4 sm:w-5 sm:h-5" />
            </span>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default StatsCard;
