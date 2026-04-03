import { useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import { TrendingDown, TrendingUp } from "lucide-react";

const executions = [
  { id: "EX-0329-001", date: "Apr 3", full: "Apr 3, 2026" },
  { id: "EX-0322-002", date: "Mar 29", full: "Mar 29, 2026" },
  { id: "EX-0315-003", date: "Mar 22", full: "Mar 22, 2026" },
];

const concentrationRows = [
  { ex: "EX-0315-003", date: "Mar 22, 2026", mentions: 210, domains: 18, top5: 74.8, hhi: 0.183, dTop5: null, dHhi: null },
  { ex: "EX-0322-002", date: "Mar 29, 2026", mentions: 268, domains: 21, top5: 71.2, hhi: 0.161, dTop5: "−3.6pp", dHhi: "−0.022" },
  { ex: "EX-0329-001", date: "Apr 3, 2026", mentions: 312, domains: 24, top5: 68.4, hhi: 0.142, dTop5: "−2.8pp", dHhi: "−0.019" },
];

const inclusionRows = [
  { ex: "EX-0315-003", date: "Mar 22, 2026", rate: 71.4, runs: "in 25 of 35", stability: 0.71, delta: null },
  { ex: "EX-0322-002", date: "Mar 29, 2026", rate: 78.6, runs: "in 27 of 35", stability: 0.76, delta: "+7.2pp" },
  { ex: "EX-0329-001", date: "Apr 3, 2026", rate: 82.9, runs: "in 29 of 35", stability: 0.81, delta: "+4.3pp" },
];

const coreStability = [
  { domain: "rtings.com", t1: "Core", t2: "Core", t3: "Core", stability: "Stable Core", sColor: "bg-teal-100 text-teal-700" },
  { domain: "notebookcheck.net", t1: "Core", t2: "Core", t3: "Core", stability: "Stable Core", sColor: "bg-teal-100 text-teal-700" },
  { domain: "pcmag.com", t1: "Core", t2: "Core", t3: "Core", stability: "Stable Core", sColor: "bg-teal-100 text-teal-700" },
  { domain: "tomshardware.com", t1: "Strong", t2: "Core", t3: "Core", stability: "Improving", sColor: "bg-green-50 text-green-600" },
  { domain: "bestbuy.com", t1: "Strong", t2: "Strong", t3: "Strong", stability: "Stable — not Core", sColor: "bg-slate-100 text-slate-500" },
  { domain: "amazon.com", t1: "Strong", t2: "Strong", t3: "Strong", stability: "Stable — not Core", sColor: "bg-slate-100 text-slate-500" },
  { domain: "theverge.com", t1: "Peripheral", t2: "Strong", t3: "Strong", stability: "Improving", sColor: "bg-green-50 text-green-600" },
  { domain: "techradar.com", t1: "Peripheral", t2: "Peripheral", t3: "Strong", stability: "Improving", sColor: "bg-green-50 text-green-600" },
  { domain: "dell.com", t1: "Peripheral", t2: "Peripheral", t3: "Strong", stability: "Improving", sColor: "bg-green-50 text-green-600" },
];

const tierText: Record<string, string> = { Core: "text-teal-600 font-medium", Strong: "text-blue-500", Peripheral: "text-slate-400" };

const ComparisonTab = () => {
  const [selected, setSelected] = useState(executions.map((e) => e.id));
  const toggle = (id: string) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  return (
    <div>
      <SectionHeader
        title="Longitudinal Comparison"
        right={<span className="text-xs text-muted-foreground">Dell — Laptops — US · GPT-4o · 3 executions</span>}
      />
      <p className="text-xs text-muted-foreground italic mt-1 mb-4">
        Each execution is an independent, time-stamped snapshot. Comparing snapshots reveals structural change in the AI discovery environment over time.
      </p>

      {/* Selector */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-muted-foreground mr-2">Compare executions:</span>
        {executions.map((e) => (
          <button
            key={e.id}
            onClick={() => toggle(e.id)}
            className={`rounded-full px-3 py-1 text-xs border cursor-pointer transition-colors ${
              selected.includes(e.id) ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground"
            }`}
          >
            {selected.includes(e.id) ? "☑" : "☐"} {e.id} · {e.date}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-4">Select 2–3 executions to compare. Executions must share the same prompt pack and model for valid comparison.</p>

      {/* Concentration Trend */}
      <h3 className="text-sm font-medium text-foreground mt-4 mb-2">Concentration Metrics Over Time</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="table-header text-left py-2 w-[130px]">Execution</th>
              <th className="table-header text-left py-2 w-[130px]">Date</th>
              <th className="table-header text-center py-2 w-[110px]">Total Mentions</th>
              <th className="table-header text-center py-2 w-[110px]">Unique Domains</th>
              <th className="table-header text-center py-2 w-[100px]">Top 5 Share</th>
              <th className="table-header text-center py-2 w-[80px]">HHI</th>
              <th className="table-header text-center py-2 w-[110px]">Δ Top 5 Share</th>
              <th className="table-header text-center py-2 w-[90px]">Δ HHI</th>
            </tr>
          </thead>
          <tbody>
            {concentrationRows.map((r, i) => (
              <tr key={r.ex} className={`border-b border-border ${i % 2 === 1 ? "bg-muted/50" : ""}`}>
                <td className="py-2 font-mono text-muted-foreground">{r.ex}</td>
                <td className="py-2 text-muted-foreground">{r.date}</td>
                <td className="py-2 tabular text-center">{r.mentions}</td>
                <td className="py-2 tabular text-center">{r.domains}</td>
                <td className="py-2 tabular text-center font-semibold">{r.top5}%</td>
                <td className="py-2 tabular text-center font-semibold">{r.hhi.toFixed(3)}</td>
                <td className="py-2 tabular text-center text-green-600">{r.dTop5 || "—"}</td>
                <td className="py-2 tabular text-center text-green-600">{r.dHhi || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 bg-green-50 border border-green-100 rounded-md p-3 text-xs text-green-700 flex items-start gap-2">
        <TrendingDown className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <span>Top 5 Share has decreased from 74.8% → 68.4% over 3 executions (−6.4pp). HHI has decreased from 0.183 → 0.142 (−0.041). The authority ecosystem is becoming progressively more distributed.</span>
      </div>

      {/* Inclusion Trend */}
      <h3 className="text-sm font-medium text-foreground mt-6 mb-2">Brand Inclusion Over Time</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="table-header text-left py-2 w-[130px]">Execution</th>
              <th className="table-header text-left py-2 w-[130px]">Date</th>
              <th className="table-header text-center py-2 w-[140px]">Dell Inclusion Rate</th>
              <th className="table-header text-center py-2 w-[130px]">Runs Mentioned</th>
              <th className="table-header text-center py-2 w-[130px]">Inclusion Stability</th>
              <th className="table-header text-center py-2 w-[130px]">Δ Inclusion Rate</th>
            </tr>
          </thead>
          <tbody>
            {inclusionRows.map((r, i) => (
              <tr key={r.ex} className={`border-b border-border ${i % 2 === 1 ? "bg-muted/50" : ""}`}>
                <td className="py-2 font-mono text-muted-foreground">{r.ex}</td>
                <td className="py-2 text-muted-foreground">{r.date}</td>
                <td className="py-2 tabular text-center font-semibold">{r.rate}%</td>
                <td className="py-2 tabular text-center text-muted-foreground">{r.runs}</td>
                <td className="py-2 tabular text-center">{r.stability.toFixed(2)}</td>
                <td className="py-2 tabular text-center">
                  {r.delta ? (
                    <span className="text-green-600 flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {r.delta}
                    </span>
                  ) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 bg-primary/5 border border-primary/20 rounded-md p-3 text-xs text-primary flex items-start gap-2">
        <TrendingUp className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <span>Dell's narrative inclusion rate has increased from 71.4% → 82.9% (+11.5pp) over 3 runs. Inclusion Stability has also improved (0.71 → 0.81), indicating a stronger and more consistent brand presence in AI-generated responses.</span>
      </div>

      {/* Authority Core Stability */}
      <h3 className="text-sm font-medium text-foreground mt-6 mb-1">Authority Core Stability</h3>
      <p className="text-xs text-muted-foreground italic mb-3">Stable core domains appear in the Authority Core in every execution. Emerging domains have moved into the Core. Declining domains have dropped out.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="table-header text-left py-2 w-[180px]">Domain</th>
              <th className="table-header text-center py-2 w-[80px]">Mar 22</th>
              <th className="table-header text-center py-2 w-[80px]">Mar 29</th>
              <th className="table-header text-center py-2 w-[80px]">Apr 3</th>
              <th className="table-header text-center py-2 w-[120px]">Stability</th>
            </tr>
          </thead>
          <tbody>
            {coreStability.map((r, i) => (
              <tr key={r.domain} className={`border-b border-border ${i % 2 === 1 ? "bg-muted/50" : ""}`}>
                <td className="py-2 font-mono text-foreground">{r.domain}</td>
                <td className={`py-2 text-center text-xs ${tierText[r.t1]}`}>{r.t1}</td>
                <td className={`py-2 text-center text-xs ${tierText[r.t2]}`}>{r.t2}</td>
                <td className={`py-2 text-center text-xs ${tierText[r.t3]}`}>{r.t3}</td>
                <td className="py-2 text-center"><span className={`text-xs rounded-full px-2 py-0.5 ${r.sColor}`}>{r.stability}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 bg-muted/50 border border-border rounded-md p-3 text-xs text-muted-foreground">
        3 domains (rtings.com, notebookcheck.net, pcmag.com) have been Stable Core across all 3 executions, representing persistent structural authority. tomshardware.com and dell.com both improved to Core/Strong in the most recent execution — a positive structural signal.
      </div>
    </div>
  );
};

export default ComparisonTab;
