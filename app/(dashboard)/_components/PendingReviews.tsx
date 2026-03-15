"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Loader2 } from "lucide-react";
import { api } from "@/app/_lib/api-client";
import { ProjectCard } from "./ProjectCard";

export function PendingReviews() {
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["pending-projects"],
    queryFn: async () => {
      const { data } = await api.get("/projects/pending");
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return api.patch(`/projects/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-projects"] });
    },
  });

  if (isLoading) return <Loader2 className="animate-spin mx-auto mt-10" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects?.map((project: any) => (
        <div key={project.id} className="relative group">
          <ProjectCard
            title={project.title}
            abstract={project.abstract}
            fileUrl={project.fileUrl}
            year={project.submissionYear}
            supervisor="You"
            status={project.status}
          />
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() =>
                mutation.mutate({ id: project.id, status: "APPROVED" })
              }
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-lg"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() =>
                mutation.mutate({ id: project.id, status: "REJECTED" })
              }
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
      {projects?.length === 0 && (
        <p className="text-gray-500">No pending reviews at the moment.</p>
      )}
    </div>
  );
}
