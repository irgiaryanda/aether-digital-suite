import React, { useMemo, useState } from "react";
import { COMMERCIAL_SKU_CATALOG, ProductCategory } from "@aether/core-engine";
import { DownloadSimple, MagnifyingGlass, Table } from "@phosphor-icons/react";
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
        rows.push(`"${item.aetherSku}","${item.aetherModel}","${item.category}",${item.aetherWatts},${item.lumens},${item.unitTradePriceAud},${q},${(q * item.unitTradePriceAud).toFixed(2)}`);
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
    "ALL", "HIGHBAY", "BATTEN", "TROFFER", "FLOODLIGHT", "DOWNLIGHT", "EMERGENCY_EXIT"
  ];

  return (
    <div className="bg-volt-surface rounded-xl border border-volt-border p-4 shadow-lg space-y-3 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-volt-border pb-2.5">
        <div className="flex items-center space-x-2">
          <Table size={16} className="text-volt-amber" weight="fill" />
          <h3 className="font-bold text-white font-sans">Commercial Trade Matrix ({filteredItems.length} SKUs)</h3>
        </div>

        {tenderSummary.totalItems > 0 && (
          <div className="flex items-center space-x-2 bg-volt-base px-2.5 py-1 rounded border border-volt-amber">
            <span className="text-gray-300 tabular-nums">
              {tenderSummary.totalItems} fittings (${tenderSummary.totalAud.toFixed(2)})
            </span>
            <button
              type="button"
              onClick={handleDownloadBoq}
              className="px-2 py-0.5 bg-volt-amber text-black font-bold text-[11px] rounded flex items-center space-x-1"
            >
              <DownloadSimple size={12} />
              <span>BOQ CSV</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCat(c)}
              className={`px-2 py-1 rounded text-[10px] font-bold ${
                selectedCat === c ? "bg-volt-amber text-black" : "bg-volt-base text-gray-400 border border-volt-border"
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
            className="px-2 py-1 bg-volt-base border border-volt-border rounded text-white text-[11px]"
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
            className="px-2 py-1 bg-volt-base border border-volt-border rounded text-white text-[11px]"
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
            className="px-2 py-1 bg-volt-base border border-volt-border rounded text-white text-[11px]"
          >
            <option value="ALL">All Depots</option>
            <option value="SYD">Sydney In Stock</option>
            <option value="MEL">Melbourne In Stock</option>
            <option value="BNE">Brisbane In Stock</option>
          </select>

          <div className="relative w-44">
            <MagnifyingGlass size={13} className="absolute left-2 top-2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SKU..."
              className="w-full pl-6 pr-2 py-1 bg-volt-base border border-volt-border rounded text-white text-[11px]"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="px-2 py-1 rounded bg-volt-elevated text-amber-400 border border-volt-border text-[10px] font-bold hover:text-white"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <CatalogTable items={filteredItems} quantities={quantities} onQtyChange={handleQtyChange} />
    </div>
  );
};
