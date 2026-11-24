import React, { useEffect, useState } from "react";
import {
  ActiveTimerState,
  ChronosProject,
  ProjectPhase,
  TimesheetEntry,
  calculateElapsedSeconds,
  formatDurationToTimecode,
} from "@aether/core-engine";
import { Play, Pause, Stop, Warning } from "@phosphor-icons/react";

interface Props {
  projects: ChronosProject[];
  timerState: ActiveTimerState;
  onTimerUpdate: (nextState: ActiveTimerState) => void;
  onLogEntry: (entry: TimesheetEntry, projectId: string, durationSeconds: number) => void;
}

export const ActiveTimerBar: React.FC<Props> = ({
  projects,
  timerState,
  onTimerUpdate,
  onLogEntry,
}) => {
  const [nowMs, setNowMs] = useState(Date.now());
  const [validationHint, setValidationHint] = useState<string | null>(null);

  useEffect(() => {
    if (!timerState.isRunning) return;
    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [timerState.isRunning]);

  const elapsed = calculateElapsedSeconds(
    timerState.accumulatedSeconds,
    timerState.startedAtMs,
    nowMs,
    timerState.isRunning
  );

  const handleStart = () => {
    setValidationHint(null);
    onTimerUpdate({ ...timerState, startedAtMs: Date.now(), isRunning: true });
  };

  const handlePause = () => {
    onTimerUpdate({ ...timerState, accumulatedSeconds: elapsed, startedAtMs: null, isRunning: false });
  };

  const handleStopAndLog = () => {
    if (elapsed < 5) {
      setValidationHint("Minimum 5 seconds required before saving an entry.");
      return;
    }

    setValidationHint(null);
    const proj = projects.find((p) => p.id === timerState.projectId) ?? projects[0]!;
    const entry: TimesheetEntry = {
      id: `TIME-${Date.now().toString().slice(-6)}`,
      userId: "USR-001",
      userName: "Irgi Aryanda",
      projectId: proj.id,
      taskId: timerState.taskId ?? undefined,
      taskDescription: timerState.description.trim() || "Active Development Session",
      phaseCategory: timerState.phase,
      isBillable: timerState.isBillable,
      hourlyRateAud: proj.hourlyRateAud,
      durationSeconds: elapsed,
      startedAt: new Date(Date.now() - elapsed * 1000).toISOString(),
      endedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    onLogEntry(entry, proj.id, elapsed);
    onTimerUpdate({
      ...timerState,
      taskId: null,
      description: "",
      startedAtMs: null,
      accumulatedSeconds: 0,
      isRunning: false,
    });
  };

  return (
    <div className="space-y-2 print:hidden">
      <div className="bg-chronos-surface border border-white/10 rounded-xl p-3 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center space-x-2 bg-chronos-canvas px-3 py-1.5 rounded-lg border border-white/10">
            <span className={`w-2 h-2 rounded-full ${timerState.isRunning ? "bg-chronos-green animate-pulse" : elapsed > 0 ? "bg-chronos-amber" : "bg-gray-600"}`} />
            <span className="text-base font-bold text-white tabular-nums">
              {formatDurationToTimecode(elapsed)}
            </span>
          </div>

          <input
            type="text"
            value={timerState.description}
            onChange={(e) => onTimerUpdate({ ...timerState, description: e.target.value })}
            placeholder="Task description..."
            className="px-2.5 py-1.5 bg-chronos-canvas border border-white/10 rounded text-white text-xs flex-1 min-w-[160px]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          <select
            aria-label="Timer Client Project"
            value={timerState.projectId ?? projects[0]?.id}
            onChange={(e) => onTimerUpdate({ ...timerState, projectId: e.target.value })}
            className="px-2 py-1.5 bg-chronos-canvas border border-white/10 rounded text-white text-xs"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.code}</option>
            ))}
          </select>

          <select
            aria-label="Timer Project Phase"
            value={timerState.phase}
            onChange={(e) => onTimerUpdate({ ...timerState, phase: e.target.value as ProjectPhase })}
            className="px-2 py-1.5 bg-chronos-canvas border border-white/10 rounded text-white text-xs"
          >
            <option value="DISCOVERY_UX">UX Discovery</option>
            <option value="CUSTOM_WP_THEME">WP Theme</option>
            <option value="WOOCOMMERCE_PLUGIN">Woo Plugin</option>
            <option value="QA_STAGING">QA & Staging</option>
            <option value="DEPLOYMENT_MAINTENANCE">Deployment</option>
          </select>

          <button
            type="button"
            onClick={() => onTimerUpdate({ ...timerState, isBillable: !timerState.isBillable })}
            className={`px-2 py-1.5 rounded border text-xs font-bold ${timerState.isBillable ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-chronos-canvas text-gray-500 border-white/10"}`}
          >
            {timerState.isBillable ? "Billable" : "Non-Bill"}
          </button>

          {!timerState.isRunning && (
            <button type="button" onClick={handleStart} className="px-3.5 py-1.5 rounded bg-chronos-green hover:bg-emerald-400 text-black font-bold flex items-center space-x-1">
              <Play size={13} weight="fill" />
              <span>{elapsed > 0 ? "Resume" : "Start"}</span>
            </button>
          )}

          {timerState.isRunning && (
            <button type="button" onClick={handlePause} className="px-2.5 py-1.5 rounded bg-chronos-amber text-black font-bold flex items-center space-x-1">
              <Pause size={13} weight="fill" />
              <span>Pause</span>
            </button>
          )}

          {elapsed > 0 && (
            <button type="button" onClick={handleStopAndLog} className="px-3 py-1.5 rounded bg-chronos-indigo text-white font-bold flex items-center space-x-1">
              <Stop size={13} weight="fill" />
              <span>Save</span>
            </button>
          )}
        </div>
      </div>

      {validationHint && (
        <div className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[11px] font-mono flex items-center space-x-1.5">
          <Warning size={14} weight="fill" />
          <span>{validationHint}</span>
        </div>
      )}
    </div>
  );
};
