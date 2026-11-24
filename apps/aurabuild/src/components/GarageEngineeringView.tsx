import React from "react";
import { GarageDoorConfig, GarageDoorEngineering } from "@aether/core-engine";

interface Props {
  config: GarageDoorConfig;
  engineering: GarageDoorEngineering;
}

export const GarageEngineeringView: React.FC<Props> = ({ config, engineering }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-aura-subtle rounded-[12px] border border-aura-border">
          <span className="text-[11px] font-medium text-aura-text-dim block">ULS Pressure</span>
          <span className="text-base font-mono font-bold text-aura-text tabular-nums">
            {engineering.ulsPressureKpa} <span className="text-xs font-normal text-aura-text-muted">kPa</span>
          </span>
          <span className="text-[11px] text-aura-text-dim block">Ultimate limit state</span>
        </div>

        <div className="p-3 bg-aura-subtle rounded-[12px] border border-aura-border">
          <span className="text-[11px] font-medium text-aura-text-dim block">SLS Pressure</span>
          <span className="text-base font-mono font-bold text-aura-text tabular-nums">
            {engineering.slsPressureKpa} <span className="text-xs font-normal text-aura-text-muted">kPa</span>
          </span>
          <span className="text-[11px] text-aura-text-dim block">Serviceability limit</span>
        </div>
      </div>

      <div className="p-3.5 bg-white rounded-[12px] border border-aura-border space-y-2 text-xs">
        <div className="flex justify-between py-1">
          <span className="text-aura-text-muted">Total Panel Mass</span>
          <span className="font-mono font-bold tabular-nums text-aura-text">{engineering.totalMassKg} kg</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-aura-text-muted">J-Strut Reinforcements</span>
          <span className="font-mono font-bold tabular-nums text-aura-cyan">
            {engineering.jStrutCount} struts ({engineering.jStrutCount / config.panelCount}/panel)
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-aura-text-muted">Wind-Lock Clips</span>
          <span className="font-mono font-bold tabular-nums text-aura-cyan">{engineering.windLockClipCount} clips</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-aura-text-muted">Hinge Specification</span>
          <span className="font-semibold text-aura-text">{engineering.rollerHingeGrade.replace(/_/g, " ")}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-aura-text-muted">Torsion Springs</span>
          <span className="font-mono font-bold tabular-nums text-aura-text">
            {engineering.springRatingCycles.toLocaleString()} Cycles
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-aura-text-muted">Min Motor Torque</span>
          <span className="font-mono font-bold tabular-nums text-aura-text">{engineering.minTorqueNm} Nm</span>
        </div>
      </div>
    </div>
  );
};
