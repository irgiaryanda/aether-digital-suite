import React from "react";
import { CONTRACTOR_TIERS, ContractorProfile } from "@aether/core-engine";
import { ArrowsClockwise, Coins, Database, Icon as PhosphorIcon, Lightning, Receipt, Table } from "@phosphor-icons/react";

interface HeaderProps {
  contractor: ContractorProfile;
  activeView: "sku-switch" | "loyalty-claims" | "trade-catalog";
  onViewChange: (view: "sku-switch" | "loyalty-claims" | "trade-catalog") => void;
  onResetDemoData: () => void;
  onOpenWpInspector: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  contractor,
  activeView,
  onViewChange,
  onResetDemoData,
  onOpenWpInspector,
}) => {
  const tierMultiplier = CONTRACTOR_TIERS[contractor.tier].multiplier;

  const navItems: {
    id: "sku-switch" | "loyalty-claims" | "trade-catalog";
    label: string;
    mobileLabel: string;
    icon: PhosphorIcon;
  }[] = [
    { id: "sku-switch", label: "SKU & ROI", mobileLabel: "SKU & ROI", icon: Lightning },
    { id: "loyalty-claims", label: "Claims & Rewards", mobileLabel: "Claims", icon: Receipt },
    { id: "trade-catalog", label: "Trade Matrix", mobileLabel: "Matrix", icon: Table },
  ];

  return (
    <header className="bg-[#0D1015]/90 backdrop-blur-md border-b border-white/[0.08] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-volt-amber flex items-center justify-center text-volt-base shadow-sm flex-shrink-0">
              <Lightning size={20} weight="fill" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-volt-ink">VoltSwitch</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-volt-amber border border-amber-500/30">
                  B2B TRADE
                </span>
                <span className="hidden lg:inline text-[11px] text-emerald-400 font-mono tabular-nums">
                  ABN {contractor.abn}
                </span>
              </div>
              <p className="text-[11px] text-volt-muted truncate max-w-[170px] sm:max-w-xs">
                {contractor.companyName}
              </p>
            </div>
          </div>

          <nav
            aria-label="Primary sections"
            className="hidden md:flex items-center bg-volt-tray p-1 rounded-full border border-white/[0.08]"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ease-spring active:scale-[0.98] whitespace-nowrap ${
                    isActive
                      ? "bg-volt-elevated text-volt-amber border border-white/[0.08] shadow-sm"
                      : "text-volt-muted hover:text-volt-ink"
                  }`}
                >
                  <Icon size={14} weight={isActive ? "fill" : "regular"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="hidden lg:flex items-center space-x-2.5 px-3 py-1.5 rounded-full border bg-volt-tray border-white/[0.08]">
              <span className="text-[10px] font-mono font-bold text-volt-amber tabular-nums">
                {contractor.tier} {tierMultiplier}x
              </span>
              <span className="h-3 w-px bg-white/10" aria-hidden="true" />
              <div className="flex items-center space-x-1">
                <Coins size={14} className="text-volt-amber" weight="fill" />
                <span className="font-mono font-bold text-xs text-volt-ink tabular-nums">
                  {contractor.currentPointsBalance.toLocaleString()} pts
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onResetDemoData}
              title="Reset Demo Data"
              aria-label="Reset Demo Data"
              className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-full text-volt-muted hover:text-volt-ink bg-volt-tray hover:bg-volt-elevated border border-white/[0.08] transition-all duration-200 ease-spring active:scale-[0.98]"
            >
              <ArrowsClockwise size={15} />
            </button>

            <button
              type="button"
              onClick={onOpenWpInspector}
              aria-label="Inspect WooCommerce HPOS and WordPress Architecture"
              className="min-h-[38px] min-w-[38px] p-1.5 sm:px-3 sm:py-1.5 rounded-full text-volt-amber bg-volt-tray hover:bg-volt-elevated border border-amber-500/35 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all duration-200 ease-spring active:scale-[0.98] whitespace-nowrap"
            >
              <Database size={15} />
              <span className="hidden sm:inline">Woo HPOS</span>
            </button>
          </div>
        </div>

        <nav
          aria-label="Mobile sections"
          className="flex md:hidden items-center bg-volt-tray p-1 rounded-full border border-white/[0.08] mb-3 gap-1"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onViewChange(item.id)}
                className={`flex-1 min-h-[38px] flex items-center justify-center space-x-1 px-2 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-volt-elevated text-volt-amber border border-white/[0.08]"
                    : "text-volt-muted"
                }`}
              >
                <Icon size={13} weight={isActive ? "fill" : "regular"} />
                <span>{item.mobileLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
