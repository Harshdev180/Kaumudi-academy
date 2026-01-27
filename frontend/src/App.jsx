import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Scholarships from "./pages/Scholarships";
import Library from "./pages/Library";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import Contact from "./pages/Contact";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/scholarships" element={<Scholarships />} />
      <Route path="/library" element={<Library />} />
      <Route path="/about" element={<About />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default App;




// import { Routes, Route } from "react-router-dom";
// import Index from './components/index'; // components/index.tsx

// const App = () => {
//   return (
//     <Routes>
      

//       {/* Home / Course Details Page */}
//       <Route path="/" element={<Index />} />

//       {/* Extra routes (optional but future-ready) */}
//       <Route path="/courses" element={<Index />} />
//       <Route path="/scholarships" element={<Index />} />
//       <Route path="/library" element={<Index />} />
//       <Route path="/about" element={<Index />} />
 
//     </Routes>
//   );
// };

// export default App;

