import { generatePageMetadata } from "@/app/_lib/metadata";
import ProjectDetailPage from "../_components/ProjectDetailPage";
import { getProjectByIdServer } from "@/app/_lib/meta-function";

//import { notFound } from "next/navigation";

export async function generateMetadata({ params }: any) {
  const { pageId } = await params;
  const project = await getProjectByIdServer(pageId);

  if (project) {
    return generatePageMetadata({
      title: `${project.title} · OOU Repository`,
      description: `${project.category} (Author: ${project.author})`,
    });
  }

  // Explicit fallback so it doesn't use the root layout's metadata
  return generatePageMetadata({
    title: "Project Not Found · OOU Repository",
    description: "The requested project could not be located in our records.",
  });
}

const Page = () => {
  return <ProjectDetailPage />;
};

export default Page;
