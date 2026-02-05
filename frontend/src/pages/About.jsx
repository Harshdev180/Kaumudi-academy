import { Hourglass, Users, BookOpen, CloudUpload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function About() {
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
    <>
      {/* ============ HERO SECTION ============ */}

      <section
        id="hero"
        className="py-16 flex items-center justify-center bg-[#f1e4c8] px-4 relative overflow-hidden min-h-screen"
      >
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
          <div className="absolute top-10 left-10 text-9xl text-[#7b2d1f] font-serif">
            ॐ
          </div>
          <div className="absolute bottom-10 right-10 text-9xl text-[#7b2d1f] font-serif">
            श्री
          </div>
        </div>
        <div className="max-w-4xl text-center space-y-3 relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#7b2d1f] text-lg uppercase tracking-[0.35em] font-bold block mb-3 py-6"
          >
            About Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl lg:text-5xl leading-[1.1] text-[#7b2d1f] skew-x-[-14deg]"
          >
            Stashed changes The Soul of Sanskrit <br />
            in the Heart of the Digital Age
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-[#7b2d1f]
          max-w-4xl mx-auto leading-relaxed sm:leading-loose font-serif py-10"
          >
            From the silent corridors of ancient Gurukuls to the vibrant screens
            of global learners, we bridge thousands of years with a single
            mission:
            <span className="font-medium"> Shastric Integrity</span>.
          </motion.p>
        </div>
      </section>

      {/* ============ OUR HERITAGE SECTION ============ */}

      <section className="w-full bg-[#7b2d1f] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white mb-6 font-bold">
                Our Heritage
              </h2>
              <div className="flex items-center gap-3 mb-8">
                <span className="h-[2px] w-12 bg-[#d6b25e]"></span>
                <span className="h-2 w-2 rounded-full bg-[#d6b25e]"></span>
                <span className="h-[2px] w-10 bg-[#d6b25e]"></span>
              </div>

              <p className="text-[#d6b25e] leading-relaxed mb-6">
                Rooted in the classical guru–śiṣya tradition yet responsive to
                contemporary scholarship, the Academy has carefully bridged
                ancient wisdom with modern pedagogical practices. Its curriculum
                is designed not merely to transmit linguistic knowledge, but to
                cultivate disciplined inquiry, clarity of thought, and reverence
                for textual authenticity.
              </p>

              <p className="text-[#d6b25e] leading-relaxed mb-6">
                Over the years, Kaumudi Academy has become a meeting ground for
                traditional scholars and modern researchers, fostering dialogue
                across generations. Through rigorous textual analysis, oral
                recitation, and interpretive study, students are guided toward a
                deeper engagement with Sanskrit as a living intellectual
                tradition rather than a relic of the past.
              </p>

              <p className="text-[#d6b25e] leading-relaxed mb-6">
                Today, the Academy’s digital initiatives extend this timeless
                heritage beyond geographical boundaries, enabling learners
                across the world to participate in structured study, guided
                mentorship, and scholarly exchange—ensuring that the voice of
                Sanskrit continues to resonate in the modern age.
              </p>

              <p className="italic text-[#d6b25e] mb-6">
                “We do not just teach a language; we awaken a heritage that has
                pulsed through the Indian subcontinent for millennia.”
              </p>

              <p className="text-white font-bold">
                — Acharya Ramakant Sharma, Founder
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              <div className="relative w-full h-[300px] sm:h-[380px] md:h-[500px] rounded-3xl overflow-hidden border-4 border-[#f1e4c8] shadow-2xl">
                <img
                  src="https://i.pinimg.com/736x/43/d5/9b/43d59b6ffea25e44cb1092a10e43a78b.jpg"
                  alt="Sanskrit Scholar"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#7b2d1f]/50 via-transparent to-transparent"></div>
                <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-[#d6b25e]/20 blur-xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* ============== STATS + MISSION / VISION SECTION ============== */}
      <section className="w-full py-32 bg-[#f1e4c8]">
        <div className="max-w-7xl mx-auto px-6">
          {/* ===== STATS CARDS ===== */}
          <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-4 pb-24">
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

          {/* ===== MISSION & VISION ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* OUR MISSION */}
            <div className="relative bg-[#fff9e9] border border-[#7b1f14] rounded-2xl p-10">
              <h3 className="font-serif text-2xl text-[#7b1f14] mb-4 flex items-center gap-3 font-bold">
                <span className="h-px w-10 bg-[#7b1f14]"></span>
                Our Mission
              </h3>

              <p className="text-base sm:text-lg lg:text-l text-[#6b4b3e] leading-relaxed">
                To democratize Sanskrit education without diluting its rigor. We
                aim to provide a structured, accessible path for any seeker to
                master the “Divine Language” through modern pedagogical tools
                and traditional guru-shishya intimacy.
              </p>

              <div className="absolute right-6 bottom-6 opacity-10 text-7xl">
                ◎
              </div>
            </div>

            {/* OUR VISION */}
            <div className="relative bg-[#fff9e9] border border-[#7b1f14] rounded-2xl p-10">
              <h3 className="font-serif text-2xl text-[#7b1f14] mb-4 flex items-center gap-3 font-bold">
                <span className="h-px w-10 bg-[#7b1f14] "></span>
                Our Vision
              </h3>

              <p className="text-base sm:text-lg lg:text-l text-[#6b4b3e] leading-relaxed">
                To see Sanskrit recognized once again as a living language of
                science, philosophy, and global dialogue, ensuring that the
                wisdom of the Vedas and Upanishads continues to illuminate
                modern humanity’s challenges.
              </p>

              <div className="absolute right-6 bottom-6 opacity-10 text-7xl">
                ◎
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ============================================================= */}
      {/* ================= GUIDING LIGHTS SECTION ================= */}
      {/* ================= GUIDING LIGHTS CARDS ================= */}
      <section className="w-full py-1 bg-[#f1e4c8]">
        <div className="max-w-7xl mx-auto px-6">
          {/* HEADING */}
          <div className="text-center mb-16">
            <h2 className="font-serif italic text-5xl text-[#7b2d1f] mb-4 font-bold">
              Guiding Lights of Kaumudi
            </h2>

            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-[2px] w-10 bg-[#d6b25e]"></span>
              <span className="h-2 w-2 rounded-full bg-[#d6b25e]"></span>
              <span className="h-[2px] w-10 bg-[#d6b25e]"></span>
            </div>

            <p className="text-[#6b4b3e] max-w-l mx-auto">
              Learn from the lineage of renowned Pandits and modern linguists.
            </p>
          </div>

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* CARD 1 */}
            <div className="bg-[#fff9e9] rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4">
                <img
                  src="https://i.pinimg.com/736x/6e/f3/a3/6ef3a3792fc89e992cfdace89b3b887e.jpg"
                  alt="Dr. Ananth Narayan"
                  className="w-full h-72 object-cover rounded-xl"
                />
              </div>

              <div className="px-8 pb-10">
                <h3 className="font-serif text-xl text-[#7b2d1f] mb-1 font-bold">
                  Dr. Ananth Narayan
                </h3>
                <p className="text-xs tracking-widest uppercase text-[#d6b25e] mb-4 font-bold">
                  Hod · Vyakarana Shastra
                </p>

                <p className="text-[#6b4b3e] leading-relaxed">
                  A PhD from BHU with 20 years of experience in Paninian
                  Grammar. Expert in the Mahabhashya tradition.
                </p>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="bg-[#fff9e9] rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4">
                <img
                  src="https://i.pinimg.com/736x/c2/38/f6/c238f6196864b554e23286e972946dc2.jpg"
                  alt="Acharya Meera Iyer"
                  className="w-full h-72 object-cover rounded-xl"
                />
              </div>

              <div className="px-8 pb-10">
                <h3 className="font-serif text-xl text-[#7b2d1f] mb-1 font-bold">
                  Acharya Meera Iyer
                </h3>
                <p className="text-xs tracking-widest uppercase text-[#d6b25e] mb-4 font-bold">
                  Dean · Vedic Studies
                </p>

                <p className="text-[#6b4b3e] leading-relaxed">
                  Specializes in Rigveda Bhashya and Advaita Vedanta. Renowned
                  for her simplified Sahitya workshops.
                </p>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="bg-[#fff9e9] rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4">
                <img
                  src="https://i.pinimg.com/736x/6e/44/7f/6e447f2168e966bc30049bebe00537dc.jpg"
                  alt="Pandit Rajiv Misra"
                  className="w-full h-72 object-cover rounded-xl"
                />
              </div>

              <div className="px-8 pb-10">
                <h3 className="font-serif text-xl text-[#7b2d1f] mb-1 font-bold">
                  Pandit Rajiv Misra
                </h3>
                <p className="text-xs tracking-widest uppercase text-[#d6b25e] mb-4 font-bold">
                  Senior Fellow · Manuscriptology
                </p>

                <p className="text-[#6b4b3e] leading-relaxed">
                  Leading the academy’s digital archival project. Expert in
                  Sarada and Devanagari script variations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ========================================================= */}
      {/* FAQ */}
      <section className="py-20 bg-[#f1e4c8]">
        <div className="max-w-[900px] mx-auto px-5">
          <h3 className="text-3xl md:text-4xl font-black text-[#74271E] text-center">
            Questions & Clarity
          </h3>

          <div className="mt-8 space-y-3">
            {[
              {
                q: "Are the courses beginner friendly?",
                a: "Yes. We offer a dedicated ‘Praveshika’ level crafted for absolute beginners, even for those with no prior familiarity with the Devanagari script or Sanskrit language.",
              },
              {
                q: "Do you provide certification?",
                a: "Yes. Learners receive academically recognized certificates upon successful completion, evaluated by our internal scholarly board.",
              },
              {
                q: "Can I learn at my own pace?",
                a: "Absolutely. We support both live guided cohorts and self-paced study tracks, complete with recorded sessions, curated readings, and practice materials.",
              },
              {
                q: "Are the teachings rooted in traditional Shastra?",
                a: "Yes. Our curriculum is firmly grounded in authentic Shastric traditions while being presented through modern pedagogy for clarity and accessibility.",
              },
              {
                q: "Will I receive guidance from experienced Pandits?",
                a: "Certainly. Our courses are led by seasoned Pandits and scholars trained in the traditional guru-shishya lineage, ensuring depth, discipline, and authenticity.",
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="group rounded-2xl bg-[#fff9e9] shadow-sm p-4 [&_summary]:cursor-pointer"
              >
                <summary className="flex items-center justify-between">
                  <span className="font-semibold text-[#74271E]">{item.q}</span>
                  <span className="text-[#74271E] group-open:hidden">+</span>
                  <span className="text-[#74271E] hidden group-open:inline">
                    −
                  </span>
                </summary>
                <p className="mt-2 text-[#7b5a4c] leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
