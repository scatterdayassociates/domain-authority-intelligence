import type { ExecutionScope, ExportTableSpec } from "./types";

const baseRow = (scope: ExecutionScope, idx = 0) => ({
  execution_id: scope.execution_ids[idx] ?? scope.execution_ids[0],
  execution_timestamp: scope.execution_timestamps[idx] ?? scope.execution_timestamps[0],
  model: scope.models[0] ?? "GPT-4o",
});

// ─── Insight Dashboard ──────────────────────────────────────────────────────
export const dashboardTables = (scope: ExecutionScope): ExportTableSpec[] => {
  const b = baseRow(scope);
  return [
    {
      key: "insight_summary",
      label: "insight_summary",
      description: "Executive insight statements",
      mandatory: true,
      depth: "summary",
      rows: () => [
        { ...b, insight_id: "ins_001", insight_type: "authority_persistence", related_entities: "techradar.com" },
        { ...b, insight_id: "ins_002", insight_type: "brand_inclusion", related_entities: "Dell" },
        { ...b, insight_id: "ins_003", insight_type: "concentration", related_entities: "category" },
      ],
    },
    {
      key: "key_metrics",
      label: "key_metrics",
      description: "High-level metric values shown in dashboard",
      mandatory: true,
      depth: "summary",
      rows: () => [
        { ...b, metric_name: "domain_authority_top", entity_type: "domain", entity: "techradar.com", metric_value: 0.583 },
        { ...b, metric_name: "brand_inclusion_rate", entity_type: "brand", entity: "Dell", metric_value: 0.667 },
        { ...b, metric_name: "hhi", entity_type: "category", entity: "laptops_us", metric_value: 0.142 },
        { ...b, metric_name: "top5_share", entity_type: "category", entity: "laptops_us", metric_value: 0.61 },
      ],
    },
  ];
};

// ─── Domain Analysis ────────────────────────────────────────────────────────
const DOMAINS = [
  { domain: "techradar.com", type: "publisher", mentions: 9, runs_appeared: 7, avg_position: 1.6, min_position: 1 },
  { domain: "pcmag.com", type: "publisher", mentions: 8, runs_appeared: 6, avg_position: 2.1, min_position: 1 },
  { domain: "rtings.com", type: "publisher", mentions: 6, runs_appeared: 5, avg_position: 2.8, min_position: 2 },
  { domain: "tomshardware.com", type: "publisher", mentions: 5, runs_appeared: 5, avg_position: 3.0, min_position: 2 },
  { domain: "dell.com", type: "brand", mentions: 5, runs_appeared: 4, avg_position: 2.4, min_position: 1 },
  { domain: "bestbuy.com", type: "retail", mentions: 4, runs_appeared: 4, avg_position: 3.6, min_position: 2 },
  { domain: "wired.com", type: "publisher", mentions: 4, runs_appeared: 3, avg_position: 3.2, min_position: 2 },
  { domain: "apple.com", type: "brand", mentions: 3, runs_appeared: 3, avg_position: 2.0, min_position: 1 },
  { domain: "engadget.com", type: "publisher", mentions: 3, runs_appeared: 3, avg_position: 4.0, min_position: 3 },
  { domain: "amazon.com", type: "retail", mentions: 3, runs_appeared: 2, avg_position: 4.5, min_position: 3 },
  { domain: "hp.com", type: "brand", mentions: 2, runs_appeared: 2, avg_position: 3.5, min_position: 2 },
  { domain: "theverge.com", type: "publisher", mentions: 2, runs_appeared: 2, avg_position: 4.0, min_position: 3 },
];

