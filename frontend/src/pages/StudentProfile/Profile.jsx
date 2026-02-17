import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Shield, Save, X, BookOpen, Clock } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "Arjun Sharma",
    sanskritName: "अर्जुन शर्मा",
    id: "KSA-2026-088",
    email: "arjun.sharma@example.com",
    phone: "+91 98765 43210",
    location: "Pune, Maharashtra",
    joinDate: "October 2025",
    level: "Intermediate (Madhyama)",
    bio: "Passionate about classical Sanskrit literature and Vedic chanting. Currently focusing on Panini's grammar and the Upanishads."
  });

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 animate-in fade-in duration-700">
      
      {/* TOP SECTION: LARGE CARDS / SMALL TEXT */}
      <div className="grid grid-cols-12 gap-6 mb-10">
        
        {/* Main Profile Banner (Big Card, Small Text) */}
        <div className="col-span-12 lg:col-span-8 relative bg-[#74271E] rounded-[2.5rem] shadow-xl overflow-hidden min-h-[280px] flex items-end p-10">
          <div className="absolute right-[-30px] top-[-30px] w-80 h-80 opacity-10 border-[25px] border-[#c9a050] rounded-full" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8 w-full">
            <div className="w-28 h-28 rounded-[2rem] border-4 border-white/20 bg-[#c9a050] flex items-center justify-center text-white text-3xl font-bold font-serif shadow-2xl shrink-0">
              {getInitials(profile.name)}
            </div>
            
            <div className="flex-1 text-center md:text-left pb-2">
              {isEditing ? (
                <div className="space-y-2 max-w-md">
                  <input 
                    name="name" 
                    value={profile.name} 
                    onChange={handleInputChange}
                    className="w-full text-xl font-bold text-white bg-white/10 border border-white/20 rounded-xl px-4 py-1 outline-none"
                  />
                  <input 
                    name="sanskritName" 
                    value={profile.sanskritName} 
                    onChange={handleInputChange}
                    className="w-full text-[#c9a050] font-serif text-base bg-white/10 border border-white/20 rounded-xl px-4 py-1 outline-none"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-serif font-bold text-white drop-shadow-sm">
                    {profile.name}
                  </h1>
                  <p className="text-[#c9a050] font-serif text-lg mt-0.5 tracking-wide">
                    {profile.sanskritName}
                  </p>
                </>
              )}
            </div>

            <div className="flex gap-3 md:self-start">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-[11px] bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all shadow-md uppercase tracking-wider"
              >
                {isEditing ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit Profile</>}
              </button>
            </div>
          </div>
        </div>

        {/* Student Status Card (Big Card, Small Text) */}
        <div className="col-span-12 lg:col-span-4 bg-[#c9a050] rounded-[2.5rem] p-10 text-[#74271E] shadow-xl relative overflow-hidden group flex flex-col justify-center">
          <Shield className="absolute -right-4 -bottom-4 text-[#74271E]/5 opacity-20" size={140} />
          <div className="relative z-10">
            <p className="text-[#74271E]/70 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Student Status</p>
            <h4 className="text-lg font-serif font-bold mb-6 leading-tight">{profile.level}</h4>
            
            <div className="bg-[#74271E]/10 p-4 rounded-2xl border border-[#74271E]/10 backdrop-blur-sm">
              <p className="text-[9px] text-[#74271E]/60 uppercase font-black tracking-widest mb-1">Enrollment ID</p>
              <p className="font-mono font-bold text-[#74271E] text-sm tracking-widest">{profile.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Personal Info (Big Rounded Card) */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5 min-h-[400px]">
            <h3 className="text-xs font-bold text-gray-800 mb-8 flex items-center gap-2 uppercase tracking-widest">
              <User size={16} className="text-[#c9a050]" />
              Personal Info
            </h3>
            
            <div className="space-y-6">
              {[
                { icon: <Mail size={16} />, label: "Email", value: profile.email, name: "email" },
                { icon: <Phone size={16} />, label: "Phone", value: profile.phone, name: "phone" },
                { icon: <MapPin size={16} />, label: "Location", value: profile.location, name: "location" },
                { icon: <Calendar size={16} />, label: "Joined", value: profile.joinDate, name: "joinDate" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="text-[#c9a050] mt-1">{item.icon}</div>
                  <div className="flex-1">
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 font-black mb-1">{item.label}</p>
                    {isEditing ? (
                      <input 
                        name={item.name} 
                        value={item.value} 
                        onChange={handleInputChange}
                        className="w-full text-xs font-bold text-gray-700 bg-gray-50 border-b border-[#c9a050] focus:outline-none"
                      />
                    ) : (
                      <p className="text-xs font-bold text-gray-700">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Bio and Statistics (Big Rounded Cards) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5 min-h-[200px]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">About Me</h3>
            {isEditing ? (
              <textarea 
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full bg-gray-50 border border-[#e6d5b8] rounded-2xl p-4 text-xs text-gray-700 outline-none focus:ring-1 focus:ring-[#c9a050]"
              />
            ) : (
              <p className="text-gray-600 leading-relaxed italic font-serif text-sm">
                "{profile.bio}"
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5 flex items-center gap-6 group hover:bg-[#f7f1e3]/20 transition-colors">
              <div className="bg-[#f7f1e3] p-4 rounded-2xl text-[#74271E] group-hover:bg-[#74271E] group-hover:text-white transition-all">
                <Clock size={20}/>
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Learning Hours</p>
                <p className="text-xl font-black text-gray-800">120</p>
              </div>
            </div>
            
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5 flex items-center gap-6 group hover:bg-[#f7f1e3]/20 transition-colors">
              <div className="bg-[#f7f1e3] p-4 rounded-2xl text-[#74271E] group-hover:bg-[#74271E] group-hover:text-white transition-all">
                <BookOpen size={20}/>
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Modules</p>
                <p className="text-xl font-black text-gray-800">03</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;