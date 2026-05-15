import { useMemo, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppSidebar from "@/components/AppSidebar";
import ProviderCard from "@/components/apikeys/ProviderCard";
import AddKeyDrawer from "@/components/apikeys/AddKeyDrawer";
import KeyDetailDrawer from "@/components/apikeys/KeyDetailDrawer";
import ProviderKeysDrawer from "@/components/apikeys/ProviderKeysDrawer";
import { ApiKey, MOCK_KEYS, PROVIDERS, Provider, ProviderId } from "@/lib/apiKeysMock";

const ROLE: "owner" | "analyst" | "viewer" = "owner";

const ApiKeys = () => {
  const [keys] = useState<ApiKey[]>(MOCK_KEYS);
  const [providerOpen, setProviderOpen] = useState<ProviderId | null>(null);
  const [addOpen, setAddOpen] = useState<Provider | null>(null);
  const [rotateOpen, setRotateOpen] = useState<{ provider: Provider; name: string } | null>(null);
  const [detailKey, setDetailKey] = useState<ApiKey | null>(null);

  const keysByProvider = useMemo(() => {
    const m: Record<string, ApiKey[]> = {};
    PROVIDERS.forEach((p) => (m[p.id] = []));
    keys.forEach((k) => m[k.provider]?.push(k));
    return m;
  }, [keys]);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <div className="flex-1 ml-[220px]">
          <header className="h-12 border-b border-border bg-background px-6 flex items-center sticky top-0 z-40">
            <span className="text-sm font-medium text-slate-800">API Keys</span>
          </header>
          <main className="p-6 max-w-[1400px]">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-slate-900">API Keys</h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
                Encrypted credentials for the LLM providers Authority Intelligence dispatches against.
                Keys are stored in Secret Manager under tenant CMEK and are never displayed in
                plaintext after capture.
              </p>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              {PROVIDERS.map((p) => (
                <ProviderCard
                  key={p.id}
                  provider={p}
                  keys={keysByProvider[p.id] || []}
                  role={ROLE}
                  onOpen={() => setProviderOpen(p.id)}
                  onAdd={() => setAddOpen(p)}
                />
              ))}
            </div>
          </main>
        </div>

        <ProviderKeysDrawer
          open={providerOpen !== null && detailKey === null}
          providerId={providerOpen}
          keys={providerOpen ? keysByProvider[providerOpen] || [] : []}
          onClose={() => setProviderOpen(null)}
          onOpenKey={(k) => setDetailKey(k)}
          onAdd={() => {
            const p = PROVIDERS.find((x) => x.id === providerOpen);
            if (p) setAddOpen(p);
          }}
          role={ROLE}
        />

        <KeyDetailDrawer
          open={detailKey !== null}
          apiKey={detailKey}
          onClose={() => {
            setDetailKey(null);
            setProviderOpen(null);
          }}
          onBack={() => setDetailKey(null)}
          onRotate={() => {
            if (detailKey) {
              const p = PROVIDERS.find((x) => x.id === detailKey.provider)!;
              setRotateOpen({ provider: p, name: detailKey.name });
              setDetailKey(null);
            }
          }}
          role={ROLE}
        />

        <AddKeyDrawer
          open={addOpen !== null}
          provider={addOpen}
          onClose={() => setAddOpen(null)}
          mode="create"
        />

        <AddKeyDrawer
          open={rotateOpen !== null}
          provider={rotateOpen?.provider ?? null}
          existingName={rotateOpen?.name}
          onClose={() => setRotateOpen(null)}
          mode="rotate"
        />
      </div>
    </TooltipProvider>
  );
};

export default ApiKeys;
