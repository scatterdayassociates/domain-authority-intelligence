import { useState } from "react";
import { Search, AlertTriangle } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const brandTypeClasses: Record<string, string> = {
  "Target Brand": "bg-primary/10 text-primary",
  Competitor: "bg-purple-50 text-purple-600",
  "Retailer Brand": "bg-orange-50 text-orange-600",
  Other: "bg-muted text-muted-foreground",
};

const allTypes = ["All Types", "Target Brand", "Competitor", "Retailer Brand"];
const allPacks = ["All Contexts", "Dell Laptops", "Sony Headphones", "Nike Running"];

const registryData = [
  { brand: "Dell", type: "Target Brand", aliases: ["Dell Technologies", "Dell Inc."], occurrences: 164, executions: 5, packs: ["Dell Laptops"], lastSeen: "Apr 3, 2026", warning: false },
  { brand: "ASUS", type: "Competitor", aliases: ["Asus", "ASUSTeK", "ASUSTeK Computer"], occurrences: 142, executions: 5, packs: ["Dell Laptops"], lastSeen: "Apr 3, 2026", warning: false },
  { brand: "Lenovo", type: "Competitor", aliases: ["Lenovo Group", "ThinkPad"], occurrences: 138, executions: 4, packs: ["Dell Laptops"], lastSeen: "Apr 3, 2026", warning: false },
  { brand: "HP", type: "Competitor", aliases: ["Hewlett-Packard", "HP Inc.", "Hewlett Packard"], occurrences: 131, executions: 5, packs: ["Dell Laptops"], lastSeen: "Apr 3, 2026", warning: false },
  { brand: "Apple", type: "Competitor", aliases: ["Apple Inc.", "MacBook"], occurrences: 119, executions: 5, packs: ["Dell Laptops"], lastSeen: "Apr 3, 2026", warning: false },
  { brand: "Acer", type: "Competitor", aliases: ["Acer Inc."], occurrences: 84, executions: 4, packs: ["Dell Laptops"], lastSeen: "Mar 29, 2026", warning: false },
  { brand: "Sony", type: "Target Brand", aliases: ["Sony Corp.", "Sony Electronics"], occurrences: 96, executions: 3, packs: ["Sony Headphones"], lastSeen: "Apr 1, 2026", warning: false },
  { brand: "Bose", type: "Competitor", aliases: ["Bose Corporation"], occurrences: 88, executions: 3, packs: ["Sony Headphones"], lastSeen: "Apr 1, 2026", warning: false },
  { brand: "Sennheiser", type: "Competitor", aliases: ["Sennheiser Electronic"], occurrences: 61, executions: 2, packs: ["Sony Headphones"], lastSeen: "Apr 1, 2026", warning: false },
  { brand: "Nike", type: "Target Brand", aliases: ["Nike Inc.", "NIKE"], occurrences: 152, executions: 4, packs: ["Nike Running"], lastSeen: "Apr 3, 2026", warning: false },
  { brand: "Adidas", type: "Competitor", aliases: ["adidas", "Adidas AG"], occurrences: 134, executions: 4, packs: ["Nike Running"], lastSeen: "Apr 3, 2026", warning: false },
  { brand: "Hoka", type: "Competitor", aliases: ["HOKA", "Hoka One One"], occurrences: 97, executions: 3, packs: ["Nike Running"], lastSeen: "Apr 3, 2026", warning: false },
  { brand: "Brooks", type: "Competitor", aliases: ["Brooks Running"], occurrences: 72, executions: 3, packs: ["Nike Running"], lastSeen: "Apr 2, 2026", warning: false },
  { brand: "Best Buy", type: "Retailer Brand", aliases: ["BestBuy", "Best Buy Co."], occurrences: 44, executions: 4, packs: ["Dell Laptops", "Sony Headphones"], lastSeen: "Apr 3, 2026", warning: false },
  { brand: "Asus ROG", type: "Competitor", aliases: ["ROG", "Republic of Gamers"], occurrences: 21, executions: 2, packs: ["Dell Laptops"], lastSeen: "Apr 1, 2026", warning: true },
];

const BrandRegistry = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [packFilter, setPackFilter] = useState("All Contexts");

  const filtered = registryData.filter(b => {
    const haystack = [b.brand, ...b.aliases].join(" ").toLowerCase();
    if (search && !haystack.includes(search.toLowerCase())) return false;
    if (typeFilter !== "All Types" && b.type !== typeFilter) return false;
    if (packFilter !== "All Contexts" && !b.packs.includes(packFilter)) return false;
    return true;
  });

  return (
    <div>
      <SectionHeader
        title="Global Brand Registry"
        right={<span className="text-xs text-muted-foreground">32 canonical brands · across 6 parsed executions</span>}
      />
      <p className="text-xs text-muted-foreground italic mt-2 mb-4">
        Canonical brand names and their known aliases. Every recommended-brand entry extracted from a run must resolve
        against this registry before it counts as a valid brand mention.
      </p>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search brands or aliases..."
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
              <th className="table-header py-2 px-2 w-[180px]">Canonical Brand</th>
              <th className="table-header py-2 px-2 w-[130px]">Brand Type</th>
              <th className="table-header py-2 px-2">Known Aliases</th>
              <th className="table-header py-2 px-2 w-[120px] text-center">Total Occurrences</th>
              <th className="table-header py-2 px-2 w-[120px] text-center">Executions Seen In</th>
              <th className="table-header py-2 px-2 w-[130px]">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => (
              <tr key={b.brand} className={`border-b border-border hover:bg-primary/5 transition-colors ${i % 2 === 1 ? "bg-muted/30" : ""}`}>
                <td className="py-2 px-2 text-sm font-medium text-foreground flex items-center gap-1.5">
                  {b.warning && (
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Possible sub-brand — review for merge into parent entry</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {b.brand}
                </td>
                <td className="py-2 px-2">
                  <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${brandTypeClasses[b.type]}`}>{b.type}</span>
                </td>
                <td className="py-2 px-2">
                  <div className="flex flex-wrap gap-1">
                    {b.aliases.map(a => (
                      <span key={a} className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs font-mono">{a}</span>
                    ))}
                  </div>
                </td>
                <td className="py-2 px-2 text-sm tabular font-semibold text-center">{b.occurrences}</td>
                <td className="py-2 px-2 text-sm tabular text-muted-foreground text-center">{b.executions} executions</td>
                <td className="py-2 px-2 text-sm text-muted-foreground">{b.lastSeen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
        <button className="hover:text-foreground transition-colors">← Previous</button>
        <span>Showing {filtered.length} of 32 brands</span>
        <button className="hover:text-foreground transition-colors">Next →</button>
      </div>
    </div>
  );
};

export default BrandRegistry;
