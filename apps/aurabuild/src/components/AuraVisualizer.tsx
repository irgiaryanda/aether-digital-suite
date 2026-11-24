import React, { useState } from "react";
import {
  GarageDoorConfig,
  GarageDoorEngineering,
  PoolConfig,
  PoolHydraulics,
} from "@aether/core-engine";
import { Moon, Sun, Ruler, Blueprint, ArrowsVertical } from "@phosphor-icons/react";
import { GarageDoorSvg } from "./GarageDoorSvg";
import { LuxuryPoolSvg } from "./LuxuryPoolSvg";

interface AuraVisualizerProps {
  productType: "GARAGE_DOOR" | "LUXURY_POOL";
  garageConfig: GarageDoorConfig;
  garageEngineering: GarageDoorEngineering;
  poolConfig: PoolConfig;
  poolHydraulics: PoolHydraulics;
}

export const AuraVisualizer: React.FC<AuraVisualizerProps> = ({
  productType,
  garageConfig,
  garageEngineering,
  poolConfig,
  poolHydraulics,
}) => {
  const [isNightMode, setIsNightMode] = useState(false);
  const [showDimensions, setShowDimensions] = useState(true);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [showEngineeringOverlay, setShowEngineeringOverlay] = useState(false);

  return (
    <div className="bg-aura-tray p-1.5 rounded-[24px] border border-[#DCE2EA] shadow-[0_14px_40px_-14px_rgba(17,20,24,0.09)]">
      <div className="bg-white rounded-[18px] border border-aura-border shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-aura-border">
          <div className="flex items-center space-x-2.5">
            <h2 className="font-display text-sm font-semibold text-aura-text">
              {productType === "GARAGE_DOOR" ? "Sectional Garage Elevation" : "Cantilevered Basin Perspective"}
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-aura-subtle border border-aura-border text-aura-cyan font-mono font-semibold tabular-nums">
              {productType === "GARAGE_DOOR"
                ? `${garageConfig.widthMm} x ${garageConfig.heightMm} mm`
                : `${poolConfig.lengthMm} x ${poolConfig.widthMm} mm`}
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-1.5">
            {productType === "GARAGE_DOOR" && (
              <button
                type="button"
                onClick={() => setIsDoorOpen(!isDoorOpen)}
                aria-label="Toggle Garage Door Open or Closed"
                className={`px-3 py-1.5 rounded-full text-xs flex items-center space-x-1.5 border transition-all duration-300 ease-spring active:scale-[0.98] whitespace-nowrap ${
                  isDoorOpen
                    ? "bg-aura-text text-white border-aura-text shadow-sm"
                    : "bg-white text-aura-text-muted border-aura-border hover:text-aura-text hover:bg-aura-subtle"
                }`}
              >
                <ArrowsVertical size={13} weight="bold" />
                <span className="font-medium">{isDoorOpen ? "Close Door" : "Open Door"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowEngineeringOverlay(!showEngineeringOverlay)}
              aria-label="Toggle Structural Engineering X-Ray Overlay"
              className={`px-3 py-1.5 rounded-full text-xs flex items-center space-x-1.5 border transition-all duration-300 ease-spring active:scale-[0.98] whitespace-nowrap ${
                showEngineeringOverlay
                  ? "bg-aura-text text-cyan-300 border-aura-text shadow-sm"
                  : "bg-white text-aura-text-muted border-aura-border hover:text-aura-text hover:bg-aura-subtle"
              }`}
            >
              <Blueprint size={13} weight="bold" />
              <span className="font-medium">X-Ray</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDimensions(!showDimensions)}
              aria-label="Toggle Dimension Markers"
              className={`px-3 py-1.5 rounded-full text-xs flex items-center space-x-1.5 border transition-all duration-300 ease-spring active:scale-[0.98] whitespace-nowrap ${
                showDimensions
                  ? "bg-aura-cyan/[0.08] text-aura-cyan border-aura-cyan/40"
                  : "bg-white text-aura-text-muted border-aura-border hover:text-aura-text"
              }`}
            >
              <Ruler size={13} weight="bold" />
              <span className="hidden sm:inline font-medium">Measures</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNightMode(!isNightMode)}
              aria-label="Toggle Ambient Lighting Mode"
              className={`px-3 py-1.5 rounded-full text-xs flex items-center space-x-1.5 border transition-all duration-300 ease-spring active:scale-[0.98] whitespace-nowrap ${
                isNightMode
                  ? "bg-aura-text text-amber-300 border-aura-text shadow-sm"
                  : "bg-white text-aura-text-muted border-aura-border hover:text-aura-text hover:bg-aura-subtle"
              }`}
            >
              {isNightMode ? <Sun size={13} weight="fill" /> : <Moon size={13} weight="bold" />}
              <span className="hidden sm:inline font-medium">
                {isNightMode ? "Daylight" : "Dusk"}
              </span>
            </button>
          </div>
        </div>

        <div
          className={`relative w-full aspect-[4/3] flex items-center justify-center p-4 sm:p-6 transition-colors duration-500 overflow-hidden ${
            isNightMode ? "bg-[#0F1319]" : "bg-[#EEF1F5]"
          }`}
        >
          {productType === "GARAGE_DOOR" ? (
            <GarageDoorSvg
              config={garageConfig}
              engineering={garageEngineering}
              isNightMode={isNightMode}
              showDimensions={showDimensions}
              isDoorOpen={isDoorOpen}
              showEngineeringOverlay={showEngineeringOverlay}
            />
          ) : (
            <LuxuryPoolSvg
              config={poolConfig}
              hydraulics={poolHydraulics}
              isNightMode={isNightMode}
              showDimensions={showDimensions}
              showEngineeringOverlay={showEngineeringOverlay}
            />
          )}
        </div>

        <div className="px-5 py-3.5 bg-white border-t border-aura-border flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-aura-text-dim block text-[11px] font-medium">
                {productType === "GARAGE_DOOR" ? "Total Panel Mass" : "Water Volume"}
              </span>
              <span className="font-mono font-bold text-aura-text tabular-nums text-sm">
                {productType === "GARAGE_DOOR"
                  ? `${garageEngineering.totalMassKg} kg`
                  : `${poolHydraulics.waterVolumeLiters.toLocaleString()} L`}
              </span>
            </div>

            <div className="border-l border-aura-border pl-6">
              <span className="text-aura-text-dim block text-[11px] font-medium">
                {productType === "GARAGE_DOOR" ? "AS/NZS 4505 Wind Load" : "6h Turnover Flow"}
              </span>
              <span className="font-mono font-bold text-aura-cyan tabular-nums text-sm">
                {productType === "GARAGE_DOOR"
                  ? `Region ${garageEngineering.windRegion} (${garageEngineering.ulsPressureKpa} kPa)`
                  : `${poolHydraulics.turnoverFlowRateLpm} L/min`}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-aura-text-dim block text-[11px] font-medium">
              Surface Footprint
            </span>
            <span className="font-mono font-bold text-aura-text tabular-nums text-sm">
              {productType === "GARAGE_DOOR"
                ? `${garageEngineering.surfaceAreaM2} m2`
                : `${poolHydraulics.surfaceAreaM2} m2`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
