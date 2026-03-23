"use client";
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Pass toggle function to Header */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
