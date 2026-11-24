import React, { useState } from "react";
import { ChronosProject, ProjectPhase, TimesheetEntry } from "@aether/core-engine";
import { ArrowRight, PlusCircle } from "@phosphor-icons/react";

interface Props {
  projects: ChronosProject[];
  onAddEntry: (entry: TimesheetEntry, projectId: string, durationSeconds: number) => void;
}

export const ManualEntryForm: React.FC<Props> = ({ projects, onAddEntry }) => {
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [desc, setDesc] = useState("");
  const [phase, setPhase] = useState<ProjectPhase>("CUSTOM_WP_THEME");
  const [hours, setHours] = useState("2.5");
  const [isBillable, setIsBillable] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const durationHours = parseFloat(hours) || 0;
    if (durationHours <= 0) return;

    const proj = projects.find((p) => p.id === projectId) ?? projects[0]!;
    const durationSeconds = Math.round(durationHours * 3600);

    const entry: TimesheetEntry = {
      id: `TIME-MAN-${Date.now().toString().slice(-6)}`,
      userId: "USR-001",
      userName: "Irgi Aryanda",
      projectId: proj.id,
      taskDescription: desc.trim() || "Manual Work Session",
      phaseCategory: phase,
      isBillable,
      hourlyRateAud: proj.hourlyRateAud,
      durationSeconds,
      startedAt: new Date(Date.now() - durationSeconds * 1000).toISOString(),
      endedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    onAddEntry(entry, proj.id, durationSeconds);
    setDesc("");
  };

  return (
    <div className="bg-chronos-tray rounded-[20px] p-1.5 border border-white/[0.08]">
      <form
        onSubmit={handleSubmit}
        className="bg-chronos-card rounded-[14px] p-5 border border-white/[0.06] space-y-4 text-xs"
      >
        <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3">
          <PlusCircle size={17} className="text-chronos-green" weight="fill" />
          <h2 className="font-display font-bold text-sm text-chronos-ink tracking-tight">
            Manual Timesheet Quick-Log
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div>
            <label htmlFor="manual-project" className="text-chronos-muted font-medium block mb-1.5">
              Client Project
            </label>
            <select
              id="manual-project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 bg-chronos-recessed border border-white/[0.08] rounded-[10px] text-chronos-ink focus:border-chronos-green focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="manual-phase" className="text-chronos-muted font-medium block mb-1.5">
              Delivery Phase
            </label>
            <select
              id="manual-phase"
              value={phase}
              onChange={(e) => setPhase(e.target.value as ProjectPhase)}
              className="w-full px-3 py-2 bg-chronos-recessed border border-white/[0.08] rounded-[10px] text-chronos-ink focus:border-chronos-green focus:outline-none"
            >
              <option value="DISCOVERY_UX">UX Discovery</option>
              <option value="CUSTOM_WP_THEME">Custom WP Theme</option>
              <option value="WOOCOMMERCE_PLUGIN">WooCommerce Plugin</option>
              <option value="QA_STAGING">QA & Staging</option>
              <option value="DEPLOYMENT_MAINTENANCE">Deployment</option>
            </select>
          </div>

          <div>
            <label htmlFor="manual-hours" className="text-chronos-muted font-medium block mb-1.5">
              Hours
            </label>
            <input
              id="manual-hours"
              type="number"
              step="0.25"
              min="0.25"
              max="24"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-3 py-2 bg-chronos-recessed border border-white/[0.08] rounded-[10px] font-mono tabular-nums text-chronos-ink focus:border-chronos-green focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="manual-desc" className="text-chronos-muted font-medium block mb-1.5">
              Work Description
            </label>
            <input
              id="manual-desc"
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Work completed..."
              className="w-full px-3 py-2 bg-chronos-recessed border border-white/[0.08] rounded-[10px] text-chronos-ink placeholder-chronos-dim focus:border-chronos-green focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <label className="flex items-center space-x-2 text-chronos-ink cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isBillable}
              onChange={(e) => setIsBillable(e.target.checked)}
              className="w-4 h-4 rounded accent-emerald-500"
            />
            <span className="font-medium">Billable Client Entry</span>
          </label>

          <button
            type="submit"
            className="group px-4 py-2 rounded-full bg-chronos-green hover:bg-chronos-green-hover text-chronos-canvas font-bold flex items-center space-x-2 transition-all duration-200 ease-spring active:scale-[0.98]"
          >
            <span>Add Timesheet Record</span>
            <span className="w-5 h-5 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
              <ArrowRight size={12} weight="bold" />
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
