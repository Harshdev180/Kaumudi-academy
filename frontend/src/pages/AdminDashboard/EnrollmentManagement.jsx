import React, { useState, useMemo } from "react";
import EnrollmentHeader from "./Enrollment/EnrollmentHeader";
import EnrollmentFilters from "./Enrollment/EnrollmentFilters";
import EnrollmentStats from "./Enrollment/EnrollmentStats";
import EnrollmentTable from "./Enrollment/EnrollmentTable";
import EnrollmentViewDrawer from "./Enrollment/EnrollmentViewDrawer";
import EnrollmentEditDrawer from "./Enrollment/EnrollmentEditDrawer";



export default function EnrollmentManagement() {


    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All Status");

    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [course, setCourse] = useState("All Courses");
    const [dateRange, setDateRange] = useState("Select Date Range");



    const [enrollments, setEnrollments] = useState([
        {
            id: 1,
            name: "Rahul Sharma",
            email: "Anount on guda",
            course: "Shlok Recitation",
            price: 1200,
            payment: "Paid",
            date: "12 Jan, 2026",
            time: "10:45 AM"
        },
        {
            id: 2,
            name: "Priya Verma",
            email: "Aumratiyam",
            course: "Kavya Basics",
            price: 900,
            payment: "Pending",
            date: "15 Jan, 2026",
            time: "02:30 PM"
        }
    ]);

    /* ================= ACTION HANDLERS ================= */

    const handleView = (row) => {
        setSelectedRow(row);
        setViewOpen(true);
    };

    const handleEdit = (row) => {
        setSelectedRow(row);
        setEditOpen(true);
    };

    const markPaid = (id) => {
        setEnrollments(prev =>
            prev.map(e =>
                e.id === id ? { ...e, payment: "Paid" } : e
            )
        );
    };

    const filtered = useMemo(() => {

        return enrollments.filter(e => {

            /* SEARCH FILTER */
            const matchSearch =
                e.name.toLowerCase().includes(search.toLowerCase());

            /* STATUS FILTER */
            const matchStatus =
                status === "All Status" || e.payment === status;

            /* COURSE FILTER */
            const matchCourse =
                course === "All Courses" || e.course === course;

            /* DATE RANGE FILTER */
            let matchDate = true;

            if (dateRange !== "Select Date Range") {

                const today = new Date();
                const enrollmentDate = new Date(e.rawDate);
                // IMPORTANT: rawDate backend se ISO date hona chahiye

                if (dateRange === "Today") {
                    matchDate =
                        enrollmentDate.toDateString() === today.toDateString();
                }

                if (dateRange === "This Week") {
                    const weekAgo = new Date();
                    weekAgo.setDate(today.getDate() - 7);
                    matchDate = enrollmentDate >= weekAgo;
                }

                if (dateRange === "This Month") {
                    matchDate =
                        enrollmentDate.getMonth() === today.getMonth() &&
                        enrollmentDate.getFullYear() === today.getFullYear();
                }
            }

            return matchSearch && matchStatus && matchCourse && matchDate;

        });

    }, [search, status, course, dateRange, enrollments]);


    return (
        <main className="space-y-8">

            <EnrollmentHeader />

            <EnrollmentStats enrollments={enrollments} />

            <EnrollmentFilters
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
                course={course}
                setCourse={setCourse}
                dateRange={dateRange}
                setDateRange={setDateRange}
            />

            {/* ⭐ TABLE */}
            <EnrollmentTable
                enrollments={filtered}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={(id) =>
                    setEnrollments(prev => prev.filter(e => e.id !== id))
                }
                onMarkPaid={markPaid}
            />

            {/* ================= STEP 4 DRAWERS ================= */}

            <EnrollmentViewDrawer
                open={viewOpen}
                onClose={() => setViewOpen(false)}
                data={selectedRow}
            />

            <EnrollmentEditDrawer
                open={editOpen}
                onClose={() => setEditOpen(false)}
                form={selectedRow}
                setForm={setSelectedRow}
                onSave={() => {
                    setEnrollments(prev =>
                        prev.map(r =>
                            r.id === selectedRow.id ? selectedRow : r
                        )
                    );
                    setEditOpen(false);
                }}
            />

        </main>
    );
}
