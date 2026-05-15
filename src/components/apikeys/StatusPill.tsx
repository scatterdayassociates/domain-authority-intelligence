import { ApiKeyStatus } from "@/lib/apiKeysMock";
import { cn } from "@/lib/utils";

const STYLES: Record<ApiKeyStatus | "MISSING", string> = {
  ACTIVE: "bg-teal-50 text-teal-700 border-teal-200",
  EXPIRED: "bg-destructive/10 text-destructive border-destructive/30",
  REVOKED: "bg-destructive/10 text-destructive border-destructive/30",
  BLOCKED: "bg-destructive/10 text-destructive border-destructive/30",
  OVERDUE_ROTATION: "bg-destructive/10 text-destructive border-destructive/30",
  MISSING: "bg-slate-100 text-slate-600 border-slate-200",
};

export const StatusPill = ({ status }: { status: ApiKeyStatus | "MISSING" }) => (
  <span
    className={cn(
      "inline-flex items-center h-5 px-2 rounded text-[11px] font-medium border tabular-nums tracking-wide",
      STYLES[status],
    )}
  >
    {status.replace("_", " ")}
  </span>
);
