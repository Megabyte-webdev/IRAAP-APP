"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface StatsData {
  projects: number;
  researchers: number;
  departments: number;
}

export default function Stats() {
  const [stats, setStats] = useState<StatsData>({
    projects: 0,
    researchers: 0,
    departments: 0,
  });

  useEffect(() => {
    axios.get("/api/stats").then((res) => setStats(res.data));
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {["projects", "researchers", "departments"].map((key, i) => (
          <div
            key={i}
            className="p-6 rounded-xl shadow hover:shadow-lg transition bg-white"
          >
            <h2 className="text-4xl font-bold text-blue-600">
              {stats[key as keyof StatsData]}
            </h2>
            <p className="mt-2 text-gray-600 capitalize">{key}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
