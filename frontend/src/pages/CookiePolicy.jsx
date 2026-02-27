import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Cookie,
  BarChart3,
  Bell,
  Save,
  Lock,
  Info,
} from "lucide-react";
import SEO from "../components/SEO";
import cookieimg from "../assets/cookieimg.webp";

/* animation presets */
const pageFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const rise = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CookiePolicy() {
  const [analytics, setAnalytics] = useState(false);
  const [announcements, setAnnouncements] = useState(false);

  return (
    <motion.section
      variants={pageFade}
      initial="hidden"
      animate="visible"
      className="min-h-screen px-6 py-24 bg-[#fcefd4]"
    >
      <div className="max-w-5xl mx-auto">
        <SEO
          title="Cookie Policy | Kaumudi Sanskrit Academy"
          description="Learn how Kaumudi Sanskrit Academy uses cookies and how you can control them."
          canonicalPath="/cookies"
          og={{ type: "website" }}
        />

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-14"
        >
          <motion.div whileHover={{ x: -4 }}>
            <ArrowLeft className="w-6 h-6 text-[#7b2d1f] cursor-pointer" />
          </motion.div>

          <h1 className="text-5xl font-serif font-bold text-[#7b2d1f] tracking-tight">
            Cookie Policy
          </h1>
        </motion.div>

        {/* CARD */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          whileHover={{ boxShadow: "0 30px 80px rgba(0,0,0,0.2)" }}
          className="relative rounded-[2.5rem] overflow-hidden"
        >
          {/* BG IMAGE */}
          <motion.div
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                `url(${cookieimg})`,
            }}
          />

          {/* overlay */}
          <div className="absolute inset-0 bg-[#fdf7ec]/80" />

          {/* CONTENT */}
          <motion.div className="relative z-10 p-14 space-y-20" variants={stagger}>

            {/* INTRO */}
            <motion.section variants={rise} className="max-w-3xl">
              <h2 className="text-4xl font-serif font-bold text-[#7b2d1f] mb-6">
                Wisdom & Digital Privacy
              </h2>
              <p className="text-xl leading-relaxed text-[#5f4334]">
                We preserve sacred learning traditions while embracing responsible
                digital practices—protecting your privacy at every step.
              </p>
            </motion.section>

            {/* INFO SECTIONS */}
            <motion.section variants={rise} className="max-w-3xl">
              <h3 className="flex gap-3 text-2xl font-semibold text-[#7b2d1f] mb-4">
                <Cookie className="w-6 h-6" /> What are cookies?
              </h3>
              <p className="text-lg text-[#5f4334]">
                Cookies help maintain sessions, preferences, and platform
                security during your learning journey.
              </p>
            </motion.section>

            <motion.section variants={rise} className="max-w-3xl">
              <h3 className="flex gap-3 text-2xl font-semibold text-[#7b2d1f] mb-4">
                <Info className="w-6 h-6" /> Why we use cookies
              </h3>
              <ul className="list-disc pl-6 space-y-3 text-lg text-[#5f4334]">
                <li>Secure course access</li>
                <li>Saved learning preferences</li>
                <li>Academic quality improvement</li>
                <li>Institutional updates</li>
              </ul>
            </motion.section>

            {/* PREFERENCES */}
            <motion.section variants={rise}>
              <h3 className="flex gap-3 text-2xl font-semibold text-[#7b2d1f] mb-8">
                <Settings className="w-6 h-6" /> Manage Preferences
              </h3>

              {/* CARD TEMPLATE */}
              {[
                {
                  title: "Strictly Necessary",
                  desc: "Required for security and access",
                  icon: <Lock className="w-5 h-5" />,
                  disabled: true,
                },
                {
                  title: "Analytics Cookies",
                  desc: "Improve lesson experience",
                  icon: <BarChart3 className="w-5 h-5" />,
                  state: analytics,
                  set: setAnalytics,
                },
                {
                  title: "Announcements",
                  desc: "Course & event updates",
                  icon: <Bell className="w-5 h-5" />,
                  state: announcements,
                  set: setAnnouncements,
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                  }}
                  className="rounded-3xl border p-7 mb-6 bg-[#f7f2ea] flex justify-between"
                >
                  <div>
                    <p className="flex gap-2 text-lg font-semibold text-[#7b2d1f]">
                      {item.icon} {item.title}
                      {item.disabled && (
                     <span className="ml-3 relative top-[7px] text-xs uppercase tracking-wide text-red-700 font-bold">
  Required
</span>

                      )}
                    </p>

                    <p className="text-[#5f4334] mt-3">
                      {item.disabled
                        ? "These cookies are essential for authentication, session security, and uninterrupted access to your courses. They cannot be disabled."
                        : item.desc}
                    </p>
                  </div>

                  {/* TOGGLE LOGIC UNCHANGED */}
                  {!item.disabled ? (
                    <motion.button
                      layout
                      transition={{ type: "spring", stiffness: 400 }}
                      onClick={() => item.set(!item.state)}
                      className={`w-14 h-8 rounded-full relative ${
                        item.state ? "bg-[#7b2d1f]" : "bg-gray-300"
                      }`}
                    >
                      <motion.span
                        layout
                        className="absolute top-2 w-4 h-4 bg-white rounded-full"
                        style={{ left: item.state ? "32px" : "8px" }}
                      />
                    </motion.button>
                  ) : (
                    <div className="w-14 h-8 bg-[#7b2d1f]/40 rounded-full relative cursor-not-allowed">
                      <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.section>

            {/* CTA */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 0 6px rgba(123,45,31,0.15)",
              }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-3 bg-[#7b2d1f] text-white py-6 rounded-xl text-xl font-semibold"
              onClick={() => {
                console.log({ analytics, announcements });
                alert("Preferences saved");
              }}
            >
              <Save className="w-6 h-6" />
              Save Preferences
            </motion.button>

          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
