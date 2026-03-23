import { ArrowUpRight, Hexagon } from "lucide-react";
import useSearch from "../_hooks/use-search";

export default function Categories() {
  const { getCategories } = useSearch();
  const { data: categories } = getCategories();

  return (
    <section className="px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-medium text-white tracking-tight">
              Research Domains
            </h2>
            <p className="text-slate-500 mt-3 font-light max-w-md">
              Filtered access to specialized academic disciplines and
              cross-functional methodology.
            </p>
          </div>
          <div className="text-[10px] font-mono text-blue-500 uppercase tracking-widest border border-blue-500/20 px-4 py-2 rounded-full">
            Active_Indices: {categories?.length || 0}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories?.map((cat: any) => (
            <div
              key={cat.id}
              className="group relative bg-white/2 border border-white/5 p-8 rounded-3xl hover:bg-white/4 hover:border-blue-500/30 transition-all duration-500 cursor-pointer overflow-hidden"
            >
              {/* Decorative Hexagon Icon */}
              <div className="relative z-10 h-10 w-10 border border-white/10 rounded-xl mb-8 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                <Hexagon
                  size={18}
                  className="text-slate-500 group-hover:text-blue-400"
                />
              </div>

              <h3 className="relative z-10 font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                {cat.name}
              </h3>

              <div className="relative z-10 flex items-center gap-2 mt-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Initialize View
                </span>
                <ArrowUpRight size={12} className="text-blue-500" />
              </div>

              {/* Background Geometric Accent */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
