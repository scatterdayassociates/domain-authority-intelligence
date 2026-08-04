import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ComparabilityResult } from "@/lib/comparability";
import type { InsightMode } from "@/pages/Insights";

interface Props {
  result: ComparabilityResult;
  mode: Exclude<InsightMode, "snapshot">;
}

/**
 * Rendered above (and in the incompatible case, instead of) any cross-execution
 * diff or trend chart. Incompatible executions are never normalized or blended.
 */
const ComparabilityBanner = ({ result, mode }: Props) => {
  const scopeWord = mode === "compare" ? "comparison" : "trend series";

  if (result.comparable) {
    return (
      <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 flex items-start gap-2 text-xs">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
        <div className="text-emerald-800">
          <span className="font-medium">Executions are compatible</span> — matching Context, Prompt
          Pack version, ranking depth, and scoring contract across{" "}
          {result.executions.length} executions ({result.executions.map((e) => e.label).join(" · ")}).
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 flex items-start gap-3"
    >
      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
      <div className="text-xs text-amber-900 space-y-2">
        <p className="text-sm font-semibold text-amber-900">{result.headline}</p>
        <p>
          The selected executions do not share the same measurement basis, so this {scopeWord} is not
          rendered. Values are not normalized, blended, or averaged across incompatible executions.
        </p>
        <ul className="space-y-1">
          {result.mismatches.map((m) => (
            <li key={m.axis} className="flex flex-wrap items-center gap-1.5">
              <span className="font-medium">{m.label}:</span>
              {m.values.map((v) => (
                <span
                  key={v}
                  className="rounded-full border border-amber-300 bg-white/70 px-2 py-0.5 tabular-nums"
                >
                  {v}
                </span>
              ))}
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-amber-700">
          Executions in scope: {result.executions.map((e) => `${e.label} (${e.id})`).join(" · ")}
        </p>
      </div>
    </div>
  );
};

export default ComparabilityBanner;
