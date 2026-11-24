import React, { useEffect, useState } from "react";
import { AURA_WP_METADATA, WpSyncTelemetry } from "@aether/core-engine";
import { X, Code, Database, FileText, CheckCircle } from "@phosphor-icons/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  livePayload: Record<string, unknown>;
  syncTelemetry?: WpSyncTelemetry | null;
}

export const WpInspectorDrawer: React.FC<Props> = ({ isOpen, onClose, livePayload, syncTelemetry }) => {
  const [tab, setTab] = useState<"rest" | "php" | "sql" | "acf">("rest");

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
        aria-labelledby="aura-wp-inspector-title"
        className="bg-[#0D1015] text-[#E6EDF3] w-full max-w-xl h-full shadow-2xl border-l border-white/10 flex flex-col font-mono text-xs"
      >
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-[#131720]">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h2 id="aura-wp-inspector-title" className="font-bold text-xs text-white font-sans tracking-tight">
              WordPress PHP & ACF Architecture Inspector
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close WordPress Inspector Drawer"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center p-1 rounded-[10px] text-white/60 hover:text-white hover:bg-white/5 transition-colors duration-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-white/10 bg-[#131720]/80 px-3 pt-2 space-x-1">
          {[
            { id: "rest", label: "WP REST", icon: Code },
            { id: "php", label: "PHP Controller", icon: FileText },
            { id: "sql", label: "SQL Schema", icon: Database },
            { id: "acf", label: "ACF Schema", icon: CheckCircle },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id as typeof tab)}
                className={`py-1.5 px-3 rounded-t-[10px] text-[11px] font-sans flex items-center space-x-1.5 transition-colors duration-200 ${
                  isActive ? "bg-[#0D1015] text-cyan-400 border-t-2 border-cyan-400 font-bold" : "text-white/60 hover:text-white"
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
            <div className="p-3 rounded-[10px] bg-[#131720] border border-cyan-500/30 flex items-center justify-between text-[11px]">
              <span>
                Transport: <strong className="text-cyan-300">{syncTelemetry.mode}</strong>
              </span>
              <span className="text-emerald-400 tabular-nums">
                HTTP {syncTelemetry.status} &middot; {syncTelemetry.latencyMs}ms
              </span>
            </div>
          )}

          {tab === "rest" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-white/70">
                <span>Endpoint: <strong className="text-cyan-400">{AURA_WP_METADATA.endpoint}</strong></span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  POST 201
                </span>
              </div>
              <div>
                <span className="text-[11px] text-white/55 font-sans block mb-1.5">Live Configurator Payload</span>
                <pre className="p-3.5 bg-[#131720] rounded-[12px] border border-white/10 overflow-x-auto text-[11px] leading-relaxed text-cyan-200">
                  {JSON.stringify(livePayload, null, 2)}
                </pre>
              </div>
              <div>
                <span className="text-[11px] text-white/55 font-sans block mb-1.5">WP REST Response Schema</span>
                <pre className="p-3.5 bg-[#131720] rounded-[12px] border border-white/10 overflow-x-auto text-[11px] leading-relaxed text-emerald-300">
                  {JSON.stringify(AURA_WP_METADATA.sampleResponsePayload, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {tab === "php" && (
            <div className="space-y-2">
              <span className="text-[11px] text-white/70 block">
                Class: <code className="text-cyan-400">AetherDigital\WP\Rest\AuraQuotesController</code>
              </span>
              <pre className="p-3.5 bg-[#131720] rounded-[12px] border border-white/10 overflow-x-auto text-[11px] leading-relaxed text-amber-200">
                {AURA_WP_METADATA.phpSnippet}
              </pre>
            </div>
          )}

          {tab === "sql" && (
            <div className="space-y-2">
              <span className="text-[11px] text-white/70 block">Storage Model: wp_posts + wp_postmeta</span>
              <pre className="p-3.5 bg-[#131720] rounded-[12px] border border-white/10 overflow-x-auto text-[11px] leading-relaxed text-cyan-100">
                {AURA_WP_METADATA.sqlSchemaSnippet}
              </pre>
            </div>
          )}

          {tab === "acf" && (
            <div className="space-y-2">
              <span className="text-[11px] text-white/70 block">
                ACF Group: <code className="text-cyan-400">{AURA_WP_METADATA.acfFieldGroupId}</code>
              </span>
              <pre className="p-3.5 bg-[#131720] rounded-[12px] border border-white/10 overflow-x-auto text-[11px] leading-relaxed text-cyan-200">
                {`{
  "key": "group_aura_configurator",
  "title": "AuraBuild Specifications",
  "fields": [
    { "key": "field_aura_product_type", "name": "_aura_product_type" },
    { "key": "field_aura_postcode", "name": "_aura_postcode" },
    { "key": "field_aura_engineering", "name": "_aura_engineering" },
    { "key": "field_aura_bom", "name": "_aura_bom" },
    { "key": "field_aura_total_aud", "name": "_aura_total_aud" },
    { "key": "field_aura_status", "name": "_aura_status" }
  ]
}`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
