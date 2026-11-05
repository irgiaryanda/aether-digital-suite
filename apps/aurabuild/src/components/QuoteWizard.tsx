import React from "react";
import {
  AuraQuoteSubmission,
  BillOfMaterials,
  GarageDoorConfig,
  GarageDoorEngineering,
  PoolConfig,
  PoolHydraulics,
  resolvePostcode,
} from "@aether/core-engine";
import { X, CheckCircle, ArrowRight, ArrowLeft } from "@phosphor-icons/react";
import { useQuoteForm } from "./useQuoteForm";
import { QuoteStepOne } from "./QuoteStepOne";
import { QuoteStepTwo } from "./QuoteStepTwo";
import { QuoteStepThree } from "./QuoteStepThree";
import { QuoteStepFour } from "./QuoteStepFour";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productType: "GARAGE_DOOR" | "LUXURY_POOL";
  garageConfig: GarageDoorConfig;
  garageEngineering: GarageDoorEngineering;
  garageBom: BillOfMaterials;
  poolConfig: PoolConfig;
  poolHydraulics: PoolHydraulics;
  poolBom: BillOfMaterials;
  onQuoteSubmitted: (quote: AuraQuoteSubmission) => void;
}

export const QuoteWizard: React.FC<Props> = (p) => {
  const form = useQuoteForm(
    p.productType,
    p.garageConfig,
    p.garageEngineering,
    p.garageBom,
    p.poolConfig,
    p.poolHydraulics,
    p.poolBom,
    p.onQuoteSubmitted
  );

  if (!p.isOpen) return null;
  const resolution = resolvePostcode(form.postcode);

  const handleClose = () => {
    form.resetForm();
    p.onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-lg w-full border border-aura-border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        <div className="px-4 py-3 border-b border-aura-border flex items-center justify-between bg-aura-subtle">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-aura-cyan">Engineering Measure</span>
            <h2 className="text-sm font-display font-bold text-aura-text">Book Site Measure & Sign-Off</h2>
          </div>
          <button type="button" onClick={handleClose} className="p-1 rounded text-aura-text-muted hover:text-aura-text">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 text-xs">
          {form.submittedQuote ? (
            <div className="text-center py-4 space-y-2.5">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={28} weight="fill" />
              </div>
              <h3 className="font-display font-bold text-base text-aura-text">Site Measure Reserved</h3>
              <p className="text-xs text-aura-text-muted">
                Reference: <span className="font-mono font-bold text-aura-cyan">{form.submittedQuote.bom.quoteReference}</span>
              </p>
              <button type="button" onClick={handleClose} className="mt-2 px-4 py-1.5 rounded-lg bg-aura-monument text-white text-xs font-semibold">
                Close
              </button>
            </div>
          ) : (
            <>
              {form.step === 1 && (
                <QuoteStepOne
                  customerName={form.customerName}
                  setCustomerName={form.setCustomerName}
                  phone={form.phone}
                  setPhone={form.setPhone}
                  email={form.email}
                  setEmail={form.setEmail}
                  siteAddress={form.siteAddress}
                  setSiteAddress={form.setSiteAddress}
                  postcode={form.postcode}
                  setPostcode={form.setPostcode}
                />
              )}
              {form.step === 2 && <QuoteStepTwo accessNotes={form.accessNotes} setAccessNotes={form.setAccessNotes} />}
              {form.step === 3 && (
                <QuoteStepThree
                  preferredDate={form.preferredDate}
                  setPreferredDate={form.setPreferredDate}
                  timeWindow={form.timeWindow}
                  setTimeWindow={form.setTimeWindow}
                />
              )}
              {form.step === 4 && (
                <QuoteStepFour
                  productType={p.productType}
                  customerName={form.customerName}
                  phone={form.phone}
                  siteAddress={form.siteAddress}
                  postcode={form.postcode}
                  windRegion={resolution.windRegion}
                  bom={form.activeBom}
                />
              )}
            </>
          )}
        </div>

        {!form.submittedQuote && (
          <div className="px-4 py-2.5 border-t border-aura-border bg-aura-subtle flex justify-between">
            {form.step > 1 ? (
              <button
                type="button"
                onClick={() => form.setStep((s) => (s - 1) as 1 | 2 | 3)}
                className="px-3 py-1.5 rounded-lg border border-aura-border text-xs font-semibold hover:bg-white flex items-center space-x-1"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
            ) : <div />}

            {form.step < 4 ? (
              <button
                type="button"
                onClick={() => form.setStep((s) => (s + 1) as 2 | 3 | 4)}
                className="px-4 py-1.5 rounded-lg bg-aura-cyan text-white text-xs font-semibold hover:bg-[#0c627a] flex items-center space-x-1"
              >
                <span>Next</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                disabled={form.isSubmitting}
                onClick={form.handleSubmit}
                className="px-4 py-1.5 rounded-lg bg-aura-cyan text-white text-xs font-bold hover:bg-[#0c627a] disabled:opacity-50"
              >
                {form.isSubmitting ? "Locking..." : "Confirm & Lock Quote"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
