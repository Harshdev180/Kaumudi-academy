import { useState } from "react";
import "./App.css";

// import Sidebar, { SidebarItem } from "./pages/AdminDashboard/Sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AllCoursesPage from "./pages/CourseListing";
import CourseDetailPage from "./pages/CourseDetail";

function App() {
  return (
    <Routes>
      <Route path="/allcourses" element={<AllCoursesPage />} />
      <Route path="/course/:id" element={<CourseDetailPage />} />
    </Routes>
  );
}

export default App;
