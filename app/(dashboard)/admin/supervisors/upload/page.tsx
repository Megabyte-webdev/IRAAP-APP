"use client";

import { BulkImport } from "../../_components/BulkImport";

export default function BulkStudentImportPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Bulk Supervisor Import
      </h1>
      <BulkImport type="SUPERVISOR" />
    </main>
  );
}
