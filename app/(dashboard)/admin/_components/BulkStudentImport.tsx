"use client";

import { useState, useMemo } from "react";
import {
  Upload,
  X,
  CheckCircle,
  Loader2,
  Trash2,
  Edit3,
  Save,
} from "lucide-react";
import Papa from "papaparse";
import { toast } from "react-toastify";
import useAdmin from "@/app/_hooks/use-admin";
import { AddStudentForm } from "./AddStudentForm";
import { CSVUpload } from "./CSVUpload";
import { SummaryCards } from "./SummaryCards";
import { StudentTable } from "./StudentTable";

export const BulkStudentImport = () => {
  const [data, setData] = useState<any[]>([]);
  const [newStudent, setNewStudent] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });
  const [duplicatesSkipped, setDuplicatesSkipped] = useState(0);

  const { bulkImportStudents } = useAdmin();

  // === CSV Upload ===
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      return toast.error("Please upload a valid CSV file");
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        if (
          !headers.includes("lastname") ||
          !headers.includes("firstname") ||
          !headers.includes("email")
        ) {
          return toast.error(
            "CSV must contain lastname, firstname, and email columns",
          );
        }

        const uniqueData: any[] = [];
        const emails = new Set<string>();
        let duplicates = 0;

        results.data.forEach((row: any) => {
          const email = row.email.trim().toLowerCase();
          if (emails.has(email)) {
            duplicates++;
            return;
          }
          emails.add(email);
          uniqueData.push({
            firstname: row.firstname.trim(),
            lastname: row.lastname.trim(),
            email,
          });
        });

        setData(uniqueData);
        setDuplicatesSkipped(duplicates);
        toast.info(
          `${uniqueData.length} students loaded, ${duplicates} duplicates skipped`,
        );
      },
    });
  };

  // === Add/Edit/Delete Row ===
  const handleAddStudent = (student: typeof newStudent) => {
    const email = student.email.trim().toLowerCase();
    if (!student.firstname || !student.lastname || !student.email)
      return toast.error("All fields are required");
    if (data.some((d) => d.email.toLowerCase() === email))
      return toast.error("Duplicate email detected");
    setData([...data, { ...student, email }]);
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingRow(data[index]);
  };

  const saveEditing = () => {
    if (!editingRow.firstname || !editingRow.lastname || !editingRow.email)
      return toast.error("All fields are required");
    const email = editingRow.email.trim().toLowerCase();
    if (
      data.some((d, i) => i !== editingIndex && d.email.toLowerCase() === email)
    )
      return toast.error("Duplicate email detected");

    const newData = [...data];
    newData[editingIndex!] = { ...editingRow, email };
    setData(newData);
    setEditingIndex(null);
  };

  const deleteRow = (index: number) =>
    setData(data.filter((_, i) => i !== index));

  // === Confirm Import ===
  const handleConfirmUpload = () => {
    if (data.length === 0) return toast.error("No student records to import");

    bulkImportStudents.mutate(data, {
      onSuccess: () => {
        toast.success(`Successfully imported ${data.length} students`);
        setData([]);
      },
      onError: (err: any) =>
        toast.error(err.response?.data?.message || "Bulk upload failed"),
    });
  };

  // === Summary ===
  const summary = useMemo(
    () => ({
      total: data.length + duplicatesSkipped,
      duplicates: duplicatesSkipped,
      ready: data.length,
    }),
    [data.length, duplicatesSkipped],
  );

  return (
    <div className="bg-white rounded-2xl w-full shadow-2xl h-full overflow-y-auto border border-slate-200 animate-in fade-in zoom-in duration-200 p-6 space-y-6">
      <AddStudentForm
        newStudent={newStudent}
        setNewStudent={setNewStudent}
        onAdd={handleAddStudent}
      />
      <CSVUpload onUpload={handleFileUpload} />
      {summary.total > 0 && <SummaryCards summary={summary} />}
      {data.length > 0 && (
        <StudentTable
          data={data}
          editingIndex={editingIndex}
          editingRow={editingRow}
          setEditingRow={setEditingRow}
          startEditing={startEditing}
          saveEditing={saveEditing}
          deleteRow={deleteRow}
        />
      )}
      {data.length > 0 && (
        <button
          onClick={handleConfirmUpload}
          className="sticky bottom-0 w-full py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 flex items-center justify-center gap-2"
        >
          {bulkImportStudents.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <CheckCircle />
          )}{" "}
          Import {data.length} Students
        </button>
      )}
    </div>
  );
};
