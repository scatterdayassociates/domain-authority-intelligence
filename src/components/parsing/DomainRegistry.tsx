import { useState } from "react";
import { Search, AlertTriangle } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const domainTypeClasses: Record<string, string> = {
  "Publisher / Media": "bg-blue-50 text-blue-600",
  "Retail / Marketplace": "bg-orange-50 text-orange-600",
  "Brand / Retail": "bg-purple-50 text-purple-600",
  "Forum / Community": "bg-yellow-50 text-yellow-600",
  "Review / Affiliate": "bg-teal-50 text-teal-600",
  "Gov / Education": "bg-green-50 text-green-600",
  Other: "bg-muted text-muted-foreground",
};

const allTypes = ["All Types", "Publisher / Media", "Retail / Marketplace", "Brand / Retail", "Forum / Community", "Review / Affiliate", "Gov / Education"];
const allPacks = ["All Contexts", "Dell Laptops", "Sony Headphones", "Nike Running"];

const registryData = [
  { domain: "rtings.com", type: "Publisher / Media", occurrences: 186, executions: 5, packs: ["Dell Laptops", "Sony Headphones"], lastSeen: "Apr 3, 2026", warning: false },
  { domain: "notebookcheck.net", type: "Publisher / Media", occurrences: 162, executions: 4, packs: ["Dell Laptops"], lastSeen: "Apr 3, 2026", warning: false },
  { domain: "pcmag.com", type: "Publisher / Media", occurrences: 151, executions: 5, packs: ["Dell Laptops", "Nike Running"], lastSeen: "Apr 3, 2026", warning: false },
  { domain: "tomshardware.com", type: "Publisher / Media", occurrences: 138, executions: 4, packs: ["Dell Laptops"], lastSeen: "Apr 3, 2026", warning: false },
  { domain: "amazon.com", type: "Retail / Marketplace", occurrences: 127, executions: 6, packs: ["Dell Laptops", "Sony Headphones", "Nike Running"], lastSeen: "Apr 3, 2026", warning: false },
  { domain: "bestbuy.com", type: "Retail / Marketplace", occurrences: 118, executions: 5, packs: ["Dell Laptops", "Sony Headphones"], lastSeen: "Apr 3, 2026", warning: false },
  { domain: "theverge.com", type: "Publisher / Media", occurrences: 104, executions: 5, packs: ["Dell Laptops", "Nike Running"], lastSeen: "Apr 3, 2026", warning: false },
  { domain: "techradar.com", type: "Publisher / Media", occurrences: 96, executions: 4, packs: ["Dell Laptops", "Sony Headphones"], lastSeen: "Apr 3, 2026", warning: false },
  { domain: "dell.com", type: "Brand / Retail", occurrences: 89, executions: 3, packs: ["Dell Laptops"], lastSeen: "Mar 29, 2026", warning: false },
  { domain: "reddit.com", type: "Forum / Community", occurrences: 78, executions: 5, packs: ["Dell Laptops", "Sony Headphones", "Nike Running"], lastSeen: "Apr 3, 2026", warning: false },
  { domain: "hp.com", type: "Brand / Retail", occurrences: 67, executions: 3, packs: ["Dell Laptops"], lastSeen: "Mar 29, 2026", warning: false },
  { domain: "wirecutter.com", type: "Review / Affiliate", occurrences: 54, executions: 4, packs: ["Dell Laptops", "Nike Running"], lastSeen: "Apr 3, 2026", warning: false },
  { domain: "lenovo.com", type: "Brand / Retail", occurrences: 48, executions: 3, packs: ["Dell Laptops"], lastSeen: "Mar 29, 2026", warning: false },
  { domain: "runnerclick.com", type: "Review / Affiliate", occurrences: 41, executions: 2, packs: ["Nike Running"], lastSeen: "Apr 2, 2026", warning: false },
  { domain: "rtings.com/headphones", type: "Publisher / Media", occurrences: 38, executions: 2, packs: ["Sony Headphones"], lastSeen: "Apr 1, 2026", warning: true },
];

const DomainRegistry = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [packFilter, setPackFilter] = useState("All Contexts");
  const [page, setPage] = useState(0);

  const filtered = registryData.filter(d => {
    if (search && !d.domain.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "All Types" && d.type !== typeFilter) return false;
    if (packFilter !== "All Contexts" && !d.packs.includes(packFilter)) return false;
    return true;
  });

  return (
    <div>
      <SectionHeader
        title="Global Domain Registry"
        right={<span className="text-xs text-muted-foreground">47 unique domains · across 6 parsed executions</span>}
      />
      <p className="text-xs text-muted-foreground italic mt-2 mb-4">
        Aggregated view of all normalised domains extracted across all completed parsing jobs. Used as a reference for scoring and analysis.
      </p>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search domains..."
            className="w-64 h-8 border border-border rounded-md pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="h-8 px-3 text-xs rounded-md border border-border text-muted-foreground bg-background"
        >
          {allTypes.map(t => <option key={t}>{t}</option>)}
        </select>
        <select
          value={packFilter}
          onChange={e => setPackFilter(e.target.value)}
          className="h-8 px-3 text-xs rounded-md border border-border text-muted-foreground bg-background"
        >
          {allPacks.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="table-header py-2 px-2 w-[200px]">Normalised Domain</th>
              <th className="table-header py-2 px-2 w-[130px]">Domain Type</th>
              <th className="table-header py-2 px-2 w-[120px] text-center">Total Occurrences</th>
              <th className="table-header py-2 px-2 w-[120px] text-center">Executions Seen In</th>
              <th className="table-header py-2 px-2">Prompt Packs</th>
              <th className="table-header py-2 px-2 w-[130px]">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={d.domain} className={`border-b border-border hover:bg-primary/5 transition-colors ${i % 2 === 1 ? "bg-muted/30" : ""}`}>
                <td className="py-2 px-2 font-mono text-sm text-foreground flex items-center gap-1.5">
                  {d.warning && (
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Subdomain preserved — review for collapse</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {d.domain}
                </td>
                <td className="py-2 px-2">
                  <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${domainTypeClasses[d.type]}`}>{d.type}</span>
                </td>
                <td className="py-2 px-2 text-sm tabular font-semibold text-center">{d.occurrences}</td>
                <td className="py-2 px-2 text-sm tabular text-muted-foreground text-center">{d.executions} executions</td>
                <td className="py-2 px-2">
                  <div className="flex flex-wrap gap-1">
                    {d.packs.map(p => (
                      <span key={p} className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">{p}</span>
                    ))}
                  </div>
                </td>
                <td className="py-2 px-2 text-sm text-muted-foreground">{d.lastSeen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
        <button className="hover:text-foreground transition-colors">← Previous</button>
        <span>Showing {filtered.length} of 47 domains</span>
        <button className="hover:text-foreground transition-colors">Next →</button>
      </div>
    </div>
  );
};

export default DomainRegistry;
