import { ChevronRight, ChevronDown, Play } from "lucide-react";
import { useState } from "react";

interface ExecutionHeaderProps {
  view: "list" | "new" | "monitor" | "detail";
  executionId?: string;
  onNewExecution: () => void;
  onBack: () => void;
}

const statusOptions = ["All Statuses", "Queued", "Running", "Completed", "Failed"];
const contextOptions = ["All Contexts", "Best laptops for home office", "Best noise cancelling headphones", "Best running shoes 2024"];

const ExecutionHeader = ({ view, executionId, onNewExecution, onBack }: ExecutionHeaderProps) => {
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [packFilter, setPackFilter] = useState("All Contexts");
  const [statusOpen, setStatusOpen] = useState(false);
  const [packOpen, setPackOpen] = useState(false);

  return (
    <header className="h-[52px] border-b border-border bg-background flex items-center justify-between px-6 flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
          Execution
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        {view === "list" && (
          <span className="font-medium text-foreground">All Executions</span>
        )}
        {view === "new" && (
          <span className="font-medium text-foreground">New Execution</span>
        )}
        {view === "monitor" && (
          <>
            <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
              All Executions
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground">Live Monitor</span>
          </>
        )}
        {view === "detail" && executionId && (
          <>
            <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
              All Executions
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground">{executionId}</span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        {view === "list" && (
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

            {/* Context Filter */}
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
                  {contextOptions.map((opt) => (
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
          </>
        )}

        <button
          onClick={onNewExecution}
          className="h-8 px-4 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" />
          New Execution
        </button>
      </div>
    </header>
  );
};

export default ExecutionHeader;
