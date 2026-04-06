import { Clock } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { toast } from "sonner";

interface ParsingQueueProps {
  onViewExecution: (id: string) => void;
}

const rows = [
  { id: "EX-0329-001", pack: "Dell — Laptops — US", context: "Best laptops for home office", model: "GPT-4o", totalRuns: 35, parsed: 35, failed: 0, domains: 312, status: "Parsed", parsedAt: "Apr 3, 2026 9:06 AM" },
  { id: "EX-0322-002", pack: "Dell — Laptops — US", context: "Best laptops for home office", model: "GPT-4o", totalRuns: 30, parsed: 30, failed: 0, domains: 268, status: "Parsed", parsedAt: "Mar 29, 2026 2:16 PM" },
  { id: "EX-0315-003", pack: "Dell — Laptops — US", context: "Best laptops for home office", model: "GPT-4o", totalRuns: 25, parsed: 25, failed: 0, domains: 210, status: "Parsed", parsedAt: "Mar 22, 2026 10:33 AM" },
  { id: "EX-0401-004", pack: "Sony — Headphones — UK", context: "Best noise cancelling head...", model: "Claude 3.5 Sonnet", totalRuns: 40, parsed: 37, failed: 3, domains: 344, status: "Partial", parsedAt: "Apr 1, 2026 4:48 PM" },
  { id: "EX-0328-005", pack: "Sony — Headphones — UK", context: "Best noise cancelling head...", model: "GPT-4o", totalRuns: 40, parsed: 0, failed: 40, domains: 0, status: "Failed", parsedAt: "" },
  { id: "EX-0403-006", pack: "Nike — Running — US", context: "Best running shoes 2024", model: "GPT-4o", totalRuns: 50, parsed: 50, failed: 0, domains: 441, status: "Parsed", parsedAt: "Apr 3, 2026 9:18 AM" },
  { id: "EX-0402-008", pack: "Nike — Running — US", context: "Best running shoes 2024", model: "GPT-4o", totalRuns: 45, parsed: 44, failed: 1, domains: 396, status: "Partial", parsedAt: "Apr 2, 2026 3:36 PM" },
  { id: "EX-0403-NEW", pack: "Nike — Running — US", context: "Best running shoes 2024", model: "Claude 3.5 Sonnet", totalRuns: 50, parsed: null, failed: null, domains: null, status: "Pending", parsedAt: "" },
];

const statusClasses: Record<string, string> = {
  Parsed: "bg-[hsl(var(--status-completed-bg))] text-[hsl(var(--status-completed-fg))]",
  Partial: "bg-amber-100 text-amber-700",
  Failed: "bg-[hsl(var(--status-failed-bg))] text-[hsl(var(--status-failed-fg))]",
  Pending: "bg-[hsl(var(--status-queued-bg))] text-[hsl(var(--status-queued-fg))]",
  Parsing: "bg-[hsl(var(--status-running-bg))] text-[hsl(var(--status-running-fg))]",
};

const pendingCount = rows.filter(r => r.status === "Pending" || r.status === "Parsing").length;

const ParsingQueue = ({ onViewExecution }: ParsingQueueProps) => {
  const handleRetry = (id: string) => {
    toast(`Retry parsing for ${id}?`, {
      action: {
        label: "Confirm",
        onClick: () => toast.success(`Retrying parse for ${id}`),
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  return (
    <div>
      <SectionHeader
        title="Parsing Queue"
        right={<span className="text-xs text-muted-foreground">{rows.length} executions · {pendingCount} pending</span>}
      />
      <p className="text-xs text-muted-foreground italic mt-2 mb-4">
        Each row represents one execution. Parsing extracts and normalises domains from all raw model responses captured during that run.
      </p>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="table-header py-2 px-2 w-[130px]">Execution ID</th>
              <th className="table-header py-2 px-2">Prompt Pack</th>
              <th className="table-header py-2 px-2 w-[140px]">Context</th>
              <th className="table-header py-2 px-2 w-[130px]">Model</th>
              <th className="table-header py-2 px-2 w-[80px] text-center">Total Runs</th>
              <th className="table-header py-2 px-2 w-[70px] text-center">Parsed</th>
              <th className="table-header py-2 px-2 w-[70px] text-center">Failed</th>
              <th className="table-header py-2 px-2 w-[100px] text-center">Domains Found</th>
              <th className="table-header py-2 px-2 w-[120px]">Parse Status</th>
              <th className="table-header py-2 px-2 w-[140px]">Parsed At</th>
              <th className="table-header py-2 px-2 w-[100px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-border hover:bg-primary/5 transition-colors ${i % 2 === 1 ? "bg-muted/30" : ""}`}
              >
                <td className="py-2 px-2 font-mono text-xs text-muted-foreground">{row.id}</td>
                <td className="py-2 px-2 text-sm text-foreground">{row.pack}</td>
                <td className="py-2 px-2 text-sm text-slate-600 truncate max-w-[140px]">{row.context}</td>
                <td className="py-2 px-2 text-sm text-foreground">{row.model}</td>
                <td className="py-2 px-2 text-sm tabular text-center">{row.totalRuns}</td>
                <td className="py-2 px-2 text-sm tabular text-center text-green-600">{row.parsed ?? "—"}</td>
                <td className="py-2 px-2 text-sm tabular text-center text-red-500">{row.failed ? row.failed : "—"}</td>
                <td className="py-2 px-2 text-sm tabular text-center">{row.domains ?? "—"}</td>
                <td className="py-2 px-2">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-0.5 ${statusClasses[row.status]}`}>
                    {row.status === "Pending" && <Clock className="w-3 h-3" />}
                    {row.status === "Parsing" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                    {row.status}
                  </span>
                </td>
                <td className="py-2 px-2 text-sm text-muted-foreground">{row.parsedAt || "—"}</td>
                <td className="py-2 px-2 text-right">
                  {(row.status === "Parsed" || row.status === "Partial") && (
                    <button onClick={() => onViewExecution(row.id)} className="text-xs text-primary hover:underline font-medium">View</button>
                  )}
                  {row.status === "Failed" && (
                    <button onClick={() => handleRetry(row.id)} className="text-xs text-primary hover:underline font-medium">Retry</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParsingQueue;
