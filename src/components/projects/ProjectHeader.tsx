import { ChevronRight, Plus } from "lucide-react";

interface ProjectHeaderProps {
  view: "list" | "detail" | "context";
  projectName: string | null;
  contextName?: string | null;
  onBack: () => void;
  onNewProject: () => void;
}

const ProjectHeader = ({ view, projectName, contextName, onBack, onNewProject }: ProjectHeaderProps) => (
  <header className="h-12 border-b border-border bg-background px-6 flex items-center justify-between sticky top-0 z-40">
    <div className="flex items-center gap-1.5 text-sm">
      <span
        className={`${view === "list" ? "font-medium text-slate-800" : "text-slate-500 cursor-pointer hover:text-slate-700"}`}
        onClick={view !== "list" ? onBack : undefined}
      >
        Projects
      </span>
      {view === "list" && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-800">All Projects</span>
        </>
      )}
      {(view === "detail" || view === "context") && projectName && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className={contextName ? "text-slate-500 cursor-pointer hover:text-slate-700" : "font-medium text-slate-800"}>
            {projectName}
          </span>
          {contextName && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-800 truncate max-w-[200px]">{contextName}</span>
            </>
          )}
        </>
      )}
    </div>
    {view === "list" && (
      <button
        onClick={onNewProject}
        className="flex items-center gap-1.5 bg-teal-600 text-white text-sm h-8 px-4 rounded-md hover:bg-teal-700 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        New Project
      </button>
    )}
  </header>
);

export default ProjectHeader;
