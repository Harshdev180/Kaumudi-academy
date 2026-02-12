import React from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Award, ScrollText } from "lucide-react";
import { Link } from "react-router-dom";

const FacultyPage = () => {
  const facultyMembers = [
    {
      name: "Dr. Ananth Narayan",
      role: "HOD · Vyakarana Shastra",
      image:
        "https://i.pinimg.com/736x/6e/f3/a3/6ef3a3792fc89e992cfdace89b3b887e.jpg",
      bio: "A PhD from BHU with 20 years of experience in Paninian Grammar. Expert in the Mahabhashya tradition.",
      specialization: "Vyakarana",
    },
    {
      name: "Acharya Meera Iyer",
      role: "Dean · Vedic Studies",
      image:
        "https://i.pinimg.com/736x/c2/38/f6/c238f6196864b554e23286e972946dc2.jpg",
      bio: "Specializes in Rigveda Bhashya and Advaita Vedanta. Renowned for her simplified Sahitya workshops.",
      specialization: "Vedic Studies",
    },
    {
      name: "Pandit Rajiv Misra",
      role: "Senior Lecturer · Sahitya",
      image:
        "https://i.pinimg.com/736x/6e/44/7f/6e447f2168e966bc30049bebe00537dc.jpg",
      bio: "An erudite scholar in Kavyashastra and Dramaturgy. Author of multiple commentaries on Kalidasa's works.",
      specialization: "Sahitya",
    },
    {
      name: "Vidushi Priya Sharma",
      role: "Instructor · Spoken Sanskrit",
      image:
        "https://i.pinimg.com/736x/1f/bb/0e/1fbb0e761ada8399ea3031b75972a293.jpg",
      bio: "Dedicated to making Sanskrit conversational and accessible. Leads our 'Sambhashana' initiatives.",
      specialization: "Spoken Sanskrit",
    },
    {
      name: "Swami Vidyananda",
      role: "Chief of Darshana Studies",
      image:
        "https://i.pinimg.com/1200x/4d/ce/47/4dce475c98aa927bd3bc5186fea452f0.jpg",
      bio: "Master of Nyaya and Vedanta philosophies. Bringing clarity to complex philosophical texts.",
      specialization: "Darshana",
    },
    {
      name: "Prof. Rahul Dev",
      role: "Expert · Epigraphy",
      image:
        "https://i.pinimg.com/736x/36/d1/33/36d133d60e678d1888838aaa7778fe58.jpg",
      bio: "Unlocking history through inscriptions. Expert in Brahmi and Sharada scripts.",
      specialization: "Epigraphy",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <>
      <section id="hero" className="relative min-h-[85vh] bg-[#f1e4c8] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[#d6b15c]/20 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.06]">
            <div className="absolute top-10 left-10 text-9xl text-[#7b2d1f] font-serif">ॐ</div>
            <div className="absolute bottom-10 right-10 text-9xl text-[#7b2d1f] font-serif">श्री</div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#f1e4c8] to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-24 relative">
          <div className="text-center">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 text-[#7b2d1f] text-xs sm:text-sm uppercase tracking-[0.35em] font-bold"
            >
              Our Mentors
              <span className="inline-block w-8 h-[2px] bg-[#d6b15c]" />
            </motion.span>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative mx-auto mt-6 h-10 w-[320px] sm:w-[420px] rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ x: "-60%" }}
                animate={{ x: "60%" }}
                transition={{ repeat: Infinity, repeatType: "mirror", duration: 3.2, ease: "easeInOut" }}
                className="absolute inset-y-0 w-2/3 bg-gradient-to-r from-[#d6b15c]/40 via-[#d6b15c]/20 to-transparent blur-xl"
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mt-6 font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-[#7b2d1f] font-extrabold"
            >
              Guided by
              <span className="mx-3 px-3 py-1 rounded-2xl bg-[#d6b15c] text-[#74271E] italic">
                Tradition
              </span>
              and Excellence
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 max-w-3xl mx-auto text-[#6b4b3e] text-base sm:text-lg leading-relaxed font-serif"
            >
              Learn with scholars rooted in parampara and fluent in modern pedagogy.
              Engage in authentic, rigorous study under direct guidance.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/allcourses"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#74271E] text-white font-bold shadow-lg hover:bg-[#5e1f18] transition"
              >
                Explore Courses
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-[#74271E] text-[#74271E] font-bold bg-white hover:bg-[#f9f4ea] transition"
              >
                Contact Academy
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ FACULTY GRID ============ */}
      <section className="py-24 bg-[#fff9e9]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {facultyMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden group border border-[#f1e4c8] hover:border-[#d6b15c] transition-colors"
              >
                <div className="relative overflow-hidden h-80">
                  <div className="absolute inset-0 bg-[#7b2d1f]/10 z-10" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="p-8">
                  <h3 className="font-serif text-2xl text-[#7b2d1f] mb-2 font-bold">
                    {member.name}
                  </h3>

                  <p className="text-sm font-bold text-[#86543f] uppercase tracking-widest mb-4 border-b pb-4">
                    {member.role}
                  </p>

                  <p className="text-[#6b4b3e] leading-relaxed mb-6 font-serif">
                    {member.bio}
                  </p>

                  <div className="flex items-center gap-4 text-[#7b2d1f]/60">
                    <BookOpen size={20} />
                    <Award size={20} />
                    <ScrollText size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ JOIN US CTA ============ */}
      <section className="py-16 bg-[#7b2d1f] text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <GraduationCap size={48} className="mx-auto text-[#d6b15c] mb-6" />

          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 font-bold">
            Learn from the Best
          </h2>

          <p className="text-white text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Join our courses and receive direct mentorship from these
            distinguished scholars.
          </p>

          <button className="bg-[#d6b15c] text-[#7b2d1f] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#f1e4c8] transition shadow-lg">
            Explore Courses
          </button>
        </motion.div>
      </section>
      <div className="h-20 bg-[#fff9e9]" />
    </>
  );
};

export default FacultyPage;
