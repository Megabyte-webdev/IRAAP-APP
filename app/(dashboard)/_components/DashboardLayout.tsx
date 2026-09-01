"use client";
import React, { useCallback, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import Portal from "@/app/_components/Portal";
import { usePathname } from "next/navigation";
import AppTour from "@/app/_components/AppTour";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  const isMeeting = /room|waiting/i.test(pathname || "");

  const sidebar = !isMeeting && (
    <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AppTour onOpenSidebar={openSidebar} onCloseSidebar={closeSidebar} />
      {/* Portal only on small screens */}
      <Portal>
        <div className="lg:hidden">{sidebar}</div>
      </Portal>

      {/* Inline on large screens */}
      <div className="hidden lg:block h-full">{sidebar}</div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {!isMeeting && <Header onMenuClick={openSidebar} />}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
