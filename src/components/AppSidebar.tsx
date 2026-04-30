import { Folder, Zap, Layers, PlayCircle, Filter, BarChart2, Settings, ShieldCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const modules = [
  { name: "Projects", icon: Folder, path: "/projects" },
  { name: "Insights", icon: Zap, path: "/insights" },
  { name: "Validation", icon: ShieldCheck, path: "/validation" },
  { name: "Prompt Manager", icon: Layers, path: "/" },
  { name: "Execution", icon: PlayCircle, path: "/execution" },
  { name: "Parsing", icon: Filter, path: "/parsing" },
  { name: "Scoring Engine", icon: BarChart2, path: "/scoring" },
];

const recentProjects = [
  { name: "Dell — Laptops (UK)", context: "Best laptops for home office", active: true },
  { name: "Sony — Headphones — UK", context: "Best noise cancelling headphones", active: false },
  { name: "Nike — Running — US", context: "Best running shoes 2024", active: false },
];

interface AppSidebarProps {
  activeProject?: string | null;
  activeContext?: string | null;
  onContextClick?: (contextName: string) => void;
}

const projectContexts: Record<string, { name: string; status: string }[]> = {
  "Dell — Laptops": [
    { name: "Best laptops for home office", status: "Active" },
    { name: "Best budget laptops under £800", status: "Draft" },
    { name: "Best gaming laptops 2024", status: "Draft" },
  ],
  "Sony — Headphones": [
    { name: "Best noise cancelling headphones", status: "Active" },
    { name: "Wireless earbuds for running", status: "Draft" },
  ],
  "Nike — Running": [
    { name: "Best running shoes 2024", status: "Active" },
    { name: "Trail running shoes comparison", status: "Active" },
  ],
};

const statusDotColor: Record<string, string> = {
  Active: "bg-teal-500",
  Draft: "bg-amber-400",
  Archived: "bg-slate-300",
};

const AppSidebar = ({ activeProject, activeContext, onContextClick }: AppSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Find matching project key for context display
  const projectKey = activeProject ? Object.keys(projectContexts).find(k => activeProject.includes(k)) : null;
  const contexts = projectKey ? projectContexts[projectKey] : [];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-sidebar flex flex-col z-50">
      {/* Logo */}
      <div className="px-4 pt-5 pb-2 flex items-center gap-2.5">
        <div className="w-6 h-6 rounded bg-primary flex-shrink-0" />
        <span className="text-sm font-semibold text-sidebar-primary-foreground">
          Authority Intelligence
        </span>
      </div>

      {/* Modules */}
      <div className="px-3 mt-4">
        <span className="text-label px-3 text-sidebar-muted">MODULES</span>
        <nav className="mt-2 flex flex-col gap-0.5">
          {modules.map((mod) => {
            const isActive = mod.path
              ? location.pathname === mod.path || (mod.path !== "/" && location.pathname.startsWith(mod.path))
              : false;

            return (
              <button
                key={mod.name}
                onClick={() => mod.path && navigate(mod.path)}
                className={`flex items-center gap-2 h-9 px-3 rounded-md text-sm w-full transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <mod.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{mod.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Current Project Context Nav */}
      {activeProject && contexts.length > 0 && (
        <div className="px-3 mt-4">
          <span className="text-xs text-slate-500 uppercase tracking-wide px-4 py-2 block">Current Project</span>
          <p className="text-sm text-slate-300 font-medium px-4 py-1 truncate">{activeProject}</p>
          <nav className="flex flex-col gap-0.5 mt-1">
            {contexts.map(ctx => (
              <button
                key={ctx.name}
                onClick={() => onContextClick?.(ctx.name)}
                className={`flex items-center gap-2 h-7 px-6 rounded-md text-sm w-full transition-colors mx-0 ${
                  activeContext === ctx.name
                    ? "bg-sidebar-accent text-white"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDotColor[ctx.status]}`} />
                <span className="truncate text-left flex-1">{ctx.name}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Recent Projects */}
      {!activeProject && (
        <div className="px-3 mt-4">
          <span className="text-xs text-slate-500 uppercase tracking-wide px-4 py-2 block">Recent Projects</span>
          <nav className="flex flex-col gap-0.5">
            {recentProjects.map((p) => (
              <button
                key={p.name}
                onClick={() => navigate("/projects")}
                className="flex items-start gap-2 px-4 py-1.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 w-full text-left mx-0"
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${p.active ? "bg-teal-500" : ""}`} />
                <div className="flex-1 min-w-0">
                  <span className="block truncate">{p.name}</span>
                  <span className="block text-xs text-slate-400 truncate">Context: {p.context}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* User */}
      <div className="mt-auto px-3 pb-4">
        <div className="border-t border-sidebar-border mb-3" />
        <div className="flex items-center gap-2.5 px-3">
          <div className="w-7 h-7 rounded-full bg-sidebar-foreground/30 flex-shrink-0" />
          <span className="text-sm text-sidebar-foreground flex-1">David S.</span>
          <Settings className="w-4 h-4 text-sidebar-muted" />
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
