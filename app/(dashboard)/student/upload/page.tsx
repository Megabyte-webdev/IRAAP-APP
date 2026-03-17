"use client";
import ProjectUploadForm from "@/app/_components/ProjectUploadForm";

export default function UploadPage() {
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
