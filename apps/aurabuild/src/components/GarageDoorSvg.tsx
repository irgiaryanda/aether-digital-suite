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

  // Proportional parametric geometry mapped from millimeter inputs
  const widthRatio = Math.min(1, Math.max(0, (config.widthMm - 2400) / (6000 - 2400)));
  const heightRatio = Math.min(1, Math.max(0, (config.heightMm - 1950) / (3200 - 1950)));

  const doorW = Math.round(270 + widthRatio * 270); // 270px to 540px
  const doorH = Math.round(210 + heightRatio * 130); // 210px to 340px
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
        <pattern id="cedarGrain" width="80" height="20" patternUnits="userSpaceOnUse">
          <rect width="80" height="20" fill="#8C4828" />
          <path d="M0 5 Q40 3 80 5 M0 12 Q40 15 80 12 M0 18 Q40 19 80 18" stroke="#6F361A" strokeWidth="0.9" fill="none" opacity="0.6" />
          <rect y="19" width="80" height="1" fill="#4E2310" />
        </pattern>
        <pattern id="frostedGlass" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#DCEBEE" opacity="0.88" />
          <line x1="0" y1="0" x2="16" y2="16" stroke="#FFFFFF" strokeWidth="1" opacity="0.45" />
        </pattern>
        <radialGradient id="downlightBeam" cx="50%" cy="0%" r="92%">
          <stop offset="0%" stopColor="#FFF1D6" stopOpacity="0.82" />
          <stop offset="50%" stopColor="#FFD180" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#FFD180" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="drivewayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isNightMode ? "#1E232A" : "#CFD4DA"} />
          <stop offset="100%" stopColor={isNightMode ? "#12151A" : "#E9ECEF"} />
        </linearGradient>
        <clipPath id="garageOpeningClip">
          <rect x={doorX} y={doorY} width={doorW} height={doorH} />
        </clipPath>
      </defs>

      {/* Architectural Sky / Backdrop */}
      <rect x="0" y="0" width="800" height={groundY} fill={isNightMode ? "#0F1319" : "#EEF1F4"} />
      {/* Concrete Driveway Apron */}
      <rect x="0" y={groundY} width="800" height={580 - groundY} fill="url(#drivewayGrad)" />
      <line x1="0" y1={groundY} x2="800" y2={groundY} stroke={isNightMode ? "#343A40" : "#ADB5BD"} strokeWidth="2" />

      {/* Architectural Facade Piers & Soffit */}
      <rect
        x={Math.max(48, doorX - 78)}
        y={doorY - 56}
        width={doorW + 156}
        height={doorH + 56}
        fill={isNightMode ? "#1B2027" : "#DCE0E5"}
        stroke={isNightMode ? "#2D333B" : "#C4C9D0"}
        strokeWidth="1.5"
      />
      {/* Cantilevered Roof Fascia & Eave */}
      <rect
        x={Math.max(24, doorX - 102)}
        y={doorY - 76}
        width={doorW + 204}
        height="24"
        fill={isNightMode ? "#13161B" : "#282B30"}
        rx="2"
      />
      <rect
        x={Math.max(48, doorX - 78)}
        y={doorY - 52}
        width={doorW + 156}
        height="8"
        fill="#000000"
        opacity="0.18"
      />

      {/* Recessed Garage Interior */}
      <rect x={doorX} y={doorY} width={doorW} height={doorH} fill="#121417" />
      <line x1={doorX + 18} y1={doorY + 12} x2={doorX + 18} y2={groundY} stroke="#2B3038" strokeWidth="3" />
      <line x1={doorX + doorW - 18} y1={doorY + 12} x2={doorX + doorW - 18} y2={groundY} stroke="#2B3038" strokeWidth="3" />
      {isDoorOpen && (
        <ellipse cx="400" cy={groundY - 40} rx={doorW * 0.32} ry="18" fill="#FDE68A" opacity="0.16" />
      )}

      {/* Perimeter Downlight Cones */}
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

      {/* Retractable Door Group Clipped to Opening */}
      <g clipPath="url(#garageOpeningClip)">
        <g
          className="aura-door-motion"
          style={{
            transform: `translateY(${liftOffset}px)`,
            transition: "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)",
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
                  strokeWidth="1.2"
                />

                {/* Architectural Style Profiles */}
                {doorStyle === "ARCHITECTURAL_HORIZONTAL" && (
                  <>
                    <line
                      x1={doorX + 8}
                      y1={py + panelH * 0.33}
                      x2={doorX + doorW - 8}
                      y2={py + panelH * 0.33}
                      stroke={finish.stroke}
                      strokeWidth="1"
                      opacity="0.45"
                    />
                    <line
                      x1={doorX + 8}
                      y1={py + panelH * 0.66}
                      x2={doorX + doorW - 8}
                      y2={py + panelH * 0.66}
                      stroke={finish.stroke}
                      strokeWidth="1"
                      opacity="0.45"
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
                          strokeWidth="2"
                          rx="2"
                          opacity="0.7"
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
                    strokeWidth="0.9"
                    opacity="0.25"
                  />
                )}

                {/* Glazing Inserts on Top Panel */}
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
                        strokeWidth="2.5"
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
                          strokeWidth="1.8"
                          rx="2.5"
                          opacity="0.9"
                        />
                      ))
                    )}
                  </g>
                )}

                {/* Side Stile End Caps */}
                <rect x={doorX + 6} y={py + panelH - 8} width="8" height="10" fill="#868E96" opacity="0.55" />
                <rect x={doorX + doorW - 14} y={py + panelH - 8} width="8" height="10" fill="#868E96" opacity="0.55" />
              </g>
            );
          })}

          {/* Vertical Batten Overlay Across Panels */}
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
                strokeWidth="0.8"
                opacity="0.65"
              />
            ))}

          {/* Bottom Weather Seal */}
          <rect x={doorX} y={doorY + doorH - 6} width={doorW} height="6" fill="#16191D" />
        </g>
      </g>

      {/* Jamb Trim Border */}
      <rect x={doorX} y={doorY} width={doorW} height={doorH} fill="none" stroke="#1A1D20" strokeWidth="2.5" />

      {/* Engineering Structural X-Ray Overlay */}
      {showEngineeringOverlay && (
        <g className="font-mono text-[10px] select-none">
          {/* Torsion Spring Assembly Header */}
          <line x1={doorX + 10} y1={doorY - 18} x2={doorX + doorW - 10} y2={doorY - 18} stroke="#0E7490" strokeWidth="3" strokeDasharray="6 3" />
          <rect x={400 - 44} y={doorY - 26} width="88" height="16" fill="#0F172A" rx="3" />
          <text x="400" y={doorY - 15} textAnchor="middle" fill="#38BDF8" fontWeight="bold">
            {engineering.springRatingCycles / 1000}K SPRINGS
          </text>

          {/* Horizontal J-Struts per Panel */}
          {jStrutsPerPanel > 0 &&
            Array.from({ length: panelCount }).map((_, pIdx) => (
              <line
                key={`strut-${pIdx}`}
                x1={doorX + 12}
                y1={doorY + pIdx * panelH + panelH * 0.5}
                x2={doorX + doorW - 12}
                y2={doorY + pIdx * panelH + panelH * 0.5}
                stroke="#F59E0B"
                strokeWidth="2.2"
                strokeDasharray="8 4"
                opacity="0.92"
              />
            ))}

          {/* Wind-Lock Track Engagement Clips */}
          {Array.from({ length: Math.min(clipsPerSide, 12) }).map((_, cIdx) => {
            const cy = doorY + 18 + (cIdx * (doorH - 36)) / Math.max(1, Math.min(clipsPerSide, 12) - 1);
            return (
              <g key={`clip-${cIdx}`}>
                <rect x={doorX - 5} y={cy - 4} width="10" height="8" fill="#EF4444" rx="1.5" />
                <rect x={doorX + doorW - 5} y={cy - 4} width="10" height="8" fill="#EF4444" rx="1.5" />
              </g>
            );
          })}

          {/* ULS Wind Load Telemetry Badge */}
          <rect x={doorX + 12} y={doorY + 12} width="186" height="44" fill="#0F172A" fillOpacity="0.9" stroke="#38BDF8" rx="6" />
          <text x={doorX + 22} y={doorY + 28} fill="#38BDF8" fontWeight="bold">
            AS/NZS 4505 REGION {engineering.windRegion} ({engineering.ulsPressureKpa} kPa ULS)
          </text>
          <text x={doorX + 22} y={doorY + 44} fill="#F8FAFC">
            {engineering.jStrutCount} J-Struts &middot; {engineering.windLockClipCount} Wind Clips &middot; {engineering.minTorqueNm} Nm
          </text>
        </g>
      )}

      {/* Parametric Dimension Callouts */}
      {showDimensions && (
        <g className="font-mono text-[11px] font-semibold tabular-nums select-none" fill="#0E7490">
          {/* Width Measure */}
          <line x1={doorX} y1={doorY - 94} x2={doorX + doorW} y2={doorY - 94} stroke="#0E7490" strokeWidth="1.5" />
          <line x1={doorX} y1={doorY - 102} x2={doorX} y2={doorY - 86} stroke="#0E7490" strokeWidth="1.5" />
          <line x1={doorX + doorW} y1={doorY - 102} x2={doorX + doorW} y2={doorY - 86} stroke="#0E7490" strokeWidth="1.5" />
          <rect x="356" y={doorY - 105} width="88" height="22" fill="#FFFFFF" stroke="#0E7490" rx="4" />
          <text x="400" y={doorY - 91} textAnchor="middle" alignmentBaseline="middle" fill="#0E7490">
            {config.widthMm} mm
          </text>

          {/* Height Measure */}
          <line x1={doorX - 32} y1={doorY} x2={doorX - 32} y2={groundY} stroke="#0E7490" strokeWidth="1.5" />
          <line x1={doorX - 40} y1={doorY} x2={doorX - 24} y2={doorY} stroke="#0E7490" strokeWidth="1.5" />
          <line x1={doorX - 40} y1={groundY} x2={doorX - 24} y2={groundY} stroke="#0E7490" strokeWidth="1.5" />
          <rect x={doorX - 72} y={Math.round(doorY + doorH / 2 - 11)} width="80" height="22" fill="#FFFFFF" stroke="#0E7490" rx="4" />
          <text x={doorX - 32} y={Math.round(doorY + doorH / 2 + 2)} textAnchor="middle" alignmentBaseline="middle" fill="#0E7490">
            {config.heightMm} mm
          </text>
        </g>
      )}
    </svg>
  );
};
