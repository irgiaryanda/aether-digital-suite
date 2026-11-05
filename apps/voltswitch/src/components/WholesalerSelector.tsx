import React from "react";
import { AustralianWholesaler, VERIFIED_AUSTRALIAN_WHOLESALERS } from "@aether/core-engine";

interface Props {
  selectedWholesaler: AustralianWholesaler;
  onSelect: (w: AustralianWholesaler) => void;
  abn: string;
  onAbnChange: (val: string) => void;
  isValidAbn: boolean;
}

export const WholesalerSelector: React.FC<Props> = ({
  selectedWholesaler,
  onSelect,
  abn,
  onAbnChange,
  isValidAbn,
}) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {VERIFIED_AUSTRALIAN_WHOLESALERS.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => onSelect(w.id)}
            className={`p-1.5 rounded border text-left truncate ${
              selectedWholesaler === w.id
                ? "bg-volt-elevated border-volt-amber text-volt-amber font-bold"
                : "bg-volt-base border-volt-border text-gray-400"
            }`}
          >
            {w.name.split(" ")[0]}
          </button>
        ))}
      </div>

      <div>
        <div className="flex justify-between mb-0.5">
          <span className="text-gray-400">Wholesaler ABN</span>
          <span className={isValidAbn ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
            {isValidAbn ? "VALID MOD-89" : "INVALID"}
          </span>
        </div>
        <input
          type="text"
          value={abn}
          onChange={(e) => onAbnChange(e.target.value)}
          className="w-full px-2 py-1 bg-volt-base border border-volt-border rounded text-white"
        />
      </div>
    </div>
  );
};
