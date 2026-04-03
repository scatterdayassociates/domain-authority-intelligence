import SectionHeader from "@/components/SectionHeader";

const concentrationRows = [
  { metric: "Total Mentions", value: "312", interp: "Across 35 runs · 7 prompts · 24 domains", signal: null },
  { metric: "Unique Domains", value: "24", interp: "Range of sources cited", signal: "green" },
  { metric: "Top 5 Share", value: "68.4%", interp: "Top 5 domains hold 68.4% of all citations", signal: "amber" },
  { metric: "HHI", value: "0.142", interp: "Low-to-moderate dominance", signal: "amber" },
  { metric: "Top Domain Share", value: "rtings.com · 15.4%", interp: "Single highest-share domain", signal: "green" },
];

const top5 = [
  { rank: 1, domain: "rtings.com", type: "Publisher / Media", mentions: 48, share: 15.4, cumulative: 15.4 },
  { rank: 2, domain: "notebookcheck.net", type: "Publisher / Media", mentions: 41, share: 13.1, cumulative: 28.5 },
  { rank: 3, domain: "pcmag.com", type: "Publisher / Media", mentions: 38, share: 12.2, cumulative: 40.7 },
  { rank: 4, domain: "tomshardware.com", type: "Publisher / Media", mentions: 35, share: 11.2, cumulative: 51.9 },
  { rank: 5, domain: "bestbuy.com", type: "Retail / Marketplace", mentions: 29, share: 9.3, cumulative: 61.2 },
];

const typeColors: Record<string, string> = {
  "Publisher / Media": "bg-blue-50 text-blue-600",
  "Retail / Marketplace": "bg-orange-50 text-orange-600",
};

const signalDot = (s: string | null) => {
  if (!s) return null;
  const c = s === "green" ? "bg-green-500" : s === "amber" ? "bg-amber-500" : "bg-red-500";
  return <span className={`inline-block w-2 h-2 rounded-full ${c}`} />;
};

const CategorySummaryTab = () => (
  <div>
    <SectionHeader
      title="Category-Level Concentration"
      right={<span className="text-xs text-muted-foreground">Execution EX-0329-001 · Dell — Laptops — US</span>}
    />

    <div className="bg-muted/50 border border-border/60 rounded-md px-4 py-2 text-xs text-muted-foreground mb-4 mt-3 flex gap-6">
      <span><strong>Top 5 Share:</strong> Proportion of all citations held by the top 5 domains. Higher = more concentrated shortlist.</span>
      <span className="border-l border-border pl-6"><strong>HHI (Herfindahl Index):</strong> Sum of squared domain share values. Higher = stronger single-domain dominance.</span>
    </div>

    {/* Concentration table */}
    <div className="max-w-2xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="table-header text-left py-2">Metric</th>
            <th className="table-header text-left py-2">Value</th>
            <th className="table-header text-left py-2">Interpretation</th>
            <th className="table-header text-center py-2 w-20">Signal</th>
          </tr>
        </thead>
        <tbody>
          {concentrationRows.map((r, i) => (
            <tr key={r.metric} className={`border-b border-border ${i % 2 === 1 ? "bg-muted/50" : ""}`}>
              <td className="py-2 font-medium text-foreground">{r.metric}</td>
              <td className="py-2 tabular font-semibold text-foreground">{r.value}</td>
              <td className="py-2 text-muted-foreground">{r.interp}</td>
              <td className="py-2 text-center">{signalDot(r.signal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* HHI Scale */}
    <div className="bg-muted/50 border border-border rounded-md p-4 mt-4 max-w-2xl">
      <div className="text-xs font-medium text-foreground mb-2">HHI Interpretation Scale</div>
      <div className="flex gap-2">
        <div className="flex-1 bg-green-100 text-green-700 rounded-md p-2 text-xs">
          &lt; 0.10 · Distributed — Many sources share authority equally
        </div>
        <div className="flex-1 bg-amber-100 text-amber-700 rounded-md p-2 text-xs relative">
          0.10–0.25 · Moderate — Top sources have clear advantage
          <span className="ml-1 text-primary font-medium">◄ Current</span>
        </div>
        <div className="flex-1 bg-red-100 text-red-700 rounded-md p-2 text-xs">
          &gt; 0.25 · Concentrated — Winner-takes-most dynamics
        </div>
      </div>
    </div>

    {/* Top 5 */}
    <div className="mt-6">
      <SectionHeader
        title="Top 5 Domain Share Breakdown"
        right={<span className="text-xs text-amber-600">Combined: 68.4% of all mentions</span>}
      />
      <div className="max-w-2xl overflow-x-auto mt-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="table-header text-left py-2 w-10">#</th>
              <th className="table-header text-left py-2 w-[180px]">Domain</th>
              <th className="table-header text-left py-2 w-[140px]">Authority Type</th>
              <th className="table-header text-center py-2 w-[80px]">Mentions</th>
              <th className="table-header text-center py-2 w-[120px]">Share of Total</th>
              <th className="table-header text-center py-2 w-[130px]">Cumulative Share</th>
            </tr>
          </thead>
          <tbody>
            {top5.map((r, i) => (
              <tr key={r.rank} className={`border-b border-border ${i % 2 === 1 ? "bg-muted/50" : ""}`}>
                <td className="py-2 tabular text-muted-foreground">{r.rank}</td>
                <td className="py-2 font-mono text-foreground">{r.domain}</td>
                <td className="py-2"><span className={`text-xs rounded-full px-2.5 py-0.5 ${typeColors[r.type]}`}>{r.type}</span></td>
                <td className="py-2 tabular text-center font-semibold">{r.mentions}</td>
                <td className="py-2 tabular text-center">{r.share}%</td>
                <td className="py-2 tabular text-center text-muted-foreground">{r.cumulative}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground italic mt-3 max-w-2xl">
        4 of the top 5 domains are Publisher/Media sources. Retail/Marketplace (bestbuy.com) enters at rank 5. The target brand (dell.com) is ranked 9th with 5.4% share.
      </p>
    </div>
  </div>
);

export default CategorySummaryTab;
