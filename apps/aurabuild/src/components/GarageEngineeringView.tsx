import React from "react";
import { GarageDoorConfig, GarageDoorEngineering } from "@aether/core-engine";

interface Props {
  config: GarageDoorConfig;
  engineering: GarageDoorEngineering;
}

export const GarageEngineeringView: React.FC<Props> = ({ config, engineering }) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 bg-white rounded-lg border border-aura-border">
          <span className="text-[10px] uppercase font-bold text-aura-text-dim block">ULS Pressure</span>
          <span className="text-sm font-bold text-aura-text tabular-nums">
            {engineering.ulsPressureKpa} <span className="text-xs font-normal text-aura-text-muted">kPa</span>
          </span>
          <span className="text-[10px] text-aura-text-dim block">Ultimate limit state</span>
        </div>

        <div className="p-2.5 bg-white rounded-lg border border-aura-border">
          <span className="text-[10px] uppercase font-bold text-aura-text-dim block">SLS Pressure</span>
          <span className="text-sm font-bold text-aura-text tabular-nums">
            {engineering.slsPressureKpa} <span className="text-xs font-normal text-aura-text-muted">kPa</span>
          </span>
          <span className="text-[10px] text-aura-text-dim block">Serviceability limit</span>
        </div>
      </div>

      <div className="p-3 bg-white rounded-lg border border-aura-border space-y-1.5 text-xs">
        <div className="flex justify-between py-0.5 border-b border-aura-border/40">
          <span className="text-aura-text-muted">Total Panel Mass</span>
          <span className="font-bold tabular-nums text-aura-text">{engineering.totalMassKg} kg</span>
        </div>
        <div className="flex justify-between py-0.5 border-b border-aura-border/40">
          <span className="text-aura-text-muted">J-Strut Reinforcements</span>
          <span className="font-bold tabular-nums text-aura-cyan">
            {engineering.jStrutCount} struts ({engineering.jStrutCount / config.panelCount}/panel)
          </span>
        </div>
        <div className="flex justify-between py-0.5 border-b border-aura-border/40">
          <span className="text-aura-text-muted">Wind-Lock Clips</span>
          <span className="font-bold tabular-nums text-aura-cyan">{engineering.windLockClipCount} clips</span>
        </div>
        <div className="flex justify-between py-0.5 border-b border-aura-border/40">
          <span className="text-aura-text-muted">Hinge Specification</span>
          <span className="font-bold text-aura-text">{engineering.rollerHingeGrade.replace(/_/g, " ")}</span>
        </div>
        <div className="flex justify-between py-0.5 border-b border-aura-border/40">
          <span className="text-aura-text-muted">Torsion Springs</span>
          <span className="font-bold tabular-nums text-aura-text">
            {engineering.springRatingCycles.toLocaleString()} Cycles
          </span>
        </div>
        <div className="flex justify-between py-0.5">
          <span className="text-aura-text-muted">Min Motor Torque</span>
          <span className="font-bold tabular-nums text-aura-text">{engineering.minTorqueNm} Nm</span>
        </div>
      </div>
    </div>
  );
};
