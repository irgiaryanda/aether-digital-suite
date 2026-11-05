import {
  GarageDoorConfig,
  GarageDoorEngineering,
  PoolConfig,
  PoolHydraulics,
  WindRegion,
} from "./types";
import { resolvePostcode } from "./wind-regions";

export function calculateGarageDoorEngineering(config: GarageDoorConfig): GarageDoorEngineering {
  const widthM = config.widthMm / 1000;
  const heightM = config.heightMm / 1000;
  const surfaceAreaM2 = Math.round(widthM * heightM * 100) / 100;

  // Base mass calculation based on cladding finish
  const baseRateKgM2 = config.finish === "NATURAL_TIMBER_CEDAR" ? 15.8 : 12.5;
  const panelMassKg = Math.round(surfaceAreaM2 * baseRateKgM2 * 10) / 10;

  // Glazing mass addition
  let glazingMassKg = 0;
  if (config.glazing === "ACRYLIC_CLEAR_TOP") {
    glazingMassKg = Math.round(surfaceAreaM2 * 0.25 * 5.0 * 10) / 10;
  } else if (config.glazing === "FROSTED_PRIVACY_TOP") {
    glazingMassKg = Math.round(surfaceAreaM2 * 0.25 * 6.5 * 10) / 10;
  } else if (config.glazing === "FULL_VIEW_PANEL") {
    glazingMassKg = Math.round(surfaceAreaM2 * 0.75 * 14.0 * 10) / 10;
  }

  const totalMassKg = Math.round((panelMassKg + glazingMassKg) * 10) / 10;

  // AS/NZS 4505:2012 Wind pressures
  const resolution = resolvePostcode(config.postcode);
  const windRegion = resolution.windRegion;

  const pressureMap: Record<WindRegion, { uls: number; sls: number }> = {
    A: { uls: 0.92, sls: 0.50 },
    B: { uls: 1.36, sls: 0.74 },
    C: { uls: 2.08, sls: 1.14 },
    D: { uls: 2.94, sls: 1.62 },
  };

  const { uls: ulsPressureKpa, sls: slsPressureKpa } = pressureMap[windRegion];

  // Structural Reinforcement allocation
  let jStrutsPerPanel = 0;
  if (ulsPressureKpa >= 2.2) {
    jStrutsPerPanel = 3;
  } else if (ulsPressureKpa >= 1.5) {
    jStrutsPerPanel = 2;
  } else if (ulsPressureKpa >= 1.0) {
    jStrutsPerPanel = 1;
  }
  const jStrutCount = jStrutsPerPanel * config.panelCount;

  const windLockClipsPerPanel: Record<WindRegion, number> = {
    A: 0,
    B: 2,
    C: 4,
    D: 6,
  };
  const windLockClipCount = windLockClipsPerPanel[windRegion] * config.panelCount;

  let rollerHingeGrade: GarageDoorEngineering["rollerHingeGrade"] = "COMMERCIAL_GRADE_14GA";
  if (windRegion === "C" || windRegion === "D") {
    rollerHingeGrade = "CYCLONIC_CAST_STEEL";
  } else if (windRegion === "B") {
    rollerHingeGrade = "HIGH_WIND_LOCK_11GA";
  }

  const springRatingCycles: 10000 | 20000 =
    windRegion === "C" || windRegion === "D" || totalMassKg > 150 ? 20000 : 10000;

  // Required motor torque: Torque = (Mass * g * radius) / efficiency
  // Standard residential drum radius = 0.05m, counterbalance efficiency = 0.85
  const gravity = 9.80665;
  const drumRadiusM = 0.05;
  const counterbalanceEfficiency = 0.85;
  const minTorqueNm = Math.round(((totalMassKg * gravity * drumRadiusM) / counterbalanceEfficiency) * 10) / 10;

  return {
    surfaceAreaM2,
    panelMassKg,
    glazingMassKg,
    totalMassKg,
    windRegion,
    ulsPressureKpa,
    slsPressureKpa,
    jStrutCount,
    windLockClipCount,
    rollerHingeGrade,
    springRatingCycles,
    minTorqueNm,
  };
}

export function calculatePoolHydraulics(config: PoolConfig): PoolHydraulics {
  const lengthM = config.lengthMm / 1000;
  const widthM = config.widthMm / 1000;
  const shallowM = config.shallowDepthMm / 1000;
  const deepM = config.deepDepthMm / 1000;

  const averageDepthM = (shallowM + deepM) / 2;
  const surfaceAreaM2 = Math.round(lengthM * widthM * 100) / 100;
  const waterVolumeLiters = Math.round(surfaceAreaM2 * averageDepthM * 1000);

  // 6-hour turnover flow rate in Liters per minute
  const turnoverFlowRateLpm = Math.round(waterVolumeLiters / (6 * 60));

  // Recommended variable-speed pump power
  let recommendedPumpPowerKw = 0.75;
  if (waterVolumeLiters > 75000) {
    recommendedPumpPowerKw = 1.65;
  } else if (waterVolumeLiters > 40000) {
    recommendedPumpPowerKw = 1.10;
  }

  // Sand/Glass media mass required
  const filterMediaMassKg = Math.max(75, Math.round(waterVolumeLiters / 350));

  // Self-cleaning chlorinator output (g/hr)
  const chlorinatorOutputGph = Math.max(15, Math.round(waterVolumeLiters / 2200));

  // Coping perimeter
  const copingLinearMeters = Math.round(2 * (lengthM + widthM) * 10) / 10;

  return {
    waterVolumeLiters,
    surfaceAreaM2,
    turnoverFlowRateLpm,
    recommendedPumpPowerKw,
    filterMediaMassKg,
    chlorinatorOutputGph,
    copingLinearMeters,
  };
}
