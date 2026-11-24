import React from "react";
import { ChronosProject, calculateRetainerHealth } from "@aether/core-engine";
import { CheckCircle, Warning, WarningOctagon } from "@phosphor-icons/react";

interface Props {
  projects: ChronosProject[];
}

export const RetainerBurnHeader: React.FC<Props> = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
      {projects.map((proj) => {
        const health = calculateRetainerHealth(proj.budgetHours, proj.loggedHours);
        const isOver = health.status === "OVER_BURN";
        const isWarn = health.status === "WARNING";

        const barColor = isOver
          ? "bg-chronos-coral"
          : isWarn
          ? "bg-chronos-warning"
          : "bg-chronos-green";

        const badgeColor = isOver
          ? "bg-red-500/10 text-red-400 border-red-500/30"
          : isWarn
          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
          : "bg-emerald-500/10 text-chronos-green border-emerald-500/30";

        return (
          <div
            key={proj.id}
            className="bg-chronos-tray rounded-[20px] p-1.5 border border-white/[0.08]"
          >
            <div className="p-3.5 bg-chronos-card border border-white/[0.06] rounded-[14px] space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-chronos-ink text-xs">{proj.code}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold flex items-center space-x-1 ${badgeColor}`}>
                  {isOver && <WarningOctagon size={11} weight="fill" />}
                  {isWarn && <Warning size={11} weight="fill" />}
                  {!isOver && !isWarn && <CheckCircle size={11} weight="fill" />}
                  <span>{health.status}</span>
                </span>
              </div>

              <div className="truncate font-sans text-chronos-muted text-xs font-medium">
                {proj.title}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono tabular-nums">
                  <span className="text-chronos-muted">
                    Burn: <strong className="text-chronos-ink">{health.burnPercentage}%</strong>
                  </span>
                  <span className="text-chronos-ink">
                    {health.loggedHours}h / {health.budgetHours}h
                  </span>
                </div>
                <div className="w-full h-1.5 bg-chronos-recessed rounded-full overflow-hidden border border-white/[0.06]">
                  <div
                    className={`h-full ${barColor} transition-all duration-300 ease-spring`}
                    style={{ width: `${Math.min(100, health.burnPercentage)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
