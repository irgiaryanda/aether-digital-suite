import React, { useMemo, useState } from "react";
import {
  AustralianWholesaler,
  CONTRACTOR_TIERS,
  ContractorProfile,
  PointsLedgerEntry,
  VERIFIED_AUSTRALIAN_WHOLESALERS,
  calculateInvoicePoints,
  createLedgerCredit,
  resolveContractorTier,
  validateAustralianBusinessNumber,
  wpRestClient,
} from "@aether/core-engine";
import { ArrowRight, CheckCircle, Receipt, Warning } from "@phosphor-icons/react";
import { WholesalerSelector } from "./WholesalerSelector";
import { AttachedReceipt, InvoiceReceiptDropzone } from "./InvoiceReceiptDropzone";

interface Props {
  contractor: ContractorProfile;
  existingLedger: PointsLedgerEntry[];
  onClaimSubmitted: (entry: PointsLedgerEntry, updatedContractor: ContractorProfile) => void;
  onSyncComplete?: () => void;
}

export const InvoiceClaimForm: React.FC<Props> = ({
  contractor,
  existingLedger,
  onClaimSubmitted,
  onSyncComplete,
}) => {
  const [wholesaler, setWholesaler] = useState<AustralianWholesaler>("REXEL_ELECTRICAL");
  const [abn, setAbn] = useState("51 824 753 556");
  const [invNum, setInvNum] = useState("INV-REX-98124");
  const [subtotal, setSubtotal] = useState("8333.33");
  const [attachedReceipt, setAttachedReceipt] = useState<AttachedReceipt | null>(null);
  const [status, setStatus] = useState<{ err?: string; msg?: string }>({});

  const isValidAbn = useMemo(() => validateAustralianBusinessNumber(abn), [abn]);
  const amount = parseFloat(subtotal) || 0;
  const activeTierMeta = CONTRACTOR_TIERS[contractor.tier];
  const points = useMemo(() => calculateInvoicePoints(amount, contractor.tier), [amount, contractor.tier]);

  const platinumThreshold = CONTRACTOR_TIERS.PLATINUM.thresholdSpendAud;
  const spendProgressPercent = Math.min(100, Math.round((contractor.annualSpendAud / platinumThreshold) * 100));
  const remainingToPlatinum = Math.max(0, platinumThreshold - contractor.annualSpendAud);

  const selectWholesaler = (id: AustralianWholesaler) => {
    setWholesaler(id);
    const meta = VERIFIED_AUSTRALIAN_WHOLESALERS.find((w) => w.id === id);
    if (meta) setAbn(meta.abn);
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({});

    if (!isValidAbn) {
      setStatus({ err: "ABN failed ATO Modulus 89 checksum verification." });
      return;
    }
    if (!invNum.trim()) {
      setStatus({ err: "Tax invoice number is required." });
      return;
    }
    if (amount <= 0) {
      setStatus({ err: "Subtotal must be greater than zero." });
      return;
    }

    const dup = existingLedger.some((en) => en.referenceType === "INVOICE_CLAIM" && en.referenceId === invNum.trim());
    if (dup) {
      setStatus({ err: `Invoice #${invNum} already claimed.` });
      return;
    }

    const { updatedBalance, entry } = createLedgerCredit(
      contractor.contractorId,
      contractor.currentPointsBalance,
      points,
      "INVOICE_CLAIM",
      invNum.trim(),
      `${wholesaler.replace(/_/g, " ")} claim ($${amount.toFixed(2)} ex-GST)`
    );

    const nextAnnualSpend = Math.round((contractor.annualSpendAud + amount) * 100) / 100;
    const resolvedNextTier = resolveContractorTier(nextAnnualSpend);
    const tierUpgraded = resolvedNextTier.tier !== contractor.tier;

    await wpRestClient.dispatchWithFallback(
      "/wp-json/aether/v1/volt-claims",
      "POST",
      {
        invoice_number: invNum.trim(),
        wholesaler,
        wholesaler_abn: abn,
        subtotal_ex_gst_aud: amount,
      },
      {
        success: true,
        claim_id: `CLAIM-2026-${Date.now().toString().slice(-4)}`,
        awarded_points: points,
        new_balance: updatedBalance,
        tier: resolvedNextTier.tier,
      },
      { appKey: "voltswitch" }
    );

    const updated: ContractorProfile = {
      ...contractor,
      tier: resolvedNextTier.tier,
      currentPointsBalance: updatedBalance,
      annualSpendAud: nextAnnualSpend,
      lifetimePointsEarned: contractor.lifetimePointsEarned + points,
    };

    onClaimSubmitted(entry, updated);
    onSyncComplete?.();

    const upgradeNote = tierUpgraded
      ? ` Upgraded to ${resolvedNextTier.tier} ${resolvedNextTier.multiplier}x tier.`
      : "";
    setStatus({ msg: `Credited +${points.toLocaleString()} points.${upgradeNote}` });
    setInvNum(`INV-${Date.now().toString().slice(-6)}`);
    setAttachedReceipt(null);
  };

  return (
    <div className="bg-volt-tray rounded-[20px] p-1.5 border border-white/[0.08]">
      <div className="bg-volt-surface rounded-[14px] p-5 border border-white/[0.06] space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center space-x-2">
            <Receipt size={17} className="text-volt-amber" weight="fill" />
            <h2 className="font-bold text-sm text-volt-ink tracking-tight">Wholesaler Invoice Tax Claim</h2>
          </div>
          <span className="text-[11px] font-mono text-volt-amber font-bold tabular-nums">
            {contractor.tier} {activeTierMeta.multiplier}x
          </span>
        </div>

        <div className="p-3 bg-volt-recessed rounded-[12px] border border-white/[0.06] space-y-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-volt-muted">
              Annual Spend: <strong className="font-mono text-volt-ink tabular-nums">${contractor.annualSpendAud.toLocaleString()}</strong>
            </span>
            <span className="font-mono text-volt-amber font-semibold tabular-nums">
              {contractor.tier === "PLATINUM"
                ? "PLATINUM MAX 2.0x"
                : `$${remainingToPlatinum.toLocaleString()} to Platinum`}
            </span>
          </div>
          <div className="w-full h-1.5 bg-volt-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-volt-amber transition-all duration-300 ease-spring"
              style={{ width: `${spendProgressPercent}%` }}
            />
          </div>
        </div>

        {status.err && (
          <div className="p-2.5 bg-red-950/60 border border-red-500/40 rounded-[10px] text-red-300 flex items-center space-x-2">
            <Warning size={15} className="text-red-400 flex-shrink-0" />
            <span>{status.err}</span>
          </div>
        )}

        {status.msg && (
          <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-[10px] text-emerald-300 flex items-center space-x-2">
            <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" weight="fill" />
            <span>{status.msg}</span>
          </div>
        )}

        <form onSubmit={handleClaim} className="space-y-3.5">
          <WholesalerSelector
            selectedWholesaler={wholesaler}
            onSelect={selectWholesaler}
            abn={abn}
            onAbnChange={setAbn}
            isValidAbn={isValidAbn}
          />

          <InvoiceReceiptDropzone
            attachedFile={attachedReceipt}
            onAttach={setAttachedReceipt}
            onSimulateOcr={(preset) => {
              selectWholesaler(preset.wholesaler);
              setInvNum(preset.invoiceNumber);
              setSubtotal(preset.subtotalExGst);
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="volt-invoice-num" className="text-volt-muted font-medium block mb-1">
                Invoice #
              </label>
              <input
                id="volt-invoice-num"
                type="text"
                value={invNum}
                onChange={(e) => setInvNum(e.target.value)}
                className="w-full px-3 py-2 bg-volt-recessed border border-white/[0.08] rounded-[10px] font-mono text-volt-ink focus:border-volt-amber focus:outline-none transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="volt-subtotal-gst" className="text-volt-muted font-medium block mb-1">
                Subtotal ex-GST (AUD)
              </label>
              <input
                id="volt-subtotal-gst"
                type="number"
                step="0.01"
                value={subtotal}
                onChange={(e) => setSubtotal(e.target.value)}
                className="w-full px-3 py-2 bg-volt-recessed border border-white/[0.08] rounded-[10px] font-mono tabular-nums text-volt-ink focus:border-volt-amber focus:outline-none transition-colors duration-200"
              />
            </div>
          </div>

          <div className="p-3 bg-volt-recessed rounded-[12px] border border-white/[0.06] flex items-center justify-between">
            <span className="text-volt-muted">Points Yield ({contractor.tier} {activeTierMeta.multiplier}x)</span>
            <span className="font-mono text-volt-amber font-bold tabular-nums">+{points.toLocaleString()} pts</span>
          </div>

          <button
            type="submit"
            className="group w-full min-h-[42px] px-4 py-2 rounded-full bg-volt-amber hover:bg-volt-amber-hover text-volt-base font-bold text-xs flex items-center justify-center space-x-2 transition-all duration-200 ease-spring active:scale-[0.98] shadow-sm"
          >
            <span>Submit Wholesaler Claim</span>
            <span className="w-5 h-5 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
              <ArrowRight size={12} weight="bold" />
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
