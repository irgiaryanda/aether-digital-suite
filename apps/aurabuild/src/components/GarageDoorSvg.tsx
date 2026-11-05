import React from "react";
import { GarageDoorConfig, GarageDoorEngineering } from "@aether/core-engine";

interface GarageDoorSvgProps {
  config: GarageDoorConfig;
  engineering: GarageDoorEngineering;
  isNightMode: boolean;
  showDimensions: boolean;
}

export const GarageDoorSvg: React.FC<GarageDoorSvgProps> = ({
  config,
  engineering,
  isNightMode,
  showDimensions,
}) => {
  const finishColors: Record<GarageDoorConfig["finish"], { fill: string; stroke: string; isWood: boolean }> = {
    COLORBOND_MONUMENT: { fill: "#282B30", stroke: "#1C1E22", isWood: false },
    COLORBOND_SURFMIST: { fill: "#EAE6DF", stroke: "#D0CBC2", isWood: false },
    COLORBOND_BASALT: { fill: "#4E5258", stroke: "#3A3D42", isWood: false },
    COLORBOND_WOODLAND_GREY: { fill: "#484844", stroke: "#343431", isWood: false },
    NATURAL_TIMBER_CEDAR: { fill: "#8C4828", stroke: "#5E2E17", isWood: true },
  };

  const finish = finishColors[config.finish];
  const doorX = 140;
  const doorY = 138;
  const doorW = 520;
  const doorH = 390;
  const panelCount = config.panelCount;
  const panelH = doorH / panelCount;

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full max-h-[500px] select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="cedarGrain" width="80" height="20" patternUnits="userSpaceOnUse">
          <rect width="80" height="20" fill="#8C4828" />
          <path d="M0 5 Q40 3 80 5 M0 12 Q40 15 80 12 M0 18 Q40 19 80 18" stroke="#6F361A" strokeWidth="0.8" fill="none" opacity="0.6" />
          <rect y="19" width="80" height="1" fill="#4E2310" />
        </pattern>
        <pattern id="frostedGlass" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#DCEBEE" opacity="0.85" />
          <line x1="0" y1="0" x2="20" y2="20" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
        </pattern>
        <radialGradient id="downlightBeam" cx="50%" cy="0%" r="90%">
          <stop offset="0%" stopColor="#FFF1D6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FFD180" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FFD180" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="60" y="80" width="680" height="460" fill={isNightMode ? "#1E2228" : "#E2E5E9"} />
      <rect x="110" y="110" width="580" height="28" fill={isNightMode ? "#14171A" : "#CED4DA"} stroke="#ADB5BD" strokeWidth="1" />

      {isNightMode && <polygon points="400,138 220,530 580,530" fill="url(#downlightBeam)" opacity="0.75" />}
      <circle cx="400" cy="124" r="5" fill="#F59E0B" opacity={isNightMode ? "1" : "0.5"} />

      {Array.from({ length: panelCount }).map((_, i) => {
        const py = doorY + i * panelH;
        const isTopPanel = i === 0;

        return (
          <g key={`panel-${i}`}>
            <rect
              x={doorX}
              y={py}
              width={doorW}
              height={panelH - 2}
              fill={finish.isWood ? "url(#cedarGrain)" : finish.fill}
              stroke={finish.stroke}
              strokeWidth="1.5"
            />

            {isTopPanel && config.glazing !== "NONE" && (
              <g>
                {config.glazing === "FULL_VIEW_PANEL" ? (
                  <rect
                    x={doorX + 16}
                    y={py + 8}
                    width={doorW - 32}
                    height={panelH - 18}
                    fill="#8BB4C8"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    opacity="0.85"
                  />
                ) : (
                  [0, 1, 2, 3].map((wIdx) => (
                    <rect
                      key={`win-${wIdx}`}
                      x={doorX + 24 + wIdx * 120}
                      y={py + 12}
                      width={92}
                      height={panelH - 26}
                      fill={config.glazing === "FROSTED_PRIVACY_TOP" ? "url(#frostedGlass)" : "#82B1C2"}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      rx="3"
                      opacity="0.85"
                    />
                  ))
                )}
              </g>
            )}

            <line
              x1={doorX + 10}
              y1={py + panelH / 2}
              x2={doorX + doorW - 10}
              y2={py + panelH / 2}
              stroke={finish.stroke}
              strokeWidth="1"
              opacity="0.4"
            />
            <rect x={doorX + 8} y={py + panelH - 8} width="10" height="12" fill="#868E96" />
            <rect x={doorX + doorW - 18} y={py + panelH - 8} width="10" height="12" fill="#868E96" />
          </g>
        );
      })}

      <rect x={doorX - 2} y={doorY + doorH - 4} width={doorW + 4} height="8" fill="#1A1D20" rx="1" />
      <line x1="60" y1={doorY + doorH + 4} x2="740" y2={doorY + doorH + 4} stroke="#6C757D" strokeWidth="2" />

      {showDimensions && (
        <g className="font-mono text-[11px] font-semibold tabular-nums select-none" fill="#0E7490">
          <line x1="140" y1="100" x2="660" y2="100" stroke="#0E7490" strokeWidth="1.5" />
          <rect x="360" y="88" width="80" height="22" fill="#FFFFFF" stroke="#0E7490" rx="4" />
          <text x="400" y="103" textAnchor="middle" alignmentBaseline="middle" fill="#0E7490">
            {config.widthMm} mm
          </text>

          <line x1="110" y1="138" x2="110" y2="528" stroke="#0E7490" strokeWidth="1.5" />
          <rect x="65" y="320" width="76" height="22" fill="#FFFFFF" stroke="#0E7490" rx="4" />
          <text x="103" y="335" textAnchor="middle" alignmentBaseline="middle" fill="#0E7490">
            {config.heightMm} mm
          </text>
        </g>
      )}
    </svg>
  );
};
