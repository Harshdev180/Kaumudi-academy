export default function StudentStats({ students }) {
  const total = students.length;
  const active = students.filter((s) => s.status === "Active").length;
  const inactive = students.filter((s) => s.status === "Inactive").length;

  const cards = [
    { label: "Total Students", value: total },
    { label: "Active", value: active },
    { label: "Pending", value: inactive },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 -mt-14 relative z-10">
      {cards.map((c, i) => (
        <div
          key={i}
          className="bg-[#FBF4E2] rounded-2xl p-6 shadow-md flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-[#7c5a3c]">{c.label}</p>
            <h3 className="text-3xl font-black text-[#6b1d14]">{c.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
