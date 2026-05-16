import { useState } from "react";
import { Sparkles } from "lucide-react";
import McpContextDrawer from "./McpContextDrawer";
import type { McpScope } from "@/lib/mcpMock";

interface Props {
  scope: McpScope;
  subject: string;
  executionLabel?: string;
  variant?: "link" | "icon" | "chip";
  label?: string;
  className?: string;
}

const McpContextTrigger = ({
  scope,
  subject,
  executionLabel,
  variant = "link",
  label = "MCP context",
  className = "",
}: Props) => {
  const [open, setOpen] = useState(false);

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={onClick}
          title="Open read-only MCP context"
          className={`text-slate-400 hover:text-teal-600 inline-flex items-center ${className}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      ) : variant === "chip" ? (
        <button
          type="button"
          onClick={onClick}
          className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 ${className}`}
        >
          <Sparkles className="w-3 h-3 text-slate-400" />
          {label}
        </button>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className={`text-[11px] text-slate-500 hover:text-teal-600 hover:underline inline-flex items-center gap-0.5 ${className}`}
        >
          <Sparkles className="w-3 h-3" />
          {label}
        </button>
      )}
      <McpContextDrawer
        open={open}
        onOpenChange={setOpen}
        scope={scope}
        subject={subject}
        executionLabel={executionLabel}
      />
    </>
  );
};

export default McpContextTrigger;
