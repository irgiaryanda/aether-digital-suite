import React, { useMemo, useState } from "react";
import { ChronosProject, TimesheetEntry } from "@aether/core-engine";
import { ManualEntryForm } from "./ManualEntryForm";
import { ArrowsClockwise, Clock, Trash } from "@phosphor-icons/react";

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
    <div className="space-y-6 text-xs">
      <ManualEntryForm projects={projects} onAddEntry={onAddEntry} />

      <div className="bg-chronos-tray rounded-[20px] p-1.5 border border-white/[0.08]">
        <div className="bg-chronos-card rounded-[14px] p-5 border border-white/[0.06] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
            <div className="flex items-center space-x-2">
              <Clock size={18} className="text-chronos-green" weight="fill" />
              <h2 className="font-display font-bold text-chronos-ink text-sm tracking-tight">
                Agency Timesheet Ledger ({filtered.length} Entries)
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                aria-label="Filter timesheets by project"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-3 py-1.5 bg-chronos-recessed border border-white/[0.08] rounded-[10px] text-chronos-ink text-xs focus:border-chronos-green focus:outline-none"
              >
                <option value="ALL">All Client Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code}
                  </option>
                ))}
              </select>

              <div className="text-chronos-muted bg-chronos-recessed px-3.5 py-1.5 rounded-full border border-white/[0.08] font-mono">
                <strong className="text-chronos-ink tabular-nums">{summary.hours}h</strong> logged &middot;{" "}
                <strong className="text-chronos-green tabular-nums">${summary.billableAud.toLocaleString()} AUD</strong>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-[12px] bg-chronos-recessed border border-white/[0.06] space-y-3">
              <p className="text-sm font-semibold text-chronos-ink">No timesheet entries for this project filter</p>
              <p className="text-xs text-chronos-muted">
                Log time using the quick-log form or active timer bar, or show all client retainers.
              </p>
              {selectedProjectId !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setSelectedProjectId("ALL")}
                  className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-chronos-elevated text-chronos-green border border-emerald-500/35 text-xs font-semibold hover:bg-chronos-green hover:text-chronos-canvas transition-all duration-200 ease-spring"
                >
                  <ArrowsClockwise size={13} />
                  <span>Show All Projects</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[500px] divide-y divide-white/[0.06]">
              {filtered.map((entry) => {
                const hoursVal = Math.round((entry.durationSeconds / 3600) * 10) / 10;
                const lineAud = Math.round(hoursVal * entry.hourlyRateAud * 100) / 100;
                const proj = projects.find((p) => p.id === entry.projectId);

                return (
                  <div
                    key={entry.id}
                    className="py-3 px-1 flex items-start justify-between gap-3 hover:bg-white/[0.02] transition-colors rounded-[8px]"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-chronos-ink text-xs">{proj?.code ?? "PRJ"}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-chronos-recessed text-chronos-muted border border-white/[0.06]">
                          {entry.phaseCategory.replace(/_/g, " ")}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            entry.isBillable
                              ? "bg-emerald-500/10 text-chronos-green border border-emerald-500/25"
                              : "bg-chronos-elevated text-chronos-dim"
                          }`}
                        >
                          {entry.isBillable ? "BILLABLE" : "NON-BILL"}
                        </span>
                      </div>
                      <p className="text-chronos-ink text-xs leading-relaxed">{entry.taskDescription}</p>
                      <div className="text-[11px] font-mono text-chronos-dim">
                        {entry.userName} &middot; {new Date(entry.startedAt).toLocaleDateString("en-AU")}
                      </div>
                    </div>

                    <div className="text-right flex items-center space-x-3 flex-shrink-0">
                      <div className="font-mono">
                        <span className="font-bold text-chronos-ink tabular-nums block text-xs">{hoursVal} hrs</span>
                        <span className="text-[11px] text-chronos-muted tabular-nums">
                          ${lineAud.toLocaleString(undefined, { minimumFractionDigits: 2 })} AUD
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteEntry(entry.id)}
                        aria-label={`Delete timesheet entry ${entry.id}`}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-[10px] text-chronos-dim hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Record"
                      >
                        <Trash size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
