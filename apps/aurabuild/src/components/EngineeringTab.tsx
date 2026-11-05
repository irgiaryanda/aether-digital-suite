import React from "react";
import {
  GarageDoorConfig,
  GarageDoorEngineering,
  PoolConfig,
  PoolHydraulics,
  resolvePostcode,
} from "@aether/core-engine";
import { GarageEngineeringView } from "./GarageEngineeringView";
import { PoolEngineeringView } from "./PoolEngineeringView";

interface EngineeringTabProps {
  productType: "GARAGE_DOOR" | "LUXURY_POOL";
  garageConfig: GarageDoorConfig;
  garageEngineering: GarageDoorEngineering;
  onGarageChange: (updated: Partial<GarageDoorConfig>) => void;
  poolConfig: PoolConfig;
  poolHydraulics: PoolHydraulics;
  onPoolChange: (updated: Partial<PoolConfig>) => void;
}

export const EngineeringTab: React.FC<EngineeringTabProps> = ({
  productType,
  garageConfig,
  garageEngineering,
  onGarageChange,
  poolConfig,
  poolHydraulics,
  onPoolChange,
}) => {
  const currentPostcode = productType === "GARAGE_DOOR" ? garageConfig.postcode : poolConfig.postcode;
  const resolution = resolvePostcode(currentPostcode);

  const handlePostcodeChange = (newCode: string) => {
    const cleaned = newCode.replace(/\D/g, "").slice(0, 4);
    if (productType === "GARAGE_DOOR") {
      onGarageChange({ postcode: cleaned });
    } else {
      onPoolChange({ postcode: cleaned });
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-aura-subtle rounded-xl border border-aura-border">
        <label className="text-xs font-semibold text-aura-text block mb-1">
          Australian Site Postcode (AS/NZS 4505:2012)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={currentPostcode}
            onChange={(e) => handlePostcodeChange(e.target.value)}
            placeholder="e.g. 2088"
            maxLength={4}
            className="w-20 px-2.5 py-1 bg-white border border-aura-border rounded-lg text-xs font-bold font-mono tabular-nums text-aura-text focus:border-aura-cyan focus:outline-none"
          />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-aura-text block truncate">{resolution.suburb}</span>
            <span className="text-[11px] text-aura-cyan font-medium block">
              {resolution.state} &middot; {resolution.regionDescription}
            </span>
          </div>
        </div>
      </div>

      {productType === "GARAGE_DOOR" ? (
        <GarageEngineeringView config={garageConfig} engineering={garageEngineering} />
      ) : (
        <PoolEngineeringView config={poolConfig} hydraulics={poolHydraulics} />
      )}
    </div>
  );
};
