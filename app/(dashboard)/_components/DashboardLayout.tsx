"use client";

import React, { useCallback, useState } from "react";
import { usePathname } from "next/navigation";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import AppTour from "@/app/_components/AppTour";

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const isMeeting = /room|waiting/i.test(pathname || "");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950">
      {!isMeeting && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
      )}

      {!isMeeting && (
        <AppTour
          onOpenSidebar={openSidebar}
          onCloseSidebar={closeSidebar}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {!isMeeting && (
          <Header onMenuClick={openSidebar} />
        )}

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
