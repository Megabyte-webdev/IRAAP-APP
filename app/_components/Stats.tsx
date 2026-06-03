"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, Building2 } from "lucide-react";

interface StatsProps {
  stats?: {
    projects: number;
    researchers: number;
    supervisors: number;
  };
  loading?: boolean;
}

export default function Stats({ stats, loading }: StatsProps) {
  const [values, setValues] = useState({
    projects: 0,
    researchers: 0,
    supervisors: 0,
  });

  useEffect(() => {
    if (!loading && stats) {
      const duration = 900;

      const start = Date.now();

      const animate = () => {
        const progress = Math.min((Date.now() - start) / duration, 1);

        setValues({
          projects: Math.floor(progress * stats.projects),
          researchers: Math.floor(progress * stats.researchers),
          supervisors: Math.floor(progress * stats.supervisors),
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [stats, loading]);

  const items = [
    {
      label: "Projects",
      value: values.projects,
      icon: TrendingUp,
    },
    {
      label: "Researchers",
      value: values.researchers,
      icon: Users,
    },
    {
      label: "Supervisors",
      value: values.supervisors,
      icon: Building2,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 pb-10">
      {/* Header */}{" "}
      <div className="mb-10 max-w-2xl">
        {" "}
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Platform Overview{" "}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A real-time snapshot of academic activity across the research archive.
        </p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 border rounded-2xl overflow-hidden bg-card">
        {items.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className={`
            p-8
            flex
            flex-col
            gap-6
            ${i !== 2 ? "md:border-r" : ""}
            border-b md:border-b-0
          `}
            >
              {/* Label */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {item.label}
                </span>

                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>

              {/* Value */}
              <div className="text-4xl md:text-5xl font-semibold tracking-tight">
                {loading ? (
                  <span className="text-muted-foreground">—</span>
                ) : (
                  item.value.toLocaleString()
                )}
              </div>

              {/* Subtext */}
              <div className="text-xs text-muted-foreground">
                Total registered {item.label.toLowerCase()}
              </div>
            </div>
          );
        })}
      </div>
      {/* Footer Note */}
      <div className="mt-6 text-xs text-muted-foreground">
        Updated automatically as new research is published.
      </div>
    </section>
  );
}
