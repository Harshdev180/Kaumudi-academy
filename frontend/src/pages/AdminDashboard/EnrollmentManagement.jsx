import React, { useState, useEffect, useMemo } from "react";
import EnrollmentHeader from "./Enrollment/EnrollmentHeader";
import EnrollmentFilters from "./Enrollment/EnrollmentFilters";
import EnrollmentStats from "./Enrollment/EnrollmentStats";
import EnrollmentTable from "./Enrollment/EnrollmentTable";
import EnrollmentViewDrawer from "./Enrollment/EnrollmentViewDrawer";
import EnrollmentEditDrawer from "./Enrollment/EnrollmentEditDrawer";
import { getAllStudentFees } from "../../lib/api";
import { markStudentFeeAsPaid } from "../../lib/api";

export default function EnrollmentManagement() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [course, setCourse] = useState("All Courses");
  const [dateRange, setDateRange] = useState("Select Date Range");

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= ACTION HANDLERS ================= */

  const handleView = (row) => {
    setSelectedRow(row);
    setViewOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditOpen(true);
  };

  const markPaid = async (id) => {
    try {
      await markStudentFeeAsPaid(id);

      setEnrollments((prev) =>
        prev.map((e) => (e.id === id ? { ...e, payment: "Paid" } : e)),
      );
    } catch (err) {
      console.error("Failed to mark paid");
    }
  };

  const filtered = useMemo(() => {
    return enrollments.filter((e) => {
      /* SEARCH FILTER */
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());

      /* STATUS FILTER */
      const matchStatus = status === "All Status" || e.payment === status;

      /* COURSE FILTER */
      const matchCourse = course === "All Courses" || e.course === course;

      /* DATE RANGE FILTER */
      let matchDate = true;

      if (dateRange !== "Select Date Range") {
        const today = new Date();
        const enrollmentDate = new Date(e.rawDate);
        // IMPORTANT: rawDate backend se ISO date hona chahiye

        if (dateRange === "Today") {
          matchDate = enrollmentDate.toDateString() === today.toDateString();
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

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        const response = await getAllStudentFees();
        console.log(response)
        const payload = response?.data?.data || [];

        const mapped = payload.map((item) => ({
          id: item._id,
          name: `${item.student?.firstName || ""} ${item.student?.lastName || ""}`,
          email: item.student?.email || "",
          course: item.course?.title || "",
          price: item.paidAmount,
          payment: item.paymentStatus === "PAID" ? "Paid" : "Pending",
          date: new Date(item.createdAt).toLocaleDateString("en-IN"),
          rawDate: item.createdAt,
        }));

        setEnrollments(mapped);
      } catch (err) {
        setError("Failed to load enrollments");
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

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
          setEnrollments((prev) => prev.filter((e) => e.id !== id))
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
          setEnrollments((prev) =>
            prev.map((r) => (r.id === selectedRow.id ? selectedRow : r)),
          );
          setEditOpen(false);
        }}
      />
    </main>
  );
}
