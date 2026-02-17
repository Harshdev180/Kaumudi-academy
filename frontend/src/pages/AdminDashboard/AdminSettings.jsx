import React, { useState } from "react";
import {
  MdPerson,
  MdLock,
  MdNotifications,
  MdColorLens,
  MdSave,
  MdCloudUpload,
  MdSettings
} from "react-icons/md";
import { motion } from "framer-motion";

const AdminSettings = () => {

  const palette = {
    primary: "#6b1d14",
    parchment: "#FBF4E2",
    bg: "#F3E6C9",
    gold: "#D1B062",
    textMuted: "#856966"
  };

  // ================= STATE =================

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@kaumudi.com",
    avatar: ""
  });

  const [coursePref, setCoursePref] = useState({
    defaultMode: "ONLINE",
    autoDraft: true,
    defaultVisibility: "Draft"
  });

  const [couponSettings, setCouponSettings] = useState({
    defaultDiscount: 10,
    autoActivate: true,
    expiryAlert: true
  });

  const [notification, setNotification] = useState({
    couponExpire: true,
    newInquiry: true,
    courseInactive: false
  });

  const [branding, setBranding] = useState({
    academyName: "KAUMUDI Sanskrit Academy",
    tagline: "Preserving Tradition through Technology",
    accent: "#6b1d14"
  });

  // ================= HANDLERS =================

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, avatar: URL.createObjectURL(file) });
    }
  };

  const toggle = (state, setState, key) => {
    setState({ ...state, [key]: !state[key] });
  };

  const saveAll = () => {
    alert("Settings Saved Successfully");
  };

  // ================= UI =================

  return (
    <main className="min-h-screen bg-[#F3E6C9] p-8 space-y-8">

      {/* ================= HEADING ================= */}
      <div className="relative rounded-3xl overflow-hidden border border-[#D1B062]/30">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6b1d14] via-[#7a2318] to-[#6b1d14]" />
        <div className="relative px-8 py-8 text-white flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
            <MdSettings />
          </div>

          <div>
            <h1 className="text-3xl font-black">Admin Settings</h1>
            <p className="text-sm text-white/80">
              Control academy behaviour, branding, notifications and system preferences.
            </p>
          </div>
        </div>
      </div>

      {/* ================= PROFILE ================= */}
      <section className="bg-[#FBF4E2] rounded-2xl p-6 border border-[#D1B062]/30 space-y-4">
        <h2 className="font-bold text-[#6b1d14] flex items-center gap-2">
          <MdPerson /> Profile & Security
        </h2>

        <div className="flex items-center gap-6">
          <label className="w-20 h-20 rounded-xl overflow-hidden bg-[#EFE3D5] cursor-pointer">
            {profile.avatar ? (
              <img src={profile.avatar} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MdCloudUpload size={24} />
              </div>
            )}
            <input type="file" hidden onChange={handleAvatar} />
          </label>

          <div className="grid md:grid-cols-2 gap-4 w-full">
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="p-3 rounded-xl bg-[#EFE3D5]"
              placeholder="Admin Name"
            />
            <input
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="p-3 rounded-xl bg-[#EFE3D5]"
              placeholder="Email"
            />
          </div>
        </div>
      </section>

      {/* ================= COURSE PREF ================= */}
      <section className="bg-[#FBF4E2] rounded-2xl p-6 border border-[#D1B062]/30 space-y-4">
        <h2 className="font-bold text-[#6b1d14] flex items-center gap-2">
          <MdLock /> Course Preferences
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <select
            value={coursePref.defaultMode}
            onChange={(e) =>
              setCoursePref({ ...coursePref, defaultMode: e.target.value })
            }
            className="p-3 rounded-xl bg-[#EFE3D5]"
          >
            <option>ONLINE</option>
            <option>OFFLINE</option>
            <option>HYBRID</option>
          </select>

          <select
            value={coursePref.defaultVisibility}
            onChange={(e) =>
              setCoursePref({ ...coursePref, defaultVisibility: e.target.value })
            }
            className="p-3 rounded-xl bg-[#EFE3D5]"
          >
            <option>Draft</option>
            <option>Published</option>
            <option>Hidden</option>
          </select>

          <button
            onClick={() => toggle(coursePref, setCoursePref, "autoDraft")}
            className={`px-4 py-3 rounded-xl ${
              coursePref.autoDraft ? "bg-green-100 text-green-700" : "bg-gray-200"
            }`}
          >
            Auto Draft: {coursePref.autoDraft ? "ON" : "OFF"}
          </button>
        </div>
      </section>

      {/* ================= COUPON SETTINGS ================= */}
      <section className="bg-[#FBF4E2] rounded-2xl p-6 border border-[#D1B062]/30 space-y-4">
        <h2 className="font-bold text-[#6b1d14]">Coupon & Discount Settings</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="number"
            value={couponSettings.defaultDiscount}
            onChange={(e) =>
              setCouponSettings({
                ...couponSettings,
                defaultDiscount: e.target.value
              })
            }
            className="p-3 rounded-xl bg-[#EFE3D5]"
            placeholder="Default Discount %"
          />

          <button
            onClick={() => toggle(couponSettings, setCouponSettings, "autoActivate")}
            className="px-4 py-3 rounded-xl bg-[#EFE3D5]"
          >
            Auto Activate: {couponSettings.autoActivate ? "ON" : "OFF"}
          </button>

          <button
            onClick={() => toggle(couponSettings, setCouponSettings, "expiryAlert")}
            className="px-4 py-3 rounded-xl bg-[#EFE3D5]"
          >
            Expiry Alert: {couponSettings.expiryAlert ? "ON" : "OFF"}
          </button>
        </div>
      </section>

      {/* ================= NOTIFICATION ================= */}
      <section className="bg-[#FBF4E2] rounded-2xl p-6 border border-[#D1B062]/30 space-y-4">
        <h2 className="font-bold text-[#6b1d14] flex items-center gap-2">
          <MdNotifications /> Notification Preferences
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {Object.keys(notification).map((key) => (
            <button
              key={key}
              onClick={() => toggle(notification, setNotification, key)}
              className="px-4 py-3 rounded-xl bg-[#EFE3D5]"
            >
              {key} : {notification[key] ? "ON" : "OFF"}
            </button>
          ))}
        </div>
      </section>

      {/* ================= BRANDING ================= */}
      <section className="bg-[#FBF4E2] rounded-2xl p-6 border border-[#D1B062]/30 space-y-4">
        <h2 className="font-bold text-[#6b1d14] flex items-center gap-2">
          <MdColorLens /> Academy Branding
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            value={branding.academyName}
            onChange={(e) =>
              setBranding({ ...branding, academyName: e.target.value })
            }
            className="p-3 rounded-xl bg-[#EFE3D5]"
            placeholder="Academy Name"
          />

          <input
            value={branding.tagline}
            onChange={(e) =>
              setBranding({ ...branding, tagline: e.target.value })
            }
            className="p-3 rounded-xl bg-[#EFE3D5]"
            placeholder="Tagline"
          />

          <input
            type="color"
            value={branding.accent}
            onChange={(e) =>
              setBranding({ ...branding, accent: e.target.value })
            }
            className="p-3 rounded-xl bg-[#EFE3D5]"
          />
        </div>
      </section>

      {/* ================= SAVE BUTTON ================= */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={saveAll}
        className="flex items-center gap-2 px-8 py-4 text-white rounded-xl shadow-xl"
        style={{ backgroundColor: palette.primary }}
      >
        <MdSave size={20} />
        Save All Settings
      </motion.button>

    </main>
  );
};

export default AdminSettings;
