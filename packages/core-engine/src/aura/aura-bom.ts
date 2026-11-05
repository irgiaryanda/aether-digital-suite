import {
  BillOfMaterials,
  BomLineItem,
  GarageDoorConfig,
  GarageDoorEngineering,
  PoolConfig,
  PoolHydraulics,
} from "./types";

export function generateGarageDoorBom(
  config: GarageDoorConfig,
  engineering: GarageDoorEngineering
): BillOfMaterials {
  const items: BomLineItem[] = [];

  const baseCost = 2100 + (config.panelCount - 4) * 350;
  items.push({
    sku: `AURA-GD-FRAME-${config.panelCount}P`,
    description: `Architectural Sectional Door Framework (${config.widthMm}mm x ${config.heightMm}mm, ${config.panelCount} panels)`,
    category: "STRUCTURE",
    quantity: 1,
    unitPriceAud: baseCost,
    lineTotalAud: baseCost,
  });

  const finishPrices: Record<GarageDoorConfig["finish"], { sku: string; name: string; price: number }> = {
    COLORBOND_MONUMENT: { sku: "FIN-CB-MON", name: "Colorbond Steel Finish (Monument)", price: 420 },
    COLORBOND_SURFMIST: { sku: "FIN-CB-SURF", name: "Colorbond Steel Finish (Surfmist)", price: 420 },
    COLORBOND_BASALT: { sku: "FIN-CB-BAS", name: "Colorbond Steel Finish (Basalt)", price: 420 },
    COLORBOND_WOODLAND_GREY: { sku: "FIN-CB-WDL", name: "Colorbond Steel Finish (Woodland Grey)", price: 420 },
    NATURAL_TIMBER_CEDAR: { sku: "FIN-TIM-CEDAR", name: "Western Red Cedar Cladding", price: 2350 },
  };
  const finishSpec = finishPrices[config.finish];
  items.push({
    sku: finishSpec.sku,
    description: finishSpec.name,
    category: "FINISH",
    quantity: 1,
    unitPriceAud: finishSpec.price,
    lineTotalAud: finishSpec.price,
  });

  if (config.glazing !== "NONE") {
    const glazingPrices: Record<Exclude<GarageDoorConfig["glazing"], "NONE">, { sku: string; name: string; price: number }> = {
      ACRYLIC_CLEAR_TOP: { sku: "GLA-ACR-CLR", name: "Impact Acrylic Clear Horizon Inserts", price: 680 },
      FROSTED_PRIVACY_TOP: { sku: "GLA-ACR-FROST", name: "Frosted Architectural Privacy Inserts", price: 790 },
      FULL_VIEW_PANEL: { sku: "GLA-FULL-ALUM", name: "Full-View Framed Glazed Panel Row", price: 1650 },
    };
    const glz = glazingPrices[config.glazing];
    items.push({
      sku: glz.sku,
      description: glz.name,
      category: "FINISH",
      quantity: 1,
      unitPriceAud: glz.price,
      lineTotalAud: glz.price,
    });
  }

  if (engineering.jStrutCount > 0) {
    const strutPrice = 110;
    items.push({
      sku: "HDW-WIND-JSTRUT",
      description: `Structural Galvanized J-Strut Reinforcements (${engineering.windRegion} Rated)`,
      category: "HARDWARE",
      quantity: engineering.jStrutCount,
      unitPriceAud: strutPrice,
      lineTotalAud: engineering.jStrutCount * strutPrice,
    });
  }

  if (engineering.windLockClipCount > 0) {
    const clipPrice = 28;
    items.push({
      sku: "HDW-WIND-LOCKCLIP",
      description: "Heavy-Duty Wind-Lock Track Clips",
      category: "HARDWARE",
      quantity: engineering.windLockClipCount,
      unitPriceAud: clipPrice,
      lineTotalAud: engineering.windLockClipCount * clipPrice,
    });
  }

  const hingePrice = engineering.rollerHingeGrade === "CYCLONIC_CAST_STEEL" ? 480 : 220;
  items.push({
    sku: "HDW-HINGE-SET",
    description: `Roller Hinge Set (${engineering.rollerHingeGrade}) with ${engineering.springRatingCycles} Cycle Springs`,
    category: "HARDWARE",
    quantity: 1,
    unitPriceAud: hingePrice,
    lineTotalAud: hingePrice,
  });

  const motorMap: Record<GarageDoorConfig["motorDrive"], { sku: string; desc: string; price: number }> = {
    BELT_SILENT_800N: { sku: "MOT-BELT-800", desc: "WhisperDrive 800N Silent Belt Motor", price: 680 },
    CHAIN_HEAVY_1000N: { sku: "MOT-CHAIN-1000", desc: "HeavyDuty 1000N Chain Drive with Battery Backup", price: 820 },
    COMMERCIAL_JACKSHAFT_1200N: { sku: "MOT-JACK-1200", desc: "DirectDrive 1200N Wall-Mount Jackshaft", price: 1290 },
  };
  const mot = motorMap[config.motorDrive];
  items.push({
    sku: mot.sku,
    description: mot.desc,
    category: "AUTOMATION",
    quantity: 1,
    unitPriceAud: mot.price,
    lineTotalAud: mot.price,
  });

  items.push({
    sku: "LABOR-INSTALL-CERT",
    description: "Site Measure, Laser Track Install & AS/NZS 4505 Sign-Off",
    category: "LABOR",
    quantity: 1,
    unitPriceAud: 850,
    lineTotalAud: 850,
  });

  const subtotalExGstAud = items.reduce((acc, it) => acc + it.lineTotalAud, 0);
  const gstAud = Math.round(subtotalExGstAud * 0.10 * 100) / 100;
  const totalIncGstAud = Math.round((subtotalExGstAud + gstAud) * 100) / 100;

  return {
    items,
    subtotalExGstAud,
    gstAud,
    totalIncGstAud,
    quoteReference: "AURA-GD-QUOTE",
  };
}

