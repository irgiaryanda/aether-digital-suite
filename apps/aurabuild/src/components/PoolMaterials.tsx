import React from "react";
import { CopingFinish, InteriorFinish, LedLightingColor, PoolConfig } from "@aether/core-engine";

interface Props {
  config: PoolConfig;
  onChange: (updated: Partial<PoolConfig>) => void;
}

export const PoolMaterials: React.FC<Props> = ({ config, onChange }) => {
  const copings: { id: CopingFinish; name: string; hex: string; desc: string }[] = [
    { id: "TRAVERTINE_CLASSIC", name: "Classic Roman Travertine", hex: "#E3D7C5", desc: "Tumbled non-slip beige stone" },
    { id: "GRANITE_FLAMED", name: "Flamed Raven Granite", hex: "#3A3D42", desc: "Drop-face charcoal granite" },
    { id: "BLUESTONE_SAWN", name: "Honed Victorian Bluestone", hex: "#5C6269", desc: "Signature architectural bluestone" },
    { id: "LIMESTONE_COASTAL", name: "Coastal Ivory Limestone", hex: "#EAE4D9", desc: "Soft cream drop-edge limestone" },
  ];

  const interiorFinishes: { id: InteriorFinish; name: string; hex: string }[] = [
    { id: "AQUA_PEARL_CERAMIC", name: "Aqua Pearl Ceramic & Pebble", hex: "#0096C7" },
    { id: "SAPPHIRE_SPARKLE_FIBRE", name: "Sapphire Sparkle Gelcoat", hex: "#023E8A" },
    { id: "CRUSHED_QUARTZ_DEEP", name: "Crushed White Quartz Plaster", hex: "#48CAE4" },
  ];

  const ledColors: { id: LedLightingColor; name: string; hex: string }[] = [
    { id: "CYAN_COASTAL", name: "Coastal Cyan", hex: "#00E5FF" },
    { id: "WHITE_CRISP", name: "Crisp White", hex: "#FFFFFF" },
    { id: "ULTRA_BLUE", name: "Ultra Blue", hex: "#2979FF" },
    { id: "AMBER_WARM", name: "Warm Amber", hex: "#FFAB00" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <span className="text-xs font-semibold text-aura-text block mb-2">Coping Stone</span>
        <div className="space-y-2">
          {copings.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onChange({ copingFinish: c.id })}
              className={`w-full flex items-center space-x-3 p-2.5 rounded-[12px] border text-left transition-all duration-300 ease-spring active:scale-[0.99] ${
                config.copingFinish === c.id
                  ? "bg-aura-cyan/[0.06] border-aura-cyan shadow-sm"
                  : "bg-white border-aura-border hover:bg-aura-subtle"
              }`}
            >
              <span className="w-6 h-6 rounded-md border border-black/15 flex-shrink-0" style={{ backgroundColor: c.hex }} />
              <div>
                <span className="text-xs font-bold text-aura-text block">{c.name}</span>
                <span className="text-[11px] text-aura-text-dim block">{c.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="text-xs font-semibold text-aura-text block mb-2">Waterline &amp; Interior</span>
        <div className="space-y-2">
          {interiorFinishes.map((intf) => (
            <button
              key={intf.id}
              type="button"
              onClick={() => onChange({ interiorFinish: intf.id })}
              className={`w-full flex items-center space-x-3 p-2.5 rounded-[12px] border text-left transition-all duration-300 ease-spring ${
                config.interiorFinish === intf.id
                  ? "bg-aura-cyan/[0.06] border-aura-cyan"
                  : "bg-white border-aura-border hover:bg-aura-subtle"
              }`}
            >
              <span className="w-5 h-5 rounded-full border border-black/15 flex-shrink-0" style={{ backgroundColor: intf.hex }} />
              <span className="text-xs font-semibold text-aura-text">{intf.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="text-xs font-semibold text-aura-text block mb-2">Perimeter LED Lights</span>
        <div className="grid grid-cols-2 gap-2">
          {ledColors.map((led) => (
            <button
              key={led.id}
              type="button"
              onClick={() => onChange({ ledColor: led.id })}
              className={`flex items-center space-x-2 p-2.5 rounded-[12px] border text-xs font-semibold transition-all duration-300 ease-spring ${
                config.ledColor === led.id
                  ? "bg-aura-cyan/[0.08] border-aura-cyan text-aura-cyan"
                  : "bg-white border-aura-border text-aura-text hover:bg-aura-subtle"
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full border border-black/20 flex-shrink-0" style={{ backgroundColor: led.hex }} />
              <span className="truncate">{led.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
