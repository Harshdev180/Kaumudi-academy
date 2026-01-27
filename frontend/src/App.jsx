import { useState } from "react";
import "./App.css";
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
  );
}

export default App;
