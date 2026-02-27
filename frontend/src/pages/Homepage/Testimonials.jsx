import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import cap from "../../assets/cap.webp";
import person1 from "../../assets/home/person1.webp";
import person2 from "../../assets/home/person2.webp";
import person3 from "../../assets/home/person3.webp";
import person4 from "../../assets/home/person4.webp";

const testimonials = [
  {
    name: "Sarah Smith",
    role: "IT Engineer",
    text: "Choosing this academy was one of the most transformative decisions of my academic life. The Acharyas explain even the most complex grammatical concepts with clarity and patience, and the structured curriculum helped me build confidence step by step. The live chanting sessions, manuscript studies, and interactive discussions created a deeply immersive learning experience that goes far beyond ordinary online classes. I now feel truly connected to the language, its philosophy, and its timeless intellectual tradition.",
    image: person1,
    rating: 4,
  },
  {
    name: "Michael Brown",
    role: "Business Owner",
    text: "What impressed me most about this institution is the balance between traditional teaching methods and modern accessibility. The recorded lectures, personal mentoring sessions, and thoughtfully designed course materials made it easy to continue learning alongside my professional commitments. The discipline, authenticity, and scholarly depth of the programs are remarkable. I would strongly recommend this academy to anyone seeking serious, classical Sanskrit education in a contemporary format.",
    image: person2,
    rating: 3,
  },
  {
    name: "Sophia Lee",
    role: "Interior Designer",
    text: "From the very first week, I felt welcomed into a vibrant scholarly community. The faculty are incredibly dedicated, and the campus atmosphere both physical and virtual is inspiring and serene. The emphasis on pronunciation, scriptural interpretation, and cultural context gave me a deeper appreciation of Sanskrit literature than I ever imagined possible. This academy doesn’t just teach a language it cultivates a lifelong love for learning.",
    image: person3,
    rating: 5,
  },
  {
    name: "James Carter",
    role: "Entrepreneur",
    text: "The rigor and authenticity of the teaching here exceeded all my expectations. Each module is carefully structured, with ample opportunities for revision, guided practice, and one-to-one doubt-clearing sessions. The digitized manuscripts and archival resources are exceptional, and the global discussion forums allowed me to exchange ideas with fellow students from many countries. It feels like being part of a truly international scholarly tradition..",
    image: person4,
    rating: 4,
  },
];

const slideVariants = {
  enter: { opacity: 0, x: 60, scale: 0.98 },
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    x: -60,
    scale: 0.98,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const active = testimonials[index];

  return (
    <section className="py-16 bg-[#f1e4c8] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Heading */}
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-4xl md:text-5xl font-black font-serif text-[#74271E] mb-10 tracking-wide"
        >
          Voices From Our Learners
        </motion.h3>

        <div className="w-16 h-[3px] bg-[#d6b15c] rounded-full mx-auto mt-4 mb-12" />

        {/* Slider */}
        <div className="relative flex justify-center min-h-[100px] pt-5">
          {/* Background word */}

          {/* Background word */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="pointer-events-none absolute inset-x-0 -top-60 flex justify-center z-0 overflow-hidden"
          >
            <span
              aria-hidden
              className="hidden sm:block
      select-none
      whitespace-nowrap
      font-black
      tracking-widest
      uppercase
      text-[clamp(4rem,12vw,9rem)]
      text-[#74271E]/10
      blur-[0.4px]
    "
            >
              Learners
            </span>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative overflow-visible max-w-4xl w-full bg-white rounded-3xl shadow-2xl px-8 py-7 min-h-[350px] flex flex-col justify-center"
            >
              {/* Cap */}
              <motion.div
                className="hidden sm:block absolute -top-26 -right-31 w-32 md:w-70 drop-shadow-xl pointer-events-none"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.img
                  src={cap}
                  alt="cap"
                  className="w-full object-contain rotate-[10deg]"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              <div className="flex items-start gap-4">
                <img
                  src={active.image}
                  className="h-16 w-16 rounded-full object-cover border-4 border-[#d6b15c]"
                />

                <div>
                  <h4 className="font-extrabold text-lg text-[#74271E]">
                    {active.name}
                  </h4>

                  <p className="text-sm text-[#74271E]">{active.role}</p>

                  <div className="mt-1 text-[#d6b15c]">
                    {"★".repeat(active.rating)}
                    {"☆".repeat(5 - active.rating)}
                  </div>
                </div>
              </div>

              <p className="mt-5 leading-relaxed text-[#74271E]">
                {active.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
