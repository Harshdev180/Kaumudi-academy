import { motion } from "framer-motion";
import SEO from "../components/SEO";
import home5 from "../assets/home/home5.webp";

export default function PrivacyPolicy() {
  return (
    <section className="bg-[#FBF4E2] min-h-screen py-10 mb-[-70px]">
      <SEO
        title="Privacy Policy | Kaumudi Sanskrit Academy by Graphura India"
        description="Read how Kaumudi Sanskrit Academy, a venture of Graphura India Private Limited, collects, uses, and protects your information."
        canonicalPath="/privacy"
        og={{ type: "website" }}
        keywords={[
          "Privacy Policy",
          "Kaumudi Academy Privacy",
          "Graphura India Private Limited data protection",
          "Sanskrit Academy terms",
        ]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy",
            description:
              "Read how Kaumudi Sanskrit Academy collects, uses, and protects your information.",
            url:
              (typeof window !== "undefined" ? window.location.origin : "") +
              "/privacy",
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
                name: "Privacy Policy",
                item:
                  (typeof window !== "undefined"
                    ? window.location.origin
                    : "") + "/privacy",
              },
            ],
          },
        ]}
      />

      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-40 sm:h-56 lg:h-72 mx-4 w-full max-w-7xl bg-cover bg-center overflow-hidden rounded-3xl"
          style={{
            backgroundImage: `url(${home5})`,
          }}
        >
          <div className="absolute inset-0 bg-[#7b2d1f]/60 pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-1 sm:mb-2">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm tracking-wide opacity-90 font-bold">
              How We Collect, Use, and Protect Your Information
            </p>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-10">
        <div className="lg:hidden">
          <label htmlFor="privacy-toc" className="sr-only">
            Jump to section
          </label>
          <select
            id="privacy-toc"
            className="w-full rounded-xl border border-[#E2D4A6] bg-white px-4 py-3 text-[#74271E] font-semibold"
            onChange={(e) =>
              document
                .getElementById(e.target.value)
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            <option value="introduction">Introduction</option>
            <option value="data-collection">Data Collection</option>
            <option value="use-of-data">Use of Data</option>
            <option value="children-info">Children’s Information</option>
            <option value="contact-info">Contact Information</option>
          </select>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block bg-[#7b2d1f] rounded-2xl p-6 h-fit sticky top-24 shadow-lg"
        >
          <h3 className="font-serif font-bold text-[white] mb-2 text-2xl">
            Table of Contents
          </h3>

          <div className="w-14 h-[2px] bg-[#d6b25e] mb-4"></div>

          <ul className="space-y-1 text-sm text-[white]">
            {[
              { label: "Introduction", href: "#introduction" },
              { label: "Data Collection", href: "#data-collection" },
              { label: "Use of Data", href: "#use-of-data" },
              { label: "Children’s Information", href: "#children-info" },
              { label: "Contact Information", href: "#contact-info" },
            ].map((item, i) => (
              <li key={i}>
                <a
                  href={item.href}
                  className="
                    block px-3 py-2 rounded-md border-l-4 border-transparent
                    transition-all duration-200

                    hover:bg-[white]/5
                    hover:text-[white]
                    hover:border-[white]
                    hover:translate-x-1
                  "
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-6 sm:p-8 lg:p-10 text-[#6b4b3e] leading-relaxed bg-transparent"
        >
          <h2
            id="introduction"
            className="font-serif text-2xl sm:text-3xl font-bold text-[#7b2d1f] mb-4 scroll-mt-32"
          >
            Welcome to our privacy policy!
          </h2>

          <p className="mb-6 text-sm sm:text-base">
            At Curely, we take your privacy seriously. This policy outlines how
            we collect, use, and protect your personal information when you
            interact with our website or services.
          </p>

          <p className="mb-10 text-sm sm:text-base">
            We are committed to maintaining transparency about how data is
            handled and ensuring that your trust in our platform is respected at
            every step.
          </p>

          <h3
            id="data-collection"
            className="font-serif text-xl sm:text-2xl font-bold text-[#7b1f14] mb-4 scroll-mt-32"
          >
            Data Collection
          </h3>

          <p className="mb-4 text-sm sm:text-base">
            We collect information to provide better services, improve user
            experience, and maintain platform security.
          </p>

          <p className="font-semibold mb-2 text-sm sm:text-base">
            1. Information You Provide Directly
          </p>
          <ul className="list-disc pl-5 sm:pl-6 mb-6 text-sm sm:text-base space-y-1">
            <li>Name, email, and contact information</li>
            <li>Feedback and form submissions</li>
            <li>Preferences shared during communication</li>
            <li>Account-related information if applicable</li>
          </ul>

          <p className="font-semibold mb-2 text-sm sm:text-base">
            2. Automatically Collected Information
          </p>
          <ul className="list-disc pl-5 sm:pl-6 mb-6 text-sm sm:text-base space-y-1">
            <li>IP address, browser type, and device information</li>
            <li>Pages visited, time spent, and interaction data</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <p className="font-semibold mb-2 text-sm sm:text-base">3. Third-Party Sources</p>
          <ul className="list-disc pl-5 sm:pl-6 mb-10 text-sm sm:text-base space-y-1">
            <li>Social media interactions</li>
            <li>Analytics and advertising partners</li>
            <li>External service providers</li>
          </ul>

          <h3
            id="use-of-data"
            className="font-serif text-xl sm:text-2xl font-bold text-[#7b1f14] mb-4 scroll-mt-32"
          >
            Use of Data
          </h3>

          <p className="mb-4 text-sm sm:text-base">
            Information collected is used strictly to operate, improve, and
            secure our services.
          </p>

          <ul className="list-disc pl-5 sm:pl-6 mb-10 text-sm sm:text-base space-y-1">
            <li>Providing and personalizing services</li>
            <li>Responding to queries and support requests</li>
            <li>Improving website performance and usability</li>
            <li>Legal and regulatory compliance</li>
          </ul>

          <h3
            id="children-info"
            className="font-serif text-xl sm:text-2xl font-bold text-[#7b1f14] mb-4 scroll-mt-32"
          >
            Children’s Information
          </h3>

          <p className="mb-6 text-sm sm:text-base">
            Our services are not directed toward children under the age of 13.
            We do not knowingly collect personal information from minors.
          </p>

          <p className="mb-10 text-sm sm:text-base">
            If we become aware that a child has provided personal information,
            we will take immediate steps to remove such data from our records.
          </p>

          <h3
            id="contact-info"
            className="font-serif text-xl sm:text-2xl font-bold text-[#7b1f14] mb-2 scroll-mt-32"
          >
            Contact Information
          </h3>

          <div className="pt-5">
            <p className="text-sm sm:text-base text-[#7b5a4c] mb-3">
              If you have any questions, concerns, or requests related to this
              Privacy Policy, please contact our support team.
            </p>

            <p className="text-sm sm:text-base text-[#7b5a4c]">
              Continued use of our services indicates acceptance of this Privacy
              Policy and any future updates made to it.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
