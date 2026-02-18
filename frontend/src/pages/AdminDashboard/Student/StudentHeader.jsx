import { MdSchool } from "react-icons/md";

function StudentHeader({ openAdd }) {

    return (
        <div
            className="relative overflow-hidden rounded-3xl px-8 py-10 text-white shadow-lg"
            style={{
                background:
                    "linear-gradient(135deg,#7a1f16 0%, #8c2a1e 45%, #6b1d14 100%)",
            }}
        >

            {/* GOLD TEXTURE OVERLAY */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,#D4AF37,transparent_60%)]" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                {/* LEFT */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                        <MdSchool />
                    </div>

                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                            Student Management
                        </h1>
                        <p className="text-sm text-white/90">
                            Manage enrollments & academy students.
                        </p>
                    </div>
                </div>

                

            </div>
        </div>
    );
}

export default StudentHeader;
