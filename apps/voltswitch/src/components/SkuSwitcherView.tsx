import React, { useMemo, useState } from "react";
import { COMMERCIAL_SKU_CATALOG, CompetitorBrand } from "@aether/core-engine";
import { ArrowsClockwise, MagnifyingGlass } from "@phosphor-icons/react";
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
      <div className="bg-volt-tray rounded-[20px] p-1.5 border border-white/[0.08]">
        <div className="bg-volt-surface rounded-[14px] p-3.5 border border-white/[0.06] flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {brands.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setSelectedBrand(b)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-200 ease-spring active:scale-[0.98] ${
                  selectedBrand === b
                    ? "bg-volt-amber text-volt-base shadow-sm"
                    : "bg-volt-recessed text-volt-muted hover:text-volt-ink border border-white/[0.08]"
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <label htmlFor="volt-sku-search" className="sr-only">
              Search competitor SKU or model
            </label>
            <MagnifyingGlass size={16} className="absolute left-3.5 top-2.5 text-volt-dim" />
            <input
              id="volt-sku-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search competitor SKU or model..."
              className="w-full pl-9 pr-3.5 py-2 bg-volt-recessed border border-white/[0.08] rounded-full text-xs font-mono text-volt-ink placeholder-volt-dim focus:border-volt-amber focus:outline-none transition-colors duration-200"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 bg-volt-tray rounded-[20px] p-1.5 border border-white/[0.08]">
          <div className="bg-volt-surface rounded-[14px] p-3.5 border border-white/[0.06] max-h-[620px] overflow-y-auto space-y-2.5">
            <div className="flex items-center justify-between px-1 pb-1 border-b border-white/[0.06]">
              <span className="text-[11px] font-semibold text-volt-muted">
                Competitor Cross-Reference
              </span>
              <span className="text-[11px] font-mono text-volt-dim tabular-nums">
                {filteredSkus.length} SKUs
              </span>
            </div>

            {filteredSkus.length === 0 ? (
              <div className="py-10 px-4 text-center space-y-3 bg-volt-recessed rounded-[12px] border border-white/[0.06]">
                <p className="text-xs font-semibold text-volt-ink">
                  No matching SKUs found
                </p>
                <p className="text-[11px] text-volt-muted leading-relaxed">
                  Clear your search query or switch manufacturer filters to browse all 26 commercial equivalents.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBrand("ALL");
                    setSearchQuery("");
                  }}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-volt-elevated hover:bg-volt-amber hover:text-volt-base text-volt-amber border border-white/[0.08] text-xs font-semibold transition-all duration-200 ease-spring"
                >
                  <ArrowsClockwise size={13} />
                  <span>Reset Filter</span>
                </button>
              </div>
            ) : (
              filteredSkus.map((item) => {
                const isSelected = item.id === activeSku.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedSkuId(item.id)}
                    className={`w-full p-3 rounded-[12px] border text-left transition-all duration-200 ease-spring ${
                      isSelected
                        ? "bg-volt-elevated border-volt-amber/60 text-volt-ink shadow-sm"
                        : "bg-volt-recessed border-white/[0.06] text-volt-muted hover:text-volt-ink hover:border-white/[0.14]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-volt-amber">{item.competitorBrand}</span>
                      <span className="text-volt-dim text-[10px] font-medium">{item.category.replace(/_/g, " ")}</span>
                    </div>
                    <div className="text-xs font-semibold font-mono text-volt-ink truncate tabular-nums">
                      {item.competitorSku} ({item.competitorWatts}W)
                    </div>
                    <div className="text-[11px] font-mono text-emerald-400 mt-1.5 flex items-center justify-between">
                      <span>&rarr; {item.aetherSku}</span>
                      <span className="font-bold tabular-nums">{item.aetherWatts}W</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <SkuComparisonCard sku={activeSku} />
          <RoiCalculatorPanel sku={activeSku} />
        </div>
      </div>
    </div>
  );
};
