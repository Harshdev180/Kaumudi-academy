import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Globe, 
  Palette, 
  ShieldCheck, 
  LogOut, 
  Trash2, 
  ChevronRight,
  Moon
} from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    courseUpdates: true,
    reminders: false
  });

  return (
    <div className="max-w-6xl mx-auto pb-16 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col mb-10">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">
          Vinyasa | विन्यास
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ACCOUNT & PREFERENCES */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Security Card */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5">
            <h3 className="text-xs font-bold text-gray-800 mb-8 flex items-center gap-2 uppercase tracking-widest">
              <Lock size={16} className="text-[#c9a050]" />
              Account Security
            </h3>
            
            <div className="space-y-4">
              {[
                { label: "Change Password", sub: "Last updated 3 months ago", icon: <ShieldCheck size={18} /> },
                { label: "Two-Factor Authentication", sub: "Add an extra layer of security", icon: <Lock size={18} /> },
                { label: "Active Sessions", sub: "Manage where you're logged in", icon: <Globe size={18} /> }
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-black/5">
                  <div className="flex items-center gap-4">
                    <div className="text-[#74271E]/60 group-hover:text-[#74271E] transition-colors">
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-700">{item.label}</p>
                      <p className="text-[10px] text-gray-400">{item.sub}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-[#c9a050] transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5">
            <h3 className="text-xs font-bold text-gray-800 mb-8 flex items-center gap-2 uppercase tracking-widest">
              <Palette size={16} className="text-[#c9a050]" />
              App Preferences
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div>
                  <p className="text-xs font-bold text-gray-700">Display Language</p>
                  <p className="text-[10px] text-gray-400">English (Sanskrit transliteration enabled)</p>
                </div>
                <select className="bg-gray-50 border border-black/5 rounded-lg px-3 py-2 text-[11px] font-bold text-gray-600 outline-none">
                  <option>English</option>
                  <option>Hindi (हिन्दी)</option>
                  <option>Sanskrit (संस्कृतम्)</option>
                </select>
              </div>

              <div className="h-px bg-gray-50" />

              <div className="flex items-center justify-between px-2">
                <div>
                  <p className="text-xs font-bold text-gray-700">Dark Mode</p>
                  <p className="text-[10px] text-gray-400">Reduce glare and save battery</p>
                </div>
                <button className="w-10 h-5 bg-gray-200 rounded-full relative transition-colors">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: NOTIFICATIONS & DANGER ZONE */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* Notifications Card */}
          <div className="bg-[#74271E] rounded-[2.5rem] p-10 shadow-xl text-white relative overflow-hidden">
            <Bell className="absolute -right-4 -top-4 text-white/5 opacity-10" size={120} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-[#c9a050]">Notifications</h3>
            
            <div className="space-y-6 relative z-10">
              {Object.keys(notifications).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-[11px] font-bold capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button 
                    onClick={() => setNotifications({...notifications, [key]: !notifications[key]})}
                    className={`w-10 h-5 rounded-full relative transition-all duration-300 ${notifications[key] ? 'bg-[#c9a050]' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${notifications[key] ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-red-100">
            <h3 className="text-xs font-bold text-red-500 mb-8 flex items-center gap-2 uppercase tracking-widest">
              <Trash2 size={16} />
              Danger Zone
            </h3>
            
            <div className="space-y-4">
              <button className="w-full py-3 bg-white border border-gray-100 text-gray-500 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                <LogOut size={14} /> Log Out
              </button>
              <button className="w-full py-3 bg-red-50 text-red-500 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-all">
                Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;