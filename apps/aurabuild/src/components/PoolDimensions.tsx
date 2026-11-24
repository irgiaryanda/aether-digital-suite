import React from "react";
import { PoolConfig } from "@aether/core-engine";

interface Props {
  config: PoolConfig;
  onChange: (updated: Partial<PoolConfig>) => void;
}

export const PoolDimensions: React.FC<Props> = ({ config, onChange }) => {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="aura-pool-length" className="text-xs font-semibold text-aura-text">
            Basin Length
          </label>
          <span className="text-xs font-mono font-bold text-aura-cyan tabular-nums bg-aura-cyan/[0.08] px-2.5 py-0.5 rounded-full border border-aura-cyan/20">
            {config.lengthMm} mm
          </span>
        </div>
        <input
          id="aura-pool-length"
          type="range"
          min={5000}
          max={12000}
          step={500}
          value={config.lengthMm}
          onChange={(e) => onChange({ lengthMm: parseInt(e.target.value, 10) })}
          className="w-full aura-range cursor-pointer"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="aura-pool-width" className="text-xs font-semibold text-aura-text">
            Basin Width
          </label>
          <span className="text-xs font-mono font-bold text-aura-cyan tabular-nums bg-aura-cyan/[0.08] px-2.5 py-0.5 rounded-full border border-aura-cyan/20">
            {config.widthMm} mm
          </span>
        </div>
        <input
          id="aura-pool-width"
          type="range"
          min={2500}
          max={5000}
          step={250}
          value={config.widthMm}
          onChange={(e) => onChange({ widthMm: parseInt(e.target.value, 10) })}
          className="w-full aura-range cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="aura-pool-shallow" className="text-xs font-semibold text-aura-text block mb-1.5">
            Shallow Depth
          </label>
          <select
            id="aura-pool-shallow"
            value={config.shallowDepthMm}
            onChange={(e) => onChange({ shallowDepthMm: parseInt(e.target.value, 10) })}
            className="w-full bg-white border border-aura-border rounded-[10px] p-2.5 text-xs font-medium focus:border-aura-cyan"
          >
            <option value={1000}>1000 mm Wading</option>
            <option value={1200}>1200 mm Standard</option>
            <option value={1400}>1400 mm Sport</option>
          </select>
        </div>

        <div>
          <label htmlFor="aura-pool-deep" className="text-xs font-semibold text-aura-text block mb-1.5">
            Deep Depth
          </label>
          <select
            id="aura-pool-deep"
            value={config.deepDepthMm}
            onChange={(e) => onChange({ deepDepthMm: parseInt(e.target.value, 10) })}
            className="w-full bg-white border border-aura-border rounded-[10px] p-2.5 text-xs font-medium focus:border-aura-cyan"
          >
            <option value={1600}>1600 mm Standard</option>
            <option value={1800}>1800 mm Luxury</option>
            <option value={2000}>2000 mm Deep</option>
          </select>
        </div>
      </div>

      <div className="p-3.5 bg-aura-subtle rounded-[12px] border border-aura-border">
        <label className="flex items-center justify-between cursor-pointer gap-3">
          <div>
            <span className="text-xs font-bold text-aura-text block">Cantilevered Horizon Edge</span>
            <span className="text-[11px] text-aura-text-dim block mt-0.5">
              Post-tensioned concrete beam creating suspended infinity drop
            </span>
          </div>
          <input
            type="checkbox"
            checked={config.cantileverEdge}
            onChange={(e) => onChange({ cantileverEdge: e.target.checked })}
            className="w-4 h-4 accent-aura-cyan rounded cursor-pointer flex-shrink-0"
          />
        </label>
      </div>
    </div>
  );
};
