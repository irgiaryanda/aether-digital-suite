import React from "react";
import {
  BillOfMaterials,
  GarageDoorConfig,
  GarageDoorEngineering,
  PoolConfig,
  PoolHydraulics,
  resolvePostcode,
} from "@aether/core-engine";

interface Props {
  productType: "GARAGE_DOOR" | "LUXURY_POOL";
  garageConfig: GarageDoorConfig;
  garageEngineering: GarageDoorEngineering;
  garageBom: BillOfMaterials;
  poolConfig: PoolConfig;
  poolHydraulics: PoolHydraulics;
  poolBom: BillOfMaterials;
}

export const PrintableSpecSheet: React.FC<Props> = ({
  productType,
  garageConfig,
  garageEngineering,
  garageBom,
  poolConfig,
  poolHydraulics,
  poolBom,
}) => {
  const activeBom = productType === "GARAGE_DOOR" ? garageBom : poolBom;
  const postcode = productType === "GARAGE_DOOR" ? garageConfig.postcode : poolConfig.postcode;
  const resolution = resolvePostcode(postcode);

  return (
    <section className="hidden print:block bg-white text-black p-8 max-w-4xl mx-auto font-sans">
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AuraBuild Architectural Engineering Spec</h1>
          <p className="text-xs text-gray-700 mt-1">
            AS/NZS 4505:2012 &amp; AS 1926.1 Compliant Specification &amp; Bill of Materials
          </p>
        </div>
        <div className="text-right font-mono text-xs">
          <div className="font-bold">{activeBom.quoteReference}</div>
          <div>Generated: {new Date().toLocaleDateString("en-AU")}</div>
          <div>
            Zone: {resolution.suburb}, {resolution.state} ({postcode})
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 border border-gray-300 p-4 rounded text-xs">
        <div>
          <div className="font-bold uppercase text-gray-600 mb-1">Configured Dimensions</div>
          {productType === "GARAGE_DOOR" ? (
            <ul className="space-y-1 font-mono">
              <li>Opening: {garageConfig.widthMm}mm W x {garageConfig.heightMm}mm H</li>
              <li>Panels: {garageConfig.panelCount} Sectional</li>
              <li>Profile: {(garageConfig.doorStyle ?? "ARCHITECTURAL_HORIZONTAL").replace(/_/g, " ")}</li>
              <li>Finish: {garageConfig.finish.replace(/_/g, " ")}</li>
            </ul>
          ) : (
            <ul className="space-y-1 font-mono">
              <li>Basin: {poolConfig.lengthMm}mm L x {poolConfig.widthMm}mm W</li>
              <li>Depth: {poolConfig.shallowDepthMm}mm to {poolConfig.deepDepthMm}mm</li>
              <li>Coping: {poolConfig.copingFinish.replace(/_/g, " ")}</li>
              <li>Cantilever Edge: {poolConfig.cantileverEdge ? "Included" : "Standard"}</li>
            </ul>
          )}
        </div>
        <div>
          <div className="font-bold uppercase text-gray-600 mb-1">Engineering Telemetry</div>
          {productType === "GARAGE_DOOR" ? (
            <ul className="space-y-1 font-mono">
              <li>Wind Region: {garageEngineering.windRegion} ({garageEngineering.ulsPressureKpa} kPa ULS)</li>
              <li>Total Panel Mass: {garageEngineering.totalMassKg} kg</li>
              <li>Reinforcement: {garageEngineering.jStrutCount} J-Struts / {garageEngineering.windLockClipCount} Clips</li>
              <li>Required Torque: {garageEngineering.minTorqueNm} Nm ({garageEngineering.springRatingCycles} cycles)</li>
            </ul>
          ) : (
            <ul className="space-y-1 font-mono">
              <li>Volume: {poolHydraulics.waterVolumeLiters.toLocaleString()} L</li>
              <li>6-Hour Turnover: {poolHydraulics.turnoverFlowRateLpm} L/min</li>
              <li>Pump Sizing: {poolHydraulics.recommendedPumpPowerKw} kW VFD</li>
              <li>Media / Chlorinator: {poolHydraulics.filterMediaMassKg} kg / {poolHydraulics.chlorinatorOutputGph} g/hr</li>
            </ul>
          )}
        </div>
      </div>

      <table className="w-full text-left border-collapse text-xs font-mono mb-6">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="py-2">SKU</th>
            <th className="py-2">Specification Description</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Unit AUD</th>
            <th className="py-2 text-right">Line AUD</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {activeBom.items.map((item, idx) => (
            <tr key={`${item.sku}-${idx}`}>
              <td className="py-2 font-bold">{item.sku}</td>
              <td className="py-2 font-sans">{item.description}</td>
              <td className="py-2 text-right tabular-nums">{item.quantity}</td>
              <td className="py-2 text-right tabular-nums">${item.unitPriceAud.toFixed(2)}</td>
              <td className="py-2 text-right tabular-nums font-bold">${item.lineTotalAud.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end font-mono text-xs">
        <div className="w-64 space-y-1 border-t-2 border-black pt-2">
          <div className="flex justify-between">
            <span>Subtotal ex-GST:</span>
            <span>${activeBom.subtotalExGstAud.toFixed(2)} AUD</span>
          </div>
          <div className="flex justify-between">
            <span>Australian GST 10%:</span>
            <span>${activeBom.gstAud.toFixed(2)} AUD</span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-1 border-t border-gray-300">
            <span>Total inc-GST:</span>
            <span>${activeBom.totalIncGstAud.toFixed(2)} AUD</span>
          </div>
        </div>
      </div>
    </section>
  );
};
