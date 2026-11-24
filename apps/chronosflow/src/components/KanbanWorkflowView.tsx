import React, { useState } from "react";
import { ChronosProject, KanbanStage, KanbanTask } from "@aether/core-engine";
import { RetainerBurnHeader } from "./RetainerBurnHeader";
import { CaretLeft, CaretRight, Play } from "@phosphor-icons/react";

interface Props {
  tasks: KanbanTask[];
  projects: ChronosProject[];
  onMoveTask: (taskId: string, targetStage: KanbanStage) => void;
  onStartTimerOnTask: (task: KanbanTask) => void;
}

const STAGES: { id: KanbanStage; label: string }[] = [
  { id: "BACKLOG", label: "Backlog" },
  { id: "UI_UX_DESIGN", label: "UI/UX Design" },
  { id: "WP_PHP_DEV", label: "WP & PHP Dev" },
  { id: "STAGING_REVIEW", label: "Staging QA" },
  { id: "LIVE_PRODUCTION", label: "Live Production" },
];

export const KanbanWorkflowView: React.FC<Props> = ({
  tasks,
  projects,
  onMoveTask,
  onStartTimerOnTask,
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<KanbanStage | null>(null);

  const getNextStage = (curr: KanbanStage, dir: -1 | 1): KanbanStage | null => {
    const idx = STAGES.findIndex((s) => s.id === curr);
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= STAGES.length) return null;
    return STAGES[targetIdx]!.id;
  };

  const priorityColors = {
    LOW: "bg-chronos-elevated text-chronos-muted border border-white/[0.06]",
    MEDIUM: "bg-emerald-500/10 text-chronos-green border border-emerald-500/25",
    HIGH: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
    CRITICAL: "bg-red-500/10 text-red-400 border border-red-500/30 font-bold",
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStage: KanbanStage) => {
    e.preventDefault();
    const droppedId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    setDragOverStage(null);
    setDraggedTaskId(null);
    if (droppedId) {
      onMoveTask(droppedId, targetStage);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <RetainerBurnHeader projects={projects} />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start">
        {STAGES.map((col) => {
          const colTasks = tasks.filter((t) => t.stage === col.id);
          const isDropTarget = dragOverStage === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragOverStage !== col.id) setDragOverStage(col.id);
              }}
              onDragLeave={() => {
                if (dragOverStage === col.id) setDragOverStage(null);
              }}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`bg-chronos-tray rounded-[20px] p-1.5 border transition-all duration-200 ${
                isDropTarget
                  ? "border-chronos-green ring-2 ring-emerald-500/35"
                  : "border-white/[0.08]"
              }`}
            >
              <div className="bg-chronos-card rounded-[14px] p-3 border border-white/[0.06] flex flex-col space-y-3 min-h-[450px]">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                  <span className="font-display font-bold text-chronos-ink text-xs tracking-tight">
                    {col.label}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-chronos-recessed text-chronos-muted border border-white/[0.06] tabular-nums">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[550px]">
                  {colTasks.length === 0 ? (
                    <div
                      className={`h-32 rounded-[12px] border border-dashed flex items-center justify-center p-4 text-center text-[11px] transition-colors ${
                        isDropTarget
                          ? "border-chronos-green bg-emerald-500/10 text-chronos-green"
                          : "border-white/[0.1] bg-chronos-recessed text-chronos-dim"
                      }`}
                    >
                      Drop task here to move into {col.label}
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const proj = projects.find((p) => p.id === task.projectId);
                      const prev = getNextStage(task.stage, -1);
                      const next = getNextStage(task.stage, 1);
                      const isBeingDragged = draggedTaskId === task.id;

                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => {
                            setDraggedTaskId(task.id);
                            e.dataTransfer.setData("text/plain", task.id);
                            e.dataTransfer.effectAllowed = "move";
                          }}
                          onDragEnd={() => {
                            setDraggedTaskId(null);
                            setDragOverStage(null);
                          }}
                          className={`p-3 bg-chronos-recessed rounded-[12px] border border-white/[0.06] hover:border-white/[0.16] transition-all duration-200 space-y-2.5 cursor-grab active:cursor-grabbing ${
                            isBeingDragged ? "opacity-50 scale-[0.98]" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-mono text-chronos-green font-bold">
                              {proj?.code}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                              {task.priority}
                            </span>
                          </div>

                          <h3 className="font-sans font-bold text-chronos-ink text-xs leading-snug">
                            {task.title}
                          </h3>
                          <p className="text-[11px] font-sans text-chronos-muted line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>

                          <div className="flex items-center justify-between text-[11px] text-chronos-muted pt-2 border-t border-white/[0.06]">
                            <span>{task.assigneeName}</span>
                            <span className="font-mono tabular-nums font-bold text-chronos-ink">
                              {task.loggedHours}h / {task.estimatedHours}h
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-0.5">
                            <div className="flex items-center space-x-1">
                              {prev && (
                                <button
                                  type="button"
                                  onClick={() => onMoveTask(task.id, prev)}
                                  aria-label={`Move ${task.title} left`}
                                  className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded-[8px] bg-chronos-card hover:bg-chronos-elevated text-chronos-muted hover:text-chronos-ink border border-white/[0.06] transition-colors"
                                  title="Move Left"
                                >
                                  <CaretLeft size={12} weight="bold" />
                                </button>
                              )}
                              {next && (
                                <button
                                  type="button"
                                  onClick={() => onMoveTask(task.id, next)}
                                  aria-label={`Move ${task.title} right`}
                                  className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded-[8px] bg-chronos-card hover:bg-chronos-elevated text-chronos-muted hover:text-chronos-ink border border-white/[0.06] transition-colors"
                                  title="Move Right"
                                >
                                  <CaretRight size={12} weight="bold" />
                                </button>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => onStartTimerOnTask(task)}
                              className="px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-chronos-green border border-emerald-500/30 text-[11px] font-semibold flex items-center space-x-1 transition-all duration-200 ease-spring active:scale-[0.98]"
                            >
                              <Play size={10} weight="fill" />
                              <span>Track</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