export const domainTables = (
  scope: ExecutionScope,
  opts: { topN?: number } = {},
): ExportTableSpec[] => {
  const b = baseRow(scope);
  const topN = opts.topN ?? 5;
  const ranked = [...DOMAINS].sort((a, b) => b.mentions - a.mentions);
  return [
    {
      key: "domain_summary",
      label: "domain_summary",
      description: "One row per domain per execution",
      mandatory: true,
      depth: "summary",
      rows: () =>
        ranked.map((d) => ({
          ...b,
          domain: d.domain,
          domain_type: d.type,
          total_mentions: d.mentions,
          runs_appeared: d.runs_appeared,
          avg_position: d.avg_position,
          min_position: d.min_position,
        })),
    },
    {
      key: "top_n_domains",
      label: "top_n_domains",
      description: `Top ${topN} ranked subset`,
      depth: "summary",
      rows: () =>
        ranked.slice(0, topN).map((d, i) => ({
          ...b,
          rank: i + 1,
          domain: d.domain,
          total_mentions: d.mentions,
        })),
    },
    {
      key: "domain_events",
      label: "domain_events",
      description: "One row per Domain Presence Event (run-level)",
      depth: "deep",
      rows: () => {
        const out: Record<string, string | number | null>[] = [];
        ranked.forEach((d) => {
          for (let i = 0; i < d.runs_appeared; i++) {
            out.push({
              ...b,
              prompt_id: `pp_q${(i % 4) + 1}`,
              run_id: `${scope.execution_ids[0]}_run_${d.domain.split(".")[0]}_${i + 1}`,
              domain: d.domain,
              position: d.avg_position,
            });
          }
        });
        return out;
      },
    },
  ];
};

// ─── Brand Analysis ─────────────────────────────────────────────────────────
const BRANDS = [
  { brand: "Dell", inclusion_rate: 0.667, runs_present: 8, total_mentions: 14 },
  { brand: "Apple", inclusion_rate: 0.583, runs_present: 7, total_mentions: 12 },
  { brand: "HP", inclusion_rate: 0.5, runs_present: 6, total_mentions: 9 },
  { brand: "Lenovo", inclusion_rate: 0.5, runs_present: 6, total_mentions: 8 },
  { brand: "Asus", inclusion_rate: 0.333, runs_present: 4, total_mentions: 5 },
  { brand: "Microsoft", inclusion_rate: 0.25, runs_present: 3, total_mentions: 4 },
  { brand: "Acer", inclusion_rate: 0.167, runs_present: 2, total_mentions: 2 },
  { brand: "Razer", inclusion_rate: 0.083, runs_present: 1, total_mentions: 1 },
];
const ATTRIBUTES = ["performance", "battery_life", "build_quality", "affordability", "display"];

export const brandTables = (
  scope: ExecutionScope,
  opts: { brandFilter?: string | null; attributeFilter?: string | null } = {},
): ExportTableSpec[] => {
  const b = baseRow(scope);
  const brands = opts.brandFilter ? BRANDS.filter((x) => x.brand === opts.brandFilter) : BRANDS;
  const attrs = opts.attributeFilter ? ATTRIBUTES.filter((a) => a === opts.attributeFilter) : ATTRIBUTES;
  return [
    {
      key: "brand_summary",
      label: "brand_summary",
      mandatory: true,
      depth: "summary",
      rows: () =>
        brands.map((x) => ({
          ...b,
          brand: x.brand,
          inclusion_rate: x.inclusion_rate,
          runs_present: x.runs_present,
          total_mentions: x.total_mentions,
        })),
    },
    {
      key: "narrative_attributes",
      label: "narrative_attributes",
      depth: "summary",
      rows: () => {
        const out: Record<string, string | number | null>[] = [];
        brands.forEach((x) => {
          attrs.forEach((a, i) => {
            out.push({ ...b, brand: x.brand, attribute: a, attribute_count: ((x.runs_present + i) % 7) + 1 });
          });
        });
        return out;
      },
    },
    {
      key: "brand_domain_mapping",
      label: "brand_domain_mapping",
      depth: "summary",
      rows: () => {
        const out: Record<string, string | number | null>[] = [];
        brands.forEach((x) => {
          ["techradar.com", "pcmag.com", "rtings.com"].forEach((d, i) => {
            out.push({ ...b, brand: x.brand, domain: d, mentions: Math.max(1, x.runs_present - i) });
          });
        });
        return out;
      },
    },
    {
      key: "narrative_attribution",
      label: "narrative_attribution",
      description: "Attribute occurrences linked back to runs",
      depth: "deep",
      rows: () => {
        const out: Record<string, string | number | null>[] = [];
        brands.forEach((x) => {
          attrs.forEach((a, i) => {
            out.push({
              ...b,
              brand: x.brand,
              attribute: a,
              prompt_id: `pp_q${(i % 4) + 1}`,
              run_id: `${scope.execution_ids[0]}_run_${x.brand.toLowerCase()}_${i + 1}`,
            });
          });
        });
        return out;
      },
    },
  ];
};

