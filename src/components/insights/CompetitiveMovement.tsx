import { useState } from "react";
import { GitCompare, ArrowUpCircle, ArrowDownCircle, ArrowUpDown, Download } from "lucide-react";
import type { InsightMode } from "@/pages/Insights";
import { downloadCsv, buildFilename } from "@/lib/csvExport";
import McpContextTrigger from "@/components/mcp/McpContextTrigger";
import DeltaIndicator from "./DeltaIndicator";


interface Props {
  mode: InsightMode;
  onSwitchToCompare: () => void;
  context: string;
}

type Kind = "publisher" | "brand" | "retail";
type Filter = "all" | "publisher" | "brand" | "retail";

const entries: { rank: number; domain: string; kind: Kind }[] = [
  { rank: 3, domain: "rtings.com", kind: "publisher" },
  { rank: 7, domain: "techradar.com/gaming", kind: "publisher" },
  { rank: 9, domain: "tomsguide.com", kind: "publisher" },
  { rank: 5, domain: "lenovo.com", kind: "brand" },
];

const exits: { rank: string | number; domain: string; kind: Kind }[] = [
  { rank: "—", domain: "cnet.com/laptops", kind: "publisher" },
  { rank: "—", domain: "acer.com", kind: "brand" },
  { rank: "—", domain: "newegg.com", kind: "retail" },
];

// Attribute-centric narrative comparison — coverage_rate (%) per brand within attribute
const attributeComparisons: {
  attribute: string;
  rows: { brand: string; from: number; to: number; isTarget?: boolean }[];
}[] = [
  {
    attribute: "Affordability / Budget",
    rows: [
      { brand: "Lenovo", from: 65, to: 68 },
      { brand: "Dell", from: 58, to: 62, isTarget: true },
      { brand: "HP", from: 60, to: 55 },
    ],
  },
  {
    attribute: "Performance / Gaming",
    rows: [
      { brand: "Dell", from: 54, to: 59, isTarget: true },
      { brand: "Lenovo", from: 51, to: 50 },
      { brand: "HP", from: 48, to: 46 },
    ],
  },
  {
    attribute: "Reliability / Build",
    rows: [
      { brand: "Dell", from: 61, to: 60, isTarget: true },
      { brand: "Lenovo", from: 57, to: 59 },
      { brand: "HP", from: 55, to: 53 },
    ],
  },
];

const rankChanges: { domain: string; from: number; to: number; delta: number; kind: Kind }[] = [
  { domain: "techradar.com", from: 4, to: 1, delta: 3, kind: "publisher" },
  { domain: "pcmag.com", from: 2, to: 3, delta: -1, kind: "publisher" },
  { domain: "notebookcheck.net", from: 6, to: 4, delta: 2, kind: "publisher" },
  { domain: "bestbuy.com", from: 3, to: 6, delta: -3, kind: "publisher" },
  { domain: "dell.com", from: 8, to: 5, delta: 3, kind: "brand" },
  { domain: "hp.com", from: 5, to: 7, delta: -2, kind: "brand" },
];

// Domain Analysis comparison — foundational measurements, Apr → May
const domainMetricChanges: {
  domain: string;
  kind: Kind;
  wasFrom: number;
  wasTo: number;
  nasFrom: number;
  nasTo: number;
}[] = [
  { domain: "techradar.com", kind: "publisher", wasFrom: 18.4, wasTo: 24.1, nasFrom: 14.2, nasTo: 17.8 },
  { domain: "pcmag.com", kind: "publisher", wasFrom: 21.0, wasTo: 19.6, nasFrom: 16.1, nasTo: 14.5 },
  { domain: "notebookcheck.net", kind: "publisher", wasFrom: 12.8, wasTo: 15.3, nasFrom: 9.8, nasTo: 11.3 },
  { domain: "bestbuy.com", kind: "retail", wasFrom: 16.2, wasTo: 11.9, nasFrom: 12.4, nasTo: 8.8 },
  { domain: "dell.com", kind: "brand", wasFrom: 8.1, wasTo: 12.6, nasFrom: 6.2, nasTo: 9.3 },
  { domain: "hp.com", kind: "brand", wasFrom: 10.4, wasTo: 10.4, nasFrom: 8.0, nasTo: 7.7 },
];

