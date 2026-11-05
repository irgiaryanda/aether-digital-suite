import React, { useState } from "react";
import { VOLT_WP_METADATA } from "@aether/core-engine";
import { X, Code, Database, FileText, ShoppingCart } from "@phosphor-icons/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  livePayload: Record<string, unknown>;
}

export const WpInspectorDrawer: React.FC<Props> = ({ isOpen, onClose, livePayload }) => {
  const [tab, setTab] = useState<"rest" | "php" | "sql" | "hpos">("rest");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-[#0B0F19] text-[#E6EDF3] w-full max-w-xl h-full shadow-2xl border-l border-white/10 flex flex-col font-mono text-xs">
        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-volt-surface">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-volt-amber animate-pulse" />
            <h2 className="font-bold text-xs text-white">WooCommerce HPOS & WP Inspector</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-white/60 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-white/10 bg-volt-base px-3 pt-2 space-x-1">
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
                className={`py-1.5 px-3 rounded-t text-[11px] flex items-center space-x-1 ${
                  isActive ? "bg-[#0B0F19] text-volt-amber border-t-2 border-volt-amber font-bold" : "text-white/60 hover:text-white"
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
                <span>Endpoint: <strong className="text-volt-amber">{VOLT_WP_METADATA.endpoint}</strong></span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-bold">POST 201</span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 uppercase block mb-1">Live Claim Payload</span>
                <pre className="p-3 bg-volt-base rounded-lg border border-white/10 overflow-x-auto text-[11px] text-amber-200">
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
              <pre className="p-3 bg-volt-base rounded-lg border border-white/10 overflow-x-auto text-[11px] text-amber-200">
                {VOLT_WP_METADATA.phpSnippet}
              </pre>
            </div>
          )}

          {tab === "sql" && (
            <div className="space-y-2">
              <span className="text-[11px] text-white/70 block">Table: wp_aether_reward_ledger (Double-Entry)</span>
              <pre className="p-3 bg-volt-base rounded-lg border border-white/10 overflow-x-auto text-[11px] text-blue-200">
                {VOLT_WP_METADATA.sqlSchemaSnippet}
              </pre>
            </div>
          )}

          {tab === "hpos" && (
            <div className="space-y-2">
              <span className="text-[11px] text-white/70 block">
                Hook: <code className="text-volt-amber">woocommerce_order_status_completed</code>
              </span>
              <pre className="p-3 bg-volt-base rounded-lg border border-white/10 overflow-x-auto text-[11px] text-purple-200">
                {`public static function handle_completed_order(int $order_id): void {
    $order = wc_get_order($order_id);
    $subtotal = floatval($order->get_subtotal());
    $points = intval(floor($subtotal * 1.5));

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
