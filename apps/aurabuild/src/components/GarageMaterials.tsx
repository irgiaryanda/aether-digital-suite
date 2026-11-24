import React from "react";
import { GarageDoorConfig, GarageDoorStyle, GarageFinish, GlazingOption } from "@aether/core-engine";

interface Props {
  config: GarageDoorConfig;
  onChange: (updated: Partial<GarageDoorConfig>) => void;
}

export const GarageMaterials: React.FC<Props> = ({ config, onChange }) => {
  const styles: { id: GarageDoorStyle; name: string; desc: string }[] = [
    { id: "ARCHITECTURAL_HORIZONTAL", name: "Horizontal Rib", desc: "Crisp linear flute geometry" },
    { id: "VERTICAL_BATTEN", name: "Vertical Batten", desc: "Architectural aluminum relief" },
    { id: "HAMPTONS_COFFERED", name: "Hamptons Coffered", desc: "Coastal recessed millwork" },
    { id: "FLUSH_MOUNT", name: "Flush Mount", desc: "Concealed negative facade" },
  ];

  const finishes: { id: GarageFinish; name: string; hex: string; note: string }[] = [
    { id: "COLORBOND_MONUMENT", name: "Colorbond Monument", hex: "#282B30", note: "Deep architectural charcoal" },
    { id: "COLORBOND_SURFMIST", name: "Colorbond Surfmist", hex: "#EAE6DF", note: "Warm contemporary off-white" },
    { id: "COLORBOND_BASALT", name: "Colorbond Basalt", hex: "#4E5258", note: "Neutral mineral slate grey" },
    { id: "COLORBOND_WOODLAND_GREY", name: "Colorbond Woodland Grey", hex: "#484844", note: "Natural dark olive tone" },
    { id: "NATURAL_TIMBER_CEDAR", name: "Western Red Cedar", hex: "#8C4828", note: "Hand-crafted natural timber cladding" },
  ];

  const glazingOptions: { id: GlazingOption; name: string; desc: string }[] = [
    { id: "NONE", name: "Solid Panels", desc: "Maximum thermal seal and wind rating" },
    { id: "ACRYLIC_CLEAR_TOP", name: "Clear Horizon", desc: "Impact acrylic top-row inserts" },
    { id: "FROSTED_PRIVACY_TOP", name: "Frosted Privacy", desc: "Translucent top-row inserts" },
    { id: "FULL_VIEW_PANEL", name: "Full-View Glazed", desc: "Extruded aluminum framed glass row" },
  ];

  const activeStyle = config.doorStyle ?? "ARCHITECTURAL_HORIZONTAL";

  return (
    <div className="space-y-5">
      <div>
        <span className="text-xs font-semibold text-aura-text block mb-2">Architectural Profile</span>
        <div className="grid grid-cols-2 gap-2">
          {styles.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange({ doorStyle: s.id })}
              className={`p-2.5 rounded-[12px] border text-left transition-all duration-300 ease-spring active:scale-[0.98] ${
                activeStyle === s.id
                  ? "bg-aura-cyan/[0.06] border-aura-cyan shadow-sm"
                  : "bg-white border-aura-border hover:bg-aura-subtle"
              }`}
            >
              <span className="text-xs font-bold text-aura-text block truncate">{s.name}</span>
              <span className="text-[11px] text-aura-text-dim block truncate mt-0.5">{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="text-xs font-semibold text-aura-text block mb-2">Cladding Finish</span>
        <div className="space-y-2">
          {finishes.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onChange({ finish: f.id })}
              className={`w-full flex items-center space-x-3 p-2.5 rounded-[12px] border text-left transition-all duration-300 ease-spring active:scale-[0.99] ${
                config.finish === f.id
                  ? "bg-aura-cyan/[0.06] border-aura-cyan shadow-sm"
                  : "bg-white border-aura-border hover:bg-aura-subtle"
              }`}
            >
              <span className="w-6 h-6 rounded-md border border-black/15 flex-shrink-0" style={{ backgroundColor: f.hex }} />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-aura-text block truncate">{f.name}</span>
                <span className="text-[11px] text-aura-text-dim block">{f.note}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="text-xs font-semibold text-aura-text block mb-2">Window Inserts</span>
        <div className="grid grid-cols-2 gap-2">
          {glazingOptions.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => onChange({ glazing: g.id })}
              className={`p-2.5 rounded-[12px] border text-left transition-all duration-300 ease-spring active:scale-[0.98] ${
                config.glazing === g.id
                  ? "bg-aura-cyan/[0.06] border-aura-cyan shadow-sm"
                  : "bg-white border-aura-border hover:bg-aura-subtle"
              }`}
            >
              <span className="text-xs font-bold text-aura-text block">{g.name}</span>
              <span className="text-[11px] text-aura-text-dim block mt-0.5">{g.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
