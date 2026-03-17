"use client";
import ProjectUploadForm from "@/app/_components/ProjectUploadForm";
import { useProject } from "@/app/_hooks/use-projects";
import { useParams } from "next/navigation";

export default function UploadPage() {
  const { projectId } = useParams();
  const { getProjectById } = useProject();
  const { data: project, isLoading } = getProjectById(projectId as string);

  if (isLoading) {
    return (
      <div className="p-8 mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Loading...</h1>
        <p className="text-gray-500">Fetching project details, please wait.</p>
      </div>
    );
  }

  return (
    <div className="p-8 mx-auto space-y-6">
      {/* update */}
      <h1 className="text-3xl font-bold text-gray-800">Edit Project</h1>
      <p className="text-gray-500">
        Update your research project details. Make sure to fill in all required
        fields and upload the latest PDF version.
      </p>

      <ProjectUploadForm initialData={project} isEditing={true} />
    </div>
  );
}
