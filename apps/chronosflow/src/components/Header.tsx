import React from "react";
import { ArrowsClockwise, Clock, Code, Icon as PhosphorIcon, Kanban, Receipt } from "@phosphor-icons/react";

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
  const navItems: {
    id: "ledger" | "kanban" | "analytics";
    label: string;
    mobileLabel: string;
    icon: PhosphorIcon;
  }[] = [
    { id: "ledger", label: "Timesheets", mobileLabel: "Timesheets", icon: Clock },
    { id: "kanban", label: "Kanban", mobileLabel: "Kanban", icon: Kanban },
    { id: "analytics", label: "Invoice & Util", mobileLabel: "Invoice", icon: Receipt },
  ];

  return (
    <header className="bg-[#0B0D12]/90 backdrop-blur-md border-b border-white/[0.08] sticky top-0 z-40 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-chronos-green flex items-center justify-center text-chronos-canvas font-display font-extrabold text-base flex-shrink-0 shadow-sm">
              CF
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-base tracking-tight text-chronos-ink">
                  ChronosFlow
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-chronos-green border border-emerald-500/30">
                  AGENCY OPS
                </span>
              </div>
              <p className="text-[11px] text-chronos-muted hidden sm:block truncate">
                Time & Retainer Intelligence
              </p>
            </div>
          </div>

          <nav
            aria-label="Primary sections"
            className="hidden md:flex items-center bg-chronos-tray p-1 rounded-full border border-white/[0.08]"
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
                      ? "bg-chronos-elevated text-chronos-green border border-white/[0.08] shadow-sm"
                      : "text-chronos-muted hover:text-chronos-ink"
                  }`}
                >
                  <Icon size={14} weight={isActive ? "fill" : "regular"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="hidden lg:flex items-center space-x-2.5 px-3 py-1.5 rounded-full border border-white/[0.08] bg-chronos-tray text-xs font-mono">
              <span className="text-chronos-green font-bold tabular-nums">{utilizationPercent}% Util</span>
              <span className="h-3 w-px bg-white/10" aria-hidden="true" />
              <span className="text-chronos-ink font-bold tabular-nums">{totalLoggedHours}h</span>
            </div>

            <button
              type="button"
              onClick={onResetDemoData}
              title="Reset Demo Data"
              aria-label="Reset Demo Data"
              className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-full text-chronos-muted hover:text-chronos-ink bg-chronos-tray hover:bg-chronos-elevated border border-white/[0.08] transition-all duration-200 ease-spring active:scale-[0.98]"
            >
              <ArrowsClockwise size={15} />
            </button>

            <button
              type="button"
              onClick={onOpenWpInspector}
              aria-label="Inspect WordPress Agency API and Capabilities"
              className="min-h-[38px] min-w-[38px] p-1.5 sm:px-3 sm:py-1.5 rounded-full text-chronos-green bg-chronos-tray hover:bg-chronos-elevated border border-emerald-500/35 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all duration-200 ease-spring active:scale-[0.98] whitespace-nowrap"
            >
              <Code size={15} />
              <span className="hidden sm:inline">WP Agency API</span>
            </button>
          </div>
        </div>

        <nav
          aria-label="Mobile sections"
          className="flex md:hidden items-center bg-chronos-tray p-1 rounded-full border border-white/[0.08] mb-3 gap-1"
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
                    ? "bg-chronos-elevated text-chronos-green border border-white/[0.08]"
                    : "text-chronos-muted"
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
