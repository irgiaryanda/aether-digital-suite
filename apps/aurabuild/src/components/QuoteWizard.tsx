import React, { useEffect } from "react";
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
  onSyncComplete?: () => void;
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
    p.onQuoteSubmitted,
    p.onSyncComplete
  );

  const handleClose = () => {
    form.resetForm();
    p.onClose();
  };

  useEffect(() => {
    if (!p.isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [p.isOpen]);

  if (!p.isOpen) return null;
  const resolution = resolvePostcode(form.postcode);

  const handleNext = () => {
    if (form.step === 1 && !form.validateStepOne()) {
      return;
    }
    form.setStep((s) => (s + 1) as 2 | 3 | 4);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-wizard-title"
        className="bg-aura-tray p-1.5 rounded-[24px] max-w-lg w-full shadow-2xl"
      >
        <div className="bg-white rounded-[18px] border border-aura-border flex flex-col max-h-[88vh] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-aura-border flex items-center justify-between bg-aura-subtle">
            <div>
              <span className="text-[11px] font-semibold text-aura-cyan block">
                Step {form.step} of 4
              </span>
              <h2 id="quote-wizard-title" className="text-sm font-display font-bold text-aura-text">
                Book Site Measure &amp; Sign-Off
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close Quote Wizard"
              className="min-h-[36px] min-w-[36px] flex items-center justify-center p-1 rounded-full text-aura-text-muted hover:text-aura-text hover:bg-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-5 overflow-y-auto flex-1 text-xs">
            {form.submittedQuote ? (
              <div className="text-center py-5 space-y-3">
                <div className="w-11 h-11 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={28} weight="fill" />
                </div>
                <h3 className="font-display font-bold text-base text-aura-text">Site Measure Reserved</h3>
                <p className="text-xs text-aura-text-muted">
                  Reference: <span className="font-mono font-bold text-aura-cyan">{form.submittedQuote.id}</span>
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-2 px-5 py-2 rounded-full bg-aura-text text-white text-xs font-semibold transition-all duration-300 ease-spring active:scale-[0.98]"
                >
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
                    errors={form.validationErrors}
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
            <div className="px-5 py-3 border-t border-aura-border bg-aura-subtle flex justify-between">
              {form.step > 1 ? (
                <button
                  type="button"
                  onClick={() => form.setStep((s) => (s - 1) as 1 | 2 | 3)}
                  className="min-h-[38px] px-4 py-1.5 rounded-full border border-aura-border bg-white text-xs font-semibold hover:bg-aura-bg flex items-center space-x-1.5 transition-all duration-300 ease-spring active:scale-[0.98]"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
              ) : <div />}

              {form.step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="min-h-[38px] px-5 py-1.5 rounded-full bg-aura-cyan text-white text-xs font-semibold hover:bg-aura-cyan-dark flex items-center space-x-1.5 transition-all duration-300 ease-spring active:scale-[0.98]"
                >
                  <span>Next</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={form.isSubmitting}
                  onClick={form.handleSubmit}
                  className="min-h-[38px] px-5 py-1.5 rounded-full bg-aura-cyan text-white text-xs font-bold hover:bg-aura-cyan-dark disabled:opacity-50 transition-all duration-300 ease-spring active:scale-[0.98]"
                >
                  {form.isSubmitting ? "Syncing Quote..." : "Confirm & Lock Quote"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
