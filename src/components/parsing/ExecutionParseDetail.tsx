import { useState } from "react";
import { Download, ArrowRight, Info } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import RunLogTab from "@/components/parsing/tabs/RunLogTab";
import DomainSummaryTab from "@/components/parsing/tabs/DomainSummaryTab";
import ErrorsTab from "@/components/parsing/tabs/ErrorsTab";
import { toast } from "sonner";

interface ExecutionParseDetailProps {
  executionId: string;
  onBack: () => void;
}

const executionData: Record<string, {
  id: string; pack: string; version: string; model: string; status: string;
  totalRuns: number; parsed: number; failed: number; uniqueDomains: number; hasErrors: boolean;
}> = {
  "EX-0329-001": { id: "EX-0329-001", pack: "Dell — Laptops — US", version: "v3", model: "GPT-4o", status: "Parsed", totalRuns: 35, parsed: 35, failed: 0, uniqueDomains: 24, hasErrors: false },
  "EX-0322-002": { id: "EX-0322-002", pack: "Dell — Laptops — US", version: "v2", model: "GPT-4o", status: "Parsed", totalRuns: 30, parsed: 30, failed: 0, uniqueDomains: 21, hasErrors: false },
  "EX-0315-003": { id: "EX-0315-003", pack: "Dell — Laptops — US", version: "v1", model: "GPT-4o", status: "Parsed", totalRuns: 25, parsed: 25, failed: 0, uniqueDomains: 18, hasErrors: false },
  "EX-0401-004": { id: "EX-0401-004", pack: "Sony — Headphones — UK", version: "v1", model: "Claude 3.5 Sonnet", status: "Partial", totalRuns: 40, parsed: 37, failed: 3, uniqueDomains: 28, hasErrors: true },
  "EX-0403-006": { id: "EX-0403-006", pack: "Nike — Running — US", version: "v2", model: "GPT-4o", status: "Parsed", totalRuns: 50, parsed: 50, failed: 0, uniqueDomains: 31, hasErrors: false },
  "EX-0402-008": { id: "EX-0402-008", pack: "Nike — Running — US", version: "v1", model: "GPT-4o", status: "Partial", totalRuns: 45, parsed: 44, failed: 1, uniqueDomains: 29, hasErrors: true },
};

type Tab = "runlog" | "domains" | "errors";

const ExecutionParseDetail = ({ executionId }: ExecutionParseDetailProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("runlog");
  const data = executionData[executionId] || executionData["EX-0329-001"];

  const statusClass = data.status === "Parsed"
    ? "bg-[hsl(var(--status-completed-bg))] text-[hsl(var(--status-completed-fg))]"
    : "bg-amber-100 text-amber-700";

  return (
    <div>
      {/* Context Header Card */}
      <div className="bg-muted/30 border border-border rounded-lg px-6 py-4 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap gap-8">
            <div>
              <span className="text-label block mb-0.5">Execution ID</span>
              <span className="text-sm font-mono text-foreground">{data.id}</span>
            </div>
            <div>
              <span className="text-label block mb-0.5">Prompt Pack</span>
              <span className="text-sm text-foreground">{data.pack}</span>
            </div>
            <div>
              <span className="text-label block mb-0.5">Context</span>
              <span className="text-sm font-medium text-teal-700">Best laptops for home office</span>
            </div>
            <div>
              <span className="text-label block mb-0.5">Version</span>
              <span className="text-sm text-foreground">{data.version}</span>
            </div>
            <div>
              <span className="text-label block mb-0.5">Model</span>
              <span className="text-sm text-foreground">{data.model}</span>
            </div>
            <div>
              <span className="text-label block mb-0.5">Parse Status</span>
              <span className={`inline-flex text-xs font-medium rounded-full px-2.5 py-0.5 ${statusClass}`}>{data.status}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="h-8 px-3 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Export Parsed Data
            </button>
            <button
              onClick={() => toast("Coming Soon", { description: "The Scoring Engine module is not yet available." })}
              className="h-8 px-3 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium flex items-center gap-1.5"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              Proceed to Scoring
            </button>
          </div>
        </div>
        <div className="flex gap-8 mt-4 pt-3 border-t border-border">
          <div>
            <span className="text-label block mb-0.5">Total Runs</span>
            <span className="text-sm font-semibold tabular">{data.totalRuns}</span>
          </div>
          <div>
            <span className="text-label block mb-0.5">Successfully Parsed</span>
            <span className="text-sm font-semibold tabular text-green-600">{data.parsed}</span>
          </div>
          <div>
            <span className="text-label block mb-0.5">Failed Parses</span>
            <span className={`text-sm font-semibold tabular ${data.failed > 0 ? "text-red-500" : "text-muted-foreground"}`}>{data.failed}</span>
          </div>
          <div>
            <span className="text-label block mb-0.5">Unique Domains Found</span>
            <span className="text-sm font-semibold tabular text-primary">{data.uniqueDomains}</span>
          </div>
        </div>
      </div>

      {/* Normalisation Rules Banner */}
      <div className="bg-muted/30 border border-border/50 rounded-md px-4 py-2 flex items-center gap-3 text-xs text-muted-foreground mb-4">
        <Info className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        Domains are normalised to root level: https://www.dell.com → dell.com · Subdomains collapsed · Protocol and www removed · Lowercase enforced
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab("runlog")}
          className={`text-xs rounded-full px-3 py-1 font-medium transition-colors ${
            activeTab === "runlog" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Run Log
        </button>
        <button
          onClick={() => setActiveTab("domains")}
          className={`text-xs rounded-full px-3 py-1 font-medium transition-colors ${
            activeTab === "domains" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Domain Summary
        </button>
        <button
          onClick={() => setActiveTab("errors")}
          className={`text-xs rounded-full px-3 py-1 font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === "errors" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Errors
          {data.failed > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>{data.failed}</span>
            </span>
          )}
        </button>
      </div>

      {activeTab === "runlog" && <RunLogTab totalRuns={data.totalRuns} />}
      {activeTab === "domains" && <DomainSummaryTab totalRuns={data.totalRuns} />}
      {activeTab === "errors" && <ErrorsTab failed={data.failed} parsed={data.parsed} />}
    </div>
  );
};

export default ExecutionParseDetail;
