import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdImage } from "react-icons/md";

const AddStudentDrawer = ({
    open,
    onClose,
    form,
    setForm,
    saveStudent
}) => {

    if (!open) return null;

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, image: URL.createObjectURL(file) })
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
                    className="fixed right-6 top-6 bottom-6 w-[460px]
          bg-[#FBF4E2] rounded-3xl shadow-2xl z-50 flex flex-col"
                >

                    {/* HEADER */}
                    <div className="flex justify-between items-center p-6 border-b border-[#D1B062]/30">
                        <h2 className="font-black text-[#6b1d14] text-lg">
                            Add New Student
                        </h2>

                        <button onClick={onClose}>
                            <MdClose size={22} />
                        </button>
                    </div>

                    {/* BODY */}
                    <form onSubmit={saveStudent} className="flex-1 p-6 space-y-5 overflow-y-auto">

                        {/* IMAGE */}
                        <label className="h-28 flex items-center justify-center border-2 border-dashed rounded-2xl bg-[#EFE3D5] cursor-pointer">
                            {form.image
                                ? <img src={form.image} className="h-full rounded-xl" />
                                : <MdImage size={26} />
                            }
                            <input hidden type="file" onChange={handleImage} />
                        </label>

                        <input
                            placeholder="Student Name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full p-3 rounded-xl bg-[#EFE3D5]"
                            required
                        />

                        <input
                            placeholder="Course Name"
                            value={form.course}
                            onChange={e => setForm({ ...form, course: e.target.value })}
                            className="w-full p-3 rounded-xl bg-[#EFE3D5]"
                        />

                        <div className="grid grid-cols-2 gap-3">

                            <select
                                value={form.mode}
                                onChange={e => setForm({ ...form, mode: e.target.value })}
                                className="p-3 rounded-xl bg-[#EFE3D5]"
                            >
                                <option>ONLINE</option>
                                <option>OFFLINE</option>
                                <option>HYBRID</option>
                            </select>

                            <select
                                value={form.payment}
                                onChange={e => setForm({ ...form, payment: e.target.value })}
                                className="p-3 rounded-xl bg-[#EFE3D5]"
                            >
                                <option>Paid</option>
                                <option>Pending</option>
                            </select>

                        </div>

                        <select
                            value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value })}
                            className="w-full p-3 rounded-xl bg-[#EFE3D5]"
                        >
                            <option>Active</option>
                            <option>Pending</option>
                            <option>Inactive</option>
                        </select>

                    </form>

                    {/* FOOTER */}
                    <div className="p-6 border-t border-[#D1B062]/30 flex gap-3">

                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-[#EFE3D5]"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={saveStudent}
                            className="flex-1 py-3 rounded-xl text-white font-bold bg-[#6b1d14]"
                        >
                            Add Student
                        </button>

                    </div>

                </motion.div>
            </>
        </AnimatePresence>
    )
}

export default AddStudentDrawer;
    