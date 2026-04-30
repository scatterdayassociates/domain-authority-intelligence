import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import RawOutputView from "@/components/insights/RawOutputView";
import { ChevronRight, ShieldCheck, Terminal } from "lucide-react";

const Validation = () => {
  const [activeTab, setActiveTab] = useState("raw");

  const activeProject = "Dell — Laptops — US";
  const activeContext = "Best laptops for home office";

  const tabs = [
    { key: "raw", label: "Raw Output", icon: Terminal },
  ];

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
            <span className="text-muted-foreground">Validation</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">{activeProject}</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground">{activeContext}</span>
          </div>
        </header>

        {/* Sub header / description */}
        <div className="px-6 pt-5 pb-3 bg-background border-b border-border">
          <h1 className="text-base font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Validation Layer
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-3xl">
            Verification surface for system outputs. Inspect unmodified LLM responses at the
            prompt/run level and trace every insight back to its originating source.
            Read-only · execution-bound · deterministic.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-border px-6 bg-background">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            <RawOutputView context={activeContext} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Validation;
