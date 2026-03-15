import { QueryClient, useMutation } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { toast } from "react-toastify";
import { extractErrorMessage } from "../_lib/utils";

export const useSubmitProject = () => {
  const queryClient = new QueryClient();
  const submitProject: any = useMutation({
    mutationFn: async (projectData: any) => {
      const { data } = await api.post("/projects/submit", projectData);
      return data;
    },
    onSuccess: () => {
      toast.success("Project submitted for review!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error));
    },
  });

  return { submitProject };
};
