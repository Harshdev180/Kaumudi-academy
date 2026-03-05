import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  BookOpen,
  Award,
  Settings,
  LogOut,
  Edit2,
  Save,
  X,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  GraduationCap,
  Globe,
  Download,
  ExternalLink,
  Clock,
  Star,
  CheckCircle,
  Info,
} from "lucide-react";
import { useAuth } from "../context/useAuthHook";

export default function StudentProfile() {
  const navigate = useNavigate();
  const { user, updateUser, token: authToken, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", { state: { from: "/profile" } });
    }
  }, [isAuthenticated, navigate]);

  const [profile, setProfile] = useState({
    name: "Rajesh Sharma",
    email: "rajesh.sharma@kaumudi.edu",
    phone: "+91 98765 43210",
    dob: "1995-06-15",
    address: "123 Sanskrit Nagar",
    city: "Mysore",
    state: "Karnataka",
    country: "India",
    postalCode: "570001",
    memberSince: "2024-01-15",
    bio: "Dedicated Sanskrit scholar with interest in Paninian grammar and Vedic literature.",
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("enrollments");
  const [formData, setFormData] = useState({ ...profile });
  const [notification, setNotification] = useState(null);

  const tabs = [
    { id: "enrollments", label: "Vidya", sub: "Enrollments", icon: BookOpen },
    { id: "certificates", label: "Pramana", sub: "Certificates", icon: Award },
    { id: "details", label: "Vyaktigatam", sub: "Personal", icon: User },
    { id: "settings", label: "Vinyasa", sub: "Settings", icon: Settings },
  ];

  const displayName = useMemo(() => {
    if (profile.name && profile.name.trim()) return profile.name.trim();
    const parts = [profile.firstName, profile.lastName].filter(Boolean);
    if (parts.length) return parts.join(" ").trim();
    return profile.email?.split("@")[0] || "Student";
  }, [profile.name, profile.firstName, profile.lastName, profile.email]);

  const initials = useMemo(() => {
    const parts = displayName.split(" ").filter(Boolean);
    return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
  }, [displayName]);

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save profile
  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProfile(formData);

    // Update global auth state
    if (formData.name) {
      updateUser({ name: formData.name });
    }

    setEditing(false);
    setSaving(false);
    showNotification("Profile updated successfully!");
  };

  // Fetch data
  useEffect(() => {
    setTimeout(() => {
      setEnrollments([
        {
          id: "ENR-1001",
          courseTitle: "Advanced Paninian Grammar",
          courseSubtitle: "Mahabhashya Study",
          status: "Active",
          progress: 42,
          instructor: "Dr. Rama Sharma",
          image:
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
          nextClass: "2024-02-20T10:00:00",
          completedClasses: 20,
          totalClasses: 48,
          grade: "A",
        },
        {
          id: "ENR-1002",
          courseTitle: "Rigveda Bhashya",
          courseSubtitle: "Foundations of Vedic Chanting",
          status: "Completed",
          progress: 100,
          certificateId: "CERT-987654",
          completionDate: "2023-12-20",
          instructor: "Prof. S. Krishnamurthy",
          image:
            "https://images.unsplash.com/photo-1505664194779-52d5c7a78e4f?w=800",
          finalGrade: "A+",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
              notification.type === "success" ? "bg-green-500" : "bg-yellow-500"
            } text-white`}
          >
            {notification.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <Info size={18} />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-[#74271E] pt-20 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            {/* Profile Image */}
            <div className="h-28 w-28 rounded-full border-4 border-[#D6B15C] bg-white">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-[#D6B15C] to-[#B38B3F] flex items-center justify-center text-3xl font-bold text-[#74271E]">
                {initials}
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs uppercase tracking-wider mb-3">
                <GraduationCap size={14} /> Student
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {displayName}
              </h1>
              <p className="text-white/70">
                Member since {formatDate(profile.memberSince)}
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-all flex items-center gap-2"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </motion.div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-6xl mx-auto px-6 -mt-12">
        <div className="bg-white rounded-2xl shadow-lg p-2 grid grid-cols-2 md:grid-cols-4 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? "bg-[#74271E] text-white"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <tab.icon size={18} />
                <span className="text-xs font-medium">{tab.label}</span>
                <span className="text-[10px] opacity-70">{tab.sub}</span>
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Enrollments Tab */}
          {/* 1. ENROLLMENTS TAB */}
          {activeTab === "enrollments" && (
            <motion.div
              key="enrollments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#74271E]">
                  Current Vidya
                </h2>
                <div className="h-px flex-1 mx-8 bg-[#74271E]/10 hidden md:block" />
                <button className="text-[#D6B15C] font-medium text-sm hover:underline">
                  View All Courses
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-500">
                  Loading courses...
                </div>
              ) : enrollments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No enrollments found
                </div>
              ) : (
                <div className="grid gap-4">
                  {enrollments.map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-center"
                    >
                      {/* Course Image */}
                      <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={course.image}
                          alt={course.courseTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Course Details */}
                      <div className="flex-1 space-y-2 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider ${
                              course.status === "Active"
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {course.status}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            {course.id}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-[#74271E]">
                          {course.courseTitle}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {course.courseSubtitle}
                        </p>

                        <p className="text-xs text-gray-500">
                          Instructor: {course.instructor}
                        </p>

                        {/* Progress Bar */}
                        <div className="pt-2 max-w-md">
                          <div className="flex justify-between text-[10px] font-medium uppercase mb-1 text-gray-500">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${course.progress}%` }}
                              className="h-full bg-[#74271E]"
                            />
                          </div>
                        </div>

                        {/* Next Class Info */}
                        {course.status === "Active" && course.nextClass && (
                          <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-gray-500">
                            <span>
                              Next class:{" "}
                              {new Date(course.nextClass).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <button className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-[#74271E] text-white font-medium text-sm shadow-sm hover:bg-[#5e1f18] transition-all flex items-center justify-center gap-2">
                        {course.status === "Active"
                          ? "Continue Learning"
                          : "View Course"}
                        <ChevronRight size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Certificates Tab */}
          {activeTab === "certificates" && (
            <motion.div
              key="certificates"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-xl font-bold text-[#74271E] mb-4">
                My Certificates
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {enrollments
                  .filter((e) => e.status === "Completed")
                  .map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                    >
                      <Award className="w-12 h-12 text-[#D6B15C] mb-3" />
                      <h3 className="font-bold text-[#74271E] mb-1">
                        {cert.courseTitle}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Completed on {cert.completionDate}
                      </p>

                      <div className="text-sm mb-4">
                        <p className="text-gray-600">
                          Certificate ID:{" "}
                          <span className="font-mono">
                            {cert.certificateId}
                          </span>
                        </p>
                        <p className="text-gray-600">
                          Grade:{" "}
                          <span className="font-medium text-green-600">
                            {cert.finalGrade}
                          </span>
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 px-3 py-2 bg-[#74271E] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                          <Download size={14} /> Download
                        </button>
                        <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                          <ExternalLink size={14} /> Verify
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Personal Details Tab */}
          {activeTab === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#74271E]">
                    Personal Information
                  </h2>
                  <button
                    onClick={() =>
                      editing ? setEditing(false) : setEditing(true)
                    }
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      editing
                        ? "bg-gray-100 text-gray-600"
                        : "bg-[#74271E] text-white"
                    }`}
                  >
                    {editing ? <X size={16} /> : <Edit2 size={16} />}
                    {editing ? "Cancel" : "Edit"}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <ProfileField
                    label="Full Name"
                    name="name"
                    value={editing ? formData.name : profile.name}
                    icon={User}
                    editing={editing}
                    onChange={handleInputChange}
                  />
                  <ProfileField
                    label="Email"
                    name="email"
                    value={editing ? formData.email : profile.email}
                    icon={Mail}
                    editing={editing}
                    onChange={handleInputChange}
                  />
                  <ProfileField
                    label="Phone"
                    name="phone"
                    value={editing ? formData.phone : profile.phone}
                    icon={Phone}
                    editing={editing}
                    onChange={handleInputChange}
                  />
                  <ProfileField
                    label="Date of Birth"
                    name="dob"
                    value={editing ? formData.dob : profile.dob}
                    icon={Calendar}
                    editing={editing}
                    onChange={handleInputChange}
                  />
                  <ProfileField
                    label="Address"
                    name="address"
                    value={editing ? formData.address : profile.address}
                    icon={MapPin}
                    editing={editing}
                    onChange={handleInputChange}
                  />
                  <ProfileField
                    label="City"
                    name="city"
                    value={editing ? formData.city : profile.city}
                    icon={MapPin}
                    editing={editing}
                    onChange={handleInputChange}
                  />
                  <ProfileField
                    label="State"
                    name="state"
                    value={editing ? formData.state : profile.state}
                    icon={MapPin}
                    editing={editing}
                    onChange={handleInputChange}
                  />
                  <ProfileField
                    label="Country"
                    name="country"
                    value={editing ? formData.country : profile.country}
                    icon={Globe}
                    editing={editing}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                    Bio
                  </label>
                  {editing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74271E]"
                    />
                  ) : (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {profile.bio}
                    </p>
                  )}
                </div>

                {/* Save Button */}
                {editing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6"
                  >
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="w-full px-4 py-3 bg-[#74271E] text-white rounded-lg font-medium hover:bg-[#5e1f18] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save size={16} /> Save Changes
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-xl font-bold text-[#74271E] mb-4">
                Settings
              </h2>

              <div className="space-y-4">
                {/* Notifications */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="font-bold text-[#74271E] mb-4">
                    Notifications
                  </h3>
                  <div className="space-y-3">
                    <ToggleItem
                      label="Email Notifications"
                      defaultChecked={true}
                    />
                    <ToggleItem
                      label="SMS Notifications"
                      defaultChecked={false}
                    />
                    <ToggleItem label="Course Updates" defaultChecked={true} />
                  </div>
                </div>

                {/* Security */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="font-bold text-[#74271E] mb-4">Security</h3>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between">
                    <span className="text-sm">Change Password</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between">
                    <span className="text-sm">Two-Factor Authentication</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="font-bold text-[#74271E] mb-4">Preferences</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        Language
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                        <option>Sanskrit</option>
                        <option>English</option>
                        <option>Hindi</option>
                      </select>
                    </div>
                    <ToggleItem label="Dark Mode" defaultChecked={false} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Helper Components

function ProfileField({ label, name, value, icon: Icon, editing, onChange }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[#D6B15C] mb-1">
        <Icon size={14} />
        <span className="text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      {editing ? (
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74271E] text-sm"
        />
      ) : (
        <p className="text-gray-800 font-medium">{value || "Not provided"}</p>
      )}
    </div>
  );
}

function ToggleItem({ label, defaultChecked }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          checked ? "bg-[#74271E]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}
