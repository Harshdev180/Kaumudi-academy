import { Check, Shield, Ticket } from "lucide-react";

export default function CourseSidebar() {
  return (
    <aside className="space-y-6 ">
      {/* PRICE CARD */}
      <div className="bg-[#FFF8F0] rounded-2xl border border-[#eee] p-6 space-y-5">
        {/* Offer row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide bg-[#f6eaea] text-[#6b1d14] px-3 py-1 rounded-full">
            EARLY BIRD OFFER
          </span>
          <span className="text-xs bg-[#fdecec] text-[#b42318] px-3 py-1 rounded-full">
            Ends in 2 Days
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold text-[#6b1d14]">₹299</span>
          <span className="line-through text-sm text-gray-400">₹549</span>
          <span className="text-sm font-semibold text-green-600">45% OFF</span>
        </div>

        {/* Promo */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-[#6b1d14]">
            <Ticket size={16} />
            Apply Promo Code
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b1d14]/20"
              placeholder="KAUMUDI2024"
            />
            <button className="px-4 rounded-lg border border-[#6b1d14] text-[#6b1d14] text-sm font-medium hover:bg-[#6b1d14] hover:text-white transition">
              Apply
            </button>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full bg-[#6b1d14] hover:bg-[#541610] transition text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
          Enroll Now & Start Learning →
        </button>

        <button className="w-full bg-[#6b1d14] hover:bg-[#541610] transition text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
          Contact Academy
        </button>

        {/* Included */}
        <div className="pt-4 border-t space-y-3">
          <p className="text-sm font-semibold">What’s included:</p>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2 items-start">
              <Check size={16} className="text-[#6b1d14] mt-0.5" />
              Lifetime access to recorded lectures
            </li>
            <li className="flex gap-2 items-start">
              <Check size={16} className="text-[#6b1d14] mt-0.5" />
              Digital Sanskrit Dictionary & Resource Pack
            </li>
            <li className="flex gap-2 items-start">
              <Check size={16} className="text-[#6b1d14] mt-0.5" />
              Direct access to instructor via Discord
            </li>
            <li className="flex gap-2 items-start">
              <Check size={16} className="text-[#6b1d14] mt-0.5" />
              Authenticated Certification on completion
            </li>
          </ul>
        </div>
      </div>

      {/* TRUST CARD */}
      <div className="bg-[#FAF5EE] rounded-2xl p-6 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center">
          <Shield className="text-[#6b1d14]" />
        </div>
        <p className="font-semibold text-sm">Academy Verified Trust</p>
        <p className="text-xs text-gray-600">
          100% Secure Checkout & 14-day Refund Policy
        </p>
      </div>
    </aside>
  );
}
