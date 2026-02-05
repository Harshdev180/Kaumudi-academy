import {
  MapPin,
  Landmark,
  GraduationCap,
  Facebook,
  Youtube,
  Instagram
} from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <>
      {/* MAIN CONTACT SECTION */}
      <section className="w-full bg-[#f1e4c8] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 sm:mb-14"
          >
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl
                           lg:text-6xl font-bold text-[#7b2d1f] mb-3">
              Contact & Location Details
            </h1>
            <p className="max-w-3xl text-sm sm:text-base text-black/80 leading-relaxed">
              Connect with Kaumudi Sanskrit Academy for scholarly inquiries, admissions,
              and comprehensive support in your Vedic learning journey.
            </p>
          </motion.div>

          {/* FORM + MAP */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">

            {/* LEFT — CONTACT FORM */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-[#fffbec] to-[#efe1c2]
                         rounded-[2.5rem] border border-[#7b2d1f]
                         p-8 sm:p-10 lg:p-12 h-full shadow-2xl overflow-hidden"
            >
              {/* DECORATIVE ELEMENTS */}
              <div className="absolute -top-28 -left-28 w-80 sm:w-96 h-80 sm:h-96
                              bg-[#7b2d1f]/15 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-20 sm:w-24 h-20 sm:h-24
                              border-2 border-[#7b2d1f]/30 rounded-full" />

              <h2 className="relative text-[#7b2d1f] font-bold mb-8 sm:mb-10
                             text-2xl sm:text-3xl tracking-wide">
                Send us a Message
              </h2>

              <form className="relative space-y-6 sm:space-y-8">
                {[
                  { label: "FULL NAME", placeholder: "Enter your full name" },
                  { label: "EMAIL ADDRESS", placeholder: "yourname@email.com" },
                  { label: "SUBJECT", placeholder: "Course inquiry, support, etc." }
                ].map((item, i) => (
                  <div key={i}>
                    <label className="block text-[10px] sm:text-xs font-bold text-[#7b2d1f]
                                      mb-2 tracking-[0.25em]">
                      {item.label}
                    </label>

                    <input
                      type="text"
                      placeholder={item.placeholder}
                      className="w-full rounded-xl border border-[#dcc7a1]
                                 px-4 py-3 sm:py-4 text-sm bg-white
                                 shadow-lg
                                 focus:outline-none focus:ring-2 focus:ring-[#7b2d1f]
                                 focus:shadow-xl
                                 transition-all"
                    />
                  </div>
                ))}

                {/* MESSAGE */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-[#7b2d1f]
                                    mb-2 tracking-[0.25em]">
                    MESSAGE
                  </label>

                  <textarea
                    rows="5"
                    placeholder="Write your message here..."
                    className="w-full rounded-xl border border-[#dcc7a1]
                               px-4 py-3 sm:py-4 text-sm bg-white
                               shadow-lg resize-none
                               focus:outline-none focus:ring-2 focus:ring-[#7b2d1f]
                               focus:shadow-xl
                               transition-all"
                  />
                </div>

                {/* SUBMIT */}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-[#7b2d1f] text-white py-3 sm:py-4
                             rounded-2xl font-bold
                             tracking-[0.2em]
                             shadow-2xl hover:bg-[#682418]
                             transition-all"
                >
                  SEND MESSAGE
                </motion.button>
              </form>
            </motion.div>

            {/* RIGHT — MAP */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl border border-[#7b2d1f]
                         p-4 sm:p-5 h-[420px] sm:h-auto
                         flex flex-col shadow-xl"
            >
              <h3 className="flex items-center gap-2 text-[#7b2d1f]
                             font-bold mb-1 text-xl sm:text-2xl">
                <MapPin size={22} />
                Main Campus Office
              </h3>

              <p className="text-xs sm:text-sm text-black/70 mb-4 leading-relaxed">
                108 Vidya Vihar, Sanskrit Marg,<br />
                Varanasi, Uttar Pradesh 221001, India
              </p>

              <iframe
                title="Kaumudi Academy Map"
                src="https://www.google.com/maps?q=Varanasi%20Uttar%20Pradesh&output=embed"
                className="w-full flex-1 rounded-lg border"
                loading="lazy"
              />
            </motion.div>
          </div>

          {/* INFO CARDS */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2
                       gap-6 sm:gap-8 max-w-4xl"
          >
            {[
              {
                icon: Landmark,
                title: "Institutional Inquiries",
                text:
                  "For university partnerships and academic collaborations.",
                footer: "admin@kaumudi.edu"
              },
              {
                icon: GraduationCap,
                title: "Student Support",
                text:
                  "Technical issues, course access, and certification help.",
                footer: "Mon–Fri, 9am–6pm IST"
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -8 }}
                  className="relative group"
                >
                  <div className="relative bg-[#ead9b8] border border-[#7b2d1f]
                                  rounded-2xl p-6 shadow-md overflow-hidden
                                  transition-all duration-300">
                    <div className="absolute -top-10 -right-10 w-32 h-32
                                    bg-[#7b2d1f]/10 rounded-full" />

                    <div className="flex items-center justify-center h-14 w-14
                                    rounded-xl bg-[#7b2d1f] text-white
                                    shadow-md mb-5">
                      <Icon size={26} />
                    </div>

                    <h4 className="text-[#7b2d1f] font-bold mb-2
                                   text-xl sm:text-2xl">
                      {item.title}
                    </h4>

                    <p className="text-sm text-[#7b2d1f]/80 mb-5 leading-relaxed">
                      {item.text}
                    </p>

                    <div className="pt-4 border-t border-[#7b2d1f]/30">
                      <p className="text-sm font-bold text-[#7b2d1f]">
                        {item.footer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* FOLLOW US */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 mt-10 sm:mt-12"
          >
            <p className="text-xs tracking-widest text-[#7b2d1f] font-bold">
              FOLLOW US
            </p>

            <div className="flex gap-3">
              {[Facebook, Youtube, Instagram].map((Icon, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.15 }}
                  className="h-8 w-8 rounded-full bg-[#7b2d1f] text-white
                             flex items-center justify-center shadow-md transition"
                >
                  <Icon size={16} />
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}
