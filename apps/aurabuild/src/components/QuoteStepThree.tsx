import React from "react";

interface Props {
  preferredDate: string;
  setPreferredDate: (v: string) => void;
  timeWindow: string;
  setTimeWindow: (v: string) => void;
}

export const QuoteStepThree: React.FC<Props> = ({
  preferredDate,
  setPreferredDate,
  timeWindow,
  setTimeWindow,
}) => {
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="quote-preferred-date" className="font-semibold text-aura-text block mb-1">
            Preferred Site Measure Date
          </label>
          <input
            id="quote-preferred-date"
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="w-full px-3 py-2 border border-aura-border rounded-[10px] text-xs font-mono tabular-nums text-aura-text bg-white focus:border-aura-cyan focus:outline-none transition-colors duration-200"
          />
        </div>
        <div>
          <label htmlFor="quote-time-window" className="font-semibold text-aura-text block mb-1">
            Arrival Window
          </label>
          <select
            id="quote-time-window"
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.target.value)}
            className="w-full px-3 py-2 border border-aura-border rounded-[10px] text-xs text-aura-text bg-white focus:border-aura-cyan focus:outline-none transition-colors duration-200"
          >
            <option value="MORNING_08_12">Morning: 08:00 AM - 12:00 PM</option>
            <option value="AFTERNOON_12_16">Afternoon: 12:00 PM - 04:00 PM</option>
            <option value="TWILIGHT_16_18">Twilight: 04:00 PM - 06:00 PM</option>
          </select>
        </div>
      </div>
      <div className="p-3 bg-aura-subtle rounded-[10px] border border-aura-border text-[11px] text-aura-text-dim leading-relaxed">
        A senior project engineer will inspect site structural anchor points and confirm AS/NZS 4505 or pool excavation access during this appointment.
      </div>
    </div>
  );
};
