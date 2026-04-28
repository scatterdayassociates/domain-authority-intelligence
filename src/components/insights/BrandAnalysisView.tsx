import { useMemo, useState } from "react";
import {
  Target,
  ArrowUpDown,
  ChevronRight,
  ExternalLink,
  Download,
  ChevronDown,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Mock dataset — execution-scoped, deterministic, aligned with Domain Analysis
// ─────────────────────────────────────────────────────────────────────────────

const TOTAL_RUNS = 12;

interface BrandRow {
  brand: string;
  isTarget?: boolean;
  frequency: number; // runs in which brand is present (via domain mapping)
  domains: string[];
}

const BRANDS: BrandRow[] = [
  { brand: "Dell Technologies", isTarget: true, frequency: 9, domains: ["dell.com", "bestbuy.com", "amazon.com"] },
  { brand: "Lenovo", frequency: 8, domains: ["lenovo.com", "bestbuy.com"] },
  { brand: "Apple", frequency: 6, domains: ["apple.com", "bestbuy.com"] },
  { brand: "HP", frequency: 5, domains: ["hp.com", "bestbuy.com", "amazon.com"] },
  { brand: "ASUS", frequency: 4, domains: ["asus.com", "amazon.com"] },
  { brand: "Microsoft", frequency: 3, domains: ["microsoft.com", "bestbuy.com"] },
  { brand: "Acer", frequency: 2, domains: ["acer.com", "amazon.com"] },
  { brand: "Razer", frequency: 1, domains: ["razer.com"] },
];

type AttrCategory = "Price" | "Use Case" | "Performance" | "Quality" | "Design";

interface AttrCell {
  coverage: number; // runs in which (brand, attribute) co-occurs
  frequency: number; // total BNEs
}

interface AttrDef {
  name: string;
  category: AttrCategory;
}

const ATTRIBUTES: AttrDef[] = [
  { name: "affordable", category: "Price" },
  { name: "premium", category: "Price" },
  { name: "business", category: "Use Case" },
  { name: "gaming", category: "Use Case" },
  { name: "students", category: "Use Case" },
  { name: "reliable", category: "Quality" },
  { name: "lightweight", category: "Design" },
  { name: "powerful", category: "Performance" },
];

// brand → attribute → cell
const NARRATIVE: Record<string, Partial<Record<string, AttrCell>>> = {
  "Dell Technologies": {
    affordable: { coverage: 7, frequency: 9 },
    business: { coverage: 7, frequency: 8 },
    reliable: { coverage: 5, frequency: 6 },
    gaming: { coverage: 3, frequency: 4 },
    powerful: { coverage: 4, frequency: 5 },
  },
  Lenovo: {
    affordable: { coverage: 8, frequency: 10 },
    business: { coverage: 6, frequency: 7 },
    reliable: { coverage: 4, frequency: 5 },
    students: { coverage: 5, frequency: 6 },
  },
  Apple: {
    premium: { coverage: 6, frequency: 8 },
    lightweight: { coverage: 5, frequency: 6 },
    reliable: { coverage: 5, frequency: 6 },
    powerful: { coverage: 4, frequency: 5 },
  },
  HP: {
    affordable: { coverage: 4, frequency: 5 },
    business: { coverage: 4, frequency: 5 },
    students: { coverage: 3, frequency: 4 },
  },
  ASUS: {
    gaming: { coverage: 4, frequency: 6 },
    powerful: { coverage: 3, frequency: 4 },
    affordable: { coverage: 2, frequency: 3 },
  },
  Microsoft: {
    premium: { coverage: 3, frequency: 4 },
    business: { coverage: 2, frequency: 3 },
    lightweight: { coverage: 2, frequency: 2 },
  },
  Acer: {
    affordable: { coverage: 2, frequency: 3 },
    students: { coverage: 1, frequency: 2 },
  },
  Razer: {
    gaming: { coverage: 1, frequency: 2 },
    premium: { coverage: 1, frequency: 1 },
  },
};

// Drill-down samples
const RUNS_BY_BRAND: Record<string, { runId: string; prompt: string; model: string; domain: string; position?: number; responseIdx: number }[]> = {
  "Dell Technologies": [
    { runId: "run-001", prompt: "Best laptops for home office", model: "GPT-4o", domain: "dell.com", position: 2, responseIdx: 0 },
    { runId: "run-003", prompt: "Best laptops for home office", model: "GPT-4o", domain: "bestbuy.com", position: 1, responseIdx: 1 },
    { runId: "run-005", prompt: "Best laptops for home office", model: "Claude 3.5", domain: "dell.com", position: 2, responseIdx: 0 },
    { runId: "run-007", prompt: "Best laptops for home office", model: "GPT-4o", domain: "amazon.com", position: 3, responseIdx: 1 },
    { runId: "run-009", prompt: "Best laptops for home office", model: "Claude 3.5", domain: "dell.com", position: 1, responseIdx: 0 },
  ],
};

const RESPONSE_SAMPLES: Record<string, string[]> = {
  "Dell Technologies": [
    "For home office use, the Dell XPS 13 stands out as a reliable and affordable option for business users. It strikes a strong balance between portability and performance, making it a consistent recommendation across reviewers.",
    "Dell laptops are widely regarded as a solid choice for professionals. The XPS line in particular is highlighted as both powerful and reliable, with strong build quality suited for everyday business workflows.",
  ],
};

const fallbackRuns = (brand: string) => [
  { runId: "run-002", prompt: "Best laptops for home office", model: "GPT-4o", domain: BRANDS.find(b => b.brand === brand)?.domains[0] ?? "—", position: 3, responseIdx: 0 },
  { runId: "run-006", prompt: "Best laptops for home office", model: "Claude 3.5", domain: BRANDS.find(b => b.brand === brand)?.domains[0] ?? "—", position: 4, responseIdx: 0 },
];

const fallbackResponses = (brand: string) => [
  `${brand} is mentioned among recommended laptop options for this prompt, with reviewers noting its competitive positioning in the category.`,
];

const NARRATIVE_PHRASES: Record<string, string[]> = {
  affordable: ["affordable", "affordability", "budget-friendly", "value"],
  premium: ["premium", "high-end"],
  business: ["business users", "business", "professional", "professionals"],
  gaming: ["gaming"],
  students: ["students", "student"],
  reliable: ["reliable", "reliability"],
  lightweight: ["lightweight", "portability", "portable"],
  powerful: ["powerful", "performance"],
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const fmtPct = (v: number) => `${Math.round(v * 100)}%`;

interface EnrichedBrand extends BrandRow {
  inclusion: number;
  consistency: "High" | "Medium" | "Low";
}

const enrichBrand = (b: BrandRow): EnrichedBrand => {
  const inclusion = b.frequency / TOTAL_RUNS;
  const consistency: "High" | "Medium" | "Low" =
    inclusion >= 0.6 ? "High" : inclusion >= 0.3 ? "Medium" : "Low";
  return { ...b, inclusion, consistency };
};

const rankBrands = (rows: BrandRow[]): EnrichedBrand[] =>
  rows
    .map(enrichBrand)
    .sort((a, b) => {
      if (b.inclusion !== a.inclusion) return b.inclusion - a.inclusion;
      if (b.frequency !== a.frequency) return b.frequency - a.frequency;
      return a.brand.localeCompare(b.brand);
    });

const consistencyPill = (c: "High" | "Medium" | "Low") =>
  c === "High"
    ? "bg-green-100 text-green-700"
    : c === "Medium"
    ? "bg-amber-100 text-amber-700"
    : "bg-slate-100 text-slate-600";

const highlightPhrases = (text: string, brand: string, attribute?: string) => {
  const brandTokens = [brand.split(" ")[0]]; // first token e.g. "Dell"
  const attrTokens = attribute ? NARRATIVE_PHRASES[attribute] ?? [attribute] : [];
  const tokens = [...brandTokens, ...attrTokens];
  if (tokens.length === 0) return text;
  const pattern = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);
  return parts.map((p, i) => {
    const lower = p.toLowerCase();
    if (brandTokens.some((t) => t.toLowerCase() === lower)) {
      return (
        <mark key={i} className="bg-teal-200/70 text-slate-900 rounded px-0.5 font-medium">
          {p}
        </mark>
      );
    }
    if (attrTokens.some((t) => t.toLowerCase() === lower)) {
      return (
        <mark key={i} className="bg-amber-200/70 text-slate-900 rounded px-0.5 font-medium">
          {p}
        </mark>
      );
    }
    return <span key={i}>{p}</span>;
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Section 1 — Brand Selector
// ─────────────────────────────────────────────────────────────────────────────

const BrandSelector = ({
  brands,
  selected,
  onChange,
}: {
  brands: EnrichedBrand[];
  selected: string;
  onChange: (b: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs uppercase tracking-wide text-slate-500">Brand</span>
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-md bg-white text-sm text-slate-800 hover:bg-slate-50 min-w-[220px] justify-between"
        >
          <span className="inline-flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-slate-400" />
            {selected}
            {brands.find((b) => b.brand === selected)?.isTarget && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700">Target</span>
            )}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
        {open && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-72 overflow-auto">
            {brands.map((b) => (
              <button
                key={b.brand}
                onClick={() => {
                  onChange(b.brand);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center justify-between ${
                  b.brand === selected ? "bg-teal-50/60" : ""
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {b.brand}
                  {b.isTarget && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700">Target</span>
                  )}
                </span>
                <span className="text-xs text-slate-500 tabular-nums">{fmtPct(b.inclusion)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section 2 — Brand Summary
// ─────────────────────────────────────────────────────────────────────────────

const BrandSummaryCard = ({
  brand,
  rank,
  onDrillDown,
}: {
  brand: EnrichedBrand;
  rank: number;
  onDrillDown: () => void;
}) => {
  const positionLabel =
    rank === 1 ? "Top included brand" : rank === 2 ? "2nd most included brand" : `Rank #${rank} by inclusion`;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500 uppercase tracking-wide">Selected Brand</span>
        <span className="text-[11px] text-slate-400">Execution: May 2026 · {TOTAL_RUNS} runs</span>
      </div>
      <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-slate-400" />
            <h3 className="text-2xl font-semibold text-slate-800">{brand.brand}</h3>
            {brand.isTarget && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">Target</span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1">{positionLabel}</div>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">Inclusion</div>
            <div className="text-lg font-semibold text-slate-800 tabular-nums">{fmtPct(brand.inclusion)}</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">Appears in</div>
            <div className="text-lg font-semibold text-slate-800 tabular-nums">
              {brand.frequency} / {TOTAL_RUNS} <span className="text-xs text-slate-500 font-normal">runs</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">Consistency</div>
            <div className="text-lg font-semibold text-slate-800">
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${consistencyPill(brand.consistency)}`}>
                {brand.consistency}
              </span>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">Mapped domains</div>
            <div className="text-sm font-medium text-slate-700 font-mono">{brand.domains.join(", ")}</div>
          </div>
        </div>
        <div className="ml-auto">
          <button
            onClick={onDrillDown}
            className="text-xs px-3 py-1.5 rounded-md bg-teal-600 text-white hover:bg-teal-700 inline-flex items-center gap-1"
          >
            View evidence
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section 3 — Brand Comparison Table
// ─────────────────────────────────────────────────────────────────────────────

type BrandSortKey = "inclusion" | "frequency" | "consistency" | "brand";

const BrandComparisonTable = ({
  rows,
  selected,
  onSelect,
  onDrillDown,
}: {
  rows: EnrichedBrand[];
  selected: string;
  onSelect: (b: string) => void;
  onDrillDown: (b: string) => void;
}) => {
  const [sortKey, setSortKey] = useState<BrandSortKey>("inclusion");
  const [minInclusion, setMinInclusion] = useState(0);

  const sorted = useMemo(() => {
    const filtered = rows.filter((r) => r.inclusion >= minInclusion);
    const consistencyRank: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
    return [...filtered].sort((a, b) => {
      let primary = 0;
      if (sortKey === "inclusion") primary = b.inclusion - a.inclusion;
      else if (sortKey === "frequency") primary = b.frequency - a.frequency;
      else if (sortKey === "consistency") primary = consistencyRank[b.consistency] - consistencyRank[a.consistency];
      else primary = a.brand.localeCompare(b.brand);
      if (primary !== 0) return primary;
      // tiebreaker
      if (b.inclusion !== a.inclusion) return b.inclusion - a.inclusion;
      if (b.frequency !== a.frequency) return b.frequency - a.frequency;
      return a.brand.localeCompare(b.brand);
    });
  }, [rows, sortKey, minInclusion]);

  const exportCsv = () => {
    const header = ["rank", "brand", "is_target", "inclusion_rate", "frequency", "total_runs", "consistency", "mapped_domains"];
    const lines = [header.join(",")];
    rankBrands(rows).forEach((r, i) => {
      lines.push(
        [
          i + 1,
          r.brand,
          r.isTarget ? "true" : "false",
          r.inclusion.toFixed(4),
          r.frequency,
          TOTAL_RUNS,
          r.consistency,
          `"${r.domains.join("; ")}"`,
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

  const SortHeader = ({ k, label, align = "right" }: { k: BrandSortKey; label: string; align?: "left" | "right" }) => (
    <button
      onClick={() => setSortKey(k)}
      className={`inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide ${
        sortKey === k ? "text-slate-800" : "text-slate-500 hover:text-slate-700"
      } ${align === "right" ? "justify-end w-full" : ""}`}
    >
      {label}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-800">Brand Comparison</span>
          <span className="text-[11px] text-slate-500">Ranked by inclusion (destination-level presence)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Min inclusion:</span>
            {[0, 0.2, 0.5].map((t) => (
              <button
                key={t}
                onClick={() => setMinInclusion(t)}
                className={`px-2 py-0.5 rounded-full border ${
                  minInclusion === t
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {t === 0 ? "All" : `≥ ${fmtPct(t)}`}
              </button>
            ))}
          </div>
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
            <tr>
              <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-slate-500 w-10">#</th>
              <th className="px-3 py-2 text-left"><SortHeader k="brand" label="Brand" align="left" /></th>
              <th className="px-3 py-2 text-right"><SortHeader k="inclusion" label="Inclusion" /></th>
              <th className="px-3 py-2 text-right"><SortHeader k="frequency" label="Frequency" /></th>
              <th className="px-3 py-2 text-right"><SortHeader k="consistency" label="Consistency" /></th>
              <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-slate-500">Mapped domains</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => {
              const isSelected = selected === r.brand;
              return (
                <tr
                  key={r.brand}
                  className={`border-t border-slate-100 cursor-pointer transition-colors ${
                    isSelected ? "bg-teal-50" : "hover:bg-slate-50"
                  }`}
                  onClick={() => onSelect(r.brand)}
                >
                  <td className="px-3 py-2 text-slate-400 tabular-nums">{i + 1}</td>
                  <td className="px-3 py-2">
                    <span className="font-medium text-slate-800">{r.brand}</span>
                    {r.isTarget && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700">Target</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-700">{fmtPct(r.inclusion)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-700">
                    {r.frequency} / {TOTAL_RUNS}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full ${consistencyPill(r.consistency)}`}>
                      {r.consistency}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs font-mono text-slate-500">{r.domains.join(", ")}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDrillDown(r.brand);
                      }}
                      className="text-[11px] text-teal-600 hover:underline inline-flex items-center gap-0.5"
                    >
                      Evidence <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-xs text-slate-400">
                  No brands match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 border-t border-slate-100 text-[11px] text-slate-500">
        Inclusion measured as destination-level presence (domain mapped to brand), not text mentions.
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section 4 — Brand Narrative (single brand attribute table)
// ─────────────────────────────────────────────────────────────────────────────

interface BrandAttrRow {
  attribute: string;
  category: AttrCategory;
  coverage: number; // rate
  runs: number;
  frequency: number;
}

const buildBrandAttrRows = (brand: string): BrandAttrRow[] => {
  const cells = NARRATIVE[brand] ?? {};
  return ATTRIBUTES.map((a) => {
    const cell = cells[a.name];
    if (!cell) return null;
    return {
      attribute: a.name,
      category: a.category,
      coverage: cell.coverage / TOTAL_RUNS,
      runs: cell.coverage,
      frequency: cell.frequency,
    };
  })
    .filter((r): r is BrandAttrRow => r !== null)
    .sort((a, b) => {
      if (b.coverage !== a.coverage) return b.coverage - a.coverage;
      if (b.frequency !== a.frequency) return b.frequency - a.frequency;
      return a.attribute.localeCompare(b.attribute);
    });
};

const coverageBand = (v: number): { label: string; cls: string } => {
  if (v >= 0.8) return { label: "Highly stable", cls: "bg-green-100 text-green-700" };
  if (v >= 0.5) return { label: "Consistent", cls: "bg-teal-100 text-teal-700" };
  if (v >= 0.2) return { label: "Weak / emerging", cls: "bg-amber-100 text-amber-700" };
  return { label: "Noise", cls: "bg-slate-100 text-slate-500" };
};

const BrandNarrative = ({
  brand,
  onAttributeDrillDown,
  selectedAttribute,
}: {
  brand: string;
  onAttributeDrillDown: (attr: string) => void;
  selectedAttribute: string | null;
}) => {
  const rows = useMemo(() => buildBrandAttrRows(brand), [brand]);
  const [filterCat, setFilterCat] = useState<AttrCategory | "all">("all");
  const [minCov, setMinCov] = useState(0.3);

  const filtered = rows.filter((r) => (filterCat === "all" || r.category === filterCat) && r.coverage >= minCov).slice(0, 10);

  const headlineTop = rows.slice(0, 2).map((r) => r.attribute);
  const headline =
    headlineTop.length > 0
      ? `${brand} is consistently associated with ${headlineTop.join(" and ")} in this context.`
      : `No narrative attributes meet the coverage threshold for ${brand}.`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-800">Brand Narrative — {brand}</span>
          <span className="text-[11px] text-slate-500">Attributes from dictionary · execution-scoped</span>
        </div>
        <p className="text-xs text-slate-600">{headline}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 px-4 py-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">Category:</span>
          {(["all", "Price", "Use Case", "Quality", "Performance", "Design"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`text-[11px] px-2 py-0.5 rounded-full border ${
                filterCat === c
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[11px] text-slate-500">Min coverage:</span>
          {[0, 0.3, 0.5].map((t) => (
            <button
              key={t}
              onClick={() => setMinCov(t)}
              className={`text-[11px] px-2 py-0.5 rounded-full border ${
                minCov === t
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {t === 0 ? "All" : `≥ ${fmtPct(t)}`}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-slate-500">
              <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide w-10">#</th>
              <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide">Attribute</th>
              <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide">Category</th>
              <th className="px-3 py-2 text-right text-[11px] font-medium uppercase tracking-wide">Coverage</th>
              <th className="px-3 py-2 text-right text-[11px] font-medium uppercase tracking-wide">Runs</th>
              <th className="px-3 py-2 text-right text-[11px] font-medium uppercase tracking-wide">Frequency</th>
              <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide">Signal</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const band = coverageBand(r.coverage);
              const isSel = selectedAttribute === r.attribute;
              return (
                <tr
                  key={r.attribute}
                  className={`border-t border-slate-100 cursor-pointer transition-colors ${
                    isSel ? "bg-amber-50" : "hover:bg-slate-50"
                  }`}
                  onClick={() => onAttributeDrillDown(r.attribute)}
                >
                  <td className="px-3 py-2 text-slate-400 tabular-nums">{i + 1}</td>
                  <td className="px-3 py-2 font-medium text-slate-800">{r.attribute}</td>
                  <td className="px-3 py-2 text-slate-600 text-xs">{r.category}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-700">{fmtPct(r.coverage)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-700">
                    {r.runs} / {TOTAL_RUNS}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-700">{r.frequency}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${band.cls}`}>{band.label}</span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAttributeDrillDown(r.attribute);
                      }}
                      className="text-[11px] text-teal-600 hover:underline inline-flex items-center gap-0.5"
                    >
                      Evidence <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-xs text-slate-400">
                  No attributes meet the coverage threshold.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section 5 — Narrative Comparison (attribute-centric cards)
// ─────────────────────────────────────────────────────────────────────────────

const NarrativeComparison = ({
  selectedBrand,
  onCellSelect,
}: {
  selectedBrand: string;
  onCellSelect: (brand: string, attribute: string) => void;
}) => {
  // Pick top attributes that meet ≥30% coverage across multiple brands
  const attrStats = ATTRIBUTES.map((a) => {
    const brands = BRANDS.map((b) => {
      const cell = NARRATIVE[b.brand]?.[a.name];
      if (!cell) return null;
      return {
        brand: b.brand,
        isTarget: b.isTarget,
        coverage: cell.coverage / TOTAL_RUNS,
        runs: cell.coverage,
        frequency: cell.frequency,
      };
    })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .filter((x) => x.coverage >= 0.15)
      .sort((a, b) => {
        if (b.coverage !== a.coverage) return b.coverage - a.coverage;
        return b.frequency - a.frequency;
      });
    return { ...a, brands };
  })
    .filter((a) => a.brands.length >= 2)
    .sort((a, b) => b.brands.length - a.brands.length || (b.brands[0]?.coverage ?? 0) - (a.brands[0]?.coverage ?? 0))
    .slice(0, 4);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-800">Narrative Comparison — Attribute → Brands</h3>
        <span className="text-[11px] text-slate-500">Who owns each part of the narrative landscape?</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attrStats.map((a) => {
          const top = a.brands.slice(0, 5);
          const leader = top[0];
          return (
            <div key={a.name} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-800 capitalize">{a.name}</div>
                    <div className="text-[11px] text-slate-500">{a.category}</div>
                  </div>
                  {leader && (
                    <div className="text-[11px] text-slate-500">
                      Leader: <span className="text-slate-800 font-medium">{leader.brand}</span> · {fmtPct(leader.coverage)}
                    </div>
                  )}
                </div>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-slate-500">
                    <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide">Brand</th>
                    <th className="px-3 py-2 text-right text-[11px] font-medium uppercase tracking-wide">Coverage</th>
                    <th className="px-3 py-2 text-right text-[11px] font-medium uppercase tracking-wide">Runs</th>
                    <th className="px-3 py-2 text-right text-[11px] font-medium uppercase tracking-wide">Freq</th>
                  </tr>
                </thead>
                <tbody>
                  {top.map((b, i) => {
                    const isSel = b.brand === selectedBrand;
                    return (
                      <tr
                        key={b.brand}
                        className={`border-t border-slate-100 cursor-pointer hover:bg-slate-50 ${isSel ? "bg-teal-50" : ""}`}
                        onClick={() => onCellSelect(b.brand, a.name)}
                      >
                        <td className="px-3 py-2">
                          <span className="text-slate-400 tabular-nums mr-2">{i + 1}</span>
                          <span className="font-medium text-slate-800">{b.brand}</span>
                          {b.isTarget && (
                            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700">Target</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          <div className="inline-flex items-center gap-2 justify-end w-full">
                            <div className="w-16 h-1.5 bg-slate-100 rounded overflow-hidden">
                              <div
                                className="h-full bg-teal-500"
                                style={{ width: `${Math.min(100, b.coverage * 100)}%` }}
                              />
                            </div>
                            <span className="text-slate-700">{fmtPct(b.coverage)}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-slate-600">{b.runs}/{TOTAL_RUNS}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-slate-600">{b.frequency}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
        {attrStats.length === 0 && (
          <div className="col-span-full text-center text-xs text-slate-400 py-8 bg-white border border-slate-200 rounded-xl">
            No attributes with multi-brand coverage in this execution.
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section 6 — Drill-down (Run → Response, with phrase highlight)
// ─────────────────────────────────────────────────────────────────────────────

const DrillDownPanel = ({
  brand,
  attribute,
  onClearAttribute,
}: {
  brand: string;
  attribute: string | null;
  onClearAttribute: () => void;
}) => {
  const runs = RUNS_BY_BRAND[brand] ?? fallbackRuns(brand);
  const responses = RESPONSE_SAMPLES[brand] ?? fallbackResponses(brand);
  const [selectedRun, setSelectedRun] = useState(runs[0]?.runId ?? null);
  const activeRun = runs.find((r) => r.runId === selectedRun) ?? runs[0];
  const responseText = activeRun ? responses[activeRun.responseIdx] ?? responses[0] : "";

  return (
    <div id="brand-drilldown" className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-800">Drill-down — Traceability</div>
          <div className="text-[11px] text-slate-500">
            Path: <span className="font-mono">Brand → {attribute ? "Attribute → " : ""}Domain → Run → Response{attribute ? " → Phrase" : ""}</span>
          </div>
        </div>
        {attribute && (
          <div className="inline-flex items-center gap-2">
            <span className="text-[11px] text-slate-500">Attribute focus:</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{attribute}</span>
            <button onClick={onClearAttribute} className="text-[11px] text-slate-500 hover:text-slate-700 underline">
              clear
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Run list */}
        <div className="lg:col-span-2 border-r border-slate-100">
          <div className="px-4 py-2 text-[11px] uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-slate-100">
            Runs where {brand} appears
          </div>
          <table className="w-full text-sm">
            <thead className="bg-white">
              <tr className="text-slate-500 text-[11px]">
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wide">Run</th>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wide">Domain</th>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wide">Model</th>
                <th className="px-3 py-2 text-right font-medium uppercase tracking-wide">Pos</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r) => {
                const isSel = selectedRun === r.runId;
                return (
                  <tr
                    key={r.runId}
                    onClick={() => setSelectedRun(r.runId)}
                    className={`border-t border-slate-100 cursor-pointer ${isSel ? "bg-teal-50" : "hover:bg-slate-50"}`}
                  >
                    <td className="px-3 py-2 font-mono text-xs text-slate-700">{r.runId}</td>
                    <td className="px-3 py-2 font-mono text-xs text-slate-600">{r.domain}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{r.model}</td>
                    <td className="px-3 py-2 text-right text-xs text-slate-500">
                      {r.position !== undefined ? `#${r.position}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Response viewer */}
        <div className="lg:col-span-3">
          <div className="px-4 py-2 text-[11px] uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span>Raw response</span>
            {activeRun && (
              <span className="text-[11px] text-slate-500 normal-case font-normal">
                {activeRun.runId} · {activeRun.model} · prompt: "{activeRun.prompt}"
              </span>
            )}
          </div>
          <div className="p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {activeRun ? highlightPhrases(responseText, brand, attribute ?? undefined) : "No response selected."}
          </div>
          <div className="px-4 pb-4 text-[11px] text-slate-500">
            Highlights: <span className="bg-teal-200/70 px-1 rounded">brand</span>
            {attribute && <> · <span className="bg-amber-200/70 px-1 rounded">{attribute}</span> phrases</>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main view
// ─────────────────────────────────────────────────────────────────────────────

interface BrandAnalysisViewProps {
  context: string;
}

const BrandAnalysisView = ({ context }: BrandAnalysisViewProps) => {
  const ranked = useMemo(() => rankBrands(BRANDS), []);
  const target = ranked.find((b) => b.isTarget) ?? ranked[0];
  const [selectedBrand, setSelectedBrand] = useState<string>(target.brand);
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);

  const current = ranked.find((b) => b.brand === selectedBrand) ?? target;
  const currentRank = ranked.findIndex((b) => b.brand === selectedBrand) + 1;

  const handleSelectBrand = (b: string) => {
    setSelectedBrand(b);
    setSelectedAttribute(null);
  };

  const scrollToDrill = () => {
    document.getElementById("brand-drilldown")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-6">
      {/* Header + Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Brand Analysis</h2>
          <p className="text-xs text-slate-500">
            Execution-level view of brand presence and positioning in <span className="text-slate-700">{context}</span>.
          </p>
        </div>
        <BrandSelector brands={ranked} selected={selectedBrand} onChange={handleSelectBrand} />
      </div>

      {/* Section 2 — Brand Summary */}
      <BrandSummaryCard brand={current} rank={currentRank} onDrillDown={scrollToDrill} />

      {/* Section 3 — Brand Comparison Table */}
      <BrandComparisonTable
        rows={ranked}
        selected={selectedBrand}
        onSelect={handleSelectBrand}
        onDrillDown={(b) => {
          handleSelectBrand(b);
          scrollToDrill();
        }}
      />

      {/* Section 4 — Brand Narrative */}
      <BrandNarrative
        brand={selectedBrand}
        selectedAttribute={selectedAttribute}
        onAttributeDrillDown={(attr) => {
          setSelectedAttribute(attr);
          scrollToDrill();
        }}
      />

      {/* Section 5 — Narrative Comparison */}
      <NarrativeComparison
        selectedBrand={selectedBrand}
        onCellSelect={(b, attr) => {
          handleSelectBrand(b);
          setSelectedAttribute(attr);
          scrollToDrill();
        }}
      />

      {/* Section 6 — Drill-down */}
      <DrillDownPanel
        brand={selectedBrand}
        attribute={selectedAttribute}
        onClearAttribute={() => setSelectedAttribute(null)}
      />
    </div>
  );
};

export default BrandAnalysisView;
