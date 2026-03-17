"use client";
import { useProject } from "../_hooks/use-projects";

export default async function FeaturedProjects() {
  const { getProjects } = useProject();
  const { data: projects } = getProjects();
  return (
    <section className="py-16 max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Featured Research</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects?.slice(0, 6).map((project: any) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow hover:shadow-xl transition p-4 flex flex-col"
          >
            <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
            <p className="text-gray-600 flex-1">
              {project.abstract.slice(0, 120)}...
            </p>
            <span className="mt-4 text-sm text-gray-400">
              {project.category || "Uncategorized"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
