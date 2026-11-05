import React from "react";
import { GarageDoorConfig, PoolConfig } from "@aether/core-engine";
import { GarageMaterials } from "./GarageMaterials";
import { PoolMaterials } from "./PoolMaterials";

interface MaterialsTabProps {
  productType: "GARAGE_DOOR" | "LUXURY_POOL";
  garageConfig: GarageDoorConfig;
  onGarageChange: (updated: Partial<GarageDoorConfig>) => void;
  poolConfig: PoolConfig;
  onPoolChange: (updated: Partial<PoolConfig>) => void;
}

export const MaterialsTab: React.FC<MaterialsTabProps> = ({
  productType,
  garageConfig,
  onGarageChange,
  poolConfig,
  onPoolChange,
}) => {
  return productType === "GARAGE_DOOR" ? (
    <GarageMaterials config={garageConfig} onChange={onGarageChange} />
  ) : (
    <PoolMaterials config={poolConfig} onChange={onPoolChange} />
  );
};
