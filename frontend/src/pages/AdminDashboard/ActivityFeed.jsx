import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { getAllEnrollments, getAllCoursesForAdmin } from "../../lib/api";

/*
  👉 Future me tu inquiries backend se fetch karega.
  Filhaal demo data rakha hai.
*/

const recentInquiries = [
  {
    id: 1,
    name: "Rahul Sharma",
    course: "Paninian Grammar Basics",
    message: "Need details about online batch",
    time: "2 min ago",
  },
  {
    id: 2,
    name: "Anita Verma",
    course: "Advanced Kavya Study",
    message: "Is offline class available?",
    time: "10 min ago",
  },
];

function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ⭐ Only show latest 3
  const latest = recentInquiries.slice(0, 3);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const [enrollRes, coursesRes] = await Promise.all([
          getAllEnrollments(),
          getAllCoursesForAdmin(),
        ]);
        const enrollmentsPayload = enrollRes?.data ?? enrollRes;
        const enrollments = Array.isArray(enrollmentsPayload)
          ? enrollmentsPayload
          : enrollmentsPayload?.data || [];

        const coursesPayload = coursesRes?.data ?? coursesRes;
        const courses = Array.isArray(coursesPayload)
          ? coursesPayload
          : coursesPayload?.data || [];

        const enrollmentActivities = enrollments.map((enrollment) => {
          const student = enrollment.student;
          const course = enrollment.course;
          const name = student
            ? `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
              student.email ||
              "Student"
            : "Student";
          return {
            id: enrollment._id,
            title: "New Enrollment",
            description: `${name} enrolled in ${course?.title || "a course"}`,
            time: enrollment.enrolledAt || enrollment.createdAt,
          };
        });

        const courseActivities = courses.map((course) => ({
          id: course._id,
          title: "Course Updated",
          description: `${course.title || "Course"} updated`,
          time: course.updatedAt || course.createdAt,
        }));

        const merged = [...enrollmentActivities, ...courseActivities]
          .filter((item) => item.time)
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 5);

        setActivities(merged);
      } catch (error) {
        console.error("Failed to load activity feed:", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

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
          className="text-sm font-semibold text-[#6b1d14]/70 hover:text-[#6b1d14]"
        >
          View All →
        </button>
      </div>

      {/* LIST */}
      <div className="p-4 space-y-3">
        {latest.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate("/admin/student-inquiry")}
            className="flex items-start space-x-4 rounded-xl hover:bg-slate-50 p-3 transition cursor-pointer"
          >
            {/* ICON */}
            <div className="p-2 rounded-lg bg-[#6b1d14]/10 text-[#6b1d14]">
              <Mail size={16} />
            </div>

            {/* TEXT */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-800">
                {item.name} • {item.course}
              </h4>

              <p className="text-sm text-slate-600 truncate">{item.message}</p>

              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500">{item.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ActivityFeed;
