"use client";
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import Portal from "@/app/_components/Portal";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebar = (
    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Portal only on small screens */}
      <Portal>
        <div className="lg:hidden">{sidebar}</div>
      </Portal>

      {/* Inline on large screens */}
      <div className="hidden lg:block h-full">{sidebar}</div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
