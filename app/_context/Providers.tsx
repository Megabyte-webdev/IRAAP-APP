"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "next-themes";
import { ChatProvider } from "./ChatContext";
import SocketConnect from "./SocketConnect";
import { queryClient } from "../_services/query-client";
import { ToastContainer } from "react-toastify";
import { NotificationProvider } from "./NotificationContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="iraap-theme"
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
