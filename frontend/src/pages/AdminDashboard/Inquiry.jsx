import { motion } from "framer-motion";

export default function Inquiry() {
    const d = new Date();
    return (
        <div className="min-h-screen bg-[#f1e4c8] text-[#2b1d1b] font-sans">

            {/* Hero */}
            <section className="text-center py-16 px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold text-[#641e16]"
                >
                    Begin Your Journey with Kaumudi
                </motion.h2>
                <p className="mt-4 max-w-2xl mx-auto text-[#5f4b48]">
                    Connecting seekers with the wisdom of Sanskrit learning. Fill the form and our scholars will reach out to you.
                </p>
            </section>

            {/* Content */}
            <section className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-10">

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="lg:col-span-7 bg-white/30 rounded-xl shadow-xl p-8"
                >
                    <h3 className="text-2xl font-bold mb-6">Admissions Inquiry</h3>
                    <form className="grid gap-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <input className="border-b p-3 outline-none" placeholder="Full Name" />
                            <input className="border-b p-3 outline-none" placeholder="WhatsApp Number" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <input className="border-b p-3 outline-none" placeholder="Email Address" />
                            <select className="border-b p-3 outline-none">
                                <option>Interested Course</option>
                                <option>Sanskrit for Beginners</option>
                                <option>Vedic Studies</option>
                                <option>Classical Literature</option>
                            </select>
                        </div>
                        <textarea className="border-b p-3 outline-none" rows="4" placeholder="Your Learning Goals" />
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-[#641e16] text-white py-3 rounded-lg font-semibold"
                        >
                            Send Inquiry
                        </motion.button>
                    </form>
                </motion.div>

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="lg:col-span-5 space-y-6"
                >
                    <div className="bg-white/30 backdrop-blur p-6 rounded-xl">
                        <h4 className="text-xl font-bold text-[#641e16] mb-4">Academy Info</h4>
                        <p><b>Varanasi Campus</b><br />RSF, Pataudi, Gurgaon, Haryana 122503</p>
                        <p className="mt-3"><b>Email:</b> acharya@kaumudi.edu.in</p>
                        <p className="mt-3"><b>Hours:</b> Mon–Sat, 08:00–18:00</p>
                    </div>

                    <div className="bg-[#641e16] text-white p-6 rounded-xl">
                        <h4 className="text-xl font-bold">Need Instant Help?</h4>
                        <p className="text-sm mt-2">Connect with our admissions counselor on WhatsApp.</p>
                        <button className="mt-4 w-full bg-white text-[#641e16] py-2 rounded-lg font-semibold">Talk to a Scholar</button>
                    </div>
                </motion.div>
            </section>

            {/* Map */}
            <section className="max-w-6xl mx-auto px-6 mt-20">
                <div className="h-72 bg-gray-300 rounded-xl flex items-center justify-center">
                    <span className="bg-white px-6 py-3 rounded-full font-semibold">VISIT OUR ACADEMY</span>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-16 border-t border-[#D1B062]/40 py-8 text-center text-sm text-[#5f4b48]">
                © {d.getFullYear()} Kaumudi Sanskrit Academy. All rights reserved.
            </footer>
        </div>
    );
}
