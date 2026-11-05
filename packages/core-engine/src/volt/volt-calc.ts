import {
  ContractorTier,
  PointsLedgerEntry,
  RetrofitRoiInput,
  RetrofitRoiResult,
  TierBenefit,
} from "./types";

export const NATIONAL_GREENHOUSE_FACTOR = 0.79; // kg CO2-e per kWh (Australian National Greenhouse Accounts)

export function calculateRetrofitRoi(input: RetrofitRoiInput): RetrofitRoiResult {
  const existingAnnualKwh = Math.round(
    ((input.existingWatts * input.fixtureQuantity * input.operatingHoursPerDay * input.operatingDaysPerYear) / 1000) * 10
  ) / 10;

  const proposedAnnualKwh = Math.round(
    ((input.proposedWatts * input.fixtureQuantity * input.operatingHoursPerDay * input.operatingDaysPerYear) / 1000) * 10
  ) / 10;

  const annualKwhSaved = Math.max(0, Math.round((existingAnnualKwh - proposedAnnualKwh) * 10) / 10);
  const annualAudSaved = Math.round(annualKwhSaved * input.electricityTariffAudPerKwh * 100) / 100;
  const co2ReductionTonnes = Math.round(((annualKwhSaved * NATIONAL_GREENHOUSE_FACTOR) / 1000) * 100) / 100;

  const totalCapitalCostAud = Math.round(input.fixtureQuantity * input.unitCapitalCostAud * 100) / 100;

  const paybackPeriodMonths =
    annualAudSaved > 0
      ? Math.round((totalCapitalCostAud / annualAudSaved) * 12 * 10) / 10
      : 0;

  const fiveYearNetSavingsAud = Math.round(((annualAudSaved * 5) - totalCapitalCostAud) * 100) / 100;

  return {
    existingAnnualKwh,
    proposedAnnualKwh,
    annualKwhSaved,
    annualAudSaved,
    co2ReductionTonnes,
    totalCapitalCostAud,
    paybackPeriodMonths,
    fiveYearNetSavingsAud,
  };
}

export const CONTRACTOR_TIERS: Record<ContractorTier, TierBenefit> = {
  BRONZE: {
    tier: "BRONZE",
    multiplier: 1.0,
    thresholdSpendAud: 0,
    rebatePercent: 0,
    badgeLabel: "Bronze Contractor",
  },
  SILVER: {
    tier: "SILVER",
    multiplier: 1.25,
    thresholdSpendAud: 10000,
    rebatePercent: 1.5,
    badgeLabel: "Silver Partner",
  },
  GOLD: {
    tier: "GOLD",
    multiplier: 1.5,
    thresholdSpendAud: 25000,
    rebatePercent: 3.0,
    badgeLabel: "Gold Certified",
  },
  PLATINUM: {
    tier: "PLATINUM",
    multiplier: 2.0,
    thresholdSpendAud: 50000,
    rebatePercent: 5.0,
    badgeLabel: "Platinum Elite",
  },
};

export function resolveContractorTier(annualSpendAud: number): TierBenefit {
  if (annualSpendAud >= 50000) return CONTRACTOR_TIERS.PLATINUM;
  if (annualSpendAud >= 25000) return CONTRACTOR_TIERS.GOLD;
  if (annualSpendAud >= 10000) return CONTRACTOR_TIERS.SILVER;
  return CONTRACTOR_TIERS.BRONZE;
}

export function calculateInvoicePoints(subtotalExGstAud: number, tier: ContractorTier): number {
  const basePoints = Math.max(0, Math.floor(subtotalExGstAud));
  const multiplier = CONTRACTOR_TIERS[tier].multiplier;
  return Math.floor(basePoints * multiplier);
}

export function createLedgerCredit(
  contractorId: string,
  currentBalance: number,
  pointsDelta: number,
  referenceType: PointsLedgerEntry["referenceType"],
  referenceId: string,
  description: string
): { updatedBalance: number; entry: PointsLedgerEntry } {
  if (pointsDelta <= 0) {
    throw new Error("Points credit delta must be greater than zero.");
  }

  const updatedBalance = currentBalance + pointsDelta;
  const entry: PointsLedgerEntry = {
    id: `LEDGER-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    contractorId,
    transactionType: "CREDIT",
    pointsDelta,
    balanceAfter: updatedBalance,
    referenceType,
    referenceId,
    description,
    timestamp: new Date().toISOString(),
  };

  return { updatedBalance, entry };
}

export function createLedgerDebit(
  contractorId: string,
  currentBalance: number,
  pointsDelta: number,
  referenceType: PointsLedgerEntry["referenceType"],
  referenceId: string,
  description: string
): { updatedBalance: number; entry: PointsLedgerEntry } {
  if (pointsDelta <= 0) {
    throw new Error("Points debit delta must be greater than zero.");
  }
  if (currentBalance < pointsDelta) {
    throw new Error(`Insufficient points balance: required ${pointsDelta}, available ${currentBalance}`);
  }

  const updatedBalance = currentBalance - pointsDelta;
  const entry: PointsLedgerEntry = {
    id: `LEDGER-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    contractorId,
    transactionType: "DEBIT",
    pointsDelta: -pointsDelta,
    balanceAfter: updatedBalance,
    referenceType,
    referenceId,
    description,
    timestamp: new Date().toISOString(),
  };

  return { updatedBalance, entry };
}
