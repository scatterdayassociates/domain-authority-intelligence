import SectionHeader from "@/components/SectionHeader";
import { Info, TrendingUp, TrendingDown } from "lucide-react";

// BNE = Brand Narrative Extraction. All attribute rates below are deterministic,
// dictionary/rule-based classifications — the % of runs in which the brand
// co-occurs with terms from the named attribute dictionary. No sentiment or
// recommendation inference is applied at this layer.
const brands = [
  {
    name: "Dell Technologies",
    role: "TARGET",
    rate: 82.9,
    runs: "in 29 of 35",
    stability: 0.81,
    coverage: 74.3,
    attrs: { performance: 82.9, affordability: 14.3, useCase: 48.6 },
    delta: "+4.0pp",
    deltaDir: "up",
  },
  {
    name: "HP",
    role: "COMPETITOR",
    rate: 65.7,
    runs: "in 23 of 35",
    stability: 0.67,
    coverage: 60.0,
    attrs: { performance: 51.4, affordability: 42.9, useCase: 31.4 },
    delta: "−1.4pp",
    deltaDir: "down",
  },
  {
    name: "Lenovo",
    role: "COMPETITOR",
    rate: 60.0,
    runs: "in 21 of 35",
    stability: 0.62,
    coverage: 54.3,
    attrs: { performance: 45.7, affordability: 37.1, useCase: 40.0 },
    delta: "+0.8pp",
    deltaDir: "up",
  },
  {
    name: "Apple",
    role: "COMPETITOR",
    rate: 45.7,
    runs: "in 16 of 35",
    stability: 0.51,
    coverage: 42.9,
    attrs: { performance: 40.0, affordability: 5.7, useCase: 34.3 },
    delta: "−2.1pp",
    deltaDir: "down",
  },
];

const roleBadge = (r: string) =>
  r === "TARGET" ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500";
const stabilityColor = (v: number) =>
  v >= 0.75 ? "text-green-600" : v >= 0.5 ? "text-amber-600" : "text-red-500";

const attrChip = (label: string, value: number) => (
  <span
    key={label}
    className="inline-flex items-center gap-1 rounded-sm border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[11px] text-foreground/80"
    title={`${label} attribute association: brand co-occurs with ${label.toLowerCase()}-dictionary terms in ${value}% of runs`}
  >
    <span className="uppercase tracking-wide text-muted-foreground">{label}</span>
    <span className="tabular font-medium text-foreground">{value}%</span>
  </span>
);

const BrandInclusionTab = () => (
  <div>
    <SectionHeader
      title="Brand Inclusion & Narrative Attribute Metrics"
      right={
        <span className="text-xs text-muted-foreground">
          Target brand: Dell · Competitor set: HP, Lenovo, Apple
        </span>
      }
    />

    <div className="bg-muted/50 border border-border/60 rounded-md px-4 py-2 text-xs text-muted-foreground mb-4 mt-3 grid grid-cols-3 gap-6">
      <span>
        <strong>Inclusion Rate:</strong> % of AI responses where the brand appears by name.
      </span>
      <span className="border-l border-border pl-6">
        <strong>Inclusion Stability:</strong> Consistency of brand inclusion across individual runs.
      </span>
      <span className="border-l border-border pl-6">
        <strong>Attribute Coverage:</strong> % of runs where any BNE-dictionary attribute term co-occurs with the brand.
      </span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="table-header text-left py-2 w-[150px]">Brand</th>
            <th className="table-header text-center py-2 w-[80px]">Role</th>
            <th className="table-header text-center py-2 w-[100px]">Inclusion Rate</th>
            <th className="table-header text-center py-2 w-[110px]">Runs Mentioned</th>
            <th className="table-header text-center py-2 w-[110px]">Inclusion Stability</th>
            <th className="table-header text-center py-2 w-[110px]">Attribute Coverage</th>
            <th className="table-header text-left py-2">Attribute Association Rates (BNE)</th>
            <th className="table-header text-center py-2 w-[100px]">vs. Prev Run</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((b, i) => (
            <tr
              key={b.name}
              className={`border-b border-border ${i % 2 === 1 ? "bg-muted/50" : ""}`}
            >
              <td className="py-2 font-medium text-foreground">{b.name}</td>
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
              <td className="py-2 tabular text-center">{b.coverage}%</td>
              <td className="py-2">
                <div className="flex flex-wrap gap-1">
                  {attrChip("Performance", b.attrs.performance)}
                  {attrChip("Affordability", b.attrs.affordability)}
                  {attrChip("Use-Case", b.attrs.useCase)}
                </div>
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
        Dell is associated with <strong>PERFORMANCE</strong> attribute terms in 82.9% of runs and
        with <strong>USE-CASE</strong> terms in 48.6% of runs, while its association with{" "}
        <strong>AFFORDABILITY</strong> terms remains low (14.3%). HP shows the most balanced
        attribute profile across performance and affordability dictionaries.
      </span>
    </div>

    <div className="mt-3 bg-muted/50 border border-border/60 rounded-md p-3 text-xs text-muted-foreground italic">
      Attribute association rates are deterministic BNE classifications computed from explicit
      attribute dictionaries (co-occurrence of brand mention with dictionary terms within the same
      response). They are not sentiment scores and do not infer recommendation. Narrative
      interpretation belongs to the Insights layer; this surface reports measurable rates only.
    </div>
  </div>
);

export default BrandInclusionTab;
