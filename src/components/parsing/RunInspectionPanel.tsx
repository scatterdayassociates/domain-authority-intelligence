import { useState } from "react";
import { X, Copy, Check, CheckCircle, ArrowRight } from "lucide-react";

interface RunInspectionPanelProps {
  run: { run: number; label: string; runId: string };
  onClose: () => void;
}

const rawResponse = `Based on my analysis, here are the best laptops for home office use in 2024:

1. Dell XPS 15 - Excellent performance for professionals
2. Apple MacBook Pro M3 - Outstanding battery life
3. Lenovo ThinkPad X1 Carbon - Best for business travel
4. HP Spectre x360 - Premium 2-in-1 option
5. ASUS ZenBook Pro - Great value at this tier

SOURCES:
https://www.rtings.com/laptop/reviews/best/laptops
https://www.pcmag.com/picks/the-best-laptops
https://www.notebookcheck.net/Best-Laptops.13194.0.html
https://www.tomshardware.com/best-picks/best-laptops
https://www.bestbuy.com/site/buying-guides/best-laptops/pcmcd.html
https://www.theverge.com/23832390/best-laptops`;

const extractedUrls = [
  "https://www.rtings.com/laptop/reviews/best/laptops",
  "https://www.pcmag.com/picks/the-best-laptops",
  "https://www.notebookcheck.net/Best-Laptops.13194.0.html",
  "https://www.tomshardware.com/best-picks/best-laptops",
  "https://www.bestbuy.com/site/buying-guides/best-laptops/pcmcd.html",
  "https://www.theverge.com/23832390/best-laptops",
];

const normalisations = [
  { before: "www.rtings.com", after: "rtings.com" },
  { before: "www.pcmag.com", after: "pcmag.com" },
  { before: "www.notebookcheck.net", after: "notebookcheck.net" },
  { before: "www.tomshardware.com", after: "tomshardware.com" },
  { before: "www.bestbuy.com", after: "bestbuy.com" },
  { before: "www.theverge.com", after: "theverge.com" },
];

const RunInspectionPanel = ({ run, onClose }: RunInspectionPanelProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-foreground/40 z-50" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[560px] bg-background shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Run Inspection</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {run.runId} · {run.label} · GPT-4o · EX-0329-001
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
          {/* Section A: Raw Response */}
          <div>
            <span className="text-label block mb-2">Raw Model Response</span>
            <div className="relative">
              <div className="font-mono text-xs text-foreground bg-muted/30 border border-border rounded-lg p-4 max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {rawResponse}
              </div>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Section B: Extracted URLs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-label">Extracted URLs</span>
              <span className="text-xs text-primary">{extractedUrls.length} URLs found</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {extractedUrls.map((url) => (
                <div key={url} className="flex items-center justify-between py-1">
                  <span className="font-mono text-xs text-muted-foreground truncate max-w-[440px]">{url}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Section C: Normalised Domains */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-label">Normalised Domains</span>
              <span className="text-xs text-primary">{normalisations.length} domains</span>
            </div>
            <div className="grid grid-cols-[1fr_24px_1fr] gap-0">
              <span className="text-xs text-muted-foreground italic pb-1">Before normalisation</span>
              <span />
              <span className="text-xs text-muted-foreground italic font-medium pb-1">After normalisation</span>
              {normalisations.map((n, i) => (
                <div key={n.after} className={`col-span-3 grid grid-cols-[1fr_24px_1fr] items-center py-1.5 ${i % 2 === 1 ? "bg-muted/30" : ""}`}>
                  <span className="font-mono text-xs text-muted-foreground px-2">{n.before}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/50 mx-auto" />
                  <span className="font-mono text-xs font-medium text-primary px-2">{n.after}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Protocol removed · www stripped · Subdomains collapsed · Lowercased · {normalisations.length} unique domains identified
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full h-9 border border-border text-muted-foreground text-sm rounded-md hover:bg-muted transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default RunInspectionPanel;
