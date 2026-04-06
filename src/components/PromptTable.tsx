import { GripVertical, Pencil, Trash2, Plus } from "lucide-react";
import SectionHeader from "./SectionHeader";

const prompts = [
  { label: "Best laptop search", text: "What are the best laptops for home office use in 2024? Please include a SOURCES section with HTTPS URLs." },
  { label: "Budget laptop", text: "What laptops do you recommend under $800? Please include a SOURCES section with HTTPS URLs." },
  { label: "Gaming laptop", text: "What are the top gaming laptops available right now? Include a SOURCES section with HTTPS URLs." },
  { label: "Ultrabook comparison", text: "Compare the best thin and light laptops for business travel. Include a SOURCES section." },
  { label: "AI laptop features", text: "Which laptops have the best AI processing capabilities in 2024? Include a SOURCES section." },
  { label: "Laptop for elderly", text: "What laptops are easiest to use for older adults? Include a SOURCES section." },
  { label: "Premium laptop", text: "What are the best premium laptops above $1500? Include a SOURCES section." },
];

const PromptTable = () => {
  return (
    <section>
      <SectionHeader
        title="Prompts"
        right={
          <>
            <span className="text-xs text-muted-foreground">{prompts.length} prompts</span>
            <button className="h-7 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium inline-flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Prompt
            </button>
          </>
        }
      />
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="w-6" />
              <th className="table-header text-left py-2 w-10">#</th>
              <th className="table-header text-left py-2 w-[200px]">Label</th>
              <th className="table-header text-left py-2">Prompt Text</th>
              <th className="table-header text-right py-2 w-[60px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((p, i) => (
              <tr
                key={i}
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
      <button className="mt-2 text-sm text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors">
        <Plus className="w-3.5 h-3.5" /> Add prompt row
      </button>
    </section>
  );
};

export default PromptTable;
