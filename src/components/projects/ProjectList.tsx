const projects = [
  { name: "Dell — Laptops", vertical: "Consumer Electronics", market: "United States", model: "GPT-4o", packVersion: "v3", packStatus: "Active", executions: 3, lastRun: "Apr 3, 2026", inclusionRate: 82, pipelineStatus: "Running" as const },
  { name: "Sony — Headphones", vertical: "Consumer Electronics", market: "United Kingdom", model: "Claude 3.5 Sonnet", packVersion: "v1", packStatus: "Active", executions: 2, lastRun: "Apr 1, 2026", inclusionRate: 64, pipelineStatus: "Scored" as const },
  { name: "Nike — Running", vertical: "Apparel & Footwear", market: "United States", model: "GPT-4o", packVersion: "v2", packStatus: "Active", executions: 2, lastRun: "Apr 3, 2026", inclusionRate: 55, pipelineStatus: "Scored" as const },
  { name: "Samsung — Smartphones", vertical: "Consumer Electronics", market: "Germany", model: "GPT-4o", packVersion: "v1", packStatus: "Draft", executions: 0, lastRun: null, inclusionRate: null, pipelineStatus: "Not Started" as const },
  { name: "Philips — Air Purifiers", vertical: "Home Appliances", market: "France", model: "GPT-4o", packVersion: "v1", packStatus: "Draft", executions: 0, lastRun: null, inclusionRate: null, pipelineStatus: "Not Started" as const },
  { name: "HP — Printers", vertical: "Consumer Electronics", market: "United States", model: "GPT-4o", packVersion: "v2", packStatus: "Active", executions: 1, lastRun: "Mar 15, 2026", inclusionRate: 71, pipelineStatus: "Scored" as const },
];

interface ProjectListProps {
  onOpenProject: (name: string) => void;
}

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Running: "bg-blue-100 text-blue-700",
    Scored: "bg-green-100 text-green-700",
    Parsed: "bg-teal-50 text-teal-600",
    Executed: "bg-slate-100 text-slate-600",
    "Not Started": "bg-slate-100 text-slate-400 italic",
    Error: "bg-red-100 text-red-600",
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
      Each project is a distinct analysis context defined by advertiser, category, and market. Select a project to view its full pipeline status.
    </p>

    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-200">
          {["Project", "Market", "Model", "Prompt Pack", "Executions", "Last Run", "Latest Inclusion Rate", "Pipeline Status", "Actions"].map(h => (
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
              <span className="text-sm font-medium text-slate-800">{p.name}</span>
              <div className="text-xs text-slate-400">{p.vertical}</div>
            </td>
            <td className="px-3 py-2.5 text-sm text-slate-800">{p.market}</td>
            <td className="px-3 py-2.5 text-sm text-slate-800">{p.model}</td>
            <td className="px-3 py-2.5">
              <span className="text-sm text-slate-600">{p.packVersion} · </span>
              <span className="inline-flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${p.packStatus === "Active" ? "bg-green-500" : "bg-amber-400"}`} />
                <span className={`text-xs ${p.packStatus === "Active" ? "text-green-600" : "text-amber-600"}`}>{p.packStatus}</span>
              </span>
            </td>
            <td className="px-3 py-2.5 text-sm text-center tabular-nums text-slate-800">{p.executions}</td>
            <td className="px-3 py-2.5 text-sm text-slate-400">{p.lastRun || "—"}</td>
            <td className={`px-3 py-2.5 text-sm tabular-nums font-semibold text-center ${inclusionColor(p.inclusionRate)}`}>
              {p.inclusionRate !== null ? `${p.inclusionRate}%` : "—"}
            </td>
            <td className="px-3 py-2.5">{statusBadge(p.pipelineStatus)}</td>
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
