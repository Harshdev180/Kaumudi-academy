import { MapPin, Landmark, GraduationCap, Facebook, Youtube, Instagram } from "lucide-react";

export default function Contact() {
  return (
    <>
      {/* MAIN CONTACT SECTION */}
      <section className="w-full bg-[#f1e4c8] py-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* HEADER */}
          <div className="mb-14">
            <h1 className=" font-serif text-6xl font-bold text-[#7b2d1f] mb-3">
              Contact & Location Details
            </h1>
            <p className="max-w-3xl text-black/80 leading-relaxed">
              Connect with Kaumudi Sanskrit Academy for scholarly inquiries, admissions,
              and comprehensive support in your Vedic learning journey.
            </p>
          </div>

          {/* FORM + MAP (EQUAL HEIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-stretch">

            {/* LEFT — CONTACT FORM */}
            <div className="bg-[#fffbec] rounded-3xl border border-[#7b2d1f] p-8 h-full">
              <h2 className="text-[#7b2d1f] font-bold mb-6 text-2xl">
                Send us a Message
              </h2>

              <form className="space-y-5">
                {[
                  { label: "FULL NAME", placeholder: "Enter your full name" },
                  { label: "EMAIL ADDRESS", placeholder: "yourname@email.com" },
                  { label: "SUBJECT", placeholder: "Course inquiry, support, etc." }
                ].map((item, i) => (
                  <div key={i}>
                    <label className="block text-xs font-bold text-[#7b2d1f] mb-1">
                      {item.label}
                    </label>
                    <input
                      type="text"
                      placeholder={item.placeholder}
                      className="w-full rounded-md border border-[#dcc7a1] px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7b2d1f]"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold text-[#7b2d1f] mb-1">
                    MESSAGE
                  </label>
                  <textarea
                    rows="5"
                    placeholder="Write your message here..."
                    className="w-full rounded-md border border-[#dcc7a1] px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7b2d1f]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#7b2d1f] text-white py-3 rounded-md font-semibold hover:bg-[#682418] transition"
                >
                  ➤ Send Message
                </button>
              </form>
            </div>

            {/* RIGHT — MAP */}
            <div className="bg-white rounded-2xl border border-[#7b2d1f] p-5 h-full flex flex-col">
              <h3 className="flex items-center gap-2 text-[#7b2d1f] font-bold mb-1 text-2xl">
                <MapPin size={22} className="text-[#7b2d1f]" />
                Main Campus Office
              </h3>

              <p className="text-sm text-black/70 mb-4 leading-relaxed">
                108 Vidya Vihar, Sanskrit Marg,<br />
                Varanasi, Uttar Pradesh 221001, India
              </p>

              <iframe
                title="Kaumudi Academy Map"
                src="https://www.google.com/maps?q=Varanasi%20Uttar%20Pradesh&output=embed"
                className="w-full flex-1 rounded-lg border"
                loading="lazy"
              />
            </div>

          </div>

          {/* INFO CARDS */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl ml-0">

            <div className="bg-[#ead9b8] border border-[#7b2d1f] rounded-xl p-4">
              <Landmark size={27} className="text-[#7b2d1f] mb-4 " />
              <h4 className="text-[#7b2d1f] font-bold mb-2 text-2xl">
                Institutional Inquiries
              </h4>
              <p className="text-sm text-[#7b2d1f]/80 mb-3">
                For university partnerships and academic collaborations.
              </p>
              <p className="text-sm font-bold text-[#7b2d1f]">
                admin@kaumudi.edu
              </p>
            </div>

            <div className="bg-[#ead9b8] border border-[#7b2d1f] rounded-xl p-4">
              <GraduationCap size={27} className="text-[#7b2d1f] mb-4" />
              <h4 className="text-[#7b2d1f] font-bold mb-2 text-2xl">
                Student Support
              </h4>
              <p className="text-sm text-[#7b2d1f]/80 mb-3">
                Technical issues, course access, and certification help.
              </p>
              <p className="text-sm font-bold text-[#7b2d1f]">
                Mon–Fri, 9am–6pm IST
              </p>
            </div>

          </div>

          {/* FOLLOW US */}
          <div className="flex items-center gap-4 mt-10">
            <p className="text-xs tracking-widest text-[#7b2d1f] font-bold">
              FOLLOW US
            </p>

            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-[#7b2d1f] text-white flex items-center justify-center hover:scale-105 transition">
                <Facebook size={16} />
              </div>
              <div className="h-8 w-8 rounded-full bg-[#7b2d1f] text-white flex items-center justify-center hover:scale-105 transition">
                <Youtube size={16} />
              </div>
              <div className="h-8 w-8 rounded-full bg-[#7b2d1f] text-white flex items-center justify-center hover:scale-105 transition">
                <Instagram size={16} />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER TOP */}
      <div className="w-full bg-[#f2e8c8] border-t border-[#e1cfac]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-14">

            <div>
              <p className="text-s tracking-[0.2em] text-[#7b2d1f] mb-4 uppercase font-bold">
                Contact
              </p>
              <p className="text-sm text-[#2b2b2b] mb-2 font-bold">
                +91 542 236 7890
              </p>
              <p className="text-sm text-[#2b2b2b] font-bold">
                info@kaumudi.edu.in
              </p>
            </div>

            <div>
              <p className=" text-s tracking-[0.2em] text-[#7b2d1f] mb-4 uppercase font-bold">
                Office Hours
              </p>
              <p className="text-sm text-[#2b2b2b] mb-2 font-bold">
                Monday – Friday
              </p>
              <p className="text-sm text-[#2b2b2b] font-bold">
                09:00 AM – 06:00 PM IST
              </p>
            </div>

            <div>
              <p className=" text-s tracking-[0.2em] text-[#7b2d1f] mb-4 uppercase font-bold">
                Affiliations
              </p>
              <p className="text-sm text-[#2b2b2b] mb-2 font-bold">
                University Grants Commission (UGC)
              </p>
              <p className="text-sm text-[#2b2b2b] font-bold">
                Central Sanskrit University
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER BOTTOM — LAST ELEMENT */}
      <div className="w-full bg-[#7b2d1f] m-0 p-0">
        <div className="max-w-7xl mx-auto px-6 py-9">
          <p className="text-center text-l text-[#f2e8c8] tracking-wide">
            © {new Date().getFullYear()} Kaumudi Sanskrit Academy. All Rights Reserved.
            Preserving Knowledge, Shaping Futures.
          </p>
        </div>
      </div>
    </>
  );
}
