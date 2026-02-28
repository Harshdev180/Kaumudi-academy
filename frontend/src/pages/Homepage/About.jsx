import { motion } from "framer-motion";
import aboutImg from "../../assets/image1.webp";
import home1 from "../../assets/home/home1.webp";
import { Link } from "react-router-dom";

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
    <section className="relative bg-[#f1e4c8] py-10 overflow-hidden">
      <div className="mx-auto max-w-[1320px] px-6 grid gap-16 md:grid-cols-[1.25fr_1fr] items-center">
        {/* IMAGE (desktop/tablet: visible on md+, hidden on small screens) */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="hidden md:block rounded-[2.5rem] bg-[#e6d6b8] p-3 shadow-2xl relative z-10"
        >
          <img
            src={home1}
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

          {/* Mobile-only image placed immediately after the heading for better small-screen flow */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="block md:hidden rounded-[2rem] bg-[#e6d6b8] p-2 shadow-md mt-4 overflow-hidden"
          >
            <img
              src={home1}
              alt="Kaumudi Academy campus"
              className="w-full h-[220px] sm:h-[300px] object-cover rounded-[1.5rem]"
            />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden md:block absolute -top-28 -left-10 text-[140px] font-black uppercase tracking-widest text-[#74271E]/10 select-none pointer-events-none z-0"
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
          <Link to={"/about"}>
            <motion.button
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#74271E] px-7 py-3 font-semibold text-white shadow-lg transition hover:bg-[#5e1f18] focus:outline-none focus:ring-2 focus:ring-[#d6b15c]"
            >
              Learn Our Story →
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
