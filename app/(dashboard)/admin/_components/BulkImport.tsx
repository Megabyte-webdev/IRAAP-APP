"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import Papa from "papaparse";
import useAdmin from "@/app/_hooks/use-admin";
import { AddStudentForm } from "./AddStudentForm"; // Note: Consider renaming these sub-components to be generic too
import { CSVUpload } from "./CSVUpload";
import { SummaryCards } from "./SummaryCards";
import { StudentTable } from "./StudentTable";
import { onFailure, onSuccess } from "@/app/_utils/Notification";
import { extractErrorMessage } from "@/app/_lib/utils";

interface BulkImportProps {
  type: "STUDENT" | "SUPERVISOR";
}

export const BulkImport = ({ type }: BulkImportProps) => {
  const isStudent = type === "STUDENT";
  const label = isStudent ? "Student" : "Supervisor";

  const [data, setData] = useState<any[]>([]);

  // Generic state structure to handle both types
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    fullName: "",
    email: "",
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<any>({});
  const [duplicatesSkipped, setDuplicatesSkipped] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { bulkImportStudents, bulkImportSupervisors } = useAdmin();

  // Select the appropriate mutation based on prop
  const activeMutation = isStudent ? bulkImportStudents : bulkImportSupervisors;

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

  // === CSV Upload Logic ===
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];

        // Dynamic Validation based on type
        const requiredFields = isStudent
          ? ["firstname", "lastname", "email"]
          : ["fullName", "email"];

        const missing = requiredFields.filter((f) => !headers.includes(f));

        if (missing.length > 0) {
          return onFailure({
            title: "Column Mismatch",
            message: `CSV is missing: ${missing.join(", ")}`,
          });
        }

        const existingEmails = new Set(
          data.map((item) => item.email.toLowerCase()),
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

          const entry = isStudent
            ? {
                firstname: row.firstname?.trim() || "",
                lastname: row.lastname?.trim() || "",
                email,
              }
            : {
                fullName: row.fullName?.trim() || "",
                email,
              };

          newUniqueData.push(entry);
        });

        if (newUniqueData.length > 0)
          setData((prev) => [...prev, ...newUniqueData]);
        setDuplicatesSkipped((prev) => prev + duplicates);

        if (duplicates > 0) {
          onFailure({
            title: "Duplicates Filtered",
            message: `Skipped ${duplicates} records.`,
          });
        } else if (newUniqueData.length > 0) {
          onSuccess({
            title: "Upload Successful",
            message: `Added ${newUniqueData.length} ${label}s to preview.`,
          });
        }
        scrollToResults();
      },
    });
  };

  const handleAddEntry = (entry: any) => {
    const email = entry.email.trim().toLowerCase();

    // Check required fields based on type
    const hasRequired = entry.firstname && entry.lastname && entry.email;

    if (!hasRequired)
      return onFailure({
        title: "Missing Info",
        message: "All fields are required.",
      });

    if (data.some((d) => d.email.toLowerCase() === email)) {
      return onFailure({
        title: "Duplicate",
        message: "Email already in list.",
      });
    }

    setData([...data, { ...entry, email }]);
    setFormData({
      firstname: "",
      lastname: "",
      fullName: "",
      email: "",
    });
    onSuccess({ title: `${label} Added`, message: "Added to preview list." });
    scrollToResults();
  };

  // === Confirm Import ===
  const handleConfirmUpload = () => {
    if (data.length === 0) return;

    activeMutation.mutate(data, {
      onSuccess: () => {
        setData([]);
        setDuplicatesSkipped(0);
      },
    });
  };

  const summary = useMemo(
    () => ({
      total: data.length + duplicatesSkipped,
      duplicates: duplicatesSkipped,
      ready: data.length,
    }),
    [data.length, duplicatesSkipped],
  );

  return (
    <div className="bg-white rounded-xl md:rounded-2xl w-full shadow-xl h-full overflow-y-auto border border-slate-200 p-4 md:p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Import {label}s</h2>

        {/* Pass generic state to the form */}
        <AddStudentForm
          type={type} // Pass type to subcomponent if it needs to switch fields
          newData={formData}
          setNewData={setFormData}
          onAdd={handleAddEntry}
        />
      </div>

      <CSVUpload onUpload={handleFileUpload} type={type} />

      <div className="my-4" ref={resultsRef}>
        {summary.total > 0 && <SummaryCards summary={summary} />}
      </div>

      {data.length > 0 && (
        <div className="overflow-x-auto">
          <StudentTable
            type={type}
            data={data}
            editingIndex={editingIndex}
            editingRow={editingRow}
            setEditingRow={setEditingRow}
            startEditing={(i: number) => {
              setEditingIndex(i);
              setEditingRow(data[i]);
            }}
            saveEditing={() => {
              const newData = [...data];
              newData[editingIndex!] = editingRow;
              setData(newData);
              setEditingIndex(null);
            }}
            deleteRow={(i: number) =>
              setData(data.filter((_, idx) => idx !== i))
            }
          />
        </div>
      )}

      {data.length > 0 && (
        <div className="sticky bottom-0 pt-4 bg-white/80 backdrop-blur-sm">
          <button
            onClick={handleConfirmUpload}
            disabled={activeMutation.isPending}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
          >
            {activeMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CheckCircle size={20} />
            )}
            Import {data.length} {label}s
          </button>
        </div>
      )}
    </div>
  );
};
