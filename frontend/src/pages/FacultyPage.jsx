import React from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Award, ScrollText } from "lucide-react";

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
      {/* ============ HERO SECTION ============ */}
      <section className="py-32 flex items-center justify-center bg-[#f1e4c8] px-4 relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute top-10 left-10 text-9xl text-[#7b2d1f] font-serif">
            ॐ
          </div>
          <div className="absolute bottom-10 right-10 text-9xl text-[#7b2d1f] font-serif">
            श्री
          </div>
        </div>

        <div className="max-w-4xl text-center space-y-6 relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#7b2d1f] text-lg uppercase tracking-[0.35em] font-bold block"
          >
            Our Mentors
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl lg:text-7xl leading-[1.1] text-[#7b2d1f] font-bold"
          >
            Guardians of <br />
            <span className="italic text-[#d6b25e]">Ancient Wisdom</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-xl text-[#6b4b3e] max-w-2xl mx-auto leading-relaxed font-serif"
          >
            Our faculty comprises traditional scholars and modern academicians
            dedicated to preserving and propagating the sanctity of Sanskrit.
          </motion.p>
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
