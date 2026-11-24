import React from "react";
import { BillOfMaterials } from "@aether/core-engine";
import { ArrowRight, CheckCircle, Printer } from "@phosphor-icons/react";

interface BomTabProps {
  bom: BillOfMaterials;
  onOpenQuoteWizard: () => void;
}

export const BomTab: React.FC<BomTabProps> = ({ bom, onOpenQuoteWizard }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2.5 border-b border-aura-border">
        <div>
          <span className="text-[11px] font-medium text-aura-text-dim block">
            Specification Reference
          </span>
          <span className="font-mono text-xs font-bold text-aura-text">{bom.quoteReference}</span>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center space-x-1">
          <CheckCircle size={13} weight="fill" />
          <span>AS/NZS Compliant</span>
        </span>
      </div>

      <div className="bg-white rounded-[12px] border border-aura-border overflow-hidden">
        <div className="max-h-64 overflow-y-auto divide-y divide-aura-border/60">
          {bom.items.map((item, index) => (
            <div key={`${item.sku}-${index}`} className="p-3 text-xs flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-aura-cyan font-bold">{item.sku}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-aura-subtle text-aura-text-dim font-medium">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-aura-text font-medium mt-1">{item.description}</p>
                <span className="text-[11px] text-aura-text-dim font-mono tabular-nums">
                  {item.quantity} x ${item.unitPriceAud.toLocaleString()} AUD
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-bold text-aura-text tabular-nums font-mono text-xs">
                  ${item.lineTotalAud.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-aura-subtle p-3.5 border-t border-aura-border space-y-1.5 text-xs font-mono">
          <div className="flex justify-between text-aura-text-muted">
            <span>Subtotal ex-GST:</span>
            <span className="tabular-nums font-semibold">
              ${bom.subtotalExGstAud.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-aura-text-muted">
            <span>Australian GST 10%:</span>
            <span className="tabular-nums font-semibold">
              ${bom.gstAud.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-aura-text pt-1.5 border-t border-aura-border text-sm font-bold">
            <span>Total inc-GST:</span>
            <span className="text-aura-cyan tabular-nums">
              ${bom.totalIncGstAud.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-[42px] px-4 py-2 rounded-full bg-white border border-aura-border text-aura-text hover:border-aura-cyan hover:text-aura-cyan font-semibold text-xs flex items-center justify-center space-x-1.5 whitespace-nowrap transition-all duration-300 ease-spring active:scale-[0.98]"
        >
          <Printer size={15} weight="bold" />
          <span>Print Spec</span>
        </button>

        <button
          type="button"
          onClick={onOpenQuoteWizard}
          className="group flex-1 min-h-[42px] pl-4 pr-2 py-1.5 rounded-full bg-aura-cyan text-white hover:bg-aura-cyan-dark font-semibold text-xs whitespace-nowrap shadow-sm transition-all duration-300 ease-spring active:scale-[0.98] flex items-center justify-between"
        >
          <span>Lock Measure Quote</span>
          <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 ease-spring group-hover:translate-x-0.5">
            <ArrowRight size={13} weight="bold" />
          </span>
        </button>
      </div>
    </div>
  );
};
