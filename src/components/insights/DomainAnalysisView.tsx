import { useMemo, useState } from "react";
import {
  Globe,
  Target,
  ShoppingBag,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Download,
  Search,
  Info,
  X,
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import ExportButton from "@/components/export/ExportButton";
import { DEFAULT_CONTEXT, singleExecutionScope } from "@/lib/export/mockContext";
import { domainTables } from "@/lib/export/builders";

// ─────────────────────────────────────────────────────────────────────────────
// Mock dataset (execution-scoped, deterministic)
// ─────────────────────────────────────────────────────────────────────────────

type DomainType = "publisher" | "brand" | "retail";

interface DomainRow {
  domain: string;
  type: DomainType;
  mentions: number;
  runs_appeared: number;
  total_runs: number;
  avg_position?: number;
}

const TOTAL_RUNS = 12;

const DOMAINS: DomainRow[] = [
  { domain: "techradar.com", type: "publisher", mentions: 9, runs_appeared: 7, total_runs: TOTAL_RUNS, avg_position: 1.6 },
  { domain: "pcmag.com", type: "publisher", mentions: 8, runs_appeared: 6, total_runs: TOTAL_RUNS, avg_position: 2.1 },
  { domain: "rtings.com", type: "publisher", mentions: 6, runs_appeared: 5, total_runs: TOTAL_RUNS, avg_position: 2.8 },
  { domain: "tomshardware.com", type: "publisher", mentions: 5, runs_appeared: 5, total_runs: TOTAL_RUNS, avg_position: 3.0 },
  { domain: "dell.com", type: "brand", mentions: 5, runs_appeared: 4, total_runs: TOTAL_RUNS, avg_position: 2.4 },
  { domain: "bestbuy.com", type: "retail", mentions: 4, runs_appeared: 4, total_runs: TOTAL_RUNS, avg_position: 3.6 },
  { domain: "wired.com", type: "publisher", mentions: 4, runs_appeared: 3, total_runs: TOTAL_RUNS, avg_position: 3.2 },
  { domain: "apple.com", type: "brand", mentions: 3, runs_appeared: 3, total_runs: TOTAL_RUNS, avg_position: 2.0 },
  { domain: "engadget.com", type: "publisher", mentions: 3, runs_appeared: 3, total_runs: TOTAL_RUNS, avg_position: 4.0 },
  { domain: "amazon.com", type: "retail", mentions: 3, runs_appeared: 2, total_runs: TOTAL_RUNS, avg_position: 4.5 },
  { domain: "hp.com", type: "brand", mentions: 2, runs_appeared: 2, total_runs: TOTAL_RUNS, avg_position: 3.5 },
  { domain: "theverge.com", type: "publisher", mentions: 2, runs_appeared: 2, total_runs: TOTAL_RUNS, avg_position: 4.0 },
];

const TOTAL_MENTIONS = DOMAINS.reduce((s, d) => s + d.mentions, 0);

const enrich = (d: DomainRow) => ({
  ...d,
  persistence: d.runs_appeared / d.total_runs,
  share: d.mentions / TOTAL_MENTIONS,
});

type EnrichedDomain = ReturnType<typeof enrich>;

// Deterministic ranking: mentions DESC → persistence DESC → share DESC → domain ASC
const rankDomains = (rows: DomainRow[]): EnrichedDomain[] =>
  rows
    .map(enrich)
    .sort((a, b) => {
      if (b.mentions !== a.mentions) return b.mentions - a.mentions;
      if (b.persistence !== a.persistence) return b.persistence - a.persistence;
      if (b.share !== a.share) return b.share - a.share;
      return a.domain.localeCompare(b.domain);
    });

// Drill-down sample data per domain
const RUNS_BY_DOMAIN: Record<string, { runId: string; prompt: string; model: string; position?: number; responseIdx: number }[]> = {
  "techradar.com": [
    { runId: "run-001", prompt: "Best laptops for home office", model: "GPT-4o", position: 2, responseIdx: 0 },
    { runId: "run-003", prompt: "Best laptops for home office", model: "GPT-4o", position: 1, responseIdx: 1 },
    { runId: "run-005", prompt: "Best laptops for home office", model: "GPT-4o", position: 2, responseIdx: 0 },
    { runId: "run-007", prompt: "Best laptops for home office", model: "Claude 3.5", position: 3, responseIdx: 1 },
    { runId: "run-009", prompt: "Best laptops for home office", model: "GPT-4o", position: 1, responseIdx: 0 },
    { runId: "run-011", prompt: "Best laptops for home office", model: "Claude 3.5", position: 2, responseIdx: 1 },
    { runId: "run-012", prompt: "Best laptops for home office", model: "GPT-4o", position: 2, responseIdx: 0 },
  ],
};

const RESPONSE_SAMPLES: Record<string, string[]> = {
  "techradar.com": [
    "For home office use, TechRadar consistently recommends the Dell XPS 13 as a top pick due to its build quality and performance. According to techradar.com, this model offers the best balance of portability and power for professionals working from home.",
    "Reviews from techradar.com and pcmag.com both highlight the importance of display quality. TechRadar specifically rates the Dell XPS series highly for its colour accuracy and overall reliability for extended work sessions.",
  ],
};

const fallbackRuns = (domain: string) => [
  { runId: "run-002", prompt: "Best laptops for home office", model: "GPT-4o", position: 3, responseIdx: 0 },
  { runId: "run-006", prompt: "Best laptops for home office", model: "Claude 3.5", position: 4, responseIdx: 0 },
];

const fallbackResponses = (domain: string) => [
  `Several sources, including ${domain}, are referenced in model responses for this prompt. The domain is surfaced in the context of laptop recommendations and product comparisons.`,
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_META: Record<DomainType, { label: string; pill: string; Icon: typeof Globe }> = {
  publisher: { label: "Publisher", pill: "bg-green-100 text-green-700", Icon: Globe },
  brand: { label: "Brand", pill: "bg-amber-100 text-amber-700", Icon: Target },
  retail: { label: "Retail", pill: "bg-blue-100 text-blue-700", Icon: ShoppingBag },
};

const fmtPct = (v: number) => `${(v * 100).toFixed(1)}%`;

const computeHHI = (rows: EnrichedDomain[]) =>
  rows.reduce((sum, r) => sum + r.share * r.share, 0);

// Highlight occurrences of `term` (case-insensitive, also matches base domain without TLD)
const highlightDomain = (text: string, domain: string) => {
  const base = domain.replace(/\.[a-z]+$/i, "");
  const pattern = new RegExp(`(${domain.replace(/\./g, "\\.")}|\\b${base}\\b)`, "gi");
  const parts = text.split(pattern);
  return parts.map((p, i) =>
    pattern.test(p) ? (
      <mark key={i} className="bg-amber-200/70 text-slate-900 rounded px-0.5 font-medium">
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    )
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const DomainSummaryCard = ({ leader, onDrillDown }: { leader: EnrichedDomain; onDrillDown: (d: string) => void }) => {
  const meta = TYPE_META[leader.type];
  const Icon = meta.Icon;
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500 uppercase tracking-wide">Leading Domain</span>
        <span className="text-[11px] text-slate-400">Execution: May 2026 · Ranking: mentions ↓ · persistence ↓</span>
      </div>
      <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-slate-400" />
            <h3 className="text-2xl font-semibold font-mono text-slate-800">{leader.domain}</h3>
            <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full ${meta.pill}`}>{meta.label}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">Appears in</div>
            <div className="text-lg font-semibold text-slate-800 tabular-nums">
              {leader.runs_appeared} / {leader.total_runs} <span className="text-xs text-slate-500 font-normal">runs</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">Persistence</div>
            <div className="text-lg font-semibold text-slate-800 tabular-nums">{fmtPct(leader.persistence)}</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">Domain share</div>
            <div className="text-lg font-semibold text-slate-800 tabular-nums">{fmtPct(leader.share)}</div>
          </div>
          {leader.avg_position !== undefined && (
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wide">Avg position</div>
              <div className="text-lg font-semibold text-slate-500 tabular-nums">#{leader.avg_position.toFixed(1)}</div>
            </div>
          )}
        </div>
        <div className="ml-auto">
          <button
            onClick={() => onDrillDown(leader.domain)}
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

type SortKey = "mentions" | "persistence" | "share" | "avg_position";

const RankedDomainTable = ({
  rows,
  selected,
  onSelect,
  onDrillDown,
}: {
  rows: EnrichedDomain[];
  selected: string | null;
  onSelect: (d: string) => void;
  onDrillDown: (d: string) => void;
}) => {
  const [sortKey, setSortKey] = useState<SortKey>("mentions");
  const [filter, setFilter] = useState<DomainType | "all">("all");
  const TOP_N = 10;

  const sorted = useMemo(() => {
    const filtered = filter === "all" ? rows : rows.filter((r) => r.type === filter);
    const sortedRows = [...filtered].sort((a, b) => {
      if (sortKey === "avg_position") {
        return (a.avg_position ?? 99) - (b.avg_position ?? 99);
      }
      const av = a[sortKey] as number;
      const bv = b[sortKey] as number;
      if (bv !== av) return bv - av;
      // deterministic tiebreak
      if (b.mentions !== a.mentions) return b.mentions - a.mentions;
      if (b.persistence !== a.persistence) return b.persistence - a.persistence;
      return a.domain.localeCompare(b.domain);
    });
    return sortedRows.slice(0, TOP_N);
  }, [rows, sortKey, filter]);

  const exportCsv = () => {
    const header = ["rank", "domain", "type", "mentions", "runs_appeared", "persistence", "domain_share", "avg_position"];
    const lines = [header.join(",")];
    rankDomains(rows).forEach((r, i) => {
      lines.push(
        [i + 1, r.domain, r.type, r.mentions, r.runs_appeared, r.persistence.toFixed(4), r.share.toFixed(4), r.avg_position ?? ""].join(",")
      );
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "domain-analysis-may-2026.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortHeader = ({ k, label, align = "right" }: { k: SortKey; label: string; align?: "left" | "right" }) => (
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
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Filter:</span>
          {(["all", "publisher", "brand", "retail"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[11px] px-2 py-1 rounded-full border transition-colors ${
                filter === f ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {f === "all" ? "All" : TYPE_META[f].label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500">Showing top {Math.min(TOP_N, sorted.length)} domains. Export CSV for full dataset.</span>
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
              <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide">Domain</th>
              <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide">Type</th>
              <th className="px-3 py-2 text-right"><SortHeader k="mentions" label="Mentions" /></th>
              <th className="px-3 py-2 text-right"><SortHeader k="persistence" label="Persistence" /></th>
              <th className="px-3 py-2 text-right"><SortHeader k="share" label="Share" /></th>
              <th className="px-3 py-2 text-right"><SortHeader k="avg_position" label="Avg Pos" /></th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => {
              const meta = TYPE_META[r.type];
              const isSelected = selected === r.domain;
              return (
                <tr
                  key={r.domain}
                  className={`border-t border-slate-100 cursor-pointer transition-colors ${
                    isSelected ? "bg-teal-50" : "hover:bg-slate-50"
                  }`}
                  onClick={() => onSelect(r.domain)}
                >
                  <td className="px-3 py-2 text-slate-400 tabular-nums">{i + 1}</td>
                  <td className="px-3 py-2 font-mono text-slate-800">{r.domain}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full ${meta.pill}`}>{meta.label}</span>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-700">{r.mentions}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-700">{fmtPct(r.persistence)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-700">{fmtPct(r.share)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-500">
                    {r.avg_position !== undefined ? `#${r.avg_position.toFixed(1)}` : "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDrillDown(r.domain);
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
                <td colSpan={8} className="px-3 py-8 text-center text-xs text-slate-400">
                  No domains match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DistributionStructure = ({ rows }: { rows: EnrichedDomain[] }) => {
  const counts = rows.reduce(
    (acc, r) => {
      acc[r.type] += 1;
      return acc;
    },
    { publisher: 0, brand: 0, retail: 0 } as Record<DomainType, number>
  );
  const total = rows.length;
  const pct = (n: number) => (total === 0 ? 0 : (n / total) * 100);

  const ranked = [...rows].sort((a, b) => b.mentions - a.mentions);
  const top5Share = ranked.slice(0, 5).reduce((s, r) => s + r.share, 0);
  const hhi = computeHHI(rows);
  const hhiBand = hhi < 0.15 ? "Fragmented" : hhi <= 0.3 ? "Moderate" : "Concentrated";

  const dominantType =
    counts.publisher >= counts.brand && counts.publisher >= counts.retail
      ? "publisher-mediated"
      : counts.brand >= counts.retail
      ? "brand-mediated"
      : "retail-mediated";

  const insight = `The category is ${dominantType}, with a ${hhiBand.toLowerCase()} concentrated core set of domains shaping discovery.`;

  const maxMentions = Math.max(...ranked.map((r) => r.mentions));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 3.1 Source Mediation */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-700">Source Mediation</h4>
          <Info className="w-3.5 h-3.5 text-slate-300" />
        </div>
        <div className="flex h-6 rounded-md overflow-hidden mb-3">
          {(["publisher", "brand", "retail"] as DomainType[]).map((t) => {
            const w = pct(counts[t]);
            if (w === 0) return null;
            const bg = t === "publisher" ? "bg-green-500" : t === "brand" ? "bg-amber-500" : "bg-blue-500";
            return (
              <div key={t} className={`${bg} flex items-center justify-center text-[10px] text-white font-medium`} style={{ width: `${w}%` }}>
                {w.toFixed(0)}%
              </div>
            );
          })}
        </div>
        <ul className="space-y-1.5 text-xs">
          {(["publisher", "brand", "retail"] as DomainType[]).map((t) => {
            const dot = t === "publisher" ? "bg-green-500" : t === "brand" ? "bg-amber-500" : "bg-blue-500";
            return (
              <li key={t} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  {TYPE_META[t].label}s
                </span>
                <span className="text-slate-700 font-medium tabular-nums">
                  {pct(counts[t]).toFixed(0)}% <span className="text-slate-400 font-normal">({counts[t]} of {total})</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 3.2 Distribution Shape */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-700">Distribution Shape</h4>
          <Info className="w-3.5 h-3.5 text-slate-300" />
        </div>
        <div className="space-y-1.5 mb-3">
          {ranked.slice(0, 8).map((r) => {
            const isTarget = r.domain === "dell.com";
            const w = (r.mentions / maxMentions) * 100;
            return (
              <div key={r.domain} className="flex items-center gap-2 text-[11px]">
                <span className={`w-24 truncate font-mono ${isTarget ? "text-teal-700 font-semibold" : "text-slate-600"}`}>{r.domain}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${isTarget ? "bg-teal-600" : "bg-slate-400"}`} style={{ width: `${w}%` }} />
                </div>
                <span className="w-8 text-right tabular-nums text-slate-500">{r.mentions}</span>
              </div>
            );
          })}
        </div>
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-[10px] uppercase text-slate-500">Top 5 Share</div>
            <div className="font-semibold text-slate-700 tabular-nums">{fmtPct(top5Share)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500">HHI</div>
            <div className="font-semibold text-slate-700 tabular-nums">
              {hhi.toFixed(3)} <span className="text-slate-500 font-normal">({hhiBand})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3.3 Structural Insight */}
      <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-700">Structural Insight</h4>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{insight}</p>
        <div className="mt-auto pt-3 text-[11px] text-slate-400 italic">
          Derived from source mix and HHI. No interpretation beyond the displayed metrics.
        </div>
      </div>
    </div>
  );
};

const DrillDownPanel = ({ domain, onClose }: { domain: string; onClose: () => void }) => {
  const runs = RUNS_BY_DOMAIN[domain] ?? fallbackRuns(domain);
  const responses = RESPONSE_SAMPLES[domain] ?? fallbackResponses(domain);
  const [selectedRun, setSelectedRun] = useState<string | null>(runs[0]?.runId ?? null);

  const activeRun = runs.find((r) => r.runId === selectedRun) ?? runs[0];
  const activeResponse = activeRun ? responses[activeRun.responseIdx] ?? responses[0] : responses[0];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Domain</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="font-mono font-semibold text-slate-800">{domain}</span>
          {selectedRun && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-500">Run</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="font-mono text-slate-700">{selectedRun}</span>
            </>
          )}
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Run-level list */}
        <div className="md:col-span-2 border-r border-slate-100 max-h-[420px] overflow-y-auto">
          <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-slate-500 bg-slate-50/50 sticky top-0">
            Runs containing {domain} ({runs.length})
          </div>
          <ul>
            {runs.map((r) => {
              const isActive = r.runId === selectedRun;
              return (
                <li key={r.runId}>
                  <button
                    onClick={() => setSelectedRun(r.runId)}
                    className={`w-full text-left px-3 py-2 text-xs border-b border-slate-50 hover:bg-slate-50 ${
                      isActive ? "bg-teal-50/70" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-slate-700">{r.runId}</span>
                      {r.position !== undefined && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">#{r.position}</span>
                      )}
                    </div>
                    <div className="text-slate-500 truncate mt-0.5">{r.prompt}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{r.model}</div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Response-level view */}
        <div className="md:col-span-3 p-4 max-h-[420px] overflow-y-auto">
          {activeRun && (
            <>
              <div className="flex items-center justify-between mb-2 text-[11px] text-slate-500">
                <div>
                  <span className="font-mono text-slate-700">{activeRun.runId}</span> · {activeRun.prompt}
                </div>
                <div>{activeRun.model}</div>
              </div>
              <div className="text-sm leading-relaxed text-slate-800 bg-slate-50/50 border border-slate-100 rounded-md p-3">
                {highlightDomain(activeResponse, domain)}
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                <Search className="w-3 h-3" />
                Highlighted phrases mark exact occurrences of <span className="font-mono">{domain}</span> as parsed by the system.
              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <button onClick={onClose} className="text-[11px] text-slate-600 hover:text-slate-800 inline-flex items-center gap-1">
          <ChevronLeft className="w-3 h-3" />
          Back to Domain Table
        </button>
        <span className="text-[11px] text-slate-400">Domain → Run → Response · execution-scoped, deterministic</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main view
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  context?: string;
}

const DomainAnalysisView = ({ context = "Best laptops for home office" }: Props) => {
  const ranked = useMemo(() => rankDomains(DOMAINS), []);
  const leader = ranked[0];
  const [selected, setSelected] = useState<string | null>(null);
  const [drillDomain, setDrillDomain] = useState<string | null>(null);

  return (
    <div id="insight-section-domain-analysis" className="space-y-6">
      <SectionHeader
        title="Domain Analysis"
        right={
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Snapshot · May 2026 · {context}
            </span>
            <ExportButton
              sourceView="domain_analysis"
              context={DEFAULT_CONTEXT}
              scope={singleExecutionScope()}
              tablesBuilder={({ topN }) => domainTables(singleExecutionScope(), { topN })}
              appliedUiFilters={{ context }}
              label="Export"
            />
          </div>
        }
      />

      {/* 1. Domain Summary */}
      <DomainSummaryCard leader={leader} onDrillDown={(d) => setDrillDomain(d)} />

      {/* 2. Ranked Domain Table */}
      <RankedDomainTable
        rows={ranked}
        selected={selected}
        onSelect={(d) => setSelected(d)}
        onDrillDown={(d) => setDrillDomain(d)}
      />

      {/* 3. Distribution / Structure */}
      <DistributionStructure rows={ranked} />

      {/* 4. Drill-down */}
      {drillDomain && <DrillDownPanel domain={drillDomain} onClose={() => setDrillDomain(null)} />}
    </div>
  );
};

export default DomainAnalysisView;
