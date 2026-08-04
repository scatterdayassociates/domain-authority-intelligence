import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronRight, Download, Search } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import McpContextTrigger from "@/components/mcp/McpContextTrigger";

// ─────────────────────────────────────────────────────────────────────────────
// Mock dataset — recommendation-layer brand ranking (execution-scoped)
// ─────────────────────────────────────────────────────────────────────────────

export interface BrandRankRow {
  brand: string;
  role: "TARGET" | "COMPETITOR";
  inclusion_rate: number; // share of runs where brand appears in recommended-brands list
  weighted_inclusion: number; // cumulative position-weighted sum (unbounded)
  top3: number;
  top5: number;
  avg_position: number;
  best_position: number;
}

const BRAND_RANKING: BrandRankRow[] = [
  { brand: "Dell Technologies", role: "TARGET", inclusion_rate: 0.667, weighted_inclusion: 3.62, top3: 0.417, top5: 0.583, avg_position: 2.4, best_position: 1 },
  { brand: "Lenovo", role: "COMPETITOR", inclusion_rate: 0.625, weighted_inclusion: 3.14, top3: 0.375, top5: 0.542, avg_position: 2.8, best_position: 1 },
  { brand: "Apple", role: "COMPETITOR", inclusion_rate: 0.583, weighted_inclusion: 2.97, top3: 0.333, top5: 0.5, avg_position: 2.6, best_position: 1 },
  { brand: "HP", role: "COMPETITOR", inclusion_rate: 0.5, weighted_inclusion: 2.35, top3: 0.25, top5: 0.417, avg_position: 3.2, best_position: 2 },
  { brand: "ASUS", role: "COMPETITOR", inclusion_rate: 0.417, weighted_inclusion: 1.78, top3: 0.167, top5: 0.333, avg_position: 3.8, best_position: 2 },
  { brand: "Microsoft", role: "COMPETITOR", inclusion_rate: 0.333, weighted_inclusion: 1.32, top3: 0.125, top5: 0.25, avg_position: 4.1, best_position: 3 },
  { brand: "Acer", role: "COMPETITOR", inclusion_rate: 0.25, weighted_inclusion: 0.91, top3: 0.083, top5: 0.167, avg_position: 4.6, best_position: 3 },
  { brand: "Razer", role: "COMPETITOR", inclusion_rate: 0.167, weighted_inclusion: 0.54, top3: 0.0, top5: 0.083, avg_position: 5.4, best_position: 4 },
];

type SortKey = "inclusion_rate" | "weighted_inclusion" | "top3" | "top5" | "avg_position" | "best_position";

const METRICS: Record<SortKey, { label: string; tip: string }> = {
  inclusion_rate: {
    label: "Recommendation Inclusion Rate",
    tip: "Share of runs in which the brand appears in the model's recommended-brands list.",
  },
  weighted_inclusion: {
    label: "Weighted Inclusion",
    tip: "Measures cumulative brand recommendation strength. What it measures: the position-weighted sum of every recommendation appearance for this brand across all runs — not normalized, so it grows with both frequency and rank strength.",
  },
  top3: { label: "Top 3 Presence", tip: "Share of runs in which the brand is recommended within the top 3 positions." },
  top5: { label: "Top 5 Presence", tip: "Share of runs in which the brand is recommended within the top 5 positions." },
  avg_position: { label: "AP", tip: "Average Position — average rank position across recommendation appearances." },
  best_position: { label: "BP", tip: "Best Position — best (lowest-numbered) rank position achieved." },
};

const fmtPct = (v: number) => `${(v * 100).toFixed(1)}%`;

interface Props {
  onEvidence: (brand: string) => void;
  selected?: string | null;
  onSelect?: (brand: string) => void;
}

