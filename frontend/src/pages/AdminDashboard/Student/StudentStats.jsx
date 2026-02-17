export default function StudentStats({ students }) {

    const total = students.length;
    const active = students.filter(s => s.status === "Active").length;
    const pending = students.filter(s => s.status === "Pending").length;

    const cards = [
        { label: "Total Students", value: total },
        { label: "Active", value: active },
        { label: "Pending", value: pending },
    ]

    return (
        <div className="grid md:grid-cols-3 gap-6">
            {cards.map((c, i) => (
                <div key={i} className="bg-[#FBF4E2] p-6 rounded-2xl border border-[#D1B062]/30">
                    <p className="text-xs text-[#856966]">{c.label}</p>
                    <h3 className="text-3xl font-black text-[#6b1d14]">{c.value}</h3>
                </div>
            ))}
        </div>
    )
}
