import { ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";

interface ParsingHeaderProps {
  view: "queue" | "detail" | "registry";
  executionId?: string;
  activeTab: "queue" | "registry";
  onTabChange: (tab: "queue" | "registry") => void;
  onBack: () => void;
}

const statusOptions = ["All Statuses", "Parsed", "Parsing", "Failed", "Pending"];
const packOptions = ["All Contexts", "Best laptops for home office", "Best noise cancelling headphones", "Best running shoes 2024"];

const ParsingHeader = ({ view, executionId, activeTab, onTabChange, onBack }: ParsingHeaderProps) => {
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [packFilter, setPackFilter] = useState("All Contexts");
  const [statusOpen, setStatusOpen] = useState(false);
  const [packOpen, setPackOpen] = useState(false);

  return (
    <header className="h-[52px] border-b border-border bg-background flex items-center justify-between px-6 flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
          Parsing
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        {view === "queue" && (
          <span className="font-medium text-foreground">All Parsing Jobs</span>
        )}
        {view === "registry" && (
          <span className="font-medium text-foreground">Domain Registry</span>
        )}
        {view === "detail" && executionId && (
          <>
            <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
              All Parsing Jobs
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground">{executionId}</span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        {(view === "queue" || view === "registry") && (
          <>
            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => { setStatusOpen(!statusOpen); setPackOpen(false); }}
                className="h-8 px-3 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
              >
                {statusFilter}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {statusOpen && (
                <div className="absolute right-0 top-9 bg-background border border-border rounded-md shadow-lg py-1 z-50 min-w-[140px]">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setStatusFilter(opt); setStatusOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-sm hover:bg-muted transition-colors ${
                        statusFilter === opt ? "text-primary font-medium" : "text-foreground"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pack Filter */}
            <div className="relative">
              <button
                onClick={() => { setPackOpen(!packOpen); setStatusOpen(false); }}
                className="h-8 px-3 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
              >
                {packFilter}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {packOpen && (
                <div className="absolute right-0 top-9 bg-background border border-border rounded-md shadow-lg py-1 z-50 min-w-[200px]">
                  {packOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setPackFilter(opt); setPackOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-sm hover:bg-muted transition-colors ${
                        packFilter === opt ? "text-primary font-medium" : "text-foreground"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tab switcher */}
            <div className="flex items-center gap-4 ml-2 border-l border-border pl-4">
              <button
                onClick={() => onTabChange("queue")}
                className={`text-sm pb-1 transition-colors ${
                  activeTab === "queue"
                    ? "font-medium text-foreground border-b-2 border-primary"
                    : "text-muted-foreground font-normal"
                }`}
              >
                Parsing Queue
              </button>
              <button
                onClick={() => onTabChange("registry")}
                className={`text-sm pb-1 transition-colors ${
                  activeTab === "registry"
                    ? "font-medium text-foreground border-b-2 border-primary"
                    : "text-muted-foreground font-normal"
                }`}
              >
                Domain Registry
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default ParsingHeader;
