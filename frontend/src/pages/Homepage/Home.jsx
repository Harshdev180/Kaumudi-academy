import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Cards from "./Cards";
import Learning from "./Learning";
import About from "./About";
import Faculty from "./Faculty";
import Mission from "./Mission";
import Testimonials from "./Testimonials";
import heroImg from "../../assets/wheel.jpg";
import Typewriter from "./Typewriter";
import Stats from "./stats";

/* ------------------ Animations ------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const buttonHover = {
  scale: 1.05,
  transition: { type: "spring", stiffness: 300, damping: 20 },
};

const buttonTap = { scale: 0.94 };

export default function Home() {
  const [shlokCompleted, setShlokCompleted] = useState(false);

  const heroBackground = useMemo(
    () => ({
      backgroundImage: `
      linear-gradient(
        90deg,
        rgba(118,71,59,0.94) 0%,
        rgba(110,51,36,0.85) 45%,
        rgba(215,67,30,0.35) 100%
      ),
      url(${heroImg})
    `,
    }),
    [],
  );

  return (
    <main className="min-h-screen bg-[#f1e4c8] text-neutral-900">
      {/* ================= HERO ================= */}
      <section
        aria-label="Hero Section"
        id="hero"
        className="relative min-h-[90vh] md:min-h-screen w-full overflow-hidden flex items-center justify-center shadow-[0_40px_120px_-30px_rgba(0,0,0,0.5)] bg-cover bg-center"
        style={heroBackground}
      >
        {/* Soft overlay */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* CONTENT */}
        <div className="relative z-10 w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-44 flex flex-col items-center text-center pt-24 pb-16">
          {/* Sanskrit Verse */}
          <div className="min-h-[128px] sm:min-h-[160px] flex items-center justify-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-serif font-black leading-relaxed tracking-wide text-[#d6b15c] whitespace-pre-line">
              <Typewriter
                text={`असतो मा सद्गमय, तमसो मा ज्योतिर्गमय । 
मृत्योर्मा अमृतं गमय ॥`}
                speed={60}
                startDelay={400}
                onComplete={() => setShlokCompleted(true)}
              />
            </h1>
          </div>

          {/* Revealed Content */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={shlokCompleted ? "visible" : "hidden"}
            className="flex flex-col items-center w-full"
          >
            {/* Divider */}
            <div className="w-32 h-[3px] bg-[#d6b15c] mb-12 rounded-full" />

            <h2 className="text-3xl sm:text-4xl xl:text-6xl font-extrabold tracking-wide text-white">
              Rediscover the Power of{" "}
              <span className="text-[#d6b15c] font-serif italic">Sanskrit</span>
            </h2>

            <p className="mt-6 max-w-5xl text-sm sm:text-base md:text-xl leading-relaxed font-serif text-white/95">
              Immerse yourself in the profound heritage of classical Sanskrit
              through our curated traditional and modern learning programs.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 sm:mt-14 flex flex-wrap justify-center gap-6 sm:gap-8">
              <Link to="/allcourses" aria-label="Explore Courses">
                <motion.span
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-[#d6b15c] text-[#74271E] font-bold text-base sm:text-lg md:text-xl tracking-wide shadow-2xl hover:shadow-[0_25px_60px_rgba(0,0,0,0.45)] transition"
                >
                  Explore Courses
                </motion.span>
              </Link>

              <Link to="/contact" aria-label="Contact Academy">
                <motion.span
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-md text-white font-bold text-base sm:text-lg md:text-xl shadow-xl hover:bg-white/20 transition"
                >
                  Contact Academy
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= MAIN SECTIONS ================= */}
      <Stats />
      <Cards />
      <Learning />
      <About />
      <Faculty />
      <Mission />
      <Testimonials />
    </main>
  );
}
