import { useState, useEffect } from "react";
import { Check, UserPlus } from "lucide-react";
import useAdmin from "@/app/_hooks/use-admin";

export default function BulkAssignTable() {
  const { supervisorsQuery, studentsQuery, bulkAssignData } = useAdmin();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [targetSupervisor, setTargetSupervisor] = useState("");

  const { data: supervisors } = supervisorsQuery();
  const { data: unassignedStudents } = studentsQuery();
  // Toggle selection for individual student
  const toggleStudent = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBulkAssign = async () => {
    if (!targetSupervisor || selectedIds.length === 0) return;

    bulkAssignData.mutate({
      supervisorId: Number(targetSupervisor),
      studentIds: selectedIds,
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex items-center gap-4">
          <select
            className="p-2 border rounded-md bg-white min-w-[200px]"
            value={targetSupervisor}
            onChange={(e) => setTargetSupervisor(e.target.value)}
          >
            <option value="">Select Supervisor...</option>
            {supervisors?.map(
              (s: { id: number; name: string; studentCount: number }) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.studentCount})
                </option>
              ),
            )}
          </select>
          <span className="text-sm text-slate-600">
            {selectedIds.length} students selected
          </span>
        </div>

        <button
          onClick={handleBulkAssign}
          disabled={
            !targetSupervisor ||
            selectedIds.length === 0 ||
            bulkAssignData.isPending
          }
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          <UserPlus size={18} />
          {bulkAssignData.isPending ? "Assigning..." : "Run Bulk Assignment"}
        </button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-slate-400 text-sm uppercase">
            <th className="pb-3 px-2">Select</th>
            <th className="pb-3">Student Name</th>
            <th className="pb-3">Email</th>
            <th className="pb-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Map your students here */}
          {unassignedStudents?.map(
            (student: {
              id: number;
              fullName: string;
              email: string;
              supervisorId: number | null;
            }) => (
              <tr key={student.id} className="border-b hover:bg-slate-50">
                <td className="py-4 px-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    onChange={() => toggleStudent(student.id)}
                    checked={selectedIds.includes(student.id)}
                  />
                </td>
                <td className="py-4 font-medium">{student.fullName}</td>
                <td className="py-4 text-slate-500 text-sm">{student.email}</td>
                <td className="py-4">
                  {student.supervisorId ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <Check size={16} />
                      Assigned
                    </span>
                  ) : (
                    <span className="text-rose-600">Unassigned</span>
                  )}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
