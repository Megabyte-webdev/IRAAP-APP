"use client";

import { BulkStudentImport } from "../../_components/BulkStudentImport";

export default function BulkStudentImportPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Bulk Student Import
      </h1>
      <BulkStudentImport />
    </main>
  );
}
