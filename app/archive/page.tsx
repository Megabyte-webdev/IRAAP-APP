import { Suspense } from "react";
import Footer from "../_components/Footer";
import { generatePageMetadata } from "../_lib/metadata";
import Nav from "../_components/Nav";
import ArchivePage from "./_components/ArchivePage";

export const metadata = generatePageMetadata({
  title: "IRAAP Repository",
  description:
    "Explore IRAAP—discover research papers, academic publications, projects, datasets, and scholarly resources across disciplines.",
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
      <ArchivePage />
      <Footer />
    </Suspense>
  );
}
