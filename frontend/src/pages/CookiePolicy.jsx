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
      className="min-h-screen px-4 sm:px-6 py-16 sm:py-20 lg:py-24 bg-[#FBF4E2]"
    >
      <div className="max-w-5xl mx-auto">
        <SEO
          title="Cookie Policy | Kaumudi Sanskrit Academy by Graphura India"
          description="Learn how Kaumudi Sanskrit Academy, a venture of Graphura India Private Limited, uses cookies and how you can control them."
          canonicalPath="/cookies"
          og={{ type: "website" }}
          keywords={[
            "Cookie Policy",
            "Kaumudi Academy cookies",
            "Graphura India Private Limited privacy",
            "Website tracking policy",
          ]}
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Cookie Policy",
              description:
                "Learn how Kaumudi Sanskrit Academy uses cookies and how you can control them.",
              url:
                (typeof window !== "undefined" ? window.location.origin : "") +
                "/cookies",
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
                  name: "Cookie Policy",
                  item:
                    (typeof window !== "undefined"
                      ? window.location.origin
                      : "") + "/cookies",
                },
              ],
            },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 sm:gap-4 mb-10 sm:mb-14"
        >
          <motion.div whileHover={{ x: -4 }}>
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#7b2d1f] cursor-pointer" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-[#7b2d1f] tracking-tight">
            Cookie Policy
          </h1>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          whileHover={{ boxShadow: "0 30px 80px rgba(0,0,0,0.2)" }}
          className="relative rounded-[2.5rem] overflow-hidden"
        >
          <motion.div
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${cookieimg})`,
            }}
          />

          <div className="absolute inset-0 bg-[#fdf7ec]/80" />

          <motion.div
            className="relative z-10 p-6 sm:p-10 lg:p-14 space-y-10 sm:space-y-16 lg:space-y-20"
            variants={stagger}
          >
            <motion.section variants={rise} className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#7b2d1f] mb-4 sm:mb-6">
                Wisdom & Digital Privacy
              </h2>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-[#5f4334]">
                We preserve sacred learning traditions while embracing
                responsible digital practices—protecting your privacy at every
                step.
              </p>
            </motion.section>

            <motion.section variants={rise} className="max-w-3xl">
              <h3 className="flex gap-3 text-xl sm:text-2xl font-semibold text-[#7b2d1f] mb-3 sm:mb-4">
                <Cookie className="w-5 h-5 sm:w-6 sm:h-6" /> What are cookies?
              </h3>
              <p className="text-base sm:text-lg text-[#5f4334]">
                Cookies help maintain sessions, preferences, and platform
                security during your learning journey.
              </p>
            </motion.section>

            <motion.section variants={rise} className="max-w-3xl">
              <h3 className="flex gap-3 text-xl sm:text-2xl font-semibold text-[#7b2d1f] mb-3 sm:mb-4">
                <Info className="w-5 h-5 sm:w-6 sm:h-6" /> Why we use cookies
              </h3>
              <ul className="list-disc pl-5 sm:pl-6 space-y-2 sm:space-y-3 text-base sm:text-lg text-[#5f4334]">
                <li>Secure course access</li>
                <li>Saved learning preferences</li>
                <li>Academic quality improvement</li>
                <li>Institutional updates</li>
              </ul>
            </motion.section>

            <motion.section variants={rise} className="px-4 sm:px-6 lg:px-0">
              <h3 className="flex items-center gap-3 text-lg sm:text-2xl font-semibold text-[#7b2d1f] mb-5 sm:mb-8">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                Manage Preferences
              </h3>

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
                    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                  }}
                  className="rounded-2xl sm:rounded-3xl border border-[#e6ddd2] 
      p-4 sm:p-6 lg:p-7 mb-4 sm:mb-6 
      bg-[#f7f2ea] 
      flex flex-col sm:flex-row 
      sm:items-center 
      gap-3 sm:gap-0 
      sm:justify-between 
      transition-all duration-300"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[#7b2d1f]">{item.icon}</span>

                      <p className="text-sm sm:text-lg font-semibold text-[#7b2d1f]">
                        {item.title}
                      </p>

                      {item.disabled && (
                        <span className="text-[10px] sm:text-xs uppercase tracking-wide 
            text-red-700 font-bold bg-red-100 px-2 py-1 rounded-full">
                          Required
                        </span>
                      )}
                    </div>

                    <p className="text-sm sm:text-base text-[#5f4334] mt-2 sm:mt-3 leading-relaxed">
                      {item.disabled
                        ? "These cookies are essential for authentication, session security, and uninterrupted access to your courses. They cannot be disabled."
                        : item.desc}
                    </p>
                  </div>

                  <div className="self-end sm:self-auto">
                    {!item.disabled ? (
                      <motion.button
                        layout
                        transition={{ type: "spring", stiffness: 400 }}
                        onClick={() => item.set(!item.state)}
                        className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${item.state ? "bg-[#7b2d1f]" : "bg-gray-300"
                          }`}
                      >
                        <motion.span
                          layout
                          className="absolute top-2 w-4 h-4 bg-white rounded-full shadow"
                          style={{ left: item.state ? "32px" : "8px" }}
                        />
                      </motion.button>
                    ) : (
                      <div className="w-14 h-8 bg-[#7b2d1f]/40 rounded-full relative cursor-not-allowed">
                        <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full shadow" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.section>

            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 30px rgba(123,45,31,0.25)",
              }}
              whileTap={{ scale: 0.96 }}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#7b2d1f] to-[#8f3a29] text-white py-4 sm:py-5 rounded-2xl text-base sm:text-lg md:text-xl font-semibold shadow-lg transition-all duration-300 active:shadow-inner"
              onClick={() => {
                console.log({ analytics, announcements });
                alert("Preferences saved");
              }}
            >
              <Save className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="tracking-wide">Save Preferences</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
