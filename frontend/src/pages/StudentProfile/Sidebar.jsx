import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, BookOpen, Award, User, 
  Settings, LogOut, Trash2, AlertTriangle, X 
} from "lucide-react";
import logo from "../../assets/logo-bgremove.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const menuItems = [
    { path: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { path: 'courses', label: 'Courses', icon: <BookOpen size={20} /> },
    { path: 'certifications', label: 'Certifications', icon: <Award size={20} /> },
    { path: 'payments', label: 'Payments', icon: <User size={20} /> },
    { path: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    // Clear all auth data
    localStorage.clear();
    // Redirect to home or login
    navigate('/');
  };

  const handleDeleteAccount = () => {
    // Perform API call here
    console.log("Account Deleted");
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      <aside className="w-64 bg-[#74271E] text-white flex flex-col shrink-0 shadow-2xl relative">
        {/* LOGO SECTION */}
        {/* LOGO SECTION */}
        <div className="p-10 flex flex-col items-center">
          {/* Logo Container */}
          <div className="w-16 h-16 mb-3 flex items-center justify-center">
            <img
              src={logo}
              alt="logo"
              className="w-full h-full object-contain relative z-10 brightness-110 contrast-110 drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
            />
          </div>
          
          <div className="leading-tight text-center">
            <div className="font-black tracking-widest text-white transition">
              KAUMUDI
            </div>
            <div className="text-[11px] tracking-[0.18em] text-white/80 uppercase font-bold">
              Sanskrit Academy
            </div>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-[#c9a050] text-[#74271E] font-bold shadow-lg"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-sm font-medium tracking-wide">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* BOTTOM ACTION SECTION */}
        <div className="p-4 mt-auto border-t border-white/10 space-y-1">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Logout</span>
          </button>

          <button 
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center gap-4 px-6 py-3 rounded-xl text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
          >
            <Trash2 size={20} />
            <span className="text-sm font-medium">Delete Account</span>
          </button>
        </div>
      </aside>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                <AlertTriangle size={40} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-gray-800">Are you sure?</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  This action is permanent. All your progress, certifications, and course access will be lost forever.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={handleDeleteAccount}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20"
                >
                  Yes, Delete My Account
                </button>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="bg-gray-50 py-4 px-8 border-t border-gray-100 flex justify-center">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Action requires irreversible confirmation</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;