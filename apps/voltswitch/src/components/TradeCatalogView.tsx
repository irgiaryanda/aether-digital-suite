import React, { useMemo, useState } from "react";
import { COMMERCIAL_SKU_CATALOG, ProductCategory } from "@aether/core-engine";
import { ArrowsClockwise, DownloadSimple, MagnifyingGlass, Table } from "@phosphor-icons/react";
import { CatalogTable } from "./CatalogTable";

export const TradeCatalogView: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<"ALL" | ProductCategory>("ALL");
  const [selectedIp, setSelectedIp] = useState<string>("ALL");
  const [selectedCct, setSelectedCct] = useState<string>("ALL");
  const [selectedWarehouse, setSelectedWarehouse] = useState<"ALL" | "SYD" | "MEL" | "BNE">("ALL");
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const ipRatings = useMemo(() => {
    const set = new Set(COMMERCIAL_SKU_CATALOG.map((item) => item.ipRating));
    return ["ALL", ...Array.from(set).sort()];
  }, []);

  const filteredItems = useMemo(() => {
    return COMMERCIAL_SKU_CATALOG.filter((item) => {
      const matchCat = selectedCat === "ALL" || item.category === selectedCat;
      const matchIp = selectedIp === "ALL" || item.ipRating === selectedIp;
      const matchCct = selectedCct === "ALL" || item.cctOptions.includes(selectedCct);
      const matchWarehouse =
        selectedWarehouse === "ALL" ||
        (selectedWarehouse === "SYD" && item.stockSydney > 0) ||
        (selectedWarehouse === "MEL" && item.stockMelbourne > 0) ||
        (selectedWarehouse === "BNE" && item.stockBrisbane > 0);
      const matchSearch =
        search === "" ||
        item.aetherSku.toLowerCase().includes(search.toLowerCase()) ||
        item.aetherModel.toLowerCase().includes(search.toLowerCase()) ||
        item.competitorSku.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchIp && matchCct && matchWarehouse && matchSearch;
    });
  }, [selectedCat, selectedIp, selectedCct, selectedWarehouse, search]);

  const hasActiveFilters =
    selectedCat !== "ALL" ||
    selectedIp !== "ALL" ||
    selectedCct !== "ALL" ||
    selectedWarehouse !== "ALL" ||
    search !== "";

  const resetFilters = () => {
    setSelectedCat("ALL");
    setSelectedIp("ALL");
    setSelectedCct("ALL");
    setSelectedWarehouse("ALL");
    setSearch("");
  };

  const handleQtyChange = (skuId: string, val: number) => {
    setQuantities((prev) => ({ ...prev, [skuId]: Math.max(0, val) }));
  };

  const tenderSummary = useMemo(() => {
    let totalItems = 0;
    let totalAud = 0;
    COMMERCIAL_SKU_CATALOG.forEach((item) => {
      const q = quantities[item.id] || 0;
      if (q > 0) {
        totalItems += q;
        totalAud += q * item.unitTradePriceAud;
      }
    });
    return { totalItems, totalAud };
  }, [quantities]);

  const handleDownloadBoq = () => {
    const rows = ["Aether SKU,Model,Category,Watts,Lumens,Trade Price AUD,Qty,Line Total AUD"];
    COMMERCIAL_SKU_CATALOG.forEach((item) => {
      const q = quantities[item.id] || 0;
      if (q > 0) {
        rows.push(
          `"${item.aetherSku}","${item.aetherModel}","${item.category}",${item.aetherWatts},${item.lumens},${item.unitTradePriceAud},${q},${(q * item.unitTradePriceAud).toFixed(2)}`
        );
      }
    });
    rows.push(`,,,,,Total AUD,$${tenderSummary.totalAud.toFixed(2)}`);

    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Tender-BOQ-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories: ("ALL" | ProductCategory)[] = [
    "ALL",
    "HIGHBAY",
    "BATTEN",
    "TROFFER",
    "FLOODLIGHT",
    "DOWNLIGHT",
    "EMERGENCY_EXIT",
  ];

  return (
    <div className="bg-volt-tray rounded-[20px] p-1.5 border border-white/[0.08]">
      <div className="bg-volt-surface rounded-[14px] p-5 border border-white/[0.06] space-y-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center space-x-2">
            <Table size={17} className="text-volt-amber" weight="fill" />
            <h2 className="font-bold text-sm text-volt-ink tracking-tight">
              Commercial Trade Matrix ({filteredItems.length} SKUs)
            </h2>
          </div>

          {tenderSummary.totalItems > 0 && (
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:space-x-2 bg-volt-recessed px-3.5 py-1.5 rounded-full border border-volt-amber/50">
              <span className="font-mono text-volt-ink tabular-nums whitespace-nowrap">
                {tenderSummary.totalItems} fittings (${tenderSummary.totalAud.toFixed(2)})
              </span>
              <button
                type="button"
                onClick={handleDownloadBoq}
                className="px-3 py-1 bg-volt-amber hover:bg-volt-amber-hover text-volt-base font-bold text-xs rounded-full flex items-center space-x-1 whitespace-nowrap flex-shrink-0 transition-all duration-200 ease-spring active:scale-[0.98]"
              >
                <DownloadSimple size={13} weight="bold" />
                <span>BOQ CSV</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCat(c)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-bold transition-all duration-200 ease-spring ${
                  selectedCat === c
                    ? "bg-volt-amber text-volt-base"
                    : "bg-volt-recessed text-volt-muted hover:text-volt-ink border border-white/[0.08]"
                }`}
              >
                {c.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter by IP Rating"
              value={selectedIp}
              onChange={(e) => setSelectedIp(e.target.value)}
              className="px-2.5 py-1.5 bg-volt-recessed border border-white/[0.08] rounded-[10px] text-volt-ink text-xs font-mono focus:border-volt-amber focus:outline-none"
            >
              {ipRatings.map((ip) => (
                <option key={ip} value={ip}>
                  {ip === "ALL" ? "All IP Ratings" : ip}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by Color Temperature"
              value={selectedCct}
              onChange={(e) => setSelectedCct(e.target.value)}
              className="px-2.5 py-1.5 bg-volt-recessed border border-white/[0.08] rounded-[10px] text-volt-ink text-xs font-mono focus:border-volt-amber focus:outline-none"
            >
              <option value="ALL">All CCT</option>
              <option value="3000K">3000K Warm</option>
              <option value="4000K">4000K Neutral</option>
              <option value="5000K">5000K Cool</option>
              <option value="6500K">6500K Daylight</option>
            </select>

            <select
              aria-label="Filter by Warehouse Stock"
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value as "ALL" | "SYD" | "MEL" | "BNE")}
              className="px-2.5 py-1.5 bg-volt-recessed border border-white/[0.08] rounded-[10px] text-volt-ink text-xs focus:border-volt-amber focus:outline-none"
            >
              <option value="ALL">All Depots</option>
              <option value="SYD">Sydney In Stock</option>
              <option value="MEL">Melbourne In Stock</option>
              <option value="BNE">Brisbane In Stock</option>
            </select>

            <div className="relative w-44">
              <label htmlFor="volt-matrix-search" className="sr-only">
                Search matrix SKUs
              </label>
              <MagnifyingGlass size={14} className="absolute left-2.5 top-2 text-volt-dim" />
              <input
                id="volt-matrix-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search SKU..."
                className="w-full pl-8 pr-2.5 py-1.5 bg-volt-recessed border border-white/[0.08] rounded-full text-volt-ink text-xs font-mono placeholder-volt-dim focus:border-volt-amber focus:outline-none"
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-full bg-volt-elevated text-volt-amber border border-white/[0.08] text-xs font-semibold hover:text-volt-ink transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-[12px] bg-volt-recessed border border-white/[0.06] space-y-3">
            <p className="text-sm font-semibold text-volt-ink">No commercial SKUs match current filters</p>
            <p className="text-xs text-volt-muted">
              Adjust category, IP rating, CCT, or warehouse filters to inspect available inventory.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-volt-amber text-volt-base text-xs font-bold transition-all duration-200 ease-spring active:scale-[0.98]"
            >
              <ArrowsClockwise size={14} weight="bold" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <CatalogTable items={filteredItems} quantities={quantities} onQtyChange={handleQtyChange} />
        )}
      </div>
    </div>
  );
};
