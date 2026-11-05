export type AustralianState = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";

export type WindRegion = "A" | "B" | "C" | "D";

export interface PostcodeResolution {
  postcode: string;
  suburb: string;
  state: AustralianState;
  windRegion: WindRegion;
  regionDescription: string;
  leadTimeWeeks: number;
}

export type GarageFinish =
  | "COLORBOND_MONUMENT"
  | "COLORBOND_SURFMIST"
  | "COLORBOND_BASALT"
  | "COLORBOND_WOODLAND_GREY"
  | "NATURAL_TIMBER_CEDAR";

export type GlazingOption = "NONE" | "ACRYLIC_CLEAR_TOP" | "FROSTED_PRIVACY_TOP" | "FULL_VIEW_PANEL";

export type MotorDriveType = "BELT_SILENT_800N" | "CHAIN_HEAVY_1000N" | "COMMERCIAL_JACKSHAFT_1200N";

export interface GarageDoorConfig {
  widthMm: number;
  heightMm: number;
  panelCount: number;
  finish: GarageFinish;
  glazing: GlazingOption;
  motorDrive: MotorDriveType;
  postcode: string;
}

export interface GarageDoorEngineering {
  surfaceAreaM2: number;
  panelMassKg: number;
  glazingMassKg: number;
  totalMassKg: number;
  windRegion: WindRegion;
  ulsPressureKpa: number;
  slsPressureKpa: number;
  jStrutCount: number;
  windLockClipCount: number;
  rollerHingeGrade: "COMMERCIAL_GRADE_14GA" | "HIGH_WIND_LOCK_11GA" | "CYCLONIC_CAST_STEEL";
  springRatingCycles: 10000 | 20000;
  minTorqueNm: number;
}

export type CopingFinish = "TRAVERTINE_CLASSIC" | "GRANITE_FLAMED" | "BLUESTONE_SAWN" | "LIMESTONE_COASTAL";

export type InteriorFinish = "AQUA_PEARL_CERAMIC" | "SAPPHIRE_SPARKLE_FIBRE" | "CRUSHED_QUARTZ_DEEP";

export type LedLightingColor = "CYAN_COASTAL" | "WHITE_CRISP" | "ULTRA_BLUE" | "AMBER_WARM";

export interface PoolConfig {
  lengthMm: number;
  widthMm: number;
  shallowDepthMm: number;
  deepDepthMm: number;
  copingFinish: CopingFinish;
  interiorFinish: InteriorFinish;
  ledColor: LedLightingColor;
  cantileverEdge: boolean;
  postcode: string;
}

export interface PoolHydraulics {
  waterVolumeLiters: number;
  surfaceAreaM2: number;
  turnoverFlowRateLpm: number;
  recommendedPumpPowerKw: number;
  filterMediaMassKg: number;
  chlorinatorOutputGph: number;
  copingLinearMeters: number;
}

export interface BomLineItem {
  sku: string;
  description: string;
  category: "STRUCTURE" | "FINISH" | "HARDWARE" | "AUTOMATION" | "LABOR";
  quantity: number;
  unitPriceAud: number;
  lineTotalAud: number;
}

export interface BillOfMaterials {
  items: BomLineItem[];
  subtotalExGstAud: number;
  gstAud: number;
  totalIncGstAud: number;
  quoteReference: string;
}

export interface AuraQuoteSubmission {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  siteAddress: string;
  postcode: string;
  productType: "GARAGE_DOOR" | "LUXURY_POOL";
  garageConfig?: GarageDoorConfig;
  poolConfig?: PoolConfig;
  engineeringSummary: GarageDoorEngineering | PoolHydraulics;
  bom: BillOfMaterials;
  installationAccessNotes: string;
  status: "PENDING_SITE_MEASURE" | "SCHEDULED" | "APPROVED" | "PROCESSED";
  submittedAt: string;
}
