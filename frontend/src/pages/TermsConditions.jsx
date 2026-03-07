import { motion } from "framer-motion";
import SEO from "../components/SEO";
import home2 from "../assets/home/home2.webp";

export default function TermsCondition() {
  return (
    <section className="bg-[#FBF4E2] min-h-screen py-10 mb-[-70px]">
      <SEO
        title="Terms & Conditions | Kaumudi Sanskrit Academy by Graphura India"
        description="Read the terms and conditions for using Kaumudi Sanskrit Academy services, a venture of Graphura India Private Limited."
        canonicalPath="/terms"
        og={{ type: "website" }}
        keywords={[
          "Terms and Conditions",
          "Kaumudi Academy terms",
          "Graphura India Private Limited legal",
          "Academy service agreement",
        ]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms & Conditions",
            description:
              "Read the terms and conditions for using Kaumudi Sanskrit Academy services.",
            url:
              (typeof window !== "undefined" ? window.location.origin : "") +
              "/terms",
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
                name: "Terms & Conditions",
                item:
                  (typeof window !== "undefined"
                    ? window.location.origin
                    : "") + "/terms",
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
            backgroundImage: `url(${home2})`,
          }}
        >
          <div className="absolute inset-0 bg-[#7b2d1f]/60 pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-1 sm:mb-2">
              Terms & Conditions
            </h1>
            <p className="text-xs sm:text-sm tracking-wide opacity-90 font-bold">
              Please read these terms carefully before using our services
            </p>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-10">
        <div className="lg:hidden">
          <label htmlFor="terms-toc" className="sr-only">
            Jump to section
          </label>
          <select
            id="terms-toc"
            className="w-full rounded-xl border border-[#E2D4A6] bg-white px-4 py-3 text-[#74271E] font-semibold"
            onChange={(e) =>
              document
                .getElementById(e.target.value)
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            <option value="acceptance">Acceptance of Terms</option>
            <option value="use-of-services">Use of Services</option>
            <option value="responsibilities">User Responsibilities</option>
            <option value="intellectual-property">Intellectual Property</option>
            <option value="liability">Limitation of Liability</option>
            <option value="termination">Termination</option>
            <option value="law">Governing Law</option>
          </select>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block bg-[#7b2d1f] rounded-2xl p-6 h-fit sticky top-24 shadow-lg"
        >
          <h3 className="font-serif font-bold text-[white] mb-2 text-2xl">
            Table of Contents
          </h3>

          <div className="w-12 h-[2px] bg-[#d6b25e] mb-4"></div>

          <ul className="space-y-1 text-sm text-[white]">
            {[
              { label: "Acceptance of Terms", href: "#acceptance" },
              { label: "Use of Services", href: "#use-of-services" },
              { label: "User Responsibilities", href: "#responsibilities" },
              {
                label: "Intellectual Property",
                href: "#intellectual-property",
              },
              { label: "Limitation of Liability", href: "#liability" },
              { label: "Termination", href: "#termination" },
              { label: "Governing Law", href: "#law" },
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
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-6 sm:p-8 lg:p-10 text-[#6b4b3e] leading-relaxed"
        >
          <h2
            id="acceptance"
            className="font-serif text-2xl sm:text-3xl font-bold text-[#7b2d1f] mb-4 scroll-mt-32"
          >
            Acceptance of Terms
          </h2>

          <p className="mb-10 text-sm sm:text-base">
            By accessing or using Curely’s website, applications, or services,
            you agree to be bound by these Terms & Conditions. If you do not
            agree, you must discontinue use immediately.
          </p>

          <h3
            id="use-of-services"
            className="font-serif text-xl sm:text-2xl font-bold text-[#7b1f14] mb-4 scroll-mt-32"
          >
            Use of Services
          </h3>

          <ul className="list-disc pl-5 sm:pl-6 mb-10 text-sm sm:text-base space-y-1">
            <li>Services are provided for personal and lawful use only</li>
            <li>
              You must not misuse, disrupt, or attempt unauthorized access
            </li>
            <li>Accuracy of information provided is your responsibility</li>
          </ul>

          <h3
            id="responsibilities"
            className="font-serif text-xl sm:text-2xl font-bold text-[#7b1f14] mb-4 scroll-mt-32"
          >
            User Responsibilities
          </h3>

          <p className="mb-6 text-sm sm:text-base">
            Users agree to comply with all applicable laws and regulations while
            using the platform. Any activity that violates ethical, legal, or
            security standards is strictly prohibited.
          </p>

          <h3
            id="intellectual-property"
            className="font-serif text-xl sm:text-2xl font-bold text-[#7b1f14] mb-4 scroll-mt-32"
          >
            Intellectual Property
          </h3>

          <p className="mb-10 text-sm sm:text-base">
            All content, branding, logos, and materials available on this
            platform are the exclusive property of Curely and protected by
            intellectual property laws. Unauthorized reproduction is prohibited.
          </p>

          <h3
            id="liability"
            className="font-serif text-xl sm:text-2xl font-bold text-[#7b1f14] mb-4 scroll-mt-32"
          >
            Limitation of Liability
          </h3>

          <p className="mb-10 text-sm sm:text-base">
            Curely shall not be liable for any direct, indirect, incidental, or
            consequential damages arising from the use or inability to use the
            platform, to the fullest extent permitted by law.
          </p>

          <h3
            id="termination"
            className="font-serif text-xl sm:text-2xl font-bold text-[#7b1f14] mb-4 scroll-mt-32"
          >
            Termination of Access
          </h3>

          <p className="mb-10 text-sm sm:text-base">
            We reserve the right to suspend or terminate access to our services
            without prior notice if these terms are violated.
          </p>

          <h3
            id="law"
            className="font-serif text-xl sm:text-2xl font-bold text-[#7b1f14] mb-2 scroll-mt-32"
          >
            Governing Law
          </h3>

          <div className="pt-5">
            <p className="text-sm sm:text-base text-[#7b5a4c]">
              These Terms & Conditions shall be governed and interpreted in
              accordance with the laws of the applicable jurisdiction. Continued
              use of the services signifies acceptance of these terms.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
