import { useEffect, useState } from "react";
import { Eye, EyeOff, Info, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Provider, validateKeyFormat } from "@/lib/apiKeysMock";

interface Props {
  open: boolean;
  onClose: () => void;
  provider: Provider | null;
  mode?: "create" | "rotate";
  existingName?: string;
}

const AddKeyDrawer = ({ open, onClose, provider, mode = "create", existingName }: Props) => {
  const [name, setName] = useState("");
  const [secret, setSecret] = useState("");
  const [show, setShow] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [policy, setPolicy] = useState<"90" | "30" | "custom">("90");
  const [customDays, setCustomDays] = useState(60);
  const [orgId, setOrgId] = useState("");
  const [cap, setCap] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState<null | "saving" | "verifying">(null);
  const [formatWarn, setFormatWarn] = useState(false);

  useEffect(() => {
    if (!open) {
      setName(existingName ?? "");
      setSecret("");
      setShow(false);
      setModels([]);
      setPolicy("90");
      setCustomDays(60);
      setOrgId("");
      setCap("");
      setNotes("");
      setSubmitting(null);
      setFormatWarn(false);
    }
  }, [open, existingName]);

  if (!provider) return null;

  const orgLabel =
    provider.id === "openai"
      ? "ORGANIZATION / PROJECT ID"
      : provider.id === "gemini"
      ? "GCP PROJECT ID"
      : "ORGANIZATION ID (OPTIONAL)";

  const onSubmit = () => {
    if (!secret) return;
    const ok = validateKeyFormat(provider.id, secret);
    if (!ok && !formatWarn) {
      setFormatWarn(true);
      return;
    }
    setSubmitting("saving");
    setTimeout(() => setSubmitting("verifying"), 500);
    setTimeout(() => {
      setSecret("");
      setSubmitting(null);
      onClose();
    }, 1600);
  };

  const toggleModel = (id: string) =>
    setModels((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));

  const title =
    mode === "rotate" ? `Rotate ${provider.label} key` : `Add ${provider.label} key`;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[480px] sm:max-w-[480px] p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base">{title}</SheetTitle>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Stored in Secret Manager under tenant CMEK. Plaintext is never displayed after capture.
          </p>
        </SheetHeader>

        <TooltipProvider delayDuration={150}>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {mode === "create" && (
              <div>
                <label className="text-[11px] font-medium text-slate-600 tracking-wide">NAME</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={64}
                  placeholder="e.g. Production · gpt-4o"
                  className="mt-1 w-full h-9 px-3 text-sm border rounded-md bg-background"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Unique per provider in this workspace. 1–64 characters.
                </p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-slate-600 tracking-wide flex items-center gap-1">
                  API KEY
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[280px] text-xs">
                      Write-only secret. After save, the value is sent directly to Secret Manager and
                      cannot be re-displayed. {provider.keyFormatHint}.
                    </TooltipContent>
                  </Tooltip>
                </label>
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="text-[11px] text-slate-500 flex items-center gap-1 hover:text-slate-800"
                >
                  {show ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={show ? "text" : "password"}
                value={secret}
                onChange={(e) => {
                  setSecret(e.target.value);
                  setFormatWarn(false);
                }}
                placeholder={provider.keyFormatHint}
                className="mt-1 w-full h-9 px-3 text-sm font-mono border rounded-md bg-background"
              />
              {formatWarn && (
                <p className="text-[11px] text-amber-600 mt-1">
                  This doesn't match the expected {provider.label} key format. Click Save again to save anyway.
                </p>
              )}
            </div>

            {mode === "create" && (
              <div>
                <label className="text-[11px] font-medium text-slate-600 tracking-wide">MODELS</label>
                <p className="text-[11px] text-muted-foreground mt-0.5 mb-2">
                  Selected models become eligible in the New Execution form's MODELS picker.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {provider.models.map((m) => {
                    const on = models.includes(m.id);
                    return (
                      <Tooltip key={m.id}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => toggleModel(m.id)}
                            className={`h-7 px-2.5 text-xs rounded-full border transition-colors ${
                              on
                                ? "bg-teal-600 text-white border-teal-600"
                                : "bg-background border-border hover:bg-muted"
                            }`}
                          >
                            {m.label}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs font-mono">
                          {m.providerModelId} · {m.providerVersion}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            )}

            {mode === "create" && (
              <>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 tracking-wide">
                    ROTATION POLICY
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <select
                      value={policy}
                      onChange={(e) => setPolicy(e.target.value as "90" | "30" | "custom")}
                      className="h-9 px-2 text-sm border rounded-md bg-background"
                    >
                      <option value="90">90 days (platform default)</option>
                      <option value="30">30 days</option>
                      <option value="custom">Custom…</option>
                    </select>
                    {policy === "custom" && (
                      <input
                        type="number"
                        min={7}
                        max={365}
                        value={customDays}
                        onChange={(e) => setCustomDays(parseInt(e.target.value || "0", 10))}
                        className="h-9 w-24 px-2 text-sm border rounded-md bg-background tabular-nums"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 tracking-wide">
                    {orgLabel}
                  </label>
                  <input
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                    className="mt-1 w-full h-9 px-3 text-sm border rounded-md bg-background"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 tracking-wide flex items-center gap-1">
                    MONTHLY SPEND CAP (USD)
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[260px] text-xs">
                        Soft warning at 80%, hard block at 100%. Wires into the per-tenant LLM budget at the gateway.
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    value={cap}
                    onChange={(e) => setCap(e.target.value)}
                    placeholder="optional"
                    className="mt-1 w-full h-9 px-3 text-sm border rounded-md bg-background tabular-nums"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 tracking-wide">NOTES</label>
                  <textarea
                    value={notes}
                    maxLength={500}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 text-sm border rounded-md bg-background resize-none"
                  />
                </div>
              </>
            )}
          </div>
        </TooltipProvider>

        <div className="border-t px-6 py-3 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="h-8 px-3 text-sm border rounded-md hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!secret || submitting !== null}
            className="h-8 px-3 text-sm rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {submitting === "saving"
              ? "Saving…"
              : submitting === "verifying"
              ? `Verifying with ${provider.label}…`
              : mode === "rotate"
              ? "Save new version"
              : "Save & verify"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddKeyDrawer;
