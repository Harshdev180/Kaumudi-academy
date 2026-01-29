import "./App.css";

// React Router
import { Route, Routes, Navigate } from "react-router-dom";

// Pages
import Dashboard from "./pages/AdminDashboard/Dashboard";
import AdminLayout from "./pages/AdminDashboard/AdminLayout";
import LeadManagement from "./pages/AdminDashboard/LeadManagement";
import AdminLogin from "./pages/AdminDashboard/AdminLogin";
import CourseManagement from "./pages/AdminDashboard/CourseManagement";
import AllCoursesPage from "./pages/CourseListing";
import CourseDetail from "./pages/CourseDetail";
import Home from "./pages/Home";

// Auth
import Signup from "./component/Auth/signup";
import Signin from "./component/Auth/login";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/allcourses" element={<AllCoursesPage />} />
      <Route path="/coursedetail" element={<CourseDetail />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Signin />} />
      <Route path="/" element={<Home />} />

      {/* Redirect Example */}
      {/* <Route path="/" element={<Navigate to="/allcourses" />} /> */}

      {/* Admin Routes */}
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

      <Route path="/admin/login" element={<AdminLogin />} />
    </Routes>
  );
}

export default App;
