import React from "react";
import { CommercialSkuItem } from "@aether/core-engine";
import { ArrowRight, CheckCircle, ShieldCheck } from "@phosphor-icons/react";

interface Props {
  sku: CommercialSkuItem;
}

export const SkuComparisonCard: React.FC<Props> = ({ sku }) => {
  const wattageSaved = sku.competitorWatts - sku.aetherWatts;
  const wattageSavedPercent = Math.round((wattageSaved / sku.competitorWatts) * 100);

  return (
    <div className="bg-volt-surface rounded-xl border border-volt-border p-4 sm:p-5 shadow-lg space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-volt-border pb-3">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-volt-amber">
            Telemetry Cross-Reference Match
          </span>
          <h3 className="text-sm font-bold text-white font-mono">
            {sku.competitorBrand} {sku.competitorSku} &rarr; {sku.aetherSku}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
            <CheckCircle size={14} weight="fill" />
            <span>{wattageSavedPercent}% Energy Reduction</span>
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-volt-elevated text-gray-300 border border-volt-border">
            {sku.asNzsStandard}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Competitor Spec */}
        <div className="p-3.5 bg-volt-base rounded-lg border border-red-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-red-400">
              Legacy Competitor Product
            </span>
            <span className="text-xs font-mono text-gray-400">{sku.competitorBrand}</span>
          </div>
          <div className="text-sm font-bold text-white">{sku.competitorModel}</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 text-gray-300">
            <div>Watts: <strong className="text-red-400 tabular-nums">{sku.competitorWatts}W</strong></div>
            <div>Lumens: <span className="tabular-nums">{sku.lumens.toLocaleString()} lm</span></div>
            <div>IP Rating: <span>{sku.ipRating}</span></div>
            <div>IK Rating: <span>{sku.ikRating}</span></div>
          </div>
        </div>

        {/* Aether Spec */}
        <div className="p-3.5 bg-volt-base rounded-lg border border-volt-amber/40 shadow-inner space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-volt-amber">
              Aether High-Efficiency Direct Swap
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">IN STOCK</span>
          </div>
          <div className="text-sm font-bold text-white">{sku.aetherModel}</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div>Watts: <strong className="text-emerald-400 tabular-nums">{sku.aetherWatts}W</strong></div>
            <div>Efficacy: <strong className="text-volt-amber tabular-nums">{sku.efficacyLmW} lm/W</strong></div>
            <div>CRI: <span className="text-white tabular-nums">&gt;{sku.cri}</span></div>
            <div>L70 Life: <span className="text-white tabular-nums">{sku.lifespanHours.toLocaleString()}h</span></div>
          </div>
          <div className="pt-2 border-t border-volt-border/60 flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400">Trade Price:</span>
            <span className="font-bold text-volt-amber text-sm tabular-nums">
              ${sku.unitTradePriceAud.toFixed(2)} AUD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
