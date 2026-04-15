import { Zap } from "lucide-react";

const InsightEmptyState = () => (
  <div className="px-6 py-20 flex flex-col items-center justify-center text-center">
    <Zap className="w-10 h-10 text-muted-foreground/40 mb-3" />
    <p className="font-medium text-muted-foreground">No insights available</p>
    <p className="text-sm text-muted-foreground/70 mt-1">
      Run and score an execution for this context to generate insights.
    </p>
    <button className="mt-4 h-8 px-4 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
      Go to Execution →
    </button>
  </div>
);

export default InsightEmptyState;
