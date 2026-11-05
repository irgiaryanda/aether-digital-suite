import React from "react";
import { AuraQuoteSubmission } from "@aether/core-engine";
import { X, Printer, CalendarBlank, MapPin, Receipt } from "@phosphor-icons/react";

interface SavedQuotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: AuraQuoteSubmission[];
}

export const SavedQuotesDrawer: React.FC<SavedQuotesDrawerProps> = ({ isOpen, onClose, quotes }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-aura-border flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-aura-border flex items-center justify-between bg-aura-subtle">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-aura-cyan">
              Engineering Quotations
            </span>
            <h2 className="text-sm font-display font-bold text-aura-text">
              Saved Architectural Quotes ({quotes.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-aura-text-muted hover:text-aura-text hover:bg-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quotes List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {quotes.length === 0 ? (
            <div className="text-center py-12 text-aura-text-dim text-xs">
              No saved quotes yet. Configure a product and book a site measure to create a quote record.
            </div>
          ) : (
            quotes.map((q) => (
              <div
                key={q.id}
                className="p-3.5 bg-aura-subtle rounded-xl border border-aura-border hover:border-aura-cyan/50 transition-colors space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-aura-cyan">
                    {q.bom.quoteReference}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 text-aura-cyan font-semibold">
                    {q.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-aura-text">{q.customerName}</div>
                  <div className="text-aura-text-muted flex items-center space-x-1 text-[11px]">
                    <MapPin size={13} className="text-aura-text-dim" />
                    <span>{q.siteAddress}, {q.postcode}</span>
                  </div>
                  <div className="text-aura-text-muted flex items-center space-x-1 text-[11px]">
                    <CalendarBlank size={13} className="text-aura-text-dim" />
                    <span>Submitted: {new Date(q.submittedAt).toLocaleDateString("en-AU")}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-aura-border/60 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-aura-text tabular-nums">
                    ${q.bom.totalIncGstAud.toLocaleString(undefined, { minimumFractionDigits: 2 })} AUD
                  </span>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="p-1.5 rounded text-aura-text-dim hover:text-aura-cyan hover:bg-white transition-colors flex items-center space-x-1 text-[11px] font-medium"
                    title="Print Specification"
                  >
                    <Printer size={14} />
                    <span>Print Spec</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
