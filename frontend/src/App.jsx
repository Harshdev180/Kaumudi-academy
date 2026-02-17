import "./App.css";
import { Route, Routes, Outlet } from "react-router-dom";
import Dashboard from "./pages/AdminDashboard/Dashboard";
import AdminLayout from "./pages/AdminDashboard/AdminLayout";
import LeadManagement from "./pages/AdminDashboard/LeadManagement";
import AdminLogin from "./pages/AdminDashboard/AdminLogin";
import CourseManagement from "./pages/AdminDashboard/CourseManagement";
import AllCoursesPage from "./pages/CourseListing";
import CourseDetail from "./pages/CourseDetailsUp";
import Inquiry from "./pages/AdminDashboard/Inquiry";
import Buy from "./pages/AdminDashboard/courseBuy";
// import Signup from "./component/Auth/signup";
// import Signin from "./component/Auth/login";
import Home from "./pages/Homepage/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import RequireAuth from "./components/RequireAuth";
import About from "./pages/About";
import FacultyPage from "./pages/FacultyPage";
import Contact from "./pages/Contact";

import Sign from "./component/Auth/loginSignup";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import CookiePolicy from "./pages/CookiePolicy.jsx";
import StudentProfile from "./pages/StudentProfile";
import AdminRegister from "./pages/AdminDashboard/AdminRegister.jsx";
import NotificationsPage from "./pages/AdminDashboard/NotificationPage.jsx";
import CouponPage from "./pages/AdminDashboard/CouponPage.jsx";
import AdminSettings from "./pages/AdminDashboard/AdminSettings.jsx";
import AdminStaffSalary from "./pages/AdminDashboard/AdminStaffSalary.jsx";
import StudentManagement from "./pages/AdminDashboard/Student/StudentManagement.jsx";

// Public site layout with shared navbar/footer
function PublicLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

// Simple 404 page (inline, no new file)
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1e4c8] px-6">
      <div className="text-center">
        <div className="text-[#7b2d1f] text-sm uppercase tracking-[0.35em] font-bold mb-3">
          Page Not Found
        </div>
        <h1 className="font-serif text-4xl text-[#7b2d1f] mb-4">404</h1>
        <p className="text-[#6b4b3e]">
          The page you’re looking for doesn’t exist.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public routes under shared layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/allcourses" element={<AllCoursesPage />} />
        <Route path="/coursedetail/:id" element={<CourseDetail />} />
        <Route path="/coursedetail" element={<CourseDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/inquiry" element={<Inquiry />} />
        <Route path="/courseBuy" element={<RequireAuth><Buy /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><StudentProfile /></RequireAuth>} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        
      </Route>

      {/* Auth routes without navbar/footer */}
      <Route path="/auth" element={<Sign />} />
      <Route path="/reset-password/:token" element={<Sign />} />

      {/* Admin nested routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="lead" element={<LeadManagement />} />
        <Route path="course" element={<CourseManagement />} />
        <Route path="coupon" element={<CouponPage />} />
        <Route path="/admin/staff-salary" element={<AdminStaffSalary />} />
        <Route path="/admin/student-management" element={<StudentManagement />} />
      </Route>

      {/* Admin login outside admin layout */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-register" element={<AdminRegister />} />
      <Route path="/admin/notifications" element={<NotificationsPage />} />
      <Route path="/admin/settings" element={<AdminSettings />} />


      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
