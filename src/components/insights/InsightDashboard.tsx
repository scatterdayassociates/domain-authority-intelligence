import { useState } from "react";
import type { InsightMode } from "@/pages/Insights";
import SectionHeader from "@/components/SectionHeader";
import ExecutiveInsightPanel from "./ExecutiveInsightPanel";
import KeyMetricsStrip from "./KeyMetricsStrip";
import TimeSeriesPanel from "./TimeSeriesPanel";
import CompetitiveMovement from "./CompetitiveMovement";
import StructuralView from "./StructuralView";
import DomainAnalysisView from "./DomainAnalysisView";
import EvidencePanel, { type EvidenceData } from "./EvidencePanel";

interface InsightDashboardProps {
  mode: InsightMode;
  onNavigateTab?: (tab: string) => void;
  onModeChange?: (m: InsightMode) => void;
  context?: string;
}

const sampleEvidence = (statement: string): EvidenceData => ({
  statement,
  metrics: [
    { metric: "Persistence", value: "58.3%", threshold: "≥ 50% → HIGH confidence" },
    { metric: "Mentions", value: "7 / 12 runs", threshold: "—" },
    { metric: "Execution scope", value: "May 2026", threshold: "—" },
  ],
  rule: "Rule triggered: Domain persistence ≥ 0.50 across ≥ 2 executions → 'consistently selected source'",
  domainEvents: [
    { runId: "run-003-a", prompt: "Best laptops for home office", position: "#2", model: "GPT-4o" },
    { runId: "run-005-b", prompt: "Best laptops for home office", position: "#1", model: "GPT-4o" },
    { runId: "run-007-c", prompt: "Best laptops for home office", position: "#3", model: "GPT-4o" },
    { runId: "run-009-a", prompt: "Best laptops for home office", position: "#2", model: "GPT-4o" },
  ],
  rawResponses: [
    {
      runLabel: "Run run-003-a · Best laptops for home office · GPT-4o",
      text: "For home office use, TechRadar consistently recommends the Dell XPS 13 as a top pick due to its build quality and performance. According to techradar.com, this model offers the best balance of portability and power for professionals.",
      highlight: "techradar",
    },
    {
      runLabel: "Run run-005-b · Best laptops for home office · GPT-4o",
      text: "Reviews from techradar.com and pcmag.com both highlight the importance of display quality. TechRadar specifically rates the Dell XPS series highly for its colour accuracy.",
      highlight: "techradar",
    },
  ],
});

const InsightDashboard = ({ mode, onNavigateTab, onModeChange, context = "Best laptops for home office" }: InsightDashboardProps) => {
  const [evidence, setEvidence] = useState<EvidenceData | null>(null);

  const handleNavigate = (tab: string) => {
    if (tab === "domain") {
      const el = document.getElementById("insight-section-domain-analysis");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (tab === "brand") {
      onNavigateTab?.(tab);
    } else {
      const el = document.getElementById(`insight-section-${tab}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const openEvidence = (statement: string) => setEvidence(sampleEvidence(statement));

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
          <ExecutiveInsightPanel mode={mode} onNavigate={handleNavigate} onOpenEvidence={openEvidence} />
        </div>
      </div>

      {/* B: Key Metrics Strip */}
      <div>
        <SectionHeader
          title="Key Metrics"
          right={<span className="text-xs text-muted-foreground">Authority · Concentration · Brand Inclusion</span>}
        />
        <div className="mt-4">
          <KeyMetricsStrip mode={mode} onNavigate={handleNavigate} onOpenEvidence={openEvidence} />
        </div>
      </div>

      {/* C: Time Series Panel */}
      <div>
        <SectionHeader
          title="Time Series"
          right={<span className="text-xs text-muted-foreground">Domain Trends · Brand Trends · Concentration</span>}
        />
        <div className="mt-4">
          <TimeSeriesPanel mode={mode} context={context} />
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
          <CompetitiveMovement mode={mode} onSwitchToCompare={() => onModeChange?.("compare")} context={context} />
        </div>
      </div>

      {/* E: Structural View */}
      <div id="insight-section-structural">
        <SectionHeader
          title="Structural View"
          right={<span className="text-xs text-muted-foreground">Publisher vs Brand · Distribution</span>}
        />
        <div className="mt-4">
          <StructuralView context={context} />
        </div>
      </div>

      <EvidencePanel open={!!evidence} data={evidence} onClose={() => setEvidence(null)} />
    </div>
  );
};

export default InsightDashboard;
