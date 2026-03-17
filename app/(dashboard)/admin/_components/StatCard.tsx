import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
}: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-3xl font-bold mt-1 text-slate-900">
            {value?.toLocaleString()}
          </h3>

          {/* Optional Trend/Description Logic */}
          {trend ? (
            <p
              className={`text-xs mt-2 font-medium ${trend.isPositive ? "text-emerald-600" : "text-rose-600"}`}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}%
              <span className="text-slate-400 ml-1 font-normal text-[10px]">
                vs last month
              </span>
            </p>
          ) : (
            description && (
              <p className="text-xs text-slate-400 mt-2">{description}</p>
            )
          )}
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
          {icon}
        </div>
      </div>
    </div>
  );
}
