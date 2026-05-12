import { useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import { Info, Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Foundational PDPE-derived measurements (WAS, NAS, RLP, AP) shown first.
// Concentration metrics (Top 5 Share, HHI) and tier classification are downstream.
const domains = [
  { rank: 1, domain: "rtings.com", type: "Publisher / Media", was: 142.6, nas: 0.971, rlp: 0.971, ap: 1.8, mentions: 48, persistence: 97.1, avgPos: 1.8, variance: "±0.4", tier: "Core" },
  { rank: 2, domain: "notebookcheck.net", type: "Publisher / Media", was: 118.3, nas: 0.806, rlp: 0.914, ap: 2.3, mentions: 41, persistence: 91.4, avgPos: 2.3, variance: "±0.6", tier: "Core" },
  { rank: 3, domain: "pcmag.com", type: "Publisher / Media", was: 102.4, nas: 0.697, rlp: 0.886, ap: 2.7, mentions: 38, persistence: 88.6, avgPos: 2.7, variance: "±0.7", tier: "Core" },
  { rank: 4, domain: "tomshardware.com", type: "Publisher / Media", was: 88.9, nas: 0.605, rlp: 0.857, ap: 3.1, mentions: 35, persistence: 85.7, avgPos: 3.1, variance: "±0.8", tier: "Core" },
  { rank: 5, domain: "bestbuy.com", type: "Retail / Marketplace", was: 64.1, nas: 0.436, rlp: 0.800, ap: 3.8, mentions: 29, persistence: 80.0, avgPos: 3.8, variance: "±1.1", tier: "Strong" },
  { rank: 6, domain: "amazon.com", type: "Retail / Marketplace", was: 53.8, nas: 0.366, rlp: 0.771, ap: 4.1, mentions: 26, persistence: 77.1, avgPos: 4.1, variance: "±1.2", tier: "Strong" },
  { rank: 7, domain: "theverge.com", type: "Publisher / Media", was: 42.7, nas: 0.291, rlp: 0.686, ap: 4.4, mentions: 22, persistence: 68.6, avgPos: 4.4, variance: "±1.3", tier: "Strong" },
  { rank: 8, domain: "techradar.com", type: "Publisher / Media", was: 34.5, nas: 0.235, rlp: 0.600, ap: 4.9, mentions: 19, persistence: 60.0, avgPos: 4.9, variance: "±1.5", tier: "Strong" },
  { rank: 9, domain: "dell.com", type: "Brand / Retail", was: 28.9, nas: 0.197, rlp: 0.543, ap: 5.2, mentions: 17, persistence: 54.3, avgPos: 5.2, variance: "±1.6", tier: "Strong", tag: "TARGET" },
  { rank: 10, domain: "hp.com", type: "Brand / Retail", was: 21.4, nas: 0.146, rlp: 0.457, ap: 5.8, mentions: 14, persistence: 45.7, avgPos: 5.8, variance: "±1.8", tier: "Peripheral", tag: "COMPETITOR" },
  { rank: 11, domain: "lenovo.com", type: "Brand / Retail", was: 17.9, nas: 0.122, rlp: 0.429, ap: 6.1, mentions: 12, persistence: 42.9, avgPos: 6.1, variance: "±1.9", tier: "Peripheral", tag: "COMPETITOR" },
  { rank: 12, domain: "reddit.com", type: "Forum / Community", was: 15.6, nas: 0.106, rlp: 0.400, ap: 6.4, mentions: 11, persistence: 40.0, avgPos: 6.4, variance: "±2.1", tier: "Peripheral" },
  { rank: 13, domain: "apple.com", type: "Brand / Retail", was: 9.8, nas: 0.067, rlp: 0.286, ap: 7.2, mentions: 8, persistence: 28.6, avgPos: 7.2, variance: "±2.3", tier: "Peripheral" },
  { rank: 14, domain: "nytimes.com", type: "Publisher / Media", was: 5.7, nas: 0.039, rlp: 0.171, ap: 7.8, mentions: 5, persistence: 17.1, avgPos: 7.8, variance: "±2.4", tier: "Peripheral" },
  { rank: 15, domain: "wirecutter.com", type: "Review / Affiliate", was: 4.3, nas: 0.029, rlp: 0.143, ap: 8.1, mentions: 4, persistence: 14.3, avgPos: 8.1, variance: "±2.5", tier: "Peripheral" },
];

const typeColors: Record<string, string> = {
  "Publisher / Media": "bg-blue-50 text-blue-600",
  "Retail / Marketplace": "bg-orange-50 text-orange-600",
  "Brand / Retail": "bg-purple-50 text-purple-600",
  "Forum / Community": "bg-yellow-50 text-yellow-600",
  "Review / Affiliate": "bg-teal-50 text-teal-600",
};

const tierColors: Record<string, string> = {
  Core: "bg-teal-100 text-teal-700",
  Strong: "bg-blue-50 text-blue-600",
  Peripheral: "bg-slate-100 text-slate-500",
};

const promptBreakdown = [
  { label: "Best laptop search", mentions: 8, avgPos: 1.2 },
  { label: "Budget laptop", mentions: 7, avgPos: 1.6 },
  { label: "Gaming laptop", mentions: 8, avgPos: 1.4 },
  { label: "Ultrabook comparison", mentions: 7, avgPos: 2.0 },
  { label: "AI laptop features", mentions: 6, avgPos: 2.4 },
  { label: "Laptop for elderly", mentions: 5, avgPos: 2.6 },
  { label: "Premium laptop", mentions: 7, avgPos: 1.8 },
];

const DomainAuthorityTab = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [coreOnly, setCoreOnly] = useState(false);

  const filtered = coreOnly ? domains.filter((d) => d.tier === "Core") : domains;

  return (
    <div>
      <SectionHeader
        title="Domain Authority Measurements"
        right={<span className="text-xs text-muted-foreground">PDPE aggregation across 35 runs · 24 unique domains · 312 total mentions</span>}
      />

      {/* Methodology / measurement-first definition block */}
      <div className="bg-muted/50 border border-border/60 rounded-md px-4 py-2.5 text-xs text-muted-foreground mb-4 mt-3">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-foreground/70 mb-1.5">Foundational measurements (PDPE-derived)</div>
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <span><strong className="text-foreground">WAS:</strong> Weighted Authority Score — position-weighted citation sum</span>
          <span><strong className="text-foreground">NAS:</strong> Normalised Authority Score — WAS scaled to top domain (0–1)</span>
          <span><strong className="text-foreground">RLP:</strong> Run-Level Persistence — share of runs containing the domain</span>
          <span><strong className="text-foreground">AP:</strong> Average Position — mean citation rank (lower = more prominent)</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-3">
        <button className="h-7 px-2.5 text-xs rounded-md border border-border text-muted-foreground bg-background hover:bg-muted/50">All Types</button>
        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
          <div
            onClick={() => setCoreOnly(!coreOnly)}
            className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer ${coreOnly ? "bg-primary" : "bg-slate-300"}`}
          >
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${coreOnly ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
          Authority Core Only
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="table-header text-left py-2 w-10">#</th>
              <th className="table-header text-left py-2 w-[180px]">Domain</th>
              <th className="table-header text-left py-2 w-[140px]">Authority Type</th>
              <th className="table-header text-center py-2 w-[80px]">Mentions</th>
              <th className="table-header text-center py-2 w-[90px]">Persistence</th>
              <th className="table-header text-center py-2 w-[100px]">Avg Position</th>
              <th className="table-header text-center py-2 w-[100px]">Pos. Variance</th>
              <th className="table-header text-center py-2 w-[110px]">
                <span className="flex items-center gap-1 justify-center">
                  Authority Tier
                  <Tooltip>
                    <TooltipTrigger><Info className="w-3 h-3 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">
                      Core = Persistence ≥ 85% AND Avg Position ≤ 3.5 · Strong = Persistence 50–84% OR Avg Position 3.5–5.5 · Peripheral = below these thresholds
                    </TooltipContent>
                  </Tooltip>
                </span>
              </th>
              <th className="table-header text-right py-2 w-[70px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <>
                <tr
                  key={d.rank}
                  className={`border-b border-border hover:bg-primary/5 transition-colors ${i % 2 === 1 ? "bg-muted/50" : ""} ${d.tag === "TARGET" ? "border-l-2 border-l-primary" : ""}`}
                >
                  <td className="py-2 tabular text-muted-foreground">{d.rank}</td>
                  <td className="py-2 font-mono text-sm text-foreground">
                    {d.domain}
                    {d.tag === "TARGET" && <span className="ml-2 text-xs font-mono bg-primary/10 text-primary rounded px-1">TARGET</span>}
                    {d.tag === "COMPETITOR" && <span className="ml-2 text-xs font-mono bg-muted text-muted-foreground rounded px-1">COMPETITOR</span>}
                  </td>
                  <td className="py-2"><span className={`text-xs rounded-full px-2.5 py-0.5 ${typeColors[d.type] || ""}`}>{d.type}</span></td>
                  <td className="py-2 tabular text-center font-semibold">{d.mentions}</td>
                  <td className="py-2 tabular text-center">{d.persistence.toFixed(1)}%</td>
                  <td className="py-2 tabular text-center">{d.avgPos.toFixed(1)}</td>
                  <td className="py-2 tabular text-center text-muted-foreground">{d.variance}</td>
                  <td className="py-2 text-center"><span className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${tierColors[d.tier]}`}>{d.tier}</span></td>
                  <td className="py-2 text-right">
                    <button onClick={() => setExpanded(expanded === d.rank ? null : d.rank)} className="text-xs text-primary hover:underline">Inspect</button>
                  </td>
                </tr>
                {expanded === d.rank && (
                  <tr key={`exp-${d.rank}`}>
                    <td colSpan={9} className="bg-muted/50 border-t border-border p-4">
                      <div className="text-xs font-medium text-foreground mb-2">Prompt-level breakdown for {d.domain}</div>
                      <div className="space-y-1">
                        {promptBreakdown.map((p) => (
                          <div key={p.label} className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="w-40 text-foreground">{p.label}:</span>
                            <span className="tabular">{p.mentions} mentions</span>
                            <span className="tabular">Avg pos {p.avgPos}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-primary text-center mt-3 cursor-pointer hover:underline">↓ Show all 24 domains</p>

      {/* Core callout */}
      <div className="mt-6 bg-primary/5 border border-primary/20 rounded-md px-4 py-3 text-xs text-primary flex items-start gap-2">
        <Star className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <span>
          <strong>Authority Core:</strong> 4 domains (rtings.com, notebookcheck.net, pcmag.com, tomshardware.com) account for 52.6% of all citations. This is a publisher-dominated, shortlist-driven ecosystem.
        </span>
      </div>
    </div>
  );
};

export default DomainAuthorityTab;
