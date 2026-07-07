import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "../_lib/api-client";
import { extractErrorMessage } from "../_lib/utils";
import { onFailure, onSuccess } from "../_utils/Notification";

const useAdmin = () => {
  const queryClient = useQueryClient();

  const adminDashboardData = () =>
    useQuery({
      queryKey: ["adminDashboardData"],
      queryFn: async () => {
        const { data } = await api.get("/admin/dashboard");
        return data?.stats || {};
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
    onSuccess: (data, variables) => {
      onSuccess({
        title: "Assignment Complete",
        message:
          data?.message ||
          "Students have been successfully assigned to the supervisor.",
      });

      const { supervisorId, studentIds } = variables;

      const cachedSupervisors = queryClient.getQueryData<any[]>([
        "supervisorsList",
      ]);
      const supervisorName =
        cachedSupervisors?.find((s) => s.id === supervisorId)?.name ||
        "Assigned";

      queryClient.setQueriesData(
        { queryKey: ["studentsList", "infinite"] },
        (oldData: any) => {
          if (!oldData) return oldData;

          if (oldData.pages) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: page.data?.map((student: any) =>
                  studentIds.includes(student.id)
                    ? { ...student, supervisorId, supervisorName }
                    : student,
                ),
              })),
            };
          }

          return {
            ...oldData,
            data: oldData.data?.map((student: any) =>
              studentIds.includes(student.id)
                ? { ...student, supervisorId, supervisorName }
                : student,
            ),
          };
        },
      );

      queryClient.setQueriesData(
        { queryKey: ["unassignedStudents", "infinite"] },
        (oldData: any) => {
          if (!oldData) return oldData;

          if (oldData.pages) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: page.data?.filter(
                  (student: any) => !studentIds.includes(student.id),
                ),
              })),
            };
          }

          return {
            ...oldData,
            data: oldData.data?.filter(
              (student: any) => !studentIds.includes(student.id),
            ),
          };
        },
      );

      queryClient.setQueriesData(
        { queryKey: ["supervisorsList"] },
        (oldData: any) => {
          if (!oldData) return oldData;
          return oldData.map((sup: any) =>
            sup.id === supervisorId
              ? {
                  ...sup,
                  studentCount: (sup.studentCount || 0) + studentIds.length,
                }
              : sup,
          );
        },
      );

      queryClient.invalidateQueries({ queryKey: ["adminDashboardData"] });
      queryClient.invalidateQueries({
        queryKey: ["supervisorsList"],
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: ["studentsList", "infinite"],
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: ["unassignedStudents", "infinite"],
        refetchType: "none",
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
      students: { lastname: string; firstname: string; email: string }[],
    ) => {
      const { data } = await api.post("/admin/bulk-students", { students });
      return data;
    },
    onSuccess: (data) => {
      onSuccess({
        title: "Import Successful",
        message:
          data?.message || "All student records have been processed and saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["studentsList", "infinite"] });
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

  const bulkImportSupervisors = useMutation({
    mutationKey: ["bulkImportSupervisors"],
    mutationFn: async (
      supervisors: { lastname: string; firstname: string; email: string }[],
    ) => {
      const { data } = await api.post("/admin/bulk-supervisors", {
        supervisors,
      });
      return data;
    },
    onSuccess: (data) => {
      onSuccess({
        title: "Import Successful",
        message:
          data?.message ||
          "All supervisor records have been processed and saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["supervisorsList"] });
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

  const studentsInfiniteQuery = () =>
    useInfiniteQuery({
      queryKey: ["studentsList", "infinite"],
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await api.get("/admin/students", {
          params: { page: pageParam, limit: 10 },
        });
        return {
          data: data?.data || [],
          pagination: data?.pagination || {},
        };
      },
      getNextPageParam: (lastPage) => {
        const { pagination } = lastPage;
        if (pagination.page < pagination.totalPages) {
          return pagination.page + 1;
        }
        return undefined;
      },
      getPreviousPageParam: (firstPage) => {
        const { pagination } = firstPage;
        if (pagination.page > 1) {
          return pagination.page - 1;
        }
        return undefined;
      },
      initialPageParam: 1,
    });

  const unassignedStudentsInfiniteQuery = () =>
    useInfiniteQuery({
      queryKey: ["unassignedStudents", "infinite"],
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await api.get("/admin/unassigned-students", {
          params: { page: pageParam, limit: 10 },
        });
        return {
          data: data?.data || [],
          pagination: data?.pagination || {},
        };
      },
      getNextPageParam: (lastPage) => {
        const { pagination } = lastPage;
        if (pagination.page < pagination.totalPages) {
          return pagination.page + 1;
        }
        return undefined;
      },
      getPreviousPageParam: (firstPage) => {
        const { pagination } = firstPage;
        if (pagination.page > 1) {
          return pagination.page - 1;
        }
        return undefined;
      },
      initialPageParam: 1,
    });

  return {
    adminDashboardData,
    bulkAssignData,
    supervisorsQuery,
    bulkImportStudents,
    bulkImportSupervisors,
    studentsInfiniteQuery,
    unassignedStudentsInfiniteQuery,
  };
};

export default useAdmin;
