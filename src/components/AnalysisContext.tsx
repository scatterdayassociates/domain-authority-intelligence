import { X } from "lucide-react";
import { useState } from "react";
import SectionHeader from "./SectionHeader";

const markets = ["United States", "United Kingdom", "Germany", "France", "Australia", "Canada"];

const contexts = [
  { name: "Best laptops for home office", active: true },
  { name: "Best budget laptops under £800", active: false },
  { name: "Best gaming laptops 2024", active: false },
];

const AnalysisContext = () => {
  const [competitors, setCompetitors] = useState(["HP", "Lenovo", "Apple"]);
  const [newComp, setNewComp] = useState("");
  const [selectedContext, setSelectedContext] = useState(0);

  const addCompetitor = () => {
    const val = newComp.trim();
    if (val && !competitors.includes(val)) {
      setCompetitors([...competitors, val]);
      setNewComp("");
    }
  };

  return (
    <section>
      {/* Context selector */}
      <div className="bg-white border-b border-slate-200 -mx-6 px-6 py-3 flex items-center gap-4 mb-4 -mt-6">
        <span className="text-xs text-slate-500 uppercase tracking-wide">Context:</span>
        <div className="flex items-center gap-2 flex-wrap">
          {contexts.map((ctx, i) => (
            <button
              key={ctx.name}
              onClick={() => setSelectedContext(i)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                selectedContext === i
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${ctx.active ? "bg-teal-500" : "bg-amber-400"}`} />
              <span className="truncate max-w-[180px]">{ctx.name}</span>
            </button>
          ))}
          <button className="text-xs text-teal-600 flex items-center gap-1 hover:text-teal-700">
            + Add Context
          </button>
        </div>
      </div>

      <SectionHeader title="Analysis Context" />
      <div className="grid grid-cols-4 gap-4 mt-4">
        <Field label="Brand" placeholder="e.g. Dell Technologies" />
        <Field label="Category" placeholder="e.g. Laptops" />
        <div>
          <label className="text-label block mb-1.5">Market</label>
          <select className="h-9 w-full border border-input rounded-md px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
            {markets.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-label block mb-1.5">Context</label>
          <p className="text-sm font-medium text-teal-700 mt-1">{contexts[selectedContext].name}</p>
          <span className="inline-flex items-center gap-1 text-xs text-slate-400 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            Linked to 1 prompt pack · v3
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="text-label block mb-1.5">
            Target Brand <span className="normal-case tracking-normal font-normal">(usually same as brand)</span>
          </label>
          <input className="h-9 w-full border border-input rounded-md px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Dell" />
        </div>
        <div>
          <label className="text-label block mb-1.5">Competitor Set</label>
          <div className="flex flex-wrap items-center gap-1.5 border border-input rounded-md px-2 py-1.5 min-h-[36px] focus-within:ring-2 focus-within:ring-ring">
            {competitors.map((c) => (
              <span key={c} className="inline-flex items-center gap-1 bg-muted text-foreground text-xs rounded px-2 py-0.5">
                {c}
                <button onClick={() => setCompetitors(competitors.filter((x) => x !== c))} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              value={newComp}
              onChange={(e) => setNewComp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCompetitor()}
              className="flex-1 min-w-[100px] text-sm bg-transparent outline-none"
              placeholder="Add competitor..."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const Field = ({ label, placeholder }: { label: string; placeholder: string }) => (
  <div>
    <label className="text-label block mb-1.5">{label}</label>
    <input className="h-9 w-full border border-input rounded-md px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder={placeholder} />
  </div>
);

export default AnalysisContext;
