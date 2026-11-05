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
}) => {
  const resolution = resolvePostcode(postcode);

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-aura-text block mb-1">Full Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3 py-1.5 border border-aura-border rounded-lg text-xs"
          />
        </div>
        <div>
          <label className="font-semibold text-aura-text block mb-1">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-1.5 border border-aura-border rounded-lg text-xs font-mono"
          />
        </div>
      </div>

      <div>
        <label className="font-semibold text-aura-text block mb-1">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-1.5 border border-aura-border rounded-lg text-xs"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="font-semibold text-aura-text block mb-1">Street Address</label>
          <input
            type="text"
            value={siteAddress}
            onChange={(e) => setSiteAddress(e.target.value)}
            className="w-full px-3 py-1.5 border border-aura-border rounded-lg text-xs"
          />
        </div>
        <div>
          <label className="font-semibold text-aura-text block mb-1">Postcode</label>
          <input
            type="text"
            value={postcode}
            maxLength={4}
            onChange={(e) => setPostcode(e.target.value.replace(/\D/g, "").slice(0, 4))}
            className="w-full px-3 py-1.5 border border-aura-border rounded-lg text-xs font-mono font-bold"
          />
        </div>
      </div>

      <div className="p-2.5 bg-cyan-50/70 border border-cyan-200 rounded-lg text-[11px] text-aura-cyan flex items-center space-x-2">
        <ShieldCheck size={16} weight="fill" className="flex-shrink-0" />
        <span>
          AS/NZS 4505: {resolution.suburb}, {resolution.state} &middot; Region {resolution.windRegion} ({resolution.leadTimeWeeks}w lead)
        </span>
      </div>
    </div>
  );
};
