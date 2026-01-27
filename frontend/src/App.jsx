import { useState } from "react";
import "./App.css";
<<<<<<< HEAD
// import Sidebar, { SidebarItem } from "./pages/AdminDashboard/Sidebar";
import { BrowserRouter as Navigate, Route,  Routes } from "react-router-dom";
import Dashboard from "./pages/AdminDashboard/Dashboard";
import AdminLayout from "./pages/AdminDashboard/AdminLayout";
import LeadManagement from "./pages/AdminDashboard/LeadManagement";
import AdminLogin from "./pages/AdminDashboard/AdminLogin";

function App() {
  return (
    <>

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
      </Routes>



      {/* <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<LeadManagement />} />
        <Route path="/courses" element={<Courses />} />
      </Routes> */}
      {/* <LeadsPage /> */}
    </>
=======
import AllCoursesPage from "./pages/CourseListing";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />}> */}
        {/* <Route index element={<Home />} /> */}
        <Route path="/courselisting" element={<AllCoursesPage />} />

        {/* </Route> */}
      </Routes>
    </BrowserRouter>
>>>>>>> 6f702dec30365a6460be01740a880aafcb32e4ee
  );
}

export default App;
