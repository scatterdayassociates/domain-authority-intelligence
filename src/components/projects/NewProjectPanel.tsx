import { X } from "lucide-react";
import { useState } from "react";

interface NewProjectPanelProps {
  open: boolean;
  onClose: () => void;
}

const NewProjectPanel = ({ open, onClose }: NewProjectPanelProps) => {
  const [competitors, setCompetitors] = useState<string[]>(["HP", "Lenovo", "Apple"]);
  const [compInput, setCompInput] = useState("");

  const addCompetitor = () => {
    if (compInput.trim() && !competitors.includes(compInput.trim())) {
      setCompetitors([...competitors, compInput.trim()]);
      setCompInput("");
    }
  };

  const removeCompetitor = (c: string) => setCompetitors(competitors.filter(x => x !== c));

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />}
      <div className={`fixed top-0 right-0 bottom-0 w-[440px] bg-white shadow-2xl z-50 transition-transform duration-200 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-start justify-between px-6 pt-5 pb-3">
          <div>
            <h2 className="font-semibold text-slate-800">New Project</h2>
            <p className="text-xs text-slate-500 mt-0.5">A project defines one analysis context: one advertiser, one category, one market.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 mt-1"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 overflow-y-auto" style={{ height: "calc(100% - 80px)" }}>
          <span className="text-xs text-slate-500 uppercase tracking-wide block mb-3 mt-2">Project Context</span>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: "Advertiser / Brand", placeholder: "e.g. Dell Technologies" },
              { label: "Vertical", placeholder: "e.g. Consumer Electronics" },
              { label: "Category", placeholder: "e.g. Laptops" },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-slate-500 mb-1 block">{f.label}</label>
                <input className="w-full h-9 border border-slate-200 rounded-md px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder={f.placeholder} />
              </div>
            ))}
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Market</label>
              <select className="w-full h-9 border border-slate-200 rounded-md px-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                {["United States", "United Kingdom", "Germany", "France", "Australia", "Other"].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 my-4" />
          <span className="text-xs text-slate-500 uppercase tracking-wide block mb-3">Analysis Configuration</span>
          <div className="mb-3">
            <label className="text-xs text-slate-500 mb-1 block">Target Brand</label>
            <input className="w-full h-9 border border-slate-200 rounded-md px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Dell" />
            <p className="text-xs text-slate-400 mt-0.5">Typically same as advertiser</p>
          </div>
          <div className="mb-3">
            <label className="text-xs text-slate-500 mb-1 block">Competitor Set</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {competitors.map(c => (
                <span key={c} className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 rounded px-2 py-0.5 text-xs">
                  {c}
                  <button onClick={() => removeCompetitor(c)} className="text-slate-400 hover:text-slate-600">×</button>
                </span>
              ))}
            </div>
            <input
              className="w-full h-9 border border-slate-200 rounded-md px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Add competitor, press Enter"
              value={compInput}
              onChange={e => setCompInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCompetitor())}
            />
          </div>

          <div className="border-t border-slate-100 my-4" />
          <span className="text-xs text-slate-500 uppercase tracking-wide block mb-3">Default Execution Settings</span>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Default Model</label>
              <select className="w-full h-9 border border-slate-200 rounded-md px-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>GPT-4o</option>
                <option>Claude 3.5 Sonnet</option>
                <option>Gemini 1.5 Pro</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Default Runs per Prompt</label>
              <input type="number" defaultValue={5} className="w-full h-9 border border-slate-200 rounded-md px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-6">These are applied as defaults when creating executions. You can override them at run time.</p>

          <button className="w-full h-9 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 transition-colors">Create Project</button>
          <button onClick={onClose} className="w-full text-center text-sm text-slate-500 hover:text-slate-700 mt-2 mb-6">Cancel</button>
        </div>
      </div>
    </>
  );
};

export default NewProjectPanel;
