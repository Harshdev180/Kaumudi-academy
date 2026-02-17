import { useEffect, useMemo, useState } from "react";
import { getMyEnrollments, setAuthToken, updateStudentProfile } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StudentProfile() {
  const navigate = useNavigate();
  const { user, token: authToken, isAuthenticated } = useAuth();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", { state: { from: "/profile" } });
    }
  }, [isAuthenticated, navigate]);
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    preferredMode: "ONLINE",
    newsletter: true,
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  const initials = useMemo(() => {
    const n = (profile.name || "").trim();
    if (!n) return "ST";
    const parts = n.split(" ").filter(Boolean);
    const a = parts[0]?.[0] || "";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase();
  }, [profile.name]);

  const stats = useMemo(() => {
    const total = enrollments.length;
    const active = enrollments.filter(
      (e) => (e.status || "").toLowerCase() === "active",
    ).length;
    const completed = enrollments.filter(
      (e) => (e.status || "").toLowerCase() === "completed",
    ).length;
    const avg =
      total === 0
        ? 0
        : Math.round(
            enrollments.reduce(
              (sum, e) =>
                sum + (typeof e.progress === "number" ? e.progress : 0),
              0,
            ) / total,
          );
    return { total, active, completed, avg };
  }, [enrollments]);

  useEffect(() => {
    if (authToken) setAuthToken(authToken);
    const storedProfileRaw = localStorage.getItem("kaumudi_user_profile");
    const storedName = localStorage.getItem("kaumudi_user_name");
    const storedEmail = localStorage.getItem("kaumudi_user_email");
    const nameFromAuth = user
      ? (user.firstName || user.name
          ? `${user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.name}`.trim()
          : null)
      : null;

    if (storedProfileRaw) {
      try {
        const storedProfile = JSON.parse(storedProfileRaw);
        setProfile((prev) => ({ ...prev, ...storedProfile }));
      } catch {
        // ignore malformed storage
      }
    } else {
      setProfile((prev) => ({
        ...prev,
        name: nameFromAuth || storedName || prev.name,
        email: user?.email || storedEmail || prev.email,
      }));
    }
    // No local dummy fallback — prefer empty list if backend has no enrollments
    const load = async () => {
      setError("");
      try {
        const e = await getMyEnrollments();
        const items = Array.isArray(e) ? e : e?.data || [];
        const mapped = items.map((enr) => ({
          id: enr._id,
          courseId: enr.course?._id || enr.courseId,
          courseTitle: enr.course?.title || enr.courseTitle,
          status: "Active",
          progress: 0
        }));
        // Use the real (possibly empty) mapped enrollments from backend
        setEnrollments(mapped);
      } catch (err) {
        const msg = err?.response?.data?.message || "Unable to load profile";
        setError(msg);
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setError("");
    setSuccess("");
    if (!profile.name || !profile.email) {
      setError("Name and email are required");
      return;
    }
    try {
      setSaving(true);
      const nextProfile = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        dob: profile.dob,
        address1: profile.address1,
        address2: profile.address2,
        city: profile.city,
        state: profile.state,
        postalCode: profile.postalCode,
        country: profile.country,
        preferredMode: profile.preferredMode,
        newsletter: profile.newsletter,
      };

      // Try to persist to backend first. If backend doesn't expose the endpoint,
      // fall back to localStorage and inform the user.
      try {
        const res = await updateStudentProfile(nextProfile);
        if (res && res.success) {
          setSuccess("Profile updated on server");
        } else {
          // backend returned non-success payload
          localStorage.setItem("kaumudi_user_profile", JSON.stringify(nextProfile));
          localStorage.setItem("kaumudi_user_name", profile.name);
          localStorage.setItem("kaumudi_user_email", profile.email);
          setSuccess("Profile saved locally (server did not accept update)");
        }
      } catch (apiErr) {
        // Likely no backend endpoint or network/auth issue — save locally and show message
        const serverMsg = apiErr?.response?.data?.message;
        localStorage.setItem("kaumudi_user_profile", JSON.stringify(nextProfile));
        localStorage.setItem("kaumudi_user_name", profile.name);
        localStorage.setItem("kaumudi_user_email", profile.email);
        setSuccess(
          serverMsg
            ? `Saved locally — server error: ${serverMsg}`
            : "Saved locally — server endpoint unavailable",
        );
      }

      setEditing(false);
    } catch (err) {
      const msg = err?.response?.data?.message || "Update failed";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1e4c8] font-serif text-[#2D2417] selection:bg-[#B38B3F] selection:text-white pb-16">
      <header className="px-4 lg:px-10 pt-8 pb-8 max-w-screen-2xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#74271E] via-[#6b1d14] to-[#B38B3F] p-6 md:p-8 shadow-xl text-white">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="size-16 md:size-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-xl md:text-2xl font-black">
                {initials}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-[0.3em] opacity-80">
                Student Profile
              </div>
              <div className="mt-1 font-bold text-2xl md:text-3xl tracking-tight">
                {profile.name || "Student"}
              </div>
              <div className="text-sm opacity-85">{profile.email || "—"}</div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate("/allcourses")}
                className="px-5 py-2 rounded-full bg-white text-[#74271E] font-bold text-sm shadow-lg"
              >
                Browse Courses
              </button>
              <button
                onClick={() => setTab("details")}
                className="px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm"
              >
                Edit Profile
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
              <div className="text-xs uppercase tracking-widest opacity-80">
                Total
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
              <div className="text-xs uppercase tracking-widest opacity-80">
                Active
              </div>
              <div className="text-2xl font-bold">{stats.active}</div>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
              <div className="text-xs uppercase tracking-widest opacity-80">
                Completed
              </div>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
              <div className="text-xs uppercase tracking-widest opacity-80">
                Avg Progress
              </div>
              <div className="text-2xl font-bold">{stats.avg}%</div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 lg:px-10 max-w-screen-2xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "overview", label: "Overview" },
            { key: "details", label: "Details" },
            { key: "enrollments", label: "Enrollments" },
            { key: "certificates", label: "Certificates" },
            { key: "settings", label: "Settings" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === t.key
                  ? "bg-[#74271E] text-white shadow-md shadow-[#74271E]/20"
                  : "bg-[#FBF4E2] text-[#6B5A3E] border border-[#E2D4A6] hover:border-[#B38B3F]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#FBF4E2] rounded-3xl border border-[#E2D4A6]/60 p-8 shadow-sm">
              <div className="text-xl font-bold mb-4">Recent Enrollments</div>
              {loading ? (
                <div className="text-[#8B6D31]">Loading...</div>
              ) : enrollments.length ? (
                <div className="space-y-4">
                  {enrollments.slice(0, 5).map((enr, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#E2D4A6]"
                    >
                      <div>
                        <div className="font-bold">
                          {enr.courseTitle || enr.title}
                        </div>
                        <div className="text-xs text-[#8B6D31]">
                          ID: {enr.id || enr.courseId}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-[#E2D4A6] text-[#74271E]">
                          {enr.status || "Active"}
                        </span>
                        <div className="w-28 bg-[#EDE4CF] rounded-full h-2">
                          <div
                            className="bg-[#74271E] h-2 rounded-full"
                            style={{ width: `${enr.progress ?? 0}%` }}
                          />
                        </div>
                        <button
                          onClick={() =>
                            navigate(`/coursedetail/${enr.courseId}`, {
                              state: {
                                course: {
                                  id: enr.courseId,
                                  title: enr.courseTitle,
                                },
                              },
                            })
                          }
                          className="px-3 py-2 rounded-xl bg-[#74271E] text-white text-xs font-bold"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[#8B6D31]">No enrollments found</div>
              )}
            </div>
            <div className="bg-[#FBF4E2] rounded-3xl border border-[#E2D4A6]/60 p-8 shadow-sm">
              <div className="text-xl font-bold mb-4">Quick Actions</div>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/allcourses")}
                  className="w-full px-5 py-3 rounded-xl bg-[#74271E] text-white font-bold"
                >
                  Explore Courses
                </button>
                <button
                  onClick={() => setTab("details")}
                  className="w-full px-5 py-3 rounded-xl bg-white border border-[#E2D4A6] text-[#74271E] font-bold"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-[#FBF4E2] rounded-3xl border border-[#E2D4A6]/60 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#2D2417]">Basic Info</h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 rounded-xl bg-[#74271E] text-white text-sm font-bold"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 rounded-xl border border-[#E2D4A6] text-[#74271E] text-sm font-bold bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 rounded-xl bg-[#B38B3F] text-white text-sm font-bold disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>
              {error && (
                <div className="text-red-700 text-sm font-semibold mb-4">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-700 text-sm font-semibold mb-4">
                  {success}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-[#8B6D31] uppercase tracking-[0.15em] mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E6DDC8] text-sm outline-none focus:border-[#B38B3F] disabled:bg-[#FCF8EE]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8B6D31] uppercase tracking-[0.15em] mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E6DDC8] text-sm outline-none focus:border-[#B38B3F] disabled:bg-[#FCF8EE]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8B6D31] uppercase tracking-[0.15em] mb-2 block">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E6DDC8] text-sm outline-none focus:border-[#B38B3F] disabled:bg-[#FCF8EE]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8B6D31] uppercase tracking-[0.15em] mb-2 block">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={profile.dob}
                    onChange={(e) =>
                      setProfile({ ...profile, dob: e.target.value })
                    }
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E6DDC8] text-sm outline-none focus:border-[#B38B3F] disabled:bg-[#FCF8EE]"
                  />
                </div>
              </div>
            </section>
            <section className="bg-[#FBF4E2] rounded-3xl border border-[#E2D4A6]/60 p-8 shadow-sm">
              <div className="text-xl font-bold mb-6">
                Address & Preferences
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-[#8B6D31] uppercase tracking-[0.15em] mb-2 block">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={profile.address1}
                    onChange={(e) =>
                      setProfile({ ...profile, address1: e.target.value })
                    }
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E6DDC8] text-sm outline-none focus:border-[#B38B3F] disabled:bg-[#FCF8EE]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8B6D31] uppercase tracking-[0.15em] mb-2 block">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={profile.address2}
                    onChange={(e) =>
                      setProfile({ ...profile, address2: e.target.value })
                    }
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E6DDC8] text-sm outline-none focus:border-[#B38B3F] disabled:bg-[#FCF8EE]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#8B6D31] uppercase tracking-[0.15em] mb-2 block">
                      City
                    </label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) =>
                        setProfile({ ...profile, city: e.target.value })
                      }
                      disabled={!editing}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E6DDC8] text-sm outline-none focus:border-[#B38B3F] disabled:bg-[#FCF8EE]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#8B6D31] uppercase tracking-[0.15em] mb-2 block">
                      State
                    </label>
                    <input
                      type="text"
                      value={profile.state}
                      onChange={(e) =>
                        setProfile({ ...profile, state: e.target.value })
                      }
                      disabled={!editing}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E6DDC8] text-sm outline-none focus:border-[#B38B3F] disabled:bg-[#FCF8EE]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#8B6D31] uppercase tracking-[0.15em] mb-2 block">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={profile.postalCode}
                      onChange={(e) =>
                        setProfile({ ...profile, postalCode: e.target.value })
                      }
                      disabled={!editing}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E6DDC8] text-sm outline-none focus:border-[#B38B3F] disabled:bg-[#FCF8EE]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#8B6D31] uppercase tracking-[0.15em] mb-2 block">
                      Country
                    </label>
                    <input
                      type="text"
                      value={profile.country}
                      onChange={(e) =>
                        setProfile({ ...profile, country: e.target.value })
                      }
                      disabled={!editing}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E6DDC8] text-sm outline-none focus:border-[#B38B3F] disabled:bg-[#FCF8EE]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#8B6D31] uppercase tracking-[0.15em] mb-2 block">
                      Preferred Mode
                    </label>
                    <select
                      value={profile.preferredMode}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          preferredMode: e.target.value,
                        })
                      }
                      disabled={!editing}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E6DDC8] text-sm outline-none focus:border-[#B38B3F] disabled:bg-[#FCF8EE]"
                    >
                      <option value="ONLINE">Online</option>
                      <option value="OFFLINE">Offline</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-[12px] font-bold text-[#8B6D31]">
                      <input
                        type="checkbox"
                        checked={profile.newsletter}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            newsletter: e.target.checked,
                          })
                        }
                        disabled={!editing}
                        className="w-4 h-4"
                      />
                      Subscribe to updates
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {tab === "enrollments" && (
          <section className="bg-[#FBF4E2] rounded-3xl border border-[#E2D4A6]/60 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#2D2417]">Enrollments</h2>
              <button
                onClick={() => navigate("/allcourses")}
                className="px-4 py-2 rounded-xl border border-[#E2D4A6] text-[#74271E] text-sm font-bold bg-white"
              >
                Enroll More
              </button>
            </div>
            {loading ? (
              <div className="text-[#8B6D31]">Loading...</div>
            ) : enrollments && enrollments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-[11px] font-black uppercase text-[#6b1d14] tracking-[0.2em] border-b border-[#D1B062]/80">
                      <th className="px-4 py-3 text-left">Course</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Progress</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D1B062]/10">
                    {enrollments.map((enr, i) => (
                      <tr key={i} className="hover:bg-white/60 transition-all">
                        <td className="px-4 py-4">
                          <div className="font-bold">
                            {enr.title || enr.courseTitle}
                          </div>
                          <div className="text-xs text-[#8B6D31]">
                            ID: {enr.id || enr.courseId}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-[#E2D4A6] text-[#74271E]">
                            {enr.status || "Active"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="w-full bg-[#EDE4CF] rounded-full h-2">
                            <div
                              className="bg-[#74271E] h-2 rounded-full"
                              style={{ width: `${enr.progress ?? 0}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() =>
                              navigate(`/coursedetail/${enr.courseId}`, {
                                state: {
                                  course: {
                                    id: enr.courseId,
                                    title: enr.courseTitle,
                                  },
                                },
                              })
                            }
                            className="px-4 py-2 rounded-xl bg-[#74271E] text-white text-xs font-bold"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-[#8B6D31]">No enrollments found</div>
            )}
          </section>
        )}

        {tab === "certificates" && (
          <section className="bg-[#FBF4E2] rounded-3xl border border-[#E2D4A6]/60 p-8 shadow-sm">
            <div className="text-xl font-bold mb-6">Certificates</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(enrollments || [])
                .filter((e) => (e.status || "").toLowerCase() === "completed")
                .map((e, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white border border-[#E2D4A6] p-6"
                  >
                    <div className="font-bold text-[#74271E]">
                      {e.courseTitle || e.title}
                    </div>
                    <div className="text-xs text-[#8B6D31] mt-1">
                      Certificate ID:{" "}
                      {e.certificateId || `CERT-${e.courseId || e.id || idx}`}
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        className="px-4 py-2 rounded-xl bg-[#74271E] text-white text-xs font-bold"
                        onClick={() =>
                          navigate(`/coursedetail/${e.courseId}`, {
                            state: {
                              course: { id: e.courseId, title: e.courseTitle },
                            },
                          })
                        }
                      >
                        View Course
                      </button>
                      <button className="px-4 py-2 rounded-xl border border-[#E2D4A6] text-[#74271E] text-xs font-bold bg-white">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              {(enrollments || []).filter(
                (e) => (e.status || "").toLowerCase() === "completed",
              ).length === 0 && (
                <div className="text-[#8B6D31]">No certificates available</div>
              )}
            </div>
          </section>
        )}

        {tab === "settings" && (
          <section className="bg-[#FBF4E2] rounded-3xl border border-[#E2D4A6]/60 p-8 shadow-sm">
            <div className="text-xl font-bold mb-6">Settings</div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#8B6D31] uppercase tracking-[0.15em] mb-2 block">
                    Preferred Mode
                  </label>
                  <select
                    value={profile.preferredMode}
                    onChange={(e) =>
                      setProfile({ ...profile, preferredMode: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E6DDC8] text-sm outline-none focus:border-[#B38B3F]"
                  >
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-[12px] font-bold text-[#8B6D31]">
                    <input
                      type="checkbox"
                      checked={profile.newsletter}
                      onChange={(e) =>
                        setProfile({ ...profile, newsletter: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    Subscribe to updates
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  className="px-5 py-3 rounded-xl bg-[#74271E] text-white font-bold"
                >
                  Save Settings
                </button>
                <button
                  onClick={() => setTab("overview")}
                  className="px-5 py-3 rounded-xl bg-white border border-[#E2D4A6] text-[#74271E] font-bold"
                >
                  Back to Overview
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
