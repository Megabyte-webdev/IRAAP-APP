import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { toast } from "react-toastify";
import { extractErrorMessage } from "../_lib/utils";

const useAdmin = () => {
  const queryClient = new QueryClient();
  const adminDashboardData = () =>
    useQuery({
      queryKey: ["adminDashboardData"],
      queryFn: async () => {
        const { data } = await api.get("/admin/dashboard");
        return data?.stats || {};
      },
    });

  const bulkAssignData = useMutation({
    mutationKey: ["bulkAssign"],
    mutationFn: async ({
      supervisorId,
      studentIds,
    }: {
      supervisorId: number;
      studentIds: number[];
    }) => {
      const { data } = await api.post("/admin/assign-supervisor", {
        supervisorId,
        studentIds,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Students assigned successfully!");
    },
    onError: () => {
      toast.error("Failed to assign students. Please try again.");
    },
  });

  const bulkImportStudents = useMutation({
    mutationKey: ["bulkImportStudents"],
    mutationFn: async (
      students: {
        lastname: string;
        firstname: string;
        email: string;
      }[],
    ) => {
      const { data } = await api.post("/admin/bulk-students", {
        students,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Students imported successfully!");

      queryClient.invalidateQueries({ queryKey: ["studentsList"] });
    },
    onError: (error: any) => {
      toast.error(
        extractErrorMessage(Error) ||
          "Failed to import students. Please check your CSV format.",
      );
    },
  });

  const supervisorsQuery = () =>
    useQuery({
      queryKey: ["supervisorsList"],
      queryFn: async () => {
        const { data } = await api.get("/admin/supervisors");
        return data?.supervisors || [];
      },
    });

  const unassignedStudentsQuery = () =>
    useQuery({
      queryKey: ["unassignedStudents"],
      queryFn: async () => {
        const { data } = await api.get("/admin/unassigned-students");
        return data?.data || [];
      },
    });

  const studentsQuery = () =>
    useQuery({
      queryKey: ["studentsList"],
      queryFn: async () => {
        const { data } = await api.get("/admin/students");
        return data?.data || [];
      },
    });

  return {
    adminDashboardData,
    bulkAssignData,
    supervisorsQuery,
    unassignedStudentsQuery,
    studentsQuery,
    bulkImportStudents,
  };
};
export default useAdmin;
