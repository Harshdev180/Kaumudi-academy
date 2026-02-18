import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  // Generate breadcrumb or title based on path
  const pageTitle = location.pathname.split('/').pop() || 'Overview';

  return (
    <div className="flex h-screen bg-[#f7f1e3] font-sans text-gray-800 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Refined Header */}
        <header className="h-20 flex items-center justify-between px-10 bg-transparent shrink-0">
          <div className="flex flex-col">
            {/* Replaced navy blue with #74271E */}
            <h2 className="text-2xl font-bold capitalize tracking-tight text-[#74271E]">{pageTitle}</h2>
            <div className="h-1 w-8 bg-[#c9a050] rounded-full mt-1"></div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center bg-white/50 border border-[#e6d5b8] rounded-2xl px-4 py-2 focus-within:bg-white transition-all shadow-sm">
              <Search size={18} className="text-gray-400" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none px-3 text-sm w-48" />
            </div>
            
            <div className="flex items-center gap-5">
              {/* Replaced navy blue icon color with #74271E */}
              <button className="relative p-2 text-[#74271E] hover:bg-[#c9a050]/10 rounded-xl transition-colors">
                <Bell size={22} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f7f1e3]"></span>
              </button>
              {/* Replaced navy blue border/bg with #74271E */}
              <div className="w-11 h-11 rounded-2xl border-2 border-white shadow-md overflow-hidden bg-[#74271E]">
                <img src="https://i.pravatar.cc/150?u=arjun" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Improved Scrollable Area */}
        <main className="flex-1 overflow-y-auto px-10 pb-10 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;