// Brand Recommendation comparison — recommended-brands list metrics, Apr → May
const brandRecommendationChanges: {
  brand: string;
  isTarget?: boolean;
  inclusionFrom: number;
  inclusionTo: number;
  weightedFrom: number;
  weightedTo: number;
  top3From: number;
  top3To: number;
  top5From: number;
  top5To: number;
}[] = [
  {
    brand: "Dell",
    isTarget: true,
    inclusionFrom: 58.3,
    inclusionTo: 66.7,
    weightedFrom: 0.5,
    weightedTo: 0.58,
    top3From: 33.3,
    top3To: 41.7,
    top5From: 50.0,
    top5To: 58.3,
  },
  {
    brand: "HP",
    inclusionFrom: 54.2,
    inclusionTo: 50.0,
    weightedFrom: 0.46,
    weightedTo: 0.41,
    top3From: 29.2,
    top3To: 25.0,
    top5From: 45.8,
    top5To: 41.7,
  },
  {
    brand: "Lenovo",
    inclusionFrom: 45.8,
    inclusionTo: 45.8,
    weightedFrom: 0.38,
    weightedTo: 0.4,
    top3From: 20.8,
    top3To: 25.0,
    top5From: 37.5,
    top5To: 37.5,
  },
  {
    brand: "Apple",
    inclusionFrom: 62.5,
    inclusionTo: 58.3,
    weightedFrom: 0.55,
    weightedTo: 0.52,
    top3From: 41.7,
    top3To: 37.5,
    top5From: 54.2,
    top5To: 50.0,
  },
];


const exportData = (
  context: string,
  fEntries: typeof entries,
  fExits: typeof exits,
  fRankChanges: typeof rankChanges,
  fDomainMetrics: typeof domainMetricChanges,
) => {
  const rows: (string | number)[][] = [
    ["Type", "Kind", "Domain", "Apr Rank", "May Rank", "Delta"],
    ...fEntries.map((e) => ["Entry", e.kind, e.domain, "—", e.rank, "NEW"]),
    ...fExits.map((e) => ["Exit", e.kind, e.domain, e.rank, "—", "EXITED"]),
    ...fRankChanges.map((r) => [
      "Rank Change",
      r.kind,
      r.domain,
      r.from,
      r.to,
      r.delta > 0 ? `+${r.delta}` : r.delta,
    ]),
    [],
    ["Type", "Kind", "Domain", "WAS Apr", "WAS May", "Δ WAS", "NAS Apr", "NAS May", "Δ NAS"],
    ...fDomainMetrics.map((d) => [
      "Domain Metric",
      d.kind,
      d.domain,
      d.wasFrom,
      d.wasTo,
      (d.wasTo - d.wasFrom).toFixed(1),
      `${d.nasFrom}%`,
      `${d.nasTo}%`,
      `${(d.nasTo - d.nasFrom).toFixed(1)}pp`,
    ]),
    [],
    [
      "Type",
      "Brand",
      "Rec. Inclusion Apr",
      "Rec. Inclusion May",
      "Δ Rec. Inclusion",
      "Weighted Apr",
      "Weighted May",
      "Δ Weighted",
      "Top 3 Apr",
      "Top 3 May",
      "Δ Top 3",
      "Top 5 Apr",
      "Top 5 May",
      "Δ Top 5",
    ],
    ...brandRecommendationChanges.map((b) => [
      "Brand Recommendation",
      b.brand,
      `${b.inclusionFrom}%`,
      `${b.inclusionTo}%`,
      `${(b.inclusionTo - b.inclusionFrom).toFixed(1)}pp`,
      b.weightedFrom.toFixed(2),
      b.weightedTo.toFixed(2),
      (b.weightedTo - b.weightedFrom).toFixed(2),
      `${b.top3From}%`,
      `${b.top3To}%`,
      `${(b.top3To - b.top3From).toFixed(1)}pp`,
      `${b.top5From}%`,
      `${b.top5To}%`,
      `${(b.top5To - b.top5From).toFixed(1)}pp`,
    ]),
  ];
  downloadCsv(buildFilename(context, "competitive-movement"), rows);
};


const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "publisher", label: "Publishers only" },
  { id: "brand", label: "Brands only" },
  { id: "retail", label: "Retail only" },
];

