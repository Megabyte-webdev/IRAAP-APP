"use client";

import { createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { requestNotificationPermission } from "@/app/_services/chatNotification";
import { api } from "../_lib/api-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

type NotificationContextValue = {
  notifications: any[];
  unreadCount: number;
  refresh: () => void;
};

const NotificationCtx = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authDetails } = useAuth();
  const authUserId = authDetails?.user?.id;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async () =>
      (await api.get("/notifications", { params: { limit: 50 } })).data,
    enabled: !!authUserId,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!authUserId) return;

    const setupPush = async () => {
      try {
        if (
          typeof window === "undefined" ||
          !("serviceWorker" in navigator) ||
          !("PushManager" in window)
        ) {
          return;
        }

        // The backend is the single source of truth for the VAPID public key.
        const { data } = await api.get("/notifications/push/public-key");
        const publicKey = String(data?.publicKey || "").trim();
        if (!publicKey) return;

        const permission = await requestNotificationPermission();
        if (permission !== "granted") return;

        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        const activeRegistration = await navigator.serviceWorker.ready;
        let subscription = await activeRegistration.pushManager.getSubscription();

        if (!subscription) {
          subscription = await activeRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
          });
        }

        await api.post("/push/subscribe", {
          subscription: subscription.toJSON(),
        });

        // Keep the registration referenced so bundlers don't optimize away
        // the explicit registration step in unusual browser environments.
        void registration;
      } catch (error) {
        // Push is optional. A failure must never block the application itself.
        console.error("Push setup failed:", error);
      }
    };

    void setupPush();
  }, [authUserId]);

  useEffect(() => {
    const onFocus = () => {
      if (authUserId) {
        void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [authUserId, queryClient]);

  return (
    <NotificationCtx.Provider
      value={{
        notifications: query.data?.notifications || [],
        unreadCount: query.data?.unreadCount || 0,
        refresh: () => {
          void queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
      }}
    >
      {children}
    </NotificationCtx.Provider>
  );
}

export const useNotifications = () => {
  const value = useContext(NotificationCtx);
  if (!value) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider",
    );
  }
  return value;
};
