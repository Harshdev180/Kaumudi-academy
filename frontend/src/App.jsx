import { useState } from "react";
import "./App.css";

// import Sidebar, { SidebarItem } from "./pages/AdminDashboard/Sidebar";
import { BrowserRouter as Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/AdminDashboard/Dashboard";
import AdminLayout from "./pages/AdminDashboard/AdminLayout";
import LeadManagement from "./pages/AdminDashboard/LeadManagement";
import AdminLogin from "./pages/AdminDashboard/AdminLogin";
import AllCoursesPage from "./pages/CourseListing"
import CourseDetailPage from "./pages/CourseDetail";


function App() {
  return (
    <>
      <div className="text-4xl text-red-600">Welcome</div>

      <Routes>
        {/* <Route path='/' element={<Navigate to='/dashboard' />} /> */}

        <Route path='/dashboard' element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        } />

        <Route path='/admin/lead' element={
          <AdminLayout>
            <LeadManagement />
          </AdminLayout>
        } />
        <Route path='/login' element={<AdminLogin />} />
        <Route path="/allcourses" element={<AllCoursesPage />} />
        <Route path="/course/:id" element={<CourseDetailPage />} />
      </Routes>

    </>
  );
}

export default App;
