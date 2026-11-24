import React from "react";

interface Props {
  accessNotes: string;
  setAccessNotes: (v: string) => void;
}

export const QuoteStepTwo: React.FC<Props> = ({ accessNotes, setAccessNotes }) => {
  return (
    <div className="space-y-3.5">
      <div>
        <label htmlFor="quote-access-notes" className="font-semibold text-aura-text block mb-1">
          Site Accessibility & Access Notes
        </label>
        <textarea
          id="quote-access-notes"
          rows={4}
          value={accessNotes}
          onChange={(e) => setAccessNotes(e.target.value)}
          className="w-full px-3 py-2 border border-aura-border rounded-[10px] text-xs text-aura-text bg-white focus:border-aura-cyan focus:outline-none transition-colors duration-200"
          placeholder="Detail driveway slope, headroom clearance, overhead powerlines, side-gate dimensions..."
        />
      </div>
      <div className="p-3 bg-aura-subtle rounded-[10px] border border-aura-border text-[11px] text-aura-text-dim leading-relaxed">
        Our field surveyor uses 3D laser scanners to measure wall squareness, lintel sag, and structural anchor integrity prior to manufacturing.
      </div>
    </div>
  );
};
