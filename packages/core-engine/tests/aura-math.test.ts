import { describe, expect, it } from "vitest";
import {
  calculateGarageDoorEngineering,
  calculatePoolHydraulics,
  generateGarageDoorBom,
  generatePoolBom,
  resolvePostcode,
} from "../src/index";

describe("AuraBuild Postcode & AS/NZS 4505 Wind Region Resolver", () => {
  it("resolves Sydney metro (2000) to Region A with 3 weeks lead time", () => {
    const res = resolvePostcode("2000");
    expect(res.state).toBe("NSW");
    expect(res.windRegion).toBe("A");
    expect(res.leadTimeWeeks).toBe(3);
  });

  it("resolves Northern Beaches (2100) to Coastal Region B", () => {
    const res = resolvePostcode("2100");
    expect(res.state).toBe("NSW");
    expect(res.windRegion).toBe("B");
    expect(res.leadTimeWeeks).toBe(4);
  });

  it("resolves North Queensland cyclonic zone (4870) to Region C", () => {
    const res = resolvePostcode("4870");
    expect(res.state).toBe("QLD");
    expect(res.windRegion).toBe("C");
    expect(res.leadTimeWeeks).toBe(6);
  });

  it("resolves Pilbara WA severe cyclonic zone (6714) to Region D", () => {
    const res = resolvePostcode("6714");
    expect(res.state).toBe("WA");
    expect(res.windRegion).toBe("D");
    expect(res.leadTimeWeeks).toBe(7);
  });

  it("resolves Canberra ACT (2600) ahead of NSW catch-all", () => {
    const res = resolvePostcode("2600");
    expect(res.state).toBe("ACT");
    expect(res.windRegion).toBe("A");
    expect(res.leadTimeWeeks).toBe(3);
  });

  it("resolves Darwin NT (0800) to Region C cyclonic zone", () => {
    const res = resolvePostcode("0800");
    expect(res.state).toBe("NT");
    expect(res.windRegion).toBe("C");
    expect(res.leadTimeWeeks).toBe(6);
  });
});

describe("AuraBuild Garage Door Structural Engineering Math", () => {
  it("calculates correct mass, wind load, and torque for Region A standard door", () => {
    const config = {
      widthMm: 4800,
      heightMm: 2400,
      panelCount: 5,
      finish: "COLORBOND_MONUMENT" as const,
      glazing: "NONE" as const,
      motorDrive: "BELT_SILENT_800N" as const,
      postcode: "2000",
    };

    const eng = calculateGarageDoorEngineering(config);

    expect(eng.surfaceAreaM2).toBe(11.52);
    expect(eng.panelMassKg).toBe(144);
    expect(eng.glazingMassKg).toBe(0);
    expect(eng.totalMassKg).toBe(144);
    expect(eng.windRegion).toBe("A");
    expect(eng.ulsPressureKpa).toBe(0.92);
    expect(eng.slsPressureKpa).toBe(0.50);
    expect(eng.jStrutCount).toBe(0);
    expect(eng.windLockClipCount).toBe(0);
    expect(eng.rollerHingeGrade).toBe("COMMERCIAL_GRADE_14GA");
    expect(eng.springRatingCycles).toBe(10000);
    expect(eng.minTorqueNm).toBeGreaterThan(80);
  });

  it("allocates J-struts, wind-lock clips, and cyclonic hinges for Region C tropical door", () => {
    const config = {
      widthMm: 5000,
      heightMm: 2500,
      panelCount: 5,
      finish: "NATURAL_TIMBER_CEDAR" as const,
      glazing: "FULL_VIEW_PANEL" as const,
      motorDrive: "COMMERCIAL_JACKSHAFT_1200N" as const,
      postcode: "4870", // Region C
    };

    const eng = calculateGarageDoorEngineering(config);

    expect(eng.windRegion).toBe("C");
    expect(eng.ulsPressureKpa).toBe(2.08);
    // ULS >= 1.5 kPa requires 2 J-struts per panel: 5 * 2 = 10
    expect(eng.jStrutCount).toBe(10);
    // Region C requires 4 wind-lock clips per panel: 5 * 4 = 20
    expect(eng.windLockClipCount).toBe(20);
    expect(eng.rollerHingeGrade).toBe("CYCLONIC_CAST_STEEL");
    expect(eng.springRatingCycles).toBe(20000);
  });
});

describe("AuraBuild Pool Hydraulics & BOM Engine", () => {
  it("calculates precise water volume, turnover flow rate, and pump sizing", () => {
    const poolConfig = {
      lengthMm: 10000,
      widthMm: 4500,
      shallowDepthMm: 1200,
      deepDepthMm: 2000,
      copingFinish: "TRAVERTINE_CLASSIC" as const,
      interiorFinish: "AQUA_PEARL_CERAMIC" as const,
      ledColor: "CYAN_COASTAL" as const,
      cantileverEdge: true,
      postcode: "2088",
    };

    const hyd = calculatePoolHydraulics(poolConfig);

    expect(hyd.surfaceAreaM2).toBe(45);
    // Average depth = (1.2 + 2.0) / 2 = 1.6m. Volume = 45 * 1.6 * 1000 = 72,000 Liters
    expect(hyd.waterVolumeLiters).toBe(72000);
    // 6-hour turnover = 72,000 / 360 = 200 L/min
    expect(hyd.turnoverFlowRateLpm).toBe(200);
    expect(hyd.recommendedPumpPowerKw).toBe(1.10);
    expect(hyd.copingLinearMeters).toBe(29);

    const bom = generatePoolBom(poolConfig, hyd);
    expect(bom.items.length).toBeGreaterThan(6);
    expect(bom.gstAud).toBe(Math.round(bom.subtotalExGstAud * 0.10 * 100) / 100);
    expect(bom.totalIncGstAud).toBe(Math.round((bom.subtotalExGstAud + bom.gstAud) * 100) / 100);
  });

  it("verifies garage door BOM calculation with Australian 10% GST", () => {
    const config = {
      widthMm: 4800,
      heightMm: 2400,
      panelCount: 5,
      finish: "COLORBOND_MONUMENT" as const,
      glazing: "ACRYLIC_CLEAR_TOP" as const,
      motorDrive: "BELT_SILENT_800N" as const,
      postcode: "2000",
    };
    const eng = calculateGarageDoorEngineering(config);
    const bom = generateGarageDoorBom(config, eng);

    expect(bom.subtotalExGstAud).toBeGreaterThan(4000);
    expect(bom.gstAud).toBe(Math.round(bom.subtotalExGstAud * 0.10 * 100) / 100);
    expect(bom.totalIncGstAud).toBe(bom.subtotalExGstAud + bom.gstAud);
  });

  it("adds architectural vertical batten surcharge when selected in BOM", () => {
    const baseConfig = {
      widthMm: 4800,
      heightMm: 2400,
      panelCount: 5,
      finish: "COLORBOND_MONUMENT" as const,
      doorStyle: "ARCHITECTURAL_HORIZONTAL" as const,
      glazing: "NONE" as const,
      motorDrive: "BELT_SILENT_800N" as const,
      postcode: "2000",
    };
    const battenConfig = { ...baseConfig, doorStyle: "VERTICAL_BATTEN" as const };
    const eng = calculateGarageDoorEngineering(baseConfig);
    const baseBom = generateGarageDoorBom(baseConfig, eng);
    const battenBom = generateGarageDoorBom(battenConfig, eng);

    expect(battenBom.subtotalExGstAud - baseBom.subtotalExGstAud).toBe(950);
  });
});
