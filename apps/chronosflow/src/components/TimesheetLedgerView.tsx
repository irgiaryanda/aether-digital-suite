import React, { useMemo, useState } from "react";
import { ChronosProject, TimesheetEntry } from "@aether/core-engine";
import { ManualEntryForm } from "./ManualEntryForm";
import { Clock, Trash } from "@phosphor-icons/react";

interface Props {
  timesheets: TimesheetEntry[];
  projects: ChronosProject[];
  onAddEntry: (entry: TimesheetEntry, projectId: string, durationSeconds: number) => void;
  onDeleteEntry: (id: string) => void;
}

export const TimesheetLedgerView: React.FC<Props> = ({
  timesheets,
  projects,
  onAddEntry,
  onDeleteEntry,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("ALL");

  const filtered = useMemo(() => {
    return timesheets.filter((t) => selectedProjectId === "ALL" || t.projectId === selectedProjectId);
  }, [timesheets, selectedProjectId]);

  const summary = useMemo(() => {
    let totalSecs = 0;
    let billableAud = 0;
    filtered.forEach((t) => {
      totalSecs += t.durationSeconds;
      if (t.isBillable) {
        billableAud += (t.durationSeconds / 3600) * t.hourlyRateAud;
      }
    });
    return {
      hours: Math.round((totalSecs / 3600) * 10) / 10,
      billableAud: Math.round(billableAud * 100) / 100,
    };
  }, [filtered]);

  return (
    <div className="space-y-5 font-mono text-xs">
      <ManualEntryForm projects={projects} onAddEntry={onAddEntry} />

      <div className="bg-chronos-surface border border-white/10 rounded-xl p-4 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <Clock size={18} className="text-chronos-indigo" weight="fill" />
            <h3 className="font-bold text-white text-sm">Agency Timesheet Ledger ({filtered.length} Entries)</h3>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-2.5 py-1 bg-chronos-canvas border border-white/10 rounded text-white text-[11px]"
            >
              <option value="ALL">All Client Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.code}</option>
              ))}
            </select>

            <span className="text-gray-300 bg-chronos-card px-2.5 py-1 rounded border border-white/10">
              <strong className="text-white tabular-nums">{summary.hours}h</strong> logged &middot;{" "}
              <strong className="text-chronos-green tabular-nums">${summary.billableAud.toLocaleString()} AUD</strong>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[480px] divide-y divide-white/5">
          {filtered.map((entry) => {
            const hoursVal = Math.round((entry.durationSeconds / 3600) * 10) / 10;
            const lineAud = Math.round(hoursVal * entry.hourlyRateAud * 100) / 100;
            const proj = projects.find((p) => p.id === entry.projectId);

            return (
              <div key={entry.id} className="py-2.5 flex items-start justify-between gap-3 hover:bg-white/[0.02]">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-xs">{proj?.code ?? "PRJ"}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400">
                      {entry.phaseCategory.replace(/_/g, " ")}
                    </span>
                    <span
                      className={`text-[9px] px-1 rounded ${
                        entry.isBillable ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {entry.isBillable ? "BILLABLE" : "NON-BILL"}
                    </span>
                  </div>
                  <p className="text-gray-300 text-[11px] font-sans">{entry.taskDescription}</p>
                  <div className="text-[10px] text-gray-500">
                    {entry.userName} &middot; {new Date(entry.startedAt).toLocaleDateString("en-AU")}
                  </div>
                </div>

                <div className="text-right flex items-center space-x-3 flex-shrink-0">
                  <div>
                    <span className="font-bold text-white tabular-nums block">{hoursVal} hrs</span>
                    <span className="text-[10px] text-gray-400 tabular-nums">
                      ${lineAud.toLocaleString(undefined, { minimumFractionDigits: 2 })} AUD
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                    title="Delete Record"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
