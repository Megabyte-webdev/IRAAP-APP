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
      <Hero
        badgeText="Exclusive to OOU Computer Engineering"
        title="The Central Hub for OOU Computer Engineering Research"
        description={`Search thousands of past projects, manage your current drafts, and
collaborate seamlessly with your supervisor in one centralized, secure
environment designed specifically for engineering scholars.`}
      />
      <Features />
      <Capabilities />
      <ProjectList />
      <ExploreSection />
      <Footer />
    </div>
  );
}
