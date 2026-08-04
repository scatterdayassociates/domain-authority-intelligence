import { useState } from "react";
import {
  Globe,
  Target,
  BarChart2,
  GitCompare,
  MessageSquareQuote,
  ListOrdered,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import type { InsightMode } from "@/pages/Insights";
import DeltaIndicator from "./DeltaIndicator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type InsightType = "authority" | "brand" | "recommendation" | "concentration" | "movement" | "narrative";
export type Confidence = "high" | "medium" | "low";

interface InsightCard {
  type: InsightType;
  confidence: Confidence;
  statement: string;
  metrics: { label: string; value: string; tip?: string }[];
  change?: { direction: "up" | "down" | "flat"; text: string };
  trendChange?: { direction: "up" | "down" | "flat"; text: string };
  /** Per-metric deltas shown in Compare mode. */
  metricDeltas?: { label: string; value: number; unit?: string; decimals?: number }[];
  evidenceTab: string;
  tooltip: { source: string; bullets: string[] };
  trendDetail?: {
    magnitude: string;
    range: string;
    driver?: string;
  };
}


const TYPE_STYLES: Record<
  InsightType,
  {
    card: string;
    badge: string;
    badgeLabel: string;
    icon: typeof Globe;
    link: string;
    border: string;
  }
> = {
  authority: {
    card: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
    badgeLabel: "Authority",
    icon: Globe,
    link: "text-green-600",
    border: "border-green-200",
  },
  brand: {
    card: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    badgeLabel: "Brand Inclusion (Sources)",
    icon: Target,
    link: "text-amber-600",
    border: "border-amber-200",
  },
  recommendation: {
    card: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    badgeLabel: "Brand Recommendation",
    icon: ListOrdered,
    link: "text-teal-600",
    border: "border-teal-200",
  },
  concentration: {
    card: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    badgeLabel: "Concentration",
    icon: BarChart2,
    link: "text-blue-600",
    border: "border-blue-200",
  },
  movement: {
    card: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    badgeLabel: "Movement",
    icon: GitCompare,
    link: "text-purple-600",
    border: "border-purple-200",
  },
  narrative: {
    card: "bg-rose-50 border-rose-200",
    badge: "bg-rose-100 text-rose-700",
    badgeLabel: "Brand Narrative",
    icon: MessageSquareQuote,
    link: "text-rose-600",
    border: "border-rose-200",
  },
};

const confidencePill = (type: InsightType, conf: Confidence) => {
  if (conf === "low") return "bg-slate-100 text-slate-500";
  const high = conf === "high";
  switch (type) {
    case "authority":
      return high ? "bg-green-600 text-white" : "bg-green-100 text-green-700";
    case "brand":
      return high ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-700";
    case "recommendation":
      return high ? "bg-teal-600 text-white" : "bg-teal-100 text-teal-700";
    case "concentration":
      return high ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700";
    case "movement":
      return high ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700";
    case "narrative":
      return high ? "bg-rose-600 text-white" : "bg-rose-100 text-rose-700";
  }
};

const directionStyle = (dir: "up" | "down" | "flat") => {
  if (dir === "up") return { Icon: ArrowUp, color: "text-green-600" };
  if (dir === "down") return { Icon: ArrowDown, color: "text-red-600" };
  return { Icon: Minus, color: "text-slate-500" };
};

interface Props {
  mode: InsightMode;
  onNavigate: (tab: string) => void;
  onOpenEvidence?: (statement: string) => void;
}

const ExecutiveInsightPanel = ({ mode, onNavigate, onOpenEvidence }: Props) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const baseCards: InsightCard[] = [
    {
      type: "authority",
      confidence: "high",
      statement: "TechRadar remains a consistently selected source",
      metrics: [
        { label: "Appears in:", value: "7 / 12 runs" },
        { label: "RLP:", value: "58.3%" },
      ],
      change: { direction: "flat", text: "No change" },
      trendChange: { direction: "flat", text: "Stable over 5 executions" },
      evidenceTab: "domain",
      tooltip: {
        source: "Generated from: RLP (58.3%), runs_appeared (7/12)",
        bullets: [
          "Rule: RLP ≥ 50% across 2+ executions",
          "Threshold met: 58.3% RLP",
          "Confidence basis: Consistent across all 3 executions in range",
        ],
      },
      trendDetail: {
        magnitude: "Stable trend (±1pp across 5 executions)",
        range: "58%–62% RLP range",
        driver: "Consistent inclusion across review-led publisher queries",
      },
    },
    {
      type: "brand",
      confidence: "medium",
      statement: "Dell is increasingly included in model outputs",
      metrics: [
        { label: "Inclusion rate:", value: "75%" },
        { label: "Frequency:", value: "9 of 12 runs" },
      ],
      change: { direction: "up", text: "+15% vs previous execution" },
      trendChange: { direction: "up", text: "Increasing trend · 3 of 5 executions" },
      metricDeltas: [
        { label: "Δ Inclusion Rate", value: 15, unit: "pp" },
        { label: "Δ Runs surfaced", value: 2, unit: " runs", decimals: 0 },
      ],
      evidenceTab: "brand",

      tooltip: {
        source: "Generated from: inclusion_rate (75%), delta vs prior (+15pp)",
        bullets: [
          "Rule: Inclusion delta ≥ +10pp triggers movement signal",
          "Threshold met: +15pp shift",
          "Confidence basis: 2 consecutive executions confirming direction",
        ],
      },
      trendDetail: {
        magnitude: "Increasing trend (+15pp across 5 executions)",
        range: "60%–75% inclusion range",
        driver: "Driven by increased visibility in publisher domains",
      },
    },
    {
      type: "recommendation",
      confidence: "medium",
      statement: "Dell appears in the parsed recommended-brands list in 8 of 12 runs",
      metrics: [
        { label: "Inclusion Rate:", value: "66.7%" },
        {
          label: "Weighted Inclusion:",
          value: "3.62",
          tip: "Measures cumulative brand recommendation strength. What it measures: the position-weighted sum of every recommendation appearance for this brand across all runs — not normalized, so it grows with both frequency and rank strength.",
        },
        { label: "Top 3 Presence:", value: "41.7%" },
        { label: "Top 5 Presence:", value: "58.3%" },
      ],
      change: { direction: "up", text: "+8pp vs previous execution" },
      trendChange: { direction: "up", text: "Increasing trend · 3 of 5 executions" },
      metricDeltas: [
        { label: "Δ Inclusion Rate", value: 8.4, unit: "pp" },
        { label: "Δ Weighted Inclusion", value: 0.44, decimals: 2 },
        { label: "Δ Top 3 Presence", value: 8.4, unit: "pp" },
        { label: "Δ Top 5 Presence", value: 8.3, unit: "pp" },
      ],
      evidenceTab: "brand",
      tooltip: {
        source: "Generated from: recommended_brands list (8/12 runs), cumulative position-weighted inclusion (3.62)",
        bullets: [
          "Rule: Brand named in the model's explicit recommendation list",
          "Weighted inclusion applies rank decay to list position",
          "Confidence basis: 12 runs parsed, 2 runs with ambiguous list structure",
        ],
      },
      trendDetail: {
        magnitude: "Increasing trend (+8pp across 5 executions)",
        range: "58%–67% recommendation inclusion",
        driver: "More frequent placement inside top-3 recommendation slots",
      },
    },
    {
      type: "concentration",
      confidence: "high",
      statement: "The category is moderately concentrated and stable",
      metrics: [
        { label: "HHI:", value: "0.245" },
        { label: "Top 5 Share:", value: "1.00" },
      ],
      change: { direction: "flat", text: "No change" },
      trendChange: { direction: "flat", text: "Stable structure" },
      evidenceTab: "structural",
      tooltip: {
        source: "Generated from: HHI (0.245), Top 5 Share (100%)",
        bullets: [
          "Rule: 0.15 ≤ HHI ≤ 0.30 → Moderate concentration",
          "Threshold met: 0.245 within band",
          "Confidence basis: HHI variance < 0.02 across runs",
        ],
      },
      trendDetail: {
        magnitude: "Stable concentration (Δ HHI < 0.02 across 5 executions)",
        range: "HHI 0.24–0.26",
        driver: "Top 5 surfaced domains retain consistent appearance share",
      },
    },
    {
      type: "narrative",
      confidence: "medium",
      statement: "Dell is primarily positioned around affordability and general use",
      metrics: [
        { label: "Affordability theme share:", value: "68% (+6pp)" },
        { label: "General use theme share:", value: "54% (−2pp)" },
      ],
      change: { direction: "up", text: "Affordability strengthening vs prior" },
      trendChange: { direction: "up", text: "Affordability strengthening" },
      evidenceTab: "brand",
      tooltip: {
        source: "Generated from: theme co-occurrence (affordability 62%, general use 41%)",
        bullets: [
          "Rule: Top theme share ≥ 40% → dominant positioning",
          "Threshold met: 62% of runs contain affordability/value language",
          "Confidence basis: 9 of 12 runs reference price or budget framing",
        ],
      },
      trendDetail: {
        magnitude: "Affordability +6pp, general use −2pp across 5 executions",
        range: "Affordability 62%–68%, general use 54%–58%",
        driver: "Driven by value-led publisher commentary on new mid-range SKUs",
      },
    },
  ];

  const movementCard: InsightCard = {
    type: "movement",
    confidence: "medium",
    statement: "3 domains entered the core shortlist between April and May",
    metrics: [
      { label: "Entries:", value: "3" },
      { label: "Exits:", value: "1" },
    ],
    change: { direction: "up", text: "Shortlist expanded" },
    evidenceTab: "movement",
    tooltip: {
      source: "Generated from: entry_count (3), exit_count (1)",
      bullets: [
        "Rule: Net domain change ≠ 0 between executions",
        "Threshold met: +2 net domains in shortlist",
        "Confidence basis: Both executions parsed at 100%",
      ],
    },
  };

  const cards =
    mode === "compare" ? [...baseCards, movementCard] : baseCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
      {cards.map((card, idx) => {
        const style = TYPE_STYLES[card.type];
        const Icon = style.icon;
        const showRow4 = mode !== "snapshot" && (mode === "trends" ? card.trendChange : card.change);
        const dirData = mode === "trends" ? card.trendChange : card.change;

        return (
          <div
            key={idx}
            className={`relative rounded-xl border p-5 cursor-pointer hover:shadow-md transition-all duration-150 w-full flex flex-col ${style.card}`}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            onClick={() => onOpenEvidence?.(card.statement)}
          >
            {/* Row 1 */}
            <div className="flex items-start justify-between">
              <div
                className={`inline-flex items-center text-[11px] font-medium tracking-wide uppercase rounded-full px-2 py-0.5 ${style.badge}`}
              >
                <Icon className="w-3 h-3 mr-1" />
                {style.badgeLabel}
              </div>
              <div
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${confidencePill(card.type, card.confidence)}`}
              >
                {card.confidence === "high" ? "High" : card.confidence === "medium" ? "Medium" : "Low"}
              </div>
            </div>

            {/* Row 2 */}
            <div className="mt-2">
              <p className="text-sm font-semibold text-slate-800 max-w-[32ch]" style={{ textWrap: "pretty" } as React.CSSProperties}>
                {card.statement}
              </p>
            </div>

            {/* Row 3 */}
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
              {card.metrics.map((m, i) => (
                <div key={i} className="flex items-center justify-between col-span-2">
                  {m.tip ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-[11px] text-slate-500 underline decoration-dotted underline-offset-2 cursor-help">
                          {m.label}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-xs">{m.tip}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className="text-[11px] text-slate-500">{m.label}</span>
                  )}
                  <span className="text-xs font-semibold text-slate-700 tabular-nums">{m.value}</span>
                </div>
              ))}
            </div>

            {card.type === "concentration" && (
              <p className="mt-2 text-[10px] leading-snug text-slate-400">{CONCENTRATION_SCOPE_NOTE}</p>
            )}

            {/* Row 4 */}
            {showRow4 && dirData && (() => {
              const { Icon: DirIcon, color } = directionStyle(dirData.direction);
              return (
                <div className={`mt-3 flex items-center gap-1 ${color}`}>
                  <DirIcon className="w-3 h-3" />
                  <span className="text-xs font-medium">{dirData.text}</span>
                </div>
              );
            })()}

            {/* Compare-mode per-metric deltas */}
            {mode === "compare" && card.metricDeltas && (
              <div className={`mt-3 pt-3 border-t ${style.border} space-y-1`}>
                {card.metricDeltas.map((d) => (
                  <div key={d.label} className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500">{d.label}</span>
                    <DeltaIndicator value={d.value} unit={d.unit} decimals={d.decimals ?? 1} />
                  </div>
                ))}
              </div>
            )}



            {/* Trends-mode enrichment: magnitude / range / driver */}
            {mode === "trends" && card.trendDetail && (
              <div className={`mt-3 pt-3 border-t ${style.border} space-y-1.5`}>
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 min-w-[60px]">Magnitude</span>
                  <span className="text-[11px] text-slate-700 leading-snug">{card.trendDetail.magnitude}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 min-w-[60px]">Range</span>
                  <span className="text-[11px] text-slate-700 leading-snug tabular-nums">{card.trendDetail.range}</span>
                </div>
                {card.trendDetail.driver && (
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 min-w-[60px]">Driver</span>
                    <span className="text-[11px] text-slate-600 italic leading-snug">{card.trendDetail.driver}</span>
                  </div>
                )}
              </div>
            )}

            {/* Row 5 footer */}
            <div className={`mt-3 pt-2 border-t ${style.border} opacity-60 flex items-center justify-between mt-auto`}>
              <button
                className={`text-[11px] underline ${style.link} hover:no-underline inline-flex items-center gap-1`}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenEvidence?.(card.statement);
                }}
              >
                View evidence
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
              <ChevronRight className="w-3 h-3 text-slate-300" />
            </div>

            {/* Hover tooltip */}
            {hoveredIdx === idx && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl max-w-[240px] w-[240px]">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45" />
                <p className="text-[11px] font-medium mb-2">{card.tooltip.source}</p>
                <ul className="space-y-1">
                  {card.tooltip.bullets.map((b, i) => (
                    <li key={i} className="text-[11px] leading-relaxed">• {b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ExecutiveInsightPanel;
