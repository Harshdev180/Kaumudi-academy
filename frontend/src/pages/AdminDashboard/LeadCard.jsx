export default function LeadCard({ name, tag, message, contacted }) {
    return (
        <div
            className={`bg-white p-4 rounded-xl border mb-4
      ${contacted ? "border-primary" : ""}`}
        >
            <span className="text-xs bg-accent text-primary px-2 py-1 rounded">
                {tag}
            </span>

            <h4 className="mt-2 font-semibold">{name}</h4>
            {message && <p className="text-sm text-muted">{message}</p>}
        </div>
    );
}
