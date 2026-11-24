import React from "react";
import { PoolConfig, PoolHydraulics } from "@aether/core-engine";

interface LuxuryPoolSvgProps {
  config: PoolConfig;
  hydraulics: PoolHydraulics;
  isNightMode: boolean;
  showDimensions: boolean;
  showEngineeringOverlay?: boolean;
}

export const LuxuryPoolSvg: React.FC<LuxuryPoolSvgProps> = ({
  config,
  hydraulics,
  isNightMode,
  showDimensions,
  showEngineeringOverlay = false,
}) => {
  const poolCopingMap: Record<PoolConfig["copingFinish"], { fill: string; stroke: string }> = {
    TRAVERTINE_CLASSIC: { fill: "#E3D7C5", stroke: "#C7B9A3" },
    GRANITE_FLAMED: { fill: "#3A3D42", stroke: "#242629" },
    BLUESTONE_SAWN: { fill: "#5C6269", stroke: "#43484E" },
    LIMESTONE_COASTAL: { fill: "#EAE4D9", stroke: "#CEC7BA" },
  };

  const interiorPaletteMap: Record<PoolConfig["interiorFinish"], { top: string; mid: string; deep: string }> = {
    AQUA_PEARL_CERAMIC: { top: "#48CAE4", mid: "#0096C7", deep: "#023E8A" },
    SAPPHIRE_SPARKLE_FIBRE: { top: "#38BDF8", mid: "#0369A1", deep: "#1E3A8A" },
    CRUSHED_QUARTZ_DEEP: { top: "#67E8F9", mid: "#0891B2", deep: "#164E63" },
  };

  const ledGlowMap: Record<PoolConfig["ledColor"], string> = {
    CYAN_COASTAL: "#00E5FF",
    WHITE_CRISP: "#FFFFFF",
    ULTRA_BLUE: "#2979FF",
    AMBER_WARM: "#FFAB00",
  };

  const coping = poolCopingMap[config.copingFinish];
  const water = interiorPaletteMap[config.interiorFinish];
  const ledGlow = ledGlowMap[config.ledColor];

  const lenNorm = Math.min(1, Math.max(0, (config.lengthMm - 5000) / 7000));
  const widNorm = Math.min(1, Math.max(0, (config.widthMm - 2500) / 2500));
  const depthDrop = Math.round(28 + ((config.deepDepthMm - 1600) / 400) * 16);

  const halfUx = 115 + lenNorm * 68;
  const halfUy = -38 - lenNorm * 22;
  const halfVx = 62 + widNorm * 38;
  const halfVy = 60 + widNorm * 36;

  const cx = 400;
  const cy = 285;

  const pt = (sx: number, sy: number, pad = 0) => {
    const ux = halfUx + pad;
    const uy = halfUy - pad * 0.33;
    const vx = halfVx + pad * 0.6;
    const vy = halfVy + pad * 0.58;
    return {
      x: Math.round(cx + sx * ux + sy * vx),
      y: Math.round(cy + sx * uy + sy * vy),
    };
  };

  const toPoints = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");

  const deckPts = [pt(-1, -1, 56), pt(1, -1, 56), pt(1, 1, 56), pt(-1, 1, 56)];
  const copingPts = [pt(-1, -1, 16), pt(1, -1, 16), pt(1, 1, 16), pt(-1, 1, 16)];
  const waterPts = [pt(-1, -1, 0), pt(1, -1, 0), pt(1, 1, 0), pt(-1, 1, 0)];

  const stepEnd = -0.55;
  const shelfPts = [
    waterPts[0]!,
    { x: Math.round(cx + stepEnd * halfUx - halfVx), y: Math.round(cy + stepEnd * halfUy - halfVy) },
    { x: Math.round(cx + stepEnd * halfUx + halfVx), y: Math.round(cy + stepEnd * halfUy + halfVy) },
    waterPts[3]!,
  ];

  const cantLeft = deckPts[3]!;
  const cantRight = deckPts[2]!;
  const cantileverPts = [
    cantLeft,
    cantRight,
    { x: cantRight.x + 8, y: cantRight.y + depthDrop },
    { x: cantLeft.x + 8, y: cantLeft.y + depthDrop },
  ];

  const lights = [
    pt(-0.5, -0.35, -4),
    pt(0.45, -0.4, -4),
    pt(0.55, 0.35, -4),
    pt(-0.35, 0.45, -4),
  ];

  return (
    <svg viewBox="0 0 800 580" className="w-full h-full max-h-[500px] select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="poolWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={water.top} />
          <stop offset="60%" stopColor={water.mid} />
          <stop offset="100%" stopColor={water.deep} />
        </linearGradient>

        <linearGradient id="deckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isNightMode ? "#252B34" : "#F0ECE4"} />
          <stop offset="100%" stopColor={isNightMode ? "#171B22" : "#DCD6CA"} />
        </linearGradient>

        <filter id="underwaterGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g id="layer-structure">
        <polygon
          points={toPoints(deckPts)}
          fill="url(#deckGrad)"
          stroke={isNightMode ? "#374151" : "#B5AEA0"}
          strokeWidth="2.5"
        />

        {config.cantileverEdge && (
          <polygon
            points={toPoints(cantileverPts)}
            fill="#14181E"
            opacity={isNightMode ? "0.92" : "0.45"}
          />
        )}

        <polygon
          points={toPoints(copingPts)}
          fill={coping.fill}
          stroke={coping.stroke}
          strokeWidth="3"
        />
      </g>

      <g id="layer-subject">
        <polygon points={toPoints(waterPts)} fill="url(#poolWaterGrad)" opacity="0.95" />

        <polyline
          points={toPoints([waterPts[0]!, waterPts[1]!, waterPts[2]!])}
          stroke="#ADE8F4"
          strokeWidth="1.5"
          fill="none"
          opacity="0.85"
        />

        <polygon
          points={toPoints(shelfPts)}
          fill="#90E0EF"
          opacity="0.42"
          stroke="#0077B6"
          strokeWidth="0.75"
        />

        <g className="aura-water-shimmer" opacity="0.35">
          <line
            x1={Math.round((waterPts[0]!.x + waterPts[1]!.x) / 2 - 45)}
            y1={cy - 18}
            x2={Math.round((waterPts[0]!.x + waterPts[1]!.x) / 2 + 65)}
            y2={cy - 36}
            stroke="#E0F7FA"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1={cx - 30}
            y1={cy + 26}
            x2={cx + 72}
            y2={cy + 8}
            stroke="#E0F7FA"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {lights.map((light, idx) => (
          <g key={`light-${idx}`}>
            <circle
              cx={light.x}
              cy={light.y}
              r="8"
              fill={ledGlow}
              filter="url(#underwaterGlow)"
              opacity={isNightMode ? "0.96" : "0.52"}
            />
            <circle cx={light.x} cy={light.y} r="3" fill="#FFFFFF" />
          </g>
        ))}
      </g>

      <g id="layer-fx">
        {showEngineeringOverlay && (
          <g className="font-mono text-[10px] select-none">
            <path
              d={`M ${waterPts[0]!.x + 35} ${waterPts[0]!.y + 20} Q ${cx} ${cy - 45} ${waterPts[2]!.x - 45} ${waterPts[2]!.y - 20}`}
              fill="none"
              stroke="#FDE047"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <rect x="20" y="20" width="240" height="58" fill="#0F172A" fillOpacity="0.92" stroke="#38BDF8" rx="8" />
            <text x="32" y="38" fill="#38BDF8" fontWeight="bold">
              AS 1926 HYDRAULIC TELEMETRY
            </text>
            <text x="32" y="54" fill="#F8FAFC">
              Turnover: {hydraulics.turnoverFlowRateLpm} L/min ({hydraulics.recommendedPumpPowerKw} kW)
            </text>
            <text x="32" y="68" fill="#CBD5E1">
              Media: {hydraulics.filterMediaMassKg} kg &middot; Cl2: {hydraulics.chlorinatorOutputGph} g/hr
            </text>
          </g>
        )}

        {showDimensions && (
          <g className="font-mono text-[11px] font-semibold tabular-nums select-none" fill="#0E7490">
            <rect
              x={Math.round((copingPts[0]!.x + copingPts[1]!.x) / 2 - 44)}
              y={Math.round((copingPts[0]!.y + copingPts[1]!.y) / 2 - 34)}
              width="88"
              height="22"
              fill="#FFFFFF"
              stroke="#0E7490"
              rx="6"
            />
            <text
              x={Math.round((copingPts[0]!.x + copingPts[1]!.x) / 2)}
              y={Math.round((copingPts[0]!.y + copingPts[1]!.y) / 2 - 20)}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {config.lengthMm} mm
            </text>

            <rect
              x={Math.round((copingPts[1]!.x + copingPts[2]!.x) / 2 + 12)}
              y={Math.round((copingPts[1]!.y + copingPts[2]!.y) / 2 - 11)}
              width="84"
              height="22"
              fill="#FFFFFF"
              stroke="#0E7490"
              rx="6"
            />
            <text
              x={Math.round((copingPts[1]!.x + copingPts[2]!.x) / 2 + 54)}
              y={Math.round((copingPts[1]!.y + copingPts[2]!.y) / 2 + 3)}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {config.widthMm} mm
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
