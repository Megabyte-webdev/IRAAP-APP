"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "next-themes";
import { ChatProvider } from "./ChatContext";
import SocketConnect from "./SocketConnect";
import { queryClient } from "../_services/query-client";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <ChatProvider>
          <QueryClientProvider client={queryClient}>
            <SocketConnect>{children}</SocketConnect>
          </QueryClientProvider>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
