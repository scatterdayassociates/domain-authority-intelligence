import { useState } from "react";
import SectionHeader from "./SectionHeader";

const rows = [
  { date: "Mar 29, 2026", top5: "68.4%", hhi: "0.142", inclusion: "82%", domains: 24 },
  { date: "Mar 22, 2026", top5: "71.2%", hhi: "0.161", inclusion: "78%", domains: 21 },
  { date: "Mar 15, 2026", top5: "74.8%", hhi: "0.183", inclusion: "71%", domains: 18 },
];

const ExecutionComparison = () => {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (i: number) => {
    setSelected((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : prev.length < 2 ? [...prev, i] : prev
    );
  };

  return (
    <section>
      <SectionHeader
        title="Execution Comparison"
        right={
          selected.length === 2 ? (
            <button className="h-7 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
              Compare Selected
            </button>
          ) : null
        }
      />
      <p className="text-xs text-muted-foreground mt-1 mb-3">
        Compare authority metrics across runs. Select two executions to compare side-by-side.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="w-10 py-2" />
              <th className="table-header text-left py-2">Execution Date</th>
              <th className="table-header text-left py-2">Context</th>
              <th className="table-header text-left py-2">Top 5 Share</th>
              <th className="table-header text-left py-2">HHI</th>
              <th className="table-header text-left py-2">Inclusion Rate</th>
              <th className="table-header text-left py-2">Unique Domains</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={`border-b border-border hover:bg-primary/5 transition-colors ${i % 2 === 1 ? "bg-muted/50" : ""}`}>
                <td className="py-2 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(i)}
                    onChange={() => toggle(i)}
                    className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-ring accent-[hsl(var(--primary))]"
                  />
                </td>
                <td className="py-2 text-foreground">{r.date}</td>
                <td className="py-2 text-xs text-teal-600">Best laptops for home office</td>
                <td className="py-2 text-foreground tabular">{r.top5}</td>
                <td className="py-2 text-foreground tabular">{r.hhi}</td>
                <td className="py-2 text-foreground tabular">{r.inclusion}</td>
                <td className="py-2 text-foreground tabular">{r.domains}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected.length < 2 && (
        <p className="text-xs text-muted-foreground mt-2">Select 2 to compare</p>
      )}
    </section>
  );
};

export default ExecutionComparison;
