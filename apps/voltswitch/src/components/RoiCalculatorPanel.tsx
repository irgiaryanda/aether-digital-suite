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
    <div className="bg-volt-tray rounded-[20px] p-1.5 border border-white/[0.08]">
      <div className="bg-volt-surface rounded-[14px] p-5 border border-white/[0.06] space-y-5">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center space-x-2.5">
            <Calculator size={18} className="text-volt-amber" weight="fill" />
            <h3 className="font-bold text-sm text-volt-ink tracking-tight">
              Commercial Energy & Carbon Payback
            </h3>
          </div>
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-1.5 rounded-full bg-volt-recessed hover:bg-volt-elevated border border-white/[0.1] text-volt-amber text-xs font-mono font-bold flex items-center space-x-1.5 transition-all duration-200 ease-spring active:scale-[0.98]"
          >
            <DownloadSimple size={14} weight="bold" />
            <span>CSV Export</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="roi-qty" className="text-volt-muted font-medium">
                Fixtures
              </label>
              <span className="font-mono text-volt-ink font-bold tabular-nums">{quantity}</span>
            </div>
            <input
              id="roi-qty"
              type="range"
              min={10}
              max={500}
              step={5}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              className="w-full volt-range"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="roi-hours" className="text-volt-muted font-medium">
                Daily Hrs
              </label>
              <span className="font-mono text-volt-ink font-bold tabular-nums">{dailyHours}h</span>
            </div>
            <input
              id="roi-hours"
              type="range"
              min={4}
              max={24}
              step={1}
              value={dailyHours}
              onChange={(e) => setDailyHours(parseInt(e.target.value, 10))}
              className="w-full volt-range"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="roi-days" className="text-volt-muted font-medium">
                Days / Yr
              </label>
              <span className="font-mono text-volt-ink font-bold tabular-nums">{annualDays}d</span>
            </div>
            <input
              id="roi-days"
              type="range"
              min={100}
              max={365}
              step={5}
              value={annualDays}
              onChange={(e) => setAnnualDays(parseInt(e.target.value, 10))}
              className="w-full volt-range"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="roi-tariff" className="text-volt-muted font-medium">
                Tariff
              </label>
              <span className="font-mono text-volt-ink font-bold tabular-nums">${tariff.toFixed(2)}</span>
            </div>
            <input
              id="roi-tariff"
              type="range"
              min={0.15}
              max={0.65}
              step={0.01}
              value={tariff}
              onChange={(e) => setTariff(parseFloat(e.target.value))}
              className="w-full volt-range"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-volt-recessed rounded-[12px] border border-white/[0.06]">
            <span className="text-[11px] text-volt-muted block">Annual Saved</span>
            <span className="font-mono font-bold text-sm text-volt-ink tabular-nums mt-0.5 block">
              {roi.annualKwhSaved.toLocaleString()} kWh
            </span>
          </div>
          <div className="p-3 bg-volt-recessed rounded-[12px] border border-volt-amber/35">
            <span className="text-[11px] text-volt-amber block font-medium">AUD Saved / Yr</span>
            <span className="font-mono font-bold text-sm text-volt-amber tabular-nums mt-0.5 block">
              ${roi.annualAudSaved.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-volt-recessed rounded-[12px] border border-emerald-500/35">
            <span className="text-[11px] text-emerald-400 block font-medium">CO2 Reduction</span>
            <span className="font-mono font-bold text-sm text-emerald-400 tabular-nums mt-0.5 block">
              {roi.co2ReductionTonnes} t
            </span>
          </div>
          <div className="p-3 bg-volt-recessed rounded-[12px] border border-white/[0.08]">
            <span className="text-[11px] text-volt-muted block">Payback Window</span>
            <span className="font-mono font-bold text-sm text-volt-ink tabular-nums mt-0.5 block">
              {roi.paybackPeriodMonths} mos
            </span>
          </div>
        </div>

        <RoiPaybackChart roi={roi} />
      </div>
    </div>
  );
};
