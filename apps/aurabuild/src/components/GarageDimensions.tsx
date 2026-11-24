import React from "react";
import { GarageDoorConfig, MotorDriveType } from "@aether/core-engine";

interface Props {
  config: GarageDoorConfig;
  onChange: (updated: Partial<GarageDoorConfig>) => void;
}

export const GarageDimensions: React.FC<Props> = ({ config, onChange }) => {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="aura-door-width" className="text-xs font-semibold text-aura-text">
            Opening Width
          </label>
          <span className="text-xs font-mono font-bold text-aura-cyan tabular-nums bg-aura-cyan/[0.08] px-2.5 py-0.5 rounded-full border border-aura-cyan/20">
            {config.widthMm} mm
          </span>
        </div>
        <input
          id="aura-door-width"
          type="range"
          min={2400}
          max={6000}
          step={100}
          value={config.widthMm}
          onChange={(e) => onChange({ widthMm: parseInt(e.target.value, 10) })}
          className="w-full aura-range cursor-pointer"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="aura-door-height" className="text-xs font-semibold text-aura-text">
            Opening Height
          </label>
          <span className="text-xs font-mono font-bold text-aura-cyan tabular-nums bg-aura-cyan/[0.08] px-2.5 py-0.5 rounded-full border border-aura-cyan/20">
            {config.heightMm} mm
          </span>
        </div>
        <input
          id="aura-door-height"
          type="range"
          min={1950}
          max={3200}
          step={50}
          value={config.heightMm}
          onChange={(e) => onChange({ heightMm: parseInt(e.target.value, 10) })}
          className="w-full aura-range cursor-pointer"
        />
      </div>

      <div>
        <span className="text-xs font-semibold text-aura-text block mb-2">Sectional Panels</span>
        <div className="grid grid-cols-3 gap-2">
          {[4, 5, 6].map((count) => (
            <button
              key={`p-${count}`}
              type="button"
              onClick={() => onChange({ panelCount: count })}
              className={`min-h-[38px] py-1.5 px-3 rounded-[10px] border text-xs font-semibold transition-all duration-300 ease-spring active:scale-[0.98] ${
                config.panelCount === count
                  ? "bg-aura-text text-white border-aura-text shadow-sm"
                  : "bg-white text-aura-text border-aura-border hover:bg-aura-subtle"
              }`}
            >
              {count} Panels
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="text-xs font-semibold text-aura-text block mb-2">Motor Drive</span>
        <div className="space-y-2">
          {[
            { id: "BELT_SILENT_800N", label: "WhisperDrive 800N Silent Belt", desc: "Wi-Fi enabled silent residential belt" },
            { id: "CHAIN_HEAVY_1000N", label: "HeavyDuty 1000N Chain Drive", desc: "High-torque chain with battery backup" },
            { id: "COMMERCIAL_JACKSHAFT_1200N", label: "DirectDrive 1200N Jackshaft", desc: "Wall mount direct shaft for high clearance" },
          ].map((m) => (
            <label
              key={m.id}
              className={`flex items-start space-x-2.5 p-3 rounded-[12px] border cursor-pointer transition-all duration-300 ease-spring ${
                config.motorDrive === m.id
                  ? "bg-aura-cyan/[0.06] border-aura-cyan"
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
                <span className="text-[11px] text-aura-text-dim block mt-0.5">{m.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
