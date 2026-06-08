"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "next-themes";
import { ChatProvider } from "./ChatContext";
import SocketConnect from "./SocketConnect";
import { queryClient } from "../_services/query-client";
import { ToastContainer } from "react-toastify";
import { NotificationProvider } from "./NotificationContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <ChatProvider>
          <NotificationProvider>
            <QueryClientProvider client={queryClient}>
              <SocketConnect>{children}</SocketConnect>

              <ToastContainer
                position="top-right"
                autoClose={5000}
                closeOnClick
                pauseOnHover
                newestOnTop
              />
            </QueryClientProvider>
          </NotificationProvider>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
