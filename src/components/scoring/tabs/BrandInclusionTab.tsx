import SectionHeader from "@/components/SectionHeader";
import { Info, TrendingUp, TrendingDown } from "lucide-react";

const brands = [
  { name: "Dell Technologies", role: "TARGET", rate: 82.9, runs: "in 29 of 35", stability: 0.81, type: "Recommended", delta: "+4.0pp", deltaDir: "up" },
  { name: "HP", role: "COMPETITOR", rate: 65.7, runs: "in 23 of 35", stability: 0.67, type: "Recommended", delta: "−1.4pp", deltaDir: "down" },
  { name: "Lenovo", role: "COMPETITOR", rate: 60.0, runs: "in 21 of 35", stability: 0.62, type: "Mentioned", delta: "+0.8pp", deltaDir: "up" },
  { name: "Apple", role: "COMPETITOR", rate: 45.7, runs: "in 16 of 35", stability: 0.51, type: "Mentioned", delta: "−2.1pp", deltaDir: "down" },
];

const roleBadge = (r: string) => r === "TARGET" ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500";
const typeBadge = (t: string) => t === "Recommended" ? "bg-green-50 text-green-600" : t === "Mentioned" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500";
const stabilityColor = (v: number) => v >= 0.75 ? "text-green-600" : v >= 0.50 ? "text-amber-600" : "text-red-500";

const BrandInclusionTab = () => (
  <div>
    <SectionHeader
      title="Brand Inclusion Metrics"
      right={<span className="text-xs text-muted-foreground">Target brand: Dell · Competitor set: HP, Lenovo, Apple</span>}
    />

    <div className="bg-muted/50 border border-border/60 rounded-md px-4 py-2 text-xs text-muted-foreground mb-4 mt-3 flex gap-6">
      <span><strong>Inclusion Rate:</strong> % of AI responses where the brand appears by name in the narrative.</span>
      <span className="border-l border-border pl-6"><strong>Inclusion Stability:</strong> Consistency of brand inclusion across individual runs. Higher = more reliable signal.</span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="table-header text-left py-2 w-[150px]">Brand</th>
            <th className="table-header text-center py-2 w-[80px]">Role</th>
            <th className="table-header text-center py-2 w-[110px]">Inclusion Rate</th>
            <th className="table-header text-center py-2 w-[120px]">Runs Mentioned</th>
            <th className="table-header text-center py-2 w-[130px]">Inclusion Stability</th>
            <th className="table-header text-center py-2 w-[160px]">Mention Type</th>
            <th className="table-header text-center py-2 w-[100px]">vs. Prev Run</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((b, i) => (
            <tr key={b.name} className={`border-b border-border ${i % 2 === 1 ? "bg-muted/50" : ""}`}>
              <td className="py-2 font-medium text-foreground">{b.name}</td>
              <td className="py-2 text-center"><span className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${roleBadge(b.role)}`}>{b.role}</span></td>
              <td className="py-2 tabular text-center font-semibold">{b.rate}%</td>
              <td className="py-2 tabular text-center text-muted-foreground">{b.runs}</td>
              <td className={`py-2 tabular text-center ${stabilityColor(b.stability)}`}>{b.stability.toFixed(2)}</td>
              <td className="py-2 text-center"><span className={`text-xs rounded-full px-2.5 py-0.5 ${typeBadge(b.type)}`}>{b.type}</span></td>
              <td className="py-2 tabular text-center">
                <span className={`flex items-center justify-center gap-1 text-xs ${b.deltaDir === "up" ? "text-green-600" : "text-red-500"}`}>
                  {b.deltaDir === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
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
      <span>Dell's inclusion rate of 82.9% with a stability score of 0.81 indicates a strong, consistent signal. This means Dell is reliably mentioned in AI-generated laptop recommendations. HP (65.7%, 0.67) and Lenovo (60.0%, 0.62) show weaker and less consistent presence.</span>
    </div>

    <div className="mt-3 bg-muted/50 border border-border/60 rounded-md p-3 text-xs text-muted-foreground italic">
      Inclusion Rate measures narrative presence — the brand appearing by name in the recommendation or discussion. This is distinct from domain authority (dell.com as a cited source). A brand may have low domain authority but high inclusion rate, or vice versa.
    </div>
  </div>
);

export default BrandInclusionTab;
