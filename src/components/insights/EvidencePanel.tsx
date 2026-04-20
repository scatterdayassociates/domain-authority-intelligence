import { useState } from "react";
import { X } from "lucide-react";

export interface EvidenceData {
  statement: string;
  metrics: { metric: string; value: string; threshold: string }[];
  rule: string;
  domainEvents: { runId: string; prompt: string; position: string; model: string }[];
  rawResponses: { runLabel: string; text: string; highlight: string }[];
}

interface Props {
  open: boolean;
  data: EvidenceData | null;
  onClose: () => void;
}

const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

const EvidencePanel = ({ open, data, onClose }: Props) => {
  const [tab, setTab] = useState<"metrics" | "events" | "raw">("metrics");

  if (!open || !data) return null;

  const renderHighlighted = (text: string, term: string) => {
    const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((p, i) =>
      p.toLowerCase() === term.toLowerCase() ? (
        <span key={i} className="text-teal-600 font-semibold">{p}</span>
      ) : (
        <span key={i}>{p}</span>
      ),
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div
        className="fixed top-0 right-0 h-full w-[480px] bg-white shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between">
          <div className="flex-1 pr-3">
            <h2 className="text-sm font-semibold text-slate-800">
              Evidence: {truncate(data.statement, 40)}
            </h2>
            <p className="text-[11px] text-slate-400 italic mt-1">
              Traceability path: Insight → Metric → Domain → Run → Response
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 py-3 flex gap-2 border-b border-slate-100">
          {[
            { id: "metrics", label: "Metrics" },
            { id: "events", label: "Domain Events" },
            { id: "raw", label: "Raw Responses" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`text-xs font-medium rounded-full px-3 py-1 transition-colors ${
                tab === t.id ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {tab === "metrics" && (
            <div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-xs text-slate-500 font-medium pb-2">Metric</th>
                    <th className="text-xs text-slate-500 font-medium pb-2">Value</th>
                    <th className="text-[11px] text-slate-400 font-medium pb-2">Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {data.metrics.map((m, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      <td className="text-xs text-slate-700 py-2">{m.metric}</td>
                      <td className="text-xs font-mono text-slate-700 py-2 tabular-nums">{m.value}</td>
                      <td className="text-[11px] text-slate-400 py-2">{m.threshold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-slate-400 italic mt-4">{data.rule}</p>
            </div>
          )}

          {tab === "events" && (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-[11px] text-slate-500 font-medium pb-2">Run ID</th>
                  <th className="text-[11px] text-slate-500 font-medium pb-2">Prompt</th>
                  <th className="text-[11px] text-slate-500 font-medium pb-2">Position</th>
                  <th className="text-[11px] text-slate-500 font-medium pb-2">Model</th>
                </tr>
              </thead>
              <tbody>
                {data.domainEvents.map((e, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="text-xs font-mono text-slate-600 py-1.5">{e.runId}</td>
                    <td className="text-xs text-slate-700 py-1.5">{e.prompt}</td>
                    <td className="text-xs font-mono text-slate-700 py-1.5 tabular-nums">{e.position}</td>
                    <td className="text-xs text-slate-600 py-1.5">{e.model}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "raw" && (
            <div>
              {data.rawResponses.map((r, i) => (
                <div key={i} className="mb-3">
                  <p className="text-[11px] text-slate-400 mb-1">{r.runLabel}</p>
                  <div className="bg-slate-50 rounded-lg p-3 font-mono text-xs text-slate-600 max-h-48 overflow-y-auto">
                    {renderHighlighted(r.text, r.highlight)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EvidencePanel;
