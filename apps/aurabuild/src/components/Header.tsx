import React from "react";
import {
  ArrowRight,
  ArrowsClockwise,
  BookmarkSimple,
  Code,
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
    <header className="bg-white/90 backdrop-blur-md border-b border-aura-border sticky top-0 z-40 print:hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-[10px] bg-aura-text flex items-center justify-center text-white font-display font-bold text-sm tracking-tight flex-shrink-0">
              AB
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-base tracking-tight text-aura-text whitespace-nowrap">
                  AuraBuild Studio
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-aura-subtle text-aura-cyan border border-aura-border">
                  SYD
                </span>
              </div>
              <p className="text-xs text-aura-text-dim hidden sm:block truncate">
                Architectural Garage Doors &amp; Concrete Pools
              </p>
            </div>
          </div>

          <nav
            aria-label="Product configurator switcher"
            className="hidden md:flex items-center bg-aura-tray p-1 rounded-full border border-aura-border"
          >
            <button
              type="button"
              onClick={() => onProductTypeChange("GARAGE_DOOR")}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ease-spring active:scale-[0.98] ${
                productType === "GARAGE_DOOR"
                  ? "bg-white text-aura-text shadow-sm border border-aura-border"
                  : "text-aura-text-muted hover:text-aura-text"
              }`}
            >
              <Hammer size={15} weight={productType === "GARAGE_DOOR" ? "fill" : "regular"} />
              <span>Sectional Garage Doors</span>
            </button>
            <button
              type="button"
              onClick={() => onProductTypeChange("LUXURY_POOL")}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ease-spring active:scale-[0.98] ${
                productType === "LUXURY_POOL"
                  ? "bg-white text-aura-text shadow-sm border border-aura-border"
                  : "text-aura-text-muted hover:text-aura-text"
              }`}
            >
              <Waves size={15} weight={productType === "LUXURY_POOL" ? "fill" : "regular"} />
              <span>Cantilevered Pools</span>
            </button>
          </nav>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              type="button"
              onClick={onResetDemoData}
              title="Reset demo fixtures"
              aria-label="Reset demo data"
              className="min-h-[40px] min-w-[40px] p-2 rounded-full text-aura-text-muted hover:text-aura-text hover:bg-aura-subtle border border-aura-border transition-all duration-300 ease-spring active:scale-[0.98] flex items-center justify-center space-x-1.5 text-xs font-medium whitespace-nowrap"
            >
              <ArrowsClockwise size={15} weight="light" />
              <span className="hidden xl:inline">Reset</span>
            </button>

            <button
              type="button"
              onClick={onOpenSavedQuotes}
              aria-label="Open saved architectural quotes"
              className="min-h-[40px] min-w-[40px] px-2.5 sm:px-3 py-1.5 rounded-full text-aura-text-muted hover:text-aura-text hover:bg-aura-subtle border border-aura-border transition-all duration-300 ease-spring active:scale-[0.98] flex items-center justify-center space-x-1.5 text-xs font-medium whitespace-nowrap"
            >
              <BookmarkSimple size={15} weight="light" />
              <span className="hidden lg:inline">Quotes</span>
              {savedQuotesCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-aura-cyan text-white text-[10px] font-mono font-bold tabular-nums leading-none">
                  {savedQuotesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenWpInspector}
              aria-label="Inspect WordPress and ACF architecture"
              className="min-h-[40px] min-w-[40px] px-2.5 sm:px-3.5 py-1.5 rounded-full text-aura-cyan bg-aura-cyan/[0.08] hover:bg-aura-cyan/[0.14] border border-aura-cyan/25 transition-all duration-300 ease-spring active:scale-[0.98] flex items-center justify-center space-x-1.5 text-xs font-semibold whitespace-nowrap"
            >
              <Code size={15} weight="bold" />
              <span className="hidden sm:inline">WP / ACF</span>
            </button>

            <button
              type="button"
              onClick={onOpenQuoteWizard}
              className="group min-h-[40px] pl-4 pr-1.5 py-1.5 rounded-full bg-aura-cyan hover:bg-aura-cyan-dark text-white font-semibold text-xs whitespace-nowrap shadow-sm transition-all duration-300 ease-spring active:scale-[0.98] flex items-center space-x-2.5"
            >
              <span>Book Measure</span>
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 ease-spring group-hover:translate-x-0.5">
                <ArrowRight size={13} weight="bold" />
              </span>
            </button>
          </div>
        </div>

        <div className="flex md:hidden items-center bg-aura-tray p-1 rounded-full border border-aura-border mb-2.5 gap-1">
          <button
            type="button"
            onClick={() => onProductTypeChange("GARAGE_DOOR")}
            className={`flex-1 min-h-[40px] flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ease-spring ${
              productType === "GARAGE_DOOR"
                ? "bg-white text-aura-text shadow-sm border border-aura-border"
                : "text-aura-text-muted"
            }`}
          >
            <Hammer size={14} weight={productType === "GARAGE_DOOR" ? "fill" : "regular"} />
            <span>Garage Doors</span>
          </button>
          <button
            type="button"
            onClick={() => onProductTypeChange("LUXURY_POOL")}
            className={`flex-1 min-h-[40px] flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ease-spring ${
              productType === "LUXURY_POOL"
                ? "bg-white text-aura-text shadow-sm border border-aura-border"
                : "text-aura-text-muted"
            }`}
          >
            <Waves size={14} weight={productType === "LUXURY_POOL" ? "fill" : "regular"} />
            <span>Concrete Pools</span>
          </button>
        </div>
      </div>
    </header>
  );
};
