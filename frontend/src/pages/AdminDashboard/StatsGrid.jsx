// StatsGrid.jsx
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Mail,
  Ticket,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const STAT_CONFIG = [
  {
    key: "totalCourses",
    title: "TOTAL COURSES",
    icon: BookOpen,
    color: "from-[#b8973d] to-[#d4af37]",
    bgColor: "bg-[#FBF4E2]",
    textColor: "text-[#b8973d]",
  },
  {
    key: "activeStudents",
    title: "ACTIVE STUDENTS",
    icon: Users,
    color: "from-[#6b1d14] to-[#8a2a1f]",
    bgColor: "bg-[#6b1d14]/5",
    textColor: "text-[#6b1d14]",
  },
  {
    key: "couponsRedeemed",
    title: "COUPONS REDEEMED",
    icon: Ticket,
    color: "from-[#b8973d] to-[#d4af37]",
    bgColor: "bg-[#FBF4E2]",
    textColor: "text-[#b8973d]",
  },
  {
    key: "newInquiries",
    title: "NEW INQUIRIES",
    icon: Mail,
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
];

function StatsGrid({ stats }) {
  return (
    <motion.div
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {STAT_CONFIG.map((config, index) => {
        const stat = stats?.[config.key];
        const value = stat?.value ?? "—";
        const change = stat?.change ?? "—";
        const trend = stat?.trend ?? "neutral";

        return (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -6 }}
            className="relative z-0 bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 hover:shadow-xl hover:shadow-slate-200/20 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-400 mb-2">
                  {config.title}
                </p>

                <p className="text-3xl font-bold text-slate-800 mb-4">
                  {value}
                </p>

                <div className="flex items-center space-x-2">
                  {/* {trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  ) : trend === "down" ? (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  ) : null} */}

                  {/* <span
                    className={`text-sm font-semibold ${
                      trend === "up"
                        ? "text-emerald-500"
                        : trend === "down"
                          ? "text-red-500"
                          : "text-slate-400"
                    }`}
                  >
                    {change}
                  </span> */}

                  {/* <span className="text-sm text-slate-500">vs last month</span> */}
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`p-3 rounded-xl ${config.bgColor}`}
              >
                <config.icon className={`w-6 h-6 ${config.textColor}`} />
              </motion.div>
            </div>

            {/* Progress bar */}
            {/* <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width:
                    trend === "up" ? "75%" : trend === "down" ? "45%" : "60%",
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${config.color} rounded-full`}
              />
            </div> */}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default StatsGrid;
