export type ApiKeyStatus = "ACTIVE" | "EXPIRED" | "REVOKED" | "BLOCKED" | "OVERDUE_ROTATION";

export type ProviderId = "openai" | "anthropic" | "gemini" | "perplexity";

export interface ProviderModel {
  id: string;
  label: string;
  providerModelId: string;
  providerVersion: string;
}

export interface Provider {
  id: ProviderId;
  label: string;
  keyFormatHint: string;
  models: ProviderModel[];
}

export interface AuditRow {
  id: string;
  at: string;
  actor: string;
  action:
    | "CREATED"
    | "ROTATED"
    | "REVOKED"
    | "VERIFIED"
    | "VERIFICATION_FAILED"
    | "MODEL_SCOPE_CHANGED"
    | "POLICY_CHANGED";
  details: Record<string, unknown>;
}

export interface ApiKey {
  id: string;
  provider: ProviderId;
  name: string;
  last4: string;
  status: ApiKeyStatus;
  organizationId?: string | null;
  enabledModelIds: string[];
  rotationPolicyDays: number;
  monthlySpendCapUsd?: number | null;
  notes?: string;
  createdAt: string;
  createdBy: string;
  rotationDueAt: string;
  lastVerifiedAt?: string | null;
  lastVerificationCode?: string | null;
  lastUsedAt?: string | null;
  revokedAt?: string | null;
  monthlySpendUsdToDate: number;
  audit: AuditRow[];
}

export const PROVIDERS: Provider[] = [
  {
    id: "openai",
    label: "OpenAI",
    keyFormatHint: "Starts with sk- or sk-proj-, length ≥ 40",
    models: [
      { id: "gpt-4o", label: "gpt-4o", providerModelId: "gpt-4o", providerVersion: "2024-08-06" },
      { id: "gpt-4o-mini", label: "gpt-4o-mini", providerModelId: "gpt-4o-mini", providerVersion: "2024-07-18" },
      { id: "gpt-4-turbo", label: "gpt-4-turbo", providerModelId: "gpt-4-turbo", providerVersion: "2024-04-09" },
    ],
  },
  {
    id: "anthropic",
    label: "Anthropic",
    keyFormatHint: "Starts with sk-ant-, length ≥ 40",
    models: [
      { id: "claude-3-5-sonnet", label: "claude-3.5-sonnet", providerModelId: "claude-3-5-sonnet-20241022", providerVersion: "20241022" },
      { id: "claude-3-5-haiku", label: "claude-3.5-haiku", providerModelId: "claude-3-5-haiku-20241022", providerVersion: "20241022" },
    ],
  },
  {
    id: "gemini",
    label: "Google Gemini",
    keyFormatHint: "39-character alphanumeric (AIza…)",
    models: [
      { id: "gemini-1.5-pro", label: "gemini-1.5-pro", providerModelId: "gemini-1.5-pro", providerVersion: "002" },
      { id: "gemini-1.5-flash", label: "gemini-1.5-flash", providerModelId: "gemini-1.5-flash", providerVersion: "002" },
    ],
  },
  {
    id: "perplexity",
    label: "Perplexity",
    keyFormatHint: "Starts with pplx-, length ≥ 40",
    models: [
      { id: "sonar-large", label: "sonar-large", providerModelId: "llama-3.1-sonar-large-128k-online", providerVersion: "v1" },
      { id: "sonar-small", label: "sonar-small", providerModelId: "llama-3.1-sonar-small-128k-online", providerVersion: "v1" },
    ],
  },
];

export function validateKeyFormat(provider: ProviderId, value: string): boolean {
  if (!value) return false;
  switch (provider) {
    case "openai":
      return /^sk-(proj-)?[A-Za-z0-9_-]{30,}$/.test(value);
    case "anthropic":
      return /^sk-ant-[A-Za-z0-9_-]{30,}$/.test(value);
    case "gemini":
      return /^AIza[A-Za-z0-9_-]{35}$/.test(value);
    case "perplexity":
      return /^pplx-[A-Za-z0-9]{30,}$/.test(value);
  }
}

