import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Shield,
  Save,
  X,
  BookOpen,
  Clock,
} from "lucide-react";
import { getProfileMe, updateProfileMe } from "../../lib/api";
import { useAuth } from "../../context/useAuthHook";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    sanskritName: "",
    id: "",
    email: "",
    phone: "",
    location: "",
    joinDate: "",
    level: "Intermediate (Madhyama)",
    bio: "",
  });

  const normalizeProfile = (data) => {
    const firstName = data?.firstName || "";
    const lastName = data?.lastName || "";
    const name =
      data?.name ||
      [firstName, lastName].filter(Boolean).join(" ").trim() ||
      user?.name ||
      "Student";
    const phone = data?.phone || data?.phoneNumber || "";
    const location =
      [data?.city, data?.state].filter(Boolean).join(", ") ||
      data?.address ||
      "";
    const joinDate = data?.createdAt
      ? new Date(data.createdAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "";
    return {
      name,
      sanskritName: data?.sanskritName || "",
      id: data?._id || data?.id || "",
      email: data?.email || user?.email || "",
      phone,
      location,
      joinDate,
      level: data?.level || "Intermediate (Madhyama)",
      bio: data?.bio || "",
    };
  };

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      try {
        const res = await getProfileMe();
        const data = res?.data || res || {};
        if (!active) return;
        setProfile(normalizeProfile(data));
      } catch (error) {
        console.error("Failed to load profile:", error);
        if (active) {
          setProfile((prev) => ({
            ...prev,
            name: user?.name || prev.name,
            email: user?.email || prev.email,
          }));
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadProfile();
    return () => {
      active = false;
    };
  }, [user]);

  const getInitials = (name) => {
    if (!name) return "ST";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const locationParts = profile.location
        ? profile.location.split(",").map((part) => part.trim())
        : [];
      const payload = {
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        address: profile.location || "",
        city: locationParts[0] || undefined,
        state: locationParts[1] || undefined,
      };
      const res = await updateProfileMe(payload);
      const data = res?.data || res || {};

      // Update global auth state
      updateUser({
        name: data.name,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      setProfile(normalizeProfile(data));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 animate-in fade-in duration-700 mt-6">
      {/* TOP SECTION: LARGE CARDS / SMALL TEXT */}
      <div className="grid grid-cols-12 gap-6 mb-10">
        {/* Main Profile Banner (Big Card, Small Text) */}
        <div className="col-span-12 lg:col-span-8 relative bg-[#2a0b08] rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[280px] flex items-end p-10">
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
                onClick={() => {
                  if (isEditing) {
                    handleSaveProfile();
                  } else {
                    setIsEditing(true);
                  }
                }}
                disabled={saving || loading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-[11px] bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all shadow-md uppercase tracking-wider disabled:opacity-60"
              >
                {isEditing ? (
                  <>
                    <Save size={14} /> {saving ? "Saving..." : "Save"}
                  </>
                ) : (
                  <>
                    <Edit3 size={14} />{" "}
                    {loading ? "Loading..." : "Edit Profile"}
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        </div>

        {/* Student Status Card (Big Card, Small Text) */}
        <div className="col-span-12 lg:col-span-4 bg-[#c9a050] rounded-[2.5rem] p-10 text-[#74271E] shadow-xl relative overflow-hidden group flex flex-col justify-center">
          <Shield
            className="absolute -right-4 -bottom-4 text-[#74271E]/5 opacity-20"
            size={140}
          />
          <div className="relative z-10">
            <p className="text-[#74271E]/70 text-[9px] font-black uppercase tracking-[0.2em] mb-2">
              Student Status
            </p>
            <h4 className="text-lg font-serif font-bold mb-6 leading-tight">
              {profile.level}
            </h4>

            <div className="bg-[#74271E]/10 p-4 rounded-2xl border border-[#74271E]/10 backdrop-blur-sm">
              <p className="text-[9px] text-[#74271E]/60 uppercase font-black tracking-widest mb-1">
                Enrollment ID
              </p>
              <p className="font-mono font-bold text-[#74271E] text-sm tracking-widest">
                {profile.id || profile._id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Personal Info (Big Rounded Card) */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-[#1f0e0b] rounded-[2.5rem] p-10 shadow-xl border border-[#c9a050]/15 min-h-[400px]">
            <h3 className="text-xs font-bold text-gray-800 mb-8 flex items-center gap-2 uppercase tracking-widest">
              <User size={16} className="text-[#c9a050]" />
              <span className="text-[#c9a050]">Basic Information</span>
            </h3>

            <div className="space-y-6">
              {[
                {
                  icon: <Mail size={16} />,
                  label: "Email",
                  value: profile.email,
                  name: "email",
                  readOnly: true,
                },
                {
                  icon: <Phone size={16} />,
                  label: "Phone",
                  value: profile.phone,
                  name: "phone",
                },
                {
                  icon: <MapPin size={16} />,
                  label: "Location",
                  value: profile.location,
                  name: "location",
                },
                {
                  icon: <Calendar size={16} />,
                  label: "Joined",
                  value: profile.joinDate,
                  name: "joinDate",
                  readOnly: true,
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="text-[#c9a050] mt-1">{item.icon}</div>
                  <div className="flex-1">
                    <p className="text-[9px] uppercase tracking-widest text-[#c9a050]/70 font-black mb-1">
                      {item.label}
                    </p>
                    {isEditing && !item.readOnly ? (
                      <input
                        name={item.name}
                        value={item.value}
                        onChange={handleInputChange}
                        className="w-full text-xs font-bold text-[#FBF4E2] bg-white/5 border-b border-[#c9a050] focus:outline-none"
                      />
                    ) : (
                      <p className="text-xs font-bold text-[#FBF4E2]">
                        {item.value}
                      </p>
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
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              About Me
            </h3>
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
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  Learning Hours
                </p>
                <p className="text-xl font-black text-gray-800">120</p>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5 flex items-center gap-6 group hover:bg-[#f7f1e3]/20 transition-colors">
              <div className="bg-[#f7f1e3] p-4 rounded-2xl text-[#74271E] group-hover:bg-[#74271E] group-hover:text-white transition-all">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  Active Modules
                </p>
                <p className="text-xl font-black text-gray-800">03</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-[#2a0b08] rounded-[2.5rem] p-10 shadow-xl border border-[#c9a050]/15 text-[#FBF4E2]">
              <div className="text-[#c9a050] text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                स्वयं परिचय
              </div>
              <p className="font-serif text-xl leading-relaxed">
                “मम नाम अर्जुनः। अहं संस्कृतसाहित्यस्य छात्रः। अस्याऽकादम्यां मम
                लक्ष्यं परम्परायाः संरक्षणं प्रोत्साहनं च।”
              </p>
              <div className="mt-6 text-[11px] text-[#c9a050]/80">
                My name is Arjun. I study Sanskrit literature at the Academy. My
                goal is to preserve and promote the tradition.
              </div>
            </div>
            <div className="bg-[#1f0e0b] rounded-[2rem] p-8 shadow-lg border border-[#c9a050]/20">
              <div className="text-[#c9a050] text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                Quick Stats
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#FBF4E2]">Attendance</span>
                  <span className="text-sm font-bold text-[#c9a050]">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#FBF4E2]">Library Books</span>
                  <span className="text-sm font-bold text-[#c9a050]">
                    13/15
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <div className="text-[#c9a050] text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                  Top Achievement
                </div>
                <div className="px-4 py-3 rounded-xl bg-[#c9a050]/15 border border-[#c9a050]/30 text-[#FBF4E2] text-sm font-medium">
                  Vyakarana Merit Scholar
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
