import React from "react";
import { GarageDoorConfig, MotorDriveType } from "@aether/core-engine";

interface Props {
  config: GarageDoorConfig;
  onChange: (updated: Partial<GarageDoorConfig>) => void;
}

export const GarageDimensions: React.FC<Props> = ({ config, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold text-aura-text">Opening Width</label>
          <span className="text-xs font-bold text-aura-cyan tabular-nums bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
            {config.widthMm} mm
          </span>
        </div>
        <input
          type="range"
          min={2400}
          max={6000}
          step={100}
          value={config.widthMm}
          onChange={(e) => onChange({ widthMm: parseInt(e.target.value, 10) })}
          className="w-full accent-aura-cyan cursor-pointer"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold text-aura-text">Opening Height</label>
          <span className="text-xs font-bold text-aura-cyan tabular-nums bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
            {config.heightMm} mm
          </span>
        </div>
        <input
          type="range"
          min={1950}
          max={3200}
          step={50}
          value={config.heightMm}
          onChange={(e) => onChange({ heightMm: parseInt(e.target.value, 10) })}
          className="w-full accent-aura-cyan cursor-pointer"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-aura-text block mb-1">Sectional Panels</label>
        <div className="grid grid-cols-3 gap-2">
          {[4, 5, 6].map((count) => (
            <button
              key={`p-${count}`}
              type="button"
              onClick={() => onChange({ panelCount: count })}
              className={`py-1.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                config.panelCount === count
                  ? "bg-aura-monument text-white border-aura-monument"
                  : "bg-white text-aura-text border-aura-border hover:bg-aura-subtle"
              }`}
            >
              {count} Panels
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-aura-text block mb-1">Motor Drive</label>
        <div className="space-y-1.5">
          {[
            { id: "BELT_SILENT_800N", label: "WhisperDrive 800N Silent Belt", desc: "Wi-Fi enabled silent residential belt" },
            { id: "CHAIN_HEAVY_1000N", label: "HeavyDuty 1000N Chain Drive", desc: "High-torque chain with battery backup" },
            { id: "COMMERCIAL_JACKSHAFT_1200N", label: "DirectDrive 1200N Jackshaft", desc: "Wall mount direct shaft for high clearance" },
          ].map((m) => (
            <label
              key={m.id}
              className={`flex items-start space-x-2 p-2 rounded-lg border cursor-pointer ${
                config.motorDrive === m.id
                  ? "bg-cyan-50/60 border-aura-cyan"
                  : "bg-white border-aura-border hover:bg-aura-subtle"
              }`}
            >
              <input
                type="radio"
                name="motorDrive"
                value={m.id}
                checked={config.motorDrive === m.id}
                onChange={() => onChange({ motorDrive: m.id as MotorDriveType })}
                className="mt-0.5 accent-aura-cyan"
              />
              <div>
                <span className="text-xs font-bold text-aura-text block">{m.label}</span>
                <span className="text-[11px] text-aura-text-dim block">{m.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
