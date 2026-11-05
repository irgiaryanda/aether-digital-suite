import React from "react";
import { CommercialSkuItem } from "@aether/core-engine";

interface Props {
  items: CommercialSkuItem[];
  quantities: Record<string, number>;
  onQtyChange: (skuId: string, val: number) => void;
}

export const CatalogTable: React.FC<Props> = ({ items, quantities, onQtyChange }) => {
  return (
    <div className="overflow-x-auto max-h-96">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-volt-border bg-volt-base text-[9px] text-gray-400 uppercase">
            <th className="p-1.5">SKU</th>
            <th className="p-1.5">Model</th>
            <th className="p-1.5">Watts</th>
            <th className="p-1.5">Lumens</th>
            <th className="p-1.5">Stock SYD/MEL/BNE</th>
            <th className="p-1.5">Trade Price</th>
            <th className="p-1.5 text-right">Qty</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-volt-border/30 text-[10px]">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-volt-elevated/30">
              <td className="p-1.5 font-bold text-volt-amber">{item.aetherSku}</td>
              <td className="p-1.5 text-gray-300 max-w-xs truncate">{item.aetherModel}</td>
              <td className="p-1.5 font-bold text-emerald-400 tabular-nums">{item.aetherWatts}W</td>
              <td className="p-1.5 tabular-nums">{item.lumens.toLocaleString()} lm</td>
              <td className="p-1.5 text-gray-400 tabular-nums">
                {item.stockSydney}/{item.stockMelbourne}/{item.stockBrisbane}
              </td>
              <td className="p-1.5 font-bold text-white tabular-nums">${item.unitTradePriceAud.toFixed(2)}</td>
              <td className="p-1.5 text-right">
                <input
                  type="number"
                  min={0}
                  value={quantities[item.id] || ""}
                  placeholder="0"
                  onChange={(e) => onQtyChange(item.id, parseInt(e.target.value, 10) || 0)}
                  className="w-12 px-1 py-0.5 bg-volt-base border border-volt-border rounded text-center text-white font-bold"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
