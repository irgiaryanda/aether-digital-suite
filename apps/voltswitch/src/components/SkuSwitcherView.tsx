import React, { useMemo, useState } from "react";
import { COMMERCIAL_SKU_CATALOG, CommercialSkuItem, CompetitorBrand } from "@aether/core-engine";
import { MagnifyingGlass, Funnel } from "@phosphor-icons/react";
import { SkuComparisonCard } from "./SkuComparisonCard";
import { RoiCalculatorPanel } from "./RoiCalculatorPanel";

export const SkuSwitcherView: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<"ALL" | CompetitorBrand>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkuId, setSelectedSkuId] = useState<string>("SKU-HB-001");

  const filteredSkus = useMemo(() => {
    return COMMERCIAL_SKU_CATALOG.filter((item) => {
      const matchBrand = selectedBrand === "ALL" || item.competitorBrand === selectedBrand;
      const matchQuery =
        searchQuery === "" ||
        item.competitorSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.competitorModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.aetherSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchBrand && matchQuery;
    });
  }, [selectedBrand, searchQuery]);

  const activeSku = useMemo(() => {
    return COMMERCIAL_SKU_CATALOG.find((s) => s.id === selectedSkuId) ?? COMMERCIAL_SKU_CATALOG[0]!;
  }, [selectedSkuId]);

  const brands: ("ALL" | CompetitorBrand)[] = ["ALL", "CLIPSAL", "PHILIPS", "OSRAM", "PIERLITE", "THORN"];

  return (
    <div className="space-y-6">
      {/* Brand Tabs & Search */}
      <div className="bg-volt-surface rounded-xl border border-volt-border p-4 shadow-lg flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {brands.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBrand(b)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedBrand === b
                  ? "bg-volt-amber text-black shadow-md shadow-amber-500/20"
                  : "bg-volt-base text-gray-400 hover:text-white border border-volt-border"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <MagnifyingGlass size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search competitor SKU or model..."
            className="w-full pl-9 pr-3 py-1.5 bg-volt-base border border-volt-border rounded-lg text-xs font-mono text-white placeholder-gray-500 focus:border-volt-amber focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Filtered Sku Selector List */}
        <div className="lg:col-span-4 bg-volt-surface rounded-xl border border-volt-border p-3 shadow-lg max-h-[600px] overflow-y-auto space-y-2">
          <div className="text-[10px] font-mono uppercase text-gray-400 font-bold px-1">
            Matching Competitor Models ({filteredSkus.length})
          </div>
          {filteredSkus.map((item) => {
            const isSelected = item.id === activeSku.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedSkuId(item.id)}
                className={`w-full p-2.5 rounded-lg border text-left font-mono transition-all ${
                  isSelected
                    ? "bg-volt-elevated border-volt-amber text-white shadow"
                    : "bg-volt-base border-volt-border/60 text-gray-400 hover:text-white hover:border-volt-border"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-volt-amber">{item.competitorBrand}</span>
                  <span className="text-gray-500 text-[10px]">{item.category}</span>
                </div>
                <div className="text-xs font-bold text-white truncate">{item.competitorSku} ({item.competitorWatts}W)</div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center justify-between">
                  <span>&rarr; {item.aetherSku}</span>
                  <span className="font-bold tabular-nums">{item.aetherWatts}W</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Side-by-Side Comparison & Commercial ROI */}
        <div className="lg:col-span-8 space-y-6">
          <SkuComparisonCard sku={activeSku} />
          <RoiCalculatorPanel sku={activeSku} />
        </div>
      </div>
    </div>
  );
};
