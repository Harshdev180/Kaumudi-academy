import { MdSchool } from "react-icons/md";

export default function StudentHeader({ openAdd }) {

    return (
        <div className="relative rounded-3xl overflow-hidden border border-[#D1B062]/30">

            <div className="absolute inset-0 bg-gradient-to-r from-[#6b1d14] via-[#7a2318] to-[#6b1d14]" />

            <div className="relative px-8 py-8 flex justify-between items-center text-white">

                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                        <MdSchool />
                    </div>

                    <div>
                        <h1 className="text-3xl font-black">Student Management</h1>
                        <p className="text-sm text-white/80">
                            Manage enrollments & academy students.
                        </p>
                    </div>
                </div>


                <button
                    onClick={openAdd}
                    className="px-6 py-3 bg-[#D4AF37] text-[#6b1d14] rounded-xl font-bold shadow-lg hover:scale-[1.03] transition"
                >
                    + Add Student
                </button>

            </div>
        </div>
    )
}
