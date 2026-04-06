import SectionHeader from "@/components/SectionHeader";
import { GitCompare } from "lucide-react";

interface Props {
  onView: (id: string) => void;
  onExport: (id: string) => void;
  onCompare: () => void;
}

const rows = [
  { id: "EX-0329-001", pack: "Dell — Laptops — US", context: "Best laptops for home office", model: "GPT-4o", scored: "Apr 3, 2026 9:07 AM", domains: 24, top5: 68.4, hhi: 0.142, inclusion: 82 },
  { id: "EX-0322-002", pack: "Dell — Laptops — US", context: "Best laptops for home office", model: "GPT-4o", scored: "Mar 29, 2026 2:17 PM", domains: 21, top5: 71.2, hhi: 0.161, inclusion: 78 },
  { id: "EX-0315-003", pack: "Dell — Laptops — US", context: "Best laptops for home office", model: "GPT-4o", scored: "Mar 22, 2026 10:34 AM", domains: 18, top5: 74.8, hhi: 0.183, inclusion: 71 },
  { id: "EX-0401-004", pack: "Sony — Headphones — UK", context: "Best noise cancelling head...", model: "Claude 3.5 Sonnet", scored: "Apr 1, 2026 4:50 PM", domains: 28, top5: 62.1, hhi: 0.118, inclusion: 64 },
  { id: "EX-0403-006", pack: "Nike — Running — US", context: "Best running shoes 2024", model: "GPT-4o", scored: "Apr 3, 2026 9:20 AM", domains: 31, top5: 57.8, hhi: 0.098, inclusion: 55 },
  { id: "EX-0402-008", pack: "Nike — Running — US", context: "Best running shoes 2024", model: "GPT-4o", scored: "Apr 2, 2026 3:38 PM", domains: 29, top5: 59.4, hhi: 0.104, inclusion: 52 },
];

const top5Color = (v: number) => v >= 70 ? "text-amber-600" : "text-foreground";
const hhiColor = (v: number) => v >= 0.15 ? "text-amber-600" : "text-foreground";
const inclColor = (v: number) => v >= 75 ? "text-green-600" : v < 60 ? "text-amber-600" : "text-foreground";

const ScoringOverview = ({ onView, onExport, onCompare }: Props) => (
  <section>
    <SectionHeader
      title="Scored Executions"
      right={<span className="text-xs text-muted-foreground">6 executions scored</span>}
    />
    <p className="text-xs text-muted-foreground italic mt-1 mb-4">
      Each row is one time-stamped measurement of the AI discovery environment. Metrics are computed per execution and never aggregated across time unless explicitly compared.
    </p>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="table-header text-left py-2 w-[130px]">Execution ID</th>
            <th className="table-header text-left py-2">Prompt Pack</th>
            <th className="table-header text-left py-2 w-[150px]">Context</th>
            <th className="table-header text-left py-2 w-[130px]">Model</th>
            <th className="table-header text-left py-2 w-[140px]">Scored At</th>
            <th className="table-header text-center py-2 w-[110px]">Unique Domains</th>
            <th className="table-header text-center py-2 w-[100px]">Top 5 Share</th>
            <th className="table-header text-center py-2 w-[80px]">HHI</th>
            <th className="table-header text-center py-2 w-[110px]">Inclusion Rate</th>
            <th className="table-header text-right py-2 w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} className={`border-b border-border hover:bg-primary/5 transition-colors ${i % 2 === 1 ? "bg-muted/50" : ""}`}>
              <td className="py-2 font-mono text-muted-foreground">{r.id}</td>
              <td className="py-2 text-foreground">{r.pack}</td>
              <td className="py-2 text-slate-600 truncate max-w-[150px]">{r.context}</td>
              <td className="py-2 text-foreground">{r.model}</td>
              <td className="py-2 text-muted-foreground">{r.scored}</td>
              <td className="py-2 tabular text-center text-foreground">{r.domains}</td>
              <td className={`py-2 tabular text-center font-semibold ${top5Color(r.top5)}`}>{r.top5}%</td>
              <td className={`py-2 tabular text-center font-semibold ${hhiColor(r.hhi)}`}>{r.hhi.toFixed(3)}</td>
              <td className={`py-2 tabular text-center font-semibold ${inclColor(r.inclusion)}`}>{r.inclusion}%</td>
              <td className="py-2 text-right text-xs">
                <button onClick={() => onView(r.id)} className="text-primary hover:underline">View</button>
                <span className="text-muted-foreground mx-1">/</span>
                <button onClick={() => onExport(r.id)} className="text-primary hover:underline">Export</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex justify-end mt-4">
      <button onClick={onCompare} className="h-8 px-3 text-sm rounded-md border border-primary/40 text-primary hover:bg-primary/5 flex items-center gap-1.5 transition-colors">
        <GitCompare className="w-3.5 h-3.5" /> Compare Executions →
      </button>
    </div>
  </section>
);

export default ScoringOverview;
