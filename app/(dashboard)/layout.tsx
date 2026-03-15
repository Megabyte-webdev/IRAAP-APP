import React from "react";
import { Header } from "./_components/Header";
import { Sidebar } from "./_components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Permanent Sidebar for Navigation */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header showing User Info (e.g., Mr. O.R Abolade or Student Name) */}
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className=" mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
