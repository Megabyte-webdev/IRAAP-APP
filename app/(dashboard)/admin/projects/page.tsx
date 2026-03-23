"use client";
import { Suspense } from "react";
import AdminArchiveContent from "../_components/AdminArchiveContent";

export default function Page({ searchParams }: any) {
  return (
    <Suspense fallback={<div className="p-8">Loading Search...</div>}>
      <AdminArchiveContent initialParams={searchParams} />
    </Suspense>
  );
}
