import React from "react";
import { PoolConfig } from "@aether/core-engine";

interface Props {
  config: PoolConfig;
  onChange: (updated: Partial<PoolConfig>) => void;
}

export const PoolDimensions: React.FC<Props> = ({ config, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold text-aura-text">Length</label>
          <span className="text-xs font-bold text-aura-cyan tabular-nums bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
            {config.lengthMm} mm
          </span>
        </div>
        <input
          type="range"
          min={5000}
          max={12000}
          step={500}
          value={config.lengthMm}
          onChange={(e) => onChange({ lengthMm: parseInt(e.target.value, 10) })}
          className="w-full accent-aura-cyan cursor-pointer"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold text-aura-text">Width</label>
          <span className="text-xs font-bold text-aura-cyan tabular-nums bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
            {config.widthMm} mm
          </span>
        </div>
        <input
          type="range"
          min={2500}
          max={5000}
          step={250}
          value={config.widthMm}
          onChange={(e) => onChange({ widthMm: parseInt(e.target.value, 10) })}
          className="w-full accent-aura-cyan cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-aura-text block mb-1">Shallow Depth</label>
          <select
            value={config.shallowDepthMm}
            onChange={(e) => onChange({ shallowDepthMm: parseInt(e.target.value, 10) })}
            className="w-full bg-white border border-aura-border rounded-lg p-2 text-xs font-medium focus:border-aura-cyan"
          >
            <option value={1000}>1000 mm (Wading)</option>
            <option value={1200}>1200 mm (Standard)</option>
            <option value={1400}>1400 mm (Sport)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-aura-text block mb-1">Deep Depth</label>
          <select
            value={config.deepDepthMm}
            onChange={(e) => onChange({ deepDepthMm: parseInt(e.target.value, 10) })}
            className="w-full bg-white border border-aura-border rounded-lg p-2 text-xs font-medium focus:border-aura-cyan"
          >
            <option value={1600}>1600 mm (Standard)</option>
            <option value={1800}>1800 mm (Luxury)</option>
            <option value={2000}>2000 mm (Deep)</option>
          </select>
        </div>
      </div>

      <div className="p-3 bg-aura-subtle rounded-lg border border-aura-border">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <span className="text-xs font-bold text-aura-text block">Cantilevered Horizon Edge</span>
            <span className="text-[11px] text-aura-text-dim block">
              Reinforced beam creating negative edge drop
            </span>
          </div>
          <input
            type="checkbox"
            checked={config.cantileverEdge}
            onChange={(e) => onChange({ cantileverEdge: e.target.checked })}
            className="w-4 h-4 accent-aura-cyan rounded cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};
