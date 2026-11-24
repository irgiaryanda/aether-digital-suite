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

  const maxAbs = Math.max(
    1000,
    ...points.map((p) => Math.abs(p.netAud))
  );

  const width = 560;
  const height = 160;
  const zeroY = 92;
  const barAreaHalf = 62;

  return (
    <div className="p-3 bg-volt-base rounded-lg border border-volt-border space-y-2">
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="text-gray-400 uppercase font-bold">5-Year Cumulative Net Cashflow Projection</span>
        <span className={roi.fiveYearNetSavingsAud >= 0 ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
          5Y Net: ${roi.fiveYearNetSavingsAud.toLocaleString()} AUD
        </span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 select-none" preserveAspectRatio="xMidYMid meet">
        <line x1="24" y1={zeroY} x2={width - 20} y2={zeroY} stroke="#4B5563" strokeWidth="1.2" strokeDasharray="4 3" />
        <text x="16" y={zeroY + 3} textAnchor="end" fill="#6B7280" fontSize="9" fontFamily="JetBrains Mono">
          $0
        </text>

        {points.map((pt, idx) => {
          const barW = 48;
          const stepX = (width - 80) / points.length;
          const bx = 44 + idx * stepX;
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
                rx="3"
                fill={isPositive ? "#10B981" : "#EF4444"}
                opacity="0.88"
              />
              <text
                x={bx + barW / 2}
                y={isPositive ? by - 5 : by + barH + 11}
                textAnchor="middle"
                fill={isPositive ? "#34D399" : "#F87171"}
                fontSize="9"
                fontFamily="JetBrains Mono"
                fontWeight="bold"
              >
                {pt.netAud >= 0 ? `+$${Math.round(pt.netAud / 1000 * 10) / 10}k` : `-$${Math.round(Math.abs(pt.netAud) / 1000 * 10) / 10}k`}
              </text>
              <text
                x={bx + barW / 2}
                y={height - 6}
                textAnchor="middle"
                fill="#9CA3AF"
                fontSize="9.5"
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
