import React from "react";
import { GarageDoorConfig, GarageDoorStyle, GarageFinish, GlazingOption } from "@aether/core-engine";

interface Props {
  config: GarageDoorConfig;
  onChange: (updated: Partial<GarageDoorConfig>) => void;
}

export const GarageMaterials: React.FC<Props> = ({ config, onChange }) => {
  const styles: { id: GarageDoorStyle; name: string; desc: string }[] = [
    { id: "ARCHITECTURAL_HORIZONTAL", name: "Architectural Horizontal Rib", desc: "Clean linear rib geometry" },
    { id: "VERTICAL_BATTEN", name: "Vertical Batten Cladding", desc: "Bespoke architectural batten relief" },
    { id: "HAMPTONS_COFFERED", name: "Hamptons Coffered Frame", desc: "Symmetrical coastal millwork panels" },
    { id: "FLUSH_MOUNT", name: "Concealed Flush Mount", desc: "Seamless negative-detail facade" },
  ];

  const finishes: { id: GarageFinish; name: string; hex: string; note: string }[] = [
    { id: "COLORBOND_MONUMENT", name: "Colorbond Monument", hex: "#282B30", note: "Deep architectural charcoal" },
    { id: "COLORBOND_SURFMIST", name: "Colorbond Surfmist", hex: "#EAE6DF", note: "Warm contemporary off-white" },
    { id: "COLORBOND_BASALT", name: "Colorbond Basalt", hex: "#4E5258", note: "Neutral mineral slate grey" },
    { id: "COLORBOND_WOODLAND_GREY", name: "Colorbond Woodland Grey", hex: "#484844", note: "Natural dark olive tone" },
    { id: "NATURAL_TIMBER_CEDAR", name: "Western Red Cedar", hex: "#8C4828", note: "Hand-crafted natural timber cladding" },
  ];

  const glazingOptions: { id: GlazingOption; name: string; desc: string }[] = [
    { id: "NONE", name: "Solid Panels (No Glazing)", desc: "Max thermal insulation and wind rating" },
    { id: "ACRYLIC_CLEAR_TOP", name: "Clear Horizon Windows", desc: "Impact acrylic top-row inserts" },
    { id: "FROSTED_PRIVACY_TOP", name: "Frosted Privacy Windows", desc: "Translucent privacy top-row inserts" },
    { id: "FULL_VIEW_PANEL", name: "Full-View Glazed Panel", desc: "Extruded aluminum framed panoramic view" },
  ];

  const activeStyle = config.doorStyle ?? "ARCHITECTURAL_HORIZONTAL";

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-aura-text block mb-1.5">Architectural Profile</label>
        <div className="grid grid-cols-2 gap-1.5">
          {styles.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange({ doorStyle: s.id })}
              className={`p-2 rounded-lg border text-left transition-all ${
                activeStyle === s.id
                  ? "bg-cyan-50/70 border-aura-cyan shadow-sm"
                  : "bg-white border-aura-border hover:bg-aura-subtle"
              }`}
            >
              <span className="text-[11px] font-bold text-aura-text block truncate">{s.name}</span>
              <span className="text-[10px] text-aura-text-dim block truncate">{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-aura-text block mb-1.5">Cladding Finish</label>
        <div className="space-y-1.5">
          {finishes.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onChange({ finish: f.id })}
              className={`w-full flex items-center space-x-3 p-2 rounded-lg border text-left transition-all ${
                config.finish === f.id
                  ? "bg-cyan-50/70 border-aura-cyan shadow-sm"
                  : "bg-white border-aura-border hover:bg-aura-subtle"
              }`}
            >
              <span className="w-6 h-6 rounded border border-black/20 flex-shrink-0" style={{ backgroundColor: f.hex }} />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-aura-text block truncate">{f.name}</span>
                <span className="text-[11px] text-aura-text-dim block">{f.note}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-aura-text block mb-1.5">Window Inserts</label>
        <div className="space-y-1.5">
          {glazingOptions.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => onChange({ glazing: g.id })}
              className={`w-full p-2 rounded-lg border text-left transition-all ${
                config.glazing === g.id
                  ? "bg-cyan-50/70 border-aura-cyan shadow-sm"
                  : "bg-white border-aura-border hover:bg-aura-subtle"
              }`}
            >
              <span className="text-xs font-bold text-aura-text block">{g.name}</span>
              <span className="text-[11px] text-aura-text-dim block">{g.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
