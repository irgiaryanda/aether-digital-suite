import React from "react";
import { ChronosProject, ProjectPhase, TimesheetEntry, calculateRetainerHealth } from "@aether/core-engine";

interface Props {
  projects: ChronosProject[];
  timesheets: TimesheetEntry[];
}

const PHASE_NAMES: Record<ProjectPhase, string> = {
  DISCOVERY_UX: "UX Discovery",
  CUSTOM_WP_THEME: "WP Theme",
  WOOCOMMERCE_PLUGIN: "Woo Plugin",
  QA_STAGING: "QA & Staging",
  DEPLOYMENT_MAINTENANCE: "Deploy",
};

export const UtilizationChart: React.FC<Props> = ({ projects, timesheets }) => {
  const phaseRevenue = new Map<ProjectPhase, number>();
  for (const entry of timesheets) {
    if (!entry.isBillable) continue;
    const rev = (entry.durationSeconds / 3600) * entry.hourlyRateAud;
    phaseRevenue.set(entry.phaseCategory, (phaseRevenue.get(entry.phaseCategory) ?? 0) + rev);
  }

  const phaseBars = (Object.keys(PHASE_NAMES) as ProjectPhase[]).map((phase) => ({
    phase,
    label: PHASE_NAMES[phase],
    revenue: Math.round(phaseRevenue.get(phase) ?? 0),
  }));

  const maxRev = Math.max(500, ...phaseBars.map((p) => p.revenue));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 print:hidden">
      {/* Retainer Burn Health Comparison */}
      <div className="bg-chronos-surface border border-white/10 rounded-xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-xs font-sans">Retainer Burn Thresholds</h3>
          <span className="text-[10px] text-gray-400 font-mono">80% Warning / 100% Cap</span>
        </div>

        <svg viewBox="0 0 440 160" className="w-full h-40 select-none" preserveAspectRatio="xMidYMid meet">
          {/* 80% & 100% Threshold Lines */}
          <line x1={84 + 260 * 0.8} y1="8" x2={84 + 260 * 0.8} y2="148" stroke="#FB923C" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={84 + 260} y1="8" x2={84 + 260} y2="148" stroke="#F43F5E" strokeWidth="1.2" strokeDasharray="4 2" />

          {projects.slice(0, 4).map((proj, idx) => {
            const health = calculateRetainerHealth(proj.budgetHours, proj.loggedHours);
            const y = 16 + idx * 34;
            const maxBar = 310;
            const barW = Math.min(maxBar, Math.round((health.burnPercentage / 100) * 260));
            const fill =
              health.status === "OVER_BURN"
                ? "#F43F5E"
                : health.status === "WARNING"
                ? "#FB923C"
                : "#10B981";

            return (
              <g key={proj.id}>
                <text x="4" y={y + 13} fill="#CBD5E1" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="bold">
                  {proj.code}
                </text>
                <rect x="84" y={y + 2} width={maxBar} height="16" rx="3" fill="#090A0F" />
                <rect x="84" y={y + 2} width={barW} height="16" rx="3" fill={fill} opacity="0.9" />
                <text x="404" y={y + 13} textAnchor="end" fill="#FFFFFF" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="bold">
                  {health.burnPercentage}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Billable Revenue by Phase */}
      <div className="bg-chronos-surface border border-white/10 rounded-xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-xs font-sans">Billable Yield by Agency Phase</h3>
          <span className="text-[10px] text-emerald-400 font-mono">AUD ex-GST</span>
        </div>

        <svg viewBox="0 0 440 160" className="w-full h-40 select-none" preserveAspectRatio="xMidYMid meet">
          {phaseBars.map((item, idx) => {
            const colW = 54;
            const x = 22 + idx * 82;
            const maxH = 98;
            const barH = Math.max(4, Math.round((item.revenue / maxRev) * maxH));
            const y = 124 - barH;

            return (
              <g key={item.phase}>
                <rect x={x} y={y} width={colW} height={barH} rx="4" fill="#6366F1" opacity="0.9" />
                <text x={x + colW / 2} y={y - 6} textAnchor="middle" fill="#A5B4FC" fontSize="9.5" fontFamily="IBM Plex Mono" fontWeight="bold">
                  ${item.revenue}
                </text>
                <text x={x + colW / 2} y="144" textAnchor="middle" fill="#9CA3AF" fontSize="9" fontFamily="IBM Plex Mono">
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
