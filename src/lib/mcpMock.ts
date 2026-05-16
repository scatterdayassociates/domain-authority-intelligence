// Read-only MCP enrichment mock data.
// MCP context never alters scoring, parsing, or historical metrics.
// This module returns deterministic mock enrichment keyed by domain or brand.

export type McpScope = "domain" | "brand";

export interface McpProvenance {
  source: string;        // e.g. "techradar.com homepage", "Wikipedia", "Crunchbase"
  fetchedAt: string;     // ISO timestamp
  sourceType: "web" | "registry" | "platform" | "external_api";
}

export interface McpRelated {
  domain: string;
  relation: "owned" | "subdomain" | "related" | "competitor";
}

export interface McpSuggestedReview {
  kind: "competitor_candidate" | "mapping_gap" | "classification_ambiguity";
  label: string;
  confidence: "Low" | "Medium" | "High";
  explanation: string;
  routeLabel: string; // text link copy
}

export interface McpPlatformContext {
  runsAppeared?: number;
  totalRuns?: number;
  mentions?: number;
  avgPosition?: number;
  mentionShare?: number;
  firstSeen?: string;
  lastSeen?: string;
  compareNote?: string;
  trendNote?: string;
}

export interface McpContext {
  scope: McpScope;
  subject: string;          // domain or brand label
  canonical?: string;
  domainType?: "Publisher" | "Brand" | "Retail" | "Marketplace" | "Other";
  organization?: string;
  description?: string;
  homepage?: string;
  related: McpRelated[];
  platform: McpPlatformContext;
  suggestions: McpSuggestedReview[];
  provenance: McpProvenance[];
  partial?: boolean;
  empty?: boolean;
}

const NOW = "2026-05-15T09:12:00Z";

const DOMAINS: Record<string, Partial<McpContext>> = {
  "techradar.com": {
    canonical: "techradar.com",
    domainType: "Publisher",
    organization: "Future plc",
    homepage: "https://www.techradar.com",
    description:
      "Consumer technology publisher covering reviews, buying guides, and product comparisons. Editorially independent.",
    related: [
      { domain: "techradar.com/gaming", relation: "subdomain" },
      { domain: "techradar.com/pro", relation: "subdomain" },
      { domain: "tomsguide.com", relation: "related" },
    ],
    platform: {
      runsAppeared: 7,
      totalRuns: 12,
      mentions: 9,
      avgPosition: 1.6,
      mentionShare: 0.155,
      firstSeen: "2025-11",
      lastSeen: "2026-05",
      compareNote: "Present in both Apr 2026 and May 2026 executions.",
      trendNote: "Stable across the last 5 executions (persistence 58–62%).",
    },
    suggestions: [
      {
        kind: "classification_ambiguity",
        label: "Possible classification ambiguity",
        confidence: "Low",
        explanation:
          "Some subdomains (techradar.com/pro) skew B2B; consider reviewing whether subdomain-level classification is warranted.",
        routeLabel: "Review in Domain Registry",
      },
    ],
    provenance: [
      { source: "techradar.com homepage", sourceType: "web", fetchedAt: NOW },
      { source: "Wikipedia: TechRadar", sourceType: "web", fetchedAt: NOW },
      { source: "Platform Domain Registry", sourceType: "platform", fetchedAt: NOW },
    ],
  },
  "dell.com": {
    canonical: "dell.com",
    domainType: "Brand",
    organization: "Dell Technologies Inc.",
    homepage: "https://www.dell.com",
    description: "Brand-owned domain for Dell Technologies, covering consumer and commercial product lines.",
    related: [
      { domain: "delltechnologies.com", relation: "owned" },
      { domain: "alienware.com", relation: "owned" },
      { domain: "lenovo.com", relation: "competitor" },
    ],
    platform: {
      runsAppeared: 4,
      totalRuns: 12,
      mentions: 5,
      avgPosition: 2.4,
      mentionShare: 0.086,
      firstSeen: "2025-09",
      lastSeen: "2026-05",
      compareNote: "Rank improved from #8 to #5 between Apr → May.",
    },
    suggestions: [],
    provenance: [
      { source: "dell.com homepage", sourceType: "web", fetchedAt: NOW },
      { source: "Crunchbase: Dell Technologies", sourceType: "external_api", fetchedAt: NOW },
      { source: "Platform Domain Registry", sourceType: "platform", fetchedAt: NOW },
    ],
  },
  "lenovo.com": {
    canonical: "lenovo.com",
    domainType: "Brand",
    organization: "Lenovo Group Ltd.",
    description: "Brand-owned domain for Lenovo's global product lines.",
    related: [
      { domain: "thinkpad.com", relation: "owned" },
      { domain: "dell.com", relation: "competitor" },
    ],
    platform: {
      runsAppeared: 5,
      totalRuns: 12,
      mentions: 6,
      compareNote: "New entrant to Top 10 in May 2026.",
    },
    suggestions: [
      {
        kind: "mapping_gap",
        label: "Possible mapping gap",
        confidence: "Medium",
        explanation:
          "thinkpad.com is owned by Lenovo but does not appear in the project's brand→domain mapping.",
        routeLabel: "Review in Prompt Manager",
      },
    ],
    provenance: [
      { source: "lenovo.com homepage", sourceType: "web", fetchedAt: NOW },
      { source: "Platform Domain Registry", sourceType: "platform", fetchedAt: NOW },
    ],
    partial: true,
  },
};

