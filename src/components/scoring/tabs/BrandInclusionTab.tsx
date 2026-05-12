import SectionHeader from "@/components/SectionHeader";
import { Info, TrendingUp, TrendingDown } from "lucide-react";

// Brand Inclusion (Scoring layer) is purely domain-derived and deterministic:
// a brand is "included" in an execution when one or more domains mapped to that
// brand appear in the SOURCES of the response. Textual mention frequency,
// recommendation language, and narrative attribute analysis are NOT computed
// here — they belong to the Insights / BNE layer.
const brands = [
  {
    name: "Dell Technologies",
    role: "TARGET",
    domains: ["dell.com", "dellemc.com"],
    rate: 82.9,
    runs: "in 29 of 35",
    stability: 0.81,
    delta: "+4.0pp",
    deltaDir: "up",
  },
  {
    name: "HP",
    role: "COMPETITOR",
    domains: ["hp.com"],
    rate: 65.7,
    runs: "in 23 of 35",
    stability: 0.67,
    delta: "−1.4pp",
    deltaDir: "down",
  },
  {
    name: "Lenovo",
    role: "COMPETITOR",
    domains: ["lenovo.com"],
    rate: 60.0,
    runs: "in 21 of 35",
    stability: 0.62,
    delta: "+0.8pp",
    deltaDir: "up",
  },
  {
    name: "Apple",
    role: "COMPETITOR",
    domains: ["apple.com"],
    rate: 45.7,
    runs: "in 16 of 35",
    stability: 0.51,
    delta: "−2.1pp",
    deltaDir: "down",
  },
];

const roleBadge = (r: string) =>
  r === "TARGET" ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500";
const stabilityColor = (v: number) =>
  v >= 0.75 ? "text-green-600" : v >= 0.5 ? "text-amber-600" : "text-red-500";

const BrandInclusionTab = () => (
  <div>
    <SectionHeader
      title="Brand Inclusion (Domain-Derived)"
      right={
        <span className="text-xs text-muted-foreground">
          Target brand: Dell · Competitor set: HP, Lenovo, Apple
        </span>
      }
    />

    <div className="bg-muted/50 border border-border/60 rounded-md px-4 py-2 text-xs text-muted-foreground mb-4 mt-3 grid grid-cols-3 gap-6">
      <span>
        <strong>Inclusion Rate:</strong> % of executions where domains mapped to the brand were
        surfaced in SOURCES.
      </span>
      <span className="border-l border-border pl-6">
        <strong>Runs Surfaced:</strong> Number of individual runs in which at least one mapped
        brand domain appeared.
      </span>
      <span className="border-l border-border pl-6">
        <strong>Inclusion Stability:</strong> Consistency of brand-domain surfacing across runs
        within the execution.
      </span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="table-header text-left py-2 w-[180px]">Brand</th>
            <th className="table-header text-left py-2 w-[180px]">Mapped Domains</th>
            <th className="table-header text-center py-2 w-[90px]">Role</th>
            <th className="table-header text-center py-2 w-[110px]">Inclusion Rate</th>
            <th className="table-header text-center py-2 w-[120px]">Runs Surfaced</th>
            <th className="table-header text-center py-2 w-[130px]">Inclusion Stability</th>
            <th className="table-header text-center py-2 w-[110px]">vs. Prev Run</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((b, i) => (
            <tr
              key={b.name}
              className={`border-b border-border ${i % 2 === 1 ? "bg-muted/50" : ""}`}
            >
              <td className="py-2 font-medium text-foreground">{b.name}</td>
              <td className="py-2">
                <div className="flex flex-wrap gap-1">
                  {b.domains.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center rounded-sm border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[11px] font-mono text-foreground/80"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-2 text-center">
                <span
                  className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${roleBadge(b.role)}`}
                >
                  {b.role}
                </span>
              </td>
              <td className="py-2 tabular text-center font-semibold">{b.rate}%</td>
              <td className="py-2 tabular text-center text-muted-foreground">{b.runs}</td>
              <td className={`py-2 tabular text-center ${stabilityColor(b.stability)}`}>
                {b.stability.toFixed(2)}
              </td>
              <td className="py-2 tabular text-center">
                <span
                  className={`flex items-center justify-center gap-1 text-xs ${
                    b.deltaDir === "up" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {b.deltaDir === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {b.delta}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="mt-4 bg-primary/5 border border-primary/20 rounded-md p-3 text-xs text-primary flex items-start gap-2">
      <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
      <span>
        Dell domains were surfaced in 82.9% of runs in this execution, the highest inclusion rate
        in the competitive set. Stability (0.81) indicates consistent surfacing across individual
        runs rather than concentration in a few outliers.
      </span>
    </div>

    <div className="mt-3 bg-muted/50 border border-border/60 rounded-md p-3 text-xs text-muted-foreground italic">
      Brand inclusion at the Scoring layer is strictly domain-derived: a brand is counted as
      included in a run only when one or more of its mapped domains appears in SOURCES. Textual
      mention frequency, recommendation language, and attribute / positioning analysis (BNE) are
      not computed on this surface — they live in the Narrative / Insights layer, where the
      distinction between <em>where AI systems send users</em> and <em>how AI systems describe
      brands</em> is preserved.
    </div>
  </div>
);

export default BrandInclusionTab;
