interface StatsProps {
  stats?: {
    projects: number;
    researchers: number;
    departments: number;
  };
  loading?: boolean;
}

export default function Stats({ stats, loading }: StatsProps) {
  return (
    <section className="py-16 bg-gray-50 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {["projects", "researchers", "supervisors"].map((key, i) => (
          <div key={i} className="p-6 rounded-xl shadow bg-white">
            <h2 className="text-4xl font-bold text-blue-600">
              {loading ? "..." : (stats?.[key as keyof typeof stats] ?? 0)}
            </h2>
            <p className="mt-2 text-gray-600 capitalize">{key}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
