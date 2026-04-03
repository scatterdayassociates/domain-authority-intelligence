import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import ScoringHeader from "@/components/scoring/ScoringHeader";
import ScoringOverview from "@/components/scoring/ScoringOverview";
import ExecutionScoreDetail from "@/components/scoring/ExecutionScoreDetail";
import ExecutionComparison from "@/components/scoring/ExecutionComparison";
import CsvExportPanel from "@/components/scoring/CsvExportPanel";
import { BarChart2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type ScoringView = "overview" | "detail" | "comparison";

const Scoring = () => {
  const [view, setView] = useState<ScoringView>("overview");
  const [selectedExId, setSelectedExId] = useState<string>("");
  const [exportOpen, setExportOpen] = useState(false);
  const navigate = useNavigate();

  const handleView = (exId: string) => {
    setSelectedExId(exId);
    setView("detail");
  };

  const breadcrumbLabel =
    view === "detail"
      ? selectedExId
      : view === "comparison"
      ? "Execution Comparison"
      : "All Scored Executions";

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 ml-[220px] flex flex-col">
        <ScoringHeader
          breadcrumbLabel={breadcrumbLabel}
          view={view}
          onViewChange={setView}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {view === "overview" && (
            <ScoringOverview
              onView={handleView}
              onExport={(id) => { setSelectedExId(id); setExportOpen(true); }}
              onCompare={() => setView("comparison")}
            />
          )}
          {view === "detail" && (
            <ExecutionScoreDetail
              executionId={selectedExId}
              onBack={() => setView("overview")}
              onExport={() => setExportOpen(true)}
            />
          )}
          {view === "comparison" && (
            <ExecutionComparison onBack={() => setView("overview")} />
          )}

          {/* Empty state */}
          {false && (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
              <BarChart2 className="w-10 h-10 text-muted-foreground/40" />
              <p className="font-medium text-muted-foreground">No scored executions yet</p>
              <p className="text-sm text-muted-foreground/70 max-w-xs text-center">
                Scoring runs automatically after parsing is complete. Complete at least one execution to see metrics here.
              </p>
              <button onClick={() => navigate("/execution")} className="mt-2 text-sm text-primary hover:underline flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Go to Execution
              </button>
            </div>
          )}
        </main>
      </div>
      <CsvExportPanel
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        executionId={selectedExId}
      />
    </div>
  );
};

export default Scoring;
