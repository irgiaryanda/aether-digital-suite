import React, { useEffect, useState } from "react";
import {
  ActiveTimerState,
  ChronosProject,
  ProjectPhase,
  TimesheetEntry,
  calculateElapsedSeconds,
  formatDurationToTimecode,
} from "@aether/core-engine";
import { Pause, Play, Stop, Warning } from "@phosphor-icons/react";

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
    <div className="space-y-2.5 print:hidden">
      <div className="bg-chronos-tray rounded-[20px] p-1.5 border border-white/[0.08]">
        <div className="bg-chronos-card rounded-[14px] p-3 border border-white/[0.06] flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:flex-1">
            <div className="flex items-center space-x-2.5 bg-chronos-recessed px-3.5 py-2 rounded-full border border-white/[0.08] flex-shrink-0">
              <span
                className={`w-2 h-2 rounded-full ${
                  timerState.isRunning
                    ? "bg-chronos-green"
                    : elapsed > 0
                    ? "bg-chronos-amber"
                    : "bg-chronos-dim"
                }`}
              />
              <span className="font-mono text-base font-bold text-chronos-ink tabular-nums">
                {formatDurationToTimecode(elapsed)}
              </span>
            </div>

            <label htmlFor="chronos-timer-desc" className="sr-only">
              Active task description
            </label>
            <input
              id="chronos-timer-desc"
              type="text"
              value={timerState.description}
              onChange={(e) => onTimerUpdate({ ...timerState, description: e.target.value })}
              placeholder="What are you working on?"
              className="px-3.5 py-2 bg-chronos-recessed border border-white/[0.08] rounded-full text-chronos-ink placeholder-chronos-dim text-xs flex-1 min-w-[180px] focus:border-chronos-green focus:outline-none transition-colors duration-200"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <select
              aria-label="Timer Client Project"
              value={timerState.projectId ?? projects[0]?.id}
              onChange={(e) => onTimerUpdate({ ...timerState, projectId: e.target.value })}
              className="px-3 py-2 bg-chronos-recessed border border-white/[0.08] rounded-[10px] font-mono text-chronos-ink text-xs focus:border-chronos-green focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code}
                </option>
              ))}
            </select>

            <select
              aria-label="Timer Project Phase"
              value={timerState.phase}
              onChange={(e) => onTimerUpdate({ ...timerState, phase: e.target.value as ProjectPhase })}
              className="px-3 py-2 bg-chronos-recessed border border-white/[0.08] rounded-[10px] text-chronos-ink text-xs focus:border-chronos-green focus:outline-none"
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
              className={`px-3 py-2 rounded-full border text-xs font-semibold transition-colors duration-200 ${
                timerState.isBillable
                  ? "bg-emerald-500/10 text-chronos-green border-emerald-500/35"
                  : "bg-chronos-recessed text-chronos-dim border-white/[0.08]"
              }`}
            >
              {timerState.isBillable ? "Billable" : "Non-Bill"}
            </button>

            {!timerState.isRunning && (
              <button
                type="button"
                onClick={handleStart}
                className="px-4 py-2 rounded-full bg-chronos-green hover:bg-chronos-green-hover text-chronos-canvas font-bold flex items-center space-x-1.5 transition-all duration-200 ease-spring active:scale-[0.98]"
              >
                <Play size={13} weight="fill" />
                <span>{elapsed > 0 ? "Resume" : "Start"}</span>
              </button>
            )}

            {timerState.isRunning && (
              <button
                type="button"
                onClick={handlePause}
                className="px-3.5 py-2 rounded-full bg-chronos-amber text-chronos-canvas font-bold flex items-center space-x-1.5 transition-all duration-200 ease-spring active:scale-[0.98]"
              >
                <Pause size={13} weight="fill" />
                <span>Pause</span>
              </button>
            )}

            {elapsed > 0 && (
              <button
                type="button"
                onClick={handleStopAndLog}
                className="px-4 py-2 rounded-full bg-chronos-elevated hover:bg-chronos-green hover:text-chronos-canvas text-chronos-ink border border-white/[0.12] font-bold flex items-center space-x-1.5 transition-all duration-200 ease-spring active:scale-[0.98]"
              >
                <Stop size={13} weight="fill" />
                <span>Save Entry</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {validationHint && (
        <div className="px-3.5 py-2 rounded-[12px] bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs flex items-center space-x-2">
          <Warning size={15} weight="fill" />
          <span>{validationHint}</span>
        </div>
      )}
    </div>
  );
};
