import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Mail,
  Ticket,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

function StatsGrid() {
  const stats = [
    {
      title: "TOTAL COURSES",
      value: "42",
      change: "+5%",
      trend: "up",
      icon: BookOpen,
      color: "from-[#b8973d] to-[#d4af37]",
      bgColor: "bg-[#FBF4E2]",
      textColor: "text-[#b8973d]",
    },
    {
      title: "ACTIVE STUDENTS",
      value: "1,280",
      change: "-2%",
      trend: "down",
      icon: Users,
      color: "from-[#6b1d14] to-[#8a2a1f]",
      bgColor: "bg-[#6b1d14]/5",
      textColor: "text-[#6b1d14]",
    },
    {
      title: "COUPONS REDEEMED",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: Ticket,
      color: "from-[#b8973d] to-[#d4af37]",
      bgColor: "bg-[#FBF4E2]",
      textColor: "text-[#b8973d]",
    },
    {
      title: "NEW INQUIRIES",
      value: "12",
      change: "PENDING",
      trend: "neutral",
      icon: Mail,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <motion.div
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.12 },
        },
      }}
      initial="hidden"
      animate="visible"
      className="relative z-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {stats.map((stat, index) => (
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
                {stat.title}
              </p>

              <p className="text-3xl font-bold text-slate-800 mb-4">
                {stat.value}
              </p>

              <div className="flex items-center space-x-2">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : stat.trend === "down" ? (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                ) : null}

                <span
                  className={`text-sm font-semibold ${stat.trend === "up"
                      ? "text-emerald-500"
                      : stat.trend === "down"
                        ? "text-red-500"
                        : "text-slate-400"
                    }`}
                >
                  {stat.change}
                </span>

                <span className="text-sm text-slate-500">vs last month</span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`p-3 rounded-xl ${stat.bgColor}`}
            >
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width:
                  stat.trend === "up"
                    ? "75%"
                    : stat.trend === "down"
                      ? "45%"
                      : "60%",
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default StatsGrid;
