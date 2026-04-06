import { useState, useEffect, useRef } from "react";
import { Check, Clock, AlertTriangle, Play, Edit2, ArrowRight, ChevronDown, ChevronUp, ChevronRight, Download, TrendingUp, TrendingDown, Rocket, Info, Plus, MoreHorizontal, Link, Layers } from "lucide-react";

interface ProjectDetailProps {
  projectName: string;
  onOpenContext?: (contextName: string) => void;
}

const sections = ["Overview", "Contexts", "Execution", "Validation", "Analysis", "Comparison"];
const contextSections = ["Overview", "Prompt Pack", "Execution", "Validation", "Analysis", "Comparison"];

const isDraft = (name: string) => name.includes("Samsung") || name.includes("Philips") || name.includes("Air Purifiers");

// Pipeline step component
const PipelineStep = ({ label, status }: { label: string; status: "done" | "running" | "pending" | "error" }) => {
  const styles = {
    done: "bg-teal-500 text-white",
    running: "bg-blue-500 text-white",
    pending: "bg-slate-200 text-slate-400",
    error: "bg-red-400 text-white",
  };
  const icons = {
    done: <Check className="w-3 h-3" />,
    running: <span className="w-2 h-2 rounded-full bg-white animate-pulse" />,
    pending: <Clock className="w-3 h-3" />,
    error: <AlertTriangle className="w-3 h-3" />,
  };
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${styles[status]}`}>{icons[status]}</div>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
};

const Arrow = () => <span className="text-slate-300 text-sm mt-[-8px]">→</span>;

// Authority type badge
const typeBadge = (type: string) => {
  const s: Record<string, string> = {
    "Publisher / Media": "bg-blue-50 text-blue-600",
    "Retail / Marketplace": "bg-orange-50 text-orange-600",
    "Brand / Retail": "bg-purple-50 text-purple-600",
    "Forum / Community": "bg-yellow-50 text-yellow-600",
  };
  return <span className={`text-xs rounded-full px-2 py-0.5 ${s[type] || "bg-slate-100 text-slate-500"}`}>{type}</span>;
};

const contextData = [
  { name: "Best laptops for home office", description: "Broad shortlist context for home and professional use", status: "Active" as const, prompts: 7, lastExecution: "Apr 3, 2026" },
  { name: "Best budget laptops under £800", description: "Price-constrained context targeting mid-market segment", status: "Draft" as const, prompts: 4, lastExecution: null },
  { name: "Best gaming laptops 2024", description: "Performance-first gaming context — prompts not yet added", status: "Draft" as const, prompts: 0, lastExecution: null },
];

const statusDotColor: Record<string, string> = {
  Active: "bg-teal-500",
  Draft: "bg-amber-400",
  Archived: "bg-slate-300",
};

const statusBadgeStyle: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Draft: "bg-amber-100 text-amber-700",
  Archived: "bg-slate-100 text-slate-500",
};

// Context Detail sub-view
const ContextDetailView = ({ contextName, projectName, onBack }: { contextName: string; projectName: string; onBack: () => void }) => {
  const [activeSection, setActiveSection] = useState("Overview");
  const [expandedRun, setExpandedRun] = useState<number | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const ctx = contextData.find(c => c.name === contextName) || contextData[0];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute("data-section") || "Overview");
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );
    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const setRef = (name: string) => (el: HTMLDivElement | null) => { sectionRefs.current[name] = el; };
  const scrollTo = (name: string) => {
    sectionRefs.current[name]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      {/* Sticky sub-nav */}
      <div className="sticky top-12 z-30 bg-white border-b border-slate-100 shadow-sm -mx-6 px-6 mb-6">
        <div className="flex gap-4 py-2">
          {contextSections.map(s => (
            <button key={s} onClick={() => scrollTo(s)}
              className={`text-xs pb-1 transition-colors ${activeSection === s ? "text-teal-600 font-medium border-b-2 border-teal-600" : "text-slate-500 hover:text-slate-700"}`}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Context Header */}
      <div ref={setRef("Overview")} data-section="Overview">
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-6 py-4 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-800">{ctx.name}</h2>
                <span className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${statusBadgeStyle[ctx.status]}`}>{ctx.status}</span>
              </div>
              {ctx.description && <p className="text-sm text-slate-400 italic mt-0.5">{ctx.description}</p>}
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 bg-teal-600 text-white text-sm h-8 px-3 rounded-md hover:bg-teal-700">
                <Play className="w-3.5 h-3.5" /> Run Execution →
              </button>
              <button onClick={onBack} className="flex items-center gap-1.5 border border-slate-200 text-slate-600 text-sm h-8 px-3 rounded-md hover:bg-slate-50">
                ← Back to Project
              </button>
            </div>
          </div>
          <div className="flex gap-8 mt-4 pt-3 border-t border-slate-200">
            <div><span className="text-xs text-slate-500">Prompts</span><p className="text-lg font-semibold text-slate-800">{ctx.prompts}</p></div>
            <div><span className="text-xs text-slate-500">Executions</span><p className="text-lg font-semibold text-slate-800">3</p></div>
            <div><span className="text-xs text-slate-500">Last Run</span><p className="text-sm text-slate-400 mt-1">{ctx.lastExecution || "Never"}</p></div>
            <div><span className="text-xs text-slate-500">Pack Version</span><p className="text-lg font-semibold text-slate-800">v3</p></div>
          </div>
        </div>
      </div>

      {/* Prompt Pack Panel (scoped to context) */}
      <div ref={setRef("Prompt Pack")} data-section="Prompt Pack" className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">Prompt Pack</h3>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Link className="w-3 h-3 text-slate-300" /> 1 context → 1 prompt pack
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-green-600"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />v3 · Active</span>
            <button className="text-sm text-teal-600 hover:text-teal-700">Edit Pack →</button>
          </div>
        </div>
        <div className="border-b border-slate-200 mb-3" />
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
          <div className="flex gap-8">
            <div><span className="text-xs text-slate-500">Active Version</span><p className="text-lg font-semibold text-slate-800">v3</p></div>
            <div><span className="text-xs text-slate-500">Prompt Count</span><p className="text-lg font-semibold text-slate-800">7 prompts</p></div>
            <div><span className="text-xs text-slate-500">Last Updated</span><p className="text-sm text-slate-400 mt-1">Apr 1, 2026</p></div>
          </div>
        </div>
        <table className="w-full">
          <thead><tr className="border-b border-slate-100">
            {["#", "Label", "Prompt Text"].map(h => (
              <th key={h} className="text-xs text-slate-400 uppercase tracking-wide font-medium text-left pb-1.5 px-3">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              ["1", "Best laptop search", "What are the best laptops for home office use in 2024?..."],
              ["2", "Budget laptop", "What laptops do you recommend under $800?..."],
              ["3", "Gaming laptop", "What are the top gaming laptops available right now?..."],
              ["4", "Ultrabook comparison", "Compare the best thin and light laptops for business..."],
              ["5", "AI laptop features", "Which laptops have the best AI processing capabilities?..."],
              ["6", "Laptop for elderly", "What laptops are easiest to use for older adults?..."],
              ["7", "Premium laptop", "What are the best premium laptops above $1500?..."],
            ].map(([n, l, t]) => (
              <tr key={n} className="border-b border-slate-100 h-7">
                <td className="px-3 text-xs text-slate-400">{n}</td>
                <td className="px-3 text-xs font-medium text-slate-700">{l}</td>
                <td className="px-3 text-xs text-slate-600 truncate max-w-0"><p className="truncate">{t}</p></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-sm text-teal-600 mt-3 flex items-center gap-1 cursor-pointer hover:text-teal-700">View full prompt pack <ArrowRight className="w-3 h-3" /></p>
      </div>

      {/* Execution Panel */}
      <div ref={setRef("Execution")} data-section="Execution" className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">Execution</h3>
          <button className="flex items-center gap-1.5 bg-teal-600 text-white text-sm h-8 px-3 rounded-md hover:bg-teal-700">
            <Play className="w-3.5 h-3.5" /> Run New Execution
          </button>
        </div>
        <div className="border-b border-slate-200 mb-3" />
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-700">In Progress — EX-0403-006</span>
            <button className="border border-red-200 text-red-400 text-xs h-7 px-2 rounded-md hover:bg-red-50">Cancel</button>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-1.5 mt-2 mb-3">
            <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: "44%" }} />
          </div>
          <div className="flex gap-8">
            {[["Model", "GPT-4o"], ["Pack", "v3 · 7 prompts"], ["Total Runs", "50"], ["Completed", "22 of 50"]].map(([l, v]) => (
              <div key={l}><span className="text-xs text-slate-500">{l}</span><p className="text-sm font-medium text-slate-700">{v}</p></div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">Started Apr 3, 2026 · 9:08 AM · Estimated 3–5 min remaining</p>
        </div>

        <span className="text-xs text-slate-500 uppercase tracking-wide block mt-4 mb-2">Execution History</span>
        <table className="w-full">
          <thead><tr className="border-b border-slate-200">
            {["Execution ID", "Date", "Model", "Status", "Domains", "Top 5 Share", "HHI", "Inclusion", "Actions"].map(h => (
              <th key={h} className="text-xs text-slate-500 uppercase tracking-wide font-medium text-left pb-2 px-3">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              { id: "EX-0403-006", date: "Apr 3, 2026", model: "GPT-4o", status: "Running", domains: "—", top5: "—", hhi: "—", inclusion: "—" },
              { id: "EX-0329-001", date: "Apr 3, 2026", model: "GPT-4o", status: "Scored", domains: "24", top5: "68.4%", hhi: "0.142", inclusion: "82%" },
              { id: "EX-0322-002", date: "Mar 29, 2026", model: "GPT-4o", status: "Scored", domains: "21", top5: "71.2%", hhi: "0.161", inclusion: "78%" },
              { id: "EX-0315-003", date: "Mar 22, 2026", model: "GPT-4o", status: "Scored", domains: "18", top5: "74.8%", hhi: "0.183", inclusion: "71%" },
            ].map((r, i) => (
              <tr key={r.id} className={`${i % 2 === 1 ? "bg-slate-50" : ""} hover:bg-teal-50`}>
                <td className="px-3 py-2 font-mono text-xs text-slate-400">{r.id}</td>
                <td className="px-3 py-2 text-sm text-slate-600">{r.date}</td>
                <td className="px-3 py-2 text-sm text-slate-800">{r.model}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-0.5 ${r.status === "Running" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                    {r.status === "Running" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-sm tabular-nums text-center text-slate-800">{r.domains}</td>
                <td className={`px-3 py-2 text-sm tabular-nums font-semibold text-center ${parseFloat(r.top5) >= 70 ? "text-amber-600" : "text-slate-800"}`}>{r.top5}</td>
                <td className={`px-3 py-2 text-sm tabular-nums font-semibold text-center ${parseFloat(r.hhi) >= 0.15 ? "text-amber-600" : "text-slate-800"}`}>{r.hhi}</td>
                <td className={`px-3 py-2 text-sm tabular-nums font-semibold text-center ${parseInt(r.inclusion) >= 75 ? "text-green-600" : parseInt(r.inclusion) < 60 ? "text-amber-600" : "text-slate-800"}`}>{r.inclusion}</td>
                <td className="px-3 py-2 text-sm text-teal-600 hover:text-teal-700 cursor-pointer">View</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-sm text-teal-600 mt-3 flex items-center gap-1 cursor-pointer hover:text-teal-700">View all executions <ArrowRight className="w-3 h-3" /></p>
      </div>

      {/* Validation Panel */}
      <div ref={setRef("Validation")} data-section="Validation" className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">Validation</h3>
          <span className="text-xs text-green-600">35 runs · 0 parse errors</span>
        </div>
        <div className="border-b border-slate-200 mb-3" />
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 mb-4">
          <div className="flex gap-8">
            <div><span className="text-xs text-slate-400">Execution</span><p className="text-sm text-slate-700 font-mono">EX-0329-001</p></div>
            <div><span className="text-xs text-slate-400">Parse Status</span><p className="text-sm font-medium text-green-600">All 35 runs parsed</p></div>
            <div><span className="text-xs text-slate-400">Unique Domains Extracted</span><p className="text-sm font-medium text-teal-600">24 domains</p></div>
            <div><span className="text-xs text-slate-400">Parse Errors</span><p className="text-sm font-medium text-slate-400">None</p></div>
          </div>
        </div>
        <p className="text-sm text-teal-600 mb-4 flex items-center gap-1 cursor-pointer hover:text-teal-700">View full parsing detail <ArrowRight className="w-3 h-3" /></p>

        <span className="text-xs text-slate-500 uppercase tracking-wide block mt-4 mb-1">Raw Response Inspector</span>
        <p className="text-xs text-slate-400 italic mb-3">Sample 3 responses from the most recent scored execution. Click any row to expand.</p>
        <table className="w-full">
          <thead><tr className="border-b border-slate-200">
            {["Run #", "Prompt Label", "Model", "URLs Found", "Domains", "Parse Status", ""].map(h => (
              <th key={h} className="text-xs text-slate-500 uppercase tracking-wide font-medium text-left pb-2 px-3">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              { id: 0, run: "run-001-a", label: "Best laptop search", urls: 6, domains: 6 },
              { id: 1, run: "run-003-c", label: "Gaming laptop", urls: 7, domains: 7 },
              { id: 2, run: "run-006-b", label: "Budget laptop", urls: 5, domains: 5 },
            ].map((r) => (
              <tbody key={r.run}>
                <tr className="hover:bg-teal-50 cursor-pointer" onClick={() => setExpandedRun(expandedRun === r.id ? null : r.id)}>
                  <td className="px-3 py-2 text-sm font-mono text-slate-500">{r.run}</td>
                  <td className="px-3 py-2 text-sm text-slate-700">{r.label}</td>
                  <td className="px-3 py-2 text-sm text-slate-800">GPT-4o</td>
                  <td className="px-3 py-2 text-sm tabular-nums text-center text-slate-800">{r.urls}</td>
                  <td className="px-3 py-2 text-sm tabular-nums text-center text-teal-600">{r.domains}</td>
                  <td className="px-3 py-2"><span className="inline-flex items-center gap-1.5 text-xs"><span className="w-2 h-2 rounded-full bg-green-500" />OK</span></td>
                  <td className="px-3 py-2 text-teal-600">{expandedRun === r.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</td>
                </tr>
                {expandedRun === r.id && (
                  <tr>
                    <td colSpan={7} className="p-0">
                      <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border-t border-slate-200">
                        <div>
                          <span className="text-xs text-slate-500 uppercase tracking-wide block mb-2">Raw Response</span>
                          <div className="bg-white rounded p-3 text-xs font-mono text-slate-600 max-h-40 overflow-y-auto border border-slate-100 whitespace-pre-wrap leading-relaxed">
{`Based on my analysis, here are the best laptops for home office use in 2024:

1. Dell XPS 15 - Excellent performance for professionals
2. Apple MacBook Pro M3 - Outstanding battery life
3. Lenovo ThinkPad X1 Carbon - Best for business travel

SOURCES:
https://www.rtings.com/laptop/reviews/best/laptops
https://www.pcmag.com/picks/the-best-laptops
https://www.notebookcheck.net/Best-Laptops.13194.0.html
https://www.tomshardware.com/best-picks/best-laptops
https://www.bestbuy.com/site/buying-guides/best-laptops/pcmcd.html
https://www.theverge.com/23832390/best-laptops`}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 uppercase tracking-wide block mb-2">Normalised Domains</span>
                          <div className="border border-slate-100 rounded bg-white">
                            <div className="grid grid-cols-[1fr_20px_1fr] text-xs px-3 py-1.5 border-b border-slate-100">
                              <span className="text-slate-400 italic">Before</span>
                              <span />
                              <span className="text-slate-400 italic font-medium">After</span>
                            </div>
                            {[
                              ["www.rtings.com", "rtings.com"],
                              ["www.pcmag.com", "pcmag.com"],
                              ["www.notebookcheck.net", "notebookcheck.net"],
                              ["www.tomshardware.com", "tomshardware.com"],
                              ["www.bestbuy.com", "bestbuy.com"],
                              ["www.theverge.com", "theverge.com"],
                            ].map(([b, a], j) => (
                              <div key={b} className={`grid grid-cols-[1fr_20px_1fr] text-xs px-3 py-1 ${j % 2 === 1 ? "bg-slate-50" : ""}`}>
                                <span className="font-mono text-slate-500">{b}</span>
                                <ArrowRight className="w-3 h-3 text-slate-300 mx-auto" />
                                <span className="font-mono font-medium text-teal-700">{a}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            ))}
          </tbody>
        </table>
        <p className="text-sm text-teal-600 mt-3 flex items-center gap-1 cursor-pointer hover:text-teal-700">View full validation detail <ArrowRight className="w-3 h-3" /></p>
      </div>

      {/* Analysis Panel */}
      <div ref={setRef("Analysis")} data-section="Analysis" className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">Analysis</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">EX-0329-001 · Apr 3, 2026</span>
            <button className="flex items-center gap-1 border border-slate-300 text-slate-600 text-xs h-7 px-2 rounded-md">
              Select execution <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="border-b border-slate-200 mb-3" />

        <span className="text-xs text-slate-500 uppercase tracking-wide block mb-2">Concentration</span>
        <div className="bg-slate-50 rounded-lg border border-slate-200 px-6 py-3 mb-4">
          <div className="flex gap-8">
            <div>
              <p className="text-xl font-semibold text-slate-800 tabular-nums">68.4%</p>
              <span className="text-xs text-slate-500">Top 5 Share</span>
              <p className="text-xs text-green-600">−2.8pp vs. prev</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-800 tabular-nums">0.142</p>
              <span className="text-xs text-slate-500">HHI</span>
              <p className="text-xs text-green-600">−0.019 vs. prev</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-800 tabular-nums">24</p>
              <span className="text-xs text-slate-500">Unique Domains</span>
              <p className="text-xs text-teal-600">+3 vs. prev</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 mb-2">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Top 5 Authority Domains</span>
          <span className="text-xs text-teal-600 italic">Publisher-dominated ecosystem</span>
        </div>
        <table className="w-full mb-1">
          <thead><tr>
            {["#", "Domain", "Authority Type", "Mentions", "Persistence", "Tier"].map(h => (
              <th key={h} className="text-xs text-slate-400 font-medium text-left pb-1.5 px-3">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              ["1", "rtings.com", "Publisher / Media", "48", "97.1%", "Core"],
              ["2", "notebookcheck.net", "Publisher / Media", "41", "91.4%", "Core"],
              ["3", "pcmag.com", "Publisher / Media", "38", "88.6%", "Core"],
              ["4", "tomshardware.com", "Publisher / Media", "35", "85.7%", "Core"],
              ["5", "bestbuy.com", "Retail / Marketplace", "29", "80.0%", "Strong"],
            ].map(([n, d, t, m, p, tier]) => (
              <tr key={n} className="h-7">
                <td className="px-3 text-xs text-slate-400 tabular-nums">{n}</td>
                <td className="px-3 text-xs font-mono text-slate-700">{d}</td>
                <td className="px-3">{typeBadge(t)}</td>
                <td className="px-3 text-xs tabular-nums text-slate-800">{m}</td>
                <td className="px-3 text-xs tabular-nums text-slate-800">{p}</td>
                <td className="px-3"><span className={`text-xs font-medium ${tier === "Core" ? "text-teal-600" : "text-blue-500"}`}>{tier}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-slate-200 mt-2 pt-2">
          <table className="w-full"><tbody>
            <tr className="h-7">
              <td className="px-3 text-xs text-slate-400 tabular-nums w-[30px]">9</td>
              <td className="px-3 text-xs font-mono text-slate-700 border-l-2 border-l-teal-400 pl-2">
                dell.com <span className="bg-teal-50 text-teal-600 text-xs font-mono rounded px-1 ml-2">TARGET</span>
              </td>
              <td className="px-3">{typeBadge("Brand / Retail")}</td>
              <td className="px-3 text-xs tabular-nums text-slate-800">17</td>
              <td className="px-3 text-xs tabular-nums text-slate-800">54.3%</td>
              <td className="px-3"><span className="text-xs font-medium text-blue-500">Strong</span></td>
            </tr>
          </tbody></table>
          <p className="text-xs text-slate-400 italic mt-1 px-3">Target brand ranked #9 in authority. Strong tier.</p>
        </div>

        <span className="text-xs text-slate-500 uppercase tracking-wide block mt-4 mb-2">Brand Inclusion</span>
        <table className="w-full">
          <thead><tr className="border-b border-slate-200">
            {["Brand", "Role", "Inclusion Rate", "Runs Mentioned", "vs. Prev Run", "Stability"].map(h => (
              <th key={h} className="text-xs text-slate-500 uppercase tracking-wide font-medium text-left pb-2 px-3">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              { brand: "Dell Technologies", role: "TARGET", rate: "82.9%", rateColor: "text-green-600", runs: "29 of 35", delta: "+4.0pp", deltaDir: "up" as const, stability: "0.81", stabColor: "text-green-600" },
              { brand: "HP", role: "COMPETITOR", rate: "65.7%", rateColor: "text-slate-800", runs: "23 of 35", delta: "−1.4pp", deltaDir: "down" as const, stability: "0.67", stabColor: "text-amber-600" },
              { brand: "Lenovo", role: "COMPETITOR", rate: "60.0%", rateColor: "text-slate-800", runs: "21 of 35", delta: "+0.8pp", deltaDir: "up" as const, stability: "0.62", stabColor: "text-amber-600" },
              { brand: "Apple", role: "COMPETITOR", rate: "45.7%", rateColor: "text-amber-600", runs: "16 of 35", delta: "−2.1pp", deltaDir: "down" as const, stability: "0.51", stabColor: "text-amber-600" },
            ].map(r => (
              <tr key={r.brand} className="hover:bg-teal-50">
                <td className="px-3 py-2 text-sm text-slate-800">{r.brand}</td>
                <td className="px-3 py-2">
                  <span className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${r.role === "TARGET" ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500"}`}>{r.role}</span>
                </td>
                <td className={`px-3 py-2 text-sm tabular-nums font-semibold ${r.rateColor}`}>{r.rate}</td>
                <td className="px-3 py-2 text-sm tabular-nums text-slate-500">{r.runs}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center gap-1 text-sm tabular-nums ${r.deltaDir === "up" ? "text-green-600" : "text-red-500"}`}>
                    {r.deltaDir === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {r.delta}
                  </span>
                </td>
                <td className={`px-3 py-2 text-sm tabular-nums ${r.stabColor}`}>{r.stability}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-sm text-teal-600 mt-3 flex items-center gap-1 cursor-pointer hover:text-teal-700">View full scoring detail <ArrowRight className="w-3 h-3" /></p>
      </div>

      {/* Comparison Panel */}
      <div ref={setRef("Comparison")} data-section="Comparison" className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">Comparison</h3>
          <span className="text-xs text-slate-400">3 executions compared</span>
        </div>
        <div className="border-b border-slate-200 mb-3" />

        <span className="text-xs text-slate-500 uppercase tracking-wide block mb-2">Structural Change Over Time</span>
        <table className="w-full">
          <thead><tr className="border-b border-slate-200">
            {["Execution", "Date", "Unique Domains", "Top 5 Share", "HHI", "Dell Inclusion", "Δ Top 5 Share", "Δ Inclusion"].map(h => (
              <th key={h} className="text-xs text-slate-500 uppercase tracking-wide font-medium text-left pb-2 px-3">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              { id: "EX-0315-003", date: "Mar 22", domains: "18", top5: "74.8%", top5Color: "text-amber-600", hhi: "0.183", hhiColor: "text-amber-600", inclusion: "71.4%", inclColor: "text-slate-800", dTop5: "—", dInclusion: "—", dTop5Color: "text-slate-400", dInclColor: "text-slate-400" },
              { id: "EX-0322-002", date: "Mar 29", domains: "21", top5: "71.2%", top5Color: "text-amber-600", hhi: "0.161", hhiColor: "text-amber-600", inclusion: "78.6%", inclColor: "text-slate-800", dTop5: "−3.6pp", dInclusion: "+7.2pp", dTop5Color: "text-green-600", dInclColor: "text-green-600" },
              { id: "EX-0329-001", date: "Apr 3", domains: "24", top5: "68.4%", top5Color: "text-slate-800", hhi: "0.142", hhiColor: "text-slate-800", inclusion: "82.9%", inclColor: "text-green-600", dTop5: "−2.8pp", dInclusion: "+4.3pp", dTop5Color: "text-green-600", dInclColor: "text-green-600" },
            ].map((r, i) => (
              <tr key={r.id} className={`${i % 2 === 1 ? "bg-slate-50" : ""} hover:bg-teal-50`}>
                <td className="px-3 py-2 font-mono text-xs text-slate-400">{r.id}</td>
                <td className="px-3 py-2 text-sm text-slate-600">{r.date}</td>
                <td className="px-3 py-2 text-sm tabular-nums text-center text-slate-800">{r.domains}</td>
                <td className={`px-3 py-2 text-sm tabular-nums font-semibold ${r.top5Color}`}>{r.top5}</td>
                <td className={`px-3 py-2 text-sm tabular-nums font-semibold ${r.hhiColor}`}>{r.hhi}</td>
                <td className={`px-3 py-2 text-sm tabular-nums font-semibold ${r.inclColor}`}>{r.inclusion}</td>
                <td className={`px-3 py-2 text-sm tabular-nums ${r.dTop5Color}`}>{r.dTop5}</td>
                <td className={`px-3 py-2 text-sm tabular-nums ${r.dInclColor}`}>{r.dInclusion}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-teal-50 border border-teal-100 rounded-md px-4 py-3 mt-4 flex items-start gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-teal-700">Positive trajectory: concentration is decreasing (Top 5 Share −6.4pp across 3 runs) while brand inclusion is increasing (+11.5pp). Signal strength improving.</p>
        </div>
        <p className="text-sm text-teal-600 mt-3 flex items-center gap-1 cursor-pointer hover:text-teal-700">View full comparison <ArrowRight className="w-3 h-3" /></p>

        <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 flex items-center justify-between mt-6">
          <span className="text-xs text-slate-500">Export data for this project:</span>
          <div className="flex gap-2">
            {["Domain Dataset", "Category Summary", "Inclusion Metrics"].map(l => (
              <button key={l} className="flex items-center gap-1 border border-slate-200 text-slate-600 text-xs h-7 px-3 rounded-md hover:bg-white">
                <Download className="w-3 h-3" /> {l}
              </button>
            ))}
            <button className="flex items-center gap-1 bg-teal-600 text-white text-xs h-7 px-3 rounded-md hover:bg-teal-700">
              <Download className="w-3 h-3" /> Export All (ZIP)
            </button>
          </div>
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
};

const ProjectDetail = ({ projectName, onOpenContext }: ProjectDetailProps) => {
  const [activeSection, setActiveSection] = useState("Overview");
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [showAddContext, setShowAddContext] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (selectedContext) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute("data-section") || "Overview");
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );
    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [selectedContext]);

  const setRef = (name: string) => (el: HTMLDivElement | null) => { sectionRefs.current[name] = el; };
  const scrollTo = (name: string) => {
    sectionRefs.current[name]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (selectedContext) {
    return <ContextDetailView contextName={selectedContext} projectName={projectName} onBack={() => setSelectedContext(null)} />;
  }

  if (isDraft(projectName)) {
    const hasNoContexts = true;
    return (
      <div>
        <div className="flex items-center justify-center gap-3 mb-8 mt-4">
          <PipelineStep label="Prompt Pack" status="pending" />
          <Arrow />
          <PipelineStep label="Execution" status="pending" />
          <Arrow />
          <PipelineStep label="Parsing" status="pending" />
          <Arrow />
          <PipelineStep label="Scoring" status="pending" />
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-10 text-center max-w-md mx-auto mt-8">
          <Rocket className="w-9 h-9 text-slate-300 mx-auto" />
          <p className="font-medium text-slate-500 mt-3">This project has no executions yet</p>
          <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">Add contexts and activate your prompt pack to begin.</p>
          <button className="mt-4 h-9 bg-teal-600 text-white text-sm px-4 rounded-md hover:bg-teal-700">Add First Context →</button>
          <br />
          <button className="mt-2 h-9 border border-slate-200 text-slate-500 text-sm px-4 rounded-md opacity-60 cursor-not-allowed" title="Add contexts first">
            Run First Execution
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Sticky sub-nav */}
      <div className="sticky top-12 z-30 bg-white border-b border-slate-100 shadow-sm -mx-6 px-6 mb-6">
        <div className="flex gap-4 py-2">
          {sections.map(s => (
            <button key={s} onClick={() => scrollTo(s)}
              className={`text-xs pb-1 transition-colors ${activeSection === s ? "text-teal-600 font-medium border-b-2 border-teal-600" : "text-slate-500 hover:text-slate-700"}`}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* PANEL A: Overview */}
      <div ref={setRef("Overview")} data-section="Overview">
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-6 py-4 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-8">
              {[
                ["Brand", "Dell Technologies"],
                ["Category", "Laptops"],
                ["Market", "United States"],
                ["Target Brand", "Dell"],
              ].map(([l, v]) => (
                <div key={l}>
                  <span className="text-xs text-slate-500">{l}</span>
                  <p className="text-sm text-slate-800">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 border border-slate-200 text-slate-600 text-sm h-8 px-3 rounded-md hover:bg-slate-50">
                <Edit2 className="w-3.5 h-3.5" /> Edit Project
              </button>
              <button className="flex items-center gap-1.5 bg-teal-600 text-white text-sm h-8 px-3 rounded-md hover:bg-teal-700">
                <Play className="w-3.5 h-3.5" /> Run Execution →
              </button>
            </div>
          </div>
          <div className="flex gap-8 mt-4 pt-3 border-t border-slate-200">
            <div><span className="text-xs text-slate-500">Total Executions</span><p className="text-xl font-semibold text-slate-800">3</p></div>
            <div>
              <span className="text-xs text-slate-500">Active Contexts</span>
              <p className="text-xl font-semibold text-slate-800">2</p>
              <span className="text-xs text-slate-400">of 3 total</span>
            </div>
            <div><span className="text-xs text-slate-500">Latest Inclusion Rate</span><p className="text-xl font-semibold text-green-600">82%</p></div>
            <div><span className="text-xs text-slate-500">Competitor Set</span><p className="text-sm text-slate-500">HP · Lenovo · Apple</p></div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-2">
          <PipelineStep label="Prompt Pack" status="done" />
          <Arrow />
          <PipelineStep label="Execution" status="running" />
          <Arrow />
          <PipelineStep label="Parsing" status="done" />
          <Arrow />
          <PipelineStep label="Scoring" status="done" />
        </div>
        <p className="text-xs text-slate-400 italic text-center mb-8">Pipeline last fully completed: Apr 3, 2026 · Execution in progress</p>
      </div>

      {/* PANEL B: Contexts */}
      <div ref={setRef("Contexts")} data-section="Contexts" className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">Contexts</h3>
          <button className="flex items-center gap-1.5 bg-teal-600 text-white text-sm h-8 px-3 rounded-md hover:bg-teal-700">
            <Plus className="w-3.5 h-3.5" /> Add Context
          </button>
        </div>
        <div className="border-b border-slate-200 mb-3" />

        {contextData.map(ctx => (
          <div
            key={ctx.name}
            onClick={() => {
              setSelectedContext(ctx.name);
              onOpenContext?.(ctx.name);
            }}
            className="rounded-lg border border-slate-200 bg-white p-4 mb-3 cursor-pointer hover:border-teal-300 hover:shadow-sm transition-all flex items-center"
          >
            <div className="flex items-center gap-3 flex-1">
              <span className={`w-2 h-2 rounded-full ${statusDotColor[ctx.status]} flex-shrink-0`} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{ctx.name}</p>
                {ctx.description && <p className="text-xs text-slate-400 italic mt-0.5">{ctx.description}</p>}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="text-xs text-slate-500">Prompts</span>
                <p className="text-sm font-medium text-slate-700">{ctx.prompts} prompts</p>
              </div>
              <div className="text-center">
                <span className="text-xs text-slate-500">Last Execution</span>
                <p className="text-sm font-medium text-slate-700">{ctx.lastExecution || "Never"}</p>
              </div>
              <span className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${statusBadgeStyle[ctx.status]}`}>{ctx.status}</span>
              <button className="text-slate-400 hover:text-slate-600" onClick={e => e.stopPropagation()}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        ))}

        <p className="text-xs text-slate-400 italic mt-3">Recommended: 3–5 contexts per project. Each context represents a distinct discovery lens.</p>
      </div>

      <div className="h-20" />
    </div>
  );
};

export default ProjectDetail;
