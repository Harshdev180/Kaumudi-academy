export default function Home() {
  return (
    <>
      {/* ============ HERO SECTION ============ */}
      <section className="min-h-screen flex items-center justify-center bg-[#f1e4c8] px-4">
        <div className="max-w-4xl text-center space-y-6">
          <p className="text-sm tracking-widest text-[#c9a24d] uppercase font-bold">
            Vidyā Dadāti Vinayam
          </p>

          <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl leading-[1.15] text-[#6b1f16] skew-x-[-14deg]">
            The Soul of Sanskrit <br />
            in the Heart of the Digital Age
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 max-w-1xl mx-auto leading-loose">
            From the silent corridors of ancient Gurukuls to the vibrant screens
            of global learners, we bridge thousands of years with a single
            mission:
            <span className="font-medium"> Shastric Integrity</span>.
          </p>
        </div>
      </section>

      {/* ============ OUR HERITAGE SECTION ============ */}
      <section className="w-full py-24 bg-[#f6efe6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* LEFT CONTENT */}
            <div>
              <h2 className="font-serif text-4xl text-[#7b2d1f] mb-8">
                Our Heritage
              </h2>

              <p className="text-[#7b2d1f] leading-relaxed mb-6">
                <span className="text-5xl font-serif float-left mr-2 leading-none">
                  F
                </span>
                ounded in 2008, Kaumudi Academy was born from a vision to preserve
                the rhythmic beauty and philosophical depth of Sanskrit
                literature. What started as a small gathering of scholars in the
                shadows of the Himalayas has blossomed into a globally recognized
                institution for Paninian grammar and Vedic studies.
              </p>

              <p className="italic text-[#7b2d1f] mb-6">
                “We do not just teach a language; we awaken a heritage that has
                pulsed through the Indian subcontinent for millennia.”
              </p>

              <p className="text-[#7b2d1f] font-semibold">
                — Acharya Ramakant Sharma, Founder
              </p>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative">
              <div className="rounded-xl overflow-hidden border-4 border-white shadow-2xl">
                <img
                  src="/heritage.webp"
                  alt="Sanskrit Scholar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* ============== STATS + MISSION / VISION SECTION ============== */}
<section className="w-full py-24 bg-[#fbf7f3]">
  <div className="max-w-7xl mx-auto px-6">

    {/* ===== STATS CARDS ===== */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">

      {/* YEARS OF LEGACY */}
      <div className="bg-[#7b1f14] rounded-2xl py-10 text-center shadow-xl">
        <Landmark size={32} className="mx-auto mb-4 text-[#d6b25e]" />
        <p className="text-sm tracking-widest uppercase text-[#e7d8c6]">
          Years of Legacy
        </p>
        <p className="text-4xl font-serif font-bold text-white mt-2">
          15+
        </p>
      </div>

      {/* GLOBAL SCHOLARS */}
      <div className="bg-[#7b1f14] rounded-2xl py-10 text-center shadow-xl">
        <Users size={32} className="mx-auto mb-4 text-[#d6b25e]" />
        <p className="text-sm tracking-widest uppercase text-[#e7d8c6]">
          Global Scholars
        </p>
        <p className="text-4xl font-serif font-bold text-white mt-2">
          5000+
        </p>
      </div>

      {/* ADVANCED COURSES */}
      <div className="bg-[#7b1f14] rounded-2xl py-10 text-center shadow-xl">
        <BookOpen size={32} className="mx-auto mb-4 text-[#d6b25e]" />
        <p className="text-sm tracking-widest uppercase text-[#e7d8c6]">
          Advanced Courses
        </p>
        <p className="text-4xl font-serif font-bold text-white mt-2">
          50+
        </p>
      </div>

      {/* MANUSCRIPTS SAVED */}
      <div className="bg-[#7b1f14] rounded-2xl py-10 text-center shadow-xl">
        <CloudUpload size={32} className="mx-auto mb-4 text-[#d6b25e]" />
        <p className="text-sm tracking-widest uppercase text-[#e7d8c6]">
          Manuscripts Saved
        </p>
        <p className="text-4xl font-serif font-bold text-white mt-2">
          100+
        </p>
      </div>

    </div>

    {/* ===== MISSION & VISION ===== */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

      {/* OUR MISSION */}
      <div className="relative bg-[#fdf8f4] border border-[#e2cfc1] rounded-2xl p-10">
        <h3 className="font-serif text-2xl text-[#7b1f14] mb-4 flex items-center gap-3">
          <span className="h-px w-10 bg-[#7b1f14]"></span>
          Our Mission
        </h3>

        <p className="text-[#6b4b3e] leading-relaxed">
          To democratize Sanskrit education without diluting its rigor.
          We aim to provide a structured, accessible path for any seeker
          to master the “Divine Language” through modern pedagogical tools
          and traditional guru-shishya intimacy.
        </p>
      </div>

      {/* OUR VISION */}
      <div className="relative bg-[#fdf8f4] border border-[#e2cfc1] rounded-2xl p-10">
        <h3 className="font-serif text-2xl text-[#7b1f14] mb-4 flex items-center gap-3">
          <span className="h-px w-10 bg-[#7b1f14]"></span>
          Our Vision
        </h3>

        <p className="text-[#6b4b3e] leading-relaxed">
          To see Sanskrit recognized once again as a living language of
          science, philosophy, and global dialogue, ensuring that the wisdom
          of the Vedas and Upanishads continues to illuminate modern
          humanity’s challenges.
        </p>
      </div>

    </div>
  </div>
</section>
{/* ============================================================= */}
    </>
  );
}
