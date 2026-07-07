import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number | string | undefined;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColorClass?: string; // Optional custom background hue injection
}

export default function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  iconColorClass = "bg-slate-50 border-slate-100 text-slate-600",
}: StatsCardProps) {
  // Gracefully handle loading states or zero indices cleanly
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : (value ?? "0");

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-3xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
          {formattedValue}
        </h3>

        {/* Optional Trend/Description Line */}
        {trend ? (
          <p
            className={`text-xs flex items-center gap-1 font-medium mt-2 ${
              trend.isPositive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            <span>
              {trend.isPositive ? "↑" : "↓"} {trend.value}%
            </span>
            <span className="text-slate-400 font-normal text-[10px]">
              vs last month
            </span>
          </p>
        ) : description ? (
          <p className="text-xs text-slate-400/90 mt-2 font-normal leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>

      <div
        className={`p-3.5 rounded-xl border transition-transform duration-200 group-hover:scale-105 flex items-center justify-center ${iconColorClass}`}
      >
        {icon}
      </div>
    </div>
  );
}
