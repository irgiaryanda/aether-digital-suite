import React, { useMemo, useState } from "react";
import {
  ContractorProfile,
  PointsLedgerEntry,
  RewardCatalogItem,
  WpSyncTelemetry,
  aetherStorage,
  wpRestClient,
} from "@aether/core-engine";
import { Header } from "./components/Header";
import { SkuSwitcherView } from "./components/SkuSwitcherView";
import { LoyaltyPortalView } from "./components/LoyaltyPortalView";
import { TradeCatalogView } from "./components/TradeCatalogView";
import { WpInspectorDrawer } from "./components/WpInspectorDrawer";

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<"sku-switch" | "loyalty-claims" | "trade-catalog">("sku-switch");

  const initialState = useMemo(() => aetherStorage.getState(), []);

  const [contractor, setContractor] = useState<ContractorProfile>(initialState.volt.contractor);
  const [ledger, setLedger] = useState<PointsLedgerEntry[]>(initialState.volt.ledger);
  const [rewards, setRewards] = useState<RewardCatalogItem[]>(initialState.volt.rewards);
  const [isWpInspectorOpen, setIsWpInspectorOpen] = useState(false);
  const [syncTelemetry, setSyncTelemetry] = useState<WpSyncTelemetry | null>(() =>
    wpRestClient.getLastSyncTelemetry("voltswitch")
  );

  const handleResetDemoData = () => {
    const fresh = aetherStorage.resetToBaselineFixtures();
    setContractor(fresh.volt.contractor);
    setLedger(fresh.volt.ledger);
    setRewards(fresh.volt.rewards);
  };

  const handleLedgerUpdate = (entry: PointsLedgerEntry, updatedContractor: ContractorProfile) => {
    setContractor(updatedContractor);
    setLedger((prev) => [entry, ...prev]);

    aetherStorage.setState((current) => ({
      ...current,
      volt: {
        ...current.volt,
        contractor: updatedContractor,
        ledger: [entry, ...current.volt.ledger],
      },
    }));
  };

  const refreshTelemetry = () => {
    setSyncTelemetry(wpRestClient.getLastSyncTelemetry("voltswitch"));
  };

  const liveWpPayload = useMemo(() => {
    const latestClaim = ledger.find((e) => e.referenceType === "INVOICE_CLAIM");
    return {
      contractor_id: contractor.contractorId,
      company: contractor.companyName,
      abn: contractor.abn,
      tier: contractor.tier,
      current_balance: contractor.currentPointsBalance,
      last_transaction: latestClaim ?? ledger[0],
    };
  }, [contractor, ledger]);

  return (
    <div className="min-h-[100dvh] bg-volt-base text-volt-ink flex flex-col font-sans relative">
      <div className="volt-grain-overlay" aria-hidden="true" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-volt-amber focus:text-volt-base focus:rounded-full focus:text-xs focus:font-bold"
      >
        Skip to main content
      </a>

      <Header
        contractor={contractor}
        activeView={activeView}
        onViewChange={setActiveView}
        onResetDemoData={handleResetDemoData}
        onOpenWpInspector={() => setIsWpInspectorOpen(true)}
      />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === "sku-switch" && <SkuSwitcherView />}
        {activeView === "loyalty-claims" && (
          <LoyaltyPortalView
            contractor={contractor}
            ledger={ledger}
            rewards={rewards}
            onLedgerUpdate={handleLedgerUpdate}
            onSyncComplete={refreshTelemetry}
          />
        )}
        {activeView === "trade-catalog" && <TradeCatalogView />}
      </main>

      <WpInspectorDrawer
        isOpen={isWpInspectorOpen}
        onClose={() => setIsWpInspectorOpen(false)}
        livePayload={liveWpPayload}
        syncTelemetry={syncTelemetry}
      />
    </div>
  );
};
