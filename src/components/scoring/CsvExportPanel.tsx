import { useState } from "react";
import { X, Download } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  executionId: string;
}

const datasets = [
  {
    name: "Domain Authority Dataset",
    tier: "Layer 1 · Primary measurement",
    tierTone: "bg-primary/10 text-primary border-primary/30",
    role: "Canonical deterministic authority-measurement layer derived directly from PDPE aggregation. All other datasets in this export are derived downstream from this one.",
    fields: "execution_id, timestamp, domain, WAS, NAS, RLP, AP, BP, mention_count, run_presence, authority_tier, authority_type, rule_version",
    derivedFrom: "PDPE observations (parsed run-level domain occurrences).",
    preview: `execution_id,domain,WAS,NAS,RLP,AP,BP,mention_count,run_presence,authority_tier,authority_type,rule_version\nEX-0329-001,rtings.com,0.842,0.187,0.971,1.8,1,48,0.971,T1,Publisher/Media,v3.2.1\nEX-0329-001,notebookcheck.net,0.781,0.164,0.914,2.3,1,41,0.914,T1,Publisher/Media,v3.2.1`,
  },
  {
    name: "Category Summary Dataset",
    tier: "Layer 2 · Aggregation / structural interpretation",
    tierTone: "bg-amber-500/10 text-amber-700 border-amber-500/30",
    role: "Category-level concentration and market-structure metrics derived by aggregating Domain Authority measurements across all surfaced domains. Not a primary measurement.",
    fields: "execution_id, timestamp, category, unique_domain_count, top5_share, hhi, concentration_class (CONCENTRATED / MODERATE / FRAGMENTED)",
    derivedFrom: "Domain Authority Dataset (Layer 1).",
    preview: null,
  },
  {
    name: "Brand Inclusion Dataset",
    tier: "Layer 3 · Brand-level derived interpretation",
    tierTone: "bg-violet-500/10 text-violet-700 border-violet-500/30",
    role: "Brand-level metrics generated from deterministic domain → brand mappings applied to Domain Authority observations. Derived from surfaced brand-owned domains — not from narrative mentions or product recommendations.",
    fields: "execution_id, timestamp, brand, role (TARGET / COMPETITOR / NEUTRAL), inclusion_rate, weighted_inclusion, top3_presence, top5_presence, inclusion_stability, avg_position_brand",
    derivedFrom: "Domain Authority Dataset (Layer 1) + project domain→brand mapping.",
    preview: null,
  },
];

const CsvExportPanel = ({ open, onClose, executionId }: Props) => {
  const [selected, setSelected] = useState(0);
  const [zip, setZip] = useState(false);
  const [format, setFormat] = useState<"csv" | "tsv">("csv");

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-[440px] bg-background shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <div className="font-semibold text-foreground">Export Scoring Data</div>
            <div className="text-xs text-muted-foreground mt-0.5">{executionId} · Dell — Laptops — US · v3 · GPT-4o</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Measurement hierarchy.</span> These datasets are not parallel source tables. They follow a strict dependency chain:
            <div className="mt-1 font-mono text-[10.5px] text-foreground/80">
              PDPE observations → Domain Authority (L1) → Category Summary (L2) → Brand Inclusion (L3)
            </div>
            <div className="mt-1">Measurement first, aggregation second, interpretation third.</div>
          </div>

          {datasets.map((d, i) => (
            <button
              key={d.name}
              onClick={() => setSelected(i)}
              className={`w-full text-left rounded-lg border p-4 transition-colors ${
                selected === i ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-medium text-foreground">{d.name}</div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${d.tierTone} whitespace-nowrap`}>{d.tier}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{d.role}</div>
              <div className="text-[11px] text-muted-foreground/90 mt-2">
                <span className="font-medium text-foreground/80">Fields: </span>
                <span className="font-mono">{d.fields}</span>
              </div>
              <div className="text-[11px] text-muted-foreground/80 mt-1">
                <span className="font-medium text-foreground/80">Derived from: </span>{d.derivedFrom}
              </div>
              {d.preview && selected === i && (
                <pre className="font-mono text-[11px] bg-muted/50 rounded p-2 mt-2 text-muted-foreground whitespace-pre-wrap overflow-x-auto">{d.preview}</pre>
              )}
            </button>
          ))}

          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input type="checkbox" checked={zip} onChange={() => setZip(!zip)} className="w-3.5 h-3.5 rounded border-border accent-[hsl(var(--primary))]" />
            <span className="text-sm text-foreground">Include all 3 datasets in a single ZIP</span>
          </label>

          <div className="border-t border-border pt-4 mt-4">
            <div className="text-label mb-2">Export Format</div>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-sm text-foreground cursor-pointer">
                <input type="radio" name="fmt" checked={format === "csv"} onChange={() => setFormat("csv")} className="accent-[hsl(var(--primary))]" /> CSV
              </label>
              <label className="flex items-center gap-1.5 text-sm text-foreground cursor-pointer">
                <input type="radio" name="fmt" checked={format === "tsv"} onChange={() => setFormat("tsv")} className="accent-[hsl(var(--primary))]" /> TSV
              </label>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2">
          <button className="w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>
    </>
  );
};

export default CsvExportPanel;
