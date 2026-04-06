import { X, Link, Info } from "lucide-react";

interface NewContextPanelProps {
  open: boolean;
  onClose: () => void;
  prefillName?: string;
}

const NewContextPanel = ({ open, onClose, prefillName }: NewContextPanelProps) => {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />}
      <div className={`fixed top-0 right-0 bottom-0 w-[440px] bg-white shadow-2xl z-50 transition-transform duration-200 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-start justify-between px-6 pt-5 pb-3">
          <div>
            <h2 className="font-semibold text-slate-800">Add Context</h2>
            <p className="text-xs text-slate-500 mt-0.5">Define a discovery lens for this project</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 mt-1"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 overflow-y-auto" style={{ height: "calc(100% - 80px)" }}>
          <div className="mb-4 mt-2">
            <label className="text-xs text-slate-500 mb-1 block">Context Name</label>
            <input
              className="w-full h-9 border border-slate-200 rounded-md px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. Best noise cancelling headphones"
              defaultValue={prefillName || ""}
            />
            <p className="text-xs text-slate-400 mt-0.5">Name it as a user would phrase the discovery intent — not a category label.</p>
          </div>
          <div className="mb-4">
            <label className="text-xs text-slate-500 mb-1 block">Description</label>
            <textarea
              className="w-full min-h-[72px] border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              placeholder="Optional — what does this context specifically measure?"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
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

          <div className="border-t border-slate-100 my-4" />
          <span className="text-xs text-slate-500 uppercase tracking-wide block mb-3">Prompt Pack</span>
          <div className="bg-slate-50 rounded-md border border-slate-100 p-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 mb-1">
              <Link className="w-3 h-3 text-slate-300" />
              <span>1 context → 1 prompt pack (automatically linked)</span>
            </div>
            <p className="text-slate-400">A prompt pack will be created automatically for this context. You can add prompts after saving.</p>
          </div>

          <button className="w-full h-9 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 transition-colors mt-6">Create Context →</button>
          <button onClick={onClose} className="w-full text-center text-sm text-slate-500 hover:text-slate-700 mt-2 mb-6">Cancel</button>
        </div>
      </div>
    </>
  );
};

export default NewContextPanel;
