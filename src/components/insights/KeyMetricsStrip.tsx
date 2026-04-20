import { useState } from "react";
import { Globe, BarChart2, Target } from "lucide-react";
import type { InsightMode } from "@/pages/Insights";

interface Props {
  mode: InsightMode;
  onNavigate: (tab: string) => void;
  onOpenEvidence?: (statement: string) => void;
}

const Tooltip = ({ text }: { text: string }) => (
  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl max-w-[260px] w-[260px]">
    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45" />
    <p className="text-[11px] leading-relaxed">{text}</p>
  </div>
);

const KeyMetricsStrip = ({ mode, onNavigate, onOpenEvidence }: Props) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const showCompare = mode === "compare";

  const trigger = (statement: string, tab: string) => {
    if (onOpenEvidence) onOpenEvidence(statement);
    else onNavigate(tab);
  };

  return (
    <div className="grid grid-cols-3 gap-4 items-stretch">
      {/* Authority */}
      <div
        className="relative bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 cursor-pointer transition-all flex flex-col"
        onMouseEnter={() => setHovered("authority")}
        onMouseLeave={() => setHovered(null)}
        onClick={() => trigger("Authority: techradar.com persistence", "domain")}
      >
        <div className="flex justify-between items-start">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Authority</span>
          <Globe className="w-3.5 h-3.5 text-slate-300" />
        </div>
        <div className="mt-2 text-sm font-semibold font-mono text-slate-800">techradar.com</div>
        <div className="mt-1">
          <span className="inline-block bg-green-50 text-green-600 text-[11px] px-2 py-0.5 rounded-full">Publisher</span>
        </div>
        <div className="mt-3 space-y-1">
          <div className="flex justify-between">
            <span className="text-[11px] text-slate-400">Appears in</span>
            <span className="text-xs font-medium text-slate-700 tabular-nums">7 / 12 runs</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[11px] text-slate-400">Persistence</span>
            <span className="text-xs font-medium text-slate-700 tabular-nums">58.3%</span>
          </div>
        </div>
        {showCompare && (
          <div className="mt-3 text-[11px] text-slate-400">
            vs Apr 2026: Δ mentions −2 runs / persistence −8pp
          </div>
        )}
        <div className="border-t border-slate-100 mt-3 pt-2 mt-auto">
          <button
            className="text-[11px] text-teal-600 hover:underline"
            onClick={(e) => { e.stopPropagation(); onNavigate("domain"); }}
          >
            Domain Analysis →
          </button>
        </div>
        {hovered === "authority" && (
          <Tooltip text="Top domain by total mentions across all runs in this execution. Persistence = runs_appeared ÷ total_runs." />
        )}
      </div>

      {/* Concentration */}
      <div
        className="relative bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 cursor-pointer transition-all flex flex-col"
        onMouseEnter={() => setHovered("concentration")}
        onMouseLeave={() => setHovered(null)}
        onClick={() => trigger("Concentration: Moderate (HHI 0.245)", "structural")}
      >
        <div className="flex justify-between items-start">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Concentration</span>
          <BarChart2 className="w-3.5 h-3.5 text-slate-300" />
        </div>
        <div className="mt-2 text-sm font-semibold text-slate-800">Moderate</div>
        <div className="mt-1">
          <span className="inline-block bg-amber-50 text-amber-600 text-[11px] px-2 py-0.5 rounded-full">HHI 0.15–0.30</span>
        </div>
        <div className="mt-3 space-y-1">
          <div className="flex justify-between">
            <span className="text-[11px] text-slate-400">HHI</span>
            <span className="text-xs font-medium text-slate-700 tabular-nums">0.245</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[11px] text-slate-400">Top 5 Share</span>
            <span className="text-xs font-medium text-slate-700 tabular-nums">100%</span>
          </div>
        </div>
        {showCompare && (
          <div className="mt-3 text-[11px] text-slate-400">
            vs Apr 2026: HHI +0.012 / Top 5 Share: no change
          </div>
        )}
        <div className="border-t border-slate-100 mt-3 pt-2 mt-auto">
          <button
            className="text-[11px] text-teal-600 hover:underline"
            onClick={(e) => { e.stopPropagation(); onNavigate("structural"); }}
          >
            Structural View →
          </button>
        </div>
        {hovered === "concentration" && (
          <Tooltip text="HHI (Herfindahl Index) measures how domain visibility is distributed. < 0.15 = Fragmented · 0.15–0.30 = Moderate · > 0.30 = Concentrated." />
        )}
      </div>

      {/* Brand Inclusion */}
      <div
        className="relative bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 cursor-pointer transition-all flex flex-col"
        onMouseEnter={() => setHovered("brand")}
        onMouseLeave={() => setHovered(null)}
        onClick={() => trigger("Brand Inclusion: Dell at 75%", "brand")}
      >
        <div className="flex justify-between items-start">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Brand Inclusion</span>
          <Target className="w-3.5 h-3.5 text-slate-300" />
        </div>
        <div className="mt-2 text-sm font-semibold text-slate-800">Dell Technologies</div>
        <div className="mt-3 space-y-2">
          {[
            { name: "Dell", rate: "75%", pill: "bg-green-100 text-green-700", consistency: "High consistency" },
            { name: "Apple", rate: "50%", pill: "bg-amber-100 text-amber-700", consistency: "Medium consistency" },
            { name: "HP", rate: "33%", pill: "bg-slate-100 text-slate-600", consistency: "Low consistency" },
          ].map((b) => (
            <div key={b.name} className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-600">{b.name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-full ${b.pill}`}>{b.rate}</span>
                <span className="text-[11px] text-slate-400">{b.consistency}</span>
              </div>
            </div>
          ))}
        </div>
        {showCompare && (
          <div className="mt-3 text-[11px] text-slate-400">
            vs Apr 2026: Dell +15pp / Apple −8pp
          </div>
        )}
        <div className="border-t border-slate-100 mt-3 pt-2 mt-auto">
          <button
            className="text-[11px] text-teal-600 hover:underline"
            onClick={(e) => { e.stopPropagation(); onNavigate("brand"); }}
          >
            Brand Analysis →
          </button>
        </div>
        {hovered === "brand" && (
          <Tooltip text="Inclusion rate = runs containing brand domain ÷ total runs. Consistency tracks how evenly distributed those appearances are." />
        )}
      </div>
    </div>
  );
};

export default KeyMetricsStrip;
