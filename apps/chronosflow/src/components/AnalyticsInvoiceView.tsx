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
    <div className="space-y-6 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 print:hidden">
        <div className="bg-chronos-tray rounded-[20px] p-1.5 border border-white/[0.08]">
          <div className="p-4 bg-chronos-card border border-white/[0.06] rounded-[14px] space-y-1.5">
            <div className="flex items-center space-x-1.5 text-chronos-muted text-[11px] font-medium">
              <TrendUp size={15} className="text-chronos-green" weight="bold" />
              <span>Billable Utilization</span>
            </div>
            <div className="font-mono text-2xl font-bold text-chronos-ink tabular-nums">
              {utilization.utilizationRatePercent}%
            </div>
            <span className="text-[11px] text-chronos-dim block">Target benchmark 80%</span>
          </div>
        </div>

        <div className="bg-chronos-tray rounded-[20px] p-1.5 border border-white/[0.08]">
          <div className="p-4 bg-chronos-card border border-white/[0.06] rounded-[14px] space-y-1.5">
            <div className="flex items-center space-x-1.5 text-chronos-muted text-[11px] font-medium">
              <ChartBar size={15} className="text-chronos-green" weight="bold" />
              <span>Billable vs Non-Bill</span>
            </div>
            <div className="font-mono text-2xl font-bold text-chronos-green tabular-nums">
              {utilization.billableHours}h{" "}
              <span className="text-xs text-chronos-muted font-normal">/ {utilization.nonBillableHours}h</span>
            </div>
            <span className="text-[11px] text-chronos-dim block">Total capacity {totalCapacityHours}h</span>
          </div>
        </div>

        <div className="bg-chronos-tray rounded-[20px] p-1.5 border border-white/[0.08]">
          <div className="p-4 bg-chronos-card border border-white/[0.06] rounded-[14px] space-y-1.5">
            <div className="flex items-center space-x-1.5 text-chronos-muted text-[11px] font-medium">
              <CurrencyDollar size={15} className="text-chronos-amber" weight="bold" />
              <span>Effective Rate</span>
            </div>
            <div className="font-mono text-2xl font-bold text-chronos-ink tabular-nums">
              ${utilization.effectiveHourlyRateAud.toFixed(2)}{" "}
              <span className="text-xs text-chronos-muted font-normal">AUD/h</span>
            </div>
            <span className="text-[11px] text-chronos-dim block">Blended agency yield</span>
          </div>
        </div>

        <div className="bg-chronos-tray rounded-[20px] p-1.5 border border-white/[0.08]">
          <div className="p-4 bg-chronos-card border border-white/[0.06] rounded-[14px] space-y-1.5">
            <div className="flex items-center space-x-1.5 text-chronos-muted text-[11px] font-medium">
              <Users size={15} className="text-chronos-muted" weight="bold" />
              <span>Active Team Capacity</span>
            </div>
            <div className="font-mono text-2xl font-bold text-chronos-ink tabular-nums">
              3 Engineers
            </div>
            <span className="text-[11px] text-chronos-green font-medium block">100% capacity deployed</span>
          </div>
        </div>
      </div>

      <UtilizationChart projects={projects} timesheets={timesheets} />

      <div className="bg-chronos-tray rounded-[20px] p-1.5 border border-white/[0.08] print:hidden">
        <div className="bg-chronos-card border border-white/[0.06] rounded-[14px] p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-chronos-muted font-medium block">Active Invoice Project Target</span>
            <h2 className="font-display font-bold text-chronos-ink text-sm tracking-tight">
              Select Client Retainer for Invoicing
            </h2>
          </div>

          <select
            aria-label="Select Client Project for Tax Invoice"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3.5 py-2 bg-chronos-recessed border border-white/[0.08] rounded-[10px] font-mono text-chronos-ink text-xs focus:border-chronos-green focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} &middot; {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <TaxInvoicePreview invoice={generatedInvoice} />
    </div>
  );
};
