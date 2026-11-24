import React, { useEffect, useRef, useState } from "react";
import { AustralianWholesaler } from "@aether/core-engine";
import { UploadSimple, FileText, Image as ImageIcon, Trash, Sparkle } from "@phosphor-icons/react";

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
        <span className="text-gray-400">Wholesaler Tax Invoice Scan</span>
        <button
          type="button"
          onClick={handleSimulate}
          className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-volt-amber border border-amber-500/30 flex items-center space-x-1 font-semibold"
        >
          <Sparkle size={11} weight="fill" />
          <span>Simulate OCR Scan</span>
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
          className={`p-3 rounded-lg border border-dashed cursor-pointer text-center transition-colors ${
            isDragging
              ? "border-volt-amber bg-amber-500/10 text-volt-amber"
              : "border-volt-border bg-volt-base hover:border-gray-500 text-gray-400"
          }`}
        >
          <UploadSimple size={18} className="mx-auto mb-1 text-volt-amber" />
          <div className="text-[11px] text-white font-semibold">
            Drop Wholesaler Receipt PDF or Photo
          </div>
          <div className="text-[10px] text-gray-500">
            Supports PDF, JPG, PNG up to 10MB
          </div>
        </div>
      ) : (
        <div className="p-2.5 rounded-lg border border-emerald-500/40 bg-emerald-950/30 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            {attachedFile.previewUrl ? (
              <img
                src={attachedFile.previewUrl}
                alt="Uploaded invoice preview"
                className="w-9 h-9 rounded object-cover border border-white/10 flex-shrink-0"
              />
            ) : attachedFile.type.includes("pdf") ? (
              <FileText size={24} className="text-volt-amber flex-shrink-0" weight="fill" />
            ) : (
              <ImageIcon size={24} className="text-emerald-400 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-white truncate">{attachedFile.name}</div>
              <div className="text-[10px] text-emerald-400">{attachedFile.sizeKb} KB verified</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onAttach(null)}
            aria-label="Remove Attached Receipt"
            className="p-1.5 rounded text-gray-400 hover:text-red-400"
          >
            <Trash size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
