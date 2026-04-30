// Shared types for the Export Layer

export type ExportFormat = "csv" | "xlsx" | "json";
export type DataDepth = "summary_only" | "deep_included";
export type ExportSourceView =
  | "insight_dashboard"
  | "domain_analysis"
  | "brand_analysis"
  | "time_series"
  | "raw_output";

export interface ExportTableSpec {
  key: string;
  label: string;
  description?: string;
  mandatory?: boolean;
  depth?: "summary" | "deep";
  rows: () => Record<string, string | number | null>[];
}

export interface ExportContext {
  project_id: string;
  project_name: string;
  context_id: string;
  context_name: string;
  market: string;
  category: string;
  brand: string | null;
}

export interface ExecutionScope {
  execution_ids: string[];
  execution_timestamps: string[];
  execution_type: "single_execution" | "multi_execution";
  models: string[];
  prompt_pack_id: string;
  prompt_pack_version: string;
  prompt_count: number;
}

export interface ExportConfig {
  source_view: ExportSourceView;
  data_depth: DataDepth;
  format: ExportFormat;
  selected_tables: string[]; // table keys
  top_n?: number;
  applied_ui_filters?: Record<string, string | number | null>;
}

export interface ExportPayload {
  context: ExportContext;
  execution_scope: ExecutionScope;
  config: ExportConfig;
  tables: ExportTableSpec[];
  generated_by?: string;
}