const now = Date.now();
const days = (n: number) => new Date(now + n * 86400000).toISOString();

export const MOCK_KEYS: ApiKey[] = [
  {
    id: "k_openai_prod",
    provider: "openai",
    name: "Production · gpt-4o",
    last4: "a91f",
    status: "ACTIVE",
    organizationId: "org-7Hx2KpL",
    enabledModelIds: ["gpt-4o", "gpt-4o-mini"],
    rotationPolicyDays: 90,
    monthlySpendCapUsd: 2500,
    notes: "Primary production credential. Owner: data platform team.",
    createdAt: days(-43),
    createdBy: "david.s@authority.ai",
    rotationDueAt: days(47),
    lastVerifiedAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
    lastVerificationCode: "200",
    lastUsedAt: new Date(now - 1000 * 60 * 22).toISOString(),
    monthlySpendUsdToDate: 1842.16,
    audit: [
      { id: "a1", at: new Date(now - 1000 * 60 * 60 * 3).toISOString(), actor: "system", action: "VERIFIED", details: { code: 200, models_listed: 47 } },
      { id: "a2", at: days(-10), actor: "david.s@authority.ai", action: "MODEL_SCOPE_CHANGED", details: { added: ["gpt-4o-mini"] } },
      { id: "a3", at: days(-43), actor: "david.s@authority.ai", action: "CREATED", details: { rotation_policy_days: 90 } },
    ],
  },
  {
    id: "k_openai_eval",
    provider: "openai",
    name: "Eval sandbox",
    last4: "0c2e",
    status: "OVERDUE_ROTATION",
    organizationId: "org-7Hx2KpL",
    enabledModelIds: ["gpt-4-turbo"],
    rotationPolicyDays: 30,
    monthlySpendCapUsd: 200,
    createdAt: days(-95),
    createdBy: "alex.r@authority.ai",
    rotationDueAt: days(-5),
    lastVerifiedAt: days(-2),
    lastVerificationCode: "200",
    lastUsedAt: days(-1),
    monthlySpendUsdToDate: 47.3,
    audit: [
      { id: "a4", at: days(-95), actor: "alex.r@authority.ai", action: "CREATED", details: {} },
    ],
  },
  {
    id: "k_anthropic_prod",
    provider: "anthropic",
    name: "Production · Claude 3.5",
    last4: "kq7r",
    status: "ACTIVE",
    enabledModelIds: ["claude-3-5-sonnet", "claude-3-5-haiku"],
    rotationPolicyDays: 90,
    monthlySpendCapUsd: 1500,
    createdAt: days(-21),
    createdBy: "david.s@authority.ai",
    rotationDueAt: days(69),
    lastVerifiedAt: new Date(now - 1000 * 60 * 60 * 11).toISOString(),
    lastVerificationCode: "200",
    lastUsedAt: new Date(now - 1000 * 60 * 90).toISOString(),
    monthlySpendUsdToDate: 612.4,
    audit: [
      { id: "a5", at: days(-21), actor: "david.s@authority.ai", action: "CREATED", details: {} },
    ],
  },
  {
    id: "k_perplexity_blocked",
    provider: "perplexity",
    name: "Research workspace",
    last4: "f3d8",
    status: "BLOCKED",
    enabledModelIds: ["sonar-large"],
    rotationPolicyDays: 90,
    createdAt: days(-60),
    createdBy: "maria.k@authority.ai",
    rotationDueAt: days(30),
    lastVerifiedAt: days(-1),
    lastVerificationCode: "401",
    lastUsedAt: days(-1),
    monthlySpendUsdToDate: 0,
    audit: [
      { id: "a6", at: days(-1), actor: "system", action: "VERIFICATION_FAILED", details: { code: 401, message: "unauthorized" } },
      { id: "a7", at: days(-60), actor: "maria.k@authority.ai", action: "CREATED", details: {} },
    ],
  },
];
