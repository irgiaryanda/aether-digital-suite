import React from "react";
import { ContractorProfile } from "@aether/core-engine";
import { ArrowsClockwise, CheckCircle, Coins, Database, Lightning, Receipt, Table } from "@phosphor-icons/react";

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
  return (
    <header className="bg-volt-surface border-b border-volt-border sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-volt-amber flex items-center justify-center text-black font-mono font-black text-lg">
              <Lightning size={22} weight="fill" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base text-white">VoltSwitch</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-volt-amber border border-amber-500/30">
                  B2B TRADE
                </span>
                <span className="hidden sm:inline text-[11px] text-emerald-400 font-mono">
                  ABN {contractor.abn}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 truncate max-w-[200px] sm:max-w-xs">
                {contractor.companyName}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center bg-volt-base p-1 rounded-lg border border-volt-border">
            <button
              type="button"
              onClick={() => onViewChange("sku-switch")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${
                activeView === "sku-switch"
                  ? "bg-volt-elevated text-volt-amber shadow border border-volt-border"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Lightning size={14} weight={activeView === "sku-switch" ? "fill" : "regular"} />
              <span>SKU & ROI</span>
            </button>

            <button
              type="button"
              onClick={() => onViewChange("loyalty-claims")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${
                activeView === "loyalty-claims"
                  ? "bg-volt-elevated text-volt-amber shadow border border-volt-border"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Receipt size={14} weight={activeView === "loyalty-claims" ? "fill" : "regular"} />
              <span>Claims & Rewards</span>
            </button>

            <button
              type="button"
              onClick={() => onViewChange("trade-catalog")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${
                activeView === "trade-catalog"
                  ? "bg-volt-elevated text-volt-amber shadow border border-volt-border"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Table size={14} weight={activeView === "trade-catalog" ? "fill" : "regular"} />
              <span>Trade Matrix</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-lg border bg-amber-950/60 border-amber-500/50">
              <span className="text-[10px] font-mono font-bold text-amber-400">
                {contractor.tier} (1.5x)
              </span>
              <div className="border-l border-white/10 pl-2 flex items-center space-x-1">
                <Coins size={14} className="text-volt-amber" weight="fill" />
                <span className="font-mono font-bold text-xs text-white tabular-nums">
                  {contractor.currentPointsBalance.toLocaleString()} pts
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onResetDemoData}
              title="Reset Demo Data"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-volt-elevated border border-volt-border text-xs font-mono"
            >
              <ArrowsClockwise size={15} />
            </button>

            <button
              type="button"
              onClick={onOpenWpInspector}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-volt-amber bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold font-mono flex items-center space-x-1"
            >
              <Database size={15} />
              <span className="hidden sm:inline">Woo HPOS</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
