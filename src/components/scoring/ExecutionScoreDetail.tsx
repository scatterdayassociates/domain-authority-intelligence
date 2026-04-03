import { useState } from "react";
import { Download, GitCompare } from "lucide-react";
import DomainAuthorityTab from "./tabs/DomainAuthorityTab";
import CategorySummaryTab from "./tabs/CategorySummaryTab";
import BrandInclusionTab from "./tabs/BrandInclusionTab";
import ComparisonTab from "./tabs/ComparisonTab";

interface Props {
  executionId: string;
  onBack: () => void;
  onExport: () => void;
}

const stats = [
  { label: "Unique Domains", value: "24", delta: "+3 vs. prev run", deltaColor: "text-primary" },
  { label: "Top 5 Share", value: "68.4%", delta: "−2.8pp vs. prev run", deltaColor: "text-green-600" },
  { label: "HHI", value: "0.142", delta: "−0.019 vs. prev run", deltaColor: "text-green-600" },
  { label: "Inclusion Rate", value: "82%", delta: "+4pp vs. prev run", deltaColor: "text-green-600", valueColor: "text-green-600" },
];

const tabs = ["Domain Authority", "Category Summary", "Brand Inclusion", "Execution Comparison"] as const;
type Tab = typeof tabs[number];

const ExecutionScoreDetail = ({ executionId, onBack, onExport }: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>("Domain Authority");

  return (
    <div>
      {/* Context Header */}
      <div className="bg-muted/50 border border-border rounded-lg px-6 py-4 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap gap-6">
            {[
              ["Execution ID", executionId, true],
              ["Prompt Pack", "Dell — Laptops — US"],
              ["Version", "v3"],
              ["Model", "GPT-4o"],
              ["Scored At", "Apr 3, 2026 · 9:07 AM"],
            ].map(([label, value, mono]) => (
              <div key={label as string}>
                <div className="text-label mb-0.5">{label as string}</div>
                <div className={`text-sm text-foreground ${mono ? "font-mono" : ""}`}>{value as string}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={onExport} className="h-8 px-3 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted/50 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button onClick={onBack} className="h-8 px-3 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted/50">
              ← Back to list
            </button>
          </div>
        </div>
        <div className="flex gap-8 mt-4 pt-4 border-t border-border">
          {stats.map((s) => (
            <div key={s.label}>
              <div className={`text-2xl font-semibold tabular ${s.valueColor || "text-foreground"}`}>{s.value}</div>
              <div className="text-label mt-0.5">{s.label}</div>
              <div className={`text-xs mt-0.5 ${s.deltaColor}`}>{s.delta}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors flex items-center gap-1 ${
              activeTab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t === "Execution Comparison" && <GitCompare className="w-3 h-3" />}
            {t}
          </button>
        ))}
      </div>

      {activeTab === "Domain Authority" && <DomainAuthorityTab />}
      {activeTab === "Category Summary" && <CategorySummaryTab />}
      {activeTab === "Brand Inclusion" && <BrandInclusionTab />}
      {activeTab === "Execution Comparison" && <ComparisonTab />}
    </div>
  );
};

export default ExecutionScoreDetail;
