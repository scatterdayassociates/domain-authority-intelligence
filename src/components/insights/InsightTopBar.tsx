import { useState } from "react";
import { Camera, GitCompare, TrendingUp, ChevronDown, ArrowRight, Info, Download } from "lucide-react";
import type { InsightMode } from "@/pages/Insights";

interface InsightTopBarProps {
  mode: InsightMode;
  onModeChange: (mode: InsightMode) => void;
}

const modes = [
  { key: "snapshot" as const, label: "Snapshot", icon: Camera },
  { key: "compare" as const, label: "Compare", icon: GitCompare },
  { key: "trends" as const, label: "Trends", icon: TrendingUp },
];

const InsightTopBar = ({ mode, onModeChange }: InsightTopBarProps) => {
  const [showExport, setShowExport] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-20 bg-background border-b border-border px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          {/* LEFT: Context Identity */}
          <div className="flex items-center">
            <div>
              <div className="text-sm font-semibold text-foreground">Best laptops for home office</div>
              <div className="text-xs text-muted-foreground">Dell — Consumer Laptops — UK</div>
            </div>
            <div className="bg-border h-8 w-px mx-4" />
          </div>

          {/* CENTRE: Mode Selector + Controls */}
          <div className="flex items-center gap-3">
            {/* Segmented control */}
            <div className="bg-slate-100 rounded-lg p-1 flex gap-1">
              {modes.map((m) => (
                <button
                  key={m.key}
                  onClick={() => onModeChange(m.key)}
                  className={`text-xs font-medium h-7 px-3 rounded-md cursor-pointer flex items-center gap-1.5 transition-all ${
                    mode === m.key
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <m.icon className="w-3 h-3" />
                  {m.label}
                </button>
              ))}
            </div>

            {/* Mode-specific controls */}
            <div className="flex items-center gap-2">
              {mode === "snapshot" && (
                <div className="flex items-center gap-2 animate-in fade-in-50 duration-200">
                  <button className="bg-background border border-border rounded-md h-8 px-3 text-xs text-foreground flex items-center gap-2">
                    Execution: May 2026 <ChevronDown className="w-3 h-3" />
                  </button>
                  <span className="bg-slate-100 text-muted-foreground text-xs h-6 px-2 rounded-full inline-flex items-center">Point-in-time</span>
                </div>
              )}
              {mode === "compare" && (
                <div className="flex items-center gap-2 animate-in fade-in-50 duration-200">
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    title="Select the baseline execution to compare from"
                    className="group bg-background border border-border rounded-md h-9 pl-2 pr-2 text-xs text-foreground flex items-center gap-2 shadow-sm hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium leading-none">From execution</span>
                    <span className="font-medium leading-none">Apr 2026</span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    title="Select the target execution to compare to"
                    className="group bg-background border border-border rounded-md h-9 pl-2 pr-2 text-xs text-foreground flex items-center gap-2 shadow-sm hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium leading-none">To execution</span>
                    <span className="font-medium leading-none">May 2026</span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                  <span className="bg-slate-100 text-muted-foreground text-xs h-6 px-2 rounded-full inline-flex items-center">Δ Comparison</span>
                </div>
              )}
              {mode === "trends" && (
                <div className="flex items-center gap-2 animate-in fade-in-50 duration-200">
                  <button className="bg-background border border-border rounded-md h-8 px-3 text-xs text-foreground flex items-center gap-2">
                    May 2026 <ChevronDown className="w-3 h-3" />
                  </button>
                  <span className="text-muted-foreground text-xs">→</span>
                  <button className="bg-background border border-border rounded-md h-8 px-3 text-xs text-foreground flex items-center gap-2">
                    Sep 2026 <ChevronDown className="w-3 h-3" />
                  </button>
                  <span className="bg-slate-100 text-muted-foreground text-xs h-6 px-2 rounded-full inline-flex items-center">Time Series</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Metadata + Export */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="text-xs text-muted-foreground flex items-center gap-1.5 cursor-default"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Info className="w-3 h-3" />
                12 runs · GPT-4o · Apr 3, 2026
              </div>
              {showTooltip && (
                <div className="absolute top-full right-0 mt-1 bg-slate-800 text-white text-xs px-3 py-2 rounded-md shadow-lg whitespace-nowrap z-30">
                  Execution ID: EX-0329-001 · Prompt Pack v3 · 7 prompts × 5 runs = 35 total runs · Parsed: 35 of 35
                </div>
              )}
            </div>
            <div className="bg-border h-5 w-px" />
            <div className="relative">
              <button
                onClick={() => setShowExport(!showExport)}
                className="border border-border text-muted-foreground text-xs h-7 px-3 rounded-md flex items-center gap-1.5 hover:bg-muted transition-colors"
              >
                <Download className="w-3 h-3" />
                Export All
              </button>
              {showExport && (
                <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-md shadow-lg py-1 z-30 w-40">
                  {["Domain Data", "Brand Data", "Category Data", "Raw Responses", "All (ZIP)"].map((item) => (
                    <button
                      key={item}
                      className="w-full text-left text-xs text-foreground px-3 py-1.5 hover:bg-muted transition-colors"
                      onClick={() => setShowExport(false)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mode Status Indicator Card */}
      <div className="px-6 mt-3">
        {mode === "snapshot" && (
          <div className="rounded-md px-4 py-2 flex items-center gap-3 text-xs bg-slate-50 border border-border animate-in fade-in-50 duration-200">
            <Camera className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              Snapshot Mode — <span className="font-semibold text-foreground">Consumer Laptops (UK)</span> · Execution: May 2026 · View: Point-in-time
            </span>
          </div>
        )}
        {mode === "compare" && (
          <div className="rounded-md px-4 py-2 flex items-center gap-3 text-xs bg-amber-50 border border-amber-100 animate-in fade-in-50 duration-200">
            <GitCompare className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-amber-700">
              Compare Mode — <span className="font-semibold">Consumer Laptops (UK)</span> · Comparing: April 2026 → May 2026
            </span>
          </div>
        )}
        {mode === "trends" && (
          <div className="rounded-md px-4 py-2 flex items-center gap-3 text-xs bg-teal-50 border border-teal-100 animate-in fade-in-50 duration-200">
            <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-teal-700">
              Trends Mode — <span className="font-semibold">Consumer Laptops (UK)</span> · Time Range: May → September 2026
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default InsightTopBar;
