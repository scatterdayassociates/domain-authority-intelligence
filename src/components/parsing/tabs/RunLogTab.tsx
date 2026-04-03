import { useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import RunInspectionPanel from "@/components/parsing/RunInspectionPanel";

interface RunLogTabProps {
  totalRuns: number;
}

const runRows = [
  { run: 1, label: "Best laptop search", runId: "run-001-a", urls: 6, domains: 6, normalised: 6, status: "OK" },
  { run: 2, label: "Best laptop search", runId: "run-001-b", urls: 5, domains: 5, normalised: 5, status: "OK" },
  { run: 3, label: "Best laptop search", runId: "run-001-c", urls: 7, domains: 7, normalised: 7, status: "OK" },
  { run: 4, label: "Best laptop search", runId: "run-001-d", urls: 6, domains: 6, normalised: 6, status: "OK" },
  { run: 5, label: "Best laptop search", runId: "run-001-e", urls: 6, domains: 6, normalised: 6, status: "OK" },
  { run: 6, label: "Budget laptop", runId: "run-002-a", urls: 5, domains: 5, normalised: 5, status: "OK" },
  { run: 7, label: "Budget laptop", runId: "run-002-b", urls: 5, domains: 5, normalised: 5, status: "OK" },
  { run: 8, label: "Budget laptop", runId: "run-002-c", urls: 4, domains: 4, normalised: 4, status: "OK" },
  { run: 9, label: "Budget laptop", runId: "run-002-d", urls: 6, domains: 6, normalised: 6, status: "OK" },
  { run: 10, label: "Budget laptop", runId: "run-002-e", urls: 5, domains: 5, normalised: 5, status: "OK" },
  { run: 11, label: "Gaming laptop", runId: "run-003-a", urls: 7, domains: 7, normalised: 7, status: "OK" },
  { run: 12, label: "Gaming laptop", runId: "run-003-b", urls: 6, domains: 6, normalised: 6, status: "OK" },
];

const statusDot: Record<string, string> = {
  OK: "bg-green-500",
  Partial: "bg-amber-400",
  "No URLs": "bg-muted-foreground",
  Failed: "bg-red-500",
};

const statusText: Record<string, string> = {
  OK: "text-green-600",
  Partial: "text-amber-600",
  "No URLs": "text-muted-foreground",
  Failed: "text-red-500",
};

const RunLogTab = ({ totalRuns }: RunLogTabProps) => {
  const [inspectRun, setInspectRun] = useState<typeof runRows[0] | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleRows = showAll ? runRows : runRows.slice(0, 12);

  return (
    <>
      <SectionHeader
        title="Run-Level Parse Results"
        right={<span className="text-xs text-muted-foreground">Showing {visibleRows.length} of {totalRuns} runs</span>}
      />

      <div className="w-full overflow-x-auto mt-2">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="table-header py-2 px-2 w-[50px]">Run #</th>
              <th className="table-header py-2 px-2 w-[160px]">Prompt Label</th>
              <th className="table-header py-2 px-2 w-[110px]">Run ID</th>
              <th className="table-header py-2 px-2 w-[80px] text-center">URLs Found</th>
              <th className="table-header py-2 px-2 w-[80px] text-center">Domains</th>
              <th className="table-header py-2 px-2 w-[90px] text-center">Normalised</th>
              <th className="table-header py-2 px-2 w-[100px]">Parse Status</th>
              <th className="table-header py-2 px-2 w-[80px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => (
              <tr
                key={row.runId}
                className={`border-b border-border hover:bg-primary/5 transition-colors ${i % 2 === 1 ? "bg-muted/30" : ""}`}
              >
                <td className="py-2 px-2 text-sm tabular text-muted-foreground">{row.run}</td>
                <td className="py-2 px-2 text-sm text-foreground truncate max-w-[160px]">{row.label}</td>
                <td className="py-2 px-2 font-mono text-xs text-muted-foreground">{row.runId}</td>
                <td className="py-2 px-2 text-sm tabular text-center">{row.urls}</td>
                <td className="py-2 px-2 text-sm tabular text-center text-primary">{row.domains}</td>
                <td className="py-2 px-2 text-sm tabular text-center text-muted-foreground">{row.normalised}</td>
                <td className="py-2 px-2">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${statusDot[row.status]}`} />
                    <span className={`text-xs ${statusText[row.status]}`}>{row.status}</span>
                  </span>
                </td>
                <td className="py-2 px-2 text-right">
                  <button
                    onClick={() => setInspectRun(row)}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!showAll && totalRuns > 12 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-2 text-sm text-primary hover:underline mx-auto block"
        >
          ↓ Show all {totalRuns} runs
        </button>
      )}

      {inspectRun && (
        <RunInspectionPanel run={inspectRun} onClose={() => setInspectRun(null)} />
      )}
    </>
  );
};

export default RunLogTab;
