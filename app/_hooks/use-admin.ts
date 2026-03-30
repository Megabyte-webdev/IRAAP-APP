import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { extractErrorMessage } from "../_lib/utils";
import { onFailure, onSuccess } from "../_utils/Notification";

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
    onSuccess: (data) => {
      onSuccess({
        title: "Assignment Complete",
        message:
          data?.message ||
          "Students have been successfully assigned to the supervisor.",
      });
    },
    onError: (err) => {
      onFailure({
        title: "Assignment Failed",
        message:
          extractErrorMessage(err) ||
          "Could not complete assignment. Please try again.",
      });
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
      onSuccess({
        title: "Import Successful",
        message:
          data?.message || "All student records have been processed and saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["studentsList"] });
    },
    onError: (err: any) => {
      onFailure({
        title: "Import Error",
        message:
          extractErrorMessage(err) ||
          "Failed to import records. Please verify your data format.",
      });
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
