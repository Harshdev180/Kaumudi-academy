import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

// Pages
import Dashboard from "./Dashboard";
import Inquiry from "./Inquiry";
import CourseManagement from "./CourseManagement";
import LeadManagement from "./LeadManagement";

const AdminLayout = () => {
    const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState("dashboard");

    const renderPage = () => {
        switch (currentPage) {
            case "dashboard":
                return <Dashboard />;
            case "inquiry":
                return <Inquiry />;
            case "courses":
                return <CourseManagement />;
            case "leads":
                return <LeadManagement />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="bg-[#f1e4c8] min-h-screen transition-all duration-500">
            <div className="flex h-screen overflow-hidden">

                {/* Sidebar */}
                <Sidebar
                    collapsed={sideBarCollapsed}
                    onToggle={() => setSideBarCollapsed(!sideBarCollapsed)}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />

                {/* Right Area */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    {/* Header */}
                    <Header
                        sidebarCollapsed={sideBarCollapsed}
                        onToggleSidebar={() => setSideBarCollapsed(!sideBarCollapsed)}
                    />

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto bg-transparent">
                        <div className="p-6 space-y-6">
                            {renderPage()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
