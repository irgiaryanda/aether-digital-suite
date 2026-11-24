import { useMemo, useState } from "react";
import {
  ActiveTimerState,
  AgencyClient,
  ChronosProject,
  KanbanStage,
  KanbanTask,
  TimesheetEntry,
  WpSyncTelemetry,
  aetherStorage,
  wpRestClient,
} from "@aether/core-engine";

export function useChronosState() {
  const initialState = useMemo(() => aetherStorage.getState(), []);

  const [clients, setClients] = useState<AgencyClient[]>(initialState.chronos.clients);
  const [projects, setProjects] = useState<ChronosProject[]>(initialState.chronos.projects);
  const [tasks, setTasks] = useState<KanbanTask[]>(initialState.chronos.tasks);
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(initialState.chronos.timesheets);
  const [activeTimer, setActiveTimer] = useState<ActiveTimerState>(initialState.chronos.activeTimer);
  const [syncTelemetry, setSyncTelemetry] = useState<WpSyncTelemetry | null>(() =>
    wpRestClient.getLastSyncTelemetry("chronosflow")
  );

  const resetAll = () => {
    const fresh = aetherStorage.resetToBaselineFixtures();
    setClients(fresh.chronos.clients);
    setProjects(fresh.chronos.projects);
    setTasks(fresh.chronos.tasks);
    setTimesheets(fresh.chronos.timesheets);
    setActiveTimer(fresh.chronos.activeTimer);
  };

  const updateTimer = (next: ActiveTimerState) => {
    setActiveTimer(next);
    aetherStorage.setState((cur) => ({ ...cur, chronos: { ...cur.chronos, activeTimer: next } }));
  };

  const logEntry = (entry: TimesheetEntry, projectId: string, durationSecs: number) => {
    const addHours = Math.round((durationSecs / 3600) * 10) / 10;
    const nextTimesheets = [entry, ...timesheets];
    const nextProjects = projects.map((p) =>
      p.id === projectId ? { ...p, loggedHours: Math.round((p.loggedHours + addHours) * 10) / 10 } : p
    );
    const nextTasks = entry.taskId
      ? tasks.map((t) =>
          t.id === entry.taskId ? { ...t, loggedHours: Math.round((t.loggedHours + addHours) * 10) / 10 } : t
        )
      : tasks;

    setTimesheets(nextTimesheets);
    setProjects(nextProjects);
    setTasks(nextTasks);

    aetherStorage.setState((cur) => ({
      ...cur,
      chronos: {
        ...cur.chronos,
        timesheets: nextTimesheets,
        projects: nextProjects,
        tasks: nextTasks,
      },
    }));

    void wpRestClient
      .dispatchWithFallback(
        "/wp-json/aether/v1/chronos-entries",
        "POST",
        {
          project_id: parseInt(projectId.replace(/\D/g, "") || "1", 10),
          task_description: entry.taskDescription,
          phase_category: entry.phaseCategory,
          is_billable: entry.isBillable ? 1 : 0,
          hourly_rate_aud: entry.hourlyRateAud,
          duration_seconds: durationSecs,
          started_at: entry.startedAt,
          ended_at: entry.endedAt,
        },
        { success: true, entry_id: 8841 },
        { appKey: "chronosflow" }
      )
      .then(() => {
        setSyncTelemetry(wpRestClient.getLastSyncTelemetry("chronosflow"));
      });
  };

  const deleteEntry = (id: string) => {
    const target = timesheets.find((t) => t.id === id);
    if (!target) return;

    const subHours = Math.round((target.durationSeconds / 3600) * 10) / 10;
    const nextTimesheets = timesheets.filter((t) => t.id !== id);
    const nextProjects = projects.map((p) =>
      p.id === target.projectId
        ? { ...p, loggedHours: Math.max(0, Math.round((p.loggedHours - subHours) * 10) / 10) }
        : p
    );
    const nextTasks = target.taskId
      ? tasks.map((t) =>
          t.id === target.taskId
            ? { ...t, loggedHours: Math.max(0, Math.round((t.loggedHours - subHours) * 10) / 10) }
            : t
        )
      : tasks;

    setTimesheets(nextTimesheets);
    setProjects(nextProjects);
    setTasks(nextTasks);

    aetherStorage.setState((cur) => ({
      ...cur,
      chronos: {
        ...cur.chronos,
        timesheets: nextTimesheets,
        projects: nextProjects,
        tasks: nextTasks,
      },
    }));
  };

  const moveTask = (taskId: string, stage: KanbanStage) => {
    const next = tasks.map((t) => (t.id === taskId ? { ...t, stage } : t));
    setTasks(next);
    aetherStorage.setState((cur) => ({ ...cur, chronos: { ...cur.chronos, tasks: next } }));
  };

  return {
    clients,
    projects,
    tasks,
    timesheets,
    activeTimer,
    syncTelemetry,
    resetAll,
    updateTimer,
    logEntry,
    deleteEntry,
    moveTask,
  };
}
