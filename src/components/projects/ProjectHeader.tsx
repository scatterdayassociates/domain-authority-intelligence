import { ChevronRight, Plus } from "lucide-react";

interface ProjectHeaderProps {
  view: "list" | "detail";
  projectName: string | null;
  onBack: () => void;
  onNewProject: () => void;
}

const ProjectHeader = ({ view, projectName, onBack, onNewProject }: ProjectHeaderProps) => (
  <header className="h-12 border-b border-border bg-background px-6 flex items-center justify-between sticky top-0 z-40">
    <div className="flex items-center gap-1.5 text-sm">
      <span
        className={`${view === "list" ? "text-slate-500" : "text-slate-500 cursor-pointer hover:text-slate-700"}`}
        onClick={view !== "list" ? onBack : undefined}
      >
        Projects
      </span>
      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
      {view === "list" && (
        <span className="font-medium text-slate-800">All Projects</span>
      )}
      {view === "detail" && projectName && (
        <span className="font-medium text-slate-800">{projectName}</span>
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
