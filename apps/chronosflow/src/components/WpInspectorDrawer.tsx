import React, { useEffect, useState } from "react";
import { CHRONOS_WP_METADATA, WpSyncTelemetry } from "@aether/core-engine";
import { X, Code, Database, FileText, LockKey } from "@phosphor-icons/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  livePayload: Record<string, unknown>;
  syncTelemetry?: WpSyncTelemetry | null;
}

export const WpInspectorDrawer: React.FC<Props> = ({ isOpen, onClose, livePayload, syncTelemetry }) => {
  const [tab, setTab] = useState<"rest" | "php" | "sql" | "caps">("rest");

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end print:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="chronos-wp-inspector-title"
        className="bg-chronos-canvas text-[#E6EDF3] w-full max-w-xl h-full shadow-2xl border-l border-white/[0.1] flex flex-col font-mono text-xs"
      >
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between bg-chronos-tray">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-chronos-green" />
            <h2 id="chronos-wp-inspector-title" className="font-bold text-xs text-white font-sans tracking-tight">
              WP Agency Portal & Role Inspector
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Agency API Inspector Drawer"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center p-1 rounded-[10px] text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-white/[0.08] bg-chronos-tray/60 px-3 pt-2 space-x-1">
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
                className={`py-1.5 px-3 rounded-t-[10px] text-[11px] font-sans flex items-center space-x-1.5 transition-colors duration-200 ${
                  isActive
                    ? "bg-chronos-canvas text-chronos-green border-t-2 border-chronos-green font-bold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Icon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {syncTelemetry && (
            <div className="p-3 rounded-[10px] bg-chronos-tray border border-emerald-500/30 flex items-center justify-between text-[11px]">
              <span>
                Transport: <strong className="text-chronos-green">{syncTelemetry.mode}</strong>
              </span>
              <span className="text-emerald-400 tabular-nums">
                HTTP {syncTelemetry.status} &middot; {syncTelemetry.latencyMs}ms
              </span>
            </div>
          )}

          {tab === "rest" && (
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] text-white/70">
                <span>
                  Endpoint: <strong className="text-chronos-green">{CHRONOS_WP_METADATA.endpoint}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  POST 201
                </span>
              </div>
              <div>
                <span className="text-[11px] text-white/50 font-sans block mb-1.5">
                  Live Timesheet Dispatch Payload
                </span>
                <pre className="p-3.5 bg-chronos-card rounded-[12px] border border-white/[0.08] overflow-x-auto text-[11px] text-emerald-200">
                  {JSON.stringify(livePayload, null, 2)}
                </pre>
              </div>
              <div>
                <span className="text-[11px] text-white/50 font-sans block mb-1.5">
                  WP REST Retainer Health Response
                </span>
                <pre className="p-3.5 bg-chronos-card rounded-[12px] border border-white/[0.08] overflow-x-auto text-[11px] text-emerald-300">
                  {JSON.stringify(CHRONOS_WP_METADATA.sampleResponsePayload, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {tab === "php" && (
            <div className="space-y-2">
              <span className="text-[11px] text-white/70 block">
                Class: <code className="text-chronos-green">AetherDigital\WP\Rest\ChronosEntriesController</code>
              </span>
              <pre className="p-3.5 bg-chronos-card rounded-[12px] border border-white/[0.08] overflow-x-auto text-[11px] text-amber-200">
                {CHRONOS_WP_METADATA.phpSnippet}
              </pre>
            </div>
          )}

          {tab === "sql" && (
            <div className="space-y-2">
              <span className="text-[11px] text-white/70 block">Table: wp_aether_chronos_timesheets</span>
              <pre className="p-3.5 bg-chronos-card rounded-[12px] border border-white/[0.08] overflow-x-auto text-[11px] text-emerald-200">
                {CHRONOS_WP_METADATA.sqlSchemaSnippet}
              </pre>
            </div>
          )}

          {tab === "caps" && (
            <div className="space-y-2">
              <span className="text-[11px] text-white/70 block font-bold font-sans">
                WordPress Custom Capabilities Contract:
              </span>
              <p className="text-[11px] text-white/60 font-sans">
                Custom roles registered via <code className="font-mono text-chronos-green">AetherDigital\WP\Auth\RolesManager</code>:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-chronos-muted font-sans">
                <li>
                  <strong className="text-white font-mono">agency_pm:</strong> Full publish, edit, and budget hour adjustment on{" "}
                  <code className="font-mono text-chronos-green">chronos_project</code>.
                </li>
                <li>
                  <strong className="text-white font-mono">senior_wp_dev:</strong> Create, edit, and log monotonic timer entries via{" "}
                  <code className="font-mono text-chronos-green">/wp-json/aether/v1/chronos-entries</code>.
                </li>
                <li>
                  <strong className="text-white font-mono">trade_contractor:</strong> Verified access to wholesaler invoice claims and reward redemptions.
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
