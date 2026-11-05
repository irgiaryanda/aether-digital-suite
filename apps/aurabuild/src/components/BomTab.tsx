import React from "react";
import { BillOfMaterials } from "@aether/core-engine";
import { FileText, CheckCircle } from "@phosphor-icons/react";

interface BomTabProps {
  bom: BillOfMaterials;
  onOpenQuoteWizard: () => void;
}

export const BomTab: React.FC<BomTabProps> = ({ bom, onOpenQuoteWizard }) => {
  return (
    <div className="space-y-4">
      {/* Reference & Header */}
      <div className="flex items-center justify-between pb-2 border-b border-aura-border">
        <div>
          <span className="text-[10px] uppercase font-bold text-aura-text-dim block">
            Engineering Specification Reference
          </span>
          <span className="font-mono text-xs font-bold text-aura-text">{bom.quoteReference}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center space-x-1">
          <CheckCircle size={12} weight="fill" />
          <span>AS/NZS Compliant</span>
        </span>
      </div>

      {/* Itemized Line Items Table */}
      <div className="bg-white rounded-lg border border-aura-border overflow-hidden">
        <div className="max-h-60 overflow-y-auto divide-y divide-aura-border/60">
          {bom.items.map((item, index) => (
            <div key={`${item.sku}-${index}`} className="p-2.5 text-xs flex items-start justify-between">
              <div className="flex-1 pr-3">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono text-aura-cyan font-bold">{item.sku}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-aura-subtle text-aura-text-dim font-semibold">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-aura-text font-medium mt-0.5">{item.description}</p>
                <span className="text-[11px] text-aura-text-dim font-mono">
                  {item.quantity} &times; ${item.unitPriceAud.toLocaleString()} AUD
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-aura-text tabular-nums font-mono text-xs">
                  ${item.lineTotalAud.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="bg-aura-subtle p-3 border-t border-aura-border space-y-1.5 text-xs font-mono">
          <div className="flex justify-between text-aura-text-muted">
            <span>Subtotal (ex-GST):</span>
            <span className="tabular-nums font-semibold">
              ${bom.subtotalExGstAud.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-aura-text-muted">
            <span>Australian GST (10%):</span>
            <span className="tabular-nums font-semibold">
              ${bom.gstAud.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-aura-text pt-1.5 border-t border-aura-border text-sm font-bold">
            <span>Total (inc-GST AUD):</span>
            <span className="text-aura-cyan tabular-nums">
              ${bom.totalIncGstAud.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Book Measure Action */}
      <button
        type="button"
        onClick={onOpenQuoteWizard}
        className="w-full py-2.5 px-4 rounded-lg bg-aura-cyan text-white hover:bg-[#0c627a] font-semibold text-xs tracking-wide shadow-sm transition-all flex items-center justify-center space-x-2"
      >
        <FileText size={16} weight="bold" />
        <span>Book Site Measure & Lock Price</span>
      </button>
    </div>
  );
};
