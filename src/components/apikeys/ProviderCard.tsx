import { Plus } from "lucide-react";
import { ApiKey, ApiKeyStatus, Provider } from "@/lib/apiKeysMock";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusPill } from "./StatusPill";

interface Props {
  provider: Provider;
  keys: ApiKey[];
  role: "owner" | "analyst" | "viewer";
  onOpen: () => void;
  onAdd: () => void;
}

const rel = (iso?: string | null) => {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const abs = Math.abs(diff);
  const day = 86400000;
  if (abs < 3600000) return `${Math.round(abs / 60000)} min ${diff > 0 ? "ago" : "from now"}`;
  if (abs < day) return `${Math.round(abs / 3600000)} h ${diff > 0 ? "ago" : "from now"}`;
  return `${Math.round(abs / day)} d ${diff > 0 ? "ago" : "from now"}`;
};

const ProviderCard = ({ provider, keys, role, onOpen, onAdd }: Props) => {
  const activeKeys = keys.filter((k) => k.status === "ACTIVE");
  const enabledModelIds = new Set(activeKeys.flatMap((k) => k.enabledModelIds));

  let status: ApiKeyStatus | "MISSING";
  if (keys.length === 0) status = "MISSING";
  else if (activeKeys.length === 0) {
    if (keys.some((k) => k.status === "BLOCKED")) status = "BLOCKED";
    else if (keys.some((k) => k.status === "REVOKED")) status = "REVOKED";
    else status = "EXPIRED";
  } else status = "ACTIVE";

  const lastVerified = keys
    .map((k) => k.lastVerifiedAt)
    .filter(Boolean)
    .sort()
    .slice(-1)[0];

  const earliestRotation = keys
    .filter((k) => k.status !== "REVOKED")
    .map((k) => k.rotationDueAt)
    .sort()[0];

  const overdue = earliestRotation && new Date(earliestRotation).getTime() < Date.now();

  return (
    <div
      className="border rounded-md bg-card hover:border-slate-300 transition-colors cursor-pointer flex flex-col"
      onClick={onOpen}
    >
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
        <h3 className="text-base font-medium">{provider.label}</h3>
        <StatusPill status={status} />
      </div>

      <div className="px-4 pb-3 space-y-2 text-sm flex-1">
        {keys.length === 0 ? (
          <p className="text-xs text-muted-foreground leading-snug">
            No key configured. The {provider.models.length} {provider.label} models in the registry
            are unavailable in this tenant until a key is added.
          </p>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-xs text-slate-700 tabular-nums cursor-default">
                  <span className="font-medium">{enabledModelIds.size}</span>
                  <span className="text-muted-foreground"> of {provider.models.length} models enabled</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="text-xs font-mono">
                {provider.models.map((m) => m.label).join(" · ")}
              </TooltipContent>
            </Tooltip>

            <div className="text-xs text-muted-foreground tabular-nums">
              Last verified{" "}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-slate-700 cursor-default">{rel(lastVerified)}</span>
                </TooltipTrigger>
                <TooltipContent className="text-xs font-mono">{lastVerified ?? "never"}</TooltipContent>
              </Tooltip>
            </div>

            <div className="text-xs text-muted-foreground tabular-nums">
              Rotation due{" "}
              <span className={overdue ? "text-destructive font-medium" : "text-slate-700"}>
                {overdue
                  ? `overdue by ${Math.round((Date.now() - new Date(earliestRotation!).getTime()) / 86400000)} days`
                  : rel(earliestRotation)}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="border-t px-4 py-2 flex items-center justify-between text-xs">
        <span className="text-slate-700">View keys ({keys.length})</span>
        {role === "owner" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium"
          >
            <Plus className="w-3 h-3" /> Add key
          </button>
        ) : (
          <span className="text-muted-foreground">Read-only</span>
        )}
      </div>
    </div>
  );
};

export default ProviderCard;
