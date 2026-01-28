import { useState } from "react";
import "./App.css";
// import Sidebar, { SidebarItem } from "./pages/AdminDashboard/Sidebar";
import { BrowserRouter as Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/AdminDashboard/Dashboard";
import AdminLayout from "./pages/AdminDashboard/AdminLayout";
import LeadManagement from "./pages/AdminDashboard/LeadManagement";
import AdminLogin from "./pages/AdminDashboard/AdminLogin";
import CourseManagement from "./pages/AdminDashboard/CourseManagement";

// import Sidebar, { SidebarItem } from "./pages/AdminDashboard/Sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AllCoursesPage from "./pages/CourseListing";
import CourseDetailPage from "./pages/CourseDetail";

function App() {
  return (
    <Routes>
      <Route path="/allcourses" element={<AllCoursesPage />} />
      <Route path="/course/:id" element={<CourseDetailPage />} />

      {/* <Route path='/' element={<Navigate to='/dashboard' />} /> */}

      <Route
        path="/admin/dashboard"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/lead"
        element={
          <AdminLayout>
            <LeadManagement />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <AdminLayout>
            <CourseManagement />
          </AdminLayout>
        }
      />
      <Route path="/login" element={<AdminLogin />} />
    </Routes>
  );
}

export default App;
