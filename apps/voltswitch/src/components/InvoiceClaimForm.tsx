import React, { useMemo, useState } from "react";
import {
  AustralianWholesaler,
  ContractorProfile,
  PointsLedgerEntry,
  VERIFIED_AUSTRALIAN_WHOLESALERS,
  calculateInvoicePoints,
  createLedgerCredit,
  validateAustralianBusinessNumber,
} from "@aether/core-engine";
import { CheckCircle, Warning, Receipt } from "@phosphor-icons/react";
import { WholesalerSelector } from "./WholesalerSelector";

interface Props {
  contractor: ContractorProfile;
  existingLedger: PointsLedgerEntry[];
  onClaimSubmitted: (entry: PointsLedgerEntry, updatedContractor: ContractorProfile) => void;
}

export const InvoiceClaimForm: React.FC<Props> = ({
  contractor,
  existingLedger,
  onClaimSubmitted,
}) => {
  const [wholesaler, setWholesaler] = useState<AustralianWholesaler>("REXEL_ELECTRICAL");
  const [abn, setAbn] = useState("51 824 753 556");
  const [invNum, setInvNum] = useState("INV-REX-98124");
  const [subtotal, setSubtotal] = useState("8333.33");
  const [status, setStatus] = useState<{ err?: string; msg?: string }>({});

  const isValidAbn = useMemo(() => validateAustralianBusinessNumber(abn), [abn]);
  const amount = parseFloat(subtotal) || 0;
  const points = useMemo(() => calculateInvoicePoints(amount, contractor.tier), [amount, contractor.tier]);

  const selectWholesaler = (id: AustralianWholesaler) => {
    setWholesaler(id);
    const meta = VERIFIED_AUSTRALIAN_WHOLESALERS.find((w) => w.id === id);
    if (meta) setAbn(meta.abn);
  };

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({});

    if (!isValidAbn) {
      setStatus({ err: "ABN failed ATO Modulus 89 checksum verification." });
      return;
    }
    if (amount <= 0) {
      setStatus({ err: "Subtotal must be greater than zero." });
      return;
    }

    const dup = existingLedger.some((en) => en.referenceType === "INVOICE_CLAIM" && en.referenceId === invNum);
    if (dup) {
      setStatus({ err: `Invoice #${invNum} already claimed.` });
      return;
    }

    const { updatedBalance, entry } = createLedgerCredit(
      contractor.contractorId,
      contractor.currentPointsBalance,
      points,
      "INVOICE_CLAIM",
      invNum,
      `${wholesaler.replace(/_/g, " ")} claim ($${amount.toFixed(2)} ex-GST)`
    );

    const updated = {
      ...contractor,
      currentPointsBalance: updatedBalance,
      annualSpendAud: contractor.annualSpendAud + amount,
      lifetimePointsEarned: contractor.lifetimePointsEarned + points,
    };

    onClaimSubmitted(entry, updated);
    setStatus({ msg: `Credited +${points.toLocaleString()} points.` });
    setInvNum(`INV-${Date.now().toString().slice(-6)}`);
  };

  return (
    <div className="bg-volt-surface rounded-xl border border-volt-border p-4 shadow-lg space-y-3 font-mono text-xs">
      <div className="flex items-center space-x-2 border-b border-volt-border pb-2">
        <Receipt size={16} className="text-volt-amber" weight="fill" />
        <h3 className="font-bold text-white">Wholesaler Invoice Tax Claim</h3>
      </div>

      {status.err && (
        <div className="p-2 bg-red-950/60 border border-red-500/50 rounded text-red-300 flex items-center space-x-1.5">
          <Warning size={14} className="text-red-400" />
          <span>{status.err}</span>
        </div>
      )}

      {status.msg && (
        <div className="p-2 bg-emerald-950/60 border border-emerald-500/50 rounded text-emerald-300 flex items-center space-x-1.5">
          <CheckCircle size={14} className="text-emerald-400" />
          <span>{status.msg}</span>
        </div>
      )}

      <form onSubmit={handleClaim} className="space-y-3">
        <WholesalerSelector
          selectedWholesaler={wholesaler}
          onSelect={selectWholesaler}
          abn={abn}
          onAbnChange={setAbn}
          isValidAbn={isValidAbn}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <span className="text-gray-400 block mb-0.5">Invoice #</span>
            <input
              type="text"
              value={invNum}
              onChange={(e) => setInvNum(e.target.value)}
              className="w-full px-2 py-1 bg-volt-base border border-volt-border rounded text-white"
            />
          </div>

          <div>
            <span className="text-gray-400 block mb-0.5">Subtotal ex-GST (AUD)</span>
            <input
              type="number"
              step="0.01"
              value={subtotal}
              onChange={(e) => setSubtotal(e.target.value)}
              className="w-full px-2 py-1 bg-volt-base border border-volt-border rounded text-white"
            />
          </div>
        </div>

        <div className="p-2 bg-volt-base rounded border border-volt-border flex items-center justify-between">
          <span className="text-gray-400">Points Yield ({contractor.tier} 1.5x)</span>
          <span className="text-volt-amber font-bold tabular-nums">+{points.toLocaleString()} pts</span>
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded bg-volt-amber hover:bg-amber-400 text-black font-bold uppercase transition-colors"
        >
          Submit Wholesaler Claim &rarr;
        </button>
      </form>
    </div>
  );
};
