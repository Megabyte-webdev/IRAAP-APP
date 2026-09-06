import type { Metadata } from "next";
import Capabilities from "./_components/Capabilities";
import Features from "./_components/Features";
import Hero from "./_components/Hero";
import Nav from "./_components/Nav";
import ProjectList from "./_components/ProjectList";
import ExploreSection from "./_components/ExploreSection";
import Footer from "./_components/Footer";
import { generatePageMetadata } from "./_lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title:
    "IRAAP | Research & Academic Collaboration Platform",
  description:
    "Discover research projects, scholarly publications, academic resources, and collaborative work. Manage research activities, connect with mentors and collaborators, and explore knowledge across disciplines.",
  path: "/",
});
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-inter text-gray-900 selection:bg-blue-100">
      <Nav />
      <Hero
        badgeText="Built for research collaboration"
        title="A Central Hub for Research, Knowledge & Collaboration"
        description={`Search research projects and scholarly resources, manage your work, and
collaborate seamlessly with mentors, peers, and research teams in one centralized, secure
environment built for researchers across disciplines.`}
      />
      <Features />
      <Capabilities />
      <ProjectList />
      <ExploreSection />
      <Footer />
    </div>
  );
}
