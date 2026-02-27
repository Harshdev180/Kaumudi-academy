// ActivityFeed.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

function ActivityFeed({ inquiries = [] }) {
  const navigate = useNavigate();

  const latest = inquiries.slice(0, 3);

  const timeAgo = (dateStr) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  const statusDot = (status) => {
    switch (status) {
      case "NEW": return "bg-emerald-400";
      case "CONTACTED": return "bg-yellow-400";
      case "CLOSED": return "bg-slate-300";
      default: return "bg-slate-300";
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50">
      {/* HEADER */}
      <div className="p-6 border-b border-slate-200/50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#6b1d14]">Recent Inquiries</h3>
          <p className="text-sm text-slate-500">Latest student activity</p>
        </div>
        <button
          onClick={() => navigate("/admin/student-inquiry")}
          className="text-sm font-semibold text-[#6b1d14]/70 hover:text-[#6b1d14] transition-colors"
        >
          View All →
        </button>
      </div>

      {/* LIST */}
      <div className="p-4 space-y-3">
        {latest.length === 0 ? (
          <p className="text-sm text-center text-slate-400 py-6">
            No inquiries yet
          </p>
        ) : (
          latest.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate("/admin/student-inquiry")}
              className="flex items-start space-x-4 rounded-xl hover:bg-slate-50 p-3 transition cursor-pointer"
            >
              {/* ICON */}
              <div className="relative p-2 rounded-lg bg-[#6b1d14]/10 text-[#6b1d14] flex-shrink-0">
                <Mail size={16} />
                {/* Status dot */}
                <span
                  className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${statusDot(
                    item.status
                  )}`}
                />
              </div>

              {/* TEXT */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-800 truncate">
                  {item.name}
                  {item.course && (
                    <span className="text-slate-400 font-normal">
                      {" "}• {item.course}
                    </span>
                  )}
                </h4>

                <p className="text-sm text-slate-600 truncate">{item.message}</p>

                <div className="flex items-center space-x-1 mt-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    {timeAgo(item.time)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default ActivityFeed;