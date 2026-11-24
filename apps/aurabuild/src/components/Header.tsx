import React from "react";
import {
  ArrowsClockwise,
  BookmarkSimple,
  Code,
  FileText,
  Hammer,
  Waves,
} from "@phosphor-icons/react";

interface HeaderProps {
  productType: "GARAGE_DOOR" | "LUXURY_POOL";
  onProductTypeChange: (type: "GARAGE_DOOR" | "LUXURY_POOL") => void;
  onResetDemoData: () => void;
  onOpenSavedQuotes: () => void;
  onOpenWpInspector: () => void;
  onOpenQuoteWizard: () => void;
  savedQuotesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  productType,
  onProductTypeChange,
  onResetDemoData,
  onOpenSavedQuotes,
  onOpenWpInspector,
  onOpenQuoteWizard,
  savedQuotesCount,
}) => {
  return (
    <header className="bg-white border-b border-aura-border sticky top-0 z-40 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-aura-monument flex items-center justify-center text-white font-display font-bold text-lg">
              AB
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-lg tracking-tight text-aura-text">
                  AuraBuild
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-aura-subtle text-aura-cyan border border-aura-border">
                  AU STUDIO
                </span>
              </div>
              <p className="text-xs text-aura-text-dim hidden sm:block">
                Architectural Garage Doors & Pools
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center bg-aura-subtle p-1 rounded-lg border border-aura-border">
            <button
              type="button"
              onClick={() => onProductTypeChange("GARAGE_DOOR")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                productType === "GARAGE_DOOR"
                  ? "bg-white text-aura-text shadow-sm border border-aura-border"
                  : "text-aura-text-muted hover:text-aura-text"
              }`}
            >
              <Hammer size={16} weight={productType === "GARAGE_DOOR" ? "fill" : "regular"} />
              <span>Sectional Garage Doors</span>
            </button>
            <button
              type="button"
              onClick={() => onProductTypeChange("LUXURY_POOL")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                productType === "LUXURY_POOL"
                  ? "bg-white text-aura-text shadow-sm border border-aura-border"
                  : "text-aura-text-muted hover:text-aura-text"
              }`}
            >
              <Waves size={16} weight={productType === "LUXURY_POOL" ? "fill" : "regular"} />
              <span>Cantilevered Pools</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onResetDemoData}
              title="Reset Demo Data"
              aria-label="Reset Demo Data"
              className="min-h-[40px] min-w-[40px] p-2 rounded-lg text-aura-text-muted hover:text-aura-text hover:bg-aura-subtle border border-aura-border transition-colors flex items-center justify-center space-x-1.5 text-xs font-medium"
            >
              <ArrowsClockwise size={16} />
              <span className="hidden xl:inline">Reset Demo</span>
            </button>

            <button
              type="button"
              onClick={onOpenSavedQuotes}
              aria-label="Open Saved Architectural Quotes"
              className="min-h-[40px] min-w-[40px] p-2 rounded-lg text-aura-text-muted hover:text-aura-text hover:bg-aura-subtle border border-aura-border transition-colors flex items-center justify-center space-x-1.5 text-xs font-medium"
            >
              <BookmarkSimple size={16} />
              <span className="hidden lg:inline">Saved Quotes</span>
              {savedQuotesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-aura-cyan text-white text-[10px] font-bold tabular-nums">
                  {savedQuotesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenWpInspector}
              aria-label="Inspect WordPress and ACF Architecture"
              className="min-h-[40px] min-w-[40px] p-2 rounded-lg text-aura-cyan bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 transition-colors flex items-center justify-center space-x-1.5 text-xs font-semibold"
            >
              <Code size={16} />
              <span className="hidden sm:inline">WP / ACF</span>
            </button>

            <button
              type="button"
              onClick={onOpenQuoteWizard}
              className="min-h-[40px] px-3.5 py-2 rounded-lg bg-aura-cyan text-white hover:bg-[#0c627a] font-semibold text-xs tracking-wide shadow-sm transition-all flex items-center space-x-1.5"
            >
              <FileText size={16} weight="bold" />
              <span className="hidden xs:inline sm:inline">Book Measure</span>
            </button>
          </div>
        </div>

        {/* Mobile Product Switcher */}
        <div className="flex md:hidden items-center bg-aura-subtle p-1 rounded-lg border border-aura-border mb-2.5 gap-1">
          <button
            type="button"
            onClick={() => onProductTypeChange("GARAGE_DOOR")}
            className={`flex-1 min-h-[40px] flex items-center justify-center space-x-1.5 px-2 py-1.5 rounded-md text-xs font-semibold transition-all ${
              productType === "GARAGE_DOOR"
                ? "bg-white text-aura-text shadow-sm border border-aura-border"
                : "text-aura-text-muted"
            }`}
          >
            <Hammer size={15} weight={productType === "GARAGE_DOOR" ? "fill" : "regular"} />
            <span>Garage Doors</span>
          </button>
          <button
            type="button"
            onClick={() => onProductTypeChange("LUXURY_POOL")}
            className={`flex-1 min-h-[40px] flex items-center justify-center space-x-1.5 px-2 py-1.5 rounded-md text-xs font-semibold transition-all ${
              productType === "LUXURY_POOL"
                ? "bg-white text-aura-text shadow-sm border border-aura-border"
                : "text-aura-text-muted"
            }`}
          >
            <Waves size={15} weight={productType === "LUXURY_POOL" ? "fill" : "regular"} />
            <span>Concrete Pools</span>
          </button>
        </div>
      </div>
    </header>
  );
};
