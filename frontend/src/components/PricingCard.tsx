import { Check, ArrowRight, Mail, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const PricingCard = () => {
  const [promoCode, setPromoCode] = useState("KAUMUDI2024");
const navigate = useNavigate();
  const features = [
    "Lifetime access to recorded lectures",
    "Digital Sanskrit Dictionary & Resource Pack",
    "Direct access to instructor via Discord",
    "Authenticated Certification on completion",
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-6 sticky top-6">
      {/* Early Bird Offer */}
      <div className="flex items-center justify-between mb-4">
        <span className="bg-foreground text-background text-xs font-semibold px-3 py-1.5 rounded">
          EARLY BIRD OFFER
        </span>
        <span className="badge-red">Ends in 2 Days</span>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-4xl font-serif font-bold text-foreground">$299</span>
        <span className="text-lg text-muted-foreground line-through">$549</span>
        <span className="text-sm font-semibold text-primary">45% OFF</span>
      </div>

      {/* Promo Code */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4" />
            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
            <path d="M18 12a2 2 0 000 4h4v-4h-4z" />
          </svg>
          <span className="text-sm font-medium text-foreground">Apply Promo Code</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button className="px-4 py-2 bg-secondary hover:bg-muted border border-border rounded-lg text-sm font-medium transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* CTA Buttons */}
      {/* <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-maroon-dark transition-colors mb-3">
        Enroll Now & Start Learning
        <ArrowRight className="w-4 h-4" />
      </button> */}

      <button
  onClick={() => navigate("/signin")}
  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-maroon-dark transition-colors mb-3"
>
  Enroll Now & Start Learning
  <ArrowRight className="w-4 h-4" />
</button>



<button
  onClick={() => navigate("/contact")}
  className="w-full bg-secondary hover:bg-muted border border-border py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors mb-6"
>
  <Mail className="w-4 h-4" />
  Contact Academy
</button>

      {/* <button className="w-full bg-secondary hover:bg-muted border border-border py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors mb-6">
        <Mail className="w-4 h-4" />
        Contact Academy
      </button> */}

      {/* What's Included */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Check className="w-4 h-4 text-green-check" />
          <span className="text-sm font-semibold text-foreground">What's included:</span>
        </div>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-green-check flex-shrink-0 mt-0.5" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Trust Badge */}
      <div className="bg-cream-dark rounded-lg p-4 text-center">
        <div className="w-12 h-12 bg-amber rounded-full flex items-center justify-center mx-auto mb-2">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-semibold text-foreground">Academy Verified Trust</p>
        <p className="text-xs text-muted-foreground">100% Secure Checkout & 14-day Refund Policy</p>
      </div>
    </div>
  );
};

export default PricingCard;
