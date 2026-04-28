import { useState } from "react";
import { GitCompare, ArrowUpCircle, ArrowDownCircle, ArrowUpDown, Download } from "lucide-react";
import type { InsightMode } from "@/pages/Insights";
import { downloadCsv, buildFilename } from "@/lib/csvExport";

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

const exportData = (
  context: string,
  fEntries: typeof entries,
  fExits: typeof exits,
  fRankChanges: typeof rankChanges,
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
        const stable = 7; // domains remaining stable within the Top 10
        const plural = (n: number, s: string, p: string) => `${n} ${n === 1 ? s : p}`;
        return (
          <p className="text-xs text-slate-500 mb-3">
            {plural(fEntries.length, "entry", "entries")},{" "}
            {plural(fExits.length, "exit", "exits")},{" "}
            {plural(significant, "significant rank change", "significant rank changes")}
            {filter === "all" && (
              <span className="text-slate-400">
                {" "}· {stable} domains remained stable within the Top 10
              </span>
            )}
          </p>
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
                  </div>
                );
              })}
          <p className="text-[11px] text-slate-400 italic mt-3">
            Items present in both executions with changed rank
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveMovement;
