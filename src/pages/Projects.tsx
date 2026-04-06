import { useState } from "react";
import ProjectHeader from "@/components/projects/ProjectHeader";
import ProjectList from "@/components/projects/ProjectList";
import ProjectDetail from "@/components/projects/ProjectDetail";
import NewProjectPanel from "@/components/projects/NewProjectPanel";
import AppSidebar from "@/components/AppSidebar";

const Projects = () => {
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);

  const handleOpenProject = (name: string) => {
    setSelectedProject(name);
    setView("detail");
  };

  const handleBack = () => {
    setView("list");
    setSelectedProject(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 ml-[220px]">
        <ProjectHeader
          view={view}
          projectName={selectedProject}
          onBack={handleBack}
          onNewProject={() => setShowNewProject(true)}
        />
        <main className="p-6">
          {view === "list" && (
            <ProjectList onOpenProject={handleOpenProject} />
          )}
          {view === "detail" && selectedProject && (
            <ProjectDetail projectName={selectedProject} />
          )}
        </main>
      </div>
      <NewProjectPanel
        open={showNewProject}
        onClose={() => setShowNewProject(false)}
      />
    </div>
  );
};

export default Projects;
