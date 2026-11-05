import React from "react";
import { GarageDoorConfig, PoolConfig } from "@aether/core-engine";
import { GarageDimensions } from "./GarageDimensions";
import { PoolDimensions } from "./PoolDimensions";

interface DimensionsTabProps {
  productType: "GARAGE_DOOR" | "LUXURY_POOL";
  garageConfig: GarageDoorConfig;
  onGarageChange: (updated: Partial<GarageDoorConfig>) => void;
  poolConfig: PoolConfig;
  onPoolChange: (updated: Partial<PoolConfig>) => void;
}

export const DimensionsTab: React.FC<DimensionsTabProps> = ({
  productType,
  garageConfig,
  onGarageChange,
  poolConfig,
  onPoolChange,
}) => {
  return productType === "GARAGE_DOOR" ? (
    <GarageDimensions config={garageConfig} onChange={onGarageChange} />
  ) : (
    <PoolDimensions config={poolConfig} onChange={onPoolChange} />
  );
};
