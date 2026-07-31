import { Suspense } from "react";
import Footer from "../_components/Footer";
import { generatePageMetadata } from "../_lib/metadata";
import Nav from "../_components/Nav";
import FAQSection from "./_components/FAQSection";
import Hero from "../_components/Hero";
import { UtilityPole } from "lucide-react";

export const metadata = generatePageMetadata({
  title: "IRAAP Repository",
  description:
    "Explore the IRAP institutional repository—access research papers, academic publications, and digital resources across multiple disciplines.",
  path: "/repository",
});

export default function RepositoryPage({ searchParams }: any) {
  return (
    // The Suspense boundary is what fixes the "prerender-error" during build
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <Nav />
      <Hero
        title="Digitizing the legacy of OOU Computer Engineering"
        description={`Transitioning decades of physical research, hardware documentation, and software
innovations into a unified, accessible digital repository. Empowering the next
generation of engineers.`}
        variant="about"
        badgeText="OUR MISSION"
        badgeIcon={
          <UtilityPole
            size={14}
            className="transition-transform duration-300 group-hover:rotate-6"
          />
        }
      />
      <FAQSection />
      <Footer />
    </Suspense>
  );
}
