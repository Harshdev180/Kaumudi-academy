import { motion } from "framer-motion";
import aboutImg from "../../assets/image1.jpeg";
// import heroImg from "../../assets/imgg.jpg"; // 👈 ADD YOUR HERO IMAGE HERE

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerBullets = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const bulletItem = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const About = () => {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-[420px] md:h-[520px] bg-[#74271E] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={heroImg}
            alt="Kaumudi Academy heritage"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-[#ebcb82] mb-4">
            Our Heritage. Our Vision.
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-[#f1e4c8]/90">
            Bridging ancient Sanskrit wisdom with modern global learning
          </p>
        </motion.div>
      </section>

      {/* ABOUT SECTION (UNCHANGED) */}
      <section className="relative bg-[#f1e4c8] py-16 overflow-hidden">
        <div className="mx-auto max-w-[1320px] px-6 grid gap-16 md:grid-cols-[1.25fr_1fr] items-center">
          {/* IMAGE */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-[2.5rem] bg-[#e6d6b8] p-3 shadow-2xl relative z-10"
          >
            <img
              src={aboutImg}
              alt="Kaumudi Academy campus"
              className="w-full h-[340px] md:h-[350px] lg:h-[460px] object-cover rounded-[2rem]"
            />
          </motion.div>

          {/* CONTENT */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-6 relative"
          >
            <h3 className="text-4xl md:text-4xl font-extrabold tracking-wide text-[#74271E] font-serif">
              About Kaumudi Academy
            </h3>

            <div className="h-[3px] w-20 rounded-full bg-[#d6b15c]" />

            <motion.span
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute -top-28 -left-10 text-[140px] font-black uppercase tracking-widest text-[#74271E]/10 select-none pointer-events-none z-0"
            >
              About
            </motion.span>

            <p className="text-lg leading-relaxed text-[#7b5a4c]">
              Kaumudi Academy was born from a vision to democratize Sanskrit
              education for the modern world. We unite the disciplined scholarship
              of traditional Pathashalas with digital learning making classical
              wisdom accessible to seekers everywhere.
            </p>

            <p className="text-lg leading-relaxed text-[#7b5a4c]">
              Rooted in centuries-old pedagogy and guided by accomplished
              Acharyas, our programs cultivate linguistic mastery, philosophical
              insight, and cultural literacy for lifelong learners.
            </p>

            {/* BULLETS */}
            <motion.ul
              variants={staggerBullets}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-3 pt-2"
            >
              {[
                "Live interactive sessions with renowned Acharyas",
                "Digitized access to rare classical manuscripts",
                "Globally recognized certification programs",
              ].map((item) => (
                <motion.li
                  key={item}
                  variants={bulletItem}
                  className="flex items-start gap-3 text-[#7b5a4c]"
                >
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#7b2d1f]" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA */}
            <motion.button
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="mt-0 inline-flex items-center gap-2 rounded-xl bg-[#74271E] px-7 py-3 font-semibold text-white shadow-lg transition hover:bg-[#5e1f18] focus:outline-none focus:ring-2 focus:ring-[#d6b15c]"
            >
              Learn Our Story →
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;
