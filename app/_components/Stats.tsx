"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, Building2, Zap } from "lucide-react";

interface StatsProps {
  stats?: {
    projects: number;
    researchers: number;
    supervisors: number;
  };
  loading?: boolean;
}

export default function Stats({ stats, loading }: StatsProps) {
  const [animatedStats, setAnimatedStats] = useState({
    projects: 0,
    researchers: 0,
    supervisors: 0,
  });

  useEffect(() => {
    if (!loading && stats) {
      const intervals: NodeJS.Timeout[] = [];
      const duration = 2000;
      const steps = 60;

      ["projects", "researchers", "supervisors"].forEach((key) => {
        const start = Date.now();
        const end = stats[key as keyof typeof stats];

        const interval = setInterval(() => {
          const now = Date.now();
          const progress = Math.min((now - start) / duration, 1);
          const value = Math.floor(progress * end);

          setAnimatedStats((prev) => ({
            ...prev,
            [key]: value,
          }));

          if (progress === 1) {
            clearInterval(interval);
          }
        }, duration / steps);

        intervals.push(interval);
      });

      return () => intervals.forEach(clearInterval);
    }
  }, [stats, loading]);

  const items = [
    {
      label: "Archived Projects",
      key: "projects",
      value: animatedStats.projects || stats?.projects,
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      gradient: "from-blue-500/20 to-cyan-500/10",
    },
    {
      label: "Active Researchers",
      key: "researchers",
      value: animatedStats.researchers || stats?.researchers,
      icon: Users,
      color: "from-purple-500 to-pink-500",
      gradient: "from-purple-500/20 to-pink-500/10",
    },
    {
      label: "Faculty Supervisors",
      key: "supervisors",
      value: animatedStats.supervisors || stats?.supervisors,
      icon: Building2,
      color: "from-emerald-500 to-teal-500",
      gradient: "from-emerald-500/20 to-teal-500/10",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="group relative p-10 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl hover:backdrop-blur-2xl shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Animated gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Premium border glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 shadow-inset transition-opacity duration-500 pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 space-y-8">
                {/* Header with Icon */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-300 transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} border border-white/10 group-hover:border-white/20 transition-all duration-500 group-hover:scale-110`}
                  >
                    <Icon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  </div>
                </div>

                {/* Main Value */}
                <div className="space-y-2">
                  <div className="text-5xl md:text-6xl font-mono font-bold text-white tabular-nums tracking-tighter group-hover:scale-110 transition-transform duration-500 origin-left">
                    {loading ? (
                      <span className="animate-pulse text-white/20">0000</span>
                    ) : (
                      (item.value as number)?.toLocaleString() || "0"
                    )}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 group-hover:text-slate-300 transition-colors">
                    +{Math.floor((item.value as number) * 0.05)} this year
                  </div>
                </div>

                {/* Accent dots */}
                <div className="flex gap-2 pt-4 border-t border-white/5">
                  {[1, 2, 3, 4].map((dot) => (
                    <div
                      key={dot}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        dot === 1
                          ? `bg-gradient-to-r ${item.color}`
                          : "bg-white/10 group-hover:bg-white/20"
                      }`}
                      style={{ width: dot === 1 ? "24px" : "8px" }}
                    />
                  ))}
                </div>
              </div>

              {/* Hover spark animation */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Zap className="w-4 h-4 text-white/40 animate-pulse" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom info bar */}
      <div className="mt-8 px-6 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span>Live Updates</span>
        </div>
      </div>
    </div>
  );
}
