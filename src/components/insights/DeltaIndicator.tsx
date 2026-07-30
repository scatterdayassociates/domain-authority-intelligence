import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface Props {
  /** Signed delta value. 0 (or |value| < epsilon) renders the flat state. */
  value: number;
  /** Unit suffix appended to the formatted value, e.g. "pp". */
  unit?: string;
  /** Decimal places used to format the value. */
  decimals?: number;
  /** Render as a filled pill (matches Rank Change style) instead of inline text. */
  pill?: boolean;
  className?: string;
}

/**
 * Shared up / down / flat delta indicator used across Compare-mode surfaces
 * (Competitive Movement, Key Metrics Strip, Executive Insight Panel).
 */
const DeltaIndicator = ({ value, unit = "", decimals = 1, pill = false, className = "" }: Props) => {
  const epsilon = Math.pow(10, -decimals) / 2;
  const flat = Math.abs(value) < epsilon;
  const positive = value > 0;

  const Icon = flat ? Minus : positive ? ArrowUp : ArrowDown;
  const text = flat
    ? `0${unit}`
    : `${positive ? "+" : "−"}${Math.abs(value).toFixed(decimals)}${unit}`;

  const color = flat ? "text-slate-400" : positive ? "text-green-600" : "text-red-500";
  const pillColor = flat
    ? "bg-slate-100 text-slate-500"
    : positive
      ? "bg-green-100 text-green-700"
      : "bg-red-50 text-red-500";

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold tabular-nums ${
        pill ? `px-2 py-0.5 rounded-full ${pillColor}` : color
      } ${className}`}
    >
      <Icon className="w-3 h-3" />
      {text}
    </span>
  );
};

export default DeltaIndicator;
