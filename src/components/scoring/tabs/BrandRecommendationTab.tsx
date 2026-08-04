import SectionHeader from "@/components/SectionHeader";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Brand Recommendation (Scoring layer) is derived from the RECOMMENDED BRANDS
// output contract. Positional metrics (AP / BP) are domain-only in this platform
// and are deliberately excluded here.
const brands = [
  { name: "Dell Technologies", role: "TARGET", rate: 74.3, weighted: 4.18, top3: 62.9, top5: 71.4 },
  { name: "HP", role: "COMPETITOR", rate: 68.6, weighted: 3.65, top3: 54.3, top5: 65.7 },
  { name: "Lenovo", role: "COMPETITOR", rate: 57.1, weighted: 2.94, top3: 42.9, top5: 54.3 },
  { name: "ASUS", role: "COMPETITOR", rate: 48.6, weighted: 2.21, top3: 31.4, top5: 45.7 },
  { name: "Apple", role: "COMPETITOR", rate: 40.0, weighted: 1.76, top3: 25.7, top5: 37.1 },
];

const WEIGHTED_TIP =
  "Measures cumulative brand recommendation strength. What it measures: the position-weighted sum of every recommendation appearance for this brand across all runs — not normalized, so it grows with both frequency and rank strength.";

const roleBadge = (r: string) =>
  r === "TARGET" ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500";

const BrandRecommendationTab = () => (
  <div>
    <SectionHeader
      title="Brand Recommendation (Recommended-Brands Derived)"
      right={
        <span className="text-xs text-muted-foreground">
          Output contract: RECOMMENDED BRANDS · 35 runs
        </span>
      }
    />

    <div className="mt-2">
      <span className="text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
        Derived from Domain Data
      </span>
      <p className="mt-1 text-[11px] text-muted-foreground max-w-3xl">
        Brand Metrics are derived from structured recommendation output (RECOMMENDED BRANDS), not
        from narrative mentions or free text.
      </p>
    </div>

    <div className="bg-muted/50 border border-border/60 rounded-md px-4 py-2 text-xs text-muted-foreground mb-4 mt-3 grid grid-cols-4 gap-6">
      <span><strong>Inclusion Rate:</strong> % of runs where the brand appears in the recommended-brands list.</span>
      <span className="border-l border-border pl-6"><strong>Weighted Inclusion:</strong> Unbounded cumulative position-weighted sum of recommendation appearances.</span>
      <span className="border-l border-border pl-6"><strong>Top 3 Presence:</strong> % of runs where the brand ranks in positions 1–3.</span>
      <span className="border-l border-border pl-6"><strong>Top 5 Presence:</strong> % of runs where the brand ranks in positions 1–5.</span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="table-header text-left py-2 w-[48px]">#</th>
            <th className="table-header text-left py-2 w-[220px]">Brand</th>
            <th className="table-header text-center py-2 w-[130px]">Inclusion Rate</th>
            <th className="table-header text-center py-2 w-[150px]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="underline decoration-dotted underline-offset-2 cursor-help">
                    Weighted Inclusion
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">{WEIGHTED_TIP}</TooltipContent>
              </Tooltip>
            </th>
            <th className="table-header text-center py-2 w-[130px]">Top 3 Presence</th>
            <th className="table-header text-center py-2 w-[130px]">Top 5 Presence</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((b, i) => (
            <tr key={b.name} className={`border-b border-border ${i % 2 === 1 ? "bg-muted/50" : ""}`}>
              <td className="py-2 tabular text-muted-foreground">{i + 1}</td>
              <td className="py-2">
                <span className="font-medium text-foreground">{b.name}</span>
                <span className={`ml-2 text-[10px] font-medium rounded-full px-2 py-0.5 ${roleBadge(b.role)}`}>{b.role}</span>
              </td>
              <td className="py-2 tabular text-center font-semibold">{b.rate.toFixed(1)}%</td>
              <td className="py-2 tabular text-center">{b.weighted.toFixed(2)}</td>
              <td className="py-2 tabular text-center">{b.top3.toFixed(1)}%</td>
              <td className="py-2 tabular text-center">{b.top5.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="mt-4 bg-primary/5 border border-primary/20 rounded-md p-3 text-xs text-primary flex items-start gap-2">
      <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
      <span>
        Recommendation metrics are computed from parsed RECOMMENDED BRANDS lists only. They are
        independent of domain-derived Brand Inclusion, and positional domain metrics (AP / BP) do
        not apply at brand level.
      </span>
    </div>
  </div>
);

export default BrandRecommendationTab;
