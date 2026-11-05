import React from "react";

interface Props {
  accessNotes: string;
  setAccessNotes: (v: string) => void;
}

export const QuoteStepTwo: React.FC<Props> = ({ accessNotes, setAccessNotes }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="font-semibold text-aura-text block mb-1">Site Accessibility & Access Notes</label>
        <textarea
          rows={4}
          value={accessNotes}
          onChange={(e) => setAccessNotes(e.target.value)}
          className="w-full px-3 py-2 border border-aura-border rounded-lg text-xs"
          placeholder="Detail driveway slope, headroom clearance, overhead powerlines, side-gate dimensions..."
        />
      </div>
      <div className="p-2.5 bg-aura-subtle rounded-lg border border-aura-border text-[11px] text-aura-text-dim">
        Our field surveyor uses 3D laser scanners to measure wall squareness, lintel sag, and structural anchor integrity prior to manufacturing.
      </div>
    </div>
  );
};
