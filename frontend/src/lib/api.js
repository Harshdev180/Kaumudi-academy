import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

// ==================== AUTH APIs ====================
export async function loginStudent(email, password) {
  const res = await api.post("/auth/login", { email, password, role: "STUDENT" });
  return res.data;
}

export async function loginAdmin(email, password) {
  const res = await api.post("/auth/login", { email, password, role: "ADMIN" });
  return res.data;
}

export async function loginSuperAdmin(email, password) {
  const res = await api.post("/auth/login", { email, password, role: "SUPER_ADMIN" });
  return res.data;
}

export async function registerStudent({ firstName, lastName, email, password }) {
  const res = await api.post("/auth/student/register", { firstName, lastName, email, password });
  return res.data;
}

export async function registerSuperAdmin({ name, email, password, phoneNumber, secretKey }) {
  const res = await api.post("/auth/super-admin/register", { name, email, password, phoneNumber, secretKey });
  return res.data;
}

export async function createAdmin({ name, email, phoneNumber }) {
  const res = await api.post("/auth/admin/create", { name, email, phoneNumber });
  return res.data;
}

export async function forgotPassword(email, role = "STUDENT") {
  const res = await api.post("/auth/forgot-password", { email, role });
  return res.data;
}

export async function resetPassword(token, newPassword, confirmPassword) {
  const res = await api.post(`/auth/reset-password/${token}`, { newPassword, confirmPassword });
  return res.data;
}

// ==================== COURSE APIs ====================
export async function getAllCourses() {
  const res = await api.get("/course");
  return res.data;
}

export async function getCourseDetail(courseId) {
  const res = await api.get(`/course/${courseId}`);
  return res.data;
}

export async function createCourse(courseData) {
  const res = await api.post("/course", courseData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
}

export async function updateCourse(courseId, courseData) {
  const res = await api.put(`/course/${courseId}`, courseData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
}

export async function toggleCourseStatus(courseId) {
  const res = await api.patch(`/course/${courseId}/status`);
  return res.data;
}

export async function deleteCourse(courseId) {
  const res = await api.delete(`/course/${courseId}`);
  return res.data;
}

export async function getAllCoursesForAdmin() {
  const res = await api.get("/course/admin/all");
  return res.data;
}

export async function getActiveCoursesForAdmin() {
  const res = await api.get("/course/admin/active");
  return res.data;
}

export async function getCoursesWithEnrollmentCount() {
  const res = await api.get("/course/admin/with-enrollments");
  return res.data;
}

export async function getCourseDashboardStats() {
  const res = await api.get("/course/admin/stats");
  return res.data;
}

// ==================== ENROLLMENT APIs ====================
export async function getMyEnrollments() {
  const res = await api.get("/enrollment/my");
  return res.data;
}

export async function getAllEnrollments() {
  const res = await api.get("/enrollment");
  return res.data;
}

// ==================== PAYMENT APIs ====================
export async function createPaymentOrder(courseId, couponCode = null) {
  const res = await api.post("/payment/create-order", { courseId, couponCode });
  return res.data;
}

export async function verifyPayment(paymentData) {
  const res = await api.post("/payment/verify", paymentData);
  return res.data;
}

export async function fakeVerifyPayment(courseId) {
  const res = await api.post("/payment/fake-verify", { razorpayOrderId: courseId });
  return res.data;
}

// ==================== INQUIRY APIs ====================
export async function submitInquiry(inquiryData) {
  const res = await api.post("/inquiry", inquiryData);
  return res.data;
}

// ==================== CONTACT APIs ====================
export async function submitContact(contactData) {
  const res = await api.post("/contact", contactData);
  return res.data;
}

// ==================== COUPON APIs ====================
export async function createCoupon(couponData) {
  const res = await api.post("/coupon", couponData);
  return res.data;
}

export async function getAllCouponsForAdmin() {
  const res = await api.get("/coupon/admin/all");
  return res.data;
}

export async function toggleCouponStatus(couponId) {
  const res = await api.patch(`/coupon/${couponId}/status`);
  return res.data;
}

// ==================== TESTIMONIAL APIs ====================
export async function addTestimonial(testimonialData) {
  const res = await api.post("/testimonial", testimonialData);
  return res.data;
}

export async function getAllTestimonials() {
  const res = await api.get("/testimonial");
  return res.data;
}

export async function updateTestimonial(testimonialId, testimonialData) {
  const res = await api.put(`/testimonial/${testimonialId}`, testimonialData);
  return res.data;
}

export async function deleteTestimonial(testimonialId) {
  const res = await api.delete(`/testimonial/${testimonialId}`);
  return res.data;
}

// ==================== DASHBOARD APIs ====================
export async function getDashboardStats() {
  const res = await api.get("/dashboard/stats");
  return res.data;
}

// ==================== STAFF APIs ====================
export async function getAllStaff() {
  const res = await api.get("/staff");
  return res.data;
}

export async function createStaff(staffData) {
  const res = await api.post("/staff", staffData);
  return res.data;
}

export async function updateStaff(staffId, staffData) {
  const res = await api.put(`/staff/${staffId}`, staffData);
  return res.data;
}

export async function deleteStaff(staffId) {
  const res = await api.delete(`/staff/${staffId}`);
  return res.data;
}

export async function toggleStaffPayment(staffId) {
  const res = await api.patch(`/staff/${staffId}/pay`);
  return res.data;
}

export async function toggleStaffStatus(staffId) {
  const res = await api.patch(`/staff/${staffId}/status`);
  return res.data;
}

// ==================== ADMIN STUDENT APIs ====================
export async function getAllStudentsForAdmin(params = {}) {
  const res = await api.get("/admin/students", { params });
  return res.data;
}

export async function createStudentByAdmin(studentData) {
  const res = await api.post("/admin/students", studentData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
}

export async function updateStudentByAdmin(studentId, studentData) {
  const res = await api.put(`/admin/students/${studentId}`, studentData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
}

export async function deleteStudentByAdmin(studentId) {
  const res = await api.delete(`/admin/students/${studentId}`);
  return res.data;
}

export async function toggleStudentStatus(studentId) {
  const res = await api.patch(`/admin/students/${studentId}/status`);
  return res.data;
}

export async function toggleStudentPayment(studentId) {
  const res = await api.patch(`/admin/students/${studentId}/payment`);
  return res.data;
}

// ==================== ADMIN INQUIRY APIs ====================
export async function getAdminInquiries(params = {}) {
  const res = await api.get("/admin/inquiries", { params });
  return res.data;
}

export async function getAdminInquiryById(inquiryId) {
  const res = await api.get(`/admin/inquiries/${inquiryId}`);
  return res.data;
}

export async function updateAdminInquiryStatus(inquiryId, status) {
  const res = await api.patch(`/admin/inquiries/${inquiryId}/status`, { status });
  return res.data;
}

export async function deleteAdminInquiry(inquiryId) {
  const res = await api.delete(`/admin/inquiries/${inquiryId}`);
  return res.data;
}

// ==================== STUDENT PROFILE APIs ====================
export async function getStudentProfile() {
  const res = await api.get('/student/me');
  return res.data;
}

export async function updateStudentProfile(profileData) {
  const res = await api.put('/student/me', profileData);
  return res.data;
}

// alias kept for backward compatibility with older import names
export async function getStudentEnrollments() {
  return getMyEnrollments();
}
