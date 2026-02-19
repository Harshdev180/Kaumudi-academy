import React, { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Edit3,
  Save,
  ShieldCheck,
  Shield,
  Users,
  MapPin,
  Clock,
  Mail,
  Smartphone,
  Monitor,
  X,
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("student details");
  const [isEditing, setIsEditing] = useState(false); // Toggle for Edit mode
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    system: true,
  });

  // Profile data converted to state so it can be updated
  const [profile, setProfile] = useState({
    firstName: "Aarav",
    lastName: "Sharma",
    hindiName: "आरव शर्मा",
    id: "SA-20230514",
    level: "Level 4 • Senior Scholar",
    dob: "12 January 1998",
    father: "Rajesh Sharma",
    mother: "Geeta Sharma",
    email: "aarav.sharma@email.com",
    phone: "+91 98765 43210",
    address: "14, Vasant Vihar, New Delhi",
  });

  // Handle Input Changes
  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const tabs = ["student details", "change password", "notification settings"];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12 mt-6">
      {/* TOP SECTION: Header & Status Card */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        {/* Profile Identity Left */}
        <div className="col-span-12 lg:col-span-8 flex flex-col md:flex-row items-center gap-8 p-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-2 border-[#c9a050] p-1 shadow-xl">
              <div className="w-full h-full bg-[#fdfbf7] rounded-full flex items-center justify-center border border-[#c9a050]/20">
                <span className="text-4xl font-serif font-bold text-[#74271E]">
                  {profile.firstName.charAt(0)}
                  {profile.lastName.charAt(0)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left space-y-2">
            <h2 className="text-4xl font-serif font-bold text-gray-800 tracking-tight">
              {profile.firstName} {profile.lastName}{" "}
              <span className="text-gray-300 mx-2 font-light">/</span>{" "}
              {profile.hindiName}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-4 py-1.5 bg-[#f7f1e3] text-[#c9a050] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#c9a050]/20">
                Verified Student
              </span>
              <span className="px-4 py-1.5 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                MA Sanskrit Lit.
              </span>
            </div>
          </div>
        </div>

        {/* Student Status Card */}
        <div className="col-span-12 lg:col-span-4 bg-[#fdfbf7] rounded-[2.5rem] p-10 text-[#74271E] shadow-xl relative overflow-hidden group flex flex-col justify-center min-h-[200px]">
          <Shield
            className="absolute -right-4 -bottom-4 text-[#74271E]/5 opacity-20"
            size={140}
          />
          <div className="relative z-10">
            <p className="text-[#74271E]/70 text-[9px] font-black uppercase tracking-[0.2em] mb-2">
              Student Status
            </p>
            <h4 className="text-xl font-serif font-bold mb-6 leading-tight">
              {profile.level}
            </h4>
            <div className="bg-[#74271E]/10 p-4 rounded-2xl border border-[#74271E]/10 backdrop-blur-sm transition-transform group-hover:scale-[1.02] duration-500">
              <p className="text-[9px] text-[#74271E]/60 uppercase font-black tracking-widest mb-1">
                Enrollment ID
              </p>
              <p className="font-mono font-bold text-[#74271E] text-sm tracking-widest">
                {profile.id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN SETTINGS CARD WITH TABS */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-black/5 overflow-hidden min-h-[550px]">
        <div className="flex border-b border-gray-100 px-8 pt-6 bg-gray-50/30">
          {tabs.map((tab) => (
            <button
              key={tab}
              disabled={isEditing && tab !== "student details"} // Disable tabs during edit
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] transition-all relative ${
                activeTab === tab
                  ? "text-[#74271E]"
                  : "text-gray-400 hover:text-gray-600"
              } ${isEditing && tab !== "student details" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-8 right-8 h-1 bg-[#74271E] rounded-t-full shadow-[0_-2px_10px_rgba(116,39,30,0.3)]" />
              )}
            </button>
          ))}
        </div>

        <div className="p-12 relative">
          {/* 1. STUDENT DETAILS TAB */}
          {activeTab === "student details" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
              <div className="flex justify-between items-start border-b border-gray-50 pb-8">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-gray-800">
                    Personal Identity
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 italic">
                    Manage your verified academic and contact information
                  </p>
                </div>
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold text-xs hover:bg-gray-200 transition-all active:scale-95"
                      >
                        <X size={14} /> Cancel
                      </button>
                      <button
                        onClick={() => {
                          // Here you would normally trigger an API call
                          setIsEditing(false);
                          alert("Profile Updated Successfully!");
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-xs shadow-lg hover:bg-emerald-700 transition-all active:scale-95"
                      >
                        <Save size={14} /> Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-[#74271E] text-white rounded-2xl font-bold text-xs shadow-lg hover:shadow-[#74271E]/20 transition-all active:scale-95"
                    >
                      <Edit3 size={14} /> Edit Profile
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
                <div className="space-y-8">
                  <DetailItem
                    icon={<User size={16} />}
                    label="First Name"
                    val={profile.firstName}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("firstName", v)}
                  />
                  <DetailItem
                    icon={<User size={16} />}
                    label="Last Name"
                    val={profile.lastName}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("lastName", v)}
                  />
                  <DetailItem
                    icon={<Clock size={16} />}
                    label="Date of Birth"
                    val={profile.dob}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("dob", v)}
                  />
                </div>
                <div className="space-y-8">
                  <DetailItem
                    icon={<Mail size={16} />}
                    label="Email Address"
                    val={profile.email}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("email", v)}
                  />
                  <DetailItem
                    icon={<Smartphone size={16} />}
                    label="Phone Number"
                    val={profile.phone}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("phone", v)}
                  />
                  <DetailItem
                    icon={<MapPin size={16} />}
                    label="Address"
                    val={profile.address}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("address", v)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ... Change Password and Notifications remain the same ... */}
          {activeTab === "change password" && <ChangePasswordView />}
          {activeTab === "notification settings" && (
            <NotificationView
              notifications={notifications}
              setNotifications={setNotifications}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Updated Sub-component for Details Item
const DetailItem = ({ icon, label, val, isEditing, onChange }) => (
  <div className="flex items-start gap-4 group">
    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#f7f1e3] group-hover:text-[#c9a050] transition-colors shrink-0">
      {icon}
    </div>
    <div className="space-y-1 w-full">
      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-[#c9a050] transition-colors">
        {label}
      </p>

      {isEditing ? (
        <input
          type="text"
          value={val}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-base font-bold text-gray-700 border-b-2 border-[#c9a050]/30 focus:border-[#c9a050] outline-none bg-transparent py-1 transition-all"
        />
      ) : (
        <p className="text-base font-bold text-gray-700">{val}</p>
      )}
    </div>
  </div>
);

// Helper Views to keep code clean
const ChangePasswordView = () => (
  <div className="animate-in fade-in slide-in-from-right-4 duration-700 max-w-7xl mx-auto py-4">
    <div className="bg-[#fdfbf7] p-10 rounded-[2.5rem] border border-[#e6d5b8]/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[#74271E]">
        <Lock size={120} />
      </div>
      <div className="relative z-10 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-gray-800">
            Update Credentials
          </h3>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
            Ensure your account remains secure
          </p>
        </div>
        <form className="space-y-6">
          {["Current Password", "New Password", "Confirm Password"].map(
            (label) => (
              <div key={label}>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                  {label}
                </label>
                <input
                  type="password"
                  className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#74271E]/10 text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            ),
          )}
          <button
            type="button"
            className="w-full mt-4 bg-[#74271E] text-white py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-[#5a1e17] transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} /> Save New Credentials
          </button>
        </form>
      </div>
    </div>
  </div>
);

const NotificationView = ({ notifications, setNotifications }) => (
  <div className="animate-in fade-in zoom-in-95 duration-700 space-y-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 border-l-4 border-[#c9a050] pl-4">
          Alert Preferences
        </h3>
        {[
          {
            id: "email",
            label: "Email Notifications",
            desc: "Course updates and academy news",
            icon: <Mail size={18} />,
          },
          {
            id: "sms",
            label: "SMS Alerts",
            desc: "Urgent schedule changes and reminders",
            icon: <Smartphone size={18} />,
          },
          {
            id: "system",
            label: "System Alerts",
            desc: "Internal dashboard notifications",
            icon: <Monitor size={18} />,
          },
        ].map((pref) => (
          <div
            key={pref.id}
            className="flex items-center justify-between p-6 rounded-[2rem] bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-[#c9a050] shadow-sm">
                {pref.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700">{pref.label}</p>
                <p className="text-[10px] text-gray-400 font-medium">
                  {pref.desc}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                setNotifications((prev) => ({
                  ...prev,
                  [pref.id]: !prev[pref.id],
                }))
              }
              className={`w-12 h-6 rounded-full transition-colors relative ${notifications[pref.id] ? "bg-[#74271E]" : "bg-gray-200"}`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications[pref.id] ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
          </div>
        ))}
      </div>
      <div className="bg-[#fdfbf7] p-10 rounded-[3rem] border border-[#e6d5b8]/30 flex flex-col justify-center text-center space-y-6">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-[#c9a050] shadow-sm">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-gray-700 mb-2">
            Privacy Assurance
          </h4>
          <p className="text-xs text-gray-500 leading-relaxed font-medium italic">
            "We respect your peace. Notifications are sent only for essential
            academic progress."
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default Settings;
