import { motion } from "framer-motion";
import SEO from "../components/SEO";
import home2 from "../assets/home/home2.webp";

export default function TermsCondition() {
  return (
    <section className="bg-[#f1e4c8] min-h-screen py-10">
      <SEO
        title="Terms & Conditions | Kaumudi Sanskrit Academy"
        description="Review the terms and conditions for using Kaumudi Sanskrit Academy’s services."
        canonicalPath="/terms"
        og={{ type: "website" }}
      />
      {/* HERO SECTION */}
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-[280px] w-full max-w-7xl bg-cover bg-center overflow-hidden rounded-3xl"
          style={{
            backgroundImage:
              `url(${home2})`,
          }}
        >
          {/* <div className="absolute inset-0 bg-black/55" /> */}
          <div className="absolute inset-0 bg-[#7b2d1f]/60 pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
              Terms & Conditions
            </h1>
            <p className="text-sm tracking-wide opacity-90 font-bold">
              Please read these terms carefully before using our services
            </p>
          </div>
        </motion.div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        {/* TABLE OF CONTENTS */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#7b2d1f] rounded-2xl p-6 h-fit sticky top-24 shadow-lg"
        >
          <h3 className="font-serif font-bold text-[white] mb-2 text-2xl">
            Table of Contents
          </h3>

          {/* underline added */}
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

        {/* TERMS CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#f1e4c8] rounded-3xl p-10 lg:p-6 text-[#6b4b3e] leading-relaxed"
        >
          {/* ACCEPTANCE */}
          <h2
            id="acceptance"
            className="font-serif text-3xl font-bold text-[#7b2d1f] mb-4 scroll-mt-32"
          >
            Acceptance of Terms
          </h2>

          <p className="mb-10">
            By accessing or using Curely’s website, applications, or services,
            you agree to be bound by these Terms & Conditions. If you do not
            agree, you must discontinue use immediately.
          </p>

          {/* USE OF SERVICES */}
          <h3
            id="use-of-services"
            className="font-serif text-2xl font-bold text-[#7b1f14] mb-4 scroll-mt-32"
          >
            Use of Services
          </h3>

          <ul className="list-disc pl-6 mb-10">
            <li>Services are provided for personal and lawful use only</li>
            <li>
              You must not misuse, disrupt, or attempt unauthorized access
            </li>
            <li>Accuracy of information provided is your responsibility</li>
          </ul>

          {/* RESPONSIBILITIES */}
          <h3
            id="responsibilities"
            className="font-serif text-2xl font-bold text-[#7b1f14] mb-4 scroll-mt-32"
          >
            User Responsibilities
          </h3>

          <p className="mb-6">
            Users agree to comply with all applicable laws and regulations while
            using the platform. Any activity that violates ethical, legal, or
            security standards is strictly prohibited.
          </p>

          {/* INTELLECTUAL PROPERTY */}
          <h3
            id="intellectual-property"
            className="font-serif text-2xl font-bold text-[#7b1f14] mb-4 scroll-mt-32"
          >
            Intellectual Property
          </h3>

          <p className="mb-10">
            All content, branding, logos, and materials available on this
            platform are the exclusive property of Curely and protected by
            intellectual property laws. Unauthorized reproduction is prohibited.
          </p>

          {/* LIABILITY */}
          <h3
            id="liability"
            className="font-serif text-2xl font-bold text-[#7b1f14] mb-4 scroll-mt-32"
          >
            Limitation of Liability
          </h3>

          <p className="mb-10">
            Curely shall not be liable for any direct, indirect, incidental, or
            consequential damages arising from the use or inability to use the
            platform, to the fullest extent permitted by law.
          </p>

          {/* TERMINATION */}
          <h3
            id="termination"
            className="font-serif text-2xl font-bold text-[#7b1f14] mb-4 scroll-mt-32"
          >
            Termination of Access
          </h3>

          <p className="mb-10">
            We reserve the right to suspend or terminate access to our services
            without prior notice if these terms are violated.
          </p>

          {/* GOVERNING LAW */}
          <h3
            id="law"
            className="font-serif text-2xl font-bold text-[#7b1f14] mb-2 scroll-mt-32"
          >
            Governing Law
          </h3>

          <div className=" border-[#d6b25e] pt-5">
            <p className="text-sm text-[#7b5a4c]">
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
