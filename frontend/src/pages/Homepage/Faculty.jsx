import { motion } from "framer-motion";
import faculty1 from "../../assets/home/faculty1.webp";
import faculty2 from "../../assets/home/faculty2.webp";
import faculty3 from "../../assets/home/faculty3.webp";
import faculty4 from "../../assets/home/faculty4.webp";

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
        faculty1,
    },
    {
      name: "Dr. Meera Iyer",
      role: "Head of Sahitya",
      image:
        faculty2,
    },
    {
      name: "Swami Vidyananda",
      role: "Chief of Darshana Studies",
      image:
        faculty3,
    },
    {
      name: "Prof. Rahul Dev",
      role: "Spoken Sanskrit Expert",
      image:
        faculty4,
    },
  ];

  return (
    <section
      id="faculty"
      className="bg-[#f1e4c8] py-6 sm:py-20 md:py-24 overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center relative"
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#74271E] tracking-wide font-serif">
            Our Distinguished Faculty
          </h3>

          <div className="mx-auto mt-4 h-[3px] w-16 rounded-full bg-[#d6b15c]" />

          {/* Background word */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="
              hidden md:block
              absolute
              left-1/2
              -translate-x-1/2
              -top-20 lg:-top-28
              text-[clamp(5rem,12vw,9rem)]
              font-black
              uppercase
              tracking-widest
              text-[#74271E]/10
              select-none
              pointer-events-none
              z-0
            "
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
          className="
            mt-12 sm:mt-14
            grid
            gap-8 sm:gap-10
            grid-cols-2
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
          "
        >
          {faculty.map((f) => (
            <motion.div
              key={f.name}
              variants={item}
              whileHover={{
                y: -10,
                scale: 1.03,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                },
              }}
              className="group text-center"
            >
              {/* Avatar */}
              <div
                className="
                  mx-auto
                  flex
                  items-center
                  justify-center
                  rounded-full
                  bg-[#74271E]/10
                  p-1
                  shadow-md
                  transition-all
                  duration-500
                  group-hover:scale-110
                  group-hover:shadow-xl
                  group-hover:bg-[#d6b15c]/20
                  h-24 w-24
                  sm:h-28 sm:w-28
                  md:h-32 md:w-32
                "
              >
                <img
                  src={f.image}
                  alt={f.name}
                  loading="lazy"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="mt-4 sm:mt-5 font-bold text-[#74271E] text-sm sm:text-base">
                {f.name}
              </div>

              <div className="text-xs sm:text-sm text-[#86543f]">{f.role}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Faculty;
