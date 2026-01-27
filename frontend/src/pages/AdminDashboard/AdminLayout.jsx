import React from 'react';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-[#FFFDF8]">
            {/* Sidebar fixed rahega */}
            <Sidebar />

            {/* Right side ka content change hota rahega */}
            <main className="flex-1 md:ml-64 bg-[#f8f6f6] min-h-screen">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;