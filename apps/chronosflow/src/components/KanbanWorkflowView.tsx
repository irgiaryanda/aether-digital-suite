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
    LOW: "text-gray-400 bg-gray-800",
    MEDIUM: "text-cyan-400 bg-cyan-950",
    HIGH: "text-amber-400 bg-amber-950",
    CRITICAL: "text-red-400 bg-red-950 font-bold",
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
    <div className="space-y-6 font-mono text-xs">
      <RetainerBurnHeader projects={projects} />

      {/* 5-Column Drag-and-Drop Kanban Board */}
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
              className={`bg-chronos-surface border rounded-xl p-3 flex flex-col space-y-3 min-h-[450px] transition-all ${
                isDropTarget
                  ? "border-chronos-indigo ring-2 ring-chronos-indigo/50 bg-indigo-500/5"
                  : "border-white/10"
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-white text-[11px] uppercase tracking-wide">
                  {col.label}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-chronos-card text-gray-400 tabular-nums">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[550px]">
                {colTasks.map((task) => {
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
                      className={`p-3 bg-chronos-card rounded-lg border border-white/5 hover:border-white/20 transition-all space-y-2 shadow cursor-grab active:cursor-grabbing ${
                        isBeingDragged ? "opacity-50 scale-[0.98]" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-chronos-indigo font-bold">{proj?.code}</span>
                        <span className={`text-[9px] px-1 py-0.2 rounded ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-xs leading-snug font-sans">
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-sans line-clamp-2">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-white/5">
                        <span>{task.assigneeName}</span>
                        <span className="tabular-nums font-bold text-white">
                          {task.loggedHours}h / {task.estimatedHours}h
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center space-x-1">
                          {prev && (
                            <button
                              type="button"
                              onClick={() => onMoveTask(task.id, prev)}
                              aria-label={`Move ${task.title} left`}
                              className="p-1.5 rounded bg-chronos-canvas hover:bg-white/10 text-gray-400 hover:text-white"
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
                              className="p-1.5 rounded bg-chronos-canvas hover:bg-white/10 text-gray-400 hover:text-white"
                              title="Move Right"
                            >
                              <CaretRight size={12} weight="bold" />
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onStartTimerOnTask(task)}
                          className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center space-x-1"
                        >
                          <Play size={10} weight="fill" />
                          <span>Track</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
