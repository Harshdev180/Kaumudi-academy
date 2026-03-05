import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Camera, Loader2, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { registerSuperAdmin, loginSuperAdmin, setAuthToken } from "../../lib/api";
import adminregister from "../../assets/adminregister.webp";
import SEO from "../../components/SEO";

const AdminRegister = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [profilePreview, setProfilePreview] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        secretKey: "",
        image: null,
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // PROFILE IMAGE
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setForm({ ...form, image: file });
        setProfilePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!form.name.trim() || !form.email.trim() || !form.password || !form.phoneNumber.trim() || !form.secretKey.trim()) {
            setError("All fields are required");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setIsLoading(true);
            
            // Register super admin
            const registerRes = await registerSuperAdmin({
                name: form.name,
                email: form.email,
                password: form.password,
                phoneNumber: form.phoneNumber,
                secretKey: form.secretKey,
            });

            // Auto-login after registration
            const loginRes = await loginSuperAdmin(form.email, form.password);
            if (loginRes?.token) {
                localStorage.setItem("kaumudi_token", loginRes.token);
                localStorage.setItem("kaumudi_role", "SUPER_ADMIN");
                localStorage.setItem("kaumudi_user_email", form.email);
                localStorage.setItem("kaumudi_user_name", form.name);
                setAuthToken(loginRes.token);
                navigate("/admin/dashboard");
            } else {
                alert(registerRes?.message || "Registration successful! Please login.");
                navigate("/admin-login");
            }
        } catch (err) {
            const msg = err?.response?.data?.message || "Registration failed. Please try again.";
            setError(msg);
            console.error("Registration error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-[#F4ECE1] flex items-center justify-center px-4"
        >
            <SEO
                title="Admin Register | Kaumudi Sanskrit Academy"
                description="Create an administrator account for Kaumudi Sanskrit Academy."
                canonicalPath="/admin-register"
                robots="noindex, nofollow"
                og={{ type: "website" }}
            />


            {/* MAIN CARD */}
            <div className="w-full max-w-4xl bg-[#F7EFE6] rounded-3xl shadow-xl border border-[#d4af37]/20 overflow-hidden grid md:grid-cols-[45%_55%]">

                {/* LEFT IMAGE PANEL */}
                <div className="relative hidden md:block">
                    <img
                        src={adminregister}
                        alt="Sanskrit Guru"
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#5c1c11]/70 via-[#5c1c11]/30 to-transparent flex items-end p-8">
                        <div className="text-white">
                            <h2 className="text-xl font-semibold">
                                KAUMUDI Sanskrit Academy
                            </h2>
                            <p className="text-xs opacity-80 mt-1">
                                Traditional Knowledge • Modern Administration
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT FORM PANEL */}
                <div className="p-8 md:p-10 flex flex-col justify-center">

                    <h2 className="text-xl font-semibold text-[#7B2C21] mb-1">
                        Admin Registration
                    </h2>
                    <p className="text-sm text-[#9B7C6F] mb-5">
                        Create your administrator account
                    </p>

                    {/* PROFILE IMAGE UPLOAD */}
                    <div className="flex justify-center mb-5">
                        <label className="relative cursor-pointer group">

                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-md">
                                {profilePreview ? (
                                    <img
                                        src={profilePreview}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#EFE3D5]">
                                        <User size={28} className="text-[#A57F6F]" />
                                    </div>
                                )}
                            </div>

                            {/* CAMERA ICON */}
                            <div className="absolute bottom-0 right-0 bg-[#6b1f12] p-1.5 rounded-full text-white shadow">
                                <Camera size={14} />
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* ERROR MESSAGE */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* NAME */}
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A57F6F]" />
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#7B2C21]/20"
                                required
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A57F6F]" />
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#7B2C21]/20"
                                required
                            />
                        </div>

                        {/* PHONE NUMBER */}
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A57F6F]" />
                            <input
                                name="phoneNumber"
                                type="tel"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#7B2C21]/20"
                                required
                            />
                        </div>

                        {/* SECRET KEY */}
                        <div className="relative">
                            <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A57F6F]" />
                            <input
                                name="secretKey"
                                type="password"
                                value={form.secretKey}
                                onChange={handleChange}
                                placeholder="Super Admin Secret Key"
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#7B2C21]/20"
                                required
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A57F6F]" />
                            <input
                                name="password"
                                type={showPass ? "text" : "password"}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#7B2C21]/20"
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A57F6F]"
                            >
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A57F6F]" />
                            <input
                                name="confirmPassword"
                                type="password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#7B2C21]/20"
                                required
                            />
                        </div>

                        {/* REGISTER BUTTON */}
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#6b1f12] hover:bg-[#5c1c11] hover:shadow-lg hover:scale-[1.01] text-white py-2.5 rounded-xl font-semibold transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Create Admin Account"
                            )}
                        </button>
                    </form>

                    {/* LOGIN LINK */}
                    <p className="text-sm text-center text-[#8D6F61] mt-6">
                        Already registered?
                        <span
                            onClick={() => navigate("/admin-login")}
                            className="text-[#7B2C21] font-medium ml-1 cursor-pointer hover:underline"
                        >
                            Login here
                        </span>
                    </p>
                </div>
            </div>
        </motion.div>

    );
};

export default AdminRegister;
