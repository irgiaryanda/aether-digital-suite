import React, { useEffect, useRef, useState } from "react";
import { AustralianWholesaler } from "@aether/core-engine";
import { UploadSimple, FileText, Image as ImageIcon, Trash, Lightning } from "@phosphor-icons/react";

export interface AttachedReceipt {
  name: string;
  sizeKb: number;
  type: string;
  previewUrl?: string;
}

interface Props {
  attachedFile: AttachedReceipt | null;
  onAttach: (file: AttachedReceipt | null) => void;
  onSimulateOcr: (preset: {
    wholesaler: AustralianWholesaler;
    invoiceNumber: string;
    subtotalExGst: string;
  }) => void;
}

export const InvoiceReceiptDropzone: React.FC<Props> = ({
  attachedFile,
  onAttach,
  onSimulateOcr,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (attachedFile?.previewUrl) {
        URL.revokeObjectURL(attachedFile.previewUrl);
      }
    };
  }, [attachedFile]);

  const handleFileObject = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const previewUrl = isImage ? URL.createObjectURL(file) : undefined;
    onAttach({
      name: file.name,
      sizeKb: Math.max(1, Math.round(file.size / 1024)),
      type: file.type || "application/pdf",
      previewUrl,
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileObject(file);
  };

  const handleSimulate = () => {
    onAttach({
      name: "REXEL-TAX-INV-2026-4418.pdf",
      sizeKb: 284,
      type: "application/pdf",
    });
    onSimulateOcr({
      wholesaler: "LAWRENCE_AND_HANSON",
      invoiceNumber: `INV-LH-${Date.now().toString().slice(-5)}`,
      subtotalExGst: "16250.00",
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-volt-muted font-medium">Wholesaler Tax Invoice Scan</span>
        <button
          type="button"
          onClick={handleSimulate}
          className="text-[11px] px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-volt-amber border border-amber-500/30 flex items-center space-x-1 font-semibold transition-colors duration-200"
        >
          <Lightning size={12} weight="fill" />
          <span>Load OCR Sample</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFileObject(f);
        }}
      />

      {!attachedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={`p-3.5 rounded-[12px] border border-dashed cursor-pointer text-center transition-colors duration-200 ${
            isDragging
              ? "border-volt-amber bg-amber-500/10 text-volt-amber"
              : "border-white/[0.14] bg-volt-recessed hover:border-white/[0.28] text-volt-muted"
          }`}
        >
          <UploadSimple size={18} className="mx-auto mb-1 text-volt-amber" />
          <div className="text-xs text-volt-ink font-semibold">
            Drop Wholesaler Receipt PDF or Photo
          </div>
          <div className="text-[11px] text-volt-dim mt-0.5">
            Supports PDF, JPG, PNG up to 10MB
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-[12px] border border-emerald-500/40 bg-emerald-950/30 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            {attachedFile.previewUrl ? (
              <img
                src={attachedFile.previewUrl}
                alt="Uploaded invoice preview"
                className="w-9 h-9 rounded-[8px] object-cover border border-white/10 flex-shrink-0"
              />
            ) : attachedFile.type.includes("pdf") ? (
              <FileText size={22} className="text-volt-amber flex-shrink-0" weight="fill" />
            ) : (
              <ImageIcon size={22} className="text-emerald-400 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <div className="text-xs font-mono font-bold text-volt-ink truncate">{attachedFile.name}</div>
              <div className="text-[11px] text-emerald-400 font-mono tabular-nums">{attachedFile.sizeKb} KB verified</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onAttach(null)}
            aria-label="Remove Attached Receipt"
            className="p-1.5 rounded-[8px] text-volt-muted hover:text-red-400 transition-colors"
          >
            <Trash size={15} />
          </button>
        </div>
      )}
    </div>
  );
};
