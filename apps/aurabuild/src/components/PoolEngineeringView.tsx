import React from "react";
import { PoolConfig, PoolHydraulics } from "@aether/core-engine";

interface Props {
  config: PoolConfig;
  hydraulics: PoolHydraulics;
}

export const PoolEngineeringView: React.FC<Props> = ({ config, hydraulics }) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 bg-white rounded-lg border border-aura-border">
          <span className="text-[10px] uppercase font-bold text-aura-text-dim block">Water Volume</span>
          <span className="text-sm font-bold text-aura-text tabular-nums">
            {hydraulics.waterVolumeLiters.toLocaleString()}{" "}
            <span className="text-xs font-normal text-aura-text-muted">L</span>
          </span>
          <span className="text-[10px] text-aura-text-dim block">{hydraulics.surfaceAreaM2} m² footprint</span>
        </div>

        <div className="p-2.5 bg-white rounded-lg border border-aura-border">
          <span className="text-[10px] uppercase font-bold text-aura-text-dim block">6h Turnover Rate</span>
          <span className="text-sm font-bold text-aura-cyan tabular-nums">
            {hydraulics.turnoverFlowRateLpm}{" "}
            <span className="text-xs font-normal text-aura-text-muted">L/min</span>
          </span>
          <span className="text-[10px] text-aura-text-dim block">Australian AS 1926</span>
        </div>
      </div>

      <div className="p-3 bg-white rounded-lg border border-aura-border space-y-1.5 text-xs">
        <div className="flex justify-between py-0.5 border-b border-aura-border/40">
          <span className="text-aura-text-muted">Variable Speed Pump</span>
          <span className="font-bold tabular-nums text-aura-text">{hydraulics.recommendedPumpPowerKw} kW VFD</span>
        </div>
        <div className="flex justify-between py-0.5 border-b border-aura-border/40">
          <span className="text-aura-text-muted">Glass Media Filter</span>
          <span className="font-bold tabular-nums text-aura-text">{hydraulics.filterMediaMassKg} kg media</span>
        </div>
        <div className="flex justify-between py-0.5 border-b border-aura-border/40">
          <span className="text-aura-text-muted">Chlorinator Output</span>
          <span className="font-bold tabular-nums text-aura-cyan">{hydraulics.chlorinatorOutputGph} g/hr</span>
        </div>
        <div className="flex justify-between py-0.5">
          <span className="text-aura-text-muted">Coping Perimeter</span>
          <span className="font-bold tabular-nums text-aura-text">{hydraulics.copingLinearMeters} meters</span>
        </div>
      </div>
    </div>
  );
};
