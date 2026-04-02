import SectionHeader from "./SectionHeader";

const executions = [
  { date: "Mar 29, 2026", version: "v3", model: "GPT-4o", prompts: 7, status: "Completed" },
  { date: "Mar 22, 2026", version: "v2", model: "GPT-4o", prompts: 6, status: "Completed" },
  { date: "Mar 15, 2026", version: "v1", model: "GPT-4o", prompts: 5, status: "Completed" },
];

const ExecutionHistory = () => (
  <section>
    <SectionHeader
      title="Execution History"
      right={<span className="text-xs text-muted-foreground">Last run 3 days ago</span>}
    />
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="table-header text-left py-2">Date</th>
            <th className="table-header text-left py-2">Version</th>
            <th className="table-header text-left py-2">Model</th>
            <th className="table-header text-left py-2">Prompts</th>
            <th className="table-header text-left py-2">Status</th>
            <th className="table-header text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {executions.map((e, i) => (
            <tr key={i} className={`border-b border-border hover:bg-primary/5 transition-colors ${i % 2 === 1 ? "bg-muted/50" : ""}`}>
              <td className="py-2 text-foreground">{e.date}</td>
              <td className="py-2 text-foreground tabular">{e.version}</td>
              <td className="py-2 text-foreground">{e.model}</td>
              <td className="py-2 text-foreground tabular">{e.prompts} prompts</td>
              <td className="py-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[hsl(var(--status-completed-bg))] text-[hsl(var(--status-completed-fg))]">
                  {e.status}
                </span>
              </td>
              <td className="py-2 text-right">
                <button className="text-sm text-primary hover:text-primary/80 transition-colors">View Results</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default ExecutionHistory;
