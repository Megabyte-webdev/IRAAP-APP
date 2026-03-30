"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import Papa from "papaparse";
import useAdmin from "@/app/_hooks/use-admin";
import { AddStudentForm } from "./AddStudentForm";
import { CSVUpload } from "./CSVUpload";
import { SummaryCards } from "./SummaryCards";
import { StudentTable } from "./StudentTable";
import { onFailure, onSuccess } from "@/app/_utils/Notification";
import { extractErrorMessage } from "@/app/_lib/utils";

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
  const resultsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (data.length > 0) {
        e.preventDefault();
        e.returnValue = ""; // Required for Chrome
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [data.length]);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closestAnchor = target.closest("a");

      if (data.length > 0 && closestAnchor && closestAnchor.href) {
        const isExternal = closestAnchor.target === "_blank";
        const isSamePage = closestAnchor.href === window.location.href;

        if (!isExternal && !isSamePage) {
          const confirmLeave = window.confirm(
            "You have unsaved students in your list. Are you sure you want to leave?",
          );
          if (!confirmLeave) {
            e.preventDefault();
            e.stopImmediatePropagation();
          }
        }
      }
    };

    // Intercept all link clicks
    document.addEventListener("click", handleAnchorClick, true);
    return () => document.removeEventListener("click", handleAnchorClick, true);
  }, [data.length]);

  const scrollToResults = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100); // Small delay to ensure DOM has updated
  };
  const { bulkImportStudents } = useAdmin();

  // === CSV Upload ===
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      return onFailure({
        title: "Invalid File",
        message: "Please upload a valid CSV file.",
      });
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
          return onFailure({
            title: "Column Mismatch",
            message: "CSV must contain lastname, firstname, and email.",
          });
        }

        const existingEmails = new Set(
          data.map((student) => student.email.toLowerCase()),
        );
        const newUniqueData: any[] = [];
        let duplicates = 0;

        results.data.forEach((row: any) => {
          const email = row.email?.trim().toLowerCase();
          if (!email) return;

          if (existingEmails.has(email)) {
            duplicates++;
            return;
          }

          existingEmails.add(email);
          newUniqueData.push({
            firstname: row.firstname?.trim() || "",
            lastname: row.lastname?.trim() || "",
            email,
          });
        });

        if (newUniqueData.length > 0) {
          setData((prev) => [...prev, ...newUniqueData]);
        }

        setDuplicatesSkipped((prev) => prev + duplicates);

        // Notifications
        if (duplicates > 0) {
          onFailure({
            title: "Duplicates Filtered",
            message: `Skipped ${duplicates} records that were already in the list or duplicated in the file.`,
          });
        } else if (newUniqueData.length > 0) {
          onSuccess({
            title: "Upload Successful",
            message: `Added ${newUniqueData.length} new students to the preview.`,
          });
        }

        scrollToResults();
      },
    });
  };

  // === Add/Edit/Delete Row ===
  const handleAddStudent = (student: typeof newStudent) => {
    const email = student.email.trim().toLowerCase();
    if (!student.firstname || !student.lastname || !student.email)
      return onFailure({
        title: "Missing Info",
        message: "All fields are required.",
      });
    if (data.some((d) => d.email.toLowerCase() === email))
      return onFailure({
        title: "Duplicate",
        message: "This email is already in your list.",
      });
    setData([...data, { ...student, email }]);
    onSuccess({
      title: "Student Added",
      message: `${student.firstname} added to preview.`,
    });
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingRow(data[index]);
  };

  const saveEditing = () => {
    if (!editingRow.firstname || !editingRow.lastname || !editingRow.email)
      return onFailure({
        title: "Missing Info",
        message: "All fields are required.",
      });
    const email = editingRow.email.trim().toLowerCase();
    if (
      data.some((d, i) => i !== editingIndex && d.email.toLowerCase() === email)
    )
      return onFailure({
        title: "Duplicate",
        message: "This email is already in your list.",
      });

    const newData = [...data];
    newData[editingIndex!] = { ...editingRow, email };
    setData(newData);
    setEditingIndex(null);
  };

  const deleteRow = (index: number) =>
    setData(data.filter((_, i) => i !== index));

  // === Confirm Import ===
  const handleConfirmUpload = () => {
    if (data.length === 0)
      return onFailure({
        title: "Empty List",
        message: "No records to import.",
      });

    bulkImportStudents.mutate(data, {
      onSuccess: () => {
        onSuccess({
          title: "Import Successful",
          message: `Successfully registered ${data.length} new students.`,
        });
        setData([]);
        setDuplicatesSkipped(0);
      },
      onError: (err: any) =>
        onFailure({
          title: "Upload Failed",
          message:
            extractErrorMessage(err) ||
            "Something went wrong during bulk import.",
        }),
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
    <div className="bg-white rounded-xl md:rounded-2xl w-full shadow-xl md:shadow-2xl h-full overflow-y-auto border border-slate-200 animate-in fade-in zoom-in duration-200 p-4 md:p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Import Students</h2>
        <AddStudentForm
          newStudent={newStudent}
          setNewStudent={setNewStudent}
          onAdd={handleAddStudent}
        />
      </div>

      <CSVUpload onUpload={handleFileUpload} />

      <div className="my-4">
        {summary.total > 0 && <SummaryCards summary={summary} />}
      </div>

      {data.length > 0 && (
        <div className="overflow-x-auto -mx-4 md:mx-0">
          {/* -mx-4 allows the table to bleed to edges on mobile if needed */}
          <StudentTable
            data={data}
            editingIndex={editingIndex}
            editingRow={editingRow}
            setEditingRow={setEditingRow}
            startEditing={startEditing}
            saveEditing={saveEditing}
            deleteRow={deleteRow}
          />
        </div>
      )}

      {data.length > 0 && (
        <div className="sticky bottom-0 pt-4 bg-white/80 backdrop-blur-sm">
          <button
            onClick={handleConfirmUpload}
            disabled={bulkImportStudents.isPending}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
          >
            {bulkImportStudents.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CheckCircle size={20} />
            )}
            Import {data.length} Students
          </button>
        </div>
      )}
    </div>
  );
};
