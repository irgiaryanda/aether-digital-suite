import React from "react";
import { CommercialSkuItem } from "@aether/core-engine";

interface Props {
  items: CommercialSkuItem[];
  quantities: Record<string, number>;
  onQtyChange: (skuId: string, val: number) => void;
}

export const CatalogTable: React.FC<Props> = ({ items, quantities, onQtyChange }) => {
  return (
    <div className="overflow-x-auto max-h-[440px] rounded-[12px] border border-white/[0.06] bg-volt-recessed">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 z-10 bg-volt-tray border-b border-white/[0.08]">
          <tr className="text-[11px] font-semibold text-volt-muted">
            <th className="py-2.5 px-3">SKU</th>
            <th className="py-2.5 px-3">Model</th>
            <th className="py-2.5 px-3">Watts</th>
            <th className="py-2.5 px-3">Lumens</th>
            <th className="py-2.5 px-3">Stock SYD/MEL/BNE</th>
            <th className="py-2.5 px-3">Trade Price</th>
            <th className="py-2.5 px-3 text-right">Tender Qty</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05] text-xs">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-volt-elevated/40 transition-colors duration-150">
              <td className="py-2.5 px-3 font-mono font-bold text-volt-amber whitespace-nowrap">{item.aetherSku}</td>
              <td className="py-2.5 px-3 text-volt-ink max-w-xs truncate">{item.aetherModel}</td>
              <td className="py-2.5 px-3 font-mono font-bold text-emerald-400 tabular-nums whitespace-nowrap">
                {item.aetherWatts}W
              </td>
              <td className="py-2.5 px-3 font-mono text-volt-muted tabular-nums whitespace-nowrap">
                {item.lumens.toLocaleString()} lm
              </td>
              <td className="py-2.5 px-3 font-mono text-volt-muted tabular-nums whitespace-nowrap">
                {item.stockSydney}/{item.stockMelbourne}/{item.stockBrisbane}
              </td>
              <td className="py-2.5 px-3 font-mono font-bold text-volt-ink tabular-nums whitespace-nowrap">
                ${item.unitTradePriceAud.toFixed(2)}
              </td>
              <td className="py-2.5 px-3 text-right">
                <input
                  type="number"
                  min={0}
                  aria-label={`Quantity for ${item.aetherSku}`}
                  value={quantities[item.id] || ""}
                  placeholder="0"
                  onChange={(e) => onQtyChange(item.id, parseInt(e.target.value, 10) || 0)}
                  className="w-16 px-2 py-1 bg-volt-base border border-white/[0.1] rounded-[8px] text-center font-mono tabular-nums text-volt-ink font-bold focus:border-volt-amber focus:outline-none"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
