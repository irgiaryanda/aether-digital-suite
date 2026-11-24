import React, { useMemo, useState } from "react";
import { KanbanTask, calculateAgencyUtilization } from "@aether/core-engine";
import { useChronosState } from "./components/useChronosState";
import { Header } from "./components/Header";
import { ActiveTimerBar } from "./components/ActiveTimerBar";
import { TimesheetLedgerView } from "./components/TimesheetLedgerView";
import { KanbanWorkflowView } from "./components/KanbanWorkflowView";
import { AnalyticsInvoiceView } from "./components/AnalyticsInvoiceView";
import { WpInspectorDrawer } from "./components/WpInspectorDrawer";

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<"ledger" | "kanban" | "analytics">("ledger");
  const [isWpOpen, setIsWpOpen] = useState(false);

  const state = useChronosState();

  const util = useMemo(() => calculateAgencyUtilization(state.timesheets, 120), [state.timesheets]);

  const totalLogged = useMemo(() => {
    const totalSecs = state.timesheets.reduce((acc, t) => acc + t.durationSeconds, 0);
    return Math.round((totalSecs / 3600) * 10) / 10;
  }, [state.timesheets]);

  const handleStartTask = (task: KanbanTask) => {
    const projectRate =
      state.projects.find((p) => p.id === task.projectId)?.hourlyRateAud ?? 185;

    state.updateTimer({
      taskId: task.id,
      projectId: task.projectId,
      description: task.title,
      phase: task.phase,
      isBillable: task.isBillable,
      hourlyRateAud: projectRate,
      startedAtMs: Date.now(),
      accumulatedSeconds: 0,
      isRunning: true,
    });
  };

  const wpPayload = useMemo(() => {
    const latest = state.timesheets[0];
    return {
      user_id: 1,
      project_id: state.activeTimer.projectId ? parseInt(state.activeTimer.projectId.replace(/\D/g, "") || "1", 10) : 1,
      task_description: state.activeTimer.description || latest?.taskDescription || "WP Dev",
      phase_category: state.activeTimer.phase,
      is_billable: state.activeTimer.isBillable ? 1 : 0,
      hourly_rate_aud: state.activeTimer.hourlyRateAud,
      duration_seconds: state.activeTimer.accumulatedSeconds || latest?.durationSeconds || 3600,
    };
  }, [state.activeTimer, state.timesheets]);

  return (
    <div className="min-h-[100dvh] bg-chronos-canvas text-chronos-ink flex flex-col font-sans relative print:bg-white print:text-black">
      <div className="chronos-grain-overlay" aria-hidden="true" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-chronos-green focus:text-chronos-canvas focus:rounded-full focus:text-xs focus:font-bold print:hidden"
      >
        Skip to main content
      </a>

      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        utilizationPercent={util.utilizationRatePercent}
        totalLoggedHours={totalLogged}
        onResetDemoData={state.resetAll}
        onOpenWpInspector={() => setIsWpOpen(true)}
      />

      <main
        id="main-content"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 print:p-0 print:space-y-0"
      >
        <ActiveTimerBar
          projects={state.projects}
          timerState={state.activeTimer}
          onTimerUpdate={state.updateTimer}
          onLogEntry={state.logEntry}
        />

        {activeView === "ledger" && (
          <TimesheetLedgerView
            timesheets={state.timesheets}
            projects={state.projects}
            onAddEntry={state.logEntry}
            onDeleteEntry={state.deleteEntry}
          />
        )}

        {activeView === "kanban" && (
          <KanbanWorkflowView
            tasks={state.tasks}
            projects={state.projects}
            onMoveTask={state.moveTask}
            onStartTimerOnTask={handleStartTask}
          />
        )}

        {activeView === "analytics" && (
          <AnalyticsInvoiceView
            timesheets={state.timesheets}
            projects={state.projects}
            clients={state.clients}
          />
        )}
      </main>

      <WpInspectorDrawer
        isOpen={isWpOpen}
        onClose={() => setIsWpOpen(false)}
        livePayload={wpPayload}
        syncTelemetry={state.syncTelemetry}
      />
    </div>
  );
};
