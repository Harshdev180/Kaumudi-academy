import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdImage } from "react-icons/md";

const AddStudentDrawer = ({
    open,
    onClose,
    form,
    setForm,
    saveStudent,
    editId,
    saving,
    courses
}) => {

    if (!open) return null;

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({
                ...form,
                imageFile: file,
                imagePreview: URL.createObjectURL(file)
            })
        }
    }

    return (
        <AnimatePresence>
            <>
                {/* BACKDROP */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                />

                {/* DRAWER */}
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    className="fixed right-0 top-0 bottom-0 w-full sm:w-[460px]
          bg-[#FBF4E2] rounded-none sm:rounded-l-3xl shadow-2xl z-50 flex flex-col"
                >

                    {/* HEADER */}
                    <div className="flex justify-between items-center p-4 sm:p-6 border-b border-[#D1B062]/30">
                        <h2 className="font-black text-[#6b1d14] text-base sm:text-lg">
                            {editId ? "Edit Student" : "Add New Student"}
                        </h2>

                        <button onClick={onClose} className="p-1 hover:bg-[#6b1d14]/10 rounded-lg transition">
                            <MdClose size={22} />
                        </button>
                    </div>

                    {/* BODY */}
                    <form onSubmit={saveStudent} className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto">

                        {/* IMAGE */}
                        <label className="h-24 sm:h-28 flex items-center justify-center border-2 border-dashed rounded-2xl bg-[#EFE3D5] cursor-pointer hover:bg-[#E8DFD3] transition">
                            {form.imagePreview
                                ? <img src={form.imagePreview} className="h-full rounded-xl object-cover w-full" />
                                : <MdImage size={24} className="text-[#6b1d14]" />
                            }
                            <input hidden type="file" onChange={handleImage} />
                        </label>

                        <input
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={e => setForm({ ...form, firstName: e.target.value })}
                            className="w-full p-3 rounded-xl bg-[#EFE3D5] text-sm"
                            required
                        />

                        <input
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={e => setForm({ ...form, lastName: e.target.value })}
                            className="w-full p-3 rounded-xl bg-[#EFE3D5] text-sm"
                            required
                        />

                        <input
                            placeholder="Email"
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="w-full p-3 rounded-xl bg-[#EFE3D5] text-sm"
                            required
                        />

                        <input
                            placeholder={editId ? "Password (leave blank to keep unchanged)" : "Password"}
                            type="password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            className="w-full p-3 rounded-xl bg-[#EFE3D5] text-sm"
                            required={!editId}
                        />

                        <input
                            placeholder="Phone Number"
                            value={form.phoneNumber}
                            onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                            className="w-full p-3 rounded-xl bg-[#EFE3D5] text-sm"
                        />

                        <select
                            value={form.courseId}
                            onChange={e => setForm({ ...form, courseId: e.target.value })}
                            className="w-full p-3 rounded-xl bg-[#EFE3D5] text-sm"
                        >
                            <option value="">Select Course (optional)</option>
                            {courses?.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3">

                            <select
                                value={form.mode}
                                onChange={e => setForm({ ...form, mode: e.target.value })}
                                className="p-3 rounded-xl bg-[#EFE3D5] text-xs sm:text-sm"
                            >
                                <option>ONLINE</option>
                                <option>OFFLINE</option>
                                <option>HYBRID</option>
                            </select>

                            <select
                                value={form.payment}
                                onChange={e => setForm({ ...form, payment: e.target.value })}
                                className="p-3 rounded-xl bg-[#EFE3D5] text-xs sm:text-sm"
                            >
                                <option>Paid</option>
                                <option>Pending</option>
                            </select>

                        </div>

                        <select
                            value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value })}
                            className="w-full p-3 rounded-xl bg-[#EFE3D5] text-sm"
                        >
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>

                    </form>

                    {/* FOOTER */}
                    <div className="p-4 sm:p-6 border-t border-[#D1B062]/30 flex gap-3 bg-[#FBF4E2]">

                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-[#EFE3D5] text-[#6b1d14] font-semibold text-sm hover:bg-[#E8DFD3] transition"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={saveStudent}
                            disabled={saving}
                            className="flex-1 py-3 rounded-xl text-white font-bold bg-[#6b1d14] text-sm hover:bg-[#7a2517] transition disabled:opacity-60"
                        >
                            {saving ? "Saving..." : editId ? "Update Student" : "Add Student"}
                        </button>

                    </div>

                </motion.div>
            </>
        </AnimatePresence>
    )
}

export default AddStudentDrawer;

