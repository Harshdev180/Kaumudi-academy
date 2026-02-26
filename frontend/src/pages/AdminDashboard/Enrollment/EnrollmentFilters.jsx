import { useState, useRef, useEffect } from "react";
import { MdSearch, MdKeyboardArrowDown } from "react-icons/md";

function PremiumDropdown({ id, openDropdown, setOpenDropdown, value, setValue, options }) {

    const isOpen = openDropdown === id;

    return (
        <div className="relative min-w-[180px]">

            {/* BUTTON */}
            <button
                onClick={() =>
                    setOpenDropdown(isOpen ? null : id)
                }
                className="
                w-full flex justify-between items-center
                px-4 py-3 rounded-xl
                bg-[#EFE3D5] text-[#6b1d14] font-semibold
                border border-transparent
                focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                "
            >
                {value}
                <MdKeyboardArrowDown
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* DROPDOWN LIST */}
            {isOpen && (
                <div className="
                absolute mt-2 w-full z-50
                bg-[#FBF4E2]
                border border-[#D1B062]/40
                rounded-xl shadow-lg overflow-hidden
                ">
                    {options.map((opt) => (
                        <div
                            key={opt}
                            onClick={() => {
                                setValue(opt);
                                setOpenDropdown(null);
                            }}
                            className={`
                            px-4 py-3 cursor-pointer
                            transition-colors duration-200
                            ${value === opt
                                    ? "text-[#D4AF37] font-semibold"
                                    : "text-[#6b1d14] hover:bg-[#6b1d14] hover:text-[#D4AF37]"
                                }
                            `}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function EnrollmentFilters({ search, setSearch, status, setStatus, course, setCourse, dateRange, setDateRange }) {

    
    const [openDropdown, setOpenDropdown] = useState(null);
    const wrapperRef = useRef(null);

    
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            ref={wrapperRef}
            className="
            bg-[#FBF4E2]
            border border-[#D1B062]/30
            rounded-2xl p-4
            flex flex-wrap items-center gap-3
            "
        >

            {/* SEARCH INPUT */}
            <div className="relative flex-1 min-w-[220px]">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#856966]" />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search student..."
                    className="
                    w-full pl-10 pr-3 py-3 rounded-xl
                    bg-[#EFE3D5]
                    focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                    text-[#6b1d14]
                    "
                />
            </div>

            {/* COURSE FILTER */}
            <PremiumDropdown
                id="course"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                value={course}
                setValue={setCourse}
                options={[
                    "All Courses",
                    "Shlok",
                    "Spoken Sanskrit",
                    "Vyakaran Shastra",
                    "UGC NET",
                    "BA"
                ]}
            />

            {/* STATUS FILTER */}
            <PremiumDropdown
                id="status"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                value={status}
                setValue={setStatus}
                options={[
                    "All Status",
                    "Paid",
                    "Pending"
                ]}
            />

            {/* DATE RANGE */}
            <PremiumDropdown
                id="date"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                value={dateRange}
                setValue={setDateRange}
                options={[
                    "Select Date Range",
                    "Today",
                    "This Week",
                    "This Month"
                ]}
            />
        </div>
    );
}

export default EnrollmentFilters;
