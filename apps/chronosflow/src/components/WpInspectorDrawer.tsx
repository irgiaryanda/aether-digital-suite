import React, { useState } from "react";
import { CHRONOS_WP_METADATA } from "@aether/core-engine";
import { X, Code, Database, FileText, LockKey } from "@phosphor-icons/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  livePayload: Record<string, unknown>;
}

export const WpInspectorDrawer: React.FC<Props> = ({ isOpen, onClose, livePayload }) => {
  const [tab, setTab] = useState<"rest" | "php" | "sql" | "caps">("rest");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-[#090A0F] text-[#E6EDF3] w-full max-w-xl h-full shadow-2xl border-l border-white/10 flex flex-col font-mono text-xs">
        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-chronos-surface">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-chronos-indigo animate-pulse" />
            <h2 className="font-bold text-xs text-white">WP Agency Portal & Role Inspector</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-white/60 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-white/10 bg-chronos-canvas px-3 pt-2 space-x-1">
          {[
            { id: "rest", label: "WP REST", icon: Code },
            { id: "php", label: "PHP Controller", icon: FileText },
            { id: "sql", label: "SQL Timesheets", icon: Database },
            { id: "caps", label: "WP Roles", icon: LockKey },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id as typeof tab)}
                className={`py-1.5 px-3 rounded-t text-[11px] flex items-center space-x-1 ${
                  isActive ? "bg-[#090A0F] text-chronos-indigo border-t-2 border-chronos-indigo font-bold" : "text-white/60 hover:text-white"
                }`}
              >
                <Icon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {tab === "rest" && (
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] text-white/70">
                <span>Endpoint: <strong className="text-chronos-indigo">{CHRONOS_WP_METADATA.endpoint}</strong></span>
                <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 font-bold">POST 201</span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 uppercase block mb-1">Live Timesheet Dispatch Payload</span>
                <pre className="p-3 bg-chronos-card rounded-lg border border-white/10 overflow-x-auto text-[11px] text-indigo-200">
                  {JSON.stringify(livePayload, null, 2)}
                </pre>
              </div>
              <div>
                <span className="text-[10px] text-white/50 uppercase block mb-1">WP REST Retainer Health Response</span>
                <pre className="p-3 bg-chronos-card rounded-lg border border-white/10 overflow-x-auto text-[11px] text-emerald-300">
                  {JSON.stringify(CHRONOS_WP_METADATA.sampleResponsePayload, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {tab === "php" && (
            <div className="space-y-2">
              <span className="text-[11px] text-white/70 block">
                Class: <code className="text-chronos-indigo">AetherDigital\WP\Rest\ChronosEntriesController</code>
              </span>
              <pre className="p-3 bg-chronos-card rounded-lg border border-white/10 overflow-x-auto text-[11px] text-amber-200">
                {CHRONOS_WP_METADATA.phpSnippet}
              </pre>
            </div>
          )}

          {tab === "sql" && (
            <div className="space-y-2">
              <span className="text-[11px] text-white/70 block">Table: wp_aether_chronos_timesheets</span>
              <pre className="p-3 bg-chronos-card rounded-lg border border-white/10 overflow-x-auto text-[11px] text-blue-200">
                {CHRONOS_WP_METADATA.sqlSchemaSnippet}
              </pre>
            </div>
          )}

          {tab === "caps" && (
            <div className="space-y-2">
              <span className="text-[11px] text-white/70 block font-bold">
                WordPress Custom Capabilities Contract:
              </span>
              <p className="text-[11px] text-white/60">
                Custom roles registered via <code className="text-chronos-indigo">AetherDigital\WP\PostTypes\CustomPostTypes</code>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li><strong className="text-white">agency_pm:</strong> Full publish, edit, and budget hour adjustment on <code className="text-indigo-400">chronos_project</code>.</li>
                <li><strong className="text-white">senior_wp_dev:</strong> Create, edit, and log monotonic timer entries via <code className="text-indigo-400">/wp-json/aether/v1/chronos-entries</code>.</li>
                <li><strong className="text-white">read:</strong> Public read-only access to timesheet summaries.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
