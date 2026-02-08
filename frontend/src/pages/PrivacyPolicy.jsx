import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <section className="bg-[#f1e4c8] min-h-screen">
      {/* HERO SECTION */}

      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-[280px] w-full max-w-7xl bg-cover bg-center overflow-hidden rounded-3xl"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/1200x/19/6c/f4/196cf4706012f8407a08c0cf7db51339.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm tracking-wide opacity-90">
              How We Collect, Use, and Protect Your Information
            </p>
          </div>
        </motion.div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        {/* TABLE OF CONTENTS */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#fff9e9] rounded-2xl p-6 h-fit sticky top-24 shadow-lg"
        >
          <h3 className="font-serif font-bold text-[#7b2d1f] mb-2 text-2xl">
            Table of Contents
          </h3>

          {/* UNDERLINE — ONLY ADDITION */}
          <div className="w-14 h-[2px] bg-[#d6b25e] mb-4"></div>

          <ul className="space-y-1 text-s text-[#6b4b3e]">
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

                    hover:bg-[#7b2d1f]/10
                    hover:text-[#7b2d1f]
                    hover:border-[#7b2d1f]
                  "
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.aside>

        {/* POLICY CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#fff9e9] rounded-3xl shadow-xl p-10 lg:p-14 text-[#6b4b3e] leading-relaxed"
        >
          {/* INTRODUCTION */}
          <h2
            id="introduction"
            className="font-serif text-3xl font-bold text-[#7b2d1f] mb-4 scroll-mt-32"
          >
            Welcome to our privacy policy!
          </h2>

          <p className="mb-10">
            At Curely, we take your privacy seriously. This policy outlines how
            we collect, use, and protect your personal information when you
            interact with our website or services. By using our platform, you
            agree to the terms described here.
          </p>

          {/* DATA COLLECTION */}
          <h3
            id="data-collection"
            className="font-serif text-2xl font-bold text-[#7b1f14] mb-4 scroll-mt-32"
          >
            Data Collection
          </h3>

          <p className="font-semibold mb-2">
            1. Information You Provide Directly
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Name, email, and contact information</li>
            <li>Feedback and form submissions</li>
            <li>Preferences shared during communication</li>
          </ul>

          <p className="font-semibold mb-2">
            2. Automatically Collected Information
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>IP address, browser type, and usage data</li>
            <li>Cookies and tracking technologies</li>
          </ul>

          <p className="font-semibold mb-2">3. Third-Party Sources</p>
          <ul className="list-disc pl-6 mb-10">
            <li>Social media interactions</li>
            <li>External service providers</li>
          </ul>

          {/* USE OF DATA */}
          <h3
            id="use-of-data"
            className="font-serif text-2xl font-bold text-[#7b1f14] mb-4 scroll-mt-32"
          >
            Use of Data
          </h3>

          <ul className="list-disc pl-6 mb-10">
            <li>Providing and improving services</li>
            <li>User communication and support</li>
            <li>Legal and security compliance</li>
          </ul>

          {/* CHILDREN */}
          <h3
            id="children-info"
            className="font-serif text-2xl font-bold text-[#7b1f14] mb-4 scroll-mt-32"
          >
            Children’s Information
          </h3>

          <p className="mb-10">
            Our services are not intended for children under the age of 13. Any
            data collected unintentionally will be deleted promptly.
          </p>

          {/* CONTACT */}
          <h3
            id="contact-info"
            className="font-serif text-2xl font-bold text-[#7b1f14] mb-2 scroll-mt-32"
          >
            Contact Information
          </h3>

          <div className="pt-5  border-[#d6b25e]">
            <p className="text-sm text-[#7b5a4c]">
              If you have any questions regarding this Privacy Policy, please
              contact our support team. Continued use of our services indicates
              acceptance of these terms.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
