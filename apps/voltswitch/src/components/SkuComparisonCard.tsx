import React from "react";
import { CommercialSkuItem } from "@aether/core-engine";
import { CheckCircle } from "@phosphor-icons/react";

interface Props {
  sku: CommercialSkuItem;
}

export const SkuComparisonCard: React.FC<Props> = ({ sku }) => {
  const wattageSaved = sku.competitorWatts - sku.aetherWatts;
  const wattageSavedPercent = Math.round((wattageSaved / sku.competitorWatts) * 100);

  return (
    <div className="bg-volt-tray rounded-[20px] p-1.5 border border-white/[0.08]">
      <div className="bg-volt-surface rounded-[14px] p-5 border border-white/[0.06] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
          <div>
            <span className="text-[11px] font-medium text-volt-amber block">
              Cross-Reference Telemetry
            </span>
            <h2 className="text-base font-bold text-volt-ink font-mono tracking-tight mt-0.5">
              {sku.competitorBrand} {sku.competitorSku} &rarr; {sku.aetherSku}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5 tabular-nums">
              <CheckCircle size={14} weight="fill" />
              <span>{wattageSavedPercent}% Energy Reduction</span>
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-volt-recessed text-volt-muted border border-white/[0.08]">
              {sku.asNzsStandard}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-volt-recessed rounded-[12px] border border-red-500/25 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-red-400">
                Legacy Competitor Fixture
              </span>
              <span className="text-xs font-mono text-volt-muted">{sku.competitorBrand}</span>
            </div>
            <div className="text-sm font-bold text-volt-ink">{sku.competitorModel}</div>
            <div className="grid grid-cols-2 gap-2.5 text-xs pt-1 text-volt-muted">
              <div>
                <span className="text-volt-dim block text-[10px]">Draw</span>
                <strong className="font-mono text-red-400 tabular-nums">{sku.competitorWatts}W</strong>
              </div>
              <div>
                <span className="text-volt-dim block text-[10px]">Output</span>
                <span className="font-mono text-volt-ink tabular-nums">{sku.lumens.toLocaleString()} lm</span>
              </div>
              <div>
                <span className="text-volt-dim block text-[10px]">Ingress</span>
                <span className="font-mono text-volt-ink">{sku.ipRating}</span>
              </div>
              <div>
                <span className="text-volt-dim block text-[10px]">Impact</span>
                <span className="font-mono text-volt-ink">{sku.ikRating}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-volt-recessed rounded-[12px] border border-volt-amber/45 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-volt-amber">
                Aether Direct Retrofit
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                IN STOCK
              </span>
            </div>
            <div className="text-sm font-bold text-volt-ink">{sku.aetherModel}</div>
            <div className="grid grid-cols-2 gap-2.5 text-xs pt-1 text-volt-muted">
              <div>
                <span className="text-volt-dim block text-[10px]">Draw</span>
                <strong className="font-mono text-emerald-400 tabular-nums">{sku.aetherWatts}W</strong>
              </div>
              <div>
                <span className="text-volt-dim block text-[10px]">Efficacy</span>
                <strong className="font-mono text-volt-amber tabular-nums">{sku.efficacyLmW} lm/W</strong>
              </div>
              <div>
                <span className="text-volt-dim block text-[10px]">CRI</span>
                <span className="font-mono text-volt-ink tabular-nums">&gt;{sku.cri}</span>
              </div>
              <div>
                <span className="text-volt-dim block text-[10px]">L70 Rated</span>
                <span className="font-mono text-volt-ink tabular-nums">{sku.lifespanHours.toLocaleString()}h</span>
              </div>
            </div>
            <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-volt-muted">Trade Unit Price</span>
              <span className="font-mono font-bold text-volt-amber text-sm tabular-nums">
                ${sku.unitTradePriceAud.toFixed(2)} AUD
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
