import { useState } from "react";
import { Info } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

interface DomainSummaryTabProps {
  totalRuns: number;
}

const domainTypeClasses: Record<string, string> = {
  "Publisher / Media": "bg-blue-50 text-blue-600",
  "Retail / Marketplace": "bg-orange-50 text-orange-600",
  "Brand / Retail": "bg-purple-50 text-purple-600",
  "Forum / Community": "bg-yellow-50 text-yellow-600",
  "Review / Affiliate": "bg-teal-50 text-teal-600",
  "Gov / Education": "bg-green-50 text-green-600",
  Other: "bg-muted text-muted-foreground",
};

const domains = [
  { rank: 1, domain: "rtings.com", variants: "www.rtings.com", occurrences: 48, runsPresent: 34, type: "Publisher / Media" },
  { rank: 2, domain: "notebookcheck.net", variants: "notebookcheck.net, www.notebookcheck.net", occurrences: 41, runsPresent: 32, type: "Publisher / Media" },
  { rank: 3, domain: "pcmag.com", variants: "www.pcmag.com", occurrences: 38, runsPresent: 31, type: "Publisher / Media" },
  { rank: 4, domain: "tomshardware.com", variants: "www.tomshardware.com", occurrences: 35, runsPresent: 30, type: "Publisher / Media" },
  { rank: 5, domain: "bestbuy.com", variants: "www.bestbuy.com, bestbuy.com", occurrences: 29, runsPresent: 28, type: "Retail / Marketplace" },
  { rank: 6, domain: "amazon.com", variants: "www.amazon.com", occurrences: 26, runsPresent: 27, type: "Retail / Marketplace" },
  { rank: 7, domain: "theverge.com", variants: "www.theverge.com", occurrences: 22, runsPresent: 24, type: "Publisher / Media" },
  { rank: 8, domain: "techradar.com", variants: "www.techradar.com", occurrences: 19, runsPresent: 21, type: "Publisher / Media" },
  { rank: 9, domain: "dell.com", variants: "www.dell.com, dell.com/en-us", occurrences: 17, runsPresent: 19, type: "Brand / Retail" },
  { rank: 10, domain: "hp.com", variants: "www.hp.com", occurrences: 14, runsPresent: 16, type: "Brand / Retail" },
  { rank: 11, domain: "lenovo.com", variants: "www.lenovo.com", occurrences: 12, runsPresent: 15, type: "Brand / Retail" },
  { rank: 12, domain: "reddit.com", variants: "www.reddit.com, reddit.com/r/laptops", occurrences: 11, runsPresent: 14, type: "Forum / Community" },
  { rank: 13, domain: "apple.com", variants: "www.apple.com", occurrences: 8, runsPresent: 10, type: "Brand / Retail" },
  { rank: 14, domain: "nytimes.com", variants: "www.nytimes.com", occurrences: 5, runsPresent: 6, type: "Publisher / Media" },
  { rank: 15, domain: "wirecutter.com", variants: "www.nytimes.com/wirecutter", occurrences: 4, runsPresent: 5, type: "Review / Affiliate" },
];

const totalOccurrences = domains.reduce((s, d) => s + d.occurrences, 0);

const DomainSummaryTab = ({ totalRuns }: DomainSummaryTabProps) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? domains : domains;

  return (
    <>
      <SectionHeader
        title="Normalised Domain Registry (this execution)"
        right={<span className="text-xs text-muted-foreground">{domains.length} unique domains · {totalOccurrences} total occurrences</span>}
      />

      <div className="bg-primary/5 border border-primary/10 rounded-md px-4 py-2 text-xs text-primary flex items-center gap-2 mt-2 mb-4">
        <Info className="w-3.5 h-3.5 flex-shrink-0" />
        This table shows domain frequency as parsed. Scoring metrics (Top 5 Share, HHI, run persistence) are computed in the Scoring Engine module.
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="table-header py-2 px-2 w-[50px]">#</th>
              <th className="table-header py-2 px-2 w-[200px]">Normalised Domain</th>
              <th className="table-header py-2 px-2">Raw Variants</th>
              <th className="table-header py-2 px-2 w-[100px] text-center">Occurrences</th>
              <th className="table-header py-2 px-2 w-[100px] text-center">Runs Present</th>
              <th className="table-header py-2 px-2 w-[120px]">Domain Type</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((d, i) => (
              <tr key={d.domain} className={`border-b border-border hover:bg-primary/5 transition-colors ${i % 2 === 1 ? "bg-muted/30" : ""}`}>
                <td className="py-2 px-2 text-sm tabular text-muted-foreground">{d.rank}</td>
                <td className="py-2 px-2 font-mono text-sm text-foreground">{d.domain}</td>
                <td className="py-2 px-2 text-xs text-muted-foreground">{d.variants}</td>
                <td className="py-2 px-2 text-sm tabular font-semibold text-center">{d.occurrences}</td>
                <td className="py-2 px-2 text-sm tabular text-muted-foreground text-center">in {d.runsPresent} of {totalRuns}</td>
                <td className="py-2 px-2">
                  <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${domainTypeClasses[d.type]}`}>{d.type}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {domains.length < 24 && (
        <button className="mt-2 text-sm text-primary hover:underline mx-auto block">
          ↓ Show all 24 domains
        </button>
      )}
    </>
  );
};

export default DomainSummaryTab;
