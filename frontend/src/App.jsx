// removed App.css to fix PostCSS import/parse issues
import { Route, Routes, Outlet, Navigate, useLocation } from "react-router-dom";

// ================= PUBLIC PAGES =================
import Home from "./pages/Homepage/Home";
import AllCoursesPage from "./pages/CourseListing";
import CourseDetail from "./pages/CourseDetailsUp";
import About from "./pages/About";
import FacultyPage from "./pages/FacultyPage";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import CookiePolicy from "./pages/CookiePolicy.jsx";

// ================= AUTH =================
import Sign from "./component/Auth/loginSignup";
import RequireAuth from "./components/RequireAuth";

// ================= LAYOUT COMPONENTS =================
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import SEO from "./components/SEO";
import logo from "./assets/logo-bgremove.webp";

// ================= ADMIN DASHBOARD =================
import AdminLayout from "./pages/AdminDashboard/AdminLayout";
import Dashboard from "./pages/AdminDashboard/Dashboard";
import LeadManagement from "./pages/AdminDashboard/LeadManagement";
import CourseManagement from "./pages/AdminDashboard/CourseManagement";
import Inquiry from "./pages/AdminDashboard/Inquiry";
import Buy from "./pages/AdminDashboard/courseBuy";
import AdminLogin from "./pages/AdminDashboard/AdminLogin";
import AdminRegister from "./pages/AdminDashboard/AdminRegister.jsx";
import NotificationsPage from "./pages/AdminDashboard/NotificationPage.jsx";
import CouponPage from "./pages/AdminDashboard/CouponPage.jsx";
import AdminSettings from "./pages/AdminDashboard/AdminSettings.jsx";
import AdminStaffSalary from "./pages/AdminDashboard/AdminStaffSalary.jsx";
import StudentManagement from "./pages/AdminDashboard/Student/StudentManagement.jsx";
import EnrollmentManagement from "./pages/AdminDashboard/EnrollmentManagement.jsx";
import InquiryManagement from "./pages/AdminDashboard/InquiryManagement.jsx";
import FacultyManagement from "./pages/AdminDashboard/FacultyManagement.jsx";
import Gallery from "./pages/AdminDashboard/Galary.jsx";

// ================= STUDENT DASHBOARD =================
import StudentLayout from "./pages/StudentProfile/Layout";
import StudentDashboard from "./pages/StudentProfile/Dashboard";
import StudentCourses from "./pages/StudentProfile/Courses";
import Certifications from "./pages/StudentProfile/Certifications.jsx";
import Profile from "./pages/StudentProfile/Profile";
import Settings from "./pages/StudentProfile/Settings";
import FeePurchase from "./pages/StudentProfile/Fees.jsx";
import Notifications from "./pages/StudentProfile/Notifications.jsx";
import Certificates from "./pages/StudentProfile/Certifications.jsx";

// Public site layout with shared navbar/footer
function PublicLayout() {
  const location = useLocation();

  // Define structured data (JSON-LD) for Kaumudi Academy & Graphura India
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://kaumudiacademy.in/#organization",
        name: "Kaumudi Sanskrit Academy",
        url: "https://kaumudiacademy.in",
        logo: {
          "@type": "ImageObject",
          url: "https://kaumudiacademy.in/assets/logo-bgremove.webp",
        },
        description:
          "Premier institute for Sanskrit education, specializing in Paninian Grammar, Vedanta, and Vedic studies.",
        parentOrganization: {
          "@type": "Organization",
          name: "Graphura India Private Limited",
          url: "https://graphura.com",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://kaumudiacademy.in/#website",
        url: "https://kaumudiacademy.in",
        name: "Kaumudi Sanskrit Academy",
        publisher: { "@id": "https://kaumudiacademy.in/#organization" },
      },
    ],
  };

  return (
    <>
      <SEO
        title="Kaumudi Sanskrit Academy | Learn Sanskrit with Experts"
        description="Kaumudi Sanskrit Academy, a venture of Graphura India Private Limited, offers authentic Sanskrit learning in Paninian Grammar, Vedanta, and Kavya. Join our live online courses today."
        canonicalPath={location.pathname}
        og={{
          type: "website",
          image: logo,
          site_name: "Kaumudi Sanskrit Academy",
        }}
        jsonLd={jsonLd}
        keywords={[
          "Kaumudi Sanskrit Academy",
          "Graphura India Private Limited",
          "Sanskrit learning platform",
          "Paninian Grammar",
          "Vedic studies online",
          "Sanskrit certifications India",
          "Ashtadhyayi courses",
          "Sanskrit for beginners",
          "Advanced Sanskrit grammar",
          "Sanskrit scholars academy",
          "Graphura India education",
        ]}
      />
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

// ================= 404 PAGE =================
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

// ================= MAIN APP =================
function App() {
  return (
    <Routes>
      {/* ========= PUBLIC SITE ========= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/allcourses" element={<AllCoursesPage />} />
        <Route path="/coursedetail/:id" element={<CourseDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/inquiry" element={<Inquiry />} />

        <Route
          path="/courseBuy"
          element={
            <RequireAuth>
              <Buy />
            </RequireAuth>
          }
        />

        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/cookies" element={<CookiePolicy />} />
      </Route>

      {/* Student dashboard — show SITE Navbar only (no Footer) and protect routes */}
      <Route
        path="/student"
        element={
          <RequireAuth role="STUDENT">
            <StudentLayout />
          </RequireAuth>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="overview" element={<StudentDashboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="profile" element={<Profile />} />
        <Route path="payments" element={<FeePurchase />} />
        <Route path="settings" element={<Settings />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* ========= AUTH ========= */}
      <Route path="/auth" element={<Sign />} />
      <Route path="/reset-password/:token" element={<Sign />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route
        path="/signup"
        element={<Navigate to="/auth?mode=signup" replace />}
      />

      {/* ========= ADMIN DASHBOARD ========= */}
      <Route
        path="/admin"
        element={
          <RequireAuth
            roles={["admin", "ADMIN", "SUPER_ADMIN"]}
            redirectTo="/admin-login"
          >
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/admin/student-inquiry" element={<InquiryManagement />} />
        <Route path="course" element={<CourseManagement />} />
        <Route path="coupon" element={<CouponPage />} />
        <Route path="gallery" element={<Gallery />} />
        {/* <Route path="/admin/staff-salary" element={<AdminStaffSalary />} /> */}
        <Route
          path="/admin/student-management"
          element={<StudentManagement />}
        />
        <Route
          path="/admin/enroll-students"
          element={<EnrollmentManagement />}
        />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/notifications" element={<NotificationsPage />} />
        <Route
          path="/admin/faculty-management"
          element={<FacultyManagement />}
        />
      </Route>

      {/* ========= ADMIN AUTH ========= */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-register" element={<AdminRegister />} />

      {/* ========= 404 ========= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
