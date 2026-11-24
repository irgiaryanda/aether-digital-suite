import React, { useMemo, useState } from "react";
import { CommercialSkuItem, calculateRetrofitRoi } from "@aether/core-engine";
import { Calculator, DownloadSimple } from "@phosphor-icons/react";
import { RoiPaybackChart } from "./RoiPaybackChart";

interface Props {
  sku: CommercialSkuItem;
}

export const RoiCalculatorPanel: React.FC<Props> = ({ sku }) => {
  const [quantity, setQuantity] = useState(50);
  const [dailyHours, setDailyHours] = useState(12);
  const [annualDays, setAnnualDays] = useState(300);
  const [tariff, setTariff] = useState(0.32);

  const roi = useMemo(() => {
    return calculateRetrofitRoi({
      fixtureQuantity: quantity,
      operatingHoursPerDay: dailyHours,
      operatingDaysPerYear: annualDays,
      electricityTariffAudPerKwh: tariff,
      existingWatts: sku.competitorWatts,
      proposedWatts: sku.aetherWatts,
      unitCapitalCostAud: sku.unitTradePriceAud,
    });
  }, [quantity, dailyHours, annualDays, tariff, sku]);

  const handleExportCsv = () => {
    const csvContent = [
      "Metric,Value",
      `Quantity,${quantity}`,
      `Existing,${sku.competitorBrand} ${sku.competitorSku} (${sku.competitorWatts}W)`,
      `Proposed,${sku.aetherSku} (${sku.aetherWatts}W)`,
      `Annual Saved kWh,${roi.annualKwhSaved}`,
      `Annual AUD Saved,$${roi.annualAudSaved}`,
      `CO2 Reduction Tonnes,${roi.co2ReductionTonnes}`,
      `Payback Months,${roi.paybackPeriodMonths}`,
      `5Y Net AUD Saved,$${roi.fiveYearNetSavingsAud}`,
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ROI-${sku.aetherSku}-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-volt-surface rounded-xl border border-volt-border p-4 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-volt-border pb-3">
        <div className="flex items-center space-x-2">
          <Calculator size={18} className="text-volt-amber" weight="fill" />
          <h3 className="font-bold text-sm text-white font-sans">
            Commercial Energy & Carbon Payback
          </h3>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          className="px-2.5 py-1 rounded bg-volt-elevated hover:bg-volt-base border border-volt-border text-volt-amber text-xs font-mono font-bold flex items-center space-x-1"
        >
          <DownloadSimple size={14} />
          <span>CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-400">Qty</span>
            <span className="text-white font-bold tabular-nums">{quantity}</span>
          </div>
          <input
            type="range"
            min={10}
            max={500}
            step={5}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            className="w-full accent-volt-amber"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-400">Daily Hrs</span>
            <span className="text-white font-bold tabular-nums">{dailyHours}h</span>
          </div>
          <input
            type="range"
            min={4}
            max={24}
            step={1}
            value={dailyHours}
            onChange={(e) => setDailyHours(parseInt(e.target.value, 10))}
            className="w-full accent-volt-amber"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-400">Days/Yr</span>
            <span className="text-white font-bold tabular-nums">{annualDays}d</span>
          </div>
          <input
            type="range"
            min={100}
            max={365}
            step={5}
            value={annualDays}
            onChange={(e) => setAnnualDays(parseInt(e.target.value, 10))}
            className="w-full accent-volt-amber"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-400">Tariff</span>
            <span className="text-white font-bold tabular-nums">${tariff.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.15}
            max={0.65}
            step={0.01}
            value={tariff}
            onChange={(e) => setTariff(parseFloat(e.target.value))}
            className="w-full accent-volt-amber"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2.5 bg-volt-base rounded border border-volt-border">
          <span className="text-[10px] text-gray-400 block">Annual Saved</span>
          <span className="font-bold text-white tabular-nums">{roi.annualKwhSaved.toLocaleString()} kWh</span>
        </div>
        <div className="p-2.5 bg-volt-base rounded border border-amber-500/40">
          <span className="text-[10px] text-volt-amber block">AUD Saved / Yr</span>
          <span className="font-bold text-volt-amber tabular-nums">${roi.annualAudSaved.toLocaleString()}</span>
        </div>
        <div className="p-2.5 bg-volt-base rounded border border-emerald-500/40">
          <span className="text-[10px] text-emerald-400 block">CO2 Reduction</span>
          <span className="font-bold text-emerald-400 tabular-nums">{roi.co2ReductionTonnes} t</span>
        </div>
        <div className="p-2.5 bg-volt-base rounded border border-cyan-500/40">
          <span className="text-[10px] text-cyan-400 block">Payback</span>
          <span className="font-bold text-cyan-400 tabular-nums">{roi.paybackPeriodMonths} mos</span>
        </div>
      </div>

      <RoiPaybackChart roi={roi} />
    </div>
  );
};
