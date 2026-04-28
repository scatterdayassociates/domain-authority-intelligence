import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { TrendingUp, Minus, Download, LineChart as LineChartIcon } from "lucide-react";
import type { InsightMode } from "@/pages/Insights";
import { downloadCsv, buildFilename } from "@/lib/csvExport";

interface Props {
  mode: InsightMode;
  context: string;
}

type SubTab = "domain" | "brand" | "concentration" | "narrative";

const months = ["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026"];

const domainData = months.map((m, i) => ({
  month: m,
  techradar: [58, 61, 55, 63, 60, 58][i],
  pcmag: [45, 42, 47, 44, 46, 48][i],
  notebookcheck: [38, 40, 36, 41, 39, 42][i],
  bestbuy: [25, 28, 24, 27, 29, 26][i],
  dell: [17, 19, 15, 20, 22, 25][i],
}));

const brandData = months.map((m, i) => ({
  month: m,
  Dell: [60, 65, 62, 70, 72, 75][i],
  Apple: [55, 52, 58, 54, 50, 50][i],
  HP: [40, 38, 42, 39, 37, 35][i],
  Lenovo: [30, 33, 28, 31, 30, 32][i],
}));

const concData = months.map((m, i) => ({
  month: m,
  hhi: [0.262, 0.255, 0.248, 0.25, 0.244, 0.245][i],
  top5: [1.0, 1.0, 0.98, 1.0, 1.0, 1.0][i],
}));

const narrativeData = months.map((m, i) => ({
  month: m,
  affordability: [62, 65, 68, 72, 65, 68][i],
  generalUse: [56, 54, 54, 50, 58, 54][i],
  gaming: [30, 33, 32, 35, 30, 32][i],
}));

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 text-white rounded-md px-3 py-2 text-xs shadow-lg">
      <div className="font-medium mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="font-mono">{p.name}:</span>
          <span className="tabular-nums">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const Legend = ({ items }: { items: { color: string; label: string; dashed?: boolean; highlight?: boolean }[] }) => (
  <div className="flex flex-wrap gap-3 justify-center mt-3 text-xs text-slate-500">
    {items.map((it) => (
      <div
        key={it.label}
        className={`flex items-center gap-1.5 ${
          it.highlight
            ? "bg-slate-900 text-white px-2 py-0.5 rounded-full font-semibold ring-1 ring-slate-900/10"
            : ""
        }`}
      >
        <span
          className="inline-block w-3.5"
          style={{
            background: it.color,
            height: it.highlight ? 3 : 2,
            borderTop: it.dashed ? `2px dashed ${it.color}` : undefined,
          }}
        />
        <span className="font-mono">{it.label}</span>
      </div>
    ))}
  </div>
);

