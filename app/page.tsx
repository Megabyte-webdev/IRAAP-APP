"use client";

import Categories from "./_components/Categories";
import FeaturedProjects from "./_components/FeaturedProjects";
import Footer from "./_components/Footer";
import Hero from "./_components/Hero";
import Navbar from "./_components/Navbar";
import Stats from "./_components/Stats";
import useSearch from "./_hooks/use-search";

export default function LandingPage() {
  const { useHome } = useSearch();
  const { data, isLoading } = useHome();

  return (
    <main className="bg-[#11172c] min-h-screen selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Architectural Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e40af15,transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>

      <Navbar />

      <div className="relative z-10">
        <Hero />

        {/* Integrated Stats Bar */}
        <div className="relative z-20 -mt-12 px-6">
          <Stats stats={data?.stats} loading={isLoading} />
        </div>

        <div className="space-y-40 py-40">
          <FeaturedProjects projects={data?.featuredProjects} />

          <div className="max-w-7xl mx-auto px-10">
            <div className="h-px w-full bg-linear-to-r from-transparent via-white/5 to-transparent" />
          </div>

          <Categories />
        </div>

        <Footer />
      </div>
    </main>
  );
}
