import { useState, useCallback } from "react";
import AppSidebar from "@/components/AppSidebar";
import ExecutionHeader from "@/components/execution/ExecutionHeader";
import ExecutionList from "@/components/execution/ExecutionList";
import NewExecution from "@/components/execution/NewExecution";
import LiveMonitor from "@/components/execution/LiveMonitor";
import ExecutionDetail from "@/components/execution/ExecutionDetail";

type View = "list" | "new" | "monitor" | "detail";

const Execution = () => {
  const [view, setView] = useState<View>("list");
  const [selectedId, setSelectedId] = useState<string>("");

  const handleViewExecution = (id: string) => {
    setSelectedId(id);
    setView("detail");
  };

  const handleBack = () => {
    setView("list");
    setSelectedId("");
  };

  const handleNewExecution = () => setView("new");

  const handleStartExecution = () => setView("monitor");

  const handleComplete = useCallback((id: string) => {
    setSelectedId(id);
    setView("detail");
  }, []);

  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      <div className="ml-[220px] flex-1 flex flex-col min-h-screen">
        <ExecutionHeader
          view={view}
          executionId={selectedId}
          onNewExecution={handleNewExecution}
          onBack={handleBack}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6 max-w-full">
            {view === "list" && <ExecutionList onViewExecution={handleViewExecution} />}
            {view === "new" && <NewExecution onBack={handleBack} onStartExecution={handleStartExecution} />}
            {view === "monitor" && <LiveMonitor onBack={handleBack} onComplete={handleComplete} />}
            {view === "detail" && <ExecutionDetail executionId={selectedId} onBack={handleBack} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Execution;
