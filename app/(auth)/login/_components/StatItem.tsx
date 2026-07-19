"use client";

interface StatItemProps {
  label: string;
  value?: number;
  loading?: boolean;
  error?: boolean;
}

export default function StatItem({
  label,
  value,
  loading,
  error,
}: StatItemProps) {
  return (
    <div>
      <div className="text-lg font-bold text-slate-900 dark:text-slate-200 min-h-7 flex items-center">
        {loading ? (
          <div className="h-6 w-10 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        ) : error ? (
          "--"
        ) : (
          (value?.toLocaleString() ?? "0")
        )}
      </div>

      <div className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
        {label}
      </div>
    </div>
  );
}
