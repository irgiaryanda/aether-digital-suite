import React from "react";
import { AgencyTaxInvoice } from "@aether/core-engine";
import { DownloadSimple, Printer, Receipt } from "@phosphor-icons/react";

interface Props {
  invoice: AgencyTaxInvoice;
}

export const TaxInvoicePreview: React.FC<Props> = ({ invoice }) => {
  const handleExportCsv = () => {
    const rows = [
      "Field,Value",
      `Invoice Number,${invoice.invoiceNumber}`,
      `Invoice Date,${invoice.invoiceDate}`,
      `Agency ABN,${invoice.agencyAbn}`,
      `Client Name,${invoice.clientName}`,
      `Client ABN,${invoice.clientAbn}`,
      `Project,${invoice.projectName}`,
      "",
      "Phase,Hours,Rate AUD,Line Total AUD",
    ];

    invoice.lineItems.forEach((li) => {
      rows.push(`"${li.phaseLabel}",${li.hours},${li.hourlyRateAud},${li.lineTotalAud.toFixed(2)}`);
    });

    rows.push(`Subtotal ex-GST,,,${invoice.subtotalExGstAud.toFixed(2)}`);
    rows.push(`Australian GST (10%),,,${invoice.gstAud.toFixed(2)}`);
    rows.push(`Total Payable inc-GST,,,${invoice.totalIncGstAud.toFixed(2)}`);

    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.invoiceNumber}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-chronos-tray rounded-[20px] p-1.5 border border-white/[0.08] print:bg-white print:text-black print:border-0 print:p-0 print:rounded-none">
      <div className="bg-chronos-card border border-white/[0.06] rounded-[14px] p-5 space-y-5 text-xs print:bg-white print:text-black print:border-0 print:shadow-none print:p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5 print:hidden">
          <div className="flex items-center space-x-2">
            <Receipt size={18} className="text-chronos-green" weight="fill" />
            <h3 className="font-display font-bold text-chronos-ink text-sm tracking-tight">
              Australian Agency Tax Invoice (ABN/GST)
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3.5 py-1.5 rounded-full bg-chronos-recessed hover:bg-chronos-elevated border border-white/[0.1] text-chronos-ink font-mono text-xs flex items-center space-x-1.5 transition-all duration-200 ease-spring active:scale-[0.98]"
            >
              <DownloadSimple size={13} />
              <span>CSV</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-1.5 rounded-full bg-chronos-green hover:bg-chronos-green-hover text-chronos-canvas font-bold text-xs flex items-center space-x-1.5 transition-all duration-200 ease-spring active:scale-[0.98]"
            >
              <Printer size={13} weight="bold" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        <div className="p-5 bg-chronos-recessed rounded-[12px] border border-white/[0.06] space-y-4 font-mono print:bg-white print:text-black print:border-gray-300 print:rounded-none">
          <div className="flex justify-between items-start border-b border-white/[0.08] pb-3.5 print:border-gray-300">
            <div>
              <div className="font-display font-bold text-base text-chronos-ink print:text-black">
                AetherDigital Agency Pty Ltd
              </div>
              <div className="text-[11px] text-chronos-muted print:text-gray-700">
                ABN {invoice.agencyAbn} &middot; Sydney NSW 2000
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-chronos-muted block font-semibold print:text-gray-600">
                TAX INVOICE
              </span>
              <span className="font-bold text-chronos-ink text-xs tabular-nums print:text-black">
                {invoice.invoiceNumber}
              </span>
              <div className="text-[11px] text-chronos-muted tabular-nums print:text-gray-700">
                Date: {invoice.invoiceDate}
              </div>
            </div>
          </div>

          <div className="text-xs">
            <span className="text-chronos-muted block text-[10px] font-sans font-semibold print:text-gray-600">
              Bill To:
            </span>
            <strong className="text-chronos-ink text-xs font-sans print:text-black">{invoice.clientName}</strong>
            <div className="text-chronos-muted text-[11px] print:text-gray-700">ABN {invoice.clientAbn}</div>
            <div className="text-chronos-green mt-0.5 text-[11px] font-sans print:text-black">
              Project: {invoice.projectName}
            </div>
          </div>

          <div className="border border-white/[0.08] rounded-[10px] overflow-hidden print:border-gray-300 print:rounded-none">
            <table className="w-full text-left">
              <thead className="bg-chronos-tray text-[10px] text-chronos-muted border-b border-white/[0.08] print:bg-gray-100 print:text-black print:border-gray-300">
                <tr>
                  <th className="p-2.5">Description / Phase</th>
                  <th className="p-2.5 text-right">Hours</th>
                  <th className="p-2.5 text-right">Rate AUD</th>
                  <th className="p-2.5 text-right">Amount AUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-[11px] print:divide-gray-200">
                {invoice.lineItems.map((li, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 text-chronos-ink font-sans print:text-black">{li.phaseLabel}</td>
                    <td className="p-2.5 text-right tabular-nums text-chronos-ink font-bold print:text-black">
                      {li.hours}h
                    </td>
                    <td className="p-2.5 text-right tabular-nums text-chronos-muted print:text-gray-700">
                      ${li.hourlyRateAud.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-right tabular-nums text-chronos-ink font-bold print:text-black">
                      ${li.lineTotalAud.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-chronos-muted print:text-gray-700">
                <span>Subtotal ex-GST:</span>
                <span className="text-chronos-ink tabular-nums print:text-black">
                  ${invoice.subtotalExGstAud.toFixed(2)} AUD
                </span>
              </div>
              <div className="flex justify-between text-chronos-muted print:text-gray-700">
                <span>Australian GST 10%:</span>
                <span className="text-chronos-ink tabular-nums print:text-black">
                  ${invoice.gstAud.toFixed(2)} AUD
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/[0.08] text-sm font-bold print:border-black">
                <span className="print:text-black">Total Payable:</span>
                <span className="text-chronos-green tabular-nums print:text-black">
                  ${invoice.totalIncGstAud.toFixed(2)} AUD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
