"use client";

import ProjectUploadForm from "@/app/_components/ProjectUploadForm";
import { useAuth } from "@/app/_context/AuthContext";
import NoSupervisor from "../../_components/NoSupervisor";

export default function UploadPage() {
  const { authDetails } = useAuth();

  const hasSupervisor = authDetails?.user?.supervisorId;

  if (!hasSupervisor) {
    return <NoSupervisor />;
  }

  return (
    <div className="p-8 mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Upload New Project</h1>
      <p className="text-gray-500">
        Submit your research project to the IRAP repository. Fill in all
        required fields and upload your PDF.
      </p>

      <ProjectUploadForm />
    </div>
  );
}
