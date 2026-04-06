const projects = [
  { name: "Dell — Laptops", category: "Consumer Electronics", market: "United States", model: "GPT-4o", contexts: 3, activeContexts: 2, executions: 3, lastRun: "Apr 3, 2026", inclusionRate: 82, pipelineStatus: "Running" as const, isBrand: true },
  { name: "Sony — Headphones", category: "Consumer Electronics", market: "United Kingdom", model: "Claude 3.5 Sonnet", contexts: 2, activeContexts: 1, executions: 2, lastRun: "Apr 1, 2026", inclusionRate: 64, pipelineStatus: "Scored" as const, isBrand: true },
  { name: "Nike — Running", category: "Apparel & Footwear", market: "United States", model: "GPT-4o", contexts: 2, activeContexts: 2, executions: 2, lastRun: "Apr 3, 2026", inclusionRate: 55, pipelineStatus: "Scored" as const, isBrand: true },
  { name: "Samsung — Smartphones", category: "Consumer Electronics", market: "Germany", model: "GPT-4o", contexts: 0, activeContexts: 0, executions: 0, lastRun: null, inclusionRate: null, pipelineStatus: "Not Started" as const, isBrand: true },
  { name: "Air Purifiers", category: "Home Appliances", market: "France", model: "GPT-4o", contexts: 0, activeContexts: 0, executions: 0, lastRun: null, inclusionRate: null, pipelineStatus: "Not Started" as const, isBrand: false },
  { name: "HP — Printers", category: "Consumer Electronics", market: "United States", model: "GPT-4o", contexts: 1, activeContexts: 1, executions: 1, lastRun: "Mar 15, 2026", inclusionRate: 71, pipelineStatus: "Scored" as const, isBrand: true },
];

interface ProjectListProps {
  onOpenProject: (name: string) => void;
}

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    "Running": "bg-blue-100 text-blue-700",
    "Scored": "bg-green-100 text-green-700",
    "Parsed": "bg-teal-50 text-teal-600",
    "Executed": "bg-slate-100 text-slate-600",
    "Not Started": "bg-slate-100 text-slate-400 italic",
    "Error": "bg-red-100 text-red-600",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-0.5 ${styles[status] || styles["Not Started"]}`}>
      {status === "Running" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
      {status}
    </span>
  );
};

const inclusionColor = (rate: number | null) => {
  if (rate === null) return "text-slate-400";
  if (rate >= 75) return "text-green-600";
  if (rate < 60) return "text-amber-600";
  return "text-slate-800";
};

const ProjectList = ({ onOpenProject }: ProjectListProps) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <h2 className="text-sm font-semibold text-slate-700">Projects</h2>
      <span className="text-xs text-slate-400 flex items-center gap-1.5">
        {projects.length} projects ·{" "}
        <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          1 active execution
        </span>
      </span>
    </div>
    <div className="border-b border-slate-200 mb-3" />
    <p className="text-xs text-slate-500 italic mb-4">
      Each project is a distinct analysis context defined by brand, category, and market. Select a project to view its full pipeline status.
    </p>

    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-200">
          {["Project", "Market", "Model", "Contexts", "Executions", "Last Run", "Latest Inclusion Rate", "Pipeline Status", "Actions"].map(h => (
            <th key={h} className="text-xs text-slate-500 uppercase tracking-wide font-medium text-left pb-2 px-3 first:pl-4 last:pr-4 last:text-right">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {projects.map((p, i) => (
          <tr
            key={p.name}
            onClick={() => onOpenProject(p.name)}
            className={`cursor-pointer transition-colors hover:bg-teal-50 ${
              p.pipelineStatus === "Running" ? "bg-blue-50" : i % 2 === 1 ? "bg-slate-50" : ""
            }`}
          >
            <td className="px-3 py-2.5 first:pl-4">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-slate-800">{p.name}</span>
                {!p.isBrand && (
                  <span className="bg-amber-50 text-amber-600 text-xs rounded-full px-2 py-0.5 font-medium">Category Scan</span>
                )}
              </div>
              <div className="text-xs text-slate-400">{p.category}</div>
            </td>
            <td className="px-3 py-2.5 text-sm text-slate-800">{p.market}</td>
            <td className="px-3 py-2.5 text-sm text-slate-800">{p.model}</td>
            <td className="px-3 py-2.5">
              <span className="text-sm text-slate-600">{p.contexts > 0 ? `${p.contexts} contexts` : <span className="text-slate-400 italic">0 contexts</span>}</span>
              {p.activeContexts > 0 && <div className="text-xs text-green-600">{p.activeContexts} active</div>}
            </td>
            <td className="px-3 py-2.5 text-sm text-center tabular-nums text-slate-800">{p.executions}</td>
            <td className="px-3 py-2.5 text-sm text-slate-400">{p.lastRun || "—"}</td>
            <td className={`px-3 py-2.5 text-sm tabular-nums font-semibold text-center ${inclusionColor(p.inclusionRate)}`}>
              {p.inclusionRate !== null ? `${p.inclusionRate}%` : "—"}
            </td>
            <td className="px-3 py-2.5">
              {p.contexts === 0 ? (
                <span className="text-xs text-slate-400 italic">No Contexts</span>
              ) : statusBadge(p.pipelineStatus)}
            </td>
            <td className="px-3 py-2.5 text-right last:pr-4">
              <button className="text-sm text-teal-600 hover:text-teal-700">Open</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ProjectList;
