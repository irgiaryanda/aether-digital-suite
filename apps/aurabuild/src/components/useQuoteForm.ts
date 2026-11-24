import { useEffect, useState } from "react";
import {
  AuraQuoteSubmission,
  BillOfMaterials,
  GarageDoorConfig,
  GarageDoorEngineering,
  PoolConfig,
  PoolHydraulics,
  aetherStorage,
  wpRestClient,
} from "@aether/core-engine";

export function useQuoteForm(
  productType: "GARAGE_DOOR" | "LUXURY_POOL",
  garageConfig: GarageDoorConfig,
  garageEngineering: GarageDoorEngineering,
  garageBom: BillOfMaterials,
  poolConfig: PoolConfig,
  poolHydraulics: PoolHydraulics,
  poolBom: BillOfMaterials,
  onQuoteSubmitted: (quote: AuraQuoteSubmission) => void,
  onSyncComplete?: () => void
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
  const [preferredDate, setPreferredDate] = useState("2026-12-04");
  const [timeWindow, setTimeWindow] = useState("MORNING_08_12");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<AuraQuoteSubmission | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (submittedQuote) return;
    setPostcode(productType === "GARAGE_DOOR" ? garageConfig.postcode : poolConfig.postcode);
    setAccessNotes(
      productType === "GARAGE_DOOR"
        ? "Level driveway, double brick with 420mm headroom."
        : "Rear yard access via boundary. 45-tonne crane street setup."
    );
  }, [productType, garageConfig.postcode, poolConfig.postcode, submittedQuote]);

  const activeBom = productType === "GARAGE_DOOR" ? garageBom : poolBom;

  const validateStepOne = (): boolean => {
    const errs: Record<string, string> = {};
    if (customerName.trim().length < 2) {
      errs["customerName"] = "Full name is required.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs["email"] = "Valid Australian contact email is required.";
    }
    if (phone.replace(/\D/g, "").length < 8) {
      errs["phone"] = "Valid phone number with at least 8 digits is required.";
    }
    if (siteAddress.trim().length < 4) {
      errs["siteAddress"] = "Street address is required.";
    }
    if (!/^\d{4}$/.test(postcode.trim())) {
      errs["postcode"] = "Australian postcode must be 4 digits.";
    }

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStepOne()) {
      setStep(1);
      return;
    }

    setIsSubmitting(true);

    const quoteId = `AURA-SUB-${Date.now().toString().slice(-6)}`;
    const newQuote: AuraQuoteSubmission = {
      id: quoteId,
      customerName: customerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      siteAddress: siteAddress.trim(),
      postcode: postcode.trim(),
      productType,
      garageConfig: productType === "GARAGE_DOOR" ? garageConfig : undefined,
      poolConfig: productType === "LUXURY_POOL" ? poolConfig : undefined,
      engineeringSummary: productType === "GARAGE_DOOR" ? garageEngineering : poolHydraulics,
      bom: activeBom,
      installationAccessNotes: `${accessNotes.trim()} | ${preferredDate} (${timeWindow})`,
      status: "PENDING_SITE_MEASURE",
      submittedAt: new Date().toISOString(),
    };

    const wpPayload = {
      customer_name: newQuote.customerName,
      email: newQuote.email,
      phone: newQuote.phone,
      postcode: newQuote.postcode,
      product_type: newQuote.productType,
      installation_access_notes: newQuote.installationAccessNotes,
      engineering_summary: newQuote.engineeringSummary,
      bom: {
        subtotal_ex_gst_aud: activeBom.subtotalExGstAud,
        gst_aud: activeBom.gstAud,
        total_inc_gst_aud: activeBom.totalIncGstAud,
      },
    };

    await wpRestClient.dispatchWithFallback(
      "/wp-json/aether/v1/aura-quotes",
      "POST",
      wpPayload,
      {
        success: true,
        quote_id: 9001,
        quote_reference: quoteId,
        status: "PENDING_SITE_MEASURE",
      },
      { appKey: "aurabuild" }
    );

    aetherStorage.setState((current) => ({
      ...current,
      aura: { ...current.aura, quotes: [newQuote, ...current.aura.quotes] },
    }));

    setIsSubmitting(false);
    setSubmittedQuote(newQuote);
    onQuoteSubmitted(newQuote);
    onSyncComplete?.();
  };

  const resetForm = () => {
    setSubmittedQuote(null);
    setValidationErrors({});
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
    validationErrors,
    validateStepOne,
    handleSubmit,
    resetForm,
    activeBom,
  };
}
