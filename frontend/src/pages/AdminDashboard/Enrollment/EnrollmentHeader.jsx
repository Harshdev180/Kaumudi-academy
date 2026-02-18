import { motion } from "framer-motion";
import { MdDownload } from "react-icons/md";

function EnrollmentHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className=" relative overflow-hidden rounded-3xl px-6 md:px-10 py-10 text-white shadow-lg
      "
            style={{
                background:
                    "linear-gradient(135deg,#7a1f16 0%, #8c2a1e 45%, #6b1d14 100%)",
            }}
        >
            {/* texture overlay */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,#D4AF37,transparent_60%)]" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                {/* LEFT */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                        Student Fees
                    </h1>

                    <p className="text-sm text-white/80 mt-1">
                        Manage student Fees payments
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export default EnrollmentHeader;
