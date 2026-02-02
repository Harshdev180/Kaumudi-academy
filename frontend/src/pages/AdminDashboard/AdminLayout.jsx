// import React, { useState } from 'react';
// import Sidebar from './Sidebar';
// import { Outlet } from "react-router-dom"
// import { BookOpen, Menu } from 'lucide-react'; // Hamburger icon

// const AdminLayout = ({ children }) => {
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//     const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//     return (
//         <div className="flex h-screen bg-[#F3E6C9] overflow-hidden">
//             {/* Sidebar ko status aur control function diya */}
//             <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

//             <div className="flex-1 flex flex-col h-full overflow-hidden">
//                 {/* Mobile Header: Ye sirf small screens par dikhega */}
//                 <header className="md:hidden flex items-center justify-between p-4 bg-[#FBF4E2] text-[#6b1d14] z-40 shadow-md">
//                     <div className="flex items-center gap-2">
//                         <div className="bg-[#D4AF37] p-1.5 rounded-lg">
//                             <BookOpen size={18} className="text-[#6b1d14]" />
//                         </div>
//                         <h1 className="font-serif font-bold text-lg">KAUMUDI</h1>
//                     </div>

//                     {/* Hamburger Button */}
//                     <button
//                         onClick={toggleSidebar}
//                         className="p-2 bg-white/10 rounded-xl active:scale-95 transition-transform"
//                     >
//                         <Menu size={24} />
//                     </button>
//                 </header>

//                 {/* Main Page Content */}
//                 <main className={`flex-1 overflow-y-auto transition-all duration-300 md:ml-72`}>
//                     <Outlet />
//                     {children}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default AdminLayout;




import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from "react-router-dom";
import { BookOpen, Menu, X } from 'lucide-react'; 

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-[#F3E6C9] overflow-hidden relative">
            
            {/* 1. Sidebar Component */}
            {/* Yahan humne toggle logic pass ki hai taaki mobile par menu click se band ho sake */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* 2. Mobile Overlay */}
            {/* Jab mobile par sidebar khulega, toh peeche ka area dark ho jayega */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
                    onClick={toggleSidebar}
                />
            )}

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                
                {/* 3. Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-[#FBF4E2] text-[#6b1d14] z-50 shadow-md border-b border-[#b8973d]/20">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#D4AF37] p-1.5 rounded-lg shadow-sm">
                            <BookOpen size={18} className="text-[#6b1d14]" />
                        </div>
                        <h1 className="font-heritage font-bold text-lg tracking-wider">KAUMUDI</h1>
                    </div>

                    <button
                        onClick={toggleSidebar}
                        className="p-2 bg-[#6b1d14]/5 rounded-xl active:scale-95 transition-all text-[#6b1d14]"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                {/* 4. Main Page Content (The Magic Area) */}
                <main className="flex-1 overflow-y-auto transition-all duration-300 md:ml-72">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;