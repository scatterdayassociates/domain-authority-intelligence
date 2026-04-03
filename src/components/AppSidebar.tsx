import { Layers, PlayCircle, Filter, BarChart2, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const modules = [
  { name: "Prompt Manager", icon: Layers, path: "/" },
  { name: "Execution", icon: PlayCircle, path: "/execution" },
  { name: "Parsing", icon: Filter, soon: true },
  { name: "Scoring Engine", icon: BarChart2, soon: true },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
                disabled={mod.soon}
                onClick={() => mod.path && navigate(mod.path)}
                className={`flex items-center gap-2 h-9 px-3 rounded-md text-sm w-full transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : mod.soon
                    ? "text-sidebar-foreground cursor-not-allowed"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <mod.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{mod.name}</span>
                {mod.soon && (
                  <span className="text-xs px-1.5 py-px rounded bg-[hsl(var(--status-soon-bg))] text-[hsl(var(--status-soon-fg))]">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

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
