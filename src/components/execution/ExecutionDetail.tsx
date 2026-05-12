import { ArrowLeft, Download, Info } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExecutionDetailProps {
  executionId: string;
  onBack: () => void;
}

const summaryData = {
  pack: "Dell — Laptops — US",
  version: "v3",
  packHash: "sha256:9f4c…a71b",
  model: "GPT-4o",
  modelProviderId: "openai/gpt-4o-2024-08-06",
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

type FieldDef = {
  label: string;
  value: string;
  mono?: boolean;
  tooltip?: string;
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
  const fields: FieldDef[] = [
    { label: "Pack", value: summaryData.pack },
    { label: "Version", value: summaryData.version },
    {
      label: "Pack Hash",
      value: summaryData.packHash,
      mono: true,
      tooltip:
        "Immutable hash of the frozen analytical configuration (prompts, dictionaries, parsing rules, scoring weights) used for this execution. This is the true reproducibility anchor — pack label and version may change if a pack is cloned, renamed, restored, or migrated, but the hash uniquely identifies the exact instrument state.",
    },
    {
      label: "Model",
      value: summaryData.model,
      tooltip: `Operator-facing label. Provider model identifier: ${summaryData.modelProviderId}. The friendly label may remain stable while underlying provider revisions change over time; the raw provider identifier is preserved internally and in exports to disambiguate historical reproducibility.`,
    },
    {
      label: "Provider Model ID",
      value: summaryData.modelProviderId,
      mono: true,
      tooltip:
        "Raw provider model identifier and revision pinned at execution time. Used as the authoritative model reference in exports and provenance records.",
    },
    { label: "Status", value: summaryData.status },
    { label: "Started", value: summaryData.started },
    { label: "Finished", value: summaryData.finished },
    {
      label: "Duration",
      value: summaryData.duration,
      tooltip:
        "Wall-clock elapsed time from execution start to completion (Finished − Started), inclusive of provider latency, retries, and queueing. Not a sum of per-run model latencies.",
    },
    { label: "Total Runs", value: String(summaryData.totalRuns) },
    {
      label: "Temperature",
      value: String(summaryData.temperature),
      tooltip:
        "Analytical configuration state, not a simple operational parameter — temperature materially affects response variability and the stability of authority/inclusion distributions across runs. Lower temperatures generally improve reproducibility and execution-to-execution comparison stability.",
    },
    { label: "Max Tokens", value: String(summaryData.maxTokens) },
    { label: "Prompts", value: String(summaryData.prompts) },
    { label: "Runs/Prompt", value: String(summaryData.runsPerPrompt) },
  ];

  return (
    <TooltipProvider delayDuration={150}>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="h-7 px-3 text-xs rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
                <Download className="w-3 h-3" />
                Export CSV
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs text-xs leading-relaxed">
              Export payloads must include immutable execution identifiers (execution ID, pack hash, provider model ID, timestamps) and the frozen execution configuration metadata (prompt set, temperature, max tokens, parsing/scoring config) sufficient to reconstruct analytical provenance independently of the UI.
            </TooltipContent>
          </Tooltip>
        }
      />

      <div className="grid grid-cols-4 gap-4 max-w-3xl">
        {fields.map(({ label, value, mono, tooltip }) => (
          <div key={label}>
            <span className="text-label block mb-0.5 flex items-center gap-1">
              {label}
              {tooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-muted-foreground/70 hover:text-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                    {tooltip}
                  </TooltipContent>
                </Tooltip>
              )}
            </span>
            <span className={`text-sm text-foreground ${mono ? "font-mono text-xs break-all" : ""}`}>
              {value}
            </span>
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
    </TooltipProvider>
  );
};

export default ExecutionDetail;
