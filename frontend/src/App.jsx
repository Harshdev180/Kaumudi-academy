import "./App.css";
import { Route, Routes } from "react-router-dom";

// Pages
import Dashboard from "./pages/AdminDashboard/Dashboard";
import AdminLayout from "./pages/AdminDashboard/AdminLayout";
import LeadManagement from "./pages/AdminDashboard/LeadManagement";
import AdminLogin from "./pages/AdminDashboard/AdminLogin";
import CourseManagement from "./pages/AdminDashboard/CourseManagement";
import AllCoursesPage from "./pages/CourseListing";
import CourseDetail from "./pages/CourseDetail";
import Inquiry from "./pages/AdminDashboard/Inquiry";
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

        {/* ---------------- Admin Routes (Nested) ---------------- */}
        {/* Parent Route*/}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Default Page */}
          <Route index element={<Dashboard />} />

          {/* Primary Path: /admin/dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Inside Admin Pages */}
          <Route path="lead" element={<LeadManagement />} />
          <Route path="course" element={<CourseManagement />} />
          {/* <Route path="inquiry" element={<Inquiry />} /> */}
        </Route>

        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
