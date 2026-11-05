import { useState } from "react";
import {
  AuraQuoteSubmission,
  BillOfMaterials,
  GarageDoorConfig,
  GarageDoorEngineering,
  PoolConfig,
  PoolHydraulics,
  aetherStorage,
} from "@aether/core-engine";

export function useQuoteForm(
  productType: "GARAGE_DOOR" | "LUXURY_POOL",
  garageConfig: GarageDoorConfig,
  garageEngineering: GarageDoorEngineering,
  garageBom: BillOfMaterials,
  poolConfig: PoolConfig,
  poolHydraulics: PoolHydraulics,
  poolBom: BillOfMaterials,
  onQuoteSubmitted: (quote: AuraQuoteSubmission) => void
) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [customerName, setCustomerName] = useState("Julian Vance");
  const [email, setEmail] = useState("j.vance@architecturalpartners.com.au");
  const [phone, setPhone] = useState("+61 412 889 012");
  const [siteAddress, setSiteAddress] = useState("14 Raglan Street");
  const [postcode, setPostcode] = useState(
    productType === "GARAGE_DOOR" ? garageConfig.postcode : poolConfig.postcode
  );
  const [accessNotes, setAccessNotes] = useState(
    productType === "GARAGE_DOOR"
      ? "Level driveway, double brick with 420mm headroom."
      : "Rear yard access via boundary. 45-tonne crane street setup."
  );
  const [preferredDate, setPreferredDate] = useState("2026-11-20");
  const [timeWindow, setTimeWindow] = useState("MORNING_08_12");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<AuraQuoteSubmission | null>(null);

  const activeBom = productType === "GARAGE_DOOR" ? garageBom : poolBom;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));

    const quoteId = `AURA-SUB-${Date.now().toString().slice(-6)}`;
    const newQuote: AuraQuoteSubmission = {
      id: quoteId,
      customerName,
      email,
      phone,
      siteAddress,
      postcode,
      productType,
      garageConfig: productType === "GARAGE_DOOR" ? garageConfig : undefined,
      poolConfig: productType === "LUXURY_POOL" ? poolConfig : undefined,
      engineeringSummary: productType === "GARAGE_DOOR" ? garageEngineering : poolHydraulics,
      bom: activeBom,
      installationAccessNotes: `${accessNotes} | ${preferredDate} (${timeWindow})`,
      status: "PENDING_SITE_MEASURE",
      submittedAt: new Date().toISOString(),
    };

    aetherStorage.setState((current) => ({
      ...current,
      aura: { ...current.aura, quotes: [newQuote, ...current.aura.quotes] },
    }));

    setIsSubmitting(false);
    setSubmittedQuote(newQuote);
    onQuoteSubmitted(newQuote);
  };

  const resetForm = () => {
    setSubmittedQuote(null);
    setStep(1);
  };

  return {
    step,
    setStep,
    customerName,
    setCustomerName,
    email,
    setEmail,
    phone,
    setPhone,
    siteAddress,
    setSiteAddress,
    postcode,
    setPostcode,
    accessNotes,
    setAccessNotes,
    preferredDate,
    setPreferredDate,
    timeWindow,
    setTimeWindow,
    isSubmitting,
    submittedQuote,
    handleSubmit,
    resetForm,
    activeBom,
  };
}
