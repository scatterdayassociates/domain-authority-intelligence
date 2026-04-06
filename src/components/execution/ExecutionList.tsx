import { Eye, Download, RotateCcw, XCircle } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

type ExecutionStatus = "Completed" | "Failed" | "Running" | "Queued";

interface Execution {
  id: string;
  pack: string;
  context: string;
  version: string;
  model: string;
  prompts: number;
  totalRuns: number;
  status: ExecutionStatus;
  started: string;
  duration: string;
}

const executions: Execution[] = [
  { id: "EX-0329-001", pack: "Dell — Laptops — US", context: "Best laptops for home office", version: "v3", model: "GPT-4o", prompts: 7, totalRuns: 35, status: "Completed", started: "Apr 3, 2026 9:02 AM", duration: "3m 47s" },
  { id: "EX-0322-002", pack: "Dell — Laptops — US", context: "Best laptops for home office", version: "v2", model: "GPT-4o", prompts: 6, totalRuns: 30, status: "Completed", started: "Mar 29, 2026 2:14 PM", duration: "3m 12s" },
  { id: "EX-0315-003", pack: "Dell — Laptops — US", context: "Best laptops for home office", version: "v1", model: "GPT-4o", prompts: 5, totalRuns: 25, status: "Completed", started: "Mar 22, 2026 10:30 AM", duration: "2m 55s" },
  { id: "EX-0401-004", pack: "Sony — Headphones — UK", context: "Best noise cancelling head...", version: "v1", model: "Claude 3.5 Sonnet", prompts: 8, totalRuns: 40, status: "Completed", started: "Apr 1, 2026 4:45 PM", duration: "5m 02s" },
  { id: "EX-0328-005", pack: "Sony — Headphones — UK", context: "Best noise cancelling head...", version: "v1", model: "GPT-4o", prompts: 8, totalRuns: 40, status: "Failed", started: "Mar 28, 2026 11:20 AM", duration: "1m 08s" },
  { id: "EX-0403-006", pack: "Nike — Running — US", context: "Best running shoes 2024", version: "v2", model: "GPT-4o", prompts: 10, totalRuns: 50, status: "Running", started: "Apr 3, 2026 9:08 AM", duration: "—" },
  { id: "EX-0403-007", pack: "Nike — Running — US", context: "Best running shoes 2024", version: "v2", model: "Claude 3.5 Sonnet", prompts: 10, totalRuns: 50, status: "Queued", started: "Apr 3, 2026 9:08 AM", duration: "—" },
  { id: "EX-0402-008", pack: "Nike — Running — US", context: "Best running shoes 2024", version: "v1", model: "GPT-4o", prompts: 9, totalRuns: 45, status: "Completed", started: "Apr 2, 2026 3:30 PM", duration: "6m 11s" },
];

const statusStyles: Record<ExecutionStatus, string> = {
  Completed: "bg-[hsl(var(--status-completed-bg))] text-[hsl(var(--status-completed-fg))]",
  Failed: "bg-[hsl(var(--status-failed-bg))] text-[hsl(var(--status-failed-fg))]",
  Running: "bg-[hsl(var(--status-running-bg))] text-[hsl(var(--status-running-fg))]",
  Queued: "bg-[hsl(var(--status-queued-bg))] text-[hsl(var(--status-queued-fg))]",
};

interface ExecutionListProps {
  onViewExecution: (id: string) => void;
}

const ExecutionList = ({ onViewExecution }: ExecutionListProps) => {
  return (
    <div>
      <SectionHeader
        title="Executions"
        right={<span className="text-xs text-muted-foreground">{executions.length} executions</span>}
      />

      <div className="mt-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="table-header text-left py-2.5 px-3 w-[120px]">Execution ID</th>
              <th className="table-header text-left py-2.5 px-3">Prompt Pack</th>
              <th className="table-header text-left py-2.5 px-3 w-[140px]">Context</th>
              <th className="table-header text-left py-2.5 px-3 w-[60px]">Ver</th>
              <th className="table-header text-left py-2.5 px-3 w-[120px]">Model</th>
              <th className="table-header text-left py-2.5 px-3 w-[70px]">Prompts</th>
              <th className="table-header text-left py-2.5 px-3 w-[80px]">Total Runs</th>
              <th className="table-header text-left py-2.5 px-3 w-[100px]">Status</th>
              <th className="table-header text-left py-2.5 px-3 w-[130px]">Started</th>
              <th className="table-header text-left py-2.5 px-3 w-[80px]">Duration</th>
              <th className="table-header text-right py-2.5 px-3 w-[80px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {executions.map((exec, i) => (
              <tr
                key={exec.id}
                className={`border-b border-border hover:bg-primary/5 transition-colors ${
                  i % 2 === 1 ? "bg-muted/30" : ""
                }`}
              >
                <td className="py-2.5 px-3 text-sm font-mono text-muted-foreground">{exec.id}</td>
                <td className="py-2.5 px-3 text-sm text-foreground">{exec.pack}</td>
                <td className="py-2.5 px-3 text-sm text-slate-600 truncate max-w-[140px]">{exec.context}</td>
                <td className="py-2.5 px-3 text-sm text-muted-foreground">{exec.version}</td>
                <td className="py-2.5 px-3 text-sm text-foreground">{exec.model}</td>
                <td className="py-2.5 px-3 text-sm tabular text-foreground">{exec.prompts}</td>
                <td className="py-2.5 px-3 text-sm tabular text-foreground">{exec.totalRuns}</td>
                <td className="py-2.5 px-3">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-0.5 ${statusStyles[exec.status]}`}>
                    {exec.status === "Running" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--status-running-fg))] animate-pulse" />
                    )}
                    {exec.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-sm text-muted-foreground">{exec.started}</td>
                <td className="py-2.5 px-3 text-sm text-muted-foreground tabular">{exec.duration}</td>
                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {exec.status === "Completed" && (
                      <>
                        <button onClick={() => onViewExecution(exec.id)} className="text-muted-foreground hover:text-primary transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="text-muted-foreground hover:text-primary transition-colors" title="Export">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    {exec.status === "Failed" && (
                      <>
                        <button className="text-muted-foreground hover:text-primary transition-colors" title="Retry">
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onViewExecution(exec.id)} className="text-muted-foreground hover:text-primary transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    {(exec.status === "Running" || exec.status === "Queued") && (
                      <button className="text-muted-foreground hover:text-destructive transition-colors" title="Cancel">
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExecutionList;
