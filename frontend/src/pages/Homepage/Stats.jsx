import React from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";

const Stats = () => {
  const SHLOKS = [
    "असतो मा सद्गमय — From falsehood to truth",
    "विद्या ददाति विनयं — Knowledge gives humility",
    "कर्मण्येवाधिकारस्ते — Do your duty without attachment",
    "सर्वे भवन्तु सुखिनः — May all beings be happy",
    "गुरुर्ब्रह्मा गुरुर्विष्णुः — Reverence to the Teacher",
    "उद्यमेन हि सिद्ध्यन्ति — Success comes through effort",
  ];

  const stats = [
    {
      value: 5000,
      label: "Students Enrolled",
    },
    {
      value: 50,
      label: "Courses",
    },
    {
      value: 20,
      label: "Acharyas",
    },
    {
      value: 10,
      label: "Countries",
    },
  ];
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-[#f1e4c8] py-10"
    >
      <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-4 pt-16">
        {stats.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3 }}
            className="rounded-2xl bg-[#74271E] shadow-md px-6 py-6 text-center"
          >
            <div className="text-2xl md:text-3xl font-bold text-white">
              <CountUp
                end={item.value}
                duration={2}
                enableScrollSpy
                scrollSpyDelay={200}
              />
              +
            </div>

            <div className="uppercase tracking-wide text-white text-xs mt-1 font-bold">
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="h-16 overflow-hidden bg-[#74271E] flex items-center border-y border-[#927341] mt-24">
        <motion.div
          className="inline-flex gap-20 whitespace-nowrap font-semibold italic text-white font-serif text-lg pr-20"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...SHLOKS, ...SHLOKS].map((text, i) => (
            <span key={i} className="flex items-center gap-6 opacity-90">
              <span className="tracking-wide">{text}</span>
              <span className="text-[#d6b15c] text-xl">
                <Sparkle />
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Stats;
