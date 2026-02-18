import { motion } from "framer-motion";
import {
    MdPeople,
    MdPayments,
    MdPendingActions,
    MdCurrencyRupee,
} from "react-icons/md";

function EnrollmentStats({ enrollments }) {

    const total = enrollments.length;
    const paid = enrollments.filter(e => e.payment === "Paid").length;
    const pending = enrollments.filter(e => e.payment === "Pending").length;

    const revenue = enrollments
        .filter(e => e.payment === "Paid")
        .reduce((sum, e) => sum + Number(e.price), 0);

    const cards = [
        {
            label: "Total Enrollments",
            value: total,
            icon: <MdPeople size={26} />,
            color: "text-[#6b1d14]"
        },
        {
            label: "Paid Students",
            value: paid,
            icon: <MdPayments size={26} />,
            color: "text-green-700"
        },
        {
            label: "Pending Payments",
            value: pending,
            icon: <MdPendingActions size={26} />,
            color: "text-[#C07A1C]"
        },
        {
            label: "Revenue Today",
            value: `₹${revenue.toLocaleString()}`,
            icon: <MdCurrencyRupee size={26} />,
            color: "text-[#6b1d14]"
        }
    ];

    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-14 relative z-10">

            {cards.map((card, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="
          bg-[#FBF4E2]
          border border-[#D1B062]/30
          rounded-2xl
          px-6 py-5
          shadow-md
          flex items-center justify-between
          "
                >
                    <div>
                        <p className="text-xs text-[#856966] font-semibold">
                            {card.label}
                        </p>

                        <h3 className={`text-2xl font-black mt-1 ${card.color}`}>
                            {card.value}
                        </h3>
                    </div>

                    {/* ICON BUBBLE */}
                    <div className="
          w-12 h-12
          rounded-full
          bg-[#EFE3D5]
          flex items-center justify-center
          text-[#C07A1C]
          ">
                        {card.icon}
                    </div>
                </motion.div>
            ))}

        </div>
    );
}

export default EnrollmentStats;
