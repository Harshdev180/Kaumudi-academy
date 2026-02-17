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


import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./SideBar";

const AdminLayout = () => {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);

  // GLOBAL ALERT STATE
  const [showAlerts, setShowAlerts] = useState(false);

  return (
    <div className="bg-[#f1e4c8] min-h-screen transition-all duration-500">
      <div className="flex h-screen overflow-hidden">

        {/* 🔥 SIDEBAR BLUR ONLY */}
        <div
          className={`transition-all duration-300 ${showAlerts ? "blur-sm scale-[0.99] opacity-80" : ""
            }`}
        >
          {/* ✅ PASS TOGGLE CONTROL TO SIDEBAR */}
          <Sidebar
            collapsed={sideBarCollapsed}
            setCollapsed={setSideBarCollapsed}
          />
        </div>

        {/* Right Area */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* ✅ HEADER — NO SIDEBAR CONTROL ANYMORE */}
          <Header
            showAlerts={showAlerts}
            setShowAlerts={setShowAlerts}
          />

          {/* 🔥 MAIN CONTENT BLUR ONLY */}
          <main
            className={`flex-1 overflow-y-auto bg-transparent transition-all duration-300 ${showAlerts ? "blur-sm scale-[0.99] opacity-80" : ""
              }`}
          >
            <div className="p-6 space-y-6">
              <Outlet />
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
