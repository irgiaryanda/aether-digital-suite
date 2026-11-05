export type ProjectPhase =
  | "DISCOVERY_UX"
  | "CUSTOM_WP_THEME"
  | "WOOCOMMERCE_PLUGIN"
  | "QA_STAGING"
  | "DEPLOYMENT_MAINTENANCE";

export type KanbanStage =
  | "BACKLOG"
  | "UI_UX_DESIGN"
  | "WP_PHP_DEV"
  | "STAGING_REVIEW"
  | "LIVE_PRODUCTION";

export type RetainerStatus = "HEALTHY" | "WARNING" | "OVER_BURN";

export interface AgencyClient {
  id: string;
  name: string;
  code: string;
  abn: string;
  contactEmail: string;
  defaultHourlyRateAud: number;
  monthlyRetainerHours: number;
}

export interface ChronosProject {
  id: string;
  clientId: string;
  title: string;
  code: string;
  budgetHours: number;
  loggedHours: number;
  hourlyRateAud: number;
  status: "ACTIVE" | "ON_HOLD" | "COMPLETED";
}

export interface KanbanTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  stage: KanbanStage;
  phase: ProjectPhase;
  assigneeName: string;
  estimatedHours: number;
  loggedHours: number;
  isBillable: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  order: number;
}

export interface ActiveTimerState {
  taskId: string | null;
  projectId: string | null;
  description: string;
  phase: ProjectPhase;
  isBillable: boolean;
  hourlyRateAud: number;
  startedAtMs: number | null;
  accumulatedSeconds: number;
  isRunning: boolean;
}

export interface TimesheetEntry {
  id: string;
  userId: string;
  userName: string;
  projectId: string;
  taskId?: string;
  taskDescription: string;
  phaseCategory: ProjectPhase;
  isBillable: boolean;
  hourlyRateAud: number;
  durationSeconds: number;
  startedAt: string;
  endedAt: string;
  createdAt: string;
}

export interface RetainerHealthResult {
  budgetHours: number;
  loggedHours: number;
  remainingHours: number;
  burnPercentage: number;
  status: RetainerStatus;
}

export interface AgencyUtilizationResult {
  totalCapacityHours: number;
  billableHours: number;
  nonBillableHours: number;
  utilizationRatePercent: number;
  effectiveHourlyRateAud: number;
}

export interface AgencyInvoiceLineItem {
  phase: ProjectPhase;
  phaseLabel: string;
  hours: number;
  hourlyRateAud: number;
  lineTotalAud: number;
}

export interface AgencyTaxInvoice {
  invoiceNumber: string;
  invoiceDate: string;
  agencyAbn: string;
  clientName: string;
  clientAbn: string;
  projectName: string;
  lineItems: AgencyInvoiceLineItem[];
  subtotalExGstAud: number;
  gstAud: number;
  totalIncGstAud: number;
}
