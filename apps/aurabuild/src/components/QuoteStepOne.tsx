import React from "react";
import { resolvePostcode } from "@aether/core-engine";
import { ShieldCheck } from "@phosphor-icons/react";

interface Props {
  customerName: string;
  setCustomerName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  siteAddress: string;
  setSiteAddress: (v: string) => void;
  postcode: string;
  setPostcode: (v: string) => void;
  errors?: Record<string, string>;
}

export const QuoteStepOne: React.FC<Props> = ({
  customerName,
  setCustomerName,
  phone,
  setPhone,
  email,
  setEmail,
  siteAddress,
  setSiteAddress,
  postcode,
  setPostcode,
  errors = {},
}) => {
  const resolution = resolvePostcode(postcode);
  const inputBaseClass =
    "w-full px-3 py-2 border rounded-[10px] text-xs text-aura-text bg-white focus:border-aura-cyan focus:outline-none transition-colors duration-200";

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="quote-customer-name" className="font-semibold text-aura-text block mb-1">
            Full Name
          </label>
          <input
            id="quote-customer-name"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className={`${inputBaseClass} ${errors["customerName"] ? "border-red-500 bg-red-50/40" : "border-aura-border"}`}
          />
          {errors["customerName"] && <span className="text-[11px] text-red-600 mt-0.5 block">{errors["customerName"]}</span>}
        </div>
        <div>
          <label htmlFor="quote-phone" className="font-semibold text-aura-text block mb-1">
            Phone Number
          </label>
          <input
            id="quote-phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`${inputBaseClass} font-mono tabular-nums ${errors["phone"] ? "border-red-500 bg-red-50/40" : "border-aura-border"}`}
          />
          {errors["phone"] && <span className="text-[11px] text-red-600 mt-0.5 block">{errors["phone"]}</span>}
        </div>
      </div>

      <div>
        <label htmlFor="quote-email" className="font-semibold text-aura-text block mb-1">
          Email Address
        </label>
        <input
          id="quote-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${inputBaseClass} ${errors["email"] ? "border-red-500 bg-red-50/40" : "border-aura-border"}`}
        />
        {errors["email"] && <span className="text-[11px] text-red-600 mt-0.5 block">{errors["email"]}</span>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label htmlFor="quote-site-address" className="font-semibold text-aura-text block mb-1">
            Street Address
          </label>
          <input
            id="quote-site-address"
            type="text"
            value={siteAddress}
            onChange={(e) => setSiteAddress(e.target.value)}
            className={`${inputBaseClass} ${errors["siteAddress"] ? "border-red-500 bg-red-50/40" : "border-aura-border"}`}
          />
          {errors["siteAddress"] && <span className="text-[11px] text-red-600 mt-0.5 block">{errors["siteAddress"]}</span>}
        </div>
        <div>
          <label htmlFor="quote-postcode" className="font-semibold text-aura-text block mb-1">
            Postcode
          </label>
          <input
            id="quote-postcode"
            type="text"
            value={postcode}
            maxLength={4}
            onChange={(e) => setPostcode(e.target.value.replace(/\D/g, "").slice(0, 4))}
            className={`${inputBaseClass} font-mono tabular-nums font-bold ${errors["postcode"] ? "border-red-500 bg-red-50/40" : "border-aura-border"}`}
          />
          {errors["postcode"] && <span className="text-[11px] text-red-600 mt-0.5 block">{errors["postcode"]}</span>}
        </div>
      </div>

      <div className="p-2.5 bg-cyan-50/70 border border-cyan-200 rounded-[10px] text-[11px] text-aura-cyan flex items-center space-x-2">
        <ShieldCheck size={16} weight="fill" className="flex-shrink-0" />
        <span>
          AS/NZS 4505: {resolution.suburb}, {resolution.state} &middot; Region {resolution.windRegion} ({resolution.leadTimeWeeks}w lead)
        </span>
      </div>
    </div>
  );
};
