import { describe, expect, it } from "vitest";
import {
  COMMERCIAL_SKU_CATALOG,
  VERIFIED_AUSTRALIAN_WHOLESALERS,
  calculateInvoicePoints,
  calculateRetrofitRoi,
  createLedgerCredit,
  createLedgerDebit,
  resolveContractorTier,
  validateAustralianBusinessNumber,
} from "../src/index";

describe("VoltSwitch ATO Modulus 89 ABN Verification Engine", () => {
  it("validates genuine Australian wholesaler ABNs", () => {
    for (const wholesaler of VERIFIED_AUSTRALIAN_WHOLESALERS) {
      expect(validateAustralianBusinessNumber(wholesaler.abn)).toBe(true);
    }
  });

  it("validates clean 11-digit string ABNs", () => {
    // Rexel Australia
    expect(validateAustralianBusinessNumber("51824753556")).toBe(true);
    // Sonepar L&H
    expect(validateAustralianBusinessNumber("53004085616")).toBe(true);
  });

  it("rejects invalid or tampered ABNs", () => {
    expect(validateAustralianBusinessNumber("12345678901")).toBe(false);
    expect(validateAustralianBusinessNumber("51824753557")).toBe(false); // Tampered last digit
    expect(validateAustralianBusinessNumber("12345")).toBe(false); // Too short
    expect(validateAustralianBusinessNumber("")).toBe(false); // Empty
  });
});

describe("VoltSwitch Commercial SKU Cross-Reference Catalog", () => {
  it("contains at least 26 commercial electrical products", () => {
    expect(COMMERCIAL_SKU_CATALOG.length).toBeGreaterThanOrEqual(26);
  });

  it("covers all 5 major Australian competitor brands", () => {
    const brands = new Set(COMMERCIAL_SKU_CATALOG.map((item) => item.competitorBrand));
    expect(brands.has("CLIPSAL")).toBe(true);
    expect(brands.has("PHILIPS")).toBe(true);
    expect(brands.has("PIERLITE")).toBe(true);
    expect(brands.has("OSRAM")).toBe(true);
    expect(brands.has("THORN")).toBe(true);
  });

  it("provides complete technical telemetry for all products", () => {
    for (const item of COMMERCIAL_SKU_CATALOG) {
      expect(item.aetherWatts).toBeLessThan(item.competitorWatts); // Superior efficiency
      expect(item.efficacyLmW).toBeGreaterThanOrEqual(110);
      expect(item.lifespanHours).toBeGreaterThanOrEqual(50000);
      expect(item.stockSydney).toBeGreaterThan(0);
      expect(item.asNzsStandard).toMatch(/^AS\/NZS/);
    }
  });
});

describe("VoltSwitch Commercial Retrofit ROI Engine", () => {
  it("computes accurate annual kWh saved, financial savings, and CO2 reduction", () => {
    const roi = calculateRetrofitRoi({
      fixtureQuantity: 50,
      operatingHoursPerDay: 12,
      operatingDaysPerYear: 300,
      electricityTariffAudPerKwh: 0.32,
      existingWatts: 150, // 150W Clipsal Highbay
      proposedWatts: 120, // 120W Aether Titan Pro
      unitCapitalCostAud: 148.50,
    });

    // 50 * 150W * 12 * 300 / 1000 = 27,000 kWh existing
    expect(roi.existingAnnualKwh).toBe(27000);
    // 50 * 120W * 12 * 300 / 1000 = 21,600 kWh proposed
    expect(roi.proposedAnnualKwh).toBe(21600);
    // Saved: 5,400 kWh
    expect(roi.annualKwhSaved).toBe(5400);
    // 5400 * 0.32 = $1,728.00 AUD
    expect(roi.annualAudSaved).toBe(1728.00);
    // 5400 * 0.79 / 1000 = 4.27 tonnes CO2
    expect(roi.co2ReductionTonnes).toBe(4.27);
    // Capital cost: 50 * 148.50 = $7,425.00
    expect(roi.totalCapitalCostAud).toBe(7425.00);
    // Payback period: (7425 / 1728) * 12 = 51.6 months
    expect(roi.paybackPeriodMonths).toBe(51.6);
  });
});

describe("VoltSwitch Tiered Loyalty & Double-Entry Ledger Engine", () => {
  it("resolves correct contractor tiers based on spend thresholds", () => {
    expect(resolveContractorTier(5000).tier).toBe("BRONZE");
    expect(resolveContractorTier(15000).tier).toBe("SILVER");
    expect(resolveContractorTier(30000).tier).toBe("GOLD");
    expect(resolveContractorTier(65000).tier).toBe("PLATINUM");
  });

  it("calculates invoice points with tier multiplier", () => {
    // $10,000 invoice ex-GST at Gold Tier (1.5x) = 15,000 points
    expect(calculateInvoicePoints(10000, "GOLD")).toBe(15000);
    // $10,000 at Platinum Tier (2.0x) = 20,000 points
    expect(calculateInvoicePoints(10000, "PLATINUM")).toBe(20000);
  });

  it("maintains strict double-entry balance consistency and prevents overdrafts", () => {
    const initialBalance = 10000;
    const { updatedBalance: afterCredit, entry: creditEntry } = createLedgerCredit(
      "CONTRACTOR-1",
      initialBalance,
      5000,
      "INVOICE_CLAIM",
      "INV-101",
      "Rexel claim"
    );

    expect(afterCredit).toBe(15000);
    expect(creditEntry.balanceAfter).toBe(15000);
    expect(creditEntry.transactionType).toBe("CREDIT");

    const { updatedBalance: afterDebit, entry: debitEntry } = createLedgerDebit(
      "CONTRACTOR-1",
      afterCredit,
      12000,
      "REWARD_REDEMPTION",
      "VOUCHER-01",
      "Redeemed voucher"
    );

    expect(afterDebit).toBe(3000);
    expect(debitEntry.balanceAfter).toBe(3000);
    expect(debitEntry.pointsDelta).toBe(-12000);

    // Overdraft attempt must throw
    expect(() =>
      createLedgerDebit(
        "CONTRACTOR-1",
        afterDebit,
        5000,
        "REWARD_REDEMPTION",
        "VOUCHER-02",
        "Overdraft test"
      )
    ).toThrow(/Insufficient points balance/);
  });
});
