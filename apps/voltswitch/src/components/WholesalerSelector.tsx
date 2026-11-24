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
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {VERIFIED_AUSTRALIAN_WHOLESALERS.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => onSelect(w.id)}
            className={`px-2 py-2 rounded-[10px] border text-left truncate text-[11px] font-semibold transition-all duration-200 ease-spring active:scale-[0.98] ${
              selectedWholesaler === w.id
                ? "bg-volt-elevated border-volt-amber/70 text-volt-amber"
                : "bg-volt-recessed border-white/[0.08] text-volt-muted hover:text-volt-ink"
            }`}
          >
            {w.name.split(" ")[0]}
          </button>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="volt-wholesaler-abn" className="text-volt-muted font-medium">
            Wholesaler ABN
          </label>
          <span
            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isValidAbn
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}
          >
            {isValidAbn ? "VALID MOD-89" : "INVALID"}
          </span>
        </div>
        <input
          id="volt-wholesaler-abn"
          type="text"
          value={abn}
          onChange={(e) => onAbnChange(e.target.value)}
          className="w-full px-3 py-2 bg-volt-recessed border border-white/[0.08] rounded-[10px] font-mono tabular-nums text-volt-ink focus:border-volt-amber focus:outline-none transition-colors duration-200"
        />
      </div>
    </div>
  );
};
