export default function LeadDetails() {
    return (
        <aside className="w-96 bg-white border-l p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center font-bold">
                    AS
                </div>
                <div>
                    <h4 className="font-semibold">Aryan Sharma</h4>
                    <p className="text-xs text-muted">Inquired on Oct 24, 2023</p>
                </div>
            </div>

            <div className="space-y-3 text-sm">
                <div><b>Email:</b> aryan@gmail.com</div>
                <div><b>Phone:</b> +91 98765 43210</div>
                <div><b>Course:</b> Advanced Paninian Grammar</div>
            </div>

            <textarea
                placeholder="Add a note..."
                className="w-full border rounded-lg p-3 mt-6"
            />

            <button className="w-full mt-4 bg-primary text-white py-3 rounded-lg">
                Mark Contacted
            </button>
        </aside>
    );
}
