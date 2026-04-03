import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Clock } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

interface LiveMonitorProps {
  onBack: () => void;
  onComplete: (id: string) => void;
}

interface PromptRun {
  prompt: string;
  model: string;
  run: number;
  status: "completed" | "running" | "pending";
}

const initialRuns: PromptRun[] = [
  { prompt: "Best laptop search", model: "GPT-4o", run: 1, status: "completed" },
  { prompt: "Best laptop search", model: "GPT-4o", run: 2, status: "completed" },
  { prompt: "Best laptop search", model: "GPT-4o", run: 3, status: "completed" },
  { prompt: "Best laptop search", model: "GPT-4o", run: 4, status: "running" },
  { prompt: "Best laptop search", model: "GPT-4o", run: 5, status: "pending" },
  { prompt: "Budget laptop", model: "GPT-4o", run: 1, status: "pending" },
  { prompt: "Budget laptop", model: "GPT-4o", run: 2, status: "pending" },
  { prompt: "Budget laptop", model: "GPT-4o", run: 3, status: "pending" },
  { prompt: "Gaming laptop", model: "GPT-4o", run: 1, status: "pending" },
  { prompt: "Gaming laptop", model: "GPT-4o", run: 2, status: "pending" },
];

const LiveMonitor = ({ onBack, onComplete }: LiveMonitorProps) => {
  const [runs, setRuns] = useState(initialRuns);
  const [elapsed, setElapsed] = useState(47);

  const completed = runs.filter((r) => r.status === "completed").length;
  const total = runs.length;
  const pct = Math.round((completed / total) * 100);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRuns((prev) => {
        const runningIdx = prev.findIndex((r) => r.status === "running");
        if (runningIdx === -1) return prev;

        const next = [...prev];
        next[runningIdx] = { ...next[runningIdx], status: "completed" };

        const nextPending = next.findIndex((r) => r.status === "pending");
        if (nextPending !== -1) {
          next[nextPending] = { ...next[nextPending], status: "running" };
        }
        return next;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (completed === total && total > 0) {
      const t = setTimeout(() => onComplete("EX-0403-009"), 1500);
      return () => clearTimeout(t);
    }
  }, [completed, total, onComplete]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${(s % 60).toString().padStart(2, "0")}s`;

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to executions
      </button>

      <SectionHeader
        title="Live Execution Monitor"
        right={
          <span className="text-xs text-muted-foreground">
            Elapsed: {formatTime(elapsed)}
          </span>
        }
      />

      {/* Progress */}
      <div className="max-w-lg">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm text-foreground font-medium">{pct}% complete</span>
          <span className="text-xs text-muted-foreground tabular">{completed}/{total} runs</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Run Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="table-header text-left py-2.5 px-3">Prompt</th>
              <th className="table-header text-left py-2.5 px-3 w-[120px]">Model</th>
              <th className="table-header text-left py-2.5 px-3 w-[60px]">Run</th>
              <th className="table-header text-left py-2.5 px-3 w-[100px]">Status</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run, i) => (
              <tr
                key={`${run.prompt}-${run.run}`}
                className={`border-b border-border ${i % 2 === 1 ? "bg-muted/30" : ""}`}
              >
                <td className="py-2 px-3 text-sm text-foreground">{run.prompt}</td>
                <td className="py-2 px-3 text-sm text-muted-foreground">{run.model}</td>
                <td className="py-2 px-3 text-sm tabular text-muted-foreground">#{run.run}</td>
                <td className="py-2 px-3">
                  {run.status === "completed" && (
                    <span className="inline-flex items-center gap-1 text-xs text-[hsl(var(--status-completed-fg))]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Done
                    </span>
                  )}
                  {run.status === "running" && (
                    <span className="inline-flex items-center gap-1 text-xs text-[hsl(var(--status-running-fg))]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Running
                    </span>
                  )}
                  {run.status === "pending" && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      Pending
                    </span>
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

export default LiveMonitor;
