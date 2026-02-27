import { motion } from "framer-motion";
import { IoHome } from "react-icons/io5";
import { RiGraduationCapFill } from "react-icons/ri";
import { BsGlobe } from "react-icons/bs";
import { IoIosPaper } from "react-icons/io";
import mission1 from "../../assets/home/mission1.webp";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const features = [
  {
    title: "Scholarly Heritage",
    desc: "Preserving centuries of linguistic excellence through verified oral and written lineages.",
    icon: <IoHome size={24} />,
  },
  {
    title: "Authentic Pedagogy",
    desc: "Traditional methods tailored for modern cognitive learning styles.",
    icon: <RiGraduationCapFill size={24} />,
  },
  {
    title: "Global Community",
    desc: "Connecting Sanskrit enthusiasts across 50+ countries via digital platforms.",
    icon: <BsGlobe size={24} />,
  },
  {
    title: "Rich Archive",
    desc: "Access to rare manuscripts and curated digital study materials.",
    icon: <IoIosPaper size={24} />,
  },
];

export default function Mission() {
  return (
    <section className="bg-[#74271E] py-28 relative overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* TEXT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* BACKGROUND WORD */}
          <motion.span
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden sm:block absolute -top-28 -left-15 text-[140px] font-black uppercase tracking-widest text-[#d6b15c]/10 select-none pointer-events-none z-0"
          >
            Mission
          </motion.span>

          <h3 className="relative z-10 text-4xl md:text-5xl font-black text-white font-serif tracking-wide">
            Our Mission
          </h3>

          <div className="relative z-10 mt-4 h-[3px] w-16 rounded-full bg-[#d6b15c]" />

          <p className="relative z-10 mt-5 max-w-xl text-lg leading-relaxed text-white/80 font-serif">
            Dedicated to reviving the rich Sanskrit heritage through structured
            programs, accessible study materials, and an engaged global
            community of scholars and learners.
          </p>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative z-10 mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={item}
                whileHover={{ y: -6, scale: 1.02 }}
                className="flex gap-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-[#74271E] bg-white p-3 shadow-lg">
                  {" "}
                  {f.icon}{" "}
                </div>

                <div>
                  <h4 className="text-lg font-extrabold text-white">
                    {f.title}
                  </h4>
                  <p className="mt-1 text-sm text-white/75 font-serif">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* IMAGE SIDE */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.02 }}
          className="flex justify-center"
        >
          <div className="relative max-w-md w-full rounded-3xl bg-[#e6d6b8] p-3 shadow-2xl">
            <div className="absolute inset-0 rounded-3xl bg-[#d6b15c]/20 blur-xl" />

            <img
              src={mission1}
              alt="Sanskrit Manuscript"
              className="relative w-full h-[420px] object-cover rounded-2xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
