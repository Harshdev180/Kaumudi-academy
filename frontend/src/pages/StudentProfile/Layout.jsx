import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Bell, Search } from "lucide-react";

const Layout = () => {
  const location = useLocation();
  // Generate breadcrumb or title based on path
  const pageTitle = location.pathname.split("/").pop() || "Overview";
  const name = (localStorage.getItem("kaumudi_user_name") || "").trim();
  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase())
        .join("")
    : "ST";

  return (
    <div className="flex h-screen bg-[#f7f1e3] font-sans text-gray-800 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Refined Header */}
        <header className="h-20 flex items-center justify-between px-10 bg-gradient-to-r from-[#f3e6c9] to-[#FBF4E2] border-b border-[#e6d5b8]/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold capitalize tracking-tight text-[#74271E]">
                {pageTitle}
              </h2>
              <div className="h-1 w-8 bg-[#c9a050] rounded-full mt-1"></div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center bg-white/60 border border-[#e6d5b8] rounded-2xl px-4 py-2 focus-within:bg-white transition-all shadow-sm">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search…"
                className="bg-transparent border-none outline-none px-3 text-sm w-48"
              />
            </div>
            <div className="flex items-center gap-5">
              <button className="relative p-2 text-[#74271E] hover:bg-[#c9a050]/10 rounded-xl transition-colors">
                <Bell size={22} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white/70"></span>
              </button>
              <div className="w-11 h-11 rounded-2xl border-2 border-[#e6d5b8] shadow-md overflow-hidden bg-[#74271E]/90 grid place-items-center text-white font-bold">
                <span className="tracking-widest">{initials}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Improved Scrollable Area */}
        <main className="flex-1 overflow-y-auto px-10 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
