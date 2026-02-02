import { Hourglass } from "lucide-react";
import { Users } from "lucide-react";
import { BookOpen } from "lucide-react";
import { CloudUpload } from "lucide-react";



export default function Home() {
  return (
    <>
      {/* ============ HERO SECTION ============ */}
      <section className="py-45 flex items-center justify-center bg-[#f1e4c8] px-4">
        <div className="max-w-4xl text-center space-y-2">

          <h1 className="font-serif text-9xl lg:text-8xl leading-[1.15] text-[#7b2d1f] skew-x-[-14deg]">
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
      <section className="w-full py-5 bg-[#7b2d1f]  ">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* LEFT CONTENT */}
            <div>
              <h2 className="font-serif text-7xl text-[#d6b25e] mb-8 font-bold">
                Our Heritage
              </h2>

              <p className="text-[#d6b25e] leading-relaxed mb-6">
  Rooted in the classical guru–śiṣya tradition yet responsive to contemporary
  scholarship, the Academy has carefully bridged ancient wisdom with modern
  pedagogical practices. Its curriculum is designed not merely to transmit
  linguistic knowledge, but to cultivate disciplined inquiry, clarity of
  thought, and reverence for textual authenticity.
</p>

<p className="text-[#d6b25e] leading-relaxed mb-6">
  Over the years, Kaumudi Academy has become a meeting ground for traditional
  scholars and modern researchers, fostering dialogue across generations.
  Through rigorous textual analysis, oral recitation, and interpretive study,
  students are guided toward a deeper engagement with Sanskrit as a living
  intellectual tradition rather than a relic of the past.
</p>

<p className="text-[#d6b25e] leading-relaxed">
  Today, the Academy’s digital initiatives extend this timeless heritage beyond
  geographical boundaries, enabling learners across the world to participate in
  structured study, guided mentorship, and scholarly exchange—ensuring that the
  voice of Sanskrit continues to resonate in the modern age.
</p>


              <p className="italic text-[#d6b25e] mb-6 text-1x1">
                “We do not just teach a language; we awaken a heritage that has
                pulsed through the Indian subcontinent for millennia.”
              </p>

              <p className="text-[#d6b25e] font-bold">
                — Acharya Ramakant Sharma, Founder
              </p>
            </div>

            {/* RIGHT IMAGE */}
              <div className="relative">
                <div className=" w-100% rounded-4xl overflow-hidden border-4 border-[#f1e4c8] shadow-2xl h-200">
                  <img
                    src="https://i.pinimg.com/736x/43/d5/9b/43d59b6ffea25e44cb1092a10e43a78b.jpg"
                    alt="Sanskrit Scholar"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
              </div>

          </div>
        </div>
      </section>
      {/* ============== STATS + MISSION / VISION SECTION ============== */}
<section className="w-full py-45 bg-[#f1e4c8]">
  <div className="max-w-7xl mx-auto px-6">

    {/* ===== STATS CARDS ===== */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
      
      {/* Card 1 */}
      <div className="bg-[#7b1f14] rounded-2xl py-10 text-center shadow-xl">
        {/* <div className="text-[#d6b25e] text-2xl mb-3">⌛</div> */}
        <Hourglass size={28} className="mx-auto mb-3 text-[#d6b25e]" />
        <p className="text-sm tracking-widest uppercase text-[#e7d8c6]">
          Years of Legacy
        </p>
        <p className="text-4xl font-serif font-bold text-white mt-2">15+</p>
      </div>

      {/* Card 2 */}
      <div className="bg-[#7b1f14] rounded-2xl py-10 text-center shadow-xl">
        {/* <div className="text-[#d6b25e] text-2xl mb-3">👥</div> */}
        <Users size={28} className="mx-auto mb-3 text-[#d6b25e]" />
        <p className="text-sm tracking-widest uppercase text-[#e7d8c6]">
          Global Scholars
        </p>
        <p className="text-4xl font-serif font-bold text-white mt-2">5000+</p>
      </div>

      {/* Card 3 */}
      <div className="bg-[#7b1f14] rounded-2xl py-10 text-center shadow-xl">
        {/* <div className="text-[#d6b25e] text-2xl mb-3">📘</div> */}
        <BookOpen size={28} className="mx-auto mb-3 text-[#d6b25e]" />
        <p className="text-sm tracking-widest uppercase text-[#e7d8c6]">
          Advanced Courses
        </p>
        <p className="text-4xl font-serif font-bold text-white mt-2">50+</p>
      </div>

      {/* Card 4 */}
      <div className="bg-[#7b1f14] rounded-2xl py-10 text-center shadow-xl">
        {/* <div className="text-[#d6b25e] text-2xl mb-3">☁️</div> */}
        <CloudUpload size={28} className="mx-auto mb-3 text-[#d6b25e]" />
        <p className="text-sm tracking-widest uppercase text-[#e7d8c6]">
          Manuscripts Saved
        </p>
        <p className="text-4xl font-serif font-bold text-white mt-2">100+</p>
      </div>

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
  To democratize Sanskrit education without diluting its rigor.
  We aim to provide a structured, accessible path for any seeker
  to master the “Divine Language” through modern pedagogical tools
  and traditional guru-shishya intimacy.
</p>


        <div className="absolute right-6 bottom-6 opacity-10 text-7xl">◎</div>
      </div>

      {/* OUR VISION */}
      <div className="relative bg-[#fff9e9] border border-[#7b1f14] rounded-2xl p-10">
        <h3 className="font-serif text-2xl text-[#7b1f14] mb-4 flex items-center gap-3 font-bold">
          <span className="h-px w-10 bg-[#7b1f14] "></span>
          Our Vision
        </h3>

        <p className="text-base sm:text-lg lg:text-l text-[#6b4b3e] leading-relaxed">
          To see Sanskrit recognized once again as a living language of
          science, philosophy, and global dialogue, ensuring that the wisdom
          of the Vedas and Upanishads continues to illuminate modern
          humanity’s challenges.
        </p>

        <div className="absolute right-6 bottom-6 opacity-10 text-7xl">◎</div>
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
            A PhD from BHU with 20 years of experience in Paninian Grammar.
            Expert in the Mahabhashya tradition.
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
            <span className="font-semibold text-[#74271E]">
              {item.q}
            </span>
            <span className="text-[#74271E] group-open:hidden">+</span>
            <span className="text-[#74271E] hidden group-open:inline">
              −
            </span>
          </summary>
          <p className="mt-2 text-[#7b5a4c] leading-relaxed">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  </div>
</section>


    </>
  );
}
