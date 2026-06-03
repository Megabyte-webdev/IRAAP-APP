import Link from "next/link";

export default function FeaturedProjects({ projects }: any) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 pb-10">
      <div className="mb-12">
        <h2 className="text-3xl font-semibold">Featured Research</h2>

        <p className="mt-2 text-muted-foreground">
          Recently highlighted publications.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project: any) => (
          <article
            key={project.id}
            className="rounded-2xl border bg-card p-6 hover:shadow-md transition"
          >
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              {project.category}
            </div>

            <h3 className="mt-4 text-xl font-semibold">{project.title}</h3>

            <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
              {project.abstract}
            </p>

            <Link
              href={`/repository/${project.id}`}
              className="mt-6 inline-block text-sm font-medium"
            >
              Read Research →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
