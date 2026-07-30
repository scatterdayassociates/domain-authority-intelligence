import { useState } from "react";
import { GripVertical, Pencil, Trash2, Plus, AlertTriangle } from "lucide-react";
import SectionHeader from "./SectionHeader";

type Family = "authority" | "recommendation";

interface Prompt {
  label: string;
  text: string;
  kind: "core" | "variation";
}

const authorityPrompts: Prompt[] = [
  { label: "Best laptop search", text: "What are the best laptops for home office use in 2024? Please include a SOURCES section with HTTPS URLs.", kind: "core" },
  { label: "Budget laptop", text: "What laptops do you recommend under $800? Please include a SOURCES section with HTTPS URLs.", kind: "core" },
  { label: "Gaming laptop", text: "What are the top gaming laptops available right now? Include a SOURCES section with HTTPS URLs.", kind: "core" },
  { label: "Ultrabook comparison", text: "Compare the best thin and light laptops for business travel. Include a SOURCES section.", kind: "variation" },
  { label: "AI laptop features", text: "Which laptops have the best AI processing capabilities in 2024? Include a SOURCES section.", kind: "variation" },
];

const recommendationPrompts: Prompt[] = [
  { label: "Recommended brands", text: "Which laptop brands would you recommend for home office use? Return a RECOMMENDED BRANDS list, ranked.", kind: "core" },
  { label: "Budget brand picks", text: "Which laptop brands offer the best value under $800? Return a RECOMMENDED BRANDS list, ranked.", kind: "core" },
  { label: "Premium brand picks", text: "Which laptop brands lead the premium segment above $1500? Return a RECOMMENDED BRANDS list, ranked.", kind: "variation" },
];

const families: Record<Family, { label: string; version: string; contract: string; contractClass: string; prompts: Prompt[] }> = {
  authority: {
    label: "Authority Measurement",
    version: "Linked to 1 prompt pack · v3",
    contract: "SOURCES",
    contractClass: "bg-blue-50 text-blue-600",
    prompts: authorityPrompts,
  },
  recommendation: {
    label: "Brand Recommendation",
    version: "Linked to 1 prompt pack · v2",
    contract: "RECOMMENDED BRANDS",
    contractClass: "bg-teal-100 text-teal-700",
    prompts: recommendationPrompts,
  },
};

const MAX_PROMPTS = 7;

const PromptTable = () => {
  const [family, setFamily] = useState<Family>("authority");
  const active = families[family];
  const prompts = active.prompts;
  const core = prompts.filter((p) => p.kind === "core").length;
  const variation = prompts.length - core;
  const over = prompts.length > MAX_PROMPTS;

  return (
    <section>
      <SectionHeader
        title="Prompts"
        right={
          <>
            <span className="text-xs text-muted-foreground">{active.version}</span>
            <button className="h-7 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium inline-flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Prompt
            </button>
          </>
        }
      />

      {/* Family sub-tabs — each family has an independent list, contract and version */}
      <div className="flex items-center gap-1 mt-3 border-b border-border">
        {(Object.keys(families) as Family[]).map((key) => (
          <button
            key={key}
            onClick={() => setFamily(key)}
            className={`px-3 py-1.5 text-xs font-medium -mb-px border-b-2 transition-colors ${
              family === key
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {families[key].label}
            <span className="ml-1.5 text-[10px] text-muted-foreground tabular">{families[key].prompts.length}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="w-6" />
              <th className="table-header text-left py-2 w-10">#</th>
              <th className="table-header text-left py-2 w-[200px]">Label</th>
              <th className="table-header text-left py-2">Prompt Text</th>
              <th className="table-header text-left py-2 w-[170px]">Output Contract</th>
              <th className="table-header text-right py-2 w-[60px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((p, i) => (
              <tr
                key={`${family}-${i}`}
                className={`border-b border-border group hover:bg-primary/5 transition-colors ${
                  i % 2 === 1 ? "bg-muted/50" : ""
                }`}
              >
                <td className="py-2 pl-1">
                  <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 cursor-grab" />
                </td>
                <td className="py-2 tabular text-muted-foreground">{i + 1}</td>
                <td className="py-2 font-medium text-foreground">{p.label}</td>
                <td className="py-2 text-foreground max-w-0">
                  <p className="truncate pr-4">{p.text}</p>
                </td>
                <td className="py-2">
                  <span className={`text-[10px] font-mono rounded-full px-2 py-0.5 ${active.contractClass}`}>
                    {active.contract}
                  </span>
                </td>
                <td className="py-2 text-right">
                  <span className="inline-flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                    <button className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inline pack validation — warns when the family exceeds the pack limit */}
      <div
        className={`mt-2 text-xs inline-flex items-center gap-1.5 ${
          over ? "text-destructive font-medium" : "text-muted-foreground"
        }`}
      >
        {over && <AlertTriangle className="w-3.5 h-3.5" />}
        <span className="tabular">
          {prompts.length} of {MAX_PROMPTS} prompts · {core} core, {variation} variation
          {over && ` · exceeds pack limit of ${MAX_PROMPTS}`}
        </span>
      </div>

      <div>
        <button className="mt-2 text-sm text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add prompt row
        </button>
      </div>
    </section>
  );
};

export default PromptTable;
