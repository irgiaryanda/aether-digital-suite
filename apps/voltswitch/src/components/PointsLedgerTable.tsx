import React from "react";
import { PointsLedgerEntry } from "@aether/core-engine";
import { ArrowDownLeft, ArrowUpRight, ClockCounterClockwise } from "@phosphor-icons/react";

interface Props {
  ledger: PointsLedgerEntry[];
}

export const PointsLedgerTable: React.FC<Props> = ({ ledger }) => {
  return (
    <div className="bg-volt-tray rounded-[20px] p-1.5 border border-white/[0.08]">
      <div className="bg-volt-surface rounded-[14px] p-5 border border-white/[0.06] space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center space-x-2">
            <ClockCounterClockwise size={17} className="text-volt-amber" weight="bold" />
            <h2 className="font-bold text-sm text-volt-ink tracking-tight">Double-Entry Points Audit Ledger</h2>
          </div>
          <span className="text-[11px] font-mono text-volt-muted tabular-nums">
            {ledger.length} Recorded
          </span>
        </div>

        {ledger.length === 0 ? (
          <div className="py-10 px-4 text-center rounded-[12px] bg-volt-recessed border border-white/[0.06] space-y-1.5">
            <p className="text-xs font-semibold text-volt-ink">No ledger entries recorded</p>
            <p className="text-[11px] text-volt-muted">
              Submit a verified wholesaler tax invoice or redeem rewards to generate an immutable double-entry ledger row.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[420px] divide-y divide-white/[0.06]">
            {ledger.map((entry) => {
              const isCredit = entry.transactionType === "CREDIT";
              return (
                <div key={entry.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-2.5">
                    <span
                      className={`mt-0.5 p-1.5 rounded-[8px] ${
                        isCredit ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {isCredit ? <ArrowDownLeft size={14} weight="bold" /> : <ArrowUpRight size={14} weight="bold" />}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-volt-ink text-xs">{entry.referenceId}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-volt-recessed text-volt-muted border border-white/[0.06]">
                          {entry.referenceType}
                        </span>
                      </div>
                      <p className="text-xs text-volt-muted mt-0.5">{entry.description}</p>
                      <span className="text-[11px] font-mono text-volt-dim mt-0.5 block">
                        {new Date(entry.timestamp).toLocaleString("en-AU")}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 font-mono">
                    <span
                      className={`font-bold tabular-nums block text-xs ${
                        isCredit ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {isCredit ? "+" : ""}
                      {entry.pointsDelta.toLocaleString()} pts
                    </span>
                    <span className="text-[11px] text-volt-muted tabular-nums">
                      Bal: {entry.balanceAfter.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
