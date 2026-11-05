import {
  AgencyInvoiceLineItem,
  AgencyTaxInvoice,
  AgencyUtilizationResult,
  ProjectPhase,
  RetainerHealthResult,
  TimesheetEntry,
} from "./types";

export function calculateElapsedSeconds(
  accumulatedSeconds: number,
  startedAtMs: number | null,
  nowMs: number,
  isRunning: boolean
): number {
  if (!isRunning || startedAtMs === null) {
    return Math.max(0, Math.floor(accumulatedSeconds));
  }
  const currentDeltaSeconds = Math.max(0, Math.floor((nowMs - startedAtMs) / 1000));
  return Math.floor(accumulatedSeconds + currentDeltaSeconds);
}

export function formatDurationToTimecode(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function calculateRetainerHealth(
  budgetHours: number,
  loggedHours: number
): RetainerHealthResult {
  const safeBudget = Math.max(1, budgetHours);
  const safeLogged = Math.max(0, loggedHours);
  const remainingHours = Math.round((safeBudget - safeLogged) * 10) / 10;
  const burnPercentage = Math.round((safeLogged / safeBudget) * 100 * 10) / 10;

  let status: RetainerHealthResult["status"] = "HEALTHY";
  if (burnPercentage > 100) {
    status = "OVER_BURN";
  } else if (burnPercentage >= 80) {
    status = "WARNING";
  }

  return {
    budgetHours: safeBudget,
    loggedHours: safeLogged,
    remainingHours,
    burnPercentage,
    status,
  };
}

export function calculateAgencyUtilization(
  entries: TimesheetEntry[],
  totalCapacityHours: number
): AgencyUtilizationResult {
  const safeCapacity = Math.max(1, totalCapacityHours);

  let billableSeconds = 0;
  let nonBillableSeconds = 0;
  let totalBilledAud = 0;

  for (const entry of entries) {
    if (entry.isBillable) {
      billableSeconds += entry.durationSeconds;
      totalBilledAud += (entry.durationSeconds / 3600) * entry.hourlyRateAud;
    } else {
      nonBillableSeconds += entry.durationSeconds;
    }
  }

  const billableHours = Math.round((billableSeconds / 3600) * 10) / 10;
  const nonBillableHours = Math.round((nonBillableSeconds / 3600) * 10) / 10;
  const totalWorkedHours = billableHours + nonBillableHours;

  const utilizationRatePercent = Math.round((billableHours / safeCapacity) * 100 * 10) / 10;
  const effectiveHourlyRateAud =
    totalWorkedHours > 0
      ? Math.round((totalBilledAud / totalWorkedHours) * 100) / 100
      : 0;

  return {
    totalCapacityHours: safeCapacity,
    billableHours,
    nonBillableHours,
    utilizationRatePercent,
    effectiveHourlyRateAud,
  };
}

const PHASE_LABELS: Record<ProjectPhase, string> = {
  DISCOVERY_UX: "UX Discovery, Wireframes & Information Architecture",
  CUSTOM_WP_THEME: "Custom WordPress Theme Engineering & Tailwind Setup",
  WOOCOMMERCE_PLUGIN: "WooCommerce HPOS Integration & Custom Plugin Architecture",
  QA_STAGING: "Cross-Device Staging QA, Performance & Accessibility",
  DEPLOYMENT_MAINTENANCE: "Production Deployment, DNS & Speed Optimization",
};

export function generateAgencyTaxInvoice(
  invoiceNumber: string,
  agencyAbn: string,
  clientName: string,
  clientAbn: string,
  projectName: string,
  entries: TimesheetEntry[]
): AgencyTaxInvoice {
  const phaseMap = new Map<ProjectPhase, { hours: number; rate: number }>();

  for (const entry of entries) {
    if (!entry.isBillable) continue;
    const hours = entry.durationSeconds / 3600;
    const current = phaseMap.get(entry.phaseCategory) ?? { hours: 0, rate: entry.hourlyRateAud };
    current.hours += hours;
    phaseMap.set(entry.phaseCategory, current);
  }

  const lineItems: AgencyInvoiceLineItem[] = [];
  for (const [phase, data] of phaseMap.entries()) {
    const roundedHours = Math.round(data.hours * 10) / 10;
    const lineTotal = Math.round(roundedHours * data.rate * 100) / 100;
    lineItems.push({
      phase,
      phaseLabel: PHASE_LABELS[phase],
      hours: roundedHours,
      hourlyRateAud: data.rate,
      lineTotalAud: lineTotal,
    });
  }

  const subtotalExGstAud = lineItems.reduce((acc, it) => acc + it.lineTotalAud, 0);
  const gstAud = Math.round(subtotalExGstAud * 0.10 * 100) / 100;
  const totalIncGstAud = Math.round((subtotalExGstAud + gstAud) * 100) / 100;

  return {
    invoiceNumber,
    invoiceDate: new Date().toISOString().split("T")[0]!,
    agencyAbn,
    clientName,
    clientAbn,
    projectName,
    lineItems,
    subtotalExGstAud,
    gstAud,
    totalIncGstAud,
  };
}
