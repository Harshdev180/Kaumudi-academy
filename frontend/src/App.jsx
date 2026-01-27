import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import Contact from "./pages/Contact";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/contact" element={<Contact />} /> */}
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

