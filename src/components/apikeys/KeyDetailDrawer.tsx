import { useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ApiKey, AuditRow, PROVIDERS, ProviderId } from "@/lib/apiKeysMock";
import { StatusPill } from "./StatusPill";

interface Props {
  open: boolean;
  apiKey: ApiKey | null;
  onClose: () => void;
  onBack: () => void;
  onRotate: () => void;
  role: "owner" | "analyst" | "viewer";
}

const fmt = (iso?: string | null) => (iso ? new Date(iso).toISOString().replace("T", " ").slice(0, 19) + "Z" : "—");
const rel = (iso?: string | null) => {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const abs = Math.abs(diff);
  const day = 86400000;
  if (abs < 3600000) return `${Math.round(abs / 60000)} min ${diff > 0 ? "ago" : "from now"}`;
  if (abs < day) return `${Math.round(abs / 3600000)} h ${diff > 0 ? "ago" : "from now"}`;
  return `${Math.round(abs / day)} d ${diff > 0 ? "ago" : "from now"}`;
};

const KeyDetailDrawer = ({ open, apiKey, onClose, onBack, onRotate, role }: Props) => {
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  if (!apiKey) return null;
  const provider = PROVIDERS.find((p) => p.id === apiKey.provider)!;
  const enabledModels = provider.models.filter((m) => apiKey.enabledModelIds.includes(m.id));
  const isOwner = role === "owner";

  const overdue = apiKey.status === "OVERDUE_ROTATION";

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent className="w-[480px] sm:max-w-[480px] p-0 flex flex-col">
          <div className="px-6 py-4 border-b flex items-start justify-between">
            <div>
              <button
                onClick={onBack}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-1"
              >
                <ChevronLeft className="w-3 h-3" /> All {provider.label} keys
              </button>
              <h2 className="text-base font-medium">{apiKey.name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {provider.label} · {isOwner ? `····${apiKey.last4}` : "··········"} · added{" "}
                {rel(apiKey.createdAt)} by {apiKey.createdBy}
              </p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <Field label="PROVIDER" value={provider.label} />
              <Field
                label="STATUS"
                value={<StatusPill status={apiKey.status} />}
              />
              <Field
                label="LAST 4"
                value={
                  <span className="font-mono tabular-nums">
                    {isOwner ? `····${apiKey.last4}` : "redacted"}
                  </span>
                }
              />
              <Field
                label="ROTATION POLICY"
                value={<span className="tabular-nums">{apiKey.rotationPolicyDays} days</span>}
              />
              <div className="col-span-2">
                <FieldLabel>MODELS ENABLED</FieldLabel>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {enabledModels.map((m) => (
                    <span
                      key={m.id}
                      className="h-6 px-2 inline-flex items-center text-xs border rounded-full bg-muted/50"
                    >
                      {m.label}
                    </span>
                  ))}
                </div>
              </div>
              <Field
                label={provider.id === "gemini" ? "GCP PROJECT ID" : "ORGANIZATION ID"}
                value={isOwner ? apiKey.organizationId || "—" : "redacted"}
              />
              <Field label="CREATED AT" value={<span className="tabular-nums">{fmt(apiKey.createdAt)}</span>} />
              <Field
                label="LAST VERIFIED AT"
                value={
                  <div>
                    <div className="tabular-nums">{fmt(apiKey.lastVerifiedAt)}</div>
                    {apiKey.lastVerificationCode && (
                      <div className="text-[11px] text-muted-foreground tabular-nums">
                        {apiKey.lastVerificationCode}
                      </div>
                    )}
                  </div>
                }
              />
              <Field
                label="ROTATION DUE AT"
                value={
                  <div className={overdue ? "text-destructive" : ""}>
                    <div className="tabular-nums">{fmt(apiKey.rotationDueAt)}</div>
                    <div className="text-[11px] tabular-nums">
                      {overdue
                        ? `(overdue by ${Math.abs(Math.round((Date.now() - new Date(apiKey.rotationDueAt).getTime()) / 86400000))} days)`
                        : `(${rel(apiKey.rotationDueAt)})`}
                    </div>
                  </div>
                }
              />
              <Field label="LAST USED AT" value={<span className="tabular-nums">{fmt(apiKey.lastUsedAt)}</span>} />
              <div className="col-span-2">
                <FieldLabel>MONTHLY SPEND THIS PERIOD</FieldLabel>
                {apiKey.monthlySpendCapUsd && isOwner ? (
                  <div className="mt-1">
                    <div className="text-sm tabular-nums">
                      ${apiKey.monthlySpendUsdToDate.toFixed(2)} /{" "}
                      <span className="text-muted-foreground">${apiKey.monthlySpendCapUsd.toFixed(2)}</span>
                    </div>
                    <div className="mt-1 h-1.5 bg-muted rounded overflow-hidden">
                      <div
                        className="h-full bg-teal-600"
                        style={{
                          width: `${Math.min(
                            100,
                            (apiKey.monthlySpendUsdToDate / apiKey.monthlySpendCapUsd) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 text-sm">{isOwner ? "—" : "redacted"}</div>
                )}
              </div>
              {apiKey.notes && (
                <div className="col-span-2">
                  <FieldLabel>NOTES</FieldLabel>
                  <p className="mt-1 text-sm text-slate-700">{apiKey.notes}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-[11px] font-medium text-slate-600 tracking-wide mb-2">
                RECENT ACTIVITY
              </h3>
              <div className="border rounded-md divide-y">
                {apiKey.audit.map((row) => (
                  <AuditItem
                    key={row.id}
                    row={row}
                    expanded={expanded === row.id}
                    onToggle={() => setExpanded(expanded === row.id ? null : row.id)}
                  />
                ))}
              </div>
              <button className="text-[11px] text-teal-700 hover:underline mt-2">
                View full history →
              </button>
            </div>
          </div>

          {isOwner && (
            <div className="border-t px-6 py-3 flex items-center justify-between gap-2">
              <button
                onClick={() => setRevokeOpen(true)}
                className="h-8 px-3 text-sm rounded-md text-destructive border border-destructive/30 hover:bg-destructive/5"
              >
                Revoke
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setVerifying(true);
                    setTimeout(() => setVerifying(false), 1200);
                  }}
                  className="h-8 px-3 text-sm border rounded-md hover:bg-muted"
                >
                  {verifying ? "Verifying…" : "Verify now"}
                </button>
                <button
                  onClick={onRotate}
                  className="h-8 px-3 text-sm rounded-md bg-teal-600 text-white hover:bg-teal-700"
                >
                  Rotate key
                </button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={revokeOpen} onOpenChange={setRevokeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke this key?</AlertDialogTitle>
            <AlertDialogDescription>
              All Secret Manager versions for this key will be disabled, in-flight worker tokens
              minted against it will be invalidated, and any execution dispatching against it will
              terminate with <span className="font-mono">NO_API_KEY</span>. Type the key name to
              confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={apiKey.name}
            className="h-9 px-3 text-sm border rounded-md bg-background w-full"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmName("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={confirmName !== apiKey.name}
              onClick={() => {
                setRevokeOpen(false);
                setConfirmName("");
                onClose();
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Revoke key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[11px] font-medium text-slate-600 tracking-wide">{children}</span>
);

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    <div className="mt-1 text-sm">{value}</div>
  </div>
);

const AuditItem = ({
  row,
  expanded,
  onToggle,
}: {
  row: AuditRow;
  expanded: boolean;
  onToggle: () => void;
}) => (
  <div className="px-3 py-2 text-xs">
    <button onClick={onToggle} className="w-full text-left flex items-center gap-3">
      <span className="tabular-nums text-muted-foreground w-[140px] shrink-0">
        {new Date(row.at).toISOString().slice(0, 16).replace("T", " ")}Z
      </span>
      <span className="text-slate-700 truncate flex-1">{row.actor}</span>
      <span className="font-mono text-[10px] uppercase text-slate-600">{row.action}</span>
    </button>
    {expanded && (
      <pre className="mt-2 text-[11px] bg-muted/50 rounded p-2 overflow-x-auto">
        {JSON.stringify(row.details, null, 2)}
      </pre>
    )}
  </div>
);

export default KeyDetailDrawer;
