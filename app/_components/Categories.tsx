import useSearch from "../_hooks/use-search";

export default function Categories() {
  const { getCategories } = useSearch();
  const { data } = getCategories();

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 pb-10">
      <h2 className="text-3xl font-semibold mb-8">Research Categories</h2>

      <div className="flex flex-wrap gap-3">
        {data?.map((cat: any) => (
          <button
            key={cat.id}
            className="px-4 py-2 rounded-full border bg-card hover:bg-muted transition"
          >
            {cat.name}
          </button>
        ))}
      </div>
    </section>
  );
}