// ─── Time Series ────────────────────────────────────────────────────────────
export const timeSeriesTables = (scope: ExecutionScope): ExportTableSpec[] => {
  const perExec = scope.execution_ids.map((id, i) => ({
    execution_id: id,
    execution_timestamp: scope.execution_timestamps[i],
    model: scope.models[0] ?? "GPT-4o",
  }));

  return [
    {
      key: "domain_trends",
      label: "domain_trends",
      mandatory: true,
      depth: "summary",
      rows: () => {
        const out: Record<string, string | number | null>[] = [];
        perExec.forEach((e, i) => {
          DOMAINS.slice(0, 8).forEach((d) => {
            out.push({
              ...e,
              domain: d.domain,
              total_mentions: Math.max(1, d.mentions + ((i % 3) - 1)),
              runs_appeared: Math.max(1, d.runs_appeared + ((i % 2) - 1)),
            });
          });
        });
        return out;
      },
    },
    {
      key: "brand_trends",
      label: "brand_trends",
      mandatory: true,
      depth: "summary",
      rows: () => {
        const out: Record<string, string | number | null>[] = [];
        perExec.forEach((e, i) => {
          BRANDS.forEach((x) => {
            const drift = ((i % 3) - 1) * 0.05;
            out.push({
              ...e,
              brand: x.brand,
              inclusion_rate: Math.max(0, Math.min(1, +(x.inclusion_rate + drift).toFixed(3))),
              runs_present: Math.max(0, x.runs_present + ((i % 2) - 1)),
            });
          });
        });
        return out;
      },
    },
    {
      key: "category_trends",
      label: "category_trends",
      depth: "summary",
      rows: () =>
        perExec.map((e, i) => ({
          ...e,
          total_domains: 12 + (i % 3),
          top_5_share: +(0.58 + (i % 4) * 0.01).toFixed(3),
          hhi: +(0.14 + (i % 3) * 0.005).toFixed(3),
        })),
    },
    {
      key: "narrative_trends",
      label: "narrative_trends",
      description: "Per-attribute coverage rate per execution",
      depth: "summary",
      rows: () => {
        const out: Record<string, string | number | null>[] = [];
        perExec.forEach((e, i) => {
          ATTRIBUTES.forEach((a, j) => {
            out.push({
              ...e,
              attribute: a,
              coverage_rate: +(0.3 + ((i + j) % 5) * 0.07).toFixed(3),
            });
          });
        });
        return out;
      },
    },
  ];
};

// ─── Raw Output ─────────────────────────────────────────────────────────────
export const rawOutputTables = (scope: ExecutionScope): ExportTableSpec[] => {
  const b = baseRow(scope);
  return [
    {
      key: "domain_presence_events",
      label: "domain_presence_events",
      mandatory: true,
      depth: "deep",
      rows: () => {
        const out: Record<string, string | number | null>[] = [];
        DOMAINS.forEach((d) => {
          for (let i = 0; i < d.runs_appeared; i++) {
            out.push({
              ...b,
              prompt_id: `pp_q${(i % 4) + 1}`,
              run_id: `${scope.execution_ids[0]}_run_${d.domain.split(".")[0]}_${i + 1}`,
              response_id: `resp_${d.domain.split(".")[0]}_${i + 1}`,
              domain: d.domain,
              position: d.avg_position,
            });
          }
        });
        return out;
      },
    },
    {
      key: "runs",
      label: "runs",
      mandatory: true,
      depth: "deep",
      rows: () => {
        const out: Record<string, string | number | null>[] = [];
        for (let i = 1; i <= 12; i++) {
          out.push({
            ...b,
            run_id: `${scope.execution_ids[0]}_run_${i}`,
            prompt_id: `pp_q${((i - 1) % 4) + 1}`,
            status: "completed",
            response_id: `resp_${i}`,
          });
        }
        return out;
      },
    },
    {
      key: "raw_responses",
      label: "raw_responses",
      description: "Full model response bodies",
      depth: "deep",
      rows: () => {
        const out: Record<string, string | number | null>[] = [];
        for (let i = 1; i <= 12; i++) {
          out.push({
            ...b,
            run_id: `${scope.execution_ids[0]}_run_${i}`,
            response_id: `resp_${i}`,
            response_text:
              "For home office, leading reviews from techradar.com and pcmag.com recommend the Dell XPS 13 for its build quality and battery life. Apple's MacBook Air is also frequently cited.",
          });
        }
        return out;
      },
    },
  ];
};
