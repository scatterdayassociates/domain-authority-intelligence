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
    desc: "One row per domain. Fields: execution_id, timestamp, domain, category, total_mentions, run_persistence, avg_position, authority_type.",
    preview: `execution_id,domain,total_mentions,run_persistence,avg_position,authority_type\nEX-0329-001,rtings.com,48,0.971,1.8,Publisher/Media\nEX-0329-001,notebookcheck.net,41,0.914,2.3,Publisher/Media...`,
  },
  {
    name: "Category Summary Dataset",
    desc: "One row per execution. Fields: execution_id, timestamp, category, total_mentions, unique_domains, top5_share, hhi.",
    preview: null,
  },
  {
    name: "Brand Inclusion Dataset",
    desc: "One row per brand per execution. Fields: execution_id, timestamp, brand, role, inclusion_rate, inclusion_stability.",
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
      <div className="fixed top-0 right-0 bottom-0 w-[400px] bg-background shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <div className="font-semibold text-foreground">Export Scoring Data</div>
            <div className="text-xs text-muted-foreground mt-0.5">{executionId} · Dell — Laptops — US · v3 · GPT-4o</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {datasets.map((d, i) => (
            <button
              key={d.name}
              onClick={() => setSelected(i)}
              className={`w-full text-left rounded-lg border p-4 transition-colors ${
                selected === i ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="text-sm font-medium text-foreground">{d.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{d.desc}</div>
              {d.preview && selected === i && (
                <pre className="font-mono text-xs bg-muted/50 rounded p-2 mt-2 text-muted-foreground whitespace-pre-wrap">{d.preview}</pre>
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
