import React from "react";
import { PointsLedgerEntry } from "@aether/core-engine";
import { ArrowDownLeft, ArrowUpRight, ClockCounterClockwise } from "@phosphor-icons/react";

interface Props {
  ledger: PointsLedgerEntry[];
}

export const PointsLedgerTable: React.FC<Props> = ({ ledger }) => {
  return (
    <div className="bg-volt-surface rounded-xl border border-volt-border p-4 shadow-lg space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-volt-border pb-2.5">
        <div className="flex items-center space-x-2">
          <ClockCounterClockwise size={16} className="text-volt-amber" weight="bold" />
          <h3 className="font-bold text-white">Double-Entry Points Audit Ledger</h3>
        </div>
        <span className="text-[10px] text-gray-400">
          {ledger.length} Recorded Transactions
        </span>
      </div>

      <div className="overflow-x-auto max-h-72 divide-y divide-volt-border/50">
        {ledger.map((entry) => {
          const isCredit = entry.transactionType === "CREDIT";
          return (
            <div key={entry.id} className="py-2.5 flex items-start justify-between gap-3">
              <div className="flex items-start space-x-2">
                <span
                  className={`mt-0.5 p-1 rounded ${
                    isCredit ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {isCredit ? <ArrowDownLeft size={14} weight="bold" /> : <ArrowUpRight size={14} weight="bold" />}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-[11px]">{entry.referenceId}</span>
                    <span className="text-[9px] px-1 rounded bg-volt-elevated text-gray-400">
                      {entry.referenceType}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{entry.description}</p>
                  <span className="text-[10px] text-gray-500">
                    {new Date(entry.timestamp).toLocaleString("en-AU")}
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span
                  className={`font-bold tabular-nums block ${
                    isCredit ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isCredit ? "+" : ""}{entry.pointsDelta.toLocaleString()} pts
                </span>
                <span className="text-[10px] text-gray-400 tabular-nums">
                  Bal: {entry.balanceAfter.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
