import type { InsightMode } from "@/pages/Insights";
import SectionHeader from "@/components/SectionHeader";
import ExecutiveInsightPanel from "./ExecutiveInsightPanel";
import KeyMetricsStrip from "./KeyMetricsStrip";

interface InsightDashboardProps {
  mode: InsightMode;
  onNavigateTab?: (tab: string) => void;
}

const PlaceholderBlock = ({ height, text }: { height: string; text: string }) => (
  <div className={`bg-slate-50 rounded-xl border-2 border-dashed border-border ${height} flex items-center justify-center text-sm text-muted-foreground`}>
    {text}
  </div>
);

const InsightDashboard = ({ mode, onNavigateTab }: InsightDashboardProps) => {
  const handleNavigate = (tab: string) => {
    // structural/movement live within dashboard sections; domain/brand are tabs
    if (tab === "domain" || tab === "brand") {
      onNavigateTab?.(tab);
    } else {
      // scroll to in-page section
      const el = document.getElementById(`insight-section-${tab}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const insightRightLabel =
    mode === "snapshot"
      ? "3 insights · May 2026"
      : mode === "compare"
      ? "4 insights · Apr → May 2026 delta"
      : "3 insights · Trend signals · May–Sep 2026";

  return (
  <div className="px-6 py-6 space-y-8">
    {/* A: Executive Insight Panel */}
    <div>
      <SectionHeader
        title="Executive Insight Panel"
        right={<span className="text-xs text-muted-foreground">{insightRightLabel}</span>}
      />
      <div className="mt-4">
        <ExecutiveInsightPanel mode={mode} onNavigate={handleNavigate} />
      </div>
    </div>

    {/* B: Key Metrics Strip */}
    <div>
      <SectionHeader
        title="Key Metrics"
        right={<span className="text-xs text-muted-foreground">Authority · Concentration · Brand Inclusion</span>}
      />
      <div className="mt-4">
        <KeyMetricsStrip mode={mode} onNavigate={handleNavigate} />
      </div>
    </div>

    {/* C: Time Series Panel */}
    <div>
      <SectionHeader
        title="Time Series"
        right={<span className="text-xs text-muted-foreground">Domain Trends · Brand Trends · Concentration</span>}
      />
      <div className="mt-4">
        <PlaceholderBlock height="h-64" text="Charts render here (Prompt 3)" />
      </div>
    </div>

    {/* D: Competitive Movement */}
    <div id="insight-section-movement">
      <SectionHeader
        title="Competitive Movement"
        right={
          mode === "compare" ? (
            <span className="text-xs text-muted-foreground">Entry / Exit / Rank Change</span>
          ) : (
            <span className="text-xs text-muted-foreground italic">Available in Compare mode</span>
          )
        }
      />
      <div className="mt-4">
        <PlaceholderBlock height="h-40" text="Entry / Exit / Rank Change (Prompt 3)" />
      </div>
    </div>

    {/* E: Structural View */}
    <div id="insight-section-structural">
      <SectionHeader
        title="Structural View"
        right={<span className="text-xs text-muted-foreground">Publisher vs Brand · Distribution</span>}
      />
      <div className="mt-4">
        <PlaceholderBlock height="h-36" text="Structural breakdown (Prompt 3)" />
      </div>
    </div>
  </div>
  );
};

export default InsightDashboard;
