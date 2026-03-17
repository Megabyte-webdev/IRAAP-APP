import useSearch from "../_hooks/use-search";

export default function Categories() {
  const { getCategories } = useSearch();
  const { data: categories } = getCategories();
  return (
    <section className="py-16 bg-gray-100 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Browse by Category
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories?.map((cat: { id: string; name: string }) => (
          <div
            key={cat.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition text-center py-8 font-semibold cursor-pointer"
          >
            {cat?.name}
          </div>
        ))}
      </div>
    </section>
  );
}
