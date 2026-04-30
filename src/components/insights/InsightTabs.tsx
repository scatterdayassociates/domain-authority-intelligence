import { LayoutDashboard, Globe, Target, TrendingUp } from "lucide-react";

const tabs = [
  { key: "dashboard", label: "Insight Dashboard", icon: LayoutDashboard },
  { key: "domain", label: "Domain Analysis", icon: Globe },
  { key: "brand", label: "Brand Analysis", icon: Target },
  { key: "timeseries", label: "Time Series", icon: TrendingUp },
];

interface InsightTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const InsightTabs = ({ activeTab, onTabChange }: InsightTabsProps) => (
  <div className="border-b border-border px-6 bg-background">
    <div className="flex">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`text-sm h-10 px-4 inline-flex items-center gap-2 cursor-pointer border-b-2 transition-colors ${
            activeTab === tab.key
              ? "text-primary font-medium border-primary"
              : "text-muted-foreground hover:text-foreground border-transparent"
          }`}
        >
          <tab.icon className="w-3.5 h-3.5" />
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

export default InsightTabs;
