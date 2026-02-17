import React, { useMemo, useState } from "react";
import StudentHeader from "./StudentHeader";
import StudentStats from "./StudentStats";
import StudentFilters from "./StudentFilters";
import StudentCard from "./StudentCards";
import AddStudentDrawer from "./AddStudentDrawer";

const StudentManagement = () => {

    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    // ================= STUDENT DATA =================
    const [students, setStudents] = useState([
        {
            id: 1,
            name: "Rahul Sharma",
            course: "Paninian Grammar Basics",
            mode: "ONLINE",
            status: "Active",
            payment: "Paid",
            image: ""
        },
        {
            id: 2,
            name: "Priya Verma",
            course: "Advanced Kavya Study",
            mode: "HYBRID",
            status: "Pending",
            payment: "Pending",
            image: ""
        }
    ]);

    const filteredStudents = useMemo(() => {
        return students.filter(st => {

            const matchSearch =
                st.name.toLowerCase().includes(search.toLowerCase()) ||
                st.course.toLowerCase().includes(search.toLowerCase());

            const matchFilter =
                filter === "All" ||
                st.status === filter;

            return matchSearch && matchFilter;
        });
    }, [students, search, filter]);


    // ================= UI STATES =================
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        course: "",
        mode: "ONLINE",
        status: "Active",
        payment: "Pending",
        image: ""
    });

    // ================= ADD / UPDATE =================
    const saveStudent = (e) => {
        e.preventDefault();

        if (editId) {
            // 🔥 UPDATE EXISTING
            setStudents(prev =>
                prev.map(st =>
                    st.id === editId ? { ...st, ...form } : st
                )
            );
        } else {
            // 🔥 ADD NEW
            setStudents(prev => [
                { ...form, id: Date.now() },
                ...prev
            ]);
        }

        // RESET STATES
        setEditId(null);
        setForm({
            name: "",
            course: "",
            mode: "ONLINE",
            status: "Active",
            payment: "Pending",
            image: ""
        });
        setDrawerOpen(false);
    };

    // ================= EDIT =================
    const openEdit = (student) => {
        setEditId(student.id);
        setForm(student);
        setDrawerOpen(true);
    };

    // ================= DELETE =================
    const deleteStudent = (id) => {
        setStudents(prev => prev.filter(st => st.id !== id));
    };

    const toggleStatus = (id) => {
        setStudents(prev =>
            prev.map(st =>
                st.id === id
                    ? {
                        ...st,
                        status: st.status === "Active" ? "Inactive" : "Active"
                    }
                    : st
            )
        );
    };


    // ================= OPEN ADD =================
    const openAdd = () => {
        setEditId(null);
        setForm({
            name: "",
            course: "",
            mode: "ONLINE",
            status: "Active",
            payment: "Pending",
            image: ""
        });
        setDrawerOpen(true);
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


            {/* STUDENT GRID */}
            <div className="grid md:grid-cols-3 gap-6">
                {filteredStudents.map(st => (
                    <StudentCard
                        key={st.id}
                        student={st}
                        onEdit={() => openEdit(st)}
                        onDelete={() => deleteStudent(st.id)}
                        onToggleStatus={() => toggleStatus(st.id)}
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
            />

        </main>
    );
};

export default StudentManagement;
