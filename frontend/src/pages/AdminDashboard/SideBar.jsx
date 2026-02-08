// import React, { useState } from 'react'
// import { BookOpen, LayoutDashboard, Link, Settings, Users, Zap } from 'lucide-react'
// import { MdSupportAgent } from "react-icons/md";

// import { useLocation } from 'react-router-dom';

// function Sidebar({ collapsed, onToggle, currentPage, onPageChange }) {

//   const toggle = (itemid)=>{
//     const newExpanded = new Set(expandedItems);

//   }
//   // const location = useLocation();

//   const menuItems = [
//     { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
//     { path: '/admin/lead', label: 'Lead Management', icon: <Users size={18} /> },
//     { path: '/admin/course', label: 'Courses Management', icon: <BookOpen size={18} /> },
//     { path: '/admin/setting', label: 'Settings', icon: <Settings size={18} /> }

//   ];

//   return (
//     <>
//       <div className={`${collapsed ? "w-20" : "w-72"} transition duration-300 ease-in-out bg-[#FBF4E2] text-[#6b1d14]
//       backdrop-blur-xl border-r border-slate-200/50  flex flex-col
//       relative z-10`}>
//         {/* Logo */}
//         <div className="p-6 border-b border-slate-200/50 ">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-[#D4AF37] rounded-xl
//             flex items-center justify-center shadow-lg">
//               <BookOpen className="text-[#6b1d14]" />
//             </div>
//             {/* Conditinoal Rendering */}
//             {!collapsed && (
//               <div>
//                 <h1 className='font-serif font-extrabold text-2xl text-[#6b1d14] tracking-normal '>KAUMUDI</h1>
//                 <p className='text-xs text-[#6b1d14] uppercase font-bold ml-1 '>Sanskrit Academy Admin</p>
//               </div>
//             )}
//           </div>
//         </div>
//         {/* Navigation */}
//         <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
//           {menuItems.map((item) => {
//             const isActive = location.pathname === item.path;
//             return (
//               <div key={item.path}
//                 className={` flex items-center justify-between  px-5 py-3  rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#F3E6C9] border border-[#b8973d]/40 shadow-sm' : 'hover:bg-[#F3E6C9]/60 text-[#6b1d14]/70'}`}>
//                 <button className={`w-full flex items-center justify-between p-2 rounded-xl transition-all duration-200 ${currentPage === item.id || item.active ? 'bg-[#D4AF37] text-[#6b1d14]' : ' text-[#6b1d14]/70'}`}
//                 onClick={()=>{
//                   onPageChange(item.id)
//                 }}
//                 >
//                   <div className={`flex items-center space-x-3  rounded-xl`}>
//                     {item.icon}
//                     {/* Conditional Rendering */}
//                     <>
//                       {!collapsed && (
//                         <span className="text-md font-medium ">
//                           {item.label}
//                         </span>
//                       )}
//                     </>
//                   </div>
//                 </button>
//               </div>
//               // <Link
//               //   key={item.path}
//               //   to={item.path}
//               //   onClick={() => window.innerWidth < 768 && toggleSidebar()}
//               //   className={` flex items-center justify-between  px-5 py-3  rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#F3E6C9] border border-[#b8973d]/40 shadow-sm' : 'hover:bg-[#F3E6C9]/60 text-[#6b1d14]/70'}`}>
//               //   <div className="flex items-center gap-4">
//               //     <div
//               //       className={` p-2 rounded-xl ${isActive ? 'bg-[#D4AF37] text-[#6b1d14]' : 'bg-white/70 text-[#6b1d14]/70'}`} >
//               //       {item.icon}
//               //     </div>
//               //     <span className="text-sm font-medium tracking-wide">
//               //       {item.label}
//               //     </span>
//               //   </div>

//               //   {isActive && (
//               //     <ChevronRight size={16} className="text-[#b8973d]" />
//               //   )}
//               // </Link>
//             );
//           })}
//         </nav>
//         {/* Bottom Support Section */}
//         {/* <div className="p-6 mt-auto border-t border-white/10 bg-[#FBF4E2] sticky bottom-0">
//           <div
//             to="/admin/settings"
//             className="flex items-center gap-4 p-4 text-[#6b1d14] hover:text-black transition-colors text-sm"
//           >
//           </div>
//           <button className="w-full mt-4 flex items-center justify-center gap-2 bg-[#F3E6C9] hover:bg-[#D4AF37] hover:text-black text-[#6b1d14] py-4 rounded-2xl text-xs font-bold transition-all border border-[#D4AF37]/20 shadow-md">
//             <MdSupportAgent size={18} />
//             <span>Support</span>
//           </button>
//         </div> */}

//         {/* User profile */}

//         {!collapsed && (
//           <div className='p-4 border-t border-slate-200/50 '>
//             <div className='flex items-center space-x-3 p-3 rounded-xl bg-slate-50 '>
//               <img src="" alt="USER" className='w-10 h-10 rounded-full ring-2 ring-blue-500' />
//               <div className='flex-1 min-w-0'>
//                 <div className='flex-1 min-w-0'>
//                   <p className='text-sm font-medium text-slate-800 truncate'>Ajay Sharma</p>
//                   <p className='text-xs text-slate-500 truncate'>Administrator</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   )
// }

// export default Sidebar

import React from "react";
import {
  BookOpen,
  LayoutDashboard,
  Settings,
  Users,
  ChevronRight,
} from "lucide-react";
import { MdSupportAgent } from "react-icons/md";
import { useLocation, Link } from "react-router-dom";

function Sidebar({ collapsed }) {
  const location = useLocation();
  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { path: "/admin/lead", label: "Lead Management", icon: <Users size={18} /> },
    { path: "/admin/course", label: "Courses", icon: <BookOpen size={18} /> },
  ];

  return (
    <div
      className={`${collapsed ? "w-20" : "w-72"} transition-all duration-300 ease-in-out bg-[#FBF4E2] text-[#6b1d14] backdrop-blur-xl border-r border-slate-200/50 flex flex-col h-screen sticky top-0 z-50`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <BookOpen className="text-[#6b1d14]" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="font-serif font-extrabold text-2xl text-[#6b1d14] tracking-normal">
                KAUMUDI
              </h1>
              <p className="text-[10px] text-[#6b1d14]/70 uppercase font-bold tracking-widest">
                Sanskrit Academy
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Area */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center group relative px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-[#6b1d14] text-white shadow-md shadow-[#6b1d14]/20"
                  : "hover:bg-[#F3E6C9] text-[#6b1d14]/70"
              }`}
            >
              <div
                className={`flex items-center justify-center transition-colors ${
                  isActive ? "text-[#D4AF37]" : "group-hover:text-[#6b1d14]"
                }`}
              >
                {item.icon}
              </div>

              {!collapsed && (
                <span
                  className={`ml-4 text-sm font-semibold transition-opacity duration-300 ${
                    isActive ? "text-white" : "text-[#6b1d14]/80"
                  }`}
                >
                  {item.label}
                </span>
              )}

              {/* Active Indicator Dot */}
              {isActive && !collapsed && (
                <div className="absolute right-4 w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200/50 bg-[#F3E6C9]/30">
          <div className="flex items-center space-x-3 p-2 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center font-bold text-[#6b1d14]">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#6b1d14] truncate">
                Ajay Sharma
              </p>
              <p className="text-[10px] text-[#6b1d14]/60 uppercase font-black">
                Administrator
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
