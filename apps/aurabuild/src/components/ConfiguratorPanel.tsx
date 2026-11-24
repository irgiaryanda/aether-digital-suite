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
import { ArrowRight, Sliders, Palette, ShieldCheck, Receipt } from "@phosphor-icons/react";

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
    { id: "dimensions", label: "Size", icon: Sliders },
    { id: "materials", label: "Finish", icon: Palette },
    { id: "engineering", label: "Spec", icon: ShieldCheck },
    { id: "pricing", label: "BOM", icon: Receipt },
  ] as const;

  return (
    <div className="bg-aura-tray p-1.5 rounded-[24px] border border-[#DCE2EA] shadow-[0_14px_40px_-14px_rgba(17,20,24,0.09)]">
      <div className="bg-white rounded-[18px] border border-aura-border shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] flex flex-col overflow-hidden">
        <div className="p-2 border-b border-aura-border bg-aura-subtle/60">
          <div className="grid grid-cols-4 gap-1 bg-aura-tray p-1 rounded-full border border-aura-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-2 rounded-full text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all duration-300 ease-spring active:scale-[0.98] ${
                    isActive
                      ? "bg-white text-aura-cyan shadow-sm border border-aura-border font-bold"
                      : "text-aura-text-muted hover:text-aura-text"
                  }`}
                >
                  <Icon size={14} weight={isActive ? "bold" : "regular"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
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

        <div className="px-5 py-4 border-t border-aura-border bg-aura-subtle/70 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-medium text-aura-text-dim block">
              Estimated Total inc. 10% GST
            </span>
            <span className="text-lg font-bold text-aura-cyan font-mono tabular-nums tracking-tight">
              ${activeBom.totalIncGstAud.toLocaleString(undefined, { minimumFractionDigits: 2 })} AUD
            </span>
          </div>

          {activeTab !== "pricing" && (
            <button
              type="button"
              onClick={() => setActiveTab("pricing")}
              className="group min-h-[38px] pl-4 pr-1.5 py-1.5 rounded-full bg-aura-text hover:bg-[#22272F] text-white text-xs font-semibold whitespace-nowrap transition-all duration-300 ease-spring active:scale-[0.98] flex items-center space-x-2"
            >
              <span>Review BOM</span>
              <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-300 ease-spring group-hover:translate-x-0.5">
                <ArrowRight size={12} weight="bold" />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
