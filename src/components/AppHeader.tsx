import { ChevronRight } from "lucide-react";

interface AppHeaderProps {
  status: "DRAFT" | "ACTIVE";
  onActivate: () => void;
  onDeactivate: () => void;
}

const AppHeader = ({ status, onActivate, onDeactivate }: AppHeaderProps) => {
  return (
    <header className="h-[52px] border-b border-border bg-background flex items-center justify-between px-6 flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">Prompt Manager</span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="font-medium text-foreground">Dell — Laptops — US</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        {status === "DRAFT" ? (
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[hsl(var(--status-draft-bg))] text-[hsl(var(--status-draft-fg))]">
            DRAFT
          </span>
        ) : (
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[hsl(var(--status-active-bg))] text-[hsl(var(--status-active-fg))]">
            ACTIVE
          </span>
        )}

        <button className="h-8 px-3 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors">
          Duplicate
        </button>
        <button className="h-8 px-3 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors">
          Import CSV
        </button>

        {status === "DRAFT" ? (
          <button
            onClick={onActivate}
            className="h-8 px-4 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            Activate Pack
          </button>
        ) : (
          <button
            onClick={onDeactivate}
            className="h-8 px-4 text-sm rounded-md border border-destructive text-destructive hover:bg-destructive/10 transition-colors font-medium"
          >
            Deactivate
          </button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
