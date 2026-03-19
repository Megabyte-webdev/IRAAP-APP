import { generatePageMetadata } from "@/app/_lib/metadata";
import ProjectDetailPage from "../_components/ProjectDetailPage";
import { getProjectByIdServer } from "@/app/_lib/meta-function";

import { notFound } from "next/navigation";

export async function generateMetadata({ params }: any) {
  const { pageId } = await params;
  const project = await getProjectByIdServer(pageId);

  // If no project, stop here and trigger the notFound() UI
  if (!project) {
    notFound(); 
  }

  return generatePageMetadata({
    title: `${project.title} · OOU Repository`,
    description: `(Author: ${project.author}) - ${project.category}`,
  });
}

const Page = () => {
  return <ProjectDetailPage />;
};

export default Page;
