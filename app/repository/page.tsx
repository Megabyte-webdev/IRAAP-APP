import { Suspense } from "react";
import RepositoryList from "../_components/RepositoryList";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";

export default function RepositoryPage() {
  return (
    // The Suspense boundary is what fixes the "prerender-error" during build
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <Navbar />
      <RepositoryList />
      <Footer />
    </Suspense>
  );
}
