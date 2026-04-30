import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import InsightTopBar from "@/components/insights/InsightTopBar";
import InsightTabs from "@/components/insights/InsightTabs";
import InsightDashboard from "@/components/insights/InsightDashboard";
import DomainAnalysisView from "@/components/insights/DomainAnalysisView";
import BrandAnalysisView from "@/components/insights/BrandAnalysisView";
import TimeSeriesView from "@/components/insights/TimeSeriesView";
import RawOutputView from "@/components/insights/RawOutputView";
import InsightEmptyState from "@/components/insights/InsightEmptyState";
import { ChevronRight } from "lucide-react";

export type InsightMode = "snapshot" | "compare" | "trends";

const Insights = () => {
  const [mode, setMode] = useState<InsightMode>("snapshot");
  const [activeTab, setActiveTab] = useState("dashboard");
  const hasExecutions = true; // mock: Dell context has executions

  const activeProject = "Dell — Laptops — US";
  const activeContext = "Best laptops for home office";

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        activeProject={activeProject}
        activeContext={activeContext}
        onContextClick={() => {}}
      />
      <div className="flex-1 ml-[220px] flex flex-col">
        {/* Header */}
        <header className="h-[52px] border-b border-border bg-background flex items-center px-6 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground">Insights</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Dell — Laptops — US</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground">{activeContext}</span>
          </div>
        </header>

        {/* Top Bar */}
        <InsightTopBar mode={mode} onModeChange={setMode} />

        {/* Tabs */}
        <InsightTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!hasExecutions ? (
            <InsightEmptyState />
          ) : activeTab === "dashboard" ? (
            <InsightDashboard mode={mode} onNavigateTab={setActiveTab} onModeChange={setMode} context={activeContext} />
          ) : activeTab === "domain" ? (
            <div className="px-6 py-6">
              <DomainAnalysisView context={activeContext} />
            </div>
          ) : activeTab === "brand" ? (
            <div className="px-6 py-6">
              <BrandAnalysisView context={activeContext} />
            </div>
          ) : activeTab === "timeseries" ? (
            <div className="px-6 py-6">
              <TimeSeriesView context={activeContext} />
            </div>
          ) : activeTab === "raw" ? (
            <div className="px-6 py-6">
              <RawOutputView context={activeContext} />
            </div>
          ) : (
            <div className="px-6 py-20 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <span className="text-slate-400 text-lg">✦</span>
              </div>
              <p className="font-medium text-slate-500">Coming soon</p>
              <p className="text-sm text-slate-400 mt-1">This view is under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;
