"use client";

import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import FeaturedProjects from "./_components/FeaturedProjects";
import Categories from "./_components/Categories";
import Stats from "./_components/Stats";
import Footer from "./_components/Footer";
import useSearch from "./_hooks/use-search";

export default function LandingPage() {
  const { useHome } = useSearch();
  const { data, isLoading } = useHome();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <Hero />
      <Stats stats={data?.stats} loading={isLoading} />

      <FeaturedProjects projects={data?.featuredProjects} />

      <Categories />
      <Footer />
    </main>
  );
}
