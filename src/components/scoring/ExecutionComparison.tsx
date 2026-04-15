import { useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import { AlertTriangle } from "lucide-react";

const allExecutions = [
  { id: "EX-0329-001", label: "Dell — Laptops — US · Apr 3" },
  { id: "EX-0322-002", label: "Dell — Laptops — US · Mar 29" },
  { id: "EX-0315-003", label: "Dell — Laptops — US · Mar 22" },
  { id: "EX-0401-004", label: "Sony — Headphones — UK · Apr 1" },
  { id: "EX-0403-006", label: "Nike — Running — US · Apr 3" },
  { id: "EX-0402-008", label: "Nike — Running — US · Apr 2" },
];

const sectionRows = [
  { section: "CONCENTRATION" },
  { metric: "Total Mentions", a: "312", b: "210", change: "+102", color: "text-green-600" },
  { metric: "Unique Domains", a: "24", b: "18", change: "+6", color: "text-green-600" },
  { metric: "Top 5 Share", a: "68.4%", b: "74.8%", change: "−6.4pp", color: "text-green-600" },
  { metric: "HHI", a: "0.142", b: "0.183", change: "−0.041", color: "text-green-600" },
  { section: "INCLUSION" },
  { metric: "Dell Inclusion Rate", a: "82.9%", b: "71.4%", change: "+11.5pp", color: "text-green-600" },
  { metric: "Dell Inclusion Stability", a: "0.81", b: "0.71", change: "+0.10", color: "text-green-600" },
  { metric: "HP Inclusion Rate", a: "65.7%", b: "70.3%", change: "−4.6pp", color: "text-amber-600" },
  { metric: "Lenovo Inclusion Rate", a: "60.0%", b: "57.1%", change: "+2.9pp", color: "text-muted-foreground" },
  { section: "AUTHORITY CORE" },
  { metric: "Core Domains (count)", a: "4", b: "3", change: "+1", color: "text-green-600" },
  { metric: "Stable Core Domains", a: "3", b: "3", change: "unchanged", color: "text-muted-foreground" },
  { metric: "New Core Entries", a: "tomshardware.com", b: "—", change: "—", color: "text-muted-foreground" },
  { metric: "Core Exits", a: "—", b: "—", change: "—", color: "text-muted-foreground" },
];

interface Props {
  onBack: () => void;
}

const ExecutionComparison = ({ onBack }: Props) => {
  const [exA, setExA] = useState("EX-0329-001");
  const [exB, setExB] = useState("EX-0315-003");

  return (
    <div>
      <SectionHeader
        title="Execution Comparison"
        right={<button onClick={onBack} className="text-xs text-primary hover:underline">← Back to Scored Executions</button>}
      />

      {/* Builder */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6 mt-3">
        <div className="text-sm font-medium text-foreground mb-3">Select executions to compare</div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-label mb-1">Execution A</div>
            <select value={exA} onChange={(e) => setExA(e.target.value)} className="w-full h-8 px-3 text-sm rounded-md border border-border bg-background text-foreground">
              {allExecutions.map((e) => <option key={e.id} value={e.id}>{e.id} · {e.label}</option>)}
            </select>
          </div>
          <div className="text-sm font-medium text-muted-foreground mt-5">vs.</div>
          <div className="flex-1">
            <div className="text-label mb-1">Execution B</div>
            <select value={exB} onChange={(e) => setExB(e.target.value)} className="w-full h-8 px-3 text-sm rounded-md border border-border bg-background text-foreground">
              {allExecutions.map((e) => <option key={e.id} value={e.id}>{e.id} · {e.label}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <button className="h-8 px-4 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium">Compare →</button>
          <span className="text-xs text-amber-600 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> For valid comparison, both executions should share the same context, prompt pack version, and model.
          </span>
        </div>
      </div>

      {/* Side-by-side */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="table-header text-left py-2 w-[200px]">Metric</th>
              <th className="table-header text-center py-2 w-[130px] text-primary">EX-0329-001 (Apr 3)</th>
              <th className="table-header text-center py-2 w-[130px] text-muted-foreground">EX-0315-003 (Mar 22)</th>
              <th className="table-header text-center py-2 w-[100px]">Change</th>
            </tr>
          </thead>
          <tbody>
            {sectionRows.map((r, i) =>
              "section" in r ? (
                <tr key={r.section} className="bg-muted">
                  <td colSpan={4} className="table-header py-1 px-4">{r.section}</td>
                </tr>
              ) : (
                <tr key={r.metric} className={`border-b border-border ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
                  <td className="py-2 font-medium text-foreground">{r.metric}</td>
                  <td className="py-2 tabular text-center font-semibold text-foreground">{r.a}</td>
                  <td className="py-2 tabular text-center font-semibold text-muted-foreground">{r.b}</td>
                  <td className={`py-2 tabular text-center ${r.color}`}>{r.change}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExecutionComparison;
