import { useState, useCallback } from "react";
import AppSidebar from "@/components/AppSidebar";
import ParsingHeader from "@/components/parsing/ParsingHeader";
import ParsingQueue from "@/components/parsing/ParsingQueue";
import ExecutionParseDetail from "@/components/parsing/ExecutionParseDetail";
import DomainRegistry from "@/components/parsing/DomainRegistry";

type View = "queue" | "detail" | "registry";

const Parsing = () => {
  const [view, setView] = useState<View>("queue");
  const [selectedId, setSelectedId] = useState("");

  const handleViewExecution = useCallback((id: string) => {
    setSelectedId(id);
    setView("detail");
  }, []);

  const handleBack = useCallback(() => {
    setView("queue");
    setSelectedId("");
  }, []);

  const handleTabChange = useCallback((tab: "queue" | "registry") => {
    if (tab === "registry") {
      setView("registry");
      setSelectedId("");
    } else {
      setView("queue");
      setSelectedId("");
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="ml-[220px] flex-1 flex flex-col min-h-screen">
        <ParsingHeader
          view={view}
          executionId={selectedId}
          activeTab={view === "registry" ? "registry" : "queue"}
          onTabChange={handleTabChange}
          onBack={handleBack}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6 max-w-full">
            {view === "queue" && <ParsingQueue onViewExecution={handleViewExecution} />}
            {view === "detail" && <ExecutionParseDetail executionId={selectedId} onBack={handleBack} />}
            {view === "registry" && <DomainRegistry />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Parsing;
