import React from "react";
import {
  ArrowsClockwise,
  Clock,
  Code,
  Kanban,
  Receipt,
} from "@phosphor-icons/react";

interface HeaderProps {
  activeView: "ledger" | "kanban" | "analytics";
  onViewChange: (v: "ledger" | "kanban" | "analytics") => void;
  utilizationPercent: number;
  totalLoggedHours: number;
  onResetDemoData: () => void;
  onOpenWpInspector: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onViewChange,
  utilizationPercent,
  totalLoggedHours,
  onResetDemoData,
  onOpenWpInspector,
}) => {
  return (
    <header className="bg-chronos-surface border-b border-white/10 sticky top-0 z-40 shadow-xl print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-chronos-indigo flex items-center justify-center text-white font-display font-bold text-lg">
              CF
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-base text-white">ChronosFlow</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  AGENCY OPS
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">Time & Retainer Intelligence</p>
            </div>
          </div>

          <div className="hidden md:flex items-center bg-chronos-canvas p-1 rounded-lg border border-white/10">
            <button
              type="button"
              onClick={() => onViewChange("ledger")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${
                activeView === "ledger" ? "bg-chronos-card text-white shadow border border-white/10" : "text-gray-400 hover:text-white"
              }`}
            >
              <Clock size={14} weight={activeView === "ledger" ? "fill" : "regular"} />
              <span>Timesheets</span>
            </button>

            <button
              type="button"
              onClick={() => onViewChange("kanban")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${
                activeView === "kanban" ? "bg-chronos-card text-white shadow border border-white/10" : "text-gray-400 hover:text-white"
              }`}
            >
              <Kanban size={14} weight={activeView === "kanban" ? "fill" : "regular"} />
              <span>Kanban</span>
            </button>

            <button
              type="button"
              onClick={() => onViewChange("analytics")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${
                activeView === "analytics" ? "bg-chronos-card text-white shadow border border-white/10" : "text-gray-400 hover:text-white"
              }`}
            >
              <Receipt size={14} weight={activeView === "analytics" ? "fill" : "regular"} />
              <span>Invoice & Util</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-lg border border-white/10 bg-chronos-card text-xs font-mono">
              <span className="text-chronos-green font-bold tabular-nums">{utilizationPercent}% Util</span>
              <span className="border-l border-white/10 pl-2 text-white font-bold tabular-nums">{totalLoggedHours}h</span>
            </div>

            <button
              type="button"
              onClick={onResetDemoData}
              title="Reset Demo Data"
              aria-label="Reset Demo Data"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-chronos-card border border-white/10 text-xs font-mono"
            >
              <ArrowsClockwise size={15} />
            </button>

            <button
              type="button"
              onClick={onOpenWpInspector}
              aria-label="Inspect WordPress Agency API and Capabilities"
              className="min-h-[40px] min-w-[40px] p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-xs font-bold font-mono flex items-center justify-center space-x-1"
            >
              <Code size={15} />
              <span className="hidden sm:inline">WP Agency API</span>
            </button>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex md:hidden items-center bg-chronos-canvas p-1 rounded-lg border border-white/10 mb-2.5 gap-1">
          <button
            type="button"
            onClick={() => onViewChange("ledger")}
            className={`flex-1 min-h-[40px] flex items-center justify-center space-x-1 px-2 py-1.5 rounded text-[11px] font-semibold ${
              activeView === "ledger" ? "bg-chronos-card text-white border border-white/10" : "text-gray-400"
            }`}
          >
            <Clock size={13} />
            <span>Timesheets</span>
          </button>
          <button
            type="button"
            onClick={() => onViewChange("kanban")}
            className={`flex-1 min-h-[40px] flex items-center justify-center space-x-1 px-2 py-1.5 rounded text-[11px] font-semibold ${
              activeView === "kanban" ? "bg-chronos-card text-white border border-white/10" : "text-gray-400"
            }`}
          >
            <Kanban size={13} />
            <span>Kanban</span>
          </button>
          <button
            type="button"
            onClick={() => onViewChange("analytics")}
            className={`flex-1 min-h-[40px] flex items-center justify-center space-x-1 px-2 py-1.5 rounded text-[11px] font-semibold ${
              activeView === "analytics" ? "bg-chronos-card text-white border border-white/10" : "text-gray-400"
            }`}
          >
            <Receipt size={13} />
            <span>Invoice</span>
          </button>
        </div>
      </div>
    </header>
  );
};
