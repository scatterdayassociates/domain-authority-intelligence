import { useState } from "react";
import {
  Globe,
  Target,
  BarChart2,
  GitCompare,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import type { InsightMode } from "@/pages/Insights";

export type InsightType = "authority" | "brand" | "concentration" | "movement";
export type Confidence = "high" | "medium" | "low";

interface InsightCard {
  type: InsightType;
  confidence: Confidence;
  statement: string;
  metrics: { label: string; value: string }[];
  change?: { direction: "up" | "down" | "flat"; text: string };
  trendChange?: { direction: "up" | "down" | "flat"; text: string };
  evidenceTab: string;
  tooltip: { source: string; bullets: string[] };
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
    badgeLabel: "Brand Inclusion",
    icon: Target,
    link: "text-amber-600",
    border: "border-amber-200",
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
};

const confidencePill = (type: InsightType, conf: Confidence) => {
  if (conf === "low") return "bg-slate-100 text-slate-500";
  const high = conf === "high";
  switch (type) {
    case "authority":
      return high ? "bg-green-600 text-white" : "bg-green-100 text-green-700";
    case "brand":
      return high ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-700";
    case "concentration":
      return high ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700";
    case "movement":
      return high ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700";
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
        { label: "Persistence:", value: "58.3%" },
      ],
      change: { direction: "flat", text: "No change" },
      trendChange: { direction: "flat", text: "Stable over 5 executions" },
      evidenceTab: "domain",
      tooltip: {
        source: "Generated from: persistence (58.3%), runs_appeared (7/12)",
        bullets: [
          "Rule: Persistence ≥ 50% across 2+ executions",
          "Threshold met: 58.3% persistence",
          "Confidence basis: Consistent across all 3 executions in range",
        ],
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
      evidenceTab: "brand",
      tooltip: {
        source: "Generated from: inclusion_rate (75%), delta vs prior (+15pp)",
        bullets: [
          "Rule: Inclusion delta ≥ +10pp triggers movement signal",
          "Threshold met: +15pp shift",
          "Confidence basis: 2 consecutive executions confirming direction",
        ],
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

  const cards = mode === "compare" ? [...baseCards, movementCard] : baseCards;

  return (
    <div className="flex flex-wrap gap-4 items-stretch">
      {cards.map((card, idx) => {
        const style = TYPE_STYLES[card.type];
        const Icon = style.icon;
        const showRow4 = mode !== "snapshot" && (mode === "trends" ? card.trendChange : card.change);
        const dirData = mode === "trends" ? card.trendChange : card.change;

        return (
          <div
            key={idx}
            className={`relative rounded-xl border p-5 cursor-pointer hover:shadow-md transition-all duration-150 min-w-[280px] flex-1 max-w-[calc(25%-12px)] flex flex-col ${style.card}`}
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
                  <span className="text-[11px] text-slate-500">{m.label}</span>
                  <span className="text-xs font-semibold text-slate-700 tabular-nums">{m.value}</span>
                </div>
              ))}
            </div>

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
