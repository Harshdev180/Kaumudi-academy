import React, { useEffect, useState } from 'react'
import { getAllEnrollments, getAllCoursesForAdmin } from '../../lib/api'

function ActivityFeed() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                const [enrollRes, coursesRes] = await Promise.all([
                    getAllEnrollments(),
                    getAllCoursesForAdmin()
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
                        ? `${student.firstName || ""} ${student.lastName || ""}`.trim() || student.email || "Student"
                        : "Student";
                    return {
                        id: enrollment._id,
                        title: "New Enrollment",
                        description: `${name} enrolled in ${course?.title || "a course"}`,
                        time: enrollment.enrolledAt || enrollment.createdAt
                    };
                });

                const courseActivities = courses.map((course) => ({
                    id: course._id,
                    title: "Course Updated",
                    description: `${course.title || "Course"} updated`,
                    time: course.updatedAt || course.createdAt
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
        <div className='bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 '>
            <div className='p-6 border-b border-slate-200/50'>
                <div>
                    <h3 className='text-lg font-bold text-[#6b1d14]'>Activity Feed</h3>
                    <p className='text-sm text-slate-500'>Recent System Activities</p>
                </div>
                <button className='text-[#6b1d14]/60 hover:text-[#6b1d14]/80'>
                    View All
                </button>
            </div>
            <div className='p-6'>
                <div className='space-y-4'>
                    {loading && (
                        <div className='text-sm text-slate-500'>Loading activity...</div>
                    )}
                    {!loading && activities.length === 0 && (
                        <div className='text-sm text-slate-500'>No recent activity.</div>
                    )}
                    {!loading && activities.map((activity) => (
                        <div key={activity.id} className='flex items-start space-x-4 rounded-xl hover-bg -slate-50 transition-colors'>
                            <div className='w-2 h-2 rounded-full bg-[#D4AF37] mt-2'></div>
                            <div className='flex-1 min-w-0'>
                                <h4 className='text-sm font-semibold text-slate-800'>{activity.title}</h4>
                                <p className='text-sm text-slate-600 truncate'>{activity.description}</p>
                                <div className='flex items-center-safe space-x-1 mt-1'>
                                    <span className='text-xs text-slate-500'>
                                        {new Date(activity.time).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default ActivityFeed