const ExportDropdown = ({ context }: { context: string }) => {
  const [open, setOpen] = useState(false);
  const exports: Record<string, { label: string; rows: (string | number)[][]; type: string }> = {
    domain: {
      label: "Domain Trends CSV",
      type: "domain-trends",
      rows: [
        ["Month", "techradar.com", "pcmag.com", "notebookcheck.net", "bestbuy.com", "dell.com"],
        ...domainData.map((d) => [d.month, d.techradar, d.pcmag, d.notebookcheck, d.bestbuy, d.dell]),
      ],
    },
    brand: {
      label: "Brand Trends CSV",
      type: "brand-trends",
      rows: [
        ["Month", "Dell", "Apple", "HP", "Lenovo"],
        ...brandData.map((d) => [d.month, d.Dell, d.Apple, d.HP, d.Lenovo]),
      ],
    },
    concentration: {
      label: "Concentration Trends CSV",
      type: "concentration-trends",
      rows: [["Month", "HHI", "Top 5 Share"], ...concData.map((d) => [d.month, d.hhi, d.top5])],
    },
    narrative: {
      label: "Narrative Trends CSV",
      type: "narrative-trends",
      rows: [
        ["Month", "Affordability (%)", "General use (%)", "Gaming (%)"],
        ...narrativeData.map((d) => [d.month, d.affordability, d.generalUse, d.gaming]),
      ],
    },
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="border border-slate-200 text-slate-600 text-xs h-7 px-3 rounded-md inline-flex items-center gap-1.5 hover:bg-slate-50"
      >
        <Download className="w-3 h-3" /> Export Chart Data
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-20 py-1">
            {Object.values(exports).map((e) => (
              <button
                key={e.type}
                onClick={() => {
                  downloadCsv(buildFilename(context, e.type), e.rows);
                  setOpen(false);
                }}
                className="w-full text-left text-xs text-slate-700 px-3 py-1.5 hover:bg-slate-50"
              >
                {e.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const SnapshotEmpty = () => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
      <LineChartIcon className="w-4 h-4 text-slate-400" />
    </div>
    <p className="text-sm font-medium text-slate-600">Trend view unavailable in Snapshot mode</p>
    <p className="text-xs text-slate-400 mt-1">Switch to Trends mode to view changes over time.</p>
  </div>
);

const TimeSeriesPanel = ({ mode, context }: Props) => {
  const [subTab, setSubTab] = useState<SubTab>("domain");
  const isSnapshot = mode === "snapshot";

  const dData = domainData;
  const bData = brandData;
  const cData = concData;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {[
            { id: "domain", label: "Domain Trends" },
            { id: "brand", label: "Brand Trends" },
            { id: "concentration", label: "Concentration Trends" },
            { id: "narrative", label: "Narrative Trends" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id as SubTab)}
              className={`text-xs font-medium rounded-full px-3 py-1 transition-colors ${
                subTab === t.id ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <ExportDropdown context={context} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mt-3" aria-label={`${subTab} trends chart`}>
        {/* DOMAIN TRENDS */}
        {subTab === "domain" && (
          isSnapshot ? <SnapshotEmpty /> : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 uppercase tracking-wide">Domain Visibility Over Time</span>
              <button className="border border-slate-200 text-xs h-7 px-2 rounded-md text-slate-600">
                Showing: 5 domains
              </button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 2" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis
                  label={{ value: "Persistence (%)", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#94a3b8" } }}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="techradar" name="techradar.com" stroke="#94a3b8" strokeOpacity={0.7} strokeWidth={1.5} dot={{ r: 3, fill: "#94a3b8", stroke: "#fff", strokeWidth: 1.5 }} />
                <Line type="monotone" dataKey="pcmag" name="pcmag.com" stroke="#cbd5e1" strokeOpacity={0.8} strokeWidth={1.5} dot={{ r: 3, fill: "#cbd5e1", stroke: "#fff", strokeWidth: 1.5 }} />
                <Line type="monotone" dataKey="notebookcheck" name="notebookcheck.net" stroke="#a3a3a3" strokeOpacity={0.7} strokeWidth={1.5} dot={{ r: 3, fill: "#a3a3a3", stroke: "#fff", strokeWidth: 1.5 }} />
                <Line type="monotone" dataKey="bestbuy" name="bestbuy.com" stroke="#fbbf24" strokeOpacity={0.8} strokeWidth={1.5} dot={{ r: 3, fill: "#fbbf24", stroke: "#fff", strokeWidth: 1.5 }} />
                <Line type="monotone" dataKey="dell" name="dell.com" stroke="#dc2626" strokeWidth={3.5} dot={{ r: 5, fill: "#dc2626", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 7, fill: "#dc2626", stroke: "#fff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
            <Legend
              items={[
                { color: "#dc2626", label: "dell.com (TARGET)", highlight: true },
                { color: "#94a3b8", label: "techradar.com" },
                { color: "#cbd5e1", label: "pcmag.com" },
                { color: "#a3a3a3", label: "notebookcheck.net" },
                { color: "#fbbf24", label: "bestbuy.com" },
              ]}
            />
          </div>
          )
        )}
          </div>
          )
        )}

        {/* BRAND TRENDS */}
        {subTab === "brand" && (
          isSnapshot ? <SnapshotEmpty /> : (
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wide block mb-2">Brand Inclusion Rate Over Time</span>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={bData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 2" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis
                  label={{ value: "Inclusion Rate (%)", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#94a3b8" } }}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="Dell" stroke="#0d9488" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 4, fill: "#0d9488", stroke: "#fff", strokeWidth: 2 }} />
                <Line type="monotone" dataKey="Apple" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }} />
                <Line type="monotone" dataKey="HP" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }} />
                <Line type="monotone" dataKey="Lenovo" stroke="#94a3b8" strokeWidth={2} dot={{ r: 4, fill: "#94a3b8", stroke: "#fff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
            <Legend
              items={[
                { color: "#0d9488", label: "Dell (TARGET)", dashed: true },
                { color: "#3b82f6", label: "Apple" },
                { color: "#f59e0b", label: "HP" },
                { color: "#94a3b8", label: "Lenovo" },
              ]}
            />
            <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-2 text-xs text-green-700 flex items-center gap-2 mt-3">
              <TrendingUp className="w-3 h-3" />
              Dell's inclusion rate has increased by +15pp across 6 executions. Competitors Apple and HP show stable or declining trends.
            </div>
          </div>
          )
        )}

        {/* NARRATIVE TRENDS */}
        {subTab === "narrative" && (
          isSnapshot ? <SnapshotEmpty /> : (
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wide block mb-2">Brand Narrative Share Over Time</span>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={narrativeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 2" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis
                  domain={[0, 100]}
                  label={{ value: "Inclusion (%)", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#94a3b8" } }}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="affordability" name="Affordability" stroke="#e11d48" strokeWidth={2} dot={{ r: 4, fill: "#e11d48", stroke: "#fff", strokeWidth: 2 }} />
                <Line type="monotone" dataKey="generalUse" name="General use" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }} />
                <Line type="monotone" dataKey="gaming" name="Gaming" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
            <Legend
              items={[
                { color: "#e11d48", label: "Affordability" },
                { color: "#3b82f6", label: "General use" },
                { color: "#8b5cf6", label: "Gaming" },
              ]}
            />
            <div className="bg-rose-50 border border-rose-100 rounded-lg px-4 py-2 text-xs text-rose-700 flex items-center gap-2 mt-3">
              <TrendingUp className="w-3 h-3" />
              Affordability remains the dominant narrative for Dell (avg 67%). General use and Gaming positioning are stable across executions.
            </div>
          </div>
          )
        )}

        {/* CONCENTRATION TRENDS */}
        {subTab === "concentration" && (
          isSnapshot ? <SnapshotEmpty /> : (
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wide block mb-2">Category Concentration Over Time</span>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={cData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 2" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis
                  yAxisId="left"
                  domain={[0, 1]}
                  label={{ value: "HHI", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#94a3b8" } }}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 1]}
                  label={{ value: "Top 5 Share", angle: 90, position: "insideRight", style: { fontSize: 11, fill: "#94a3b8" } }}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceArea yAxisId="left" y1={0.15} y2={0.3} fill="#f59e0b" fillOpacity={0.05} label={{ value: "Moderate", position: "insideTopRight", style: { fontSize: 10, fill: "#fbbf24" } }} />
                <Line yAxisId="left" type="monotone" dataKey="hhi" name="HHI" stroke="#334155" strokeWidth={2} dot={{ r: 4, fill: "#334155", stroke: "#fff", strokeWidth: 2 }} />
                <Line yAxisId="right" type="monotone" dataKey="top5" name="Top 5 Share" stroke="#2dd4bf" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 4, fill: "#2dd4bf", stroke: "#fff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
            <Legend
              items={[
                { color: "#334155", label: "HHI" },
                { color: "#2dd4bf", label: "Top 5 Share", dashed: true },
              ]}
            />
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 text-xs text-blue-700 flex items-center gap-2 mt-3">
              <Minus className="w-3 h-3" />
              Category structure is stable. HHI has remained within the Moderate range across all 6 executions (0.244–0.262). No structural shift detected.
            </div>
          </div>
          )
        )}
      </div>
    </div>
  );
};

export default TimeSeriesPanel;
