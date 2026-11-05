import React from "react";
import { PoolConfig, PoolHydraulics } from "@aether/core-engine";

interface LuxuryPoolSvgProps {
  config: PoolConfig;
  hydraulics: PoolHydraulics;
  isNightMode: boolean;
  showDimensions: boolean;
}

export const LuxuryPoolSvg: React.FC<LuxuryPoolSvgProps> = ({
  config,
  hydraulics,
  isNightMode,
  showDimensions,
}) => {
  const poolCopingMap: Record<PoolConfig["copingFinish"], { fill: string; stroke: string }> = {
    TRAVERTINE_CLASSIC: { fill: "#E3D7C5", stroke: "#C7B9A3" },
    GRANITE_FLAMED: { fill: "#3A3D42", stroke: "#242629" },
    BLUESTONE_SAWN: { fill: "#5C6269", stroke: "#43484E" },
    LIMESTONE_COASTAL: { fill: "#EAE4D9", stroke: "#CEC7BA" },
  };

  const ledGlowMap: Record<PoolConfig["ledColor"], string> = {
    CYAN_COASTAL: "#00E5FF",
    WHITE_CRISP: "#FFFFFF",
    ULTRA_BLUE: "#2979FF",
    AMBER_WARM: "#FFAB00",
  };

  const coping = poolCopingMap[config.copingFinish];
  const ledGlow = ledGlowMap[config.ledColor];

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full max-h-[500px] select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="poolWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#48CAE4" />
          <stop offset="60%" stopColor="#0096C7" />
          <stop offset="100%" stopColor="#023E8A" />
        </linearGradient>

        <filter id="underwaterGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <polygon
        points="100,220 540,110 720,290 280,440"
        fill={isNightMode ? "#1E2228" : "#EAE4D9"}
        stroke="#BDB5A7"
        strokeWidth="1.5"
      />

      {config.cantileverEdge && (
        <polygon
          points="280,440 720,290 730,340 290,490"
          fill="#1A1D20"
          opacity={isNightMode ? "0.9" : "0.4"}
        />
      )}

      <polygon
        points="160,240 500,150 640,290 300,400"
        fill={coping.fill}
        stroke={coping.stroke}
        strokeWidth="4"
      />

      <polygon points="180,246 480,166 620,290 320,388" fill="url(#poolWaterGrad)" opacity="0.92" />
      <polyline points="180,246 480,166 620,290" stroke="#ADE8F4" strokeWidth="2.5" fill="none" opacity="0.8" />

      <polygon points="195,248 275,225 315,260 235,286" fill="#90E0EF" opacity="0.75" stroke="#0077B6" strokeWidth="1" />

      {[
        { cx: 300, cy: 220 },
        { cx: 420, cy: 190 },
        { cx: 540, cy: 240 },
        { cx: 400, cy: 330 },
      ].map((light, idx) => (
        <g key={`light-${idx}`}>
          <circle
            cx={light.cx}
            cy={light.cy}
            r="7"
            fill={ledGlow}
            filter="url(#underwaterGlow)"
            opacity={isNightMode ? "0.95" : "0.5"}
          />
          <circle cx={light.cx} cy={light.cy} r="3" fill="#FFFFFF" />
        </g>
      ))}

      {showDimensions && (
        <g className="font-mono text-[11px] font-semibold tabular-nums select-none" fill="#0E7490">
          <rect x="330" y="115" width="84" height="22" fill="#FFFFFF" stroke="#0E7490" rx="4" />
          <text x="372" y="130" textAnchor="middle" alignmentBaseline="middle">
            {config.lengthMm} mm
          </text>

          <rect x="620" y="195" width="80" height="22" fill="#FFFFFF" stroke="#0E7490" rx="4" />
          <text x="660" y="210" textAnchor="middle" alignmentBaseline="middle">
            {config.widthMm} mm
          </text>
        </g>
      )}
    </svg>
  );
};
