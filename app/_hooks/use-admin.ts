import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../_lib/api-client";
import { toast } from "react-toastify";

const useAdmin = () => {
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
  };
};
export default useAdmin;
