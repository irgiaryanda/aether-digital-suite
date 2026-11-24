import React, { useMemo, useState } from "react";
import {
  AuraQuoteSubmission,
  DEFAULT_GARAGE_CONFIG,
  DEFAULT_POOL_CONFIG,
  GarageDoorConfig,
  PoolConfig,
  WpSyncTelemetry,
  aetherStorage,
  calculateGarageDoorEngineering,
  calculatePoolHydraulics,
  generateGarageDoorBom,
  generatePoolBom,
  wpRestClient,
} from "@aether/core-engine";
import { Header } from "./components/Header";
import { AuraVisualizer } from "./components/AuraVisualizer";
import { ConfiguratorPanel } from "./components/ConfiguratorPanel";
import { QuoteWizard } from "./components/QuoteWizard";
import { SavedQuotesDrawer } from "./components/SavedQuotesDrawer";
import { WpInspectorDrawer } from "./components/WpInspectorDrawer";
import { PrintableSpecSheet } from "./components/PrintableSpecSheet";

export const App: React.FC = () => {
  const [productType, setProductType] = useState<"GARAGE_DOOR" | "LUXURY_POOL">("GARAGE_DOOR");

  const initialState = useMemo(() => aetherStorage.getState(), []);

  const [garageConfig, setGarageConfig] = useState<GarageDoorConfig>(
    initialState.aura.draftGarageConfig ?? DEFAULT_GARAGE_CONFIG
  );
  const [poolConfig, setPoolConfig] = useState<PoolConfig>(
    initialState.aura.draftPoolConfig ?? DEFAULT_POOL_CONFIG
  );
  const [savedQuotes, setSavedQuotes] = useState<AuraQuoteSubmission[]>(
    initialState.aura.quotes ?? []
  );

  const [isQuoteWizardOpen, setIsQuoteWizardOpen] = useState(false);
  const [isSavedQuotesOpen, setIsSavedQuotesOpen] = useState(false);
  const [isWpInspectorOpen, setIsWpInspectorOpen] = useState(false);
  const [syncTelemetry, setSyncTelemetry] = useState<WpSyncTelemetry | null>(() =>
    wpRestClient.getLastSyncTelemetry("aurabuild")
  );

  const garageEngineering = useMemo(() => calculateGarageDoorEngineering(garageConfig), [garageConfig]);
  const garageBom = useMemo(() => generateGarageDoorBom(garageConfig, garageEngineering), [garageConfig, garageEngineering]);

  const poolHydraulics = useMemo(() => calculatePoolHydraulics(poolConfig), [poolConfig]);
  const poolBom = useMemo(() => generatePoolBom(poolConfig, poolHydraulics), [poolConfig, poolHydraulics]);

  const handleGarageChange = (updated: Partial<GarageDoorConfig>) => {
    setGarageConfig((prev) => {
      const next = { ...prev, ...updated };
      aetherStorage.setState((cur) => ({ ...cur, aura: { ...cur.aura, draftGarageConfig: next } }));
      return next;
    });
  };

  const handlePoolChange = (updated: Partial<PoolConfig>) => {
    setPoolConfig((prev) => {
      const next = { ...prev, ...updated };
      aetherStorage.setState((cur) => ({ ...cur, aura: { ...cur.aura, draftPoolConfig: next } }));
      return next;
    });
  };

  const handleResetDemoData = () => {
    const fresh = aetherStorage.resetToBaselineFixtures();
    setGarageConfig(fresh.aura.draftGarageConfig);
    setPoolConfig(fresh.aura.draftPoolConfig);
    setSavedQuotes(fresh.aura.quotes);
  };

  const liveWpPayload = useMemo(() => {
    return productType === "GARAGE_DOOR"
      ? {
          customer_name: "Julian Vance",
          product_type: "GARAGE_DOOR",
          postcode: garageConfig.postcode,
          engineering_summary: garageEngineering,
          bom: garageBom,
        }
      : {
          customer_name: "Camilla Sterling",
          product_type: "LUXURY_POOL",
          postcode: poolConfig.postcode,
          hydraulics_summary: poolHydraulics,
          bom: poolBom,
        };
  }, [productType, garageConfig, garageEngineering, garageBom, poolConfig, poolHydraulics, poolBom]);

  return (
    <div className="min-h-[100dvh] bg-aura-bg text-aura-text flex flex-col font-sans relative">
      <div className="aura-grain-overlay" aria-hidden="true" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-full focus:bg-aura-text focus:text-white focus:text-xs focus:font-semibold"
      >
        Skip to studio configurator
      </a>

      <Header
        productType={productType}
        onProductTypeChange={setProductType}
        onResetDemoData={handleResetDemoData}
        onOpenSavedQuotes={() => setIsSavedQuotesOpen(true)}
        onOpenWpInspector={() => setIsWpInspectorOpen(true)}
        onOpenQuoteWizard={() => setIsQuoteWizardOpen(true)}
        savedQuotesCount={savedQuotes.length}
      />

      <main id="main-content" className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 print:hidden">
        <div className="mb-6 max-w-2xl">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-aura-text leading-tight">
            {productType === "GARAGE_DOOR"
              ? "Architectural Sectional Door Configurator"
              : "Cantilevered Concrete Pool Configurator"}
          </h1>
          <p className="text-sm text-aura-text-muted mt-1.5 leading-relaxed">
            {productType === "GARAGE_DOOR"
              ? "Configure opening dimensions, AS/NZS 4505 wind bracing, cladding finishes, and GST pricing in real time."
              : "Specify basin geometry, AS 1926 hydraulic turnover sizing, stone coping, and itemized GST pricing."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 xl:col-span-8 lg:sticky lg:top-24">
            <AuraVisualizer
              productType={productType}
              garageConfig={garageConfig}
              garageEngineering={garageEngineering}
              poolConfig={poolConfig}
              poolHydraulics={poolHydraulics}
            />
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <ConfiguratorPanel
              productType={productType}
              garageConfig={garageConfig}
              garageEngineering={garageEngineering}
              garageBom={garageBom}
              onGarageChange={handleGarageChange}
              poolConfig={poolConfig}
              poolHydraulics={poolHydraulics}
              poolBom={poolBom}
              onPoolChange={handlePoolChange}
              onOpenQuoteWizard={() => setIsQuoteWizardOpen(true)}
            />
          </div>
        </div>
      </main>

      <PrintableSpecSheet
        productType={productType}
        garageConfig={garageConfig}
        garageEngineering={garageEngineering}
        garageBom={garageBom}
        poolConfig={poolConfig}
        poolHydraulics={poolHydraulics}
        poolBom={poolBom}
      />

      <QuoteWizard
        isOpen={isQuoteWizardOpen}
        onClose={() => setIsQuoteWizardOpen(false)}
        productType={productType}
        garageConfig={garageConfig}
        garageEngineering={garageEngineering}
        garageBom={garageBom}
        poolConfig={poolConfig}
        poolHydraulics={poolHydraulics}
        poolBom={poolBom}
        onQuoteSubmitted={(q) => setSavedQuotes((prev) => [q, ...prev])}
        onSyncComplete={() => setSyncTelemetry(wpRestClient.getLastSyncTelemetry("aurabuild"))}
      />

      <SavedQuotesDrawer
        isOpen={isSavedQuotesOpen}
        onClose={() => setIsSavedQuotesOpen(false)}
        quotes={savedQuotes}
      />

      <WpInspectorDrawer
        isOpen={isWpInspectorOpen}
        onClose={() => setIsWpInspectorOpen(false)}
        livePayload={liveWpPayload}
        syncTelemetry={syncTelemetry}
      />
    </div>
  );
};
