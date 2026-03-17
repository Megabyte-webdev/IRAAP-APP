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
    <>
      <Navbar />
      <Hero />

      <Stats stats={data?.stats} loading={isLoading} />
      <FeaturedProjects projects={data?.featuredProjects} />
      <Categories />
      <Footer />
    </>
  );
}
