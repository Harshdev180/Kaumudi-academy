import { Hourglass, Users, BookOpen, CloudUpload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ====== COUNT-UP CARD (RUNS ONLY WHEN VISIBLE) ====== */
function StatCard({ icon: Icon, label, value }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;

          let start = 0;
          const duration = 1800;
          const increment = value / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.ceil(start));
            }
          }, 16);
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className="bg-[#7b1f14] rounded-3xl py-10 sm:py-12 text-center shadow-xl
                 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <Icon size={30} className="mx-auto mb-4 text-[#d6b25e]" />
      <p className="text-xs sm:text-sm tracking-widest uppercase text-[#e7d8c6]">
        {label}
      </p>
      <p className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
        {count}+
      </p>
    </div>
  );
}

export default function About() {
  return (
    <>
      {/* ============ HERO SECTION ============ */}
      <section
        className="py-36 sm:py-44 lg:py-52 flex items-center justify-center px-4
        bg-[url('https://i.pinimg.com/736x/42/bf/b6/42bfb6901d8e0ef2de2eb54219ca5880.jpg')]
        bg-cover bg-center bg-no-repeat"
      >
        <div className="max-w-5xl text-center space-y-5 sm:space-y-6">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl
          leading-tight text-[#d6b25e] skew-x-[-12deg] drop-shadow-sm">
            The Soul of Sanskrit <br />
            in the Heart of the Digital Age
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#edddbd]
          max-w-3xl mx-auto leading-relaxed sm:leading-loose">
            From the silent corridors of ancient Gurukuls to the vibrant screens
            of global learners, we bridge thousands of years with a single
            mission:
            <span className="font-medium"> Shastric Integrity</span>.
          </p>
        </div>
      </section>

      {/* ============ OUR HERITAGE SECTION ============ */}
      <section className="w-full py-20 sm:py-28 bg-[#f1e4c8]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl
              text-[#7b1f14] mb-8 sm:mb-10 font-bold">
                Our Heritage
              </h2>

              <p className="text-[#7b1f14] leading-relaxed mb-6">
                Rooted in the classical guru–śiṣya tradition yet responsive to contemporary
                scholarship, the Academy has carefully bridged ancient wisdom with modern
                pedagogical practices. Its curriculum is designed not merely to transmit
                linguistic knowledge, but to cultivate disciplined inquiry, clarity of
                thought, and reverence for textual authenticity.
              </p>

              <p className="text-[#7b1f14] leading-relaxed mb-6">
                Over the years, Kaumudi Academy has become a meeting ground for traditional
                scholars and modern researchers, fostering dialogue across generations.
                Through rigorous textual analysis, oral recitation, and interpretive study,
                students are guided toward a deeper engagement with Sanskrit as a living
                intellectual tradition rather than a relic of the past.
              </p>

              <p className="text-[#7b1f14] leading-relaxed mb-8 sm:mb-10">
                Today, the Academy’s digital initiatives extend this timeless heritage beyond
                geographical boundaries, enabling learners across the world to participate
                in structured study, guided mentorship, and scholarly exchange—ensuring that
                the voice of Sanskrit continues to resonate in the modern age.
              </p>

              <p className="italic text-[#7b1f14] mb-3">
                “We do not just teach a language; we awaken a heritage that has pulsed through
                the Indian subcontinent for millennia.”
              </p>

              <p className="text-[#7b1f14] font-bold">
                — Acharya Ramakant Sharma, Founder
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden border-4 border-[#7b1f14] shadow-2xl">
              <img
                src="https://i.pinimg.com/1200x/9f/73/85/9f7385cef84d85a6770cfc10c55e09a0.jpg"
                alt="Sanskrit Scholar"
                className="w-full h-[320px] sm:h-[420px] lg:h-full object-cover
                grayscale hover:grayscale-0 transition"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============== STATS SECTION ============== */}
      <section className="w-full py-20 sm:py-28 bg-[#f8e4b6]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 mb-24 sm:mb-28">
            <StatCard icon={Hourglass} label="Years of Legacy" value={15} />
            <StatCard icon={Users} label="Global Scholars" value={5000} />
            <StatCard icon={BookOpen} label="Advanced Courses" value={50} />
            <StatCard icon={CloudUpload} label="Manuscripts Saved" value={100} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
            {["Mission", "Vision"].map((title, i) => (
              <div
                key={i}
                className="relative bg-[#fff9e9] border border-[#7b1f14]
                rounded-3xl p-8 sm:p-12 shadow-lg hover:shadow-xl transition"
              >
                <h3 className="font-serif text-xl sm:text-2xl text-[#7b1f14]
                mb-4 flex items-center gap-3 font-bold">
                  <span className="h-px w-10 bg-[#7b1f14]"></span>
                  Our {title}
                </h3>

                <p className="text-base sm:text-lg text-[#6b4b3e] leading-relaxed">
                  {title === "Mission"
                    ? "To democratize Sanskrit education without diluting its rigor. We aim to provide a structured, accessible path for any seeker to master the “Divine Language” through modern pedagogical tools and traditional guru-shishya intimacy."
                    : "To see Sanskrit recognized once again as a living language of science, philosophy, and global dialogue, ensuring that the wisdom of the Vedas and Upanishads continues to illuminate modern humanity’s challenges."}
                </p>

                <div className="absolute right-6 bottom-6 opacity-10 text-6xl sm:text-7xl">
                  ◎
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="py-20 sm:py-24 bg-[#f1e4c8]">
        <div className="max-w-[900px] mx-auto px-4 sm:px-5">
          <h3 className="text-3xl sm:text-4xl font-black text-[#74271E]
          text-center mb-8 sm:mb-10">
            Questions & Clarity
          </h3>

          <div className="space-y-4">
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
                className="group rounded-2xl bg-[#fff9e9] shadow-md p-4 sm:p-5
                hover:shadow-lg transition"
              >
                <summary className="flex items-center justify-between cursor-pointer
                font-semibold text-[#74271E]">
                  {item.q}
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </summary>
                <p className="mt-3 text-[#7b5a4c] leading-relaxed">
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
