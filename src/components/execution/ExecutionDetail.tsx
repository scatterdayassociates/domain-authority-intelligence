import { ArrowLeft, Download } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

interface ExecutionDetailProps {
  executionId: string;
  onBack: () => void;
}

const summaryData = {
  pack: "Dell — Laptops — US",
  version: "v3",
  model: "GPT-4o",
  prompts: 7,
  runsPerPrompt: 5,
  totalRuns: 35,
  status: "Completed",
  started: "Apr 3, 2026 9:02 AM",
  finished: "Apr 3, 2026 9:05 AM",
  duration: "3m 47s",
  temperature: 0.7,
  maxTokens: 2048,
};

const responseRows = [
  { prompt: "Best laptop search", run: 1, tokens: 847, latency: "3.2s", mentionsBrand: true, sourcesCount: 5 },
  { prompt: "Best laptop search", run: 2, tokens: 912, latency: "3.5s", mentionsBrand: true, sourcesCount: 4 },
  { prompt: "Best laptop search", run: 3, tokens: 788, latency: "2.9s", mentionsBrand: false, sourcesCount: 6 },
  { prompt: "Budget laptop", run: 1, tokens: 654, latency: "2.4s", mentionsBrand: true, sourcesCount: 3 },
  { prompt: "Budget laptop", run: 2, tokens: 701, latency: "2.7s", mentionsBrand: false, sourcesCount: 4 },
  { prompt: "Gaming laptop", run: 1, tokens: 1023, latency: "4.1s", mentionsBrand: false, sourcesCount: 7 },
  { prompt: "Gaming laptop", run: 2, tokens: 956, latency: "3.8s", mentionsBrand: true, sourcesCount: 5 },
  { prompt: "Ultrabook comparison", run: 1, tokens: 889, latency: "3.3s", mentionsBrand: true, sourcesCount: 4 },
];

const ExecutionDetail = ({ executionId, onBack }: ExecutionDetailProps) => {
  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to executions
      </button>

      {/* Summary */}
      <SectionHeader
        title={`Execution ${executionId}`}
        right={
          <button className="h-7 px-3 text-xs rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
            <Download className="w-3 h-3" />
            Export CSV
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4 max-w-2xl">
        {[
          ["Pack", summaryData.pack],
          ["Version", summaryData.version],
          ["Model", summaryData.model],
          ["Status", summaryData.status],
          ["Started", summaryData.started],
          ["Finished", summaryData.finished],
          ["Duration", summaryData.duration],
          ["Total Runs", String(summaryData.totalRuns)],
          ["Temperature", String(summaryData.temperature)],
          ["Max Tokens", String(summaryData.maxTokens)],
          ["Prompts", String(summaryData.prompts)],
          ["Runs/Prompt", String(summaryData.runsPerPrompt)],
        ].map(([label, value]) => (
          <div key={label}>
            <span className="text-label block mb-0.5">{label}</span>
            <span className="text-sm text-foreground">{value}</span>
          </div>
        ))}
      </div>

      {/* Response Table */}
      <SectionHeader
        title="Responses"
        right={<span className="text-xs text-muted-foreground">{responseRows.length} responses</span>}
      />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="table-header text-left py-2.5 px-3">Prompt</th>
              <th className="table-header text-left py-2.5 px-3 w-[60px]">Run</th>
              <th className="table-header text-left py-2.5 px-3 w-[80px]">Tokens</th>
              <th className="table-header text-left py-2.5 px-3 w-[80px]">Latency</th>
              <th className="table-header text-left py-2.5 px-3 w-[120px]">Brand Mention</th>
              <th className="table-header text-left py-2.5 px-3 w-[80px]">Sources</th>
            </tr>
          </thead>
          <tbody>
            {responseRows.map((row, i) => (
              <tr
                key={`${row.prompt}-${row.run}`}
                className={`border-b border-border hover:bg-primary/5 transition-colors ${
                  i % 2 === 1 ? "bg-muted/30" : ""
                }`}
              >
                <td className="py-2 px-3 text-sm text-foreground">{row.prompt}</td>
                <td className="py-2 px-3 text-sm tabular text-muted-foreground">#{row.run}</td>
                <td className="py-2 px-3 text-sm tabular text-foreground">{row.tokens}</td>
                <td className="py-2 px-3 text-sm tabular text-muted-foreground">{row.latency}</td>
                <td className="py-2 px-3">
                  <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                    row.mentionsBrand
                      ? "bg-[hsl(var(--status-completed-bg))] text-[hsl(var(--status-completed-fg))]"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {row.mentionsBrand ? "Yes" : "No"}
                  </span>
                </td>
                <td className="py-2 px-3 text-sm tabular text-foreground">{row.sourcesCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExecutionDetail;
