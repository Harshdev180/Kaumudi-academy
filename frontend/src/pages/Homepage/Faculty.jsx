import { motion } from "framer-motion";

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
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const Faculty = () => {
  const faculty = [
    {
      name: "Acharya V. Shastri",
      role: "Dean of Vyakarana",
      image:
        "https://i.pinimg.com/736x/00/e9/23/00e923faba6f97291983890a831443f2.jpg",
    },
    {
      name: "Dr. Meera Iyer",
      role: "Head of Sahitya",
      image:
        "https://i.pinimg.com/736x/1f/bb/0e/1fbb0e761ada8399ea3031b75972a293.jpg",
    },
    {
      name: "Swami Vidyananda",
      role: "Chief of Darshana Studies",
      image:
        "https://i.pinimg.com/1200x/4d/ce/47/4dce475c98aa927bd3bc5186fea452f0.jpg",
    },
    {
      name: "Prof. Rahul Dev",
      role: "Spoken Sanskrit Expert",
      image:
        "https://i.pinimg.com/736x/36/d1/33/36d133d60e678d1888838aaa7778fe58.jpg",
    },
  ];

  return (
    <section id="faculty" className="bg-[#f1e4c8] py-24 overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center relative"
        >
          <h3 className="text-3xl md:text-4xl font-extrabold text-[#74271E] tracking-wide font-serif">
            Our Distinguished Faculty
          </h3>
          <div className="mx-auto mt-4 h-[3px] w-16 rounded-full bg-[#d6b15c]" />
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute -top-28 left-60 text-[140px] font-black uppercase tracking-widest text-[#74271E]/10 select-none pointer-events-none z-0"
          >
            Faculty
          </motion.span>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4"
        >
          {faculty.map((f) => (
            <motion.div
              key={f.name}
              variants={item}
              whileHover={{
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="group text-center"
            >
              {/* Avatar */}
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#74271E]/10 p-1 shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:shadow-xl group-hover:bg-[#d6b15c]/20">
                <img
                  src={f.image}
                  alt={f.name}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="mt-5 font-bold text-[#74271E]">{f.name}</div>
              <div className="text-sm text-[#86543f]">{f.role}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Faculty;
