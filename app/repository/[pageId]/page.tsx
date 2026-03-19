import { generatePageMetadata } from "@/app/_lib/metadata";
import ProjectDetailPage from "../_components/ProjectDetailPage";
import { getProjectByIdServer } from "@/app/_lib/meta-function";

export async function generateMetadata({ params }: any) {
  const { pageId } = await params;
  const project = await getProjectByIdServer(pageId);
  if(project) {return generatePageMetadata({
    title: project?.title
      ? `${project.title} · OOU Repository`
      : `Project ${pageId} · OOU Repository`,
    description: project?.category
      ? `${project.category} (Author: ${project?.author})`
      : `Details for project ID ${pageId}`,
  });
              }
}

const Page = () => {
  return <ProjectDetailPage />;
};

export default Page;
