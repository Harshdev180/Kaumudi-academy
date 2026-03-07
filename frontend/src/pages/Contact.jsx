import {
  MapPin,
  Landmark,
  GraduationCap,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import SEO from "../components/SEO";
import { submitContact, submitInquiry } from "../lib/api";

/* ---------------------------------- */
/* Animation Variants */
/* ---------------------------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7 },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7 },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    preferredLevel: "BEGINNER",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.preferredLevel ||
      !formData.subject ||
      !formData.message
    ) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await submitContact({
        fullName: formData.fullName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setSuccess("Message sent successfully! We'll get back to you soon.");

      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        preferredLevel: "BEGINNER",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us | Kaumudi Sanskrit Academy by Graphura India"
        description="Connect with Kaumudi Sanskrit Academy, a venture of Graphura India Private Limited, for admissions, scholarly inquiries, and Vedic learning support."
        canonicalPath="/contact"
        og={{ type: "website" }}
        keywords={[
          "Contact Kaumudi Academy",
          "Graphura India Private Limited contact",
          "Sanskrit admission inquiries",
          "Academy location India",
          "Vedic education support",
        ]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Kaumudi Sanskrit Academy",
            description:
              "Contact Kaumudi Sanskrit Academy for admissions, course inquiries, or collaborations.",
            url:
              (typeof window !== "undefined" ? window.location.origin : "") +
              "/contact",
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
                  (typeof window !== "undefined"
                    ? window.location.origin
                    : "") + "/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Contact",
                item:
                  (typeof window !== "undefined"
                    ? window.location.origin
                    : "") + "/contact",
              },
            ],
          },
        ]}
      />
      <section className="relative w-full bg-gradient-to-b mb-[-6rem] from-[#f6edd7] to-[#ead9b8] py-24 overflow-hidden">
        {/* FLOATING ORBS */}
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="absolute -top-40 -left-40 w-[520px] h-[520px]
                   bg-[#7b2d1f]/15 rounded-full blur-[140px]"
        />

        <motion.div
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 11, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-[420px] h-[420px]
                   bg-[#d4b77a]/25 rounded-full blur-[120px]"
        />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* HEADER */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-20 max-w-5xl"
          >
            <motion.h1
              variants={fadeUp}
              className="font-serif text-4xl md:text-6xl font-bold text-[#7b2d1f]"
            >
              Contact & Location Details
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-black/70 leading-relaxed"
            >
              Connect with Kaumudi Sanskrit Academy for scholarly inquiries,
              admissions, and comprehensive support in your Vedic learning
              journey.
            </motion.p>
          </motion.div>

          {/* MAIN GRID */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-1 gap-16"
          >
            {/* LEFT — FORM */}
            <motion.div
              variants={fadeLeft}
              whileHover={{ y: -8 }}
              className="relative  bg-gradient-to-br from-[#fff8e5] to-[#ead9b8]
                       rounded-[3rem] border border-[#7b2d1f]/70
                       p-10 lg:p-14 shadow-[0_40px_120px_rgba(0,0,0,0.25)]
                       overflow-hidden"
            >
              <h2 className="text-[#7b2d1f] font-bold mb-10 text-3xl">
                Send us a Message
              </h2>
              <div>
                <motion.form
                  variants={stagger}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  onSubmit={handleSubmit}
                >
                  {[
                    {
                      label: "FULL NAME",
                      name: "fullName",
                      placeholder: "Enter your full name",
                    },
                    {
                      label: "EMAIL ADDRESS",
                      name: "email",
                      placeholder: "your@email.com",
                    },
                    {
                      label: "PHONE NUMBER",
                      name: "phoneNumber",
                      placeholder: "10-digit number",
                    },
                    {
                      label: "SUBJECT",
                      name: "subject",
                      placeholder: "Course inquiry, support",
                    },
                  ].map((item, i) => (
                    <motion.div key={i} variants={fadeUp} className="w-full">
                      <label className="block text-xs tracking-[0.3em] font-bold text-[#7b2d1f] mb-2">
                        {item.label}
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type={
                          item.name === "email"
                            ? "email"
                            : item.name === "phoneNumber"
                              ? "tel"
                              : "text"
                        }
                        name={item.name}
                        value={formData[item.name]}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#dcc7a1]
          px-4 py-4 bg-white shadow-lg
          focus:ring-2 focus:ring-[#7b2d1f]"
                        placeholder={item.placeholder}
                      />
                    </motion.div>
                  ))}

                  {/* MESSAGE FULL WIDTH */}
                  <motion.div
                    variants={fadeUp}
                    className="md:col-span-2 w-full"
                  >
                    <label className="block text-xs tracking-[0.3em] font-bold text-[#7b2d1f] mb-2">
                      MESSAGE
                      <span className="text-xs text-[#7b2d1f]">
                        (Min. 10 Words)
                      </span>
                    </label>

                    <motion.textarea
                      rows={5}
                      whileFocus={{ scale: 1.02 }}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#dcc7a1]
        px-4 py-4 bg-white shadow-lg resize-none
        focus:ring-2 focus:ring-[#7b2d1f]"
                      placeholder="Write your message..."
                    />
                  </motion.div>

                  {/* ERROR / SUCCESS FULL WIDTH */}
                  {error && (
                    <div className="md:col-span-2 text-red-600 font-semibold">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="md:col-span-2 text-green-700 font-semibold">
                      {success}
                    </div>
                  )}

                  {/* BUTTON ON NEW LINE FULL WIDTH */}
                  <motion.div
                    variants={fadeUp}
                    className="md:col-span-2 w-full"
                  >
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-gradient-to-r from-[#7b2d1f] to-[#5f1f14]
        text-white py-4 rounded-2xl font-bold tracking-[0.25em]
        disabled:opacity-60 mt-2"
                    >
                      {loading ? "SENDING..." : "SEND MESSAGE"}
                    </motion.button>
                  </motion.div>
                </motion.form>
              </div>
            </motion.div>

            {/* RIGHT — MAP + INFO */}
            <div className="space-y-12">
              {/* MAP */}
              <motion.div
                variants={fadeRight}
                whileHover={{ y: -8, scale: 1.01 }}
                className="bg-white rounded-[2.5rem] border border-[#7b2d1f]/70
                         p-6 shadow-xl flex flex-col min-h-[520px]"
              >
                <h3 className="flex items-center gap-2 text-[#7b2d1f] font-bold text-2xl">
                  <MapPin size={22} /> Main Campus Office
                </h3>

                <p className="mt-3 text-lg text-black/70">
                  Kadi, Mehsana, Gujarat
                </p>

                <iframe
                  title="Kaumudi Academy Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2152.510980173506!2d72.32957612395224!3d23.29815853737631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c18078321e28f%3A0xdca9292f4989571c!2sKadi%2C%20Gujarat%20384440!5e1!3m2!1sen!2sin!4v1771429182287!5m2!1sen!2sin"
                  className="mt-6 w-full flex-1 rounded-xl border"
                  loading="lazy"
                />
              </motion.div>

              {/* INFO CARDS */}
              <motion.div
                variants={stagger}
                className="grid sm:grid-cols-2 gap-10"
              >
                {[
                  {
                    icon: Landmark,
                    title: "Institutional Inquiries",
                    text: "For university partnerships and academic collaborations.",
                    footer: "ksacademy@gmail.com",
                  },
                  {
                    icon: GraduationCap,
                    title: "Student Support",
                    text: "Technical issues, course access, and certification help.",
                    footer: "Mon–Fri, 9am–6pm IST",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={i}
                      variants={fadeUp}
                      whileHover={{ y: -12, scale: 1.03 }}
                      className="bg-gradient-to-br from-[#f5e9cd] to-[#e6d1a5]
                               border border-[#7b2d1f]/50 rounded-3xl
                               p-9 shadow-xl"
                    >
                      <div
                        className="h-16 w-16 rounded-xl bg-[#7b2d1f] text-white
                                    flex items-center justify-center mb-6"
                      >
                        <Icon size={28} />
                      </div>

                      <h4 className="text-[#7b2d1f] font-bold text-2xl">
                        {item.title}
                      </h4>

                      <p className="mt-3 text-sm text-[#7b2d1f]/80">
                        {item.text}
                      </p>

                      <p className="mt-6 font-bold text-[#7b2d1f]">
                        {item.footer}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>

          {/* SOCIALS */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 flex items-center gap-6 pb-6"
          >
            <p className="text-lg tracking-[0.3em] text-[#7b2d1f] font-bold">
              FOLLOW US
            </p>

            {[Instagram].map((Icon, i) => (
              <motion.a
                key={i}
                href="https://www.instagram.com/sanskritstation/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  scale: 1.25,
                  rotate: 8,
                  boxShadow: "0 0 30px rgba(123,45,31,0.6)",
                }}
                whileTap={{ scale: 0.9 }}
                className="h-14 w-14 bg-gradient-to-br from-[#7b2d1f] to-[#5f1f14]
               text-white rounded-full flex items-center justify-center
               shadow-xl cursor-pointer transition-all duration-300"
              >
                <Icon size={24} />
              </motion.a>
            ))}
          </motion.div>
        </div>
        {/* CONTACT STRIP BELOW CARDS */}
        {/* <motion.div
          variants={stagger}
          className="grid md:grid-cols-3 gap-10 py-18 mx-7 xl:mx-auto max-w-7xl"
        >
          {[
            {
              icon: Phone,
              title: "Call Us",
              value: "+91 75672 23072",
            },
            {
              icon: Mail,
              title: "Email",
              value: "ksacademy@gmail.com",
            },
            {
              icon: MapPin,
              title: "Visit Campus",
              value: "Kadi, Mehsana, Gujarat",
            },
          ].map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -10, scale: 1.04 }}
                className="bg-gradient-to-br from-[#f5e9cd] to-[#e6d1a5] border border-[#7b2d1f]/40
                     rounded-3xl p-8 text-center shadow-xl"
              >
                <div
                  className="mx-auto mb-6 h-16 w-16 rounded-full
                       bg-[#7b2d1f] text-white
                       flex items-center justify-center"
                >
                  <Icon size={26} />
                </div>

                <h4 className="text-xl font-bold text-[#7b2d1f]">
                  {item.title}
                </h4>

                <p className="mt-3 font-semibold text-black/70">{item.value}</p>
              </motion.div>
            );
          })}
        </motion.div> */}
      </section>
    </>
  );
}
