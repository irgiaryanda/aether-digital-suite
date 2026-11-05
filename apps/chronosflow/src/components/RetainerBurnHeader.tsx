import React from "react";
import { ChronosProject, calculateRetainerHealth } from "@aether/core-engine";
import { Warning, CheckCircle, WarningOctagon } from "@phosphor-icons/react";

interface Props {
  projects: ChronosProject[];
}

export const RetainerBurnHeader: React.FC<Props> = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
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
          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

        return (
          <div
            key={proj.id}
            className="p-3 bg-chronos-surface border border-white/10 rounded-xl space-y-2 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">{proj.code}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold flex items-center space-x-1 ${badgeColor}`}>
                {isOver && <WarningOctagon size={11} weight="fill" />}
                {isWarn && <Warning size={11} weight="fill" />}
                {!isOver && !isWarn && <CheckCircle size={11} weight="fill" />}
                <span>{health.status}</span>
              </span>
            </div>

            <div className="truncate text-gray-400 text-[11px]">{proj.title}</div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] tabular-nums">
                <span className="text-gray-400">Burn: <strong className="text-white">{health.burnPercentage}%</strong></span>
                <span className="text-gray-300">{health.loggedHours}h / {health.budgetHours}h</span>
              </div>
              <div className="w-full h-1.5 bg-chronos-canvas rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full ${barColor} transition-all duration-300`}
                  style={{ width: `${Math.min(100, health.burnPercentage)}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

