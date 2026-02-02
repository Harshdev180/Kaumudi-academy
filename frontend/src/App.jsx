
import "./App.css";

// React Router
import { Route, Routes } from "react-router-dom";

// Pages
import Dashboard from "./pages/AdminDashboard/Dashboard";
import AdminLayout from "./pages/AdminDashboard/AdminLayout";
import LeadManagement from "./pages/AdminDashboard/LeadManagement";
import AdminLogin from "./pages/AdminDashboard/AdminLogin";
import CourseManagement from "./pages/AdminDashboard/CourseManagement";
import AllCoursesPage from "./pages/CourseListing";
import CourseDetail from "./pages/CourseDetail";

// Auth
import Signup from "./component/Auth/signup";
import Signin from "./component/Auth/login";
import Home from "./pages/Homepage/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* ---------------- Public Routes ---------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/allcourses" element={<AllCoursesPage />} />
        <Route path="/coursedetail" element={<CourseDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signin />} />

        {/* ---------------- Admin Routes ---------------- */}
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
      <Footer />
    </>
  );
}

export default App;
