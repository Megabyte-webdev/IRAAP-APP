"use client";

import Categories from "./_components/Categories";
import FeaturedProjects from "./_components/FeaturedProjects";
import Footer from "./_components/Footer";
import Hero from "./_components/Hero";
import Navbar from "./_components/Navbar";
import Stats from "./_components/Stats";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <FeaturedProjects />
      <Categories />
      <Footer />
    </>
  );
}
