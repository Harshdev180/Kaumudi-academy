import { motion } from "framer-motion";
import { Globe, Globe2 } from "lucide-react";
import { RiAncientGateFill } from "react-icons/ri";
import { IoHome } from "react-icons/io5";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerList = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const listItem = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Learning = () => {
  return (
    <section className="bg-[#74271E] py-24 relative overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 grid gap-12 md:grid-cols-3 items-start">
        {/* Left Content */}
        <motion.div
          variants={staggerList}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="md:col-span-1"
        >
          <motion.div variants={fadeUp}>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Your Scholar’s Path: Choose Your Learning Mode
            </h3>

            <div className="mt-4 h-[3px] w-16 rounded-full bg-[#d6b15c]" />

            <p className="mt-5 text-white/90 leading-relaxed">
              We offer flexible learning environments to suit your lifestyle
              while maintaining the traditional rigor of classical Sanskrit
              education.
            </p>
          </motion.div>

          <div className="mt-8 space-y-4">
            {/* Feature */}
            <motion.div
              variants={listItem}
              whileHover={{ x: 6 }}
              className="flex items-start gap-4 rounded-2xl bg-[#f1e4c8] px-5 py-4 shadow-sm transition-colors hover:bg-white"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#74271E]/10 text-[#74271E]">
                <RiAncientGateFill />
              </span>
              <div>
                <p className="font-semibold text-[#74271E]">
                  Ancestral Methods
                </p>
                <p className="text-sm text-[#86543f]">
                  Pedagogy rooted in the Guru–Shishya tradition.
                </p>
              </div>
            </motion.div>

            {/* Feature */}
            <motion.div
              variants={listItem}
              whileHover={{ x: 6 }}
              className="flex items-start gap-4 rounded-2xl bg-[#f1e4c8] px-5 py-4 shadow-sm transition-colors hover:bg-white"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#74271E]/10 text-[#74271E]">
                <Globe2 />
              </span>
              <div>
                <p className="font-semibold text-[#74271E]">Modern Delivery</p>
                <p className="text-sm text-[#86543f]">
                  Interactive digital portals and live HD sessions.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="md:col-span-2 grid gap-6 sm:grid-cols-1">
          {/* Online */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="rounded-3xl bg-[#f1e4c8] p-7 shadow-xl transition"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#74271E]/10 text-[#74271E]">
                <Globe />
              </span>
              <h4 className="text-xl font-bold text-[#74271E]">
                Online Academy
              </h4>
            </div>

            <p className="mt-3 text-[#7b5a4c] leading-relaxed">
              Study Sanskrit without borders. Participate in real-time sessions,
              revisit lessons through high-quality recordings, and explore our
              growing digital archive of classical texts all from the comfort of
              your home.
            </p>

            <Link to={"/contact"}>
              <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#74271E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5e1f18] focus:outline-none focus:ring-2 focus:ring-[#d6b15c]">
                Join Global Batch →
              </button>
            </Link>
          </motion.div>

          {/* Offline */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="rounded-3xl bg-[#f1e4c8] p-7 shadow-xl transition"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#74271E]/10 text-[#74271E]">
                <IoHome />
              </span>
              <h4 className="text-xl font-bold text-[#74271E]">
                Offline Gurukul
              </h4>
            </div>

            <p className="mt-3 text-[#7b5a4c] leading-relaxed">
              Study Sanskrit in a traditional residential setting guided by
              experienced acharyas. Engage in daily recitation, close
              mentorship, and structured discipline that nurtures both
              scholarship and character.
            </p>

            <Link to={"/contact"}>
              <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#74271E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5e1f18] focus:outline-none focus:ring-2 focus:ring-[#d6b15c]">
                Visit Campus →
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Learning;
