import { X } from "lucide-react";
import { useState } from "react";
import SectionHeader from "./SectionHeader";

const markets = ["United States", "United Kingdom", "Germany", "France", "Australia", "Canada"];

const AnalysisContext = () => {
  const [competitors, setCompetitors] = useState(["HP", "Lenovo", "Apple"]);
  const [newComp, setNewComp] = useState("");

  const addCompetitor = () => {
    const val = newComp.trim();
    if (val && !competitors.includes(val)) {
      setCompetitors([...competitors, val]);
      setNewComp("");
    }
  };

  return (
    <section>
      <SectionHeader title="Analysis Context" />
      <div className="grid grid-cols-4 gap-4 mt-4">
        <Field label="Advertiser / Brand" placeholder="e.g. Dell Technologies" />
        <Field label="Vertical" placeholder="e.g. Consumer Electronics" />
        <Field label="Category" placeholder="e.g. Laptops" />
        <div>
          <label className="text-label block mb-1.5">Market</label>
          <select className="h-9 w-full border border-input rounded-md px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
            {markets.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="text-label block mb-1.5">
            Target Brand <span className="normal-case tracking-normal font-normal">(usually same as advertiser)</span>
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
