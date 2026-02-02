import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { BookOpen, Menu } from 'lucide-react'; // Hamburger icon

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-[#F3E6C9] overflow-hidden">
            {/* Sidebar ko status aur control function diya */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header: Ye sirf small screens par dikhega */}
                <header className="md:hidden flex items-center justify-between p-4 bg-[#8B6A21] text-white z-40 shadow-md">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#D4AF37] p-1.5 rounded-lg">
                            <BookOpen size={18} className="text-[#8B6A21]" />
                        </div>
                        <h1 className="font-serif font-bold text-lg">KAUMUDI</h1>
                    </div>

                    {/* Hamburger Button */}
                    <button
                        onClick={toggleSidebar}
                        className="p-2 bg-white/10 rounded-xl active:scale-95 transition-transform"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                {/* Main Page Content */}
                <main className={`flex-1 overflow-y-auto transition-all duration-300 md:ml-72`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;