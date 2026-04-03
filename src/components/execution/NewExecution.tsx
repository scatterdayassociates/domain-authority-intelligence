import { useState } from "react";
import { Play, ArrowLeft } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

interface NewExecutionProps {
  onBack: () => void;
  onStartExecution: () => void;
}

const models = ["GPT-4o", "GPT-4o-mini", "Claude 3.5 Sonnet", "Claude 3 Haiku", "Gemini 1.5 Pro"];
const packs = ["Dell — Laptops — US", "Sony — Headphones — UK", "Nike — Running — US"];

const NewExecution = ({ onBack, onStartExecution }: NewExecutionProps) => {
  const [selectedPack, setSelectedPack] = useState(packs[0]);
  const [selectedModels, setSelectedModels] = useState<string[]>(["GPT-4o"]);
  const [runsPerPrompt, setRunsPerPrompt] = useState(5);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);

  const toggleModel = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to executions
      </button>

      <SectionHeader title="Configure New Execution" />

      {/* Prompt Pack Selection */}
      <div>
        <label className="text-label block mb-1.5">Prompt Pack</label>
        <select
          value={selectedPack}
          onChange={(e) => setSelectedPack(e.target.value)}
          className="h-9 border border-border rounded-md px-3 text-sm bg-background text-foreground w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {packs.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground mt-1">7 prompts · v3 · Active</p>
      </div>

      {/* Model Selection */}
      <div>
        <label className="text-label block mb-1.5">Models</label>
        <p className="text-xs text-muted-foreground mb-2">Select one or more models. Each model runs all prompts independently.</p>
        <div className="flex flex-wrap gap-2">
          {models.map((model) => (
            <button
              key={model}
              onClick={() => toggleModel(model)}
              className={`h-8 px-3 text-sm rounded-md border transition-colors ${
                selectedModels.includes(model)
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {model}
            </button>
          ))}
        </div>
      </div>

      {/* Parameters */}
      <div className="grid grid-cols-3 gap-4 max-w-lg">
        <div>
          <label className="text-label block mb-1.5">Runs per Prompt</label>
          <input
            type="number"
            value={runsPerPrompt}
            onChange={(e) => setRunsPerPrompt(Number(e.target.value))}
            min={1}
            max={20}
            className="h-9 border border-border rounded-md px-3 text-sm bg-background text-foreground w-full focus:outline-none focus:ring-2 focus:ring-ring tabular"
          />
        </div>
        <div>
          <label className="text-label block mb-1.5">Temperature</label>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            min={0}
            max={2}
            step={0.1}
            className="h-9 border border-border rounded-md px-3 text-sm bg-background text-foreground w-full focus:outline-none focus:ring-2 focus:ring-ring tabular"
          />
        </div>
        <div>
          <label className="text-label block mb-1.5">Max Tokens</label>
          <input
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            min={256}
            max={8192}
            step={256}
            className="h-9 border border-border rounded-md px-3 text-sm bg-background text-foreground w-full focus:outline-none focus:ring-2 focus:ring-ring tabular"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="bg-muted/30 border border-border rounded-md p-4 max-w-lg">
        <h3 className="text-sm font-medium text-foreground mb-2">Execution Summary</h3>
        <div className="grid grid-cols-2 gap-y-1.5 text-sm">
          <span className="text-muted-foreground">Pack:</span>
          <span className="text-foreground">{selectedPack}</span>
          <span className="text-muted-foreground">Models:</span>
          <span className="text-foreground">{selectedModels.join(", ") || "None selected"}</span>
          <span className="text-muted-foreground">Total runs:</span>
          <span className="text-foreground tabular">{7 * runsPerPrompt * selectedModels.length}</span>
          <span className="text-muted-foreground">Est. duration:</span>
          <span className="text-foreground">~{Math.ceil(7 * runsPerPrompt * selectedModels.length * 0.1)}m</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onStartExecution}
          disabled={selectedModels.length === 0}
          className="h-9 px-5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-3.5 h-3.5" />
          Start Execution
        </button>
        <button
          onClick={onBack}
          className="h-9 px-4 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewExecution;
