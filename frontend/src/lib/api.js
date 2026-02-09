import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

export async function loginStudent(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function registerStudent({ firstName, lastName, email, password }) {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  const res = await api.post("/auth/student/register", { name, email, password });
  return res.data;
}

export async function getStudentProfile() {
  const res = await api.get("/student/profile");
  return res.data;
}

export async function updateStudentProfile(payload) {
  const res = await api.put("/student/profile", payload);
  return res.data;
}

export async function getStudentEnrollments() {
  const res = await api.get("/student/enrollments");
  return res.data;
}
