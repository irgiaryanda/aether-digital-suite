export type ContractorTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

export interface TierBenefit {
  tier: ContractorTier;
  multiplier: number;
  thresholdSpendAud: number;
  rebatePercent: number;
  badgeLabel: string;
}

export type CompetitorBrand = "CLIPSAL" | "PHILIPS" | "OSRAM" | "PIERLITE" | "THORN";

export type ProductCategory =
  | "HIGHBAY"
  | "BATTEN"
  | "TROFFER"
  | "FLOODLIGHT"
  | "DOWNLIGHT"
  | "EMERGENCY_EXIT";

export interface CommercialSkuItem {
  id: string;
  category: ProductCategory;
  competitorBrand: CompetitorBrand;
  competitorSku: string;
  competitorModel: string;
  competitorWatts: number;
  aetherSku: string;
  aetherModel: string;
  aetherWatts: number;
  lumens: number;
  efficacyLmW: number;
  ipRating: string;
  ikRating: string;
  cri: number;
  cctOptions: string;
  lifespanHours: number;
  unitTradePriceAud: number;
  stockSydney: number;
  stockMelbourne: number;
  stockBrisbane: number;
  asNzsStandard: string;
}

export interface RetrofitRoiInput {
  fixtureQuantity: number;
  operatingHoursPerDay: number;
  operatingDaysPerYear: number;
  electricityTariffAudPerKwh: number;
  existingWatts: number;
  proposedWatts: number;
  unitCapitalCostAud: number;
}

export interface RetrofitRoiResult {
  existingAnnualKwh: number;
  proposedAnnualKwh: number;
  annualKwhSaved: number;
  annualAudSaved: number;
  co2ReductionTonnes: number;
  totalCapitalCostAud: number;
  paybackPeriodMonths: number;
  fiveYearNetSavingsAud: number;
}

export type AustralianWholesaler =
  | "REXEL_ELECTRICAL"
  | "LAWRENCE_AND_HANSON"
  | "HAYMANS_ELECTRICAL"
  | "MIDDYS_ELECTRICAL";

export interface WholesalerMetadata {
  id: AustralianWholesaler;
  name: string;
  abn: string;
  headOffice: string;
}

export interface WholesalerInvoiceClaim {
  id: string;
  invoiceNumber: string;
  wholesaler: AustralianWholesaler;
  wholesalerAbn: string;
  contractorAbn: string;
  invoiceDate: string;
  subtotalExGstAud: number;
  gstAud: number;
  totalIncGstAud: number;
  purchasedSkus: { sku: string; quantity: number }[];
  awardedPoints: number;
  tierAtClaim: ContractorTier;
  status: "VERIFIED_CREDITED" | "AUDIT_REVIEW" | "REJECTED";
  claimedAt: string;
}

export interface PointsLedgerEntry {
  id: string;
  contractorId: string;
  transactionType: "CREDIT" | "DEBIT";
  pointsDelta: number;
  balanceAfter: number;
  referenceType: "INVOICE_CLAIM" | "REWARD_REDEMPTION" | "TIER_BONUS" | "WOOCOMMERCE_ORDER";
  referenceId: string;
  description: string;
  timestamp: string;
}

export interface RewardCatalogItem {
  id: string;
  sku: string;
  title: string;
  brand: string;
  category: "TOOLS" | "SAFETY" | "TEST_EQUIPMENT" | "TRADE_VOUCHERS";
  pointsCost: number;
  audEquivalentValue: number;
  stockLevel: number;
  imageUrl?: string;
  description: string;
}

export interface ContractorProfile {
  contractorId: string;
  companyName: string;
  abn: string;
  licenceNumber: string;
  contactName: string;
  email: string;
  phone: string;
  tier: ContractorTier;
  annualSpendAud: number;
  currentPointsBalance: number;
  lifetimePointsEarned: number;
}
