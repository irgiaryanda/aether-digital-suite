import React, { useEffect, useState } from "react";
import { VOLT_WP_METADATA, WpSyncTelemetry } from "@aether/core-engine";
import { X, Code, Database, FileText, ShoppingCart } from "@phosphor-icons/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  livePayload: Record<string, unknown>;
  syncTelemetry?: WpSyncTelemetry | null;
}

export const WpInspectorDrawer: React.FC<Props> = ({ isOpen, onClose, livePayload, syncTelemetry }) => {
  const [tab, setTab] = useState<"rest" | "php" | "sql" | "hpos">("rest");

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
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="volt-wp-inspector-title"
        className="bg-volt-base text-[#E6EDF3] w-full max-w-xl h-full shadow-2xl border-l border-white/[0.1] flex flex-col font-mono text-xs"
      >
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between bg-volt-tray">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-volt-amber" />
            <h2 id="volt-wp-inspector-title" className="font-bold text-xs text-white font-sans tracking-tight">
              WooCommerce HPOS & WP Inspector
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close WooCommerce Inspector Drawer"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center p-1 rounded-[10px] text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-white/[0.08] bg-volt-tray/60 px-3 pt-2 space-x-1">
          {[
            { id: "rest", label: "WP REST", icon: Code },
            { id: "php", label: "PHP Controller", icon: FileText },
            { id: "sql", label: "SQL Ledger", icon: Database },
            { id: "hpos", label: "Woo HPOS", icon: ShoppingCart },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id as typeof tab)}
                className={`py-1.5 px-3 rounded-t-[10px] text-[11px] font-sans flex items-center space-x-1.5 transition-colors duration-200 ${
                  isActive ? "bg-volt-base text-volt-amber border-t-2 border-volt-amber font-bold" : "text-white/60 hover:text-white"
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
            <div className="p-3 rounded-[10px] bg-volt-tray border border-amber-500/30 flex items-center justify-between text-[11px]">
              <span>
                Transport: <strong className="text-volt-amber">{syncTelemetry.mode}</strong>
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
                  Endpoint: <strong className="text-volt-amber">{VOLT_WP_METADATA.endpoint}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-bold">
                  POST 201
                </span>
              </div>
              <div>
                <span className="text-[11px] text-white/50 font-sans block mb-1.5">Live Claim Payload</span>
                <pre className="p-3.5 bg-volt-tray rounded-[12px] border border-white/[0.08] overflow-x-auto text-[11px] text-amber-200">
                  {JSON.stringify(livePayload, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {tab === "php" && (
            <div className="space-y-2">
              <span className="text-[11px] text-white/70 block">
                Class: <code className="text-volt-amber">AetherDigital\WP\Rest\VoltClaimsController</code>
              </span>
              <pre className="p-3.5 bg-volt-tray rounded-[12px] border border-white/[0.08] overflow-x-auto text-[11px] text-amber-200">
                {VOLT_WP_METADATA.phpSnippet}
              </pre>
            </div>
          )}

          {tab === "sql" && (
            <div className="space-y-2">
              <span className="text-[11px] text-white/70 block">Table: wp_aether_reward_ledger</span>
              <pre className="p-3.5 bg-volt-tray rounded-[12px] border border-white/[0.08] overflow-x-auto text-[11px] text-emerald-200">
                {VOLT_WP_METADATA.sqlSchemaSnippet}
              </pre>
            </div>
          )}

          {tab === "hpos" && (
            <div className="space-y-2">
              <span className="text-[11px] text-white/70 block">
                Hook: <code className="text-volt-amber">woocommerce_order_status_completed</code>
              </span>
              <pre className="p-3.5 bg-volt-tray rounded-[12px] border border-white/[0.08] overflow-x-auto text-[11px] text-amber-100">
                {`public static function handle_completed_order(int $order_id): void {
    $order = wc_get_order($order_id);
    $subtotal = floatval($order->get_subtotal());
    $points = intval(floor($subtotal * $multiplier));

    $wpdb->insert("{$wpdb->prefix}aether_reward_ledger", [
        'contractor_id'  => $customer_id,
        'points_delta'   => $points,
        'reference_type' => 'WOOCOMMERCE_ORDER',
        'reference_id'   => (string) $order_id,
    ]);
}`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
