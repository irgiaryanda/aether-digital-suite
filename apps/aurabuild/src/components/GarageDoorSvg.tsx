import React from "react";
import { GarageDoorConfig, GarageDoorEngineering } from "@aether/core-engine";

interface GarageDoorSvgProps {
  config: GarageDoorConfig;
  engineering: GarageDoorEngineering;
  isNightMode: boolean;
  showDimensions: boolean;
  isDoorOpen?: boolean;
  showEngineeringOverlay?: boolean;
}

export const GarageDoorSvg: React.FC<GarageDoorSvgProps> = ({
  config,
  engineering,
  isNightMode,
  showDimensions,
  isDoorOpen = false,
  showEngineeringOverlay = false,
}) => {
  const finishColors: Record<GarageDoorConfig["finish"], { fill: string; stroke: string; accent: string; isWood: boolean }> = {
    COLORBOND_MONUMENT: { fill: "#282B30", stroke: "#181A1E", accent: "#3B3F46", isWood: false },
    COLORBOND_SURFMIST: { fill: "#EAE6DF", stroke: "#C9C3B8", accent: "#F5F2EC", isWood: false },
    COLORBOND_BASALT: { fill: "#4E5258", stroke: "#383B40", accent: "#62676E", isWood: false },
    COLORBOND_WOODLAND_GREY: { fill: "#484844", stroke: "#333330", accent: "#5A5A55", isWood: false },
    NATURAL_TIMBER_CEDAR: { fill: "#8C4828", stroke: "#5A2B15", accent: "#A85934", isWood: true },
  };

  const finish = finishColors[config.finish];
  const doorStyle = config.doorStyle ?? "ARCHITECTURAL_HORIZONTAL";

  const widthRatio = Math.min(1, Math.max(0, (config.widthMm - 2400) / (6000 - 2400)));
  const heightRatio = Math.min(1, Math.max(0, (config.heightMm - 1950) / (3200 - 1950)));

  const doorW = Math.round(270 + widthRatio * 270);
  const doorH = Math.round(210 + heightRatio * 130);
  const groundY = 492;
  const doorX = Math.round(400 - doorW / 2);
  const doorY = groundY - doorH;

  const panelCount = config.panelCount;
  const panelH = doorH / panelCount;
  const liftOffset = isDoorOpen ? -Math.round(doorH * 0.74) : 0;

  const battenCount = Math.max(8, Math.round(doorW / 30));
  const battenSpacing = doorW / battenCount;
  const windowCount = doorW > 380 ? 4 : 3;
  const windowGap = 16;
  const windowW = Math.max(44, Math.floor((doorW - 40 - (windowCount - 1) * windowGap) / windowCount));

  const jStrutsPerPanel = Math.floor(engineering.jStrutCount / Math.max(1, panelCount));
  const clipsPerSide = Math.ceil(engineering.windLockClipCount / 2);

  return (
    <svg viewBox="0 0 800 580" className="w-full h-full max-h-[500px] select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="skyBackdrop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isNightMode ? "#0B0E14" : "#E5E9F0"} />
          <stop offset="100%" stopColor={isNightMode ? "#151B24" : "#F5F7FA"} />
        </linearGradient>
        <linearGradient id="facadeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isNightMode ? "#222832" : "#E6EBF1"} />
          <stop offset="100%" stopColor={isNightMode ? "#171B22" : "#CFD6DF"} />
        </linearGradient>
        <pattern id="cedarGrain" width="80" height="20" patternUnits="userSpaceOnUse">
          <rect width="80" height="20" fill="#8C4828" />
          <path d="M0 5 Q40 3 80 5 M0 12 Q40 15 80 12 M0 18 Q40 19 80 18" stroke="#6F361A" strokeWidth="0.8" fill="none" opacity="0.6" />
          <rect y="19" width="80" height="1" fill="#4E2310" />
        </pattern>
        <pattern id="frostedGlass" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#DCEBEE" opacity="0.88" />
          <line x1="0" y1="0" x2="16" y2="16" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.45" />
        </pattern>
        <radialGradient id="downlightBeam" cx="50%" cy="0%" r="92%">
          <stop offset="0%" stopColor="#FFF1D6" stopOpacity="0.82" />
          <stop offset="50%" stopColor="#FFD180" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#FFD180" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="drivewayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isNightMode ? "#1E232A" : "#CFD6E0"} />
          <stop offset="100%" stopColor={isNightMode ? "#111419" : "#E9EDF2"} />
        </linearGradient>
        <clipPath id="garageOpeningClip">
          <rect x={doorX} y={doorY} width={doorW} height={doorH} />
        </clipPath>
      </defs>

      <g id="layer-background">
        <rect x="0" y="0" width="800" height={groundY} fill="url(#skyBackdrop)" />
        <rect x="0" y={groundY} width="800" height={580 - groundY} fill="url(#drivewayGrad)" />
        <line x1="0" y1={groundY} x2="800" y2={groundY} stroke={isNightMode ? "#343A40" : "#B4BDC9"} strokeWidth="2" />
      </g>

      <g id="layer-structure">
        {/* Architectural Facade Volume with Top-Left Lighting Bias */}
        <rect
          x={Math.max(48, doorX - 78)}
          y={doorY - 56}
          width={doorW + 156}
          height={doorH + 56}
          fill="url(#facadeGrad)"
          stroke={isNightMode ? "#2D333B" : "#BCC4D0"}
          strokeWidth="2.5"
        />
        {/* Cantilevered Roof Fascia & Cast Eave Shadow */}
        <rect
          x={Math.max(24, doorX - 102)}
          y={doorY - 76}
          width={doorW + 204}
          height="24"
          fill={isNightMode ? "#12151B" : "#1F242B"}
          rx="2"
        />
        <rect
          x={Math.max(48, doorX - 78)}
          y={doorY - 52}
          width={doorW + 156}
          height="10"
          fill="#0F172A"
          opacity="0.16"
        />

        {/* Recessed Garage Interior Cavity */}
        <rect x={doorX} y={doorY} width={doorW} height={doorH} fill="#101318" />
        <line x1={doorX + 18} y1={doorY + 12} x2={doorX + 18} y2={groundY} stroke="#282E38" strokeWidth="2" />
        <line x1={doorX + doorW - 18} y1={doorY + 12} x2={doorX + doorW - 18} y2={groundY} stroke="#282E38" strokeWidth="2" />
        {isDoorOpen && (
          <ellipse cx="400" cy={groundY - 40} rx={doorW * 0.32} ry="18" fill="#FDE68A" opacity="0.18" />
        )}
      </g>

      <g id="layer-subject">
        {isNightMode && (
          <>
            <polygon
              points={`${doorX + 40},${doorY - 52} ${doorX - 40},${groundY} ${doorX + 120},${groundY}`}
              fill="url(#downlightBeam)"
              opacity="0.55"
            />
            <polygon
              points={`400,${doorY - 52} ${400 - 110},${groundY} ${400 + 110},${groundY}`}
              fill="url(#downlightBeam)"
              opacity="0.72"
            />
            <polygon
              points={`${doorX + doorW - 40},${doorY - 52} ${doorX + doorW - 120},${groundY} ${doorX + doorW + 40},${groundY}`}
              fill="url(#downlightBeam)"
              opacity="0.55"
            />
          </>
        )}
        {[doorX + 40, 400, doorX + doorW - 40].map((lx, idx) => (
          <circle key={`dl-${idx}`} cx={lx} cy={doorY - 56} r="4.5" fill="#F59E0B" opacity={isNightMode ? "1" : "0.45"} />
        ))}

        <g clipPath="url(#garageOpeningClip)">
          <g
            className="aura-door-motion"
            style={{
              transform: `translateY(${liftOffset}px)`,
              transition: "transform 650ms cubic-bezier(0.32, 0.72, 0, 1)",
            }}
          >
            {Array.from({ length: panelCount }).map((_, i) => {
              const py = doorY + i * panelH;
              const isTopPanel = i === 0;

              return (
                <g key={`panel-${i}`}>
                  <rect
                    x={doorX}
                    y={py}
                    width={doorW}
                    height={panelH - 1.5}
                    fill={finish.isWood ? "url(#cedarGrain)" : finish.fill}
                    stroke={finish.stroke}
                    strokeWidth="1.5"
                  />

                  {doorStyle === "ARCHITECTURAL_HORIZONTAL" && (
                    <>
                      <line
                        x1={doorX + 8}
                        y1={py + panelH * 0.33}
                        x2={doorX + doorW - 8}
                        y2={py + panelH * 0.33}
                        stroke={finish.stroke}
                        strokeWidth="0.75"
                        opacity="0.5"
                      />
                      <line
                        x1={doorX + 8}
                        y1={py + panelH * 0.66}
                        x2={doorX + doorW - 8}
                        y2={py + panelH * 0.66}
                        stroke={finish.stroke}
                        strokeWidth="0.75"
                        opacity="0.5"
                      />
                    </>
                  )}

                  {doorStyle === "HAMPTONS_COFFERED" && (
                    <g>
                      {[0, 1, 2, 3].map((boxIdx) => {
                        const boxGap = 14;
                        const boxW = (doorW - boxGap * 5) / 4;
                        const bx = doorX + boxGap + boxIdx * (boxW + boxGap);
                        return (
                          <rect
                            key={`ham-${i}-${boxIdx}`}
                            x={bx}
                            y={py + 9}
                            width={boxW}
                            height={Math.max(12, panelH - 19)}
                            fill="none"
                            stroke={finish.accent}
                            strokeWidth="1.5"
                            rx="2"
                            opacity="0.75"
                          />
                        );
                      })}
                    </g>
                  )}

                  {doorStyle === "FLUSH_MOUNT" && (
                    <line
                      x1={doorX}
                      y1={py + panelH - 1.5}
                      x2={doorX + doorW}
                      y2={py + panelH - 1.5}
                      stroke="#000000"
                      strokeWidth="0.75"
                      opacity="0.3"
                    />
                  )}

                  {isTopPanel && config.glazing !== "NONE" && (
                    <g>
                      {config.glazing === "FULL_VIEW_PANEL" ? (
                        <rect
                          x={doorX + 12}
                          y={py + 7}
                          width={doorW - 24}
                          height={Math.max(16, panelH - 16)}
                          fill="#8BB4C8"
                          stroke={finish.stroke}
                          strokeWidth="2"
                          opacity="0.88"
                        />
                      ) : (
                        Array.from({ length: windowCount }).map((__, wIdx) => (
                          <rect
                            key={`win-${wIdx}`}
                            x={doorX + 20 + wIdx * (windowW + windowGap)}
                            y={py + 10}
                            width={windowW}
                            height={Math.max(14, panelH - 22)}
                            fill={config.glazing === "FROSTED_PRIVACY_TOP" ? "url(#frostedGlass)" : "#7CAEC2"}
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                            rx="2.5"
                            opacity="0.9"
                          />
                        ))
                      )}
                    </g>
                  )}

                  <rect x={doorX + 6} y={py + panelH - 8} width="8" height="10" fill="#868E96" opacity="0.5" />
                  <rect x={doorX + doorW - 14} y={py + panelH - 8} width="8" height="10" fill="#868E96" opacity="0.5" />
                </g>
              );
            })}

            {doorStyle === "VERTICAL_BATTEN" &&
              Array.from({ length: battenCount }).map((_, bIdx) => (
                <rect
                  key={`batten-${bIdx}`}
                  x={doorX + bIdx * battenSpacing + 3}
                  y={doorY + 2}
                  width={Math.max(6, battenSpacing - 12)}
                  height={doorH - 6}
                  fill={finish.accent}
                  stroke={finish.stroke}
                  strokeWidth="0.75"
                  opacity="0.68"
                />
              ))}

            <rect x={doorX} y={doorY + doorH - 6} width={doorW} height="6" fill="#14181E" />
          </g>
        </g>

        {/* Outer Opening Silhouette (3px) */}
        <rect x={doorX} y={doorY} width={doorW} height={doorH} fill="none" stroke="#111418" strokeWidth="3" />
      </g>

      <g id="layer-fx">
        {showEngineeringOverlay && (
          <g className="font-mono text-[10px] select-none">
            <line x1={doorX + 10} y1={doorY - 18} x2={doorX + doorW - 10} y2={doorY - 18} stroke="#0E7490" strokeWidth="3" strokeDasharray="6 3" />
            <rect x={400 - 44} y={doorY - 26} width="88" height="16" fill="#0F172A" rx="3" />
            <text x="400" y={doorY - 15} textAnchor="middle" fill="#38BDF8" fontWeight="bold">
              {engineering.springRatingCycles / 1000}K SPRINGS
            </text>

            {jStrutsPerPanel > 0 &&
              Array.from({ length: panelCount }).map((_, pIdx) => (
                <line
                  key={`strut-${pIdx}`}
                  x1={doorX + 12}
                  y1={doorY + pIdx * panelH + panelH * 0.5}
                  x2={doorX + doorW - 12}
                  y2={doorY + pIdx * panelH + panelH * 0.5}
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                  opacity="0.92"
                />
              ))}

            {Array.from({ length: Math.min(clipsPerSide, 12) }).map((_, cIdx) => {
              const cy = doorY + 18 + (cIdx * (doorH - 36)) / Math.max(1, Math.min(clipsPerSide, 12) - 1);
              return (
                <g key={`clip-${cIdx}`}>
                  <rect x={doorX - 5} y={cy - 4} width="10" height="8" fill="#EF4444" rx="1.5" />
                  <rect x={doorX + doorW - 5} y={cy - 4} width="10" height="8" fill="#EF4444" rx="1.5" />
                </g>
              );
            })}

            <rect x={doorX + 12} y={doorY + 12} width="212" height="44" fill="#0F172A" fillOpacity="0.92" stroke="#38BDF8" rx="8" />
            <text x={doorX + 22} y={doorY + 28} fill="#38BDF8" fontWeight="bold">
              AS/NZS 4505 REGION {engineering.windRegion} ({engineering.ulsPressureKpa} kPa ULS)
            </text>
            <text x={doorX + 22} y={doorY + 44} fill="#F8FAFC">
              {engineering.jStrutCount} J-Struts &middot; {engineering.windLockClipCount} Clips &middot; {engineering.minTorqueNm} Nm
            </text>
          </g>
        )}

        {showDimensions && (
          <g className="font-mono text-[11px] font-semibold tabular-nums select-none" fill="#0E7490">
            <line x1={doorX} y1={doorY - 94} x2={doorX + doorW} y2={doorY - 94} stroke="#0E7490" strokeWidth="1.5" />
            <line x1={doorX} y1={doorY - 102} x2={doorX} y2={doorY - 86} stroke="#0E7490" strokeWidth="1.5" />
            <line x1={doorX + doorW} y1={doorY - 102} x2={doorX + doorW} y2={doorY - 86} stroke="#0E7490" strokeWidth="1.5" />
            <rect x="356" y={doorY - 105} width="88" height="22" fill="#FFFFFF" stroke="#0E7490" rx="6" />
            <text x="400" y={doorY - 91} textAnchor="middle" alignmentBaseline="middle" fill="#0E7490">
              {config.widthMm} mm
            </text>

            <line x1={doorX - 32} y1={doorY} x2={doorX - 32} y2={groundY} stroke="#0E7490" strokeWidth="1.5" />
            <line x1={doorX - 40} y1={doorY} x2={doorX - 24} y2={doorY} stroke="#0E7490" strokeWidth="1.5" />
            <line x1={doorX - 40} y1={groundY} x2={doorX - 24} y2={groundY} stroke="#0E7490" strokeWidth="1.5" />
            <rect x={doorX - 72} y={Math.round(doorY + doorH / 2 - 11)} width="80" height="22" fill="#FFFFFF" stroke="#0E7490" rx="6" />
            <text x={doorX - 32} y={Math.round(doorY + doorH / 2 + 2)} textAnchor="middle" alignmentBaseline="middle" fill="#0E7490">
              {config.heightMm} mm
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
