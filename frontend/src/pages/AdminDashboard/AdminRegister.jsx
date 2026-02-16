import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AdminRegister = () => {
    const navigate = useNavigate();

    const [showPass, setShowPass] = useState(false);
    const [profilePreview, setProfilePreview] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-[#F4ECE1] flex items-center justify-center px-4"
        >


            {/* MAIN CARD */}
            <div className="w-full max-w-4xl bg-[#F7EFE6] rounded-3xl shadow-xl border border-[#d4af37]/20 overflow-hidden grid md:grid-cols-[45%_55%]">

                {/* LEFT IMAGE PANEL */}
                <div className="relative hidden md:block">
                    <img
                        src="https://i.pinimg.com/736x/66/99/b5/6699b5c6934f090a7cfffd43f387af24.jpg"
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

                        {/* NAME */}
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A57F6F]" />
                            <input
                                name="name"
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#7B2C21]/20"
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A57F6F]" />
                            <input
                                name="email"
                                type="email"
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#7B2C21]/20"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A57F6F]" />
                            <input
                                name="password"
                                type={showPass ? "text" : "password"}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#7B2C21]/20"
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
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#EFE3D5] outline-none focus:ring-2 focus:ring-[#7B2C21]/20"
                            />
                        </div>

                        {/* REGISTER BUTTON */}
                        <button className="w-full bg-[#6b1f12] hover:bg-[#5c1c11] hover:shadow-lg hover:scale-[1.01] text-white py-2.5 rounded-xl font-semibold transition">
                            Create Admin Account
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
