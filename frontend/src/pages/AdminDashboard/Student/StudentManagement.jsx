import React, { useEffect, useMemo, useState } from "react";
import StudentHeader from "./StudentHeader";
import StudentStats from "./StudentStats";
import StudentFilters from "./StudentFilters";
import StudentCard from "./StudentCards";
import AddStudentDrawer from "./AddStudentDrawer";
import {
    getAllStudentsForAdmin,
    createStudentByAdmin,
    updateStudentByAdmin,
    deleteStudentByAdmin,
    toggleStudentStatus,
    toggleStudentPayment,
    getAllCoursesForAdmin
} from "../../../lib/api";

const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    courseId: "",
    mode: "ONLINE",
    status: "Active",
    payment: "Pending",
    imageFile: null,
    imagePreview: ""
};

const StudentManagement = () => {

    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    // ================= DATA =================
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // ================= UI STATES =================
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(initialForm);

    const mapStudent = (item) => {
        const firstName = item?.firstName || "";
        const lastName = item?.lastName || "";
        const name = `${firstName} ${lastName}`.trim() || "Unnamed Student";
        const courseTitle = item?.course?.title || "";
        const courseId = item?.course?._id || item?.course || "";

        return {
            id: item?._id || item?.id,
            firstName,
            lastName,
            name,
            email: item?.email || "",
            phoneNumber: item?.phoneNumber || "",
            courseId,
            course: courseTitle || "-",
            mode: item?.mode || "ONLINE",
            status: item?.status === "INACTIVE" ? "Inactive" : "Active",
            payment: item?.paymentStatus === "PAID" ? "Paid" : "Pending",
            image: item?.image?.url || item?.image || ""
        };
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getAllStudentsForAdmin();
            const payload = response?.data ?? response;
            const list = payload?.data ?? payload ?? [];
            const mapped = Array.isArray(list) ? list.map(mapStudent) : [];
            setStudents(mapped);
        } catch (err) {
            console.error("Failed to load students:", err);
            setError("Failed to load students. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await getAllCoursesForAdmin();
            const payload = response?.data ?? response;
            const list = Array.isArray(payload) ? payload : payload?.data || [];
            const mapped = list.map(course => ({
                id: course?._id || course?.id,
                title: course?.title || "Untitled Course"
            }));
            setCourses(mapped);
        } catch (err) {
            console.error("Failed to load courses:", err);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchCourses();
    }, []);

    const filteredStudents = useMemo(() => {
        const term = search.trim().toLowerCase();
        return students.filter(st => {
            const matchSearch = !term || [
                st.name,
                st.email,
                st.phoneNumber,
                st.course
            ].some(val => (val || "").toLowerCase().includes(term));

            const matchFilter =
                filter === "All" ||
                st.status === filter;

            return matchSearch && matchFilter;
        });
    }, [students, search, filter]);

    // ================= CRUD =================
    const openAdd = () => {
        setEditId(null);
        setForm(initialForm);
        setDrawerOpen(true);
    };

    const openEdit = (student) => {
        setEditId(student.id);
        setForm({
            firstName: student.firstName || "",
            lastName: student.lastName || "",
            email: student.email || "",
            password: "",
            phoneNumber: student.phoneNumber || "",
            courseId: student.courseId || "",
            mode: student.mode || "ONLINE",
            status: student.status || "Active",
            payment: student.payment || "Pending",
            imageFile: null,
            imagePreview: student.image || ""
        });
        setDrawerOpen(true);
    };

    const buildPayload = (data, isEdit = false) => {
        const payload = new FormData();
        payload.append("firstName", data.firstName.trim());
        payload.append("lastName", data.lastName.trim());
        payload.append("email", data.email.trim());
        if (!isEdit || data.password.trim()) {
            payload.append("password", data.password.trim());
        }
        if (data.phoneNumber?.trim()) {
            payload.append("phoneNumber", data.phoneNumber.trim());
        }
        if (data.courseId) {
            payload.append("course", data.courseId);
        }
        payload.append("mode", data.mode);
        payload.append("status", data.status === "Inactive" ? "INACTIVE" : "ACTIVE");
        payload.append("paymentStatus", data.payment === "Paid" ? "PAID" : "PENDING");
        if (data.imageFile) {
            payload.append("image", data.imageFile);
        }
        return payload;
    };

    const saveStudent = async (e) => {
        e.preventDefault();

        if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
            alert("Please fill first name, last name, and email.");
            return;
        }
        if (!editId && !form.password.trim()) {
            alert("Password is required for new students.");
            return;
        }

        try {
            setSaving(true);
            const payload = buildPayload(form, !!editId);
            if (editId) {
                await updateStudentByAdmin(editId, payload);
            } else {
                await createStudentByAdmin(payload);
            }
            await fetchStudents();
            setDrawerOpen(false);
            setEditId(null);
            setForm(initialForm);
        } catch (err) {
            console.error("Failed to save student:", err);
            alert(err?.response?.data?.message || "Failed to save student.");
        } finally {
            setSaving(false);
        }
    };

    const deleteStudent = async (id) => {
        if (!window.confirm("Delete this student?")) return;
        try {
            await deleteStudentByAdmin(id);
            setStudents(prev => prev.filter(st => st.id !== id));
        } catch (err) {
            console.error("Failed to delete student:", err);
            alert("Failed to delete student.");
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await toggleStudentStatus(id);
            const nextStatus = response?.status || response?.data?.status;
            setStudents(prev =>
                prev.map(st =>
                    st.id === id
                        ? {
                            ...st,
                            status: nextStatus
                                ? (nextStatus === "INACTIVE" ? "Inactive" : "Active")
                                : (st.status === "Active" ? "Inactive" : "Active")
                        }
                        : st
                )
            );
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to update status.");
        }
    };

    const handleTogglePayment = async (id) => {
        try {
            const response = await toggleStudentPayment(id);
            const nextPayment = response?.paymentStatus || response?.data?.paymentStatus;
            setStudents(prev =>
                prev.map(st =>
                    st.id === id
                        ? {
                            ...st,
                            payment: nextPayment
                                ? (nextPayment === "PAID" ? "Paid" : "Pending")
                                : (st.payment === "Paid" ? "Pending" : "Paid")
                        }
                        : st
                )
            );
        } catch (err) {
            console.error("Failed to update payment:", err);
            alert("Failed to update payment.");
        }
    };

    // ================= UI =================
    return (
        <main className="min-h-screen bg-[#F3E6C9] p-8 space-y-8">

            {/* HEADER */}
            <StudentHeader openAdd={openAdd} />

            <StudentStats students={students} />

            <StudentFilters
                search={search}
                setSearch={setSearch}
                filter={filter}
                setFilter={setFilter}
            />

            {loading && (
                <div className="text-sm text-[#74271E]/70">Loading students...</div>
            )}
            {!loading && error && (
                <div className="text-sm text-red-600">{error}</div>
            )}
            {!loading && !error && filteredStudents.length === 0 && (
                <div className="text-sm text-[#74271E]/70">No students found.</div>
            )}

            {/* STUDENT GRID */}
            <div className="grid md:grid-cols-3 gap-6">
                {filteredStudents.map(st => (
                    <StudentCard
                        key={st.id}
                        student={st}
                        onEdit={() => openEdit(st)}
                        onDelete={() => deleteStudent(st.id)}
                        onToggleStatus={() => handleToggleStatus(st.id)}
                        onTogglePayment={() => handleTogglePayment(st.id)}
                    />

                ))}
            </div>

            {/* ADD / EDIT DRAWER */}
            <AddStudentDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                form={form}
                setForm={setForm}
                saveStudent={saveStudent}
                editId={editId}
                saving={saving}
                courses={courses}
            />

        </main>
    );
};

export default StudentManagement;
