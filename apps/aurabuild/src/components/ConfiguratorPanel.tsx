import React, { useState } from "react";
import {
  BillOfMaterials,
  GarageDoorConfig,
  GarageDoorEngineering,
  PoolConfig,
  PoolHydraulics,
} from "@aether/core-engine";
import { DimensionsTab } from "./DimensionsTab";
import { MaterialsTab } from "./MaterialsTab";
import { EngineeringTab } from "./EngineeringTab";
import { BomTab } from "./BomTab";
import { Sliders, Palette, ShieldCheck, Receipt } from "@phosphor-icons/react";

interface ConfiguratorPanelProps {
  productType: "GARAGE_DOOR" | "LUXURY_POOL";
  garageConfig: GarageDoorConfig;
  garageEngineering: GarageDoorEngineering;
  garageBom: BillOfMaterials;
  onGarageChange: (updated: Partial<GarageDoorConfig>) => void;
  poolConfig: PoolConfig;
  poolHydraulics: PoolHydraulics;
  poolBom: BillOfMaterials;
  onPoolChange: (updated: Partial<PoolConfig>) => void;
  onOpenQuoteWizard: () => void;
}

export const ConfiguratorPanel: React.FC<ConfiguratorPanelProps> = ({
  productType,
  garageConfig,
  garageEngineering,
  garageBom,
  onGarageChange,
  poolConfig,
  poolHydraulics,
  poolBom,
  onPoolChange,
  onOpenQuoteWizard,
}) => {
  const [activeTab, setActiveTab] = useState<"dimensions" | "materials" | "engineering" | "pricing">(
    "dimensions"
  );

  const activeBom = productType === "GARAGE_DOOR" ? garageBom : poolBom;

  const tabs = [
    { id: "dimensions", label: "Dimensions", icon: Sliders },
    { id: "materials", label: "Finishes", icon: Palette },
    { id: "engineering", label: "Engineering", icon: ShieldCheck },
    { id: "pricing", label: "BOM & Quote", icon: Receipt },
  ] as const;

  return (
    <div className="bg-white rounded-xl border border-aura-border shadow-sm flex flex-col h-full overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-aura-border bg-aura-subtle p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                isActive
                  ? "bg-white text-aura-cyan shadow-sm border border-aura-border font-bold"
                  : "text-aura-text-muted hover:text-aura-text hover:bg-white/50"
              }`}
            >
              <Icon size={14} weight={isActive ? "bold" : "regular"} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Body */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
        {activeTab === "dimensions" && (
          <DimensionsTab
            productType={productType}
            garageConfig={garageConfig}
            onGarageChange={onGarageChange}
            poolConfig={poolConfig}
            onPoolChange={onPoolChange}
          />
        )}

        {activeTab === "materials" && (
          <MaterialsTab
            productType={productType}
            garageConfig={garageConfig}
            onGarageChange={onGarageChange}
            poolConfig={poolConfig}
            onPoolChange={onPoolChange}
          />
        )}

        {activeTab === "engineering" && (
          <EngineeringTab
            productType={productType}
            garageConfig={garageConfig}
            garageEngineering={garageEngineering}
            onGarageChange={onGarageChange}
            poolConfig={poolConfig}
            poolHydraulics={poolHydraulics}
            onPoolChange={onPoolChange}
          />
        )}

        {activeTab === "pricing" && (
          <BomTab bom={activeBom} onOpenQuoteWizard={onOpenQuoteWizard} />
        )}
      </div>

      {/* Sticky Bottom Pricing Summary Bar */}
      <div className="px-5 py-3 border-t border-aura-border bg-aura-subtle flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-aura-text-dim block">
            Estimated Investment
          </span>
          <span className="text-base font-bold text-aura-cyan font-mono tabular-nums">
            ${activeBom.totalIncGstAud.toLocaleString(undefined, { minimumFractionDigits: 2 })} AUD
          </span>
          <span className="text-[10px] text-aura-text-dim block">Includes 10% Australian GST</span>
        </div>

        {activeTab !== "pricing" && (
          <button
            type="button"
            onClick={() => setActiveTab("pricing")}
            className="px-3 py-1.5 rounded-lg bg-white border border-aura-border text-xs font-semibold text-aura-text hover:text-aura-cyan hover:border-aura-cyan transition-colors"
          >
            Review BOM &rarr;
          </button>
        )}
      </div>
    </div>
  );
};