const CompetitiveMovement = ({ mode, onSwitchToCompare, context }: Props) => {
  const [filter, setFilter] = useState<Filter>("all");

  if (mode !== "compare") {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-center gap-4">
        <GitCompare className="w-7 h-7 text-slate-300 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-slate-600">Competitive Movement requires Compare mode</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Select two executions in the Top Bar to view entry, exit, and rank changes.
          </p>
          <button onClick={onSwitchToCompare} className="text-xs text-teal-600 hover:underline mt-1.5">
            Switch to Compare mode
          </button>
        </div>
      </div>
    );
  }

  const matches = (k: Kind) => filter === "all" || filter === k;
  const fEntries = entries.filter((e) => matches(e.kind));
  const fExits = exits.filter((e) => matches(e.kind));
  const fRankChanges = rankChanges.filter((r) => matches(r.kind));

  const emptyHint = (label: string) => (
    <p className="text-[11px] text-slate-400 italic py-3">No {label} for current filter.</p>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="inline-flex items-center bg-slate-100 rounded-full p-0.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`text-xs font-medium rounded-full px-3 py-1 transition-colors ${
                filter === f.id
                  ? "bg-slate-800 text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => exportData(context, fEntries, fExits, fRankChanges)}
          className="border border-slate-200 text-slate-600 text-xs h-7 px-3 rounded-md inline-flex items-center gap-1.5 hover:bg-slate-50"
        >
          <Download className="w-3 h-3" /> Export Movement Data
        </button>
      </div>
      {(() => {
        const significant = fRankChanges.filter((r) => Math.abs(r.delta) >= 2).length;
        const stable = 7;
        const plural = (n: number, s: string, p: string) => `${n} ${n === 1 ? s : p}`;

        // Interpretive layer derived from source mix of entries / exits
        const counts = (arr: { kind: Kind }[]) => ({
          publisher: arr.filter((x) => x.kind === "publisher").length,
          brand: arr.filter((x) => x.kind === "brand").length,
          retail: arr.filter((x) => x.kind === "retail").length,
        });
        const ec = counts(fEntries);
        const xc = counts(fExits);
        const dominant = (c: ReturnType<typeof counts>) =>
          (Object.entries(c).sort((a, b) => b[1] - a[1])[0] ?? ["", 0]) as [string, number];
        const [eDom, eDomN] = dominant(ec);
        const [xDom, xDomN] = dominant(xc);

        let interpretation = "";
        if (fEntries.length > 0 && eDom === "publisher" && eDomN >= 2) {
          interpretation =
            "New entries are primarily review-driven publisher sources, reinforcing comparison and performance-led narratives.";
        } else if (fEntries.length > 0 && eDom === "brand") {
          interpretation =
            "New entries are brand-owned domains, suggesting stronger direct-brand visibility in the surfaced set.";
        } else if (fEntries.length > 0 && eDom === "retail") {
          interpretation =
            "New entries skew toward retail sources, indicating purchase-intent surfaces are gaining ground.";
        }

        // Driver-level explanation: top positive rank-mover with most relevant entries
        const topGainer = [...fRankChanges].sort((a, b) => b.delta - a.delta)[0];
        const driverSources = fEntries
          .filter((e) => e.kind === "publisher")
          .slice(0, 2)
          .map((e) => e.domain);
        const driver =
          topGainer && topGainer.delta > 0 && driverSources.length > 0
            ? `Increase in ${topGainer.domain.replace(/\.com.*/, "")} appears to be driven by new entries from ${driverSources.join(" and ")}.`
            : "";

        return (
          <>
            <p className="text-xs text-slate-500 mb-2">
              {plural(fEntries.length, "entry", "entries")},{" "}
              {plural(fExits.length, "exit", "exits")},{" "}
              {plural(significant, "significant rank change", "significant rank changes")}
              {filter === "all" && (
                <span className="text-slate-400">
                  {" "}· {stable} domains remained stable within the Top 10
                </span>
              )}
            </p>
            {(interpretation || driver) && (
              <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2 mb-3 space-y-1">
                {interpretation && (
                  <p className="text-xs text-slate-600 leading-relaxed">{interpretation}</p>
                )}
                {driver && (
                  <p className="text-xs text-slate-500 leading-relaxed">{driver}</p>
                )}
              </div>
            )}
          </>
        );
      })()}
      <div className="grid grid-cols-3 gap-4">
        {/* Entries */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Entries</span>
            <ArrowUpCircle className="w-3.5 h-3.5 text-green-500" />
          </div>
          <p className="text-xs text-slate-600 mb-3">
            {fEntries.length} {fEntries.length === 1 ? "item" : "items"} entered top 10 (Apr → May)
          </p>
          {fEntries.length === 0
            ? emptyHint("entries")
            : fEntries.map((e) => (
                <div key={e.domain} className="py-2 border-b border-slate-100 flex items-center gap-3">
                  <span className="bg-green-100 text-green-700 text-[11px] rounded-full w-6 h-6 flex items-center justify-center tabular-nums">
                    #{e.rank}
                  </span>
                  <span className="font-mono text-xs text-slate-700 flex-1">{e.domain}</span>
                  <span className="bg-slate-100 text-slate-500 text-[10px] rounded-full px-1.5 py-0.5 uppercase tracking-wide">
                    {e.kind}
                  </span>
                  <span className="bg-green-50 text-green-600 text-[11px] rounded-full px-2 py-0.5">NEW</span>
                  <McpContextTrigger scope="domain" subject={e.domain} executionLabel="Compare: Apr → May 2026" variant="icon" />
                </div>
              ))}
          <p className="text-[11px] text-slate-400 italic mt-3">
            Items that appeared in Top 10 in May but not in April
          </p>
        </div>

        {/* Exits */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Exits</span>
            <ArrowDownCircle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <p className="text-xs text-slate-600 mb-3">
            {fExits.length} {fExits.length === 1 ? "item" : "items"} exited top 10 (Apr → May)
          </p>
          {fExits.length === 0
            ? emptyHint("exits")
            : fExits.map((e) => (
                <div key={e.domain} className="py-2 border-b border-slate-100 flex items-center gap-3">
                  <span className="bg-slate-100 text-slate-500 text-[11px] rounded-full w-6 h-6 flex items-center justify-center tabular-nums">
                    {e.rank}
                  </span>
                  <span className="font-mono text-xs text-slate-700 flex-1">{e.domain}</span>
                  <span className="bg-slate-100 text-slate-500 text-[10px] rounded-full px-1.5 py-0.5 uppercase tracking-wide">
                    {e.kind}
                  </span>
                  <span className="bg-red-50 text-red-500 text-[11px] rounded-full px-2 py-0.5">EXITED</span>
                  <McpContextTrigger scope="domain" subject={e.domain} executionLabel="Compare: Apr → May 2026" variant="icon" />
                </div>
              ))}
          <p className="text-[11px] text-slate-400 italic mt-3">
            Items that appeared in Top 10 in April but not in May
          </p>
        </div>

        {/* Rank Change */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Rank Change</span>
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-xs text-slate-600 mb-3">
            {fRankChanges.length} {fRankChanges.length === 1 ? "item" : "items"} shifted position
          </p>
          {fRankChanges.length === 0
            ? emptyHint("rank changes")
            : fRankChanges.map((r) => {
                const positive = r.delta > 0;
                return (
                  <div key={r.domain} className="py-2 border-b border-slate-100 flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-700 flex-1">{r.domain}</span>
                    <span className="bg-slate-100 text-slate-500 text-[10px] rounded-full px-1.5 py-0.5 uppercase tracking-wide">
                      {r.kind}
                    </span>
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      #{r.from} → #{r.to}
                    </span>
                    <span
                      className={`text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-full ${
                        positive ? "bg-green-100 text-green-700" : "bg-red-50 text-red-500"
                      }`}
                    >
                      {positive ? "↑" : "↓"} {positive ? "+" : ""}
                      {r.delta}
                    </span>
                    <McpContextTrigger scope="domain" subject={r.domain} executionLabel="Compare: Apr → May 2026" variant="icon" />
                  </div>
                );
              })}
          <p className="text-[11px] text-slate-400 italic mt-3">
            Items present in both executions with changed rank
          </p>
        </div>
      </div>

      {/* Attribute-centric Narrative Comparison */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between mb-2">
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Narrative attribute comparison
          </h4>
          <span className="text-[11px] text-slate-400">
            Coverage rate (%) · target + key competitors · Apr → May
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {attributeComparisons.map((card) => {
            const ranked = [...card.rows].sort((a, b) => b.to - a.to);
            return (
              <div key={card.attribute} className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-medium text-slate-700 mb-2">{card.attribute}</p>
                <div className="space-y-1.5">
                  {ranked.map((r) => {
                    const delta = r.to - r.from;
                    const positive = delta > 0;
                    const neutral = delta === 0;
                    return (
                      <div
                        key={r.brand}
                        className={`flex items-center gap-2 text-[11px] py-1 px-1.5 rounded ${
                          r.isTarget ? "bg-teal-50/60" : ""
                        }`}
                      >
                        <span
                          className={`flex-1 truncate ${
                            r.isTarget ? "font-semibold text-teal-700" : "text-slate-600"
                          }`}
                        >
                          {r.brand}
                          {r.isTarget && (
                            <span className="ml-1 text-[9px] uppercase tracking-wide text-teal-500">
                              target
                            </span>
                          )}
                        </span>
                        <span className="text-slate-400 tabular-nums">{r.from}%</span>
                        <span className="text-slate-300">→</span>
                        <span className="text-slate-700 tabular-nums">{r.to}%</span>
                        <span
                          className={`tabular-nums font-semibold w-10 text-right ${
                            neutral
                              ? "text-slate-400"
                              : positive
                                ? "text-green-600"
                                : "text-red-500"
                          }`}
                        >
                          {neutral ? "0pp" : `${positive ? "+" : ""}${delta}pp`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-400 italic mt-2">
          Derived from coverage_rate per brand within each narrative attribute, scoped to the
          selected From / To execution pair.
        </p>
      </div>
    </div>
  );
};

export default CompetitiveMovement;
