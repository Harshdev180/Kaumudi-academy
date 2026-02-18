// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import Header from "./Header";
// import Sidebar from "./SideBar";

// const AdminLayout = () => {
//   const [sideBarCollapsed, setSideBarCollapsed] = useState(false);

//   return (
//     <div className="bg-[#f1e4c8] min-h-screen transition-all duration-500">
//       <div className="flex h-screen overflow-hidden">
//         {/* Sidebar */}
//         <Sidebar collapsed={sideBarCollapsed} />

//         {/* Right Area */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Header */}
//           <Header
//             sidebarCollapsed={sideBarCollapsed}
//             onToggleSidebar={() => setSideBarCollapsed(!sideBarCollapsed)}
//           />

//           {/* Main Content */}
//           <main className="flex-1 overflow-y-auto bg-transparent">
//             <div className="p-6 space-y-6">
//               <Outlet />
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdMenu } from "react-icons/md";
import Header from "./Header";
import Sidebar from "./SideBar";
import ScrollToTop from "../../components/ScrollToTop"

const AdminLayout = () => {

  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  // ⭐ GLOBAL RESPONSIVE STATE
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const navigate = useNavigate();

  /* ================= AUTO LOGOUT ================= */
  useEffect(() => {

    let timer;

    const resetTimer = () => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        sessionStorage.clear();
        navigate("/admin-login", { replace: true });
      }, 30 * 60 * 1000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };

  }, [navigate]);


  /* ================= RESPONSIVE LISTENER ================= */
  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);

  }, []);

  return (
    <>
      <ScrollToTop />
      <div className="bg-[#f1e4c8] min-h-screen w-full overflow-x-hidden">

        <div className="flex h-screen w-full">

          {/* SIDEBAR */}
          <Sidebar
            collapsed={sideBarCollapsed}
            setCollapsed={setSideBarCollapsed}
            isMobile={isMobile}
          />

          {/* ⭐ MOBILE FLOATING HAMBURGER TOGGLE */}
          {isMobile && (
            <motion.button
              onClick={() => setSideBarCollapsed(prev => !prev)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.9 }}
              className="
              fixed z-[60]
              bottom-6 left-6
              w-14 h-14
              rounded-full
              bg-[#D1B062]
              text-[#6b1d14]
              border-4 border-[#FBF4E2]
              flex items-center justify-center
              shadow-xl
              lg:hidden
            "
            >
              <MdMenu size={26} />
            </motion.button>
          )}

          {/* RIGHT AREA */}
          <div className="flex-1 flex flex-col min-w-0">

            <Header
              showAlerts={showAlerts}
              setShowAlerts={setShowAlerts}
            />

            {/* MAIN CONTENT */}
            <main
              className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300
            ${showAlerts ? "blur-sm scale-[0.99] opacity-80" : ""}`}
            >
              <div className="px-3 sm:px-4 md:px-6 py-4 space-y-6">
                <Outlet />
              </div>
            </main>

          </div>
        </div>
      </div>
    </>

  );
};

export default AdminLayout;
