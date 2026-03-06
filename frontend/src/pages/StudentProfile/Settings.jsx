import React, { useState } from "react";
import { format } from "date-fns";
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
import { useEffect } from "react";
import {
  getProfileMe,
  updateProfileMe,
  getProfileSettings,
  updateProfileSettings,
  changePassword,
} from "../../lib/api";
import Sanscript from "sanscript";
import { useAuth } from "../../context/useAuthHook";

const Settings = () => {
  const { updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("student details");
  const [isEditing, setIsEditing] = useState(false); // Toggle for Edit mode
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    system: true,
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hindi, setHindi] = useState("");
  const [sanskrit, setSanskrit] = useState("");

  // Handle Input Changes
  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileRes = await getProfileMe();
        const settingsRes = await getProfileSettings();

        setProfile(profileRes.data); // because backend returns { success, data }

        if (settingsRes.data?.notifications) {
          setNotifications({
            email: settingsRes.data.notifications.email ?? true,
            sms: settingsRes.data.notifications.sms ?? false,
            system: settingsRes.data.notifications.courseUpdates ?? true,
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // transliteration helpers placed before any early return to satisfy Hooks rules
  const romanName =
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim();
  const transliterate = async (text) => {
    if (!text) return "";
    try {
      const res = await fetch(
        `https://inputtools.google.com/request?text=${encodeURIComponent(
          text,
        )}&itc=hi-t-i0-und&num=5`,
      );
      const data = await res.json();
      if (data[0] === "SUCCESS") {
        return data[1][0][1][0];
      }
      return text;
    } catch (err) {
      console.error(err);
      return text;
    }
  };
  useEffect(() => {
    if (!romanName) {
      setHindi("");
      setSanskrit("");
      return;
    }
    transliterate(romanName).then((res) => {
      setHindi(res);
      setSanskrit(res);
      if (res) {
        localStorage.setItem("kaumudi_user_name_hindi", res);
        localStorage.setItem("kaumudi_user_name_sanskrit", res);
      }
    });
  }, [romanName]);

  const tabs = ["student details", "change password"];
  if (loading || !profile) {
    return (
      <div className="p-10 text-center text-gray-400">Loading profile...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700 pb-10 ">
      {/* TOP SECTION: Header & Status Card */}
      <div className="grid grid-cols-12 gap-4 sm:gap-6 items-stretch">
        {/* Profile Identity Left */}
        <div className="col-span-12 lg:col-span-8 flex flex-col md:flex-row items-center gap-8 p-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-2 border-[#c9a050] p-1 shadow-xl">
              <div className="w-full h-full bg-[#fdfbf7] rounded-full flex items-center justify-center border border-[#c9a050]/20">
                <span className="text-3xl font-serif font-bold text-[#74271E]">
                  {profile.firstName?.[0]?.toUpperCase()}
                  {profile.lastName?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-serif font-bold text-gray-800 tracking-tight">
              {profile.firstName} {profile.lastName}{" "}
              <span className="text-gray-300 mx-1 sm:mx-2 font-light">/</span>{" "}
              <span className="block sm:inline">{hindi}</span>
            </h2>
            {/* {(hindi || sanskrit) && (
              <p className="text-sm text-gray-500">
                <span className="mr-4">
                  <span className="font-semibold">हिंदी:</span>{" "}
                  <span className="font-serif">{hindi}</span>
                </span>
              </p>
            )} */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
              <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#f7f1e3] text-[#c9a050] text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full border border-[#c9a050]/20">
                Verified Student
              </span>
              <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 text-gray-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full">
                {sanskrit && (
                  <span className="font-serif text-xs">{sanskrit}</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Student Status Card */}
        <div className="col-span-12 lg:col-span-4 bg-[#fdfbf7] rounded-[2rem] p-8 text-[#74271E] shadow-xl relative overflow-hidden group flex flex-col justify-center min-h-[180px]">
          <Shield
            className="absolute -right-4 -bottom-4 text-[#74271E]/5 opacity-20"
            size={120}
          />
          <div className="relative z-10">
            <p className="text-[#74271E]/70 text-[9px] font-black uppercase tracking-[0.2em] mb-2">
              Student Status
            </p>
            <h4 className="text-lg font-serif font-bold mb-6 leading-tight">
              {profile.level}
            </h4>
            <div className="bg-[#74271E]/10 p-3 sm:p-4 rounded-2xl border border-[#74271E]/10 backdrop-blur-sm transition-transform group-hover:scale-[1.02] duration-500">
              <p className="text-[9px] text-[#74271E]/60 uppercase font-black tracking-widest mb-1">
                Enrollment ID
              </p>
              <p className="font-mono font-bold text-[#74271E] text-xs sm:text-sm tracking-widest">
                {profile.enrollmentId || profile.id || profile._id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN SETTINGS CARD WITH TABS */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-black/5 overflow-hidden min-h-[550px]">
        <div className="flex border-b border-gray-100 px-4 sm:px-6 pt-5 bg-gray-50/30 overflow-x-auto no-scrollbar whitespace-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              disabled={isEditing && tab !== "student details"}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-5 text-[12px] font-black uppercase tracking-[0.15em] transition-all relative ${
                activeTab === tab
                  ? "text-[#74271E]"
                  : "text-gray-400 hover:text-gray-600"
              } ${isEditing && tab !== "student details" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-4 right-4 sm:left-8 sm:right-8 h-1 bg-[#74271E] rounded-t-full shadow-[0_-2px_10px_rgba(116,39,30,0.3)]" />
              )}
            </button>
          ))}
        </div>

        <div className="p-10 relative">
          {/* 1. STUDENT DETAILS TAB */}
          {activeTab === "student details" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 sm:space-y-12">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-50 pb-6 sm:pb-8">
                <div>
                  <h3 className="text-xl font-serif font-bold text-gray-800">
                    Personal Identity
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 italic">
                    Manage your verified academic and contact information
                  </p>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-2xl font-bold text-xs hover:bg-gray-200 transition-all active:scale-95"
                      >
                        <X size={14} /> Cancel
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const res = await updateProfileMe(profile);
                            // If backend returns the updated user data in res.data
                            const updatedData = res.data || profile;
                            updateUser({
                              firstName: updatedData.firstName,
                              lastName: updatedData.lastName,
                              email: updatedData.email,
                            });
                            setIsEditing(false);
                            alert("Profile Updated Successfully!");
                          } catch (err) {
                            console.error("Update failed:", err);
                            alert("Failed to update profile");
                          }
                        }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-xs shadow-lg"
                      >
                        <Save size={14} /> Save
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#74271E] text-white rounded-2xl font-bold text-xs shadow-lg"
                    >
                      <Edit3 size={14} /> Edit Profile
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-20 gap-y-8 sm:gap-y-10">
                <div className="space-y-6 sm:space-y-8">
                  <DetailItem
                    icon={<User size={15} />}
                    label="First Name"
                    val={profile.firstName}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("firstName", v)}
                  />
                  <DetailItem
                    icon={<User size={15} />}
                    label="Last Name"
                    val={profile.lastName}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("lastName", v)}
                  />
                  <DetailItem
                    icon={<Clock size={15} />}
                    label="Date of Birth"
                    val={profile.dob}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("dob", v)}
                    inputType="date"
                  />
                </div>
                <div className="space-y-6 sm:space-y-8">
                  <DetailItem
                    icon={<Mail size={15} />}
                    label="Email Address"
                    val={profile.email}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("email", v)}
                    inputType="email"
                  />
                  <DetailItem
                    icon={<Smartphone size={15} />}
                    label="Phone Number"
                    val={profile.phone}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("phone", v)}
                    inputType="tel"
                  />
                  <DetailItem
                    icon={<MapPin size={15} />}
                    label="Address"
                    val={profile.address}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("address", v)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "change password" && <ChangePasswordView />}
          {/* {activeTab === "notification settings" && (
            <NotificationView
              notifications={notifications}
              setNotifications={setNotifications}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, val, isEditing, onChange, inputType }) => (
  <div className="flex items-start gap-4 group">
    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#f7f1e3] group-hover:text-[#c9a050] transition-colors shrink-0">
      {icon}
    </div>
    <div className="space-y-1 w-full min-w-0">
      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-[#c9a050] transition-colors">
        {label}
      </p>

      {isEditing ? (
        inputType === "date" ? (
          <input
            type="date"
            value={
              val
                ? (() => {
                    try {
                      const d = new Date(val);
                      if (Number.isNaN(d.getTime())) return "";
                      return format(d, "yyyy-MM-dd");
                    } catch {
                      return "";
                    }
                  })()
                : ""
            }
            onChange={(e) => onChange(e.target.value)}
            min="1900-01-01"
            max={format(new Date(), "yyyy-MM-dd")}
            className="w-full text-sm sm:text-base font-bold text-gray-700 border-b-2 border-[#c9a050]/30 focus:border-[#c9a050] outline-none bg-transparent py-1 transition-all"
          />
        ) : inputType === "email" ? (
          <input
            type="email"
            value={val || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-sm sm:text-base font-bold text-gray-700 border-b-2 border-[#c9a050]/30 focus:border-[#c9a050] outline-none bg-transparent py-1 transition-all"
            placeholder="name@example.com"
          />
        ) : inputType === "tel" ? (
          <input
            type="tel"
            value={val || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-sm sm:text-base font-bold text-gray-700 border-b-2 border-[#c9a050]/30 focus:border-[#c9a050] outline-none bg-transparent py-1 transition-all"
            placeholder="+91 9876543210"
            pattern="^\\+?\\d{10,15}$"
          />
        ) : (
          <input
            type="text"
            value={val}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-sm sm:text-base font-bold text-gray-700 border-b-2 border-[#c9a050]/30 focus:border-[#c9a050] outline-none bg-transparent py-1 transition-all"
          />
        )
      ) : (
        <p className="text-sm sm:text-base font-bold text-gray-700 break-words">
          {inputType === "date" && val
            ? (() => {
                try {
                  const d = new Date(val);
                  if (Number.isNaN(d.getTime())) return val;
                  return format(d, "dd MMM yyyy");
                } catch {
                  return val;
                }
              })()
            : val}
        </p>
      )}
    </div>
  </div>
);

const ChangePasswordView = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      setError("All password fields are required");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
      });
      setSuccess("Password changed successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700 max-w-7xl mx-auto py-3">
      <div className="bg-[#fdfbf7] p-8 rounded-[2.5rem] border border-[#e6d5b8]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[#74271E]">
          <Lock size={120} />
        </div>
        <div className="relative z-10 space-y-6 sm:space-y-8">
          {/* <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-gray-800">
              Update Credentials
            </h3>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
              Ensure your account remains secure
            </p>
          </div> */}
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm font-medium">
                {success}
              </div>
            )}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handleChange}
                className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#74271E]/10 text-sm font-medium"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#74271E]/10 text-sm font-medium"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#74271E]/10 text-sm font-medium"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[#74271E] text-white py-3.5 sm:py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-[#5a1e17] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                "Changing Password..."
              ) : (
                <>
                  <Save size={18} /> Save New Credentials
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// const NotificationView = ({ notifications, setNotifications }) => (
//   <div className="animate-in fade-in zoom-in-95 duration-700 space-y-6 sm:space-y-10">
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
//       <div className="space-y-4 sm:space-y-6">
//         <h3 className="text-lg sm:text-xl font-bold text-gray-800 border-l-4 border-[#c9a050] pl-4">
//           Alert Preferences
//         </h3>
//         {[
//           {
//             id: "email",
//             label: "Email Notifications",
//             desc: "Course updates and news",
//             icon: <Mail size={18} />,
//           },
//           {
//             id: "sms",
//             label: "SMS Alerts",
//             desc: "Urgent schedule reminders",
//             icon: <Smartphone size={18} />,
//           },
//           {
//             id: "system",
//             label: "System Alerts",
//             desc: "Internal dashboard notes",
//             icon: <Monitor size={18} />,
//           },
//         ].map((pref) => (
//           <div
//             key={pref.id}
//             className="flex items-center justify-between p-5 rounded-[2rem] bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 transition-all group"
//           >
//             <div className="flex items-center gap-4">
//               <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-[#c9a050] shadow-sm">
//                 {pref.icon}
//               </div>
//               <div className="min-w-0">
//                 <p className="text-sm font-bold text-gray-700">{pref.label}</p>
//                 <p className="text-[10px] text-gray-400 font-medium truncate">
//                   {pref.desc}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() =>
//                 setNotifications((prev) => ({
//                   ...prev,
//                   [pref.id]: !prev[pref.id],
//                 }))
//               }
//               className={`w-11 h-6 sm:w-12 sm:h-6 rounded-full transition-colors relative shrink-0 ${notifications[pref.id] ? "bg-[#74271E]" : "bg-gray-200"}`}
//             >
//               <div
//                 className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications[pref.id] ? "translate-x-5 sm:translate-x-6" : "translate-x-0"}`}
//               />
//             </button>
//           </div>
//         ))}
//         <div className="pt-6">
//           <button
//             onClick={async () => {
//               try {
//                 await updateProfileSettings({
//                   notifications: {
//                     email: notifications.email,
//                     sms: notifications.sms,
//                     courseUpdates: notifications.system,
//                   },
//                 });
//                 alert("Notification settings updated!");
//               } catch {
//                 alert("Failed to update settings");
//               }
//             }}
//             className="bg-[#74271E] text-white py-3 px-6 rounded-xl font-bold text-xs shadow-lg"
//           >
//             Save Preferences
//           </button>
//         </div>
//       </div>
//       <div className="bg-[#fdfbf7] p-8 rounded-[3rem] border border-[#e6d5b8]/30 flex flex-col justify-center text-center space-y-6">
//         <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-[#c9a050] shadow-sm">
//           <ShieldCheck size={28} />
//         </div>
//         <div>
//           <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-gray-700 mb-2">
//             Privacy Assurance
//           </h4>
//           <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed font-medium italic">
//             "We respect your peace. Notifications are sent only for essential
//             academic progress."
//           </p>
//         </div>
//       </div>
//     </div>
//   </div>
// );

export default Settings;
