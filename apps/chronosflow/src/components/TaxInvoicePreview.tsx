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
    <div className="bg-chronos-surface border border-white/10 rounded-xl p-5 shadow-2xl space-y-5 font-mono text-xs print:bg-white print:text-black print:border-0 print:shadow-none print:p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 print:hidden">
        <div className="flex items-center space-x-2">
          <Receipt size={18} className="text-chronos-indigo" weight="fill" />
          <h3 className="font-bold text-white text-sm font-sans">Australian Agency Tax Invoice (ABN/GST)</h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-2.5 py-1.5 rounded bg-chronos-card hover:bg-white/10 border border-white/10 text-white flex items-center space-x-1"
          >
            <DownloadSimple size={13} />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded bg-chronos-indigo hover:bg-indigo-500 text-white font-bold flex items-center space-x-1"
          >
            <Printer size={13} />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Formal Invoice Letterhead */}
      <div className="p-5 bg-chronos-card rounded-lg border border-white/5 space-y-4 print:bg-white print:text-black print:border-gray-300">
        <div className="flex justify-between items-start border-b border-white/10 pb-3 print:border-gray-300">
          <div>
            <div className="font-display font-bold text-base text-white print:text-black">AetherDigital Agency Pty Ltd</div>
            <div className="text-[11px] text-gray-400 print:text-gray-700">ABN {invoice.agencyAbn} &middot; Sydney NSW 2000</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase text-gray-400 block print:text-gray-600">TAX INVOICE</span>
            <span className="font-bold text-white text-xs print:text-black">{invoice.invoiceNumber}</span>
            <div className="text-[10px] text-gray-400 print:text-gray-700">Date: {invoice.invoiceDate}</div>
          </div>
        </div>

        <div className="text-[11px]">
          <span className="text-gray-400 block text-[10px] uppercase print:text-gray-600">Bill To:</span>
          <strong className="text-white text-xs print:text-black">{invoice.clientName}</strong>
          <div className="text-gray-400 print:text-gray-700">ABN {invoice.clientAbn}</div>
          <div className="text-chronos-indigo mt-0.5 print:text-black">Project: {invoice.projectName}</div>
        </div>

        <div className="border border-white/10 rounded overflow-hidden print:border-gray-300">
          <table className="w-full text-left">
            <thead className="bg-chronos-canvas text-[10px] text-gray-400 border-b border-white/10 print:bg-gray-100 print:text-black print:border-gray-300">
              <tr>
                <th className="p-2">Description / Phase</th>
                <th className="p-2 text-right">Hours</th>
                <th className="p-2 text-right">Rate AUD</th>
                <th className="p-2 text-right">Amount AUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[11px] print:divide-gray-200">
              {invoice.lineItems.map((li, idx) => (
                <tr key={idx}>
                  <td className="p-2 text-gray-200 print:text-black">{li.phaseLabel}</td>
                  <td className="p-2 text-right tabular-nums text-white font-bold print:text-black">{li.hours}h</td>
                  <td className="p-2 text-right tabular-nums text-gray-400 print:text-gray-700">${li.hourlyRateAud.toFixed(2)}</td>
                  <td className="p-2 text-right tabular-nums text-white font-bold print:text-black">${li.lineTotalAud.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-2">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-400 print:text-gray-700">
              <span>Subtotal (ex-GST):</span>
              <span className="text-white tabular-nums print:text-black">${invoice.subtotalExGstAud.toFixed(2)} AUD</span>
            </div>
            <div className="flex justify-between text-gray-400 print:text-gray-700">
              <span>Australian GST (10%):</span>
              <span className="text-white tabular-nums print:text-black">${invoice.gstAud.toFixed(2)} AUD</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-white/10 text-sm font-bold print:border-black">
              <span>Total Payable:</span>
              <span className="text-chronos-green tabular-nums print:text-black">${invoice.totalIncGstAud.toFixed(2)} AUD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
