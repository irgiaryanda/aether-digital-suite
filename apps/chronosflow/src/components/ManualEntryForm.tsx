import React, { useState } from "react";
import { ChronosProject, ProjectPhase, TimesheetEntry } from "@aether/core-engine";
import { PlusCircle } from "@phosphor-icons/react";

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
    <form onSubmit={handleSubmit} className="bg-chronos-surface border border-white/10 rounded-xl p-4 shadow-lg space-y-3 font-mono text-xs">
      <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
        <PlusCircle size={16} className="text-chronos-indigo" weight="fill" />
        <h3 className="font-bold text-white">Manual Timesheet Quick-Log</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div>
          <span className="text-gray-400 block mb-0.5">Project</span>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-2 py-1.5 bg-chronos-canvas border border-white/10 rounded text-white"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.code} - {p.title}</option>
            ))}
          </select>
        </div>

        <div>
          <span className="text-gray-400 block mb-0.5">Phase</span>
          <select
            value={phase}
            onChange={(e) => setPhase(e.target.value as ProjectPhase)}
            className="w-full px-2 py-1.5 bg-chronos-canvas border border-white/10 rounded text-white"
          >
            <option value="DISCOVERY_UX">UX Discovery</option>
            <option value="CUSTOM_WP_THEME">Custom WP Theme</option>
            <option value="WOOCOMMERCE_PLUGIN">WooCommerce Plugin</option>
            <option value="QA_STAGING">QA & Staging</option>
            <option value="DEPLOYMENT_MAINTENANCE">Deployment</option>
          </select>
        </div>

        <div>
          <span className="text-gray-400 block mb-0.5">Hours</span>
          <input
            type="number"
            step="0.25"
            min="0.25"
            max="24"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full px-2 py-1.5 bg-chronos-canvas border border-white/10 rounded text-white"
          />
        </div>

        <div>
          <span className="text-gray-400 block mb-0.5">Description</span>
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Work completed..."
            className="w-full px-2 py-1.5 bg-chronos-canvas border border-white/10 rounded text-white"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center space-x-1.5 text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={isBillable}
            onChange={(e) => setIsBillable(e.target.checked)}
            className="accent-chronos-indigo"
          />
          <span>Billable Entry</span>
        </label>

        <button
          type="submit"
          className="px-4 py-1.5 rounded bg-chronos-indigo hover:bg-indigo-500 text-white font-bold transition-colors"
        >
          Add Timesheet Record &rarr;
        </button>
      </div>
    </form>
  );
};
