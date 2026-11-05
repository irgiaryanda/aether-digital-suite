import { describe, expect, it } from "vitest";
import {
  calculateAgencyUtilization,
  calculateElapsedSeconds,
  calculateRetainerHealth,
  formatDurationToTimecode,
  generateAgencyTaxInvoice,
  TimesheetEntry,
} from "../src/index";

describe("ChronosFlow Monotonic Active Timer Engine", () => {
  it("calculates exact elapsed seconds when timer is running", () => {
    const startedAt = 1000000;
    const now = 1045000; // 45 seconds later
    const accumulated = 120; // 2 minutes already accumulated

    const elapsed = calculateElapsedSeconds(accumulated, startedAt, now, true);
    expect(elapsed).toBe(165); // 120 + 45
  });

  it("returns accumulated seconds without advancing when timer is paused", () => {
    const startedAt = 1000000;
    const now = 1090000;
    const accumulated = 300;

    const elapsed = calculateElapsedSeconds(accumulated, startedAt, now, false);
    expect(elapsed).toBe(300);
  });

  it("formats duration into clean HH:MM:SS timecodes", () => {
    expect(formatDurationToTimecode(0)).toBe("00:00:00");
    expect(formatDurationToTimecode(65)).toBe("00:01:05");
    expect(formatDurationToTimecode(3665)).toBe("01:01:05");
    expect(formatDurationToTimecode(36000)).toBe("10:00:00");
  });
});

describe("ChronosFlow Retainer Burn Health Engine", () => {
  it("reports HEALTHY when logged hours are below 80% of budget", () => {
    const health = calculateRetainerHealth(40, 24);
    expect(health.burnPercentage).toBe(60.0);
    expect(health.remainingHours).toBe(16.0);
    expect(health.status).toBe("HEALTHY");
  });

  it("reports WARNING when logged hours are between 80% and 100% of budget", () => {
    const health = calculateRetainerHealth(40, 36);
    expect(health.burnPercentage).toBe(90.0);
    expect(health.remainingHours).toBe(4.0);
    expect(health.status).toBe("WARNING");
  });

  it("reports OVER_BURN when logged hours exceed 100% of budget", () => {
    const health = calculateRetainerHealth(40, 48);
    expect(health.burnPercentage).toBe(120.0);
    expect(health.remainingHours).toBe(-8.0);
    expect(health.status).toBe("OVER_BURN");
  });
});

describe("ChronosFlow Agency Utilization & Invoicing Engine", () => {
  const mockEntries: TimesheetEntry[] = [
    {
      id: "T1",
      userId: "U1",
      userName: "Dev",
      projectId: "P1",
      taskDescription: "Custom WP Theme",
      phaseCategory: "CUSTOM_WP_THEME",
      isBillable: true,
      hourlyRateAud: 180.00,
      durationSeconds: 14400, // 4 hours
      startedAt: "2026-11-01T08:00:00Z",
      endedAt: "2026-11-01T12:00:00Z",
      createdAt: "2026-11-01T12:00:00Z",
    },
    {
      id: "T2",
      userId: "U1",
      userName: "Dev",
      projectId: "P1",
      taskDescription: "Internal Sprint Retro",
      phaseCategory: "QA_STAGING",
      isBillable: false,
      hourlyRateAud: 180.00,
      durationSeconds: 3600, // 1 hour
      startedAt: "2026-11-01T13:00:00Z",
      endedAt: "2026-11-01T14:00:00Z",
      createdAt: "2026-11-01T14:00:00Z",
    },
    {
      id: "T3",
      userId: "U2",
      userName: "Lead",
      projectId: "P1",
      taskDescription: "WooCommerce HPOS Integration",
      phaseCategory: "WOOCOMMERCE_PLUGIN",
      isBillable: true,
      hourlyRateAud: 200.00,
      durationSeconds: 18000, // 5 hours
      startedAt: "2026-11-02T08:00:00Z",
      endedAt: "2026-11-02T13:00:00Z",
      createdAt: "2026-11-02T13:00:00Z",
    },
  ];

  it("calculates accurate billable utilization % and effective hourly rate", () => {
    // Total capacity = 10 hours. Billable = 4 + 5 = 9 hours. Non-billable = 1 hour.
    const util = calculateAgencyUtilization(mockEntries, 10);

    expect(util.billableHours).toBe(9);
    expect(util.nonBillableHours).toBe(1);
    expect(util.utilizationRatePercent).toBe(90.0);
    // Billed total = (4 * 180) + (5 * 200) = 720 + 1000 = $1,720
    // Total worked = 10 hours. Effective rate = 1720 / 10 = $172.00
    expect(util.effectiveHourlyRateAud).toBe(172.00);
  });

  it("generates an itemized agency tax invoice with 10% GST", () => {
    const invoice = generateAgencyTaxInvoice(
      "INV-AETH-2026-088",
      "51 824 753 556",
      "Sydney Harbour Luxe Pools",
      "33 102 417 032",
      "Luxe Pool 3D Configurator",
      mockEntries
    );

    expect(invoice.invoiceNumber).toBe("INV-AETH-2026-088");
    expect(invoice.lineItems.length).toBe(2); // Only billable phases
    expect(invoice.subtotalExGstAud).toBe(1720.00);
    expect(invoice.gstAud).toBe(172.00);
    expect(invoice.totalIncGstAud).toBe(1892.00);
  });
});
