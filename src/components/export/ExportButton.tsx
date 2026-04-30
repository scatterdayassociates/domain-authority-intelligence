import { useMemo, useState } from "react";
import { Download, ChevronDown, FileSpreadsheet, FileJson, FileArchive } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { runExport } from "@/lib/export/exporter";
import type {
  DataDepth,
  ExecutionScope,
  ExportConfig,
  ExportContext,
  ExportFormat,
  ExportPayload,
  ExportSourceView,
  ExportTableSpec,
} from "@/lib/export/types";

interface ExportButtonProps {
  sourceView: ExportSourceView;
  context: ExportContext;
  scope: ExecutionScope;
  tablesBuilder: (opts: { topN: number }) => ExportTableSpec[];
  appliedUiFilters?: Record<string, string | number | null>;
  /** Tables for the simple "quick export" (defaults to all mandatory). */
  defaultDepth?: DataDepth;
  className?: string;
  label?: string;
}

const FORMAT_OPTIONS: { value: ExportFormat; label: string; icon: React.ElementType }[] = [
  { value: "csv", label: "CSV (.zip package)", icon: FileArchive },
  { value: "xlsx", label: "XLSX (multi-sheet)", icon: FileSpreadsheet },
  { value: "json", label: "JSON", icon: FileJson },
];

export const ExportButton = ({
  sourceView,
  context,
  scope,
  tablesBuilder,
  appliedUiFilters,
  defaultDepth = "summary_only",
  className,
  label = "Export",
}: ExportButtonProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [depth, setDepth] = useState<DataDepth>(defaultDepth);
  const [topN, setTopN] = useState(5);

  const allTables = useMemo(() => tablesBuilder({ topN }), [tablesBuilder, topN]);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(allTables.filter((t) => t.mandatory).map((t) => t.key)),
  );

  // Re-sync when topN changes only the underlying spec (selection persists).
  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const submit = async (cfg: ExportConfig) => {
    try {
      const payload: ExportPayload = {
        context,
        execution_scope: scope,
        config: cfg,
        tables: tablesBuilder({ topN: cfg.top_n ?? 5 }),
      };
      await runExport(payload);
      toast({ title: "Export ready", description: `Downloaded ${cfg.source_view} (${cfg.format.toUpperCase()})` });
    } catch (err) {
      toast({
        title: "Export failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const quickExport = () => {
    const tables = tablesBuilder({ topN: 5 });
    submit({
      source_view: sourceView,
      data_depth: "summary_only",
      format: "csv",
      selected_tables: tables.filter((t) => t.mandatory || t.depth !== "deep").map((t) => t.key),
      top_n: 5,
      applied_ui_filters: appliedUiFilters,
    });
  };

  const advancedExport = () => {
    setOpen(false);
    submit({
      source_view: sourceView,
      data_depth: depth,
      format,
      selected_tables: Array.from(selected),
      top_n: topN,
      applied_ui_filters: appliedUiFilters,
    });
  };

  return (
    <div className={`inline-flex items-stretch ${className ?? ""}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={quickExport}
        className="rounded-r-none border-r-0 gap-1.5"
      >
        <Download className="w-3.5 h-3.5" />
        {label}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="rounded-l-none px-2"
        aria-label="Advanced export options"
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Advanced export</DialogTitle>
            <DialogDescription>
              Configure scope, tables and format. Exports reflect the current view exactly — no
              additional aggregation or transformation is applied.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs space-y-0.5">
              <div className="text-muted-foreground">Scope (locked to current UI state)</div>
              <div><span className="text-muted-foreground">Context:</span> {context.context_name}</div>
              <div>
                <span className="text-muted-foreground">Executions:</span>{" "}
                {scope.execution_ids.length === 1
                  ? scope.execution_ids[0]
                  : `${scope.execution_ids.length} executions`}
              </div>
              <div>
                <span className="text-muted-foreground">Models:</span> {scope.models.join(", ")}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Data depth
              </Label>
              <Select value={depth} onValueChange={(v) => setDepth(v as DataDepth)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary_only">Summary only</SelectItem>
                  <SelectItem value="deep_included">Include deep data (run-level)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Format
                </Label>
                <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMAT_OPTIONS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Top N
                </Label>
                <Input
                  type="number"
                  min={3}
                  max={20}
                  value={topN}
                  onChange={(e) => setTopN(Math.max(3, Math.min(20, Number(e.target.value) || 5)))}
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Tables
              </Label>
              <div className="space-y-1.5 rounded-md border border-border p-3 max-h-56 overflow-y-auto">
                {allTables.map((t) => {
                  const isDeep = t.depth === "deep";
                  const disabled = t.mandatory || (isDeep && depth === "summary_only");
                  const checked = t.mandatory || selected.has(t.key);
                  return (
                    <label
                      key={t.key}
                      className={`flex items-start gap-2 text-sm ${
                        disabled && !t.mandatory ? "opacity-50" : ""
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={disabled}
                        onCheckedChange={() => toggle(t.key)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="font-mono text-xs">
                          {t.key}
                          {t.mandatory && (
                            <span className="ml-2 text-[10px] uppercase text-muted-foreground">
                              required
                            </span>
                          )}
                          {isDeep && (
                            <span className="ml-2 text-[10px] uppercase text-muted-foreground">
                              deep
                            </span>
                          )}
                        </div>
                        {t.description && (
                          <div className="text-xs text-muted-foreground">{t.description}</div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={advancedExport} className="gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Generate export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExportButton;