export function generatePoolBom(config: PoolConfig, hydraulics: PoolHydraulics): BillOfMaterials {
  const items: BomLineItem[] = [];

  const baseShellCost = 28000 + Math.round((hydraulics.surfaceAreaM2 - 20) * 850);
  items.push({
    sku: "AURA-POOL-SHELL",
    description: `Monolithic Concrete Pool Shell (${config.lengthMm}mm x ${config.widthMm}mm, ${hydraulics.waterVolumeLiters.toLocaleString()}L)`,
    category: "STRUCTURE",
    quantity: 1,
    unitPriceAud: baseShellCost,
    lineTotalAud: baseShellCost,
  });

  if (config.cantileverEdge) {
    items.push({
      sku: "AURA-POOL-CANTILEVER",
      description: "Reinforced Post-Tensioned Cantilevered Edge Support Beam",
      category: "STRUCTURE",
      quantity: 1,
      unitPriceAud: 5800,
      lineTotalAud: 5800,
    });
  }

  const copingRates: Record<PoolConfig["copingFinish"], { sku: string; name: string; rate: number }> = {
    TRAVERTINE_CLASSIC: { sku: "COP-TRAV-600", name: "Classic Roman Travertine Bullnose Coping", rate: 185 },
    GRANITE_FLAMED: { sku: "COP-GRAN-FLAM", name: "Flamed Raven Granite Drop-Face Coping", rate: 240 },
    BLUESTONE_SAWN: { sku: "COP-BLUE-SAWN", name: "Honed Victorian Bluestone Coping", rate: 215 },
    LIMESTONE_COASTAL: { sku: "COP-LIME-CST", name: "Coastal Ivory Limestone Drop-Edge Coping", rate: 195 },
  };
  const cop = copingRates[config.copingFinish];
  const copingCost = Math.round(hydraulics.copingLinearMeters * cop.rate);
  items.push({
    sku: cop.sku,
    description: `${cop.name} (${hydraulics.copingLinearMeters}m)`,
    category: "FINISH",
    quantity: hydraulics.copingLinearMeters,
    unitPriceAud: cop.rate,
    lineTotalAud: copingCost,
  });

  const interiorRates: Record<PoolConfig["interiorFinish"], { sku: string; name: string; rate: number }> = {
    AQUA_PEARL_CERAMIC: { sku: "INT-CER-PEARL", name: "Glass Ceramic Waterline Tiles & Pebble Finish", rate: 120 },
    SAPPHIRE_SPARKLE_FIBRE: { sku: "INT-FIB-SPARK", name: "Sapphire Sparkle High-Durability Gelcoat", rate: 95 },
    CRUSHED_QUARTZ_DEEP: { sku: "INT-QTZ-DEEP", name: "Hand-Troweled Crushed White Quartz Plaster", rate: 165 },
  };
  const intFin = interiorRates[config.interiorFinish];
  const interiorCost = Math.round(hydraulics.surfaceAreaM2 * intFin.rate);
  items.push({
    sku: intFin.sku,
    description: `${intFin.name} (${hydraulics.surfaceAreaM2} m2)`,
    category: "FINISH",
    quantity: hydraulics.surfaceAreaM2,
    unitPriceAud: intFin.rate,
    lineTotalAud: interiorCost,
  });

  items.push({
    sku: "HYD-PUMP-VFD",
    description: `HydroFlow ${hydraulics.recommendedPumpPowerKw}kW Variable Speed Eco Pump (${hydraulics.turnoverFlowRateLpm} L/min)`,
    category: "AUTOMATION",
    quantity: 1,
    unitPriceAud: 2150,
    lineTotalAud: 2150,
  });

  items.push({
    sku: "HYD-FILTER-MEDIA",
    description: `Micron Glass Media Filter (${hydraulics.filterMediaMassKg}kg media)`,
    category: "AUTOMATION",
    quantity: 1,
    unitPriceAud: 1480,
    lineTotalAud: 1480,
  });

  items.push({
    sku: "HYD-CHLOR-CELL",
    description: `Self-Cleaning Saltwater Chlorinator (${hydraulics.chlorinatorOutputGph} g/hr output)`,
    category: "AUTOMATION",
    quantity: 1,
    unitPriceAud: 1890,
    lineTotalAud: 1890,
  });

  items.push({
    sku: "LED-LIGHT-PKG",
    description: `Flush-Mount Underwater Architectural LED Luminaires (${config.ledColor})`,
    category: "AUTOMATION",
    quantity: 2,
    unitPriceAud: 440,
    lineTotalAud: 880,
  });

  items.push({
    sku: "LABOR-POOL-CIVIL",
    description: "Site Excavation, Crane Placement & Engineering Sign-Off",
    category: "LABOR",
    quantity: 1,
    unitPriceAud: 7500,
    lineTotalAud: 7500,
  });

  const subtotalExGstAud = items.reduce((acc, it) => acc + it.lineTotalAud, 0);
  const gstAud = Math.round(subtotalExGstAud * 0.10 * 100) / 100;
  const totalIncGstAud = Math.round((subtotalExGstAud + gstAud) * 100) / 100;

  return {
    items,
    subtotalExGstAud,
    gstAud,
    totalIncGstAud,
    quoteReference: "AURA-POOL-QUOTE",
  };
}

