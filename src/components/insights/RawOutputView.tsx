import { useMemo, useState } from "react";
import { Terminal, Search, ChevronRight } from "lucide-react";
import ExportButton from "@/components/export/ExportButton";
import McpContextTrigger from "@/components/mcp/McpContextTrigger";
import { DEFAULT_CONTEXT, singleExecutionScope } from "@/lib/export/mockContext";
import { rawOutputTables } from "@/lib/export/builders";

interface Props {
  context: string;
}

interface RawRun {
  run_id: string;
  prompt_id: string;
  prompt_text: string;
  model: string;
  status: "completed" | "failed";
  response_text: string;
  domains: string[];
}

const PROMPTS = [
  "Best laptops for home office",
  "Top business laptops 2026",
  "Reliable laptops for remote work",
  "Premium laptops for professionals",
];

const RUNS: RawRun[] = Array.from({ length: 12 }, (_, i) => ({
  run_id: `exec_2026_05_run_${i + 1}`,
  prompt_id: `pp_q${(i % 4) + 1}`,
  prompt_text: PROMPTS[i % 4],
  model: i % 2 === 0 ? "GPT-4o" : "Claude 3.5",
  status: "completed",
  response_text:
    "For home office, leading reviews from techradar.com and pcmag.com recommend the Dell XPS 13 for its build quality and battery life. Apple's MacBook Air is also frequently cited.",
  domains: ["techradar.com", "pcmag.com", i % 3 === 0 ? "dell.com" : "rtings.com"],
}));

const RawOutputView = ({ context }: Props) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return RUNS;
    return RUNS.filter(
      (r) =>
        r.run_id.includes(q) ||
        r.prompt_text.toLowerCase().includes(q) ||
        r.response_text.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Terminal className="w-4 h-4" /> Raw Output
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Validation layer · run-level model responses for{" "}
            <span className="font-medium text-slate-700">{context}</span>.
          </p>
        </div>
        <ExportButton
          sourceView="raw_output"
          context={DEFAULT_CONTEXT}
          scope={singleExecutionScope()}
          tablesBuilder={() => rawOutputTables(singleExecutionScope())}
          defaultDepth="deep_included"
          appliedUiFilters={{ query: query || null }}
        />
      </div>

      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search runs, prompts or response text…"
          className="flex-1 bg-transparent text-sm focus:outline-none"
        />
        <span className="text-xs text-slate-400">{filtered.length} runs</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-2">Run</th>
              <th className="text-left px-4 py-2">Prompt</th>
              <th className="text-left px-4 py-2">Model</th>
              <th className="text-left px-4 py-2">Domains</th>
              <th className="text-right px-4 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const isOpen = open === r.run_id;
              return (
                <>
                  <tr
                    key={r.run_id}
                    className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => setOpen(isOpen ? null : r.run_id)}
                  >
                    <td className="px-4 py-2 font-mono text-xs text-slate-700">{r.run_id}</td>
                    <td className="px-4 py-2 text-slate-700">{r.prompt_text}</td>
                    <td className="px-4 py-2 text-slate-600">{r.model}</td>
                    <td className="px-4 py-2 text-xs text-slate-500">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {r.domains.map((d) => (
                          <span key={d} className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5 font-mono">
                            {d}
                            <McpContextTrigger scope="domain" subject={d} executionLabel="Snapshot: May 2026" variant="icon" />
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right text-slate-400">
                      <ChevronRight
                        className={`w-3.5 h-3.5 inline transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    </td>
                  </tr>
                  {isOpen && (
                    <tr key={`${r.run_id}-detail`} className="bg-slate-50/60">
                      <td colSpan={5} className="px-4 py-3">
                        <div className="text-xs text-slate-500 mb-1">
                          prompt_id: <span className="font-mono">{r.prompt_id}</span> ·
                          response_id: <span className="font-mono">resp_{r.run_id.split("_").pop()}</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{r.response_text}</p>
                        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] uppercase tracking-wide text-slate-500">Expand with MCP context:</span>
                          {r.domains.map((d) => (
                            <McpContextTrigger
                              key={d}
                              scope="domain"
                              subject={d}
                              executionLabel="Snapshot: May 2026"
                              variant="chip"
                              label={d}
                            />
                          ))}
                          <span className="ml-auto text-[10px] text-slate-400 italic">
                            Validation evidence above is canonical. MCP context is read-only enrichment.
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate-400 text-center pt-2">
        Raw responses are immutable execution artefacts · use Export → deep data for full audit packages.
      </p>
    </div>
  );
};

export default RawOutputView;
