import { Routes, Route } from "react-router-dom";
import CourseDetail from "./pages/CourseDetail";
import Signup from './component/Auth/signup';
import Signin from './component/Auth/login';


export default function App() {
return (
<Routes>
<Route path="/coursedetails" element={<CourseDetail />} />
<Route path="/Signup" element={<Signup />} />
<Route path="/login" element={<Signin />} />
</Routes>
);
}
