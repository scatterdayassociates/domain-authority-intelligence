import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import ActivateModal from "@/components/ActivateModal";
import AnalysisContext from "@/components/AnalysisContext";
import PromptTable from "@/components/PromptTable";
import ExecutionHistory from "@/components/ExecutionHistory";
import ExecutionComparison from "@/components/ExecutionComparison";

const Index = () => {
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE">("DRAFT");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      <div className="ml-[220px] flex-1 flex flex-col min-h-screen">
        <AppHeader
          status={status}
          onActivate={() => setModalOpen(true)}
          onDeactivate={() => setStatus("DRAFT")}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6 max-w-full">
            <AnalysisContext />
            <PromptTable />
            <ExecutionHistory />
            <ExecutionComparison />
          </div>
        </main>
      </div>

      <ActivateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          setStatus("ACTIVE");
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default Index;
