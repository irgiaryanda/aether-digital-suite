import React from "react";
import { RetrofitRoiResult } from "@aether/core-engine";

interface Props {
  roi: RetrofitRoiResult;
}

export const RoiPaybackChart: React.FC<Props> = ({ roi }) => {
  const points = [0, 1, 2, 3, 4, 5].map((year) => ({
    year,
    label: `Y${year}`,
    netAud: Math.round(roi.annualAudSaved * year - roi.totalCapitalCostAud),
  }));

  const maxAbs = Math.max(1000, ...points.map((p) => Math.abs(p.netAud)));

  const width = 560;
  const height = 160;
  const zeroY = 92;
  const barAreaHalf = 62;

  return (
    <div className="p-4 bg-volt-recessed rounded-[12px] border border-white/[0.06] space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-volt-muted font-semibold">5-Year Cumulative Net Cashflow Projection</span>
        <span
          className={`font-mono font-bold tabular-nums ${
            roi.fiveYearNetSavingsAud >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          5Y Net: ${roi.fiveYearNetSavingsAud.toLocaleString()} AUD
        </span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 select-none" preserveAspectRatio="xMidYMid meet">
        <line x1="28" y1={zeroY} x2={width - 20} y2={zeroY} stroke="#384359" strokeWidth="1.2" strokeDasharray="4 3" />
        <text x="18" y={zeroY + 3} textAnchor="end" fill="#64748B" fontSize="9.5" fontFamily="JetBrains Mono">
          $0
        </text>

        {points.map((pt, idx) => {
          const barW = 48;
          const stepX = (width - 84) / points.length;
          const bx = 48 + idx * stepX;
          const barH = Math.max(4, Math.round((Math.abs(pt.netAud) / maxAbs) * barAreaHalf));
          const isPositive = pt.netAud >= 0;
          const by = isPositive ? zeroY - barH : zeroY;

          return (
            <g key={pt.label}>
              <rect
                x={bx}
                y={by}
                width={barW}
                height={barH}
                rx="4"
                fill={isPositive ? "#10B981" : "#EF4444"}
                opacity="0.9"
              />
              <text
                x={bx + barW / 2}
                y={isPositive ? by - 6 : by + barH + 12}
                textAnchor="middle"
                fill={isPositive ? "#34D399" : "#F87171"}
                fontSize="9.5"
                fontFamily="JetBrains Mono"
                fontWeight="bold"
              >
                {pt.netAud >= 0
                  ? `+$${Math.round((pt.netAud / 1000) * 10) / 10}k`
                  : `-$${Math.round((Math.abs(pt.netAud) / 1000) * 10) / 10}k`}
              </text>
              <text
                x={bx + barW / 2}
                y={height - 6}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="10"
                fontFamily="JetBrains Mono"
              >
                {pt.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
