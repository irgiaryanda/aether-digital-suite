import React, { useMemo, useState } from "react";
import {
  AgencyClient,
  ChronosProject,
  TimesheetEntry,
  calculateAgencyUtilization,
  generateAgencyTaxInvoice,
} from "@aether/core-engine";
import { TaxInvoicePreview } from "./TaxInvoicePreview";
import { UtilizationChart } from "./UtilizationChart";
import { ChartBar, CurrencyDollar, TrendUp, Users } from "@phosphor-icons/react";

interface Props {
  timesheets: TimesheetEntry[];
  projects: ChronosProject[];
  clients: AgencyClient[];
}

export const AnalyticsInvoiceView: React.FC<Props> = ({
  timesheets,
  projects,
  clients,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id ?? "");

  const totalCapacityHours = 120;
  const utilization = useMemo(() => {
    return calculateAgencyUtilization(timesheets, totalCapacityHours);
  }, [timesheets, totalCapacityHours]);

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) ?? projects[0]!;
  }, [projects, selectedProjectId]);

  const activeClient = useMemo(() => {
    return clients.find((c) => c.id === activeProject.clientId) ?? clients[0]!;
  }, [clients, activeProject]);

  const projectTimesheets = useMemo(() => {
    return timesheets.filter((t) => t.projectId === activeProject.id);
  }, [timesheets, activeProject]);

  const generatedInvoice = useMemo(() => {
    return generateAgencyTaxInvoice(
      `INV-AETH-${activeProject.code}-${Date.now().toString().slice(-4)}`,
      "51 824 753 556",
      activeClient.name,
      activeClient.abn,
      activeProject.title,
      projectTimesheets
    );
  }, [activeProject, activeClient, projectTimesheets]);

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Utilization Metrics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 print:hidden">
        <div className="p-4 bg-chronos-surface border border-white/10 rounded-xl space-y-1 shadow-lg">
          <div className="flex items-center space-x-1 text-gray-400 text-[10px] uppercase">
            <TrendUp size={14} className="text-chronos-green" weight="bold" />
            <span>Billable Utilization</span>
          </div>
          <div className="text-xl font-bold text-white tabular-nums">
            {utilization.utilizationRatePercent}%
          </div>
          <span className="text-[10px] text-gray-500">Target benchmark 80%</span>
        </div>

        <div className="p-4 bg-chronos-surface border border-white/10 rounded-xl space-y-1 shadow-lg">
          <div className="flex items-center space-x-1 text-gray-400 text-[10px] uppercase">
            <ChartBar size={14} className="text-chronos-indigo" weight="bold" />
            <span>Billable vs Non-Bill</span>
          </div>
          <div className="text-xl font-bold text-chronos-green tabular-nums">
            {utilization.billableHours}h <span className="text-xs text-gray-400 font-normal">/ {utilization.nonBillableHours}h</span>
          </div>
          <span className="text-[10px] text-gray-500">Total capacity {totalCapacityHours}h</span>
        </div>

        <div className="p-4 bg-chronos-surface border border-white/10 rounded-xl space-y-1 shadow-lg">
          <div className="flex items-center space-x-1 text-gray-400 text-[10px] uppercase">
            <CurrencyDollar size={14} className="text-chronos-amber" weight="bold" />
            <span>Effective Rate</span>
          </div>
          <div className="text-xl font-bold text-white tabular-nums">
            ${utilization.effectiveHourlyRateAud.toFixed(2)}{" "}
            <span className="text-xs text-gray-400 font-normal">AUD/h</span>
          </div>
          <span className="text-[10px] text-gray-500">Blended agency yield</span>
        </div>

        <div className="p-4 bg-chronos-surface border border-white/10 rounded-xl space-y-1 shadow-lg">
          <div className="flex items-center space-x-1 text-gray-400 text-[10px] uppercase">
            <Users size={14} className="text-cyan-400" weight="bold" />
            <span>Active Team Capacity</span>
          </div>
          <div className="text-xl font-bold text-white tabular-nums">
            3 Engineers
          </div>
          <span className="text-[10px] text-emerald-400">100% capacity deployed</span>
        </div>
      </div>

      <UtilizationChart projects={projects} timesheets={timesheets} />

      {/* Invoice Generator Target Selector */}
      <div className="bg-chronos-surface border border-white/10 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <span className="text-[10px] text-gray-400 uppercase block">Active Invoice Project Target</span>
          <h3 className="font-bold text-white text-sm font-sans">Select Client Retainer for Invoicing</h3>
        </div>

        <select
          aria-label="Select Client Project for Tax Invoice"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="px-3 py-1.5 bg-chronos-canvas border border-white/10 rounded text-white text-xs"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.code} &middot; {p.title}
            </option>
          ))}
        </select>
      </div>

      <TaxInvoicePreview invoice={generatedInvoice} />
    </div>
  );
};
