import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Cards from "./Cards";
import Learning from "./Learning";
import About from "./About";
import Faculty from "./Faculty";
import Mission from "./Mission";
import Testimonials from "./Testimonials";
import heroImg from "../../assets/wheel.webp";
import Typewriter from "./Typewriter";
import SEO from "../../components/SEO";
import StatsCard from "./StatsCard";

/* ------------------ Animations ------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const buttonHover = {
  scale: 1.05,
  transition: { type: "spring", stiffness: 260, damping: 18 },
};

const buttonTap = { scale: 0.95 };

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
    <main className="bg-[#f1e4c8] text-neutral-900 overflow-x-hidden">
      <SEO
        title="Kaumudi Sanskrit Academy | Learn Sanskrit with Experts"
        description="Kaumudi Sanskrit Academy, a venture of Graphura India Private Limited, offers authentic Sanskrit learning in Paninian Grammar, Vedanta, and Kavya. Join our live online courses today."
        canonicalPath="/"
        og={{ type: "website" }}
        keywords={[
          "Kaumudi Sanskrit Academy",
          "Graphura India Private Limited",
          "Sanskrit learning platform",
          "Paninian Grammar",
          "Vedic studies online",
          "Sanskrit certifications India",
          "Ashtadhyayi courses",
          "Sanskrit for beginners",
          "Advanced Sanskrit grammar",
          "Sanskrit scholars academy",
          "Graphura India education",
        ]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Kaumudi Sanskrit Academy",
            url: typeof window !== "undefined" ? window.location.origin : "",
            logo: "/src/assets/logo-bgremove.webp",
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Kaumudi Sanskrit Academy",
            url: typeof window !== "undefined" ? window.location.origin : "",
            potentialAction: {
              "@type": "SearchAction",
              target:
                (typeof window !== "undefined" ? window.location.origin : "") +
                "/allcourses?search={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          },
        ]}
      />
      {/* ================= HERO ================= */}

      <section
        id="hero"
        aria-label="Hero Section"
        style={heroBackground}
        className="
          relative w-full
          min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen
          flex items-center justify-center
          bg-cover bg-center overflow-hidden
        "
      >
        <div className="absolute inset-0 bg-black/20" />

        {/* Container */}
        <div
          className="
          relative z-10
          w-full max-w-7xl
          px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20
          pt-24 sm:pt-28 lg:pt-32
          pb-16 sm:pb-20
          flex flex-col items-center text-center
        "
        >
          {/* Sanskrit Verse */}
          <div className="min-h-[110px] sm:min-h-[140px] md:min-h-[170px] flex items-center justify-center">
            <h1
              className="
              font-serif font-black
              text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl
              leading-relaxed tracking-wide
              text-[#d6b15c] whitespace-pre-line
            "
            >
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
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate={shlokCompleted ? "visible" : "hidden"}
            className="flex flex-col items-center w-full"
          >
            <div className="w-24 sm:w-32 h-[3px] bg-[#d6b15c] mb-8 sm:mb-12 rounded-full" />

            <motion.h2
              custom={0.3}
              variants={fadeUp}
              className="
                font-extrabold tracking-wide text-white
                text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
              "
            >
              Rediscover the Power of{" "}
              <span className="text-[#d6b15c] font-serif italic">Sanskrit</span>
            </motion.h2>

            <motion.p
              custom={0.4}
              variants={fadeUp}
              className="
                mt-5 sm:mt-6
                max-w-3xl lg:max-w-4xl
                font-serif text-white/95
                text-sm sm:text-base md:text-lg lg:text-xl
                leading-relaxed
              "
            >
              Immerse yourself in the profound heritage of classical Sanskrit
              through our curated traditional and modern learning programs.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              custom={0.5}
              variants={fadeUp}
              className="
                mt-10 sm:mt-14
                flex flex-col sm:flex-row
                items-center justify-center
                gap-5 sm:gap-8 w-full
              "
            >
              <Link to="/allcourses" className="w-full sm:w-auto">
                <motion.span
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  className="
                    w-full sm:w-auto
                    inline-flex items-center justify-center
                    px-7 sm:px-9 py-3 sm:py-4
                    rounded-full
                    bg-[#d6b15c] text-[#74271E]
                    font-bold
                    text-sm sm:text-base md:text-lg
                    shadow-xl transition
                  "
                >
                  Explore Courses
                </motion.span>
              </Link>

              <Link to="/contact" className="w-full sm:w-auto">
                <motion.span
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  className="
                    w-full sm:w-auto
                    inline-flex items-center justify-center
                    px-7 sm:px-9 py-3 sm:py-4
                    rounded-full
                    border border-white/30
                    bg-white/10 backdrop-blur-md
                    text-white font-bold
                    text-sm sm:text-base md:text-lg
                    shadow-lg transition
                  "
                >
                  Contact Academy
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= MAIN SECTIONS ================= */}

      <section className="space-y-12 sm:space-y-16 lg:space-y-20">
        <StatsCard />
        <Cards />
        <Learning />
        <About />
        <Faculty />
        <Mission />
        <Testimonials />
      </section>
    </main>
  );
}
