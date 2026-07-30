export type ExecutionFamily = "Authority" | "Recommendation" | "Both";

export type FamilyStatus = "Completed" | "Failed" | "Running" | "Queued";

export interface FamilyBreakdown {
  family: "Authority" | "Recommendation";
  contract: "SOURCES" | "RECOMMENDED BRANDS";
  status: FamilyStatus;
  prompts: number;
  runs: number;
}

/** Per-execution family composition (mock). */
export const executionFamilies: Record<string, FamilyBreakdown[]> = {
  "EX-0329-001": [
    { family: "Authority", contract: "SOURCES", status: "Completed", prompts: 4, runs: 20 },
    { family: "Recommendation", contract: "RECOMMENDED BRANDS", status: "Completed", prompts: 3, runs: 15 },
  ],
  "EX-0322-002": [
    { family: "Authority", contract: "SOURCES", status: "Completed", prompts: 6, runs: 30 },
  ],
  "EX-0315-003": [
    { family: "Authority", contract: "SOURCES", status: "Completed", prompts: 5, runs: 25 },
  ],
  "EX-0401-004": [
    { family: "Authority", contract: "SOURCES", status: "Completed", prompts: 5, runs: 25 },
    { family: "Recommendation", contract: "RECOMMENDED BRANDS", status: "Completed", prompts: 3, runs: 15 },
  ],
  "EX-0328-005": [
    { family: "Authority", contract: "SOURCES", status: "Completed", prompts: 5, runs: 25 },
    { family: "Recommendation", contract: "RECOMMENDED BRANDS", status: "Failed", prompts: 3, runs: 15 },
  ],
  "EX-0403-006": [
    { family: "Recommendation", contract: "RECOMMENDED BRANDS", status: "Running", prompts: 10, runs: 50 },
  ],
  "EX-0403-007": [
    { family: "Authority", contract: "SOURCES", status: "Queued", prompts: 6, runs: 30 },
    { family: "Recommendation", contract: "RECOMMENDED BRANDS", status: "Queued", prompts: 4, runs: 20 },
  ],
  "EX-0402-008": [
    { family: "Authority", contract: "SOURCES", status: "Completed", prompts: 9, runs: 45 },
  ],
};

export const getFamilyBreakdown = (id: string): FamilyBreakdown[] =>
  executionFamilies[id] ?? [
    { family: "Authority", contract: "SOURCES", status: "Completed", prompts: 0, runs: 0 },
  ];

export const getFamilyLabel = (id: string): ExecutionFamily => {
  const rows = getFamilyBreakdown(id);
  const hasA = rows.some((r) => r.family === "Authority");
  const hasR = rows.some((r) => r.family === "Recommendation");
  if (hasA && hasR) return "Both";
  return hasR ? "Recommendation" : "Authority";
};

export const familyStyles: Record<ExecutionFamily, string> = {
  Authority: "bg-primary/10 text-primary",
  Recommendation: "bg-teal-500/10 text-teal-600",
  Both: "bg-muted text-foreground",
};

export const familyStatusStyles: Record<FamilyStatus, string> = {
  Completed: "bg-[hsl(var(--status-completed-bg))] text-[hsl(var(--status-completed-fg))]",
  Failed: "bg-[hsl(var(--status-failed-bg))] text-[hsl(var(--status-failed-fg))]",
  Running: "bg-[hsl(var(--status-running-bg))] text-[hsl(var(--status-running-fg))]",
  Queued: "bg-[hsl(var(--status-queued-bg))] text-[hsl(var(--status-queued-fg))]",
};
