import { GitCompare, ArrowUpCircle, ArrowDownCircle, ArrowUpDown, Download } from "lucide-react";
import type { InsightMode } from "@/pages/Insights";
import { downloadCsv, buildFilename } from "@/lib/csvExport";

interface Props {
  mode: InsightMode;
  onSwitchToCompare: () => void;
  context: string;
}

const entries = [
  { rank: 3, domain: "rtings.com" },
  { rank: 7, domain: "techradar.com/gaming" },
  { rank: 9, domain: "tomsguide.com" },
];

const exits = [{ rank: "—", domain: "cnet.com/laptops" }];

const rankChanges = [
  { domain: "techradar.com", from: 4, to: 1, delta: 3 },
  { domain: "pcmag.com", from: 2, to: 3, delta: -1 },
  { domain: "notebookcheck.net", from: 6, to: 4, delta: 2 },
  { domain: "bestbuy.com", from: 3, to: 6, delta: -3 },
];

const exportData = (context: string) => {
  const rows: (string | number)[][] = [
    ["Type", "Domain", "Apr Rank", "May Rank", "Delta"],
    ...entries.map((e) => ["Entry", e.domain, "—", e.rank, "NEW"]),
    ...exits.map((e) => ["Exit", e.domain, e.rank, "—", "EXITED"]),
    ...rankChanges.map((r) => ["Rank Change", r.domain, r.from, r.to, r.delta > 0 ? `+${r.delta}` : r.delta]),
  ];
  downloadCsv(buildFilename(context, "competitive-movement"), rows);
};

const CompetitiveMovement = ({ mode, onSwitchToCompare, context }: Props) => {
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

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={() => exportData(context)}
          className="border border-slate-200 text-slate-600 text-xs h-7 px-3 rounded-md inline-flex items-center gap-1.5 hover:bg-slate-50"
        >
          <Download className="w-3 h-3" /> Export Movement Data
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {/* Entries */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Entries</span>
            <ArrowUpCircle className="w-3.5 h-3.5 text-green-500" />
          </div>
          <p className="text-xs text-slate-600 mb-3">3 domains entered top 10 (Apr → May)</p>
          {entries.map((e) => (
            <div key={e.domain} className="py-2 border-b border-slate-100 flex items-center gap-3">
              <span className="bg-green-100 text-green-700 text-[11px] rounded-full w-6 h-6 flex items-center justify-center tabular-nums">
                #{e.rank}
              </span>
              <span className="font-mono text-xs text-slate-700 flex-1">{e.domain}</span>
              <span className="bg-green-50 text-green-600 text-[11px] rounded-full px-2 py-0.5">NEW</span>
            </div>
          ))}
          <p className="text-[11px] text-slate-400 italic mt-3">
            Domains that appeared in Top 10 in May but not in April
          </p>
        </div>

        {/* Exits */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Exits</span>
            <ArrowDownCircle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <p className="text-xs text-slate-600 mb-3">1 domain exited top 10 (Apr → May)</p>
          {exits.map((e) => (
            <div key={e.domain} className="py-2 border-b border-slate-100 flex items-center gap-3">
              <span className="bg-slate-100 text-slate-500 text-[11px] rounded-full w-6 h-6 flex items-center justify-center tabular-nums">
                {e.rank}
              </span>
              <span className="font-mono text-xs text-slate-700 flex-1">{e.domain}</span>
              <span className="bg-red-50 text-red-500 text-[11px] rounded-full px-2 py-0.5">EXITED</span>
            </div>
          ))}
          <p className="text-[11px] text-slate-400 italic mt-3">
            Domains that appeared in Top 10 in April but not in May
          </p>
        </div>

        {/* Rank Change */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Rank Change</span>
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-xs text-slate-600 mb-3">4 domains shifted position</p>
          {rankChanges.map((r) => {
            const positive = r.delta > 0;
            return (
              <div key={r.domain} className="py-2 border-b border-slate-100 flex items-center gap-2">
                <span className="font-mono text-xs text-slate-700 flex-1">{r.domain}</span>
                <span className="text-[11px] text-slate-400 tabular-nums">
                  #{r.from} → #{r.to}
                </span>
                <span
                  className={`text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-full ${
                    positive ? "bg-green-100 text-green-700" : "bg-red-50 text-red-500"
                  }`}
                >
                  {positive ? "↑" : "↓"} {positive ? "+" : ""}{r.delta}
                </span>
              </div>
            );
          })}
          <p className="text-[11px] text-slate-400 italic mt-3">
            Domains present in both executions with changed rank
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveMovement;
