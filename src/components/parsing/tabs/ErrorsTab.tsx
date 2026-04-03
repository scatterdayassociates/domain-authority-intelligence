import { useState } from "react";
import { RefreshCw } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { toast } from "sonner";

interface ErrorsTabProps {
  failed: number;
  parsed: number;
}

const errorRows = [
  { run: 8, label: "Gaming headphones", runId: "run-003-h", errorType: "No URLs Found", raw: "The best gaming headphones available in 2024 include the Sony WH-1000XM5..." },
  { run: 14, label: "Wireless earbuds", runId: "run-004-c", errorType: "Parse Timeout", raw: "[Response truncated after 30s...]" },
  { run: 22, label: "Noise cancelling", runId: "run-005-b", errorType: "Malformed Response", raw: '```json { error: rate_limit_exceeded...' },
];

const ErrorsTab = ({ failed, parsed }: ErrorsTabProps) => {
  const [viewRawId, setViewRawId] = useState<string | null>(null);

  if (failed === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">No parse errors for this execution.</p>
      </div>
    );
  }

  const handleRetry = (runId: string) => {
    toast(`Retry parsing for ${runId}?`, {
      action: { label: "Confirm", onClick: () => toast.success(`Retrying parse for ${runId}`) },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const handleRetryAll = () => {
    toast(`Retry all ${failed} failed runs?`, {
      action: { label: "Confirm", onClick: () => toast.success(`Retrying ${failed} failed runs`) },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  return (
    <>
      <SectionHeader
        title="Parse Errors"
        right={<span className="text-xs text-red-500">{failed} failed runs · {parsed} parsed successfully</span>}
      />

      <div className="bg-muted/30 border border-border rounded-md p-3 text-xs text-muted-foreground mb-4 mt-2">
        Failed runs are stored with their raw response intact. The raw response is available for manual inspection below. Re-parsing can be triggered individually or for all failed runs.
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="table-header py-2 px-2 w-[50px]">Run #</th>
              <th className="table-header py-2 px-2 w-[160px]">Prompt Label</th>
              <th className="table-header py-2 px-2 w-[110px]">Run ID</th>
              <th className="table-header py-2 px-2 w-[140px]">Error Type</th>
              <th className="table-header py-2 px-2">Raw Response</th>
              <th className="table-header py-2 px-2 w-[120px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {errorRows.map((row, i) => (
              <tr key={row.runId} className={`border-b border-border ${i % 2 === 1 ? "bg-muted/30" : ""}`}>
                <td className="py-2 px-2 text-sm tabular text-muted-foreground">{row.run}</td>
                <td className="py-2 px-2 text-sm text-foreground">{row.label}</td>
                <td className="py-2 px-2 font-mono text-xs text-muted-foreground">{row.runId}</td>
                <td className="py-2 px-2">
                  <span className="text-xs rounded-full px-2 py-0.5 bg-red-50 text-red-600 font-medium">{row.errorType}</span>
                </td>
                <td className="py-2 px-2 text-sm italic text-muted-foreground truncate max-w-[300px]">{row.raw}</td>
                <td className="py-2 px-2 text-right flex items-center justify-end gap-2">
                  <button onClick={() => setViewRawId(viewRawId === row.runId ? null : row.runId)} className="text-xs text-primary hover:underline">View Raw</button>
                  <button onClick={() => handleRetry(row.runId)} className="text-xs text-primary hover:underline">Retry</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Raw Response Modal */}
      {viewRawId && (
        <div className="fixed inset-0 bg-foreground/40 z-50 flex items-center justify-center" onClick={() => setViewRawId(null)}>
          <div className="bg-background border border-border rounded-xl shadow-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-foreground mb-3">Raw Response — {viewRawId}</h3>
            <div className="font-mono text-xs text-foreground bg-muted/30 border border-border rounded-lg p-4 max-h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {errorRows.find(r => r.runId === viewRawId)?.raw}
            </div>
            <button
              onClick={() => setViewRawId(null)}
              className="mt-4 w-full h-9 border border-border text-muted-foreground text-sm rounded-md hover:bg-muted transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleRetryAll}
        className="mt-3 h-8 px-3 text-sm rounded-md border border-red-200 text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1.5"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Retry All Failed Runs ({failed})
      </button>
    </>
  );
};

export default ErrorsTab;
