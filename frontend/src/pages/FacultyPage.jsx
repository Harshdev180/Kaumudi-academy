import React from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Award, ScrollText } from "lucide-react";
import { Link } from "react-router-dom";
import imgg from "../assets/fac.png";
import SEO from "../components/SEO";
import faculty1 from "../assets/about/about3.webp";
import faculty2 from "../assets/about/about4.webp";
import faculty3 from "../assets/about/about5.webp";
import faculty4 from "../assets/home/faculty2.webp";
import faculty5 from "../assets/home/faculty3.webp";
import faculty6 from "../assets/home/faculty4.webp";

const FacultyPage = () => {
  const facultyMembers = [
    {
      name: "Dr. Ananth Narayan",
      role: "HOD · Vyakarana Shastra",
      image: faculty1,
      bio: "A PhD from BHU with 20 years of experience in Paninian Grammar. Expert in the Mahabhashya tradition.",
    },
    {
      name: "Acharya Meera Iyer",
      role: "Dean · Vedic Studies",
      image: faculty2,
      bio: "Specializes in Rigveda Bhashya and Advaita Vedanta.",
    },
    {
      name: "Pandit Rajiv Misra",
      role: "Senior Lecturer · Sahitya",
      image: faculty3,
      bio: "Scholar in Kavyashastra and Dramaturgy.",
    },
    {
      name: "Vidushi Priya Sharma",
      role: "Instructor · Spoken Sanskrit",
      image: faculty4,
      bio: "Dedicated to conversational Sanskrit.",
    },
    {
      name: "Swami Vidyananda",
      role: "Chief of Darshana Studies",
      image: faculty5,
      bio: "Master of Nyaya & Vedanta philosophy.",
    },
    {
      name: "Prof. Rahul Dev",
      role: "Expert · Epigraphy",
      image: faculty6,
      bio: "Unlocking history through inscriptions.",
    },
  ];
  const seo = (
    <SEO
      title="Our Acharyas | Faculty of Kaumudi Sanskrit Academy"
      description="Meet our team of scholars at Kaumudi Sanskrit Academy, a venture of Graphura India Private Limited. Experts in Paninian Grammar, Vedanta, and Kavya."
      canonicalPath="/faculty"
      og={{ type: "website" }}
      keywords={[
        "Sanskrit scholars India",
        "Acharya Ananth Narayan",
        "Sanskrit teachers",
        "Kaumudi Academy faculty",
        "Graphura India education team",
        "Vedanta experts online",
        "Vyakarana instructors",
      ]}
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Faculty",
          description:
            "Meet our Acharyas and faculty who guide students across Vyakarana, Vedanta, Kavya and more.",
          url:
            (typeof window !== "undefined" ? window.location.origin : "") +
            "/faculty",
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item:
                (typeof window !== "undefined" ? window.location.origin : "") +
                "/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Faculty",
              item:
                (typeof window !== "undefined" ? window.location.origin : "") +
                "/faculty",
            },
          ],
        },
      ]}
    />
  );

  return (
    <>
      {seo}
      {/* HERO */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center text-center overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${imgg})` }}
      >
        <div className="absolute inset-0 bg-[#2c2820]/60" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-3xl px-6"
        >
          <span className="text-[#d6b15c] uppercase tracking-[0.35em] text-sm font-bold">
            Our Mentors
          </span>

          <h1 className="mt-6 font-serif text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Guided by Tradition <br />
            <span className="text-[#d6b15c] italic">and Excellence</span>
          </h1>

          <p className="mt-6 text-gray-200 text-lg leading-relaxed">
            Learn with scholars rooted in parampara and fluent in modern
            pedagogy.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              className="px-8 py-4 rounded-full bg-[#d6b15c] text-[#74271E] font-bold hover:scale-105 transition"
              to="/allcourses"
            >
              Explore Courses
            </Link>

            <Link
              className="px-8 py-4 rounded-full border border-white text-white hover:bg-white hover:text-[#74271E] transition"
              to={"/contact"}
            >
              Contact Academy
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FACULTY GRID */}
      <section className="py-24 bg-[#fff9e9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
            {facultyMembers.map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="bg-[#f1e4c8] rounded-3xl shadow-lg overflow-hidden group transition h-full flex flex-col"
              >
                <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>

                <div className="p-8 space-y-3 flex-1 flex flex-col">
                  <h3 className="font-serif text-xl font-bold text-[#74271E]">
                    {member.name}
                  </h3>

                  <p className="text-xs font-bold uppercase tracking-widest text-[#74271E]">
                    {member.role}
                  </p>

                  <p className="text-[#74271E]/80 text-sm leading-relaxed">
                    {member.bio}
                  </p>

                  <div className="mt-auto flex gap-3 text-[#74271E]/70 pt-2">
                    <BookOpen size={18} />
                    <Award size={18} />
                    <ScrollText size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#7b2d1f] to-[#5b1f17] text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto px-6"
        >
          <GraduationCap size={48} className="mx-auto text-[#d6b15c] mb-6" />

          <h2 className="font-serif text-4xl font-bold mb-6">
            Learn from the Best
          </h2>

          <p className="text-lg text-gray-200 mb-10">
            Join our courses and receive mentorship from distinguished scholars.
          </p>

          <Link
            className="bg-[#d6b15c] text-[#7b2d1f] px-10 py-4 rounded-full font-bold hover:scale-105 transition"
            to="/allcourses"
          >
            Explore Courses
          </Link>
        </motion.div>
      </section>

      <div className="h-10 bg-[#fff9e9]" />
    </>
  );
};

export default FacultyPage;
