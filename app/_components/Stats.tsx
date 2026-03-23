interface StatsProps {
  stats?: {
    projects: number;
    researchers: number;
    supervisors: number;
  };
  loading?: boolean;
}
export default function Stats({ stats, loading }: StatsProps) {
  const items = [
    { label: "Archived Projects", key: "projects", value: stats?.projects },
    {
      label: "Active Researchers",
      key: "researchers",
      value: stats?.researchers,
    },
    {
      label: "Faculty Supervisors",
      key: "supervisors",
      value: stats?.supervisors,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 bg-[#0A0A0B]/80 backdrop-blur-xl border border-white/10 rounded-4xl overflow-hidden shadow-2xl">
        {items.map((item, i) => (
          <div
            key={i}
            className={`p-10 flex flex-col items-center justify-center group relative ${
              i !== items.length - 1 ? "md:border-r border-white/5" : ""
            }`}
          >
            {/* Hover Accent */}
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 group-hover:text-blue-400 transition-colors">
              {item.label}
            </span>

            <div className="text-5xl font-mono font-medium text-white tabular-nums tracking-tighter">
              {loading ? (
                <span className="animate-pulse text-white/10">0000</span>
              ) : (
                item.value?.toLocaleString() || "0"
              )}
            </div>

            <div className="mt-6 flex gap-1">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className={`h-1 w-1 rounded-full ${i === 0 ? "bg-blue-500" : "bg-white/10"}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
