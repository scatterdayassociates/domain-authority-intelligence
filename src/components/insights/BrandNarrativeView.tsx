import { useState } from "react";
import { MessageSquareQuote, Info } from "lucide-react";

/**
 * Brand Narrative (Insights layer) — interpretive, NOT measured.
 *
 * This view hosts the narrative breakdown that previously appeared as
 * "MENTION TYPE" bars on the Scoring Engine's Brand Inclusion tab.
 * It is deliberately reframed as brand × attribute association rates
 * (governed descriptor extraction), not sentiment-polarity scoring.
 */

const TOTAL_RUNS = 35;

type AttrCategory = "Performance" | "Price" | "Quality" | "Design" | "Use Case";

interface Assoc {
  attribute: string;
  category: AttrCategory;
  runs: number; // runs where the association was extracted
  frequency: number; // total descriptor occurrences
}

const NARRATIVE: Record<string, Assoc[]> = {
  "Dell Technologies": [
    { attribute: "build quality", category: "Quality", runs: 24, frequency: 41 },
    { attribute: "business use", category: "Use Case", runs: 21, frequency: 33 },
    { attribute: "value for money", category: "Price", runs: 17, frequency: 26 },
    { attribute: "battery life", category: "Performance", runs: 12, frequency: 18 },
    { attribute: "port selection", category: "Design", runs: 8, frequency: 11 },
  ],
  HP: [
    { attribute: "affordability", category: "Price", runs: 22, frequency: 35 },
    { attribute: "home office use", category: "Use Case", runs: 18, frequency: 27 },
    { attribute: "display quality", category: "Quality", runs: 13, frequency: 19 },
    { attribute: "portability", category: "Design", runs: 9, frequency: 12 },
  ],
  Lenovo: [
    { attribute: "keyboard quality", category: "Design", runs: 20, frequency: 31 },
    { attribute: "durability", category: "Quality", runs: 16, frequency: 24 },
    { attribute: "business use", category: "Use Case", runs: 14, frequency: 20 },
    { attribute: "performance", category: "Performance", runs: 10, frequency: 15 },
  ],
  Apple: [
    { attribute: "performance", category: "Performance", runs: 23, frequency: 44 },
    { attribute: "battery life", category: "Performance", runs: 19, frequency: 30 },
    { attribute: "premium pricing", category: "Price", runs: 15, frequency: 22 },
    { attribute: "creative use", category: "Use Case", runs: 11, frequency: 16 },
  ],
};

const BRANDS = Object.keys(NARRATIVE);

const catTone: Record<AttrCategory, string> = {
  Performance: "bg-teal-100 text-teal-700",
  Price: "bg-amber-100 text-amber-700",
  Quality: "bg-violet-100 text-violet-700",
  Design: "bg-sky-100 text-sky-700",
  "Use Case": "bg-slate-100 text-slate-600",
};

const fmtPct = (v: number) => `${(v * 100).toFixed(0)}%`;

const band = (v: number) =>
  v >= 0.6
    ? { label: "Dominant association", cls: "bg-green-100 text-green-700" }
    : v >= 0.35
      ? { label: "Consistent", cls: "bg-teal-100 text-teal-700" }
      : v >= 0.15
        ? { label: "Emerging", cls: "bg-amber-100 text-amber-700" }
        : { label: "Noise", cls: "bg-slate-100 text-slate-500" };

const BrandNarrativeView = ({ context }: { context?: string }) => {
  const [brand, setBrand] = useState(BRANDS[0]);
  const rows = [...(NARRATIVE[brand] ?? [])].sort((a, b) => b.runs - a.runs);
  const lead = rows[0];

  return (
    <div className="space-y-5">
      {/* Interpretive banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-2">
        <MessageSquareQuote className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-medium">Narrative / interpretive layer.</span> These are
          governed attribute-descriptor associations extracted from model responses — how AI
          systems <em>describe</em> brands. They are not deterministic measurements and are
          deliberately kept off the Scoring Engine, which reports only domain-derived inclusion.
          Association rates are not sentiment-polarity scores.
        </div>
      </div>

      {/* Brand selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-slate-500">Brand:</span>
        {BRANDS.map((b) => (
          <button
            key={b}
            onClick={() => setBrand(b)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              brand === b
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {b}
          </button>
        ))}
        {context && <span className="ml-auto text-[11px] text-slate-400">Context: {context}</span>}
      </div>

      {/* Association breakdown (replaces MENTION TYPE bars) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-slate-800">
              Attribute Associations — {brand}
            </span>
            <span className="text-[11px] text-slate-500">
              Dictionary-governed extraction · {TOTAL_RUNS} valid responses
            </span>
          </div>
          {lead && (
            <p className="text-xs text-slate-600">
              {brand} — associated with <strong>{lead.attribute}</strong> in{" "}
              {fmtPct(lead.runs / TOTAL_RUNS)} of valid responses.
            </p>
          )}
        </div>

        <div className="p-4 space-y-3">
          {rows.map((r) => {
            const rate = r.runs / TOTAL_RUNS;
            const b = band(rate);
            return (
              <div key={r.attribute}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800 capitalize">{r.attribute}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${catTone[r.category]}`}>
                      {r.category}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${b.cls}`}>{b.label}</span>
                  </div>
                  <span className="tabular-nums text-slate-600">
                    {fmtPct(rate)} · {r.runs}/{TOTAL_RUNS} responses · {r.frequency} descriptors
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded overflow-hidden">
                  <div className="h-full bg-teal-500" style={{ width: `${rate * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-4 py-2 border-t border-slate-100 text-[11px] text-slate-500">
          Read as: “{brand} — associated with {lead?.attribute} in {lead ? fmtPct(lead.runs / TOTAL_RUNS) : "—"} of valid
          responses.” No positive / neutral / negative polarity is inferred.
        </div>
      </div>

      {/* Design-choice flag for the product owner */}
      <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-xs text-primary flex items-start gap-2">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <span>
          <strong>Design choice, not a hard requirement:</strong> the relocated Mention Type
          breakdown has been reframed from sentiment polarity (Positive / Neutral / Negative /
          Recommended) into brand × attribute associations, matching the platform's governed
          descriptor-extraction model. A polarity framing can be restored here if the product
          owner prefers it.
        </span>
      </div>
    </div>
  );
};

export default BrandNarrativeView;
