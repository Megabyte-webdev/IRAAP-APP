import { generatePageMetadata } from "@/app/_lib/metadata";
import ProjectDetailPage from "../_components/ProjectDetailPage";
import { getProjectByIdServer } from "@/app/_lib/meta-function";

//import { notFound } from "next/navigation";

export async function generateMetadata({ params }: any) {
  const { pageId } = await params;
  const project = await getProjectByIdServer(pageId);

  if (project) {
    const author = project.student?.fullName || project.author || "the researcher";
    const type = String(project.researchType || project.category || "academic research").replaceAll("_", " ").toLowerCase();
    const abstract = String(project.abstract || "").replace(/\s+/g, " ").trim();
    const description = `${type} by ${author}.${abstract ? ` ${abstract.slice(0, 220)}${abstract.length > 220 ? "…" : ""}` : " Explore this research project on IRAAP."}`;
    return generatePageMetadata({
      title: `${project.title ?? "Research Project"} · IRAAP Repository`,
      description,
      path: `/archive/${pageId}`,
      type: "article",
    });
  }

  // Explicit fallback so it doesn't use the root layout's metadata
  return generatePageMetadata({
    title: "Project Not Found · IRAAP Repository",
    description: "The requested project could not be located in our records.",
  });
}

const Page = () => {
  return <ProjectDetailPage />;
};

export default Page;
