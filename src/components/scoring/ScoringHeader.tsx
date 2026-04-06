import { ChevronRight, ChevronDown } from "lucide-react";
import type { ScoringView } from "@/pages/Scoring";

interface Props {
  breadcrumbLabel: string;
  view: ScoringView;
  onViewChange: (v: ScoringView) => void;
}

const ScoringHeader = ({ breadcrumbLabel, view, onViewChange }: Props) => (
  <header className="h-[52px] bg-background border-b border-border px-6 flex items-center justify-between flex-shrink-0">
    <div className="flex items-center gap-1.5 text-sm">
      <span className="text-muted-foreground">Scoring Engine</span>
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="font-medium text-foreground">{breadcrumbLabel}</span>
    </div>
    <div className="flex items-center gap-3">
      <button className="h-8 px-3 text-sm rounded-md border border-border text-muted-foreground bg-background hover:bg-muted/50 flex items-center gap-1.5">
        All Contexts <ChevronDown className="w-3.5 h-3.5" />
      </button>
      <button className="h-8 px-3 text-sm rounded-md border border-border text-muted-foreground bg-background hover:bg-muted/50 flex items-center gap-1.5">
        All Models <ChevronDown className="w-3.5 h-3.5" />
      </button>
      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={() => onViewChange("overview")}
          className={`text-sm pb-1 ${view === "overview" || view === "detail" ? "text-foreground font-medium border-b-2 border-primary" : "text-muted-foreground"}`}
        >
          Scored Executions
        </button>
        <button
          onClick={() => onViewChange("comparison")}
          className={`text-sm pb-1 ml-3 ${view === "comparison" ? "text-foreground font-medium border-b-2 border-primary" : "text-muted-foreground"}`}
        >
          Comparison
        </button>
      </div>
    </div>
  </header>
);

export default ScoringHeader;
