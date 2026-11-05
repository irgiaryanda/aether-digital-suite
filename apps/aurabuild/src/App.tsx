import React, { useMemo, useState } from "react";
import {
  AuraQuoteSubmission,
  DEFAULT_GARAGE_CONFIG,
  DEFAULT_POOL_CONFIG,
  GarageDoorConfig,
  PoolConfig,
  aetherStorage,
  calculateGarageDoorEngineering,
  calculatePoolHydraulics,
  generateGarageDoorBom,
  generatePoolBom,
} from "@aether/core-engine";
import { Header } from "./components/Header";
import { AuraVisualizer } from "./components/AuraVisualizer";
import { ConfiguratorPanel } from "./components/ConfiguratorPanel";
import { QuoteWizard } from "./components/QuoteWizard";
import { SavedQuotesDrawer } from "./components/SavedQuotesDrawer";
import { WpInspectorDrawer } from "./components/WpInspectorDrawer";

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
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1D20] flex flex-col font-sans">
      <Header
        productType={productType}
        onProductTypeChange={setProductType}
        onResetDemoData={handleResetDemoData}
        onOpenSavedQuotes={() => setIsSavedQuotesOpen(true)}
        onOpenWpInspector={() => setIsWpInspectorOpen(true)}
        onOpenQuoteWizard={() => setIsQuoteWizardOpen(true)}
        savedQuotesCount={savedQuotes.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 xl:col-span-8 sticky top-24">
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
      />
    </div>
  );
};
