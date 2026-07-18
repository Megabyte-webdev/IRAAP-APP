import Capabilities from "./_components/Capabilities";
import Features from "./_components/Features";
import Hero from "./_components/Hero";
import Nav from "./_components/Nav";
import ProjectList from "./_components/ProjectList";
import ExploreSection from "./_components/ExploreSection";
import Footer from "./_components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-inter text-gray-900 selection:bg-blue-100">
      <Nav />
      <Hero />
      <Features />
      <Capabilities />
      <ProjectList />
      <ExploreSection />
      <Footer />
    </div>
  );
}
