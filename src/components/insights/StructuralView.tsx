import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { PieChart, BarChart as BarChartIcon, Info, Download } from "lucide-react";
import { downloadCsv, buildFilename } from "@/lib/csvExport";

interface Props {
  context: string;
}

const distributionData = [
  { domain: "techradar.com", share: 22 },
  { domain: "pcmag.com", share: 18 },
  { domain: "notebookcheck.net", share: 15 },
  { domain: "bestbuy.com", share: 11 },
  { domain: "tomsguide.com", share: 9 },
];

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 text-white rounded-md px-3 py-2 text-xs shadow-lg">
      <span className="font-mono">{payload[0].payload.domain}</span>: <span className="tabular-nums">{payload[0].value}%</span>
    </div>
  );
};

const StructuralView = ({ context }: Props) => {
  const handleExport = () => {
    const rows: (string | number)[][] = [
      ["Section", "Item", "Value"],
      ["Source Mediation", "Publishers", "75%"],
      ["Source Mediation", "Brands", "25%"],
      ["Distribution", "Top 5 Share", "75%"],
      ["Distribution", "HHI", "0.245"],
      ...distributionData.map((d) => ["Top Domain", d.domain, `${d.share}%`]),
    ];
    downloadCsv(buildFilename(context, "structural-distribution"), rows);
  };

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={handleExport}
          className="border border-slate-200 text-slate-600 text-xs h-7 px-3 rounded-md inline-flex items-center gap-1.5 hover:bg-slate-50"
        >
          <Download className="w-3 h-3" /> Export Distribution CSV
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Publisher vs Brand */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Source Mediation</span>
            <PieChart className="w-3.5 h-3.5 text-slate-300" />
          </div>
          <div className="mt-3 h-6 rounded-full overflow-hidden flex">
            <div className="bg-teal-500 flex items-center justify-center" style={{ width: "75%" }}>
              <span className="text-[11px] text-white font-medium">Publishers 75%</span>
            </div>
            <div className="bg-amber-400 flex items-center justify-center" style={{ width: "25%" }}>
              <span className="text-[11px] text-white font-medium">Brands 25%</span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <span className="text-[11px] text-teal-600">Publishers</span>
              <p className="text-lg font-semibold text-slate-800 tabular-nums">75%</p>
              <p className="text-xs text-slate-400">9 of 12 domains</p>
            </div>
            <div>
              <span className="text-[11px] text-amber-500">Brands</span>
              <p className="text-lg font-semibold text-slate-800 tabular-nums">25%</p>
              <p className="text-xs text-slate-400">3 of 12 domains</p>
            </div>
          </div>
          <div className="mt-4 bg-teal-50 border border-teal-100 rounded-md px-3 py-2 text-xs text-teal-700 flex items-start gap-2">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>Publisher-mediated ecosystem. Discovery is primarily shaped by editorial and review sources, not direct brand destinations.</span>
          </div>
        </div>

        {/* Distribution Shape */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Distribution Shape</span>
            <BarChartIcon className="w-3.5 h-3.5 text-slate-300" />
          </div>
          <ResponsiveContainer width="100%" height={160} aria-label="Top domain distribution">
            <BarChart data={distributionData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }} barSize={20}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 2" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="domain" tick={{ fontSize: 11, fill: "#475569", fontFamily: "monospace" }} axisLine={false} tickLine={false} width={130} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="share" fill="#2dd4bf" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">Top 5 = 75% of all mentions</span>
            <span className="bg-amber-50 text-amber-600 text-xs px-2 py-0.5 rounded-full">HHI: 0.245 · Moderate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructuralView;
