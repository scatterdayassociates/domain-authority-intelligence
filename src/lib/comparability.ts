// ─────────────────────────────────────────────────────────────────────────────
// Execution comparability guard
//
// Two or more executions may only be diffed (Compare mode) or plotted on a
// shared axis (Trends mode) when they share the same Context, Prompt Pack
// version, ranking depth, and scoring contract. When any axis differs the UI
// must refuse the comparison — values are never normalized, blended, or
// averaged across incompatible executions.
// ─────────────────────────────────────────────────────────────────────────────

export interface ExecutionMeta {
  id: string;
  label: string;
  context: string;
  promptPackVersion: string;
  rankingDepth: number;
  scoringContract: string;
}

export type ComparabilityAxis =
  | "context"
  | "promptPackVersion"
  | "rankingDepth"
  | "scoringContract";

export interface AxisMismatch {
  axis: ComparabilityAxis;
  /** Axis label shown in the banner detail list. */
  label: string;
  /** Distinct values observed, in execution order, e.g. ["v3 (Apr 2026)", "v4 (May 2026)"]. */
  values: string[];
}

export interface ComparabilityResult {
  comparable: boolean;
  mismatches: AxisMismatch[];
  /** Headline wording matching the highest-precedence mismatched axis. */
  headline: string | null;
  executions: ExecutionMeta[];
}

const AXIS_LABEL: Record<ComparabilityAxis, string> = {
  context: "Context",
  promptPackVersion: "Prompt Pack version",
  rankingDepth: "Ranking depth",
  scoringContract: "Scoring contract",
};

const AXIS_HEADLINE: Record<ComparabilityAxis, string> = {
  context: "Context mismatch prevents direct comparison",
  scoringContract: "Scoring contract mismatch detected",
  promptPackVersion: "Comparison unavailable due to Prompt Pack version mismatch",
  rankingDepth: "Comparison unavailable due to ranking depth mismatch",
};

// Precedence: the most structural axis wins the headline.
const AXIS_ORDER: ComparabilityAxis[] = [
  "context",
  "scoringContract",
  "promptPackVersion",
  "rankingDepth",
];

const axisValue = (e: ExecutionMeta, axis: ComparabilityAxis): string =>
  axis === "rankingDepth" ? `Top ${e.rankingDepth}` : String(e[axis]);

export function checkComparability(executions: ExecutionMeta[]): ComparabilityResult {
  const mismatches: AxisMismatch[] = [];

  if (executions.length >= 2) {
    for (const axis of AXIS_ORDER) {
      const values = Array.from(new Set(executions.map((e) => axisValue(e, axis))));
      if (values.length > 1) {
        mismatches.push({ axis, label: AXIS_LABEL[axis], values });
      }
    }
  }

  return {
    comparable: mismatches.length === 0,
    mismatches,
    headline: mismatches.length ? AXIS_HEADLINE[mismatches[0].axis] : null,
    executions,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock scenarios — demonstrate both the compatible and the warning state.
// ─────────────────────────────────────────────────────────────────────────────

const BASE: ExecutionMeta = {
  id: "EX-0329-001",
  label: "Apr 2026",
  context: "Best laptops for home office",
  promptPackVersion: "v3",
  rankingDepth: 10,
  scoringContract: "PDPE-2.1",
};

export type ScenarioKey =
  | "compatible"
  | "ranking-depth"
  | "scoring-contract"
  | "context"
  | "prompt-pack";

export interface Scenario {
  key: ScenarioKey;
  label: string;
  executions: ExecutionMeta[];
}

export const COMPARE_SCENARIOS: Scenario[] = [
  {
    key: "compatible",
    label: "Compatible executions",
    executions: [BASE, { ...BASE, id: "EX-0430-002", label: "May 2026" }],
  },
  {
    key: "ranking-depth",
    label: "Ranking depth mismatch",
    executions: [
      BASE,
      { ...BASE, id: "EX-0430-002", label: "May 2026", rankingDepth: 5 },
    ],
  },
  {
    key: "scoring-contract",
    label: "Scoring contract mismatch",
    executions: [
      BASE,
      { ...BASE, id: "EX-0430-002", label: "May 2026", scoringContract: "PDPE-3.0" },
    ],
  },
  {
    key: "context",
    label: "Context mismatch",
    executions: [
      BASE,
      {
        ...BASE,
        id: "EX-0430-009",
        label: "May 2026",
        context: "Best laptops for students",
      },
    ],
  },
];

export const TRENDS_SCENARIOS: Scenario[] = [
  {
    key: "compatible",
    label: "Compatible executions",
    executions: ["May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026"].map((label, i) => ({
      ...BASE,
      id: `EX-TS-00${i + 1}`,
      label,
    })),
  },
  {
    key: "prompt-pack",
    label: "Prompt Pack version mismatch",
    executions: ["May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026"].map((label, i) => ({
      ...BASE,
      id: `EX-TS-00${i + 1}`,
      label,
      promptPackVersion: i >= 3 ? "v4" : "v3",
    })),
  },
  {
    key: "ranking-depth",
    label: "Ranking depth mismatch",
    executions: ["May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026"].map((label, i) => ({
      ...BASE,
      id: `EX-TS-00${i + 1}`,
      label,
      rankingDepth: i >= 2 ? 5 : 10,
    })),
  },
];
