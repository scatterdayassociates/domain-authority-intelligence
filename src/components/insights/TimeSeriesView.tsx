import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Calendar,
  Globe,
  Target,
  BarChart3,
  Sparkles,
  ChevronRight,
  Download,
} from "lucide-react";
import { downloadCsv, buildFilename } from "@/lib/csvExport";

interface Props {
  context: string;
}

type EntityType = "domain" | "brand" | "narrative";
type Lens = "domain" | "brand" | "concentration" | "narrative";

// ---------- Mock dataset (execution-level, discrete) ----------
const allMonths = [
  "Jan 2026",
  "Feb 2026",
  "Mar 2026",
  "Apr 2026",
  "May 2026",
  "Jun 2026",
  "Jul 2026",
  "Aug 2026",
  "Sep 2026",
];

type Row = Record<string, number | string> & { month: string };

const domainSeries: Record<string, number[]> = {
  "techradar.com":      [58, 61, 55, 63, 60, 58, 62, 64, 61],
  "pcmag.com":          [45, 42, 47, 44, 46, 48, 45, 43, 41],
  "notebookcheck.net":  [38, 40, 36, 41, 39, 42, 44, 45, 47],
  "bestbuy.com":        [25, 28, 24, 27, 29, 26, 28, 30, 31],
  "dell.com":           [17, 19, 15, 20, 22, 25, 27, 29, 32],
  "tomshardware.com":   [33, 31, 35, 32, 34, 33, 31, 30, 28],
  "laptopmag.com":      [22, 24, 21, 23, 25, 24, 22, 20, 19],
  "reddit.com":         [12, 15, 13, 17, 16, 18, 19, 21, 22],
  "engadget.com":       [18, 17, 19, 20, 18, 17, 16, 15, 14],
  "cnet.com":           [29, 27, 31, 28, 30, 32, 30, 29, 27],
  "amazon.com":         [14, 16, 18, 17, 19, 21, 23, 25, 26],
  "verge.com":          [11, 12, 13, 12, 14, 15, 14, 13, 12],
};

const brandSeries: Record<string, number[]> = {
  Dell:    [60, 65, 62, 70, 72, 75, 78, 80, 82],
  Apple:   [55, 52, 58, 54, 50, 50, 48, 47, 45],
  HP:      [40, 38, 42, 39, 37, 35, 36, 34, 33],
  Lenovo:  [30, 33, 28, 31, 30, 32, 33, 32, 34],
  Asus:    [22, 24, 23, 26, 28, 27, 25, 26, 28],
  Acer:    [18, 17, 19, 18, 20, 19, 21, 20, 22],
  Microsoft:[15, 17, 16, 18, 19, 20, 22, 21, 23],
  Razer:   [8, 9, 10, 11, 10, 12, 11, 13, 14],
};

const narrativeSeries: Record<string, number[]> = {
  Affordability: [62, 65, 68, 72, 65, 68, 70, 73, 75],
  "General use": [56, 54, 54, 50, 58, 54, 52, 50, 49],
  Gaming:        [30, 33, 32, 35, 30, 32, 31, 30, 29],
  Performance:   [44, 46, 48, 47, 50, 52, 53, 55, 57],
  Premium:       [38, 36, 40, 39, 37, 35, 34, 32, 31],
  Business:      [42, 44, 43, 45, 47, 48, 50, 51, 53],
};

const concentrationSeries = {
  HHI:    [0.262, 0.255, 0.248, 0.25, 0.244, 0.245, 0.252, 0.258, 0.265],
  "Top 5 Share": [82, 81, 79, 80, 78, 79, 81, 82, 83],
};

const palette = [
  "#dc2626", // target / red
  "#0ea5e9",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#14b8a6",
];

const colorFor = (name: string, index: number, target?: string) =>
  name === target ? "#dc2626" : palette[(index + 1) % palette.length];

// ---------- Helpers ----------
const computeTrend = (values: number[]) => {
  if (values.length < 2) return { delta: 0, dir: "stable" as const, consistency: 0 };
  const delta = values[values.length - 1] - values[0];
  let increasing = 0;
  let decreasing = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[i - 1]) increasing++;
    else if (values[i] < values[i - 1]) decreasing++;
  }
  const dir: "increasing" | "decreasing" | "stable" =
    Math.abs(delta) < 1
      ? "stable"
      : delta > 0
      ? "increasing"
      : "decreasing";
  const consistency =
    dir === "increasing"
      ? increasing / (values.length - 1)
      : dir === "decreasing"
      ? decreasing / (values.length - 1)
      : 1 - Math.max(increasing, decreasing) / (values.length - 1);
  return { delta, dir, consistency };
};

