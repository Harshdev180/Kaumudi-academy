import { MdSearch } from "react-icons/md";

export default function StudentFilters({ search, setSearch, filter, setFilter }) {

    return (
        <div className="flex flex-wrap justify-between gap-4">

            <div className="relative w-full md:w-[320px]">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search student..."
                    className="w-full pl-10 py-3 rounded-xl bg-[#FBF4E2]"
                />
            </div>

            <div className="flex gap-3 bg-white/40">
                {["All", "Active", "Inactive"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-5 py-2 rounded-lg font-semibold text-sm ${filter === tab
                                ? "bg-[#6b1d14] text-white"
                                : "text-[#856966]"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

        </div>
    )
}
