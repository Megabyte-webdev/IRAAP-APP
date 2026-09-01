"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "next-themes";
import { ChatProvider } from "./ChatContext";
import SocketConnect from "./SocketConnect";
import { queryClient } from "../_services/query-client";
import { ToastContainer } from "react-toastify";
import { NotificationProvider } from "./NotificationContext";
import PwaRuntime from "../_components/pwa/PwaRuntime";
import InstallPrompt from "../_components/pwa/InstallPrompt";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="iraap-theme"
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ChatProvider>
            <NotificationProvider>
              <SocketConnect>{children}</SocketConnect>
              <PwaRuntime />
              <InstallPrompt />
              <ToastContainer
                position="top-right"
                autoClose={5000}
                closeOnClick
                pauseOnHover
                newestOnTop
              />
            </NotificationProvider>
          </ChatProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
