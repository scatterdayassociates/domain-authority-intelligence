import JSZip from "jszip";
import type { ExportPayload, ExportTableSpec } from "./types";

const escapeCsv = (cell: unknown): string => {
  if (cell === null || cell === undefined) return "";
  const s = String(cell);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const tableToCsv = (rows: Record<string, string | number | null>[]): string => {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const head = headers.join(",");
  const body = rows.map((r) => headers.map((h) => escapeCsv(r[h])).join(",")).join("\n");
  return `${head}\n${body}`;
};

const buildMetadataObject = (payload: ExportPayload) => {
  const { context, execution_scope, config } = payload;
  const timestamps = execution_scope.execution_timestamps;
  return {
    project_id: context.project_id,
    project_name: context.project_name,
    context_id: context.context_id,
    context_name: context.context_name,
    market: context.market,
    category: context.category,
    brand: context.brand,
    execution_ids: execution_scope.execution_ids.join("|"),
    execution_count: execution_scope.execution_ids.length,
    execution_timestamps: timestamps.join("|"),
    execution_type: execution_scope.execution_type,
    time_range_start: timestamps[0] ?? "",
    time_range_end: timestamps[timestamps.length - 1] ?? "",
    models: execution_scope.models.join("|"),
    model_count: execution_scope.models.length,
    prompt_pack_id: execution_scope.prompt_pack_id,
    prompt_pack_version: execution_scope.prompt_pack_version,
    prompt_count: execution_scope.prompt_count,
    export_type: config.source_view,
    source_view: config.source_view,
    included_tables: config.selected_tables.join("|"),
    data_depth: config.data_depth,
    file_format: config.format,
    export_generated_at: new Date().toISOString(),
    generated_by: payload.generated_by ?? "ui_user",
    export_version: "1.0.0",
    applied_ui_filters: config.applied_ui_filters
      ? Object.entries(config.applied_ui_filters)
          .map(([k, v]) => `${k}=${v ?? ""}`)
          .join("|")
      : "",
  };
};

const metadataToCsv = (payload: ExportPayload): string => {
  const md = buildMetadataObject(payload);
  const rows = Object.entries(md).map(([field, value]) => ({ field, value: value ?? "" }));
  return tableToCsv(rows as Record<string, string | number | null>[]);
};

export const buildFileBaseName = (payload: ExportPayload) => {
  const safe = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const project = safe(payload.context.project_name);
  const context = safe(payload.context.context_name);
  const execId =
    payload.execution_scope.execution_ids.length === 1
      ? payload.execution_scope.execution_ids[0]
      : `${payload.execution_scope.execution_ids[0]}_to_${
          payload.execution_scope.execution_ids[payload.execution_scope.execution_ids.length - 1]
        }`;
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  return `${project}_${context}_${execId}_${payload.config.source_view}_${ts}`;
};

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const selectedTables = (payload: ExportPayload): ExportTableSpec[] => {
  const wanted = new Set(payload.config.selected_tables);
  return payload.tables.filter((t) => {
    if (t.mandatory) return true;
    if (!wanted.has(t.key)) return false;
    if (payload.config.data_depth === "summary_only" && t.depth === "deep") return false;
    return true;
  });
};

export const runExport = async (payload: ExportPayload): Promise<void> => {
  const tables = selectedTables(payload);
  const base = buildFileBaseName(payload);

  if (payload.config.format === "json") {
    const out = {
      metadata: buildMetadataObject(payload),
      tables: Object.fromEntries(tables.map((t) => [t.key, t.rows()])),
    };
    triggerDownload(
      new Blob([JSON.stringify(out, null, 2)], { type: "application/json" }),
      `${base}.json`,
    );
    return;
  }

  // CSV → ZIP package (metadata + one file per table)
  const zip = new JSZip();
  zip.file("export_metadata.csv", metadataToCsv(payload));
  for (const t of tables) {
    zip.file(`${t.key}.csv`, tableToCsv(t.rows()));
  }
  // README for clarity
  zip.file(
    "README.txt",
    [
      `Export package: ${base}`,
      `Source view: ${payload.config.source_view}`,
      `Execution(s): ${payload.execution_scope.execution_ids.join(", ")}`,
      `Tables: ${tables.map((t) => t.key).join(", ")}`,
      "",
      "See export_metadata.csv for full context.",
    ].join("\n"),
  );

  if (payload.config.format === "xlsx") {
    // XLSX delivered as multi-sheet inside the ZIP via simple SpreadsheetML fallback is heavy;
    // we instead include a hint and the same CSV files for now.
    zip.file(
      "FORMAT_NOTE.txt",
      "XLSX format requested. CSV equivalents are provided in this package; open and combine sheets in Excel.",
    );
  }

  const blob = await zip.generateAsync({ type: "blob" });
  triggerDownload(blob, `${base}.zip`);
};
