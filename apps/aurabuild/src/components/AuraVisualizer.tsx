import React, { useState } from "react";
import {
  GarageDoorConfig,
  GarageDoorEngineering,
  PoolConfig,
  PoolHydraulics,
} from "@aether/core-engine";
import { Moon, Sun, Ruler } from "@phosphor-icons/react";
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

  return (
    <div className="bg-white rounded-xl border border-aura-border shadow-sm flex flex-col overflow-hidden relative">
      <div className="flex items-center justify-between px-4 py-3 border-b border-aura-border bg-aura-subtle">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-aura-text tracking-wide uppercase">
            {productType === "GARAGE_DOOR" ? "Architectural Sectional Door" : "Cantilevered Concrete Pool"}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-aura-border text-aura-cyan font-bold tabular-nums">
            {productType === "GARAGE_DOOR"
              ? `${garageConfig.widthMm} x ${garageConfig.heightMm} mm`
              : `${poolConfig.lengthMm} x ${poolConfig.widthMm} mm`}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowDimensions(!showDimensions)}
            className={`p-1.5 rounded text-xs flex items-center space-x-1 border transition-colors ${
              showDimensions
                ? "bg-white text-aura-cyan border-aura-cyan shadow-sm"
                : "bg-white text-aura-text-muted border-aura-border"
            }`}
            title="Toggle Dimension Markers"
          >
            <Ruler size={14} weight="bold" />
            <span className="hidden sm:inline text-[11px] font-medium">Measures</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNightMode(!isNightMode)}
            className={`p-1.5 rounded text-xs flex items-center space-x-1 border transition-colors ${
              isNightMode
                ? "bg-[#1A1D20] text-amber-300 border-black shadow-sm"
                : "bg-white text-aura-text-muted border-aura-border"
            }`}
            title="Toggle Ambient Lighting Mode"
          >
            {isNightMode ? <Sun size={14} weight="fill" /> : <Moon size={14} weight="bold" />}
            <span className="hidden sm:inline text-[11px] font-medium">
              {isNightMode ? "Daylight" : "Perimeter Light"}
            </span>
          </button>
        </div>
      </div>

      <div
        className={`relative w-full aspect-[4/3] flex items-center justify-center p-6 transition-colors duration-500 overflow-hidden ${
          isNightMode ? "bg-[#111418]" : "bg-[#F3F4F6]"
        }`}
      >
        {productType === "GARAGE_DOOR" ? (
          <GarageDoorSvg
            config={garageConfig}
            engineering={garageEngineering}
            isNightMode={isNightMode}
            showDimensions={showDimensions}
          />
        ) : (
          <LuxuryPoolSvg
            config={poolConfig}
            hydraulics={poolHydraulics}
            isNightMode={isNightMode}
            showDimensions={showDimensions}
          />
        )}
      </div>

      <div className="px-4 py-3 bg-white border-t border-aura-border flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-aura-text-dim block text-[10px] uppercase font-semibold">
              {productType === "GARAGE_DOOR" ? "Total Panel Mass" : "Water Volume"}
            </span>
            <span className="font-bold text-aura-text tabular-nums text-sm">
              {productType === "GARAGE_DOOR"
                ? `${garageEngineering.totalMassKg} kg`
                : `${poolHydraulics.waterVolumeLiters.toLocaleString()} L`}
            </span>
          </div>

          <div className="border-l border-aura-border pl-4">
            <span className="text-aura-text-dim block text-[10px] uppercase font-semibold">
              {productType === "GARAGE_DOOR" ? "Wind Zone (AS/NZS 4505)" : "Turnover Flow Rate"}
            </span>
            <span className="font-bold text-aura-cyan tabular-nums text-sm">
              {productType === "GARAGE_DOOR"
                ? `Region ${garageEngineering.windRegion} (${garageEngineering.ulsPressureKpa} kPa)`
                : `${poolHydraulics.turnoverFlowRateLpm} L/min`}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-aura-text-dim block text-[10px] uppercase font-semibold">
            Surface Footprint
          </span>
          <span className="font-bold text-aura-text tabular-nums text-sm">
            {productType === "GARAGE_DOOR"
              ? `${garageEngineering.surfaceAreaM2} m²`
              : `${poolHydraulics.surfaceAreaM2} m²`}
          </span>
        </div>
      </div>
    </div>
  );
};
