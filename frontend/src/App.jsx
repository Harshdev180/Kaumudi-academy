import { useState } from "react";
import "./App.css";
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
  );
}

export default App;