const BRANDS: Record<string, Partial<McpContext>> = {
  "Dell Technologies": {
    canonical: "Dell Technologies",
    domainType: "Brand",
    organization: "Dell Technologies Inc.",
    description:
      "Multinational technology company offering laptops, desktops, servers, storage, and services across consumer and enterprise.",
    related: [
      { domain: "dell.com", relation: "owned" },
      { domain: "delltechnologies.com", relation: "owned" },
      { domain: "alienware.com", relation: "owned" },
    ],
    platform: {
      runsAppeared: 9,
      totalRuns: 12,
      mentionShare: 0.34,
      compareNote: "Inclusion improved +15pp vs Apr 2026.",
      trendNote: "Inclusion stable to rising across last 5 executions.",
    },
    suggestions: [
      {
        kind: "mapping_gap",
        label: "Possible mapping gap",
        confidence: "Medium",
        explanation:
          "alienware.com is owned by Dell Technologies but is not mapped to the target brand in this project.",
        routeLabel: "Review in Prompt Manager",
      },
    ],
    provenance: [
      { source: "delltechnologies.com homepage", sourceType: "web", fetchedAt: NOW },
      { source: "Wikipedia: Dell Technologies", sourceType: "web", fetchedAt: NOW },
    ],
  },
  Lenovo: {
    canonical: "Lenovo",
    domainType: "Brand",
    organization: "Lenovo Group Ltd.",
    description: "Chinese-American multinational, leading PC vendor by global market share.",
    related: [
      { domain: "lenovo.com", relation: "owned" },
      { domain: "thinkpad.com", relation: "owned" },
    ],
    platform: {
      runsAppeared: 8,
      totalRuns: 12,
      compareNote: "New entrant in May 2026 Top 10 by inclusion.",
    },
    suggestions: [
      {
        kind: "competitor_candidate",
        label: "Possible competitor candidate",
        confidence: "High",
        explanation:
          "Frequently co-surfaced with the target brand across runs in this context.",
        routeLabel: "Review in Prompt Manager",
      },
    ],
    provenance: [
      { source: "lenovo.com homepage", sourceType: "web", fetchedAt: NOW },
      { source: "Platform Domain Registry", sourceType: "platform", fetchedAt: NOW },
    ],
  },
};

const EMPTY: McpContext = {
  scope: "domain",
  subject: "",
  related: [],
  platform: {},
  suggestions: [],
  provenance: [],
  empty: true,
};

export const getMcpContext = (scope: McpScope, subject: string): McpContext => {
  const src = scope === "domain" ? DOMAINS[subject] : BRANDS[subject];
  if (!src) {
    return {
      ...EMPTY,
      scope,
      subject,
      platform: {},
      empty: true,
    };
  }
  return {
    scope,
    subject,
    related: [],
    platform: {},
    suggestions: [],
    provenance: [],
    ...src,
  } as McpContext;
};

export const countAdvisorySuggestions = (subjects: { scope: McpScope; subject: string }[]): number =>
  subjects.reduce((n, s) => n + getMcpContext(s.scope, s.subject).suggestions.length, 0);
