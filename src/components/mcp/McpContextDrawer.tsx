import { Lock, ExternalLink, Info, ShieldCheck, AlertCircle, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { getMcpContext, type McpScope } from "@/lib/mcpMock";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope: McpScope;
  subject: string;
  executionLabel?: string; // e.g. "Snapshot: May 2026" or "Compare: Apr → May 2026"
}

const fmtPct = (v?: number) => (v === undefined ? "—" : `${(v * 100).toFixed(1)}%`);

const confidencePill = (c: "Low" | "Medium" | "High") =>
  c === "High"
    ? "bg-amber-100 text-amber-700"
    : c === "Medium"
    ? "bg-slate-100 text-slate-700"
    : "bg-slate-50 text-slate-500";

const McpContextDrawer = ({ open, onOpenChange, scope, subject, executionLabel }: Props) => {
  const ctx = getMcpContext(scope, subject);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] p-0 flex flex-col gap-0 bg-white"
      >
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-100 space-y-2 text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <SheetTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                MCP Context
              </SheetTitle>
              <SheetDescription className="text-xs text-slate-500 mt-0.5 truncate">
                {scope === "domain" ? "Domain" : "Brand"} ·{" "}
                <span className={scope === "domain" ? "font-mono" : ""}>{subject}</span>
              </SheetDescription>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              <Lock className="w-3 h-3" /> Read-only context
            </span>
            <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500">
              External + Platform
            </span>
            {executionLabel && (
              <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700">
                {executionLabel}
              </span>
            )}
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {ctx.empty ? (
            <div className="text-center py-10">
              <Info className="w-5 h-5 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-600">No external context available for this {scope} yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Validation evidence and platform data remain unchanged.
              </p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <section className="border border-slate-200 rounded-lg p-3 bg-slate-50/40">
                <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-2">
                  Summary
                </div>
                <div className="space-y-1.5 text-xs">
                  <Row label="Canonical">
                    <span className={scope === "domain" ? "font-mono text-slate-800" : "text-slate-800"}>
                      {ctx.canonical ?? subject}
                    </span>
                  </Row>
                  {ctx.domainType && <Row label="Type"><span className="text-slate-700">{ctx.domainType}</span></Row>}
                  {ctx.organization && (
                    <Row label="Organization"><span className="text-slate-700">{ctx.organization}</span></Row>
                  )}
                  {ctx.homepage && (
                    <Row label="Homepage">
                      <a
                        href={ctx.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-600 hover:underline inline-flex items-center gap-0.5"
                      >
                        {ctx.homepage.replace(/^https?:\/\//, "")}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Row>
                  )}
                  {ctx.description && (
                    <p className="text-slate-600 leading-relaxed pt-1">{ctx.description}</p>
                  )}
                </div>
              </section>

              {/* Platform context */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-slate-700">Platform context</h4>
                  <span className="text-[10px] text-slate-400">Linked evidence</span>
                </div>
                <div className="border border-slate-200 rounded-lg p-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  {ctx.platform.runsAppeared !== undefined && (
                    <Stat
                      label="Appears in"
                      value={`${ctx.platform.runsAppeared} / ${ctx.platform.totalRuns ?? "—"} runs`}
                    />
                  )}
                  {ctx.platform.mentions !== undefined && (
                    <Stat label="Mentions" value={String(ctx.platform.mentions)} />
                  )}
                  {ctx.platform.avgPosition !== undefined && (
                    <Stat label="Avg position" value={`#${ctx.platform.avgPosition.toFixed(1)}`} />
                  )}
                  {ctx.platform.mentionShare !== undefined && (
                    <Stat label="Mention share" value={fmtPct(ctx.platform.mentionShare)} />
                  )}
                  {ctx.platform.firstSeen && <Stat label="First seen" value={ctx.platform.firstSeen} />}
                  {ctx.platform.lastSeen && <Stat label="Last seen" value={ctx.platform.lastSeen} />}
                </div>
                {(ctx.platform.compareNote || ctx.platform.trendNote) && (
                  <div className="mt-2 space-y-1 text-[11px] text-slate-500 italic">
                    {ctx.platform.compareNote && <p>{ctx.platform.compareNote}</p>}
                    {ctx.platform.trendNote && <p>{ctx.platform.trendNote}</p>}
                  </div>
                )}
              </section>

              {/* External context */}
              {ctx.related.length > 0 && (
                <section>
                  <h4 className="text-xs font-semibold text-slate-700 mb-2">External context</h4>
                  <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                    {ctx.related.map((r) => (
                      <div key={r.domain} className="flex items-center justify-between px-3 py-2 text-xs">
                        <span className="font-mono text-slate-700">{r.domain}</span>
                        <span className="text-[10px] uppercase tracking-wide text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-full border border-slate-100">
                          {r.relation}
                        </span>
                      </div>
                    ))}
                  </div>
                  {ctx.partial && (
                    <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Platform context available; external context incomplete.
                    </p>
                  )}
                </section>
              )}

              {/* Suggested review */}
              {ctx.suggestions.length > 0 && (
                <section>
                  <h4 className="text-xs font-semibold text-slate-700 mb-2">Suggested review</h4>
                  <div className="space-y-2">
                    {ctx.suggestions.map((s, i) => (
                      <div key={i} className="border border-slate-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-800">{s.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${confidencePill(s.confidence)}`}>
                            {s.confidence} confidence
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{s.explanation}</p>
                        <button
                          type="button"
                          className="text-[11px] text-teal-600 hover:underline mt-1.5 inline-flex items-center gap-0.5"
                        >
                          {s.routeLabel} <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 italic mt-1.5">
                    Advisory only. MCP cannot modify prompts, mappings, or scoring.
                  </p>
                </section>
              )}

              {/* Provenance */}
              {ctx.provenance.length > 0 && (
                <section>
                  <h4 className="text-xs font-semibold text-slate-700 mb-2">Provenance</h4>
                  <ul className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                    {ctx.provenance.map((p, i) => (
                      <li key={i} className="px-3 py-2 text-[11px] flex items-center justify-between">
                        <span className="text-slate-700">{p.source}</span>
                        <span className="text-slate-400 tabular-nums">
                          {p.sourceType} · {new Date(p.fetchedAt).toISOString().slice(0, 10)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>

        {/* Guardrail footer */}
        <div className="border-t border-slate-100 px-5 py-3 bg-slate-50">
          <div className="flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              MCP context is read-only enrichment and does not affect scoring, parsing, or historical metrics.
              <br />
              Validation raw outputs remain the canonical evidence surface.
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-baseline gap-2">
    <span className="text-[10px] uppercase tracking-wide text-slate-500 w-24 flex-shrink-0">{label}</span>
    <span className="flex-1">{children}</span>
  </div>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className="text-slate-800 font-medium tabular-nums">{value}</div>
  </div>
);

export default McpContextDrawer;
