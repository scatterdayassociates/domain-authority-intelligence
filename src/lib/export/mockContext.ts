import type { ExportContext, ExecutionScope } from "./types";

export const DEFAULT_CONTEXT: ExportContext = {
  project_id: "prj_dell_laptops_us",
  project_name: "Dell — Laptops — US",
  context_id: "ctx_best_laptops_home_office",
  context_name: "Best laptops for home office",
  market: "US",
  category: "Laptops",
  brand: "Dell",
};

const ALL_EXECUTIONS = [
  { id: "exec_2026_01", ts: "2026-01-15T09:00:00Z" },
  { id: "exec_2026_02", ts: "2026-02-15T09:00:00Z" },
  { id: "exec_2026_03", ts: "2026-03-15T09:00:00Z" },
  { id: "exec_2026_04", ts: "2026-04-15T09:00:00Z" },
  { id: "exec_2026_05", ts: "2026-05-15T09:00:00Z" },
  { id: "exec_2026_06", ts: "2026-06-15T09:00:00Z" },
  { id: "exec_2026_07", ts: "2026-07-15T09:00:00Z" },
  { id: "exec_2026_08", ts: "2026-08-15T09:00:00Z" },
  { id: "exec_2026_09", ts: "2026-09-15T09:00:00Z" },
];

export const singleExecutionScope = (executionIdx = 4): ExecutionScope => {
  const e = ALL_EXECUTIONS[executionIdx];
  return {
    execution_ids: [e.id],
    execution_timestamps: [e.ts],
    execution_type: "single_execution",
    models: ["GPT-4o", "Claude 3.5"],
    prompt_pack_id: "pp_laptops_v3",
    prompt_pack_version: "3.1",
    prompt_count: 12,
  };
};

export const multiExecutionScope = (): ExecutionScope => ({
  execution_ids: ALL_EXECUTIONS.map((e) => e.id),
  execution_timestamps: ALL_EXECUTIONS.map((e) => e.ts),
  execution_type: "multi_execution",
  models: ["GPT-4o", "Claude 3.5"],
  prompt_pack_id: "pp_laptops_v3",
  prompt_pack_version: "3.1",
  prompt_count: 12,
});

export const ALL_EXECUTION_REFS = ALL_EXECUTIONS;
