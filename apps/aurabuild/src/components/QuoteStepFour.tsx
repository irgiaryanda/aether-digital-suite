import React from "react";
import { BillOfMaterials } from "@aether/core-engine";

interface Props {
  productType: "GARAGE_DOOR" | "LUXURY_POOL";
  customerName: string;
  phone: string;
  siteAddress: string;
  postcode: string;
  windRegion: string;
  bom: BillOfMaterials;
}

export const QuoteStepFour: React.FC<Props> = ({
  productType,
  customerName,
  phone,
  siteAddress,
  postcode,
  windRegion,
  bom,
}) => {
  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="p-4 bg-aura-subtle rounded-[14px] border border-aura-border space-y-2.5 tabular-nums">
        <div className="flex justify-between font-sans font-bold text-aura-text text-sm pb-2.5 border-b border-aura-border">
          <span>{productType === "GARAGE_DOOR" ? "Sectional Garage Door Spec" : "Cantilevered Pool Spec"}</span>
          <span className="text-aura-cyan font-mono tabular-nums">
            ${bom.totalIncGstAud.toLocaleString(undefined, { minimumFractionDigits: 2 })} AUD
          </span>
        </div>
        <div className="flex justify-between text-aura-text-dim">
          <span>Client:</span>
          <span className="text-aura-text font-medium">{customerName} ({phone})</span>
        </div>
        <div className="flex justify-between text-aura-text-dim">
          <span>Site Address:</span>
          <span className="text-aura-text font-medium">{siteAddress}, {postcode}</span>
        </div>
        <div className="flex justify-between text-aura-text-dim">
          <span>Wind Zone:</span>
          <span className="text-aura-text font-bold">Region {windRegion}</span>
        </div>
        <div className="flex justify-between text-aura-text-dim">
          <span>Quote Ref:</span>
          <span className="text-aura-cyan font-bold">{bom.quoteReference}</span>
        </div>
      </div>
      <p className="text-[11px] text-aura-text-dim font-sans leading-relaxed">
        Submitting this request locks your itemized manufacturing BOM pricing for 30 days and registers the survey order into our dispatch queue.
      </p>
    </div>
  );
};