const confidence = (consistency: number, n: number) => {
  if (n >= 5 && consistency >= 0.75) return "High";
  if (n >= 3 && consistency >= 0.5) return "Medium";
  return "Low";
};

// ---------- Section: Controls ----------
const Controls = ({
  range,
  setRange,
  entityType,
  setEntityType,
  lens,
  setLens,
}: {
  range: [number, number];
  setRange: (r: [number, number]) => void;
  entityType: EntityType;
  setEntityType: (e: EntityType) => void;
  lens: Lens;
  setLens: (l: Lens) => void;
}) => {
  const [start, end] = range;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-700">Controls</h3>
        </div>
        <span className="text-[11px] text-slate-400 uppercase tracking-wider">
          Defines scope · does not compute data
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Time Range */}
        <div>
          <label className="text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2 block">
            Time Range
          </label>
          <div className="flex items-center gap-2">
            <select
              value={start}
              onChange={(e) => {
                const v = Number(e.target.value);
                setRange([v, Math.max(v + 1, end)]);
              }}
              className="flex-1 text-xs border border-slate-200 rounded-md h-8 px-2 bg-white"
            >
              {allMonths.map((m, i) => (
                <option key={m} value={i} disabled={i >= end}>
                  {m}
                </option>
              ))}
            </select>
            <span className="text-slate-400 text-xs">→</span>
            <select
              value={end}
              onChange={(e) => {
                const v = Number(e.target.value);
                setRange([Math.min(start, v - 1), v]);
              }}
              className="flex-1 text-xs border border-slate-200 rounded-md h-8 px-2 bg-white"
            >
              {allMonths.map((m, i) => (
                <option key={m} value={i} disabled={i <= start}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            {end - start + 1} executions · discrete data points
          </p>
        </div>

        {/* Entity Type */}
        <div>
          <label className="text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2 block">
            Entity Type
          </label>
          <div className="flex gap-1 bg-slate-100 rounded-md p-0.5">
            {(
              [
                { id: "domain", label: "Domains", icon: Globe },
                { id: "brand", label: "Brands", icon: Target },
                { id: "narrative", label: "Narrative", icon: Sparkles },
              ] as { id: EntityType; label: string; icon: any }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setEntityType(t.id);
                  // Auto-align lens with entity type
                  if (t.id === "domain") setLens("domain");
                  if (t.id === "brand") setLens("brand");
                  if (t.id === "narrative") setLens("narrative");
                }}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 text-xs h-7 rounded transition-colors ${
                  entityType === t.id
                    ? "bg-white text-slate-800 shadow-sm font-medium"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <t.icon className="w-3 h-3" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Analytical Lens */}
        <div>
          <label className="text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2 block">
            Analytical Lens
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: "domain", label: "Domain Trends", enabled: entityType === "domain" },
                { id: "brand", label: "Brand Trends", enabled: entityType === "brand" },
                { id: "concentration", label: "Concentration", enabled: true },
                { id: "narrative", label: "Narrative", enabled: entityType === "narrative" },
              ] as { id: Lens; label: string; enabled: boolean }[]
            ).map((l) => (
              <button
                key={l.id}
                disabled={!l.enabled}
                onClick={() => setLens(l.id)}
                className={`text-[11px] font-medium rounded-full px-2.5 py-1 transition-colors ${
                  lens === l.id
                    ? "bg-slate-800 text-white"
                    : l.enabled
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-slate-50 text-slate-300 cursor-not-allowed"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Section: Entity Selection ----------
const EntitySelection = ({
  entityType,
  available,
  selected,
  onToggle,
  filter,
  setFilter,
  query,
  setQuery,
  target,
}: {
  entityType: EntityType;
  available: string[];
  selected: string[];
  onToggle: (name: string) => void;
  filter: "top" | "target" | "competitors" | "all";
  setFilter: (f: "top" | "target" | "competitors" | "all") => void;
  query: string;
  setQuery: (q: string) => void;
  target: string;
}) => {
  const filtered = available.filter((n) =>
    n.toLowerCase().includes(query.toLowerCase()),
  );
  const limit = 7;
  const atLimit = selected.length >= limit;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Entity Selection</h3>
        <span className="text-[11px] text-slate-400">
          {selected.length}/{limit}
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1 mb-3">
        {(
          [
            { id: "top", label: "Top" },
            { id: "target", label: "Target" },
            { id: "competitors", label: "Competitors" },
            { id: "all", label: "All" },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`text-[11px] rounded-full px-2 py-0.5 ${
              filter === f.id
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${entityType}...`}
          className="w-full text-xs border border-slate-200 rounded-md h-8 pl-8 pr-2 bg-white focus:outline-none focus:ring-1 focus:ring-slate-300"
        />
      </div>

      {/* Entity list */}
      <div className="flex-1 overflow-y-auto space-y-1 -mx-1 px-1 max-h-[280px]">
        {filtered.map((name) => {
          const isSelected = selected.includes(name);
          const isTarget = name === target;
          const disabled = !isSelected && atLimit;
          return (
            <label
              key={name}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs ${
                isSelected ? "bg-slate-50" : "hover:bg-slate-50"
              } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={disabled}
                onChange={() => onToggle(name)}
                className="w-3 h-3 accent-slate-700"
              />
              <span className={`flex-1 truncate ${isTarget ? "font-semibold text-slate-800" : "text-slate-700"}`}>
                {name}
              </span>
              {isTarget && (
                <span className="text-[9px] uppercase font-bold text-rose-600 tracking-wider">
                  Target
                </span>
              )}
            </label>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">No matches</p>
        )}
      </div>

      {atLimit && (
        <p className="text-[11px] text-amber-600 mt-2">
          Max {limit} entities · deselect one to add another
        </p>
      )}
    </div>
  );
};

// ---------- Section: Primary Chart ----------
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 text-white rounded-md px-3 py-2 text-xs shadow-lg">
      <div className="font-medium mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="font-mono">{p.name}:</span>
          <span className="tabular-nums">
            {typeof p.value === "number" ? p.value.toLocaleString(undefined, { maximumFractionDigits: 3 }) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const PrimaryChart = ({
  lens,
  months,
  selected,
  series,
  target,
  yLabel,
  onExport,
}: {
  lens: Lens;
  months: string[];
  selected: string[];
  series: Record<string, number[]>;
  target: string;
  yLabel: string;
  onExport: () => void;
}) => {
  const data: Row[] = months.map((m, i) => {
    const r: Row = { month: m };
    selected.forEach((name) => {
      r[name] = series[name]?.[i] ?? 0;
    });
    return r;
  });

  const titles: Record<Lens, string> = {
    domain: "Domain Visibility Over Time",
    brand: "Brand Inclusion Rate Over Time",
    concentration: "Category Concentration Over Time",
    narrative: "Narrative Attribute Coverage Over Time",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">{titles[lens]}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            One point per execution · no smoothing or interpolation
          </p>
        </div>
        <button
          onClick={onExport}
          className="border border-slate-200 text-slate-600 text-xs h-7 px-3 rounded-md inline-flex items-center gap-1.5 hover:bg-slate-50"
        >
          <Download className="w-3 h-3" /> Export
        </button>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 2" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis
            label={{ value: yLabel, angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#94a3b8" } }}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} />
          {selected.map((name, i) => {
            const isTarget = name === target;
            const stroke = colorFor(name, i, target);
            return (
              <Line
                key={name}
                type="linear"
                dataKey={name}
                name={name}
                stroke={stroke}
                strokeWidth={isTarget ? 3 : 1.75}
                dot={{ r: isTarget ? 4 : 3, fill: stroke, stroke: "#fff", strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: stroke, stroke: "#fff", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center mt-3 text-xs text-slate-500">
        {selected.map((name, i) => {
          const isTarget = name === target;
          return (
            <div
              key={name}
              className={`flex items-center gap-1.5 ${
                isTarget ? "bg-slate-900 text-white px-2 py-0.5 rounded-full font-semibold" : ""
              }`}
            >
              <span
                className="inline-block w-3.5"
                style={{ background: colorFor(name, i, target), height: isTarget ? 3 : 2 }}
              />
              <span className="font-mono">{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Section: Trend Insight Panel ----------
type Insight = {
  id: string;
  statement: string;
  metric: string;
  direction: "increasing" | "decreasing" | "stable";
  confidence: "High" | "Medium" | "Low";
  entity: string;
  priority: number;
};

const generateInsights = (
  lens: Lens,
  months: string[],
  selected: string[],
  series: Record<string, number[]>,
  conc: { HHI: number[]; "Top 5 Share": number[] },
): Insight[] => {
  const insights: Insight[] = [];
  const n = months.length;

  // Always include concentration insight
  const hhiTrend = computeTrend(conc.HHI);
  insights.push({
    id: "hhi",
    statement:
      hhiTrend.dir === "stable"
        ? `Category concentration remains stable across ${n} executions.`
        : `Category concentration is ${hhiTrend.dir}, with HHI moving from ${conc.HHI[0].toFixed(3)} to ${conc.HHI[n - 1].toFixed(3)}.`,
    metric: `HHI: ${conc.HHI[0].toFixed(3)} → ${conc.HHI[n - 1].toFixed(3)}`,
    direction: hhiTrend.dir,
    confidence: confidence(hhiTrend.consistency, n),
    entity: "HHI",
    priority: 1,
  });

  // Per-entity trends
  const entityInsights: Insight[] = selected
    .map((name) => {
      const t = computeTrend(series[name] || []);
      const change = t.delta;
      const dirWord =
        t.dir === "stable"
          ? "remains stable"
          : t.dir === "increasing"
          ? "is increasing"
          : "is declining";
      const sign = change > 0 ? "+" : "";
      return {
        id: name,
        statement:
          t.dir === "stable"
            ? `${name} ${dirWord}, appearing consistently across ${n} executions.`
            : `${name} ${dirWord} across the selected range (${sign}${change}${lens === "concentration" ? "" : "pp"} over ${n} executions).`,
        metric:
          lens === "narrative" || lens === "brand" || lens === "domain"
            ? `${series[name][0]}${lens === "domain" ? "" : "%"} → ${series[name][n - 1]}${lens === "domain" ? "" : "%"}`
            : `${series[name][0]} → ${series[name][n - 1]}`,
        direction: t.dir,
        confidence: confidence(t.consistency, n),
        entity: name,
        priority: t.dir === "stable" ? 3 : Math.abs(change) >= 10 ? 2 : 4,
      } as Insight;
    });

  return [...insights, ...entityInsights]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5);
};

const DirIcon = ({ dir }: { dir: Insight["direction"] }) => {
  if (dir === "increasing")
    return <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />;
  if (dir === "decreasing")
    return <TrendingDown className="w-3.5 h-3.5 text-rose-600" />;
  return <Minus className="w-3.5 h-3.5 text-slate-400" />;
};

const ConfidencePill = ({ c }: { c: Insight["confidence"] }) => {
  const map = {
    High: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Medium: "bg-amber-50 text-amber-700 border-amber-100",
    Low: "bg-slate-50 text-slate-500 border-slate-200",
  } as const;
  return (
    <span className={`text-[10px] uppercase tracking-wider font-semibold border rounded-full px-1.5 py-0.5 ${map[c]}`}>
      {c}
    </span>
  );
};

const TrendInsightPanel = ({
  insights,
  onInsightClick,
}: {
  insights: Insight[];
  onInsightClick: (entity: string) => void;
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Trend Insights</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Rule-based · derived from observed execution-level changes
          </p>
        </div>
        <span className="text-[11px] text-slate-400">{insights.length} insights</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map((insight) => (
          <button
            key={insight.id}
            onClick={() => onInsightClick(insight.entity)}
            className="text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-3 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <DirIcon dir={insight.direction} />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  {insight.entity}
                </span>
              </div>
              <ConfidencePill c={insight.confidence} />
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mb-2">
              {insight.statement}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">{insight.metric}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ---------- Main view ----------
const TimeSeriesView = ({ context }: Props) => {
  // Default state
  const [range, setRange] = useState<[number, number]>([0, allMonths.length - 1]);
  const [entityType, setEntityType] = useState<EntityType>("domain");
  const [lens, setLens] = useState<Lens>("domain");
  const [filter, setFilter] = useState<"top" | "target" | "competitors" | "all">("top");
  const [query, setQuery] = useState("");

  // Derived month window
  const months = useMemo(
    () => allMonths.slice(range[0], range[1] + 1),
    [range],
  );

  // Active series + target
  const { series, available, target, yLabel } = useMemo(() => {
    if (lens === "concentration") {
      return {
        series: {
          HHI: concentrationSeries.HHI.slice(range[0], range[1] + 1),
          "Top 5 Share": concentrationSeries["Top 5 Share"].slice(range[0], range[1] + 1),
        } as Record<string, number[]>,
        available: ["HHI", "Top 5 Share"],
        target: "HHI",
        yLabel: "HHI",
      };
    }
    const raw =
      lens === "domain" ? domainSeries : lens === "brand" ? brandSeries : narrativeSeries;
    const sliced: Record<string, number[]> = {};
    Object.entries(raw).forEach(([k, v]) => {
      sliced[k] = v.slice(range[0], range[1] + 1);
    });
    const targets = { domain: "dell.com", brand: "Dell", narrative: "Affordability" } as const;
    const labels = {
      domain: "Persistence (%)",
      brand: "Inclusion Rate (%)",
      narrative: "Coverage Rate (%)",
    } as const;
    return {
      series: sliced,
      available: Object.keys(sliced),
      target: targets[lens as "domain" | "brand" | "narrative"],
      yLabel: labels[lens as "domain" | "brand" | "narrative"],
    };
  }, [lens, range]);

  // Entity selection (derived from filter)
  const defaultSelection = useMemo(() => {
    if (lens === "concentration") return ["HHI"];
    if (filter === "target") return [target];
    if (filter === "competitors") return available.filter((n) => n !== target).slice(0, 4);
    if (filter === "all") return available.slice(0, 7);
    // top
    const ranked = [...available]
      .sort((a, b) => {
        const aLast = series[a][series[a].length - 1];
        const bLast = series[b][series[b].length - 1];
        return bLast - aLast;
      })
      .slice(0, 5);
    if (!ranked.includes(target) && available.includes(target)) {
      ranked.pop();
      ranked.push(target);
    }
    return ranked;
  }, [filter, lens, available, target, series]);

  const [manualSelection, setManualSelection] = useState<string[] | null>(null);
  const selected = manualSelection ?? defaultSelection;

  // Reset selection when lens/filter/range changes
  const onToggle = (name: string) => {
    const next = selected.includes(name)
      ? selected.filter((n) => n !== name)
      : [...selected, name];
    setManualSelection(next);
  };

  // Reset manual when filter or lens changes
  const setFilterReset = (f: typeof filter) => {
    setManualSelection(null);
    setFilter(f);
  };
  const setLensReset = (l: Lens) => {
    setManualSelection(null);
    setLens(l);
  };
  const setEntityTypeReset = (e: EntityType) => {
    setManualSelection(null);
    setEntityType(e);
  };

  // Insights
  const insights = useMemo(
    () =>
      generateInsights(
        lens,
        months,
        selected,
        series,
        {
          HHI: concentrationSeries.HHI.slice(range[0], range[1] + 1),
          "Top 5 Share": concentrationSeries["Top 5 Share"].slice(range[0], range[1] + 1),
        },
      ),
    [lens, months, selected, series, range],
  );

  // Export
  const handleExport = () => {
    const header = ["Month", ...selected];
    const rows: (string | number)[][] = [header];
    months.forEach((m, i) => {
      rows.push([m, ...selected.map((s) => series[s][i] ?? 0)]);
    });
    downloadCsv(buildFilename(context, `time-series-${lens}`), rows);
  };

  // Drill-down stub: just scroll chart into view + select the entity
  const handleInsightClick = (entity: string) => {
    if (available.includes(entity) && !selected.includes(entity)) {
      setManualSelection([...selected, entity].slice(0, 7));
    }
    document.getElementById("ts-primary-chart")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Time Series</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Execution-level view of how key signals evolve over time within{" "}
          <span className="font-medium text-slate-700">{context}</span>.
        </p>
      </div>

      {/* 1. Controls */}
      <Controls
        range={range}
        setRange={(r) => {
          setManualSelection(null);
          setRange(r);
        }}
        entityType={entityType}
        setEntityType={setEntityTypeReset}
        lens={lens}
        setLens={setLensReset}
      />

      {/* 2 + 3. Chart and Entity Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4" id="ts-primary-chart">
        <PrimaryChart
          lens={lens}
          months={months}
          selected={selected}
          series={series}
          target={target}
          yLabel={yLabel}
          onExport={handleExport}
        />
        {lens === "concentration" ? (
          <div className="bg-white border border-slate-200 rounded-xl p-4 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Metrics</h3>
            <p className="text-[11px] text-slate-400 mb-3">
              Concentration uses fixed category-level metrics — entity selection is not applicable.
            </p>
            <div className="space-y-2">
              {available.map((m) => (
                <label
                  key={m}
                  className="flex items-center gap-2 text-xs text-slate-700 px-2 py-1.5 rounded-md hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(m)}
                    onChange={() => onToggle(m)}
                    className="w-3 h-3 accent-slate-700"
                  />
                  <span className="flex-1">{m}</span>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <EntitySelection
            entityType={entityType}
            available={available}
            selected={selected}
            onToggle={onToggle}
            filter={filter}
            setFilter={setFilterReset}
            query={query}
            setQuery={setQuery}
            target={target}
          />
        )}
      </div>

      {/* 4. Trend Insight Panel */}
      <TrendInsightPanel insights={insights} onInsightClick={handleInsightClick} />

      {/* Footer note */}
      <p className="text-[11px] text-slate-400 text-center pt-2">
        All values are observed execution-level data points · no smoothing, averaging, or interpolation ·
        every signal is traceable to Execution → Run → Response.
      </p>
    </div>
  );
};

export default TimeSeriesView;