const BrandRankingTable = ({ onEvidence, selected, onSelect }: Props) => {
  const [sortKey, setSortKey] = useState<SortKey>("inclusion_rate");
  const [filter, setFilter] = useState<"all" | "TARGET" | "COMPETITOR">("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const filtered = BRAND_RANKING.filter(
      (r) =>
        (filter === "all" || r.role === filter) &&
        r.brand.toLowerCase().includes(query.trim().toLowerCase())
    );
    return [...filtered].sort((a, b) => {
      if (sortKey === "avg_position" || sortKey === "best_position") {
        return a[sortKey] - b[sortKey];
      }
      const d = b[sortKey] - a[sortKey];
      if (d !== 0) return d;
      if (b.inclusion_rate !== a.inclusion_rate) return b.inclusion_rate - a.inclusion_rate;
      return a.brand.localeCompare(b.brand);
    });
  }, [sortKey, filter, query]);

  const exportCsv = () => {
    const header = [
      "rank",
      "brand",
      "role",
      "recommendation_inclusion_rate",
      "weighted_inclusion",
      "top3_presence",
      "top5_presence",
      "avg_position",
      "best_position",
    ];
    const lines = [header.join(",")];
    rows.forEach((r, i) => {
      lines.push(
        [
          i + 1,
          r.brand,
          r.role,
          r.inclusion_rate.toFixed(4),
          r.weighted_inclusion.toFixed(4),
          r.top3.toFixed(4),
          r.top5.toFixed(4),
          r.avg_position.toFixed(1),
          r.best_position,
        ].join(",")
      );
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brand-analysis-may-2026.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortHeader = ({ k }: { k: SortKey }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => setSortKey(k)}
          className={`inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide justify-end w-full ${
            sortKey === k ? "text-slate-800" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {METRICS[k].label}
          <ArrowUpDown className="w-3 h-3 shrink-0" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">{METRICS[k].tip}</TooltipContent>
    </Tooltip>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 pt-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-800">Brand Ranking</h3>
          <span className="text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
            Derived from Domain Data
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 max-w-3xl">
          Brand Metrics are derived from structured recommendation output (RECOMMENDED BRANDS), not
          from narrative mentions or free text.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Filter:</span>
          {(["all", "TARGET", "COMPETITOR"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[11px] px-2 py-1 rounded-full border transition-colors ${
                filter === f
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {f === "all" ? "All" : f === "TARGET" ? "Target" : "Competitors"}
            </button>
          ))}
          <div className="relative ml-2">
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brand"
              className="text-[11px] pl-6 pr-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-300 w-36"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500">
            Showing {rows.length} brands · Recommendation layer (BNE-derived)
          </span>
          <button
            onClick={exportCsv}
            className="text-[11px] inline-flex items-center gap-1 px-2 py-1 border border-slate-200 rounded hover:bg-slate-50 text-slate-700"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-slate-500">
              <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide w-10">#</th>
              <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide">Brand</th>
              <th className="px-3 py-2 text-right"><SortHeader k="inclusion_rate" /></th>
              <th className="px-3 py-2 text-right"><SortHeader k="weighted_inclusion" /></th>
              <th className="px-3 py-2 text-right"><SortHeader k="top3" /></th>
              <th className="px-3 py-2 text-right"><SortHeader k="top5" /></th>
              <th className="px-3 py-2 text-right"><SortHeader k="avg_position" /></th>
              <th className="px-3 py-2 text-right"><SortHeader k="best_position" /></th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.brand}
                onClick={() => onSelect?.(r.brand)}
                className={`border-t border-slate-100 cursor-pointer transition-colors ${
                  selected === r.brand ? "bg-teal-50" : "hover:bg-slate-50"
                }`}
              >
                <td className="px-3 py-2 text-slate-400 tabular-nums">{i + 1}</td>
                <td className="px-3 py-2">
                  <span className="text-slate-800 font-medium">{r.brand}</span>
                  {r.role === "TARGET" && (
                    <span className="ml-2 inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700">
                      Target
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-700">{fmtPct(r.inclusion_rate)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-700">{r.weighted_inclusion.toFixed(2)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-700">{fmtPct(r.top3)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-700">{fmtPct(r.top5)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-500">#{r.avg_position.toFixed(1)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-500">#{r.best_position}</td>
                <td className="px-3 py-2 text-right">
                  <div className="inline-flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEvidence(r.brand);
                      }}
                      className="text-[11px] text-teal-600 hover:underline inline-flex items-center gap-0.5"
                    >
                      Evidence <ChevronRight className="w-3 h-3" />
                    </button>
                    <McpContextTrigger
                      scope="brand"
                      subject={r.brand}
                      executionLabel="Snapshot: May 2026"
                      label="MCP"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-xs text-slate-400">
                  No brands match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrandRankingTable;
