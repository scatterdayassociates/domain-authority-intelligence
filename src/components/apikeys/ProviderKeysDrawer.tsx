import { X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ApiKey, PROVIDERS, ProviderId } from "@/lib/apiKeysMock";
import { StatusPill } from "./StatusPill";

interface Props {
  open: boolean;
  providerId: ProviderId | null;
  keys: ApiKey[];
  onClose: () => void;
  onOpenKey: (k: ApiKey) => void;
  onAdd: () => void;
  role: "owner" | "analyst" | "viewer";
}

const rel = (iso?: string | null) => {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const day = 86400000;
  if (Math.abs(diff) < 3600000) return `${Math.round(Math.abs(diff) / 60000)} min ago`;
  if (Math.abs(diff) < day) return `${Math.round(Math.abs(diff) / 3600000)} h ago`;
  return `${Math.round(Math.abs(diff) / day)} d ${diff > 0 ? "ago" : "from now"}`;
};

const ProviderKeysDrawer = ({ open, providerId, keys, onClose, onOpenKey, onAdd, role }: Props) => {
  if (!providerId) return null;
  const provider = PROVIDERS.find((p) => p.id === providerId)!;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[480px] sm:max-w-[480px] p-0 flex flex-col">
        <div className="px-6 py-4 border-b flex items-start justify-between">
          <div>
            <h2 className="text-base font-medium">{provider.label} keys</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {keys.length} key{keys.length === 1 ? "" : "s"} configured · {provider.models.length} models in registry
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {keys.length === 0 && (
            <div className="px-6 py-10 text-sm text-muted-foreground text-center">
              No keys configured for {provider.label} in this workspace.
            </div>
          )}
          <div className="divide-y">
            {keys.map((k) => (
              <button
                key={k.id}
                onClick={() => onOpenKey(k)}
                className="w-full text-left px-6 py-3 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{k.name}</div>
                    <div className="text-[11px] text-muted-foreground tabular-nums mt-0.5">
                      {role === "owner" ? `····${k.last4}` : "redacted"} · {k.enabledModelIds.length} models · last verified {rel(k.lastVerifiedAt)}
                    </div>
                  </div>
                  <StatusPill status={k.status} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {role === "owner" && (
          <div className="border-t px-6 py-3 flex justify-end">
            <button
              onClick={onAdd}
              className="h-8 px-3 text-sm rounded-md bg-teal-600 text-white hover:bg-teal-700"
            >
              + Add key
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ProviderKeysDrawer;